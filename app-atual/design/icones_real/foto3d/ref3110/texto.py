"""Corrige textos deformados pelo ampliador (os da propria referencia ja eram ilegiveis):
calculadora M01, cronometro Q08, balanca Q04. Roda sobre sep/<ID>.png (4x) antes do quadro."""
import numpy as np, cv2, math, sys
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage
FB='/usr/share/fonts/opentype/inter/Inter-Bold.otf'
FS='/usr/share/fonts/opentype/inter/Inter-SemiBold.otf'

def rotulo(txt, font, h_px, cor, ang, ss=4):
    f=ImageFont.truetype(font, int(h_px*ss*1.38))
    bb=f.getbbox(txt); w,h=bb[2]-bb[0], bb[3]-bb[1]
    im=Image.new('L',(w+8*ss,h+8*ss),0); ImageDraw.Draw(im).text((4*ss-bb[0],4*ss-bb[1]),txt,font=f,fill=255)
    im=im.rotate(ang,resample=Image.BICUBIC,expand=True)
    im=im.resize((max(1,im.width//ss),max(1,im.height//ss)),Image.LANCZOS)
    return np.array(im).astype(np.float32)/255

def cola(rgb, m, cx, cy, cor):
    h,w=m.shape; x0=int(round(cx-w/2)); y0=int(round(cy-h/2))
    sub=rgb[y0:y0+h, x0:x0+w]; mm=m[:sub.shape[0],:sub.shape[1]][...,None]
    rgb[y0:y0+h, x0:x0+w]=sub*(1-mm)+np.array(cor,np.float32)*mm

def apaga(rgb, mask, r=4):
    u8=np.clip(rgb,0,255).astype(np.uint8)
    return cv2.inpaint(u8, (ndimage.binary_dilation(mask,iterations=2)*255).astype(np.uint8), r, cv2.INPAINT_TELEA).astype(np.float32)

def calc(i='M01'):
    a=np.array(Image.open('sep/%s.png'%i)).astype(np.float32); rgb=a[...,:3]; A=a[...,3]
    lum=rgb.mean(2); mx=rgb.max(2); mn=rgb.min(2); sat=(mx-mn)/np.maximum(mx,1)
    key=ndimage.binary_fill_holes(ndimage.binary_opening((lum>150)&(sat<0.15)&(A>230),iterations=2))
    lab,k=ndimage.label(key); teclas=[]
    for j in range(1,k+1):
        r=lab==j; n=r.sum()
        if 800<n<9000:
            ys,xs=np.nonzero(r); teclas.append((xs.mean(),ys.mean(),r,lum[r].mean()))
    org=(sat>0.5)&(rgb[...,0]>200)&(rgb[...,2]<100); org=ndimage.binary_fill_holes(ndimage.binary_closing(org,iterations=3))
    lo,ko=ndimage.label(org); szo=ndimage.sum(org,lo,range(1,ko+1)); org=lo==(int(np.argmax(szo))+1)
    ys,xs=np.nonzero(org); teclas.append((xs.mean(),ys.mean(),org,-1))
    # inclinacao das fileiras
    sl=0.135
    teclas.sort(key=lambda t:(t[1]-sl*t[0]))
    rows=[teclas[q:q+4] for q in range(0,16,4)]
    LAY=[['7','8','9','÷'],['4','5','6','×'],['1','2','3','−'],['0',',','=','+']]
    ang=-math.degrees(math.atan(sl))
    for r_,lay in zip(rows,LAY):
        r_.sort(key=lambda t:t[0])
        for (cx,cy,r,lm),t in zip(r_,lay):
            ys,xs=np.nonzero(r); hk=ys.max()-ys.min()
            base=np.median(lum[r]) if lm>0 else None
            mio=ndimage.binary_erosion(r,iterations=7)
            if lm>0: gl=mio&(np.abs(lum-np.median(lum[r]))>(22 if lm<215 else 40))
            else: gl=mio&(rgb[...,1]>150)  # marca clara na laranja
            rgb=apaga(rgb,gl)
            cor=(46,46,52) if lm>0 else (255,250,240)
            m=rotulo(t,FB,hk*0.40,cor,ang)
            cola(rgb,m,cx-1,cy-hk*0.06,cor)
    # visor: 3,1416
    R_,G_,B_=rgb[...,0],rgb[...,1],rgb[...,2]
    vis=(G_>R_+8)&(G_>B_+20)&(G_>150); vis=ndimage.binary_closing(vis,iterations=4)
    lv,kv=ndimage.label(vis); szv=ndimage.sum(vis,lv,range(1,kv+1)); vis=ndimage.binary_fill_holes(lv==(int(np.argmax(szv))+1))
    mio=ndimage.binary_erosion(vis,iterations=6)
    lumv=rgb.mean(2); glv=mio&(lumv<np.median(lumv[mio])-30)
    ys,xs=np.nonzero(glv); gx0,gx1,gy0,gy1=xs.min(),xs.max(),ys.min(),ys.max()
    fill=rgb.copy(); vk=mio&~ndimage.binary_dilation(glv,iterations=3); wk=ndimage.gaussian_filter(vk.astype(np.float32),10)
    for q in range(3): fill[...,q]=ndimage.gaussian_filter(rgb[...,q]*vk,10)/np.maximum(wk,1e-3)
    w=(ndimage.gaussian_filter(ndimage.binary_dilation(glv,iterations=3).astype(np.float32),1.2)*mio)[...,None]
    rgb=rgb*(1-w)+fill*w
    corv=(22,28,24)
    m=rotulo('3,1416',FB,(gy1-gy0)*0.62,corv,ang)
    if m.shape[1]>(gx1-gx0)*1.02: m=rotulo('3,1416',FB,(gy1-gy0)*0.62*(gx1-gx0)*1.02/m.shape[1],corv,ang)
    cola(rgb,m,(gx0+gx1)/2,(gy0+gy1)/2,corv)
    a[...,:3]=rgb; Image.fromarray(np.clip(a,0,255).astype(np.uint8),'RGBA').save('sep/%s.png'%i)

def crono(i='Q08'):
    a=np.array(Image.open('sep/%s.png'%i)).astype(np.float32); rgb=a[...,:3]
    lum=rgb.mean(2); mx=rgb.max(2); mn=rgb.min(2); sat=(mx-mn)/np.maximum(mx,1)
    red=(sat>0.5)&(rgb[...,0]>150)&(rgb[...,1]<90)
    lab,k=ndimage.label(red); cand=[]
    for j in range(1,k+1):
        r=lab==j; n=r.sum()
        if 60<n<1500: ys,xs=np.nonzero(r); cand.append((n,xs.mean(),ys.mean()))
    _,cx,cy=max(cand)
    yy,xx=np.mgrid[:a.shape[0],:a.shape[1]]; rr=np.hypot(xx-cx,yy-cy)
    gl=(rr>97)&(rr<149)&(lum<235)&(sat<0.35)
    glD=ndimage.binary_dilation(gl,iterations=3)
    ring=(rr<151)
    prof=np.zeros((160,3),np.float32)
    for q in range(0,160):
        sel=(rr>=q-1.5)&(rr<q+1.5)&~glD&(sat<0.25)&(lum>200)
        prof[q]=np.median(rgb[sel],0) if sel.sum()>8 else (prof[q-1] if q else np.array([250,250,250],np.float32))
    for q in range(3): prof[:,q]=ndimage.uniform_filter1d(prof[:,q],15)
    pr=prof[np.clip(rr,0,159).astype(int)]
    vv=(sat>0.15)&(rgb[...,0]>rgb[...,1]+25)&(rr<104); lv,kv=ndimage.label(ndimage.binary_dilation(vv,iterations=2))
    keep=ndimage.binary_dilation((lv==lv[int(round(cy)),int(round(cx))])&(lv>0),iterations=2)
    w=np.clip((151-rr)/3,0,1)*(rr<151)
    w=w*(1-ndimage.gaussian_filter(keep.astype(np.float32),1.2))
    w=w[...,None]
    rgb=rgb*(1-w)+pr*w
    for q in range(12):
        t=math.radians(90-30*q); lab_='60' if q==0 else str(5*q)
        m=rotulo(lab_,FB,21,(34,34,40),0)
        cola(rgb,m,cx+124*math.cos(t),cy-124*math.sin(t),(34,34,40))
    a[...,:3]=rgb; Image.fromarray(np.clip(a,0,255).astype(np.uint8),'RGBA').save('sep/%s.png'%i)

def balanca(i='Q04'):
    a=np.array(Image.open('sep/%s.png'%i)).astype(np.float32); rgb=a[...,:3]
    R,G,B=rgb[...,0],rgb[...,1],rgb[...,2]
    verde=(G>R+40)&(G>B+25)&(G>120)
    verde=ndimage.binary_closing(verde,iterations=4)
    lv,kv=ndimage.label(verde); sz=ndimage.sum(verde,lv,range(1,kv+1)); v=lv==(int(np.argmax(sz))+1)
    tela=ndimage.binary_fill_holes(v)
    ys,xs=np.nonzero(tela); x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
    mio=ndimage.binary_erosion(tela,iterations=4)
    gl=mio&~v
    lum=rgb.mean(2); gl=gl|(mio&(lum<np.median(lum[v])-30))
    # repinta a tela com gradiente liso por coluna/linha (mediana do verde)
    fill=rgb.copy()
    yy,xx=np.mgrid[:a.shape[0],:a.shape[1]]
    base=np.median(rgb[v&~ndimage.binary_dilation(gl,iterations=3)],0)
    # leve gradiente vertical medido nas bordas da tela
    for q in range(3):
        top=np.median(rgb[v&(yy<y0+(y1-y0)*0.3)][:,q]); bot=np.median(rgb[v&(yy>y0+(y1-y0)*0.7)][:,q])
        fill[...,q]=top+(bot-top)*np.clip((yy-y0)/max(y1-y0,1),0,1)
    w=ndimage.gaussian_filter(mio.astype(np.float32),1.0)[...,None]
    rgb=rgb*(1-w)+fill*w
    hgt=(y1-y0)*0.50
    m=rotulo('0,000 g',FS,hgt,(24,40,28),0)
    if m.shape[1]>(x1-x0)*0.80: m=rotulo('0,000 g',FS,hgt*(x1-x0)*0.80/m.shape[1],(24,40,28),0)
    cola(rgb,m,(x0+x1)/2,(y0+y1)/2,(24,40,28))
    a[...,:3]=rgb; Image.fromarray(np.clip(a,0,255).astype(np.uint8),'RGBA').save('sep/%s.png'%i)
    print('tela',x0,x1,y0,y1)

def trigo(i='M10'):
    a=np.array(Image.open('sep/%s.png'%i)).astype(np.float32); rgb=a[...,:3]; A=a[...,3]
    H,W=A.shape; lum=rgb.mean(2); sat=(rgb.max(2)-rgb.min(2))/np.maximum(rgb.max(2),1)
    cx,cy,R=354.4,381.0,216.8
    yy,xx=np.mgrid[:H,:W]; rr=np.hypot(xx-cx,yy-cy)
    eixo=(np.abs(xx-354.5)<=5.5)|(np.abs(yy-381)<=4.5)
    dent=rr<R-5.5
    lim=dent&~eixo
    # fundo liso: superficie quadratica ajustada no papel limpo
    marca=ndimage.binary_dilation((lum<200)|(sat>0.25),iterations=6)
    ok=dent&~marca&(A>250)
    X=np.stack([np.ones(ok.sum()),xx[ok],yy[ok],xx[ok]**2,yy[ok]**2,xx[ok]*yy[ok]],1)
    Xa=np.stack([np.ones(H*W),xx.ravel(),yy.ravel(),xx.ravel()**2,yy.ravel()**2,(xx*yy).ravel()],1)
    fundo=np.zeros_like(rgb)
    for q in range(3):
        c,*_=np.linalg.lstsq(X,rgb[...,q][ok],rcond=None); fundo[...,q]=(Xa@c).reshape(H,W)
    w=ndimage.gaussian_filter(lim.astype(np.float32),0.8)[...,None]*(rr<R-3)[...,None]
    rgb=rgb*(1-w)+fundo*w
    # ponto vermelho extra sobre o anel
    red=(sat>0.35)&(rgb[...,0]>rgb[...,2]+40)&(np.abs(rr-R)<16)
    red=ndimage.binary_dilation(red,iterations=3)
    if red.any():
        anel_cor=np.median(rgb[(np.abs(rr-R)<2)&(lum<90)&~red],0)
        fora=np.median(rgb[(rr>R+8)&(rr<R+14)&(A>250)&~red],0)
        dentro=fundo
        k=np.clip(1-(np.abs(rr-R)-3.0)/1.5,0,1)[...,None]
        alvo=np.where((rr<R)[...,None],dentro,fora[None,None,:])*(1-k)+anel_cor*k
        rgb=np.where((red&(rr<R+4))[...,None],alvo,rgb)
        reg=ndimage.binary_dilation(red&(rr>=R+4),iterations=3)&(rr>=R+4)
        ang=np.degrees(np.arctan2(cy-yy,xx-cx))
        ys_,xs_=np.nonzero(reg)
        def amostra(rv,av):
            t=np.radians(av); x=np.clip(np.round(cx+rv*np.cos(t)).astype(int),0,W-1); y=np.clip(np.round(cy-rv*np.sin(t)).astype(int),0,H-1); return rgb[y,x]
        r_=rr[ys_,xs_]; a_=ang[ys_,xs_]; a0,a1=16.0,40.0
        u=np.clip((a_-a0)/(a1-a0),0,1)[:,None]
        novo=amostra(r_,a0)*(1-u)+amostra(r_,a1)*u
        rgb[ys_,xs_]=novo
    # restos coloridos sobre os eixos -> cor do eixo
    cor_eixo=np.median(rgb[eixo&dent&(lum<80)&(sat<0.2)],0)
    eixo2=(np.abs(xx-354.5)<=10)|(np.abs(yy-381)<=10)
    lixo=eixo2&(rr<R-5)&ndimage.binary_dilation((sat>0.25),iterations=2)
    rgb=np.where(lixo[...,None],np.where(((np.abs(xx-354.5)<=4)|(np.abs(yy-381)<=3.5))[...,None],cor_eixo,fundo),rgb)
    # redesenha o arco do anel no setor do ponto removido
    ss=4; ov0=Image.new('RGBA',(W*ss,H*ss),(0,0,0,0)); d0=ImageDraw.Draw(ov0)
    anel=np.median(rgb[(np.abs(rr-R)<1.5)&(lum<90)],0)
    Ro=217.2+3.75; d0.arc([((cx-Ro)*ss,(cy-Ro)*ss),((cx+Ro)*ss,(cy+Ro)*ss)],start=-36,end=-19,fill=(*[int(v) for v in anel],255),width=int(7.5*ss))
    ov0=ov0.resize((W,H),Image.LANCZOS); o0=np.array(ov0).astype(np.float32)/255
    seto=((np.degrees(np.arctan2(cy-yy,xx-cx))>20.5)&(np.degrees(np.arctan2(cy-yy,xx-cx))<34.5)&(np.abs(rr-217.2)<13))
    lim2=seto&(np.abs(rr-R)>=0)
    base=np.where((rr<R)[...,None],fundo,rgb)
    rgb=np.where(lim2[...,None],base,rgb)
    rgb=rgb*(1-o0[...,3:])+o0[...,:3]*255*o0[...,3:]
    th0=math.radians(40); px0=cx+R*math.cos(th0)
    faixa=(np.abs(yy-381)<=8)&(xx>px0+6)&(xx<cx+217.2-8)
    rgb=np.where(faixa[...,None],fundo,rgb)
    ov1=Image.new('RGBA',(W*ss,H*ss),(0,0,0,0)); ImageDraw.Draw(ov1).line([((px0+4)*ss,381*ss),((cx+217.2-2)*ss,381*ss)],fill=(*[int(v) for v in cor_eixo],255),width=7*ss)
    o1=np.array(ov1.resize((W,H),Image.LANCZOS)).astype(np.float32)/255; rgb=rgb*(1-o1[...,3:])+o1[...,:3]*255*o1[...,3:]
    # desenho novo (supersample 4x)
    ss=4; ov=Image.new('RGBA',(W*ss,H*ss),(0,0,0,0)); d=ImageDraw.Draw(ov)
    th=math.radians(40); px,py=cx+R*math.cos(th),cy-R*math.sin(th)
    P=lambda x,y:(x*ss,y*ss)
    AZ=(29,78,216,255); VM=(205,35,45,255); PT=(30,32,38,255)
    def tracejado(x0,y0,x1,y1,cor,wd,on=10,off=8):
        L=math.hypot(x1-x0,y1-y0); n=int(L//(on+off))+1
        for k in range(n):
            t0=k*(on+off)/L; t1=min(1,(k*(on+off)+on)/L)
            d.line([P(x0+(x1-x0)*t0,y0+(y1-y0)*t0),P(x0+(x1-x0)*t1,y0+(y1-y0)*t1)],fill=cor,width=wd*ss)
    tracejado(px,py,cx,py,(*AZ[:3],220),6,on=13,off=9); tracejado(px,py,px,cy,(*VM[:3],220),6,on=13,off=9)
    d.line([P(cx,cy),P(cx,py)],fill=AZ,width=13*ss)
    d.line([P(cx,cy),P(px,cy)],fill=VM,width=13*ss)
    d.line([P(cx,cy),P(px,py)],fill=PT,width=8*ss)
    ra=52; d.arc([P(cx-ra,cy-ra),P(cx+ra,cy+ra)],start=-40,end=0,fill=PT,width=6*ss)
    rp=13; d.ellipse([P(px-rp,py-rp),P(px+rp,py+rp)],fill=VM)
    rp=7; d.ellipse([P(cx-rp,cy-rp),P(cx+rp,cy+rp)],fill=PT)
    ov=ov.resize((W,H),Image.LANCZOS)
    o=np.array(ov).astype(np.float32)/255; rgb=rgb*(1-o[...,3:])+o[...,:3]*255*o[...,3:]
    def txt(t,cor,hpx,x,y,anc):
        m=rotulo(t,FB,hpx,cor,0); h,w=m.shape
        if anc=='r': x=x-w/2
        if anc=='l': x=x+w/2
        cola(rgb,m,x,y,cor)
    txt('sen θ',AZ[:3],44,cx-16,(cy+py)/2,'r')
    txt('cos θ',VM[:3],44,(cx+px)/2,cy+46,'c')
    txt('θ',PT[:3],34,cx+70*math.cos(math.radians(20)),cy-70*math.sin(math.radians(20)),'c')
    a[...,:3]=rgb; Image.fromarray(np.clip(a,0,255).astype(np.uint8),'RGBA').save('sep/%s.png'%i)

def revisao(i='P10'):
    a=np.array(Image.open('sep/%s.png'%i)).astype(np.float32); rgb=a[...,:3]; A=a[...,3]; H,W=A.shape
    lum=rgb.mean(2); sat=(rgb.max(2)-rgb.min(2))/np.maximum(rgb.max(2),1)
    red=(sat>0.35)&(rgb[...,0]>rgb[...,1]+50)&(A>200)
    lab,k=ndimage.label(red); sz=ndimage.sum(red,lab,range(1,k+1)); pen=lab==(int(np.argmax(sz))+1)
    pen=ndimage.binary_fill_holes(ndimage.binary_closing(pen|((lum<120)&ndimage.binary_dilation(pen,iterations=30)),iterations=3))
    # pen tip (white/grey cone + black point) next to the red body
    from PIL import ImageDraw as D
    pt=Image.new('L',(W,H),0); D.Draw(pt).polygon([(430,520),(492,556),(452,618),(408,612)],fill=255)
    penD=ndimage.binary_dilation(pen,iterations=4)|(np.array(pt)>0)
    yy,xx=np.mgrid[:H,:W]; m=0.14
    bs=[165+43.5*k for k in range(9)]
    xl=[274-15.1*k for k in range(9)]
    xr=[556-7*k for k in range(7)]+[412,330]
    lin=np.zeros((H,W),bool)
    face=np.zeros((H,W),bool)
    from PIL import ImageDraw as D
    fm=Image.new('L',(W,H),0); D.Draw(fm).polygon([(xl[0]-22,bs[0]+m*(xl[0]-22)-24),(xr[0]+26,bs[0]+m*(xr[0]+26)-24),(xr[0]+26,bs[8]+m*(xr[0]+26)+14),(xl[8]-22,bs[8]+m*(xl[8]-22)+14)],fill=255)
    borda=(sat>0.17)&(lum>160)&~ndimage.binary_dilation(red&~pen,iterations=6)
    borda=ndimage.binary_opening(borda,iterations=2)
    alvo=~ndimage.binary_dilation(borda,iterations=1)
    face=(np.array(fm)>0)&(A>250)&~penD&alvo
    face=ndimage.binary_opening(face,iterations=2)
    dirx,diry=430-650,590-270
    face&=((xx-650)*diry-(yy-270)*dirx)<0
    # paper fill (quadratic)
    ok=face&(lum>200)&(sat<0.12)&~ndimage.binary_dilation((lum<200)|(sat>0.2),iterations=5)
    papel=(A>250)&~penD&(lum>200)&(sat<0.14)&~ndimage.binary_dilation((lum<200)|(sat>0.2),iterations=5)
    fundo=rgb.copy(); wk=ndimage.gaussian_filter(papel.astype(np.float32),14)
    for q in range(3): fundo[...,q]=np.where(wk>1e-3,ndimage.gaussian_filter(rgb[...,q]*papel,14)/np.maximum(wk,1e-3),rgb[...,q])
    w=np.minimum(ndimage.gaussian_filter(face.astype(np.float32),3.0)*2,1)*face
    w=w[...,None]
    rgb=rgb*(1-w)+fundo*w
    corl=(150,139,135)
    ss=4; ov=Image.new('RGBA',(W*ss,H*ss),(0,0,0,0)); d=D.Draw(ov)
    for b,l,r in zip(bs,xl,xr):
        d.line([(l*ss,(b+m*l)*ss),(r*ss,(b+m*r)*ss)],fill=(*corl,240),width=int(6.5*ss))
        for x in (l,r):
            y=b+m*x; d.ellipse([((x-3.25)*ss,(y-3.25)*ss),((x+3.25)*ss,(y+3.25)*ss)],fill=(*corl,240))
    VM=(208,36,36,255); wd=int(9*ss)
    # circulo em volta de um trecho (linha 3)
    cx,cy=432,bs[2]+m*432; rx,ry=66,26; t0=math.atan(m)
    pts=[]
    for k in range(0,96):
        t=math.radians(-30+k*4)
        x=rx*math.cos(t); y=ry*math.sin(t)*(1+0.04*math.sin(3*t))
        pts.append(((cx+x*math.cos(t0)-y*math.sin(t0))*ss,(cy+x*math.sin(t0)+y*math.cos(t0))*ss))
    d.line(pts,fill=VM,width=wd,joint='curve')
    # sinal de insercao (linha 6)
    x0=318; y0=bs[5]+m*x0
    d.line([((x0-17)*ss,(y0+28)*ss),(x0*ss,(y0+6)*ss),((x0+17)*ss,(y0+28.5)*ss)],fill=VM,width=wd,joint='curve')
    # visto ao fim da ultima linha
    x0=362; y0=bs[8]+m*x0-6
    d.line([((x0-18)*ss,(y0-8)*ss),((x0-4)*ss,(y0+8)*ss),((x0+28)*ss,(y0-30)*ss)],fill=VM,width=wd,joint='curve')
    ov=np.array(ov.resize((W,H),Image.LANCZOS)).astype(np.float32)/255
    ov[...,3]*=(~penD)
    rgb=rgb*(1-ov[...,3:])+ov[...,:3]*255*ov[...,3:]
    a[...,:3]=rgb; Image.fromarray(np.clip(a,0,255).astype(np.uint8),'RGBA').save('sep/%s.png'%i)

if __name__=='__main__':
    for q in sys.argv[1:]:
        {'M01':calc,'Q08':crono,'Q04':balanca,'M10':trigo,'P10':revisao}[q]()
