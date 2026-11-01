import sys,os,glob,numpy as np
from PIL import Image
from scipy import ndimage
from rembg import remove,new_session
ses=new_session('isnet-general-use')
os.makedirs('sep',exist_ok=True)
ids=sys.argv[1].split(',') if len(sys.argv)>1 else [os.path.basename(f)[:-4] for f in sorted(glob.glob('sr_gen_x4v3/*.png'))]
for i in ids:
    im=Image.open('sr_gen_x4v3/%s.png'%i).convert('RGB')
    a=np.array(im).astype(np.float32); H,W,_=a.shape
    lum=a.mean(2)
    brd=np.concatenate([a[:8].reshape(-1,3),a[-8:].reshape(-1,3),a[:,:8].reshape(-1,3),a[:,-8:].reshape(-1,3)])
    bl=brd.mean(1); B=np.median(brd[bl>np.percentile(bl,40)],0)
    m=np.array(remove(im,session=ses,only_mask=True)).astype(np.float32)/255
    mx=a.max(2);mn=a.min(2);sat=(mx-mn)/np.maximum(mx,1)
    dif=np.abs(a-B).max(2)
    core=(m>0.5)|((sat>0.25)&(dif>40)&(m>0.15))|((mn<120)&(m>0.15))|(mx<60)
    core=ndimage.binary_opening(core,iterations=1)
    lab,k=ndimage.label(ndimage.binary_dilation(core,iterations=10))
    # escolhe componentes perto do centro
    cy,cx=H/2,W/2
    keep=np.zeros_like(core)
    best=None
    for j in range(1,k+1):
        ys,xs=np.nonzero(lab==j); n=len(ys)
        d=np.hypot(ys.mean()-cy,xs.mean()-cx)
        touch=(ys.min()<3)+(ys.max()>H-4)+(xs.min()<3)+(xs.max()>W-4)
        if n>H*W*0.02 and d<min(H,W)*0.30 and touch<2: keep|=(lab==j)
    obj=core&keep
    al=np.array(Image.open('al/%s.png'%i))[...,3].astype(np.float32)/255
    alb=al>(0.2 if i=="P08" else 0.5)
    bgl=(dif<26)&(sat<0.15)
    tira0=np.zeros((H,W),bool)
    if i=='P06':
        cor=(sat>0.30)&(dif>40)
        lc,kc=ndimage.label(cor); szc=ndimage.sum(cor,lc,range(1,kc+1))
        cor=np.isin(lc,[j+1 for j,z in enumerate(szc) if z>400])
        bulbo=lc==(int(np.argmax(szc))+1)
        yb=np.nonzero(bulbo.any(1))[0]; bc=(yb.min()+yb.max())/2; bh=yb.max()-yb.min()
        raios=np.zeros((H,W),bool)
        for j in range(1,kc+1):
            r_=lc==j
            if szc[j-1]>400 and not (r_&bulbo).any():
                if np.nonzero(r_)[0].mean()<bc-0.22*bh: raios|=r_
        nuv=ndimage.binary_fill_holes(obj)
        lab_,k_=ndimage.label(nuv)
        if k_>1:
            sz_=ndimage.sum(nuv,lab_,range(1,k_+1)); nuv=lab_==(int(np.argmax(sz_))+1)
        nuv=ndimage.gaussian_filter(nuv.astype(np.float32),16)>0.5
        disco=np.hypot(*np.mgrid[-30:31,-30:31])<=30
        nuv=ndimage.binary_opening(nuv,structure=disco)
        cols=np.nonzero(nuv.any(0))[0]
        top=np.full(W,np.nan); bot=np.full(W,np.nan)
        for x in cols:
            yc=np.nonzero(nuv[:,x])[0]; top[x]=yc.min(); bot[x]=yc.max()
        rb=np.full(W,-1.0)
        for x in range(W):
            yr=np.nonzero(raios[:,x])[0]
            if len(yr): rb[x]=yr.max()
        t=top.copy(); t[cols]=np.maximum(top[cols],rb[cols]+6)
        tv=t[cols]; tv=ndimage.gaussian_filter1d(tv,22,mode='nearest'); t[cols]=np.maximum(tv,rb[cols]+4)
        b=bot.copy(); b[cols]=ndimage.gaussian_filter1d(bot[cols],3,mode='nearest')-8
        yy0=np.mgrid[:H,:W][0]
        nv=np.zeros((H,W),bool); nv[:,cols]=(yy0[:,cols]>=t[cols][None,:])&(yy0[:,cols]<=b[cols][None,:])
        nv=ndimage.gaussian_filter(nv.astype(np.float32),2.5)>0.5
        obj=nv|ndimage.binary_dilation(cor,iterations=1)
    elif i!='B10':
        # (a) furos dentro do objeto que o recorte antigo diz serem objeto
        hol=ndimage.binary_fill_holes(obj)&~obj
        lh,kh=ndimage.label(hol)
        if kh:
            fr=ndimage.mean(alb.astype(np.float32),lh,range(1,kh+1))
            obj=obj|np.isin(lh,[j+1 for j,f in enumerate(fr) if f>=0.7])
        # (b) uniao com o recorte antigo (erodido 3px) para regioes abertas que faltaram
        obj=obj|ndimage.binary_erosion(alb,iterations=3)
        # (c) retira restos com cor de fundo onde o recorte antigo diz fundo
        fora=~ndimage.binary_dilation(al>0.08,iterations=4)
        tira0=fora&bgl
        obj=obj&~tira0
        obj=ndimage.binary_opening(obj,iterations=1)|ndimage.binary_erosion(alb,iterations=3)
    AL0={'M05'} 
    if i=='P10':
        yy1,xx1=np.mgrid[:H,:W]
        fora_p=(yy1>430)&(xx1>575-0.3*(yy1-500)+2)
        from PIL import ImageDraw as _D
        pp=Image.new('L',(W,H),0); _D.Draw(pp).polygon([(255,181),(642,200),(592,420),(575,500),(545,600),(530,650),(518,684),(500,692),(98,614)],fill=255)
        papel=np.array(pp)>0
        caneta=ndimage.binary_dilation((sat>0.30)&(dif>40),iterations=2)|ndimage.binary_dilation((mx<90),iterations=2)
        lc_,kc_=ndimage.label(caneta); szc_=ndimage.sum(caneta,lc_,range(1,kc_+1)); caneta=lc_==(int(np.argmax(szc_))+1)
        obj=papel|(obj&caneta)
        tira0=tira0|(~papel&~caneta)
    if i=='P08':
        from PIL import ImageDraw
        pg=Image.new('L',(W,H),0)
        # pagina direita: lombada (~355,565) -> topo (415,235) -> borda da capa teal (~680,280) -> (~615,605)
        ImageDraw.Draw(pg).polygon([(352,568),(372,420),(408,250),(430,262),(598,590),(604,606),(600,606)],fill=255)
        pg=np.array(pg)>0
        obj=obj|pg
    AL={'M05'}
    alE=np.zeros((H,W),np.float32)
    if i in AL:
        al=np.array(Image.open('al/%s.png'%i))[...,3].astype(np.float32)/255
        alb=al>0.5
        if i=='M05': alb=ndimage.binary_fill_holes(ndimage.binary_closing(alb,iterations=4))
        alb=ndimage.binary_erosion(alb,iterations=3)
        alE=ndimage.gaussian_filter(alb.astype(np.float32),0.8)*alb
        obj=obj|alb
    # alfa do objeto: mascara rembg suave restrita a regiao, mais nucleo
    reg=ndimage.binary_dilation(obj,iterations=6)&~tira0
    if i=='P06': reg=ndimage.binary_dilation(obj,iterations=1)
    ao=np.clip(np.maximum(m*reg,obj*1.0),0,1)
    ao=ndimage.gaussian_filter(ao,0.6)*reg
    ao=np.maximum(ao,ndimage.binary_erosion(obj,iterations=2)*1.0)
    ao=np.maximum(ao,alE)
    # sombra: deficit de luminancia sobre fundo, perto do objeto
    Bl=B.mean()
    dist=ndimage.distance_transform_edt(~obj)
    s=np.clip((Bl-lum-4)/(Bl-24),0,1)
    s=np.where(s<0.012,0,s)
    s*=np.clip((150-dist)/60,0,1)
    # afasta da borda do recorte
    yy,xx=np.mgrid[:H,:W]; e=np.minimum(np.minimum(yy,H-1-yy),np.minimum(xx,W-1-xx))
    s*=np.clip(e/30,0,1)
    s=ndimage.gaussian_filter(s,1.2)
    # so sombra conectada ao objeto
    lab2,k2=ndimage.label((s>0.03)|obj)
    ok=np.unique(lab2[obj]); ok=ok[ok>0]
    keep2=ndimage.binary_dilation(np.isin(lab2,ok),iterations=14)
    s=s*ndimage.gaussian_filter(keep2.astype(np.float32),5)
    oy=np.nonzero(obj.any(1))[0]; top,bot=oy.min(),oy.max(); hh=bot-top
    wv=np.clip((yy-(top+0.30*hh))/(0.30*hh),0,1)
    s=s*wv
    s=s*np.clip((dist-2)/4,0,1)
    s=np.maximum(s,ndimage.gaussian_filter(s,2.5)*np.clip(dist/2,0,1))
    K=np.array([28,25,30],np.float32)
    A=ao+(1-ao)*s
    F=(a-(1-ao[...,None])*B)/np.maximum(ao[...,None],1e-3)   # desmistura borda
    F=np.where(ao[...,None]>0.98,a,F)
    col=(ao[...,None]*np.clip(F,0,255)+((1-ao)*s)[...,None]*K)/np.maximum(A[...,None],1e-4)
    # limpeza: remove fragmentos (vizinhos) que tocam a faixa da borda ou estao longe
    labA,kA=ndimage.label(A>0.10)
    if kA>1:
        szA=ndimage.sum(np.ones_like(A),labA,range(1,kA+1)); mid=int(np.argmax(szA))+1
        mainc=labA==mid
        perto=ndimage.binary_dilation(mainc,iterations=40)
        band=np.zeros_like(mainc); band[:40]=1; band[-40:]=1; band[:,:60]=1; band[:,-60:]=1
        tira=np.zeros_like(mainc)
        for c in range(1,kA+1):
            if c==mid: continue
            r=labA==c
            if (r&band).any() or not (r&perto).any(): tira|=r
        tira=ndimage.binary_dilation(tira,iterations=8)&~ndimage.binary_dilation(mainc,iterations=2)
        A=A*(~tira)
    lab3,k3=ndimage.label(A>0.034)
    if k3>1:
        sz3=ndimage.sum(np.ones_like(A),lab3,range(1,k3+1)); m3=int(np.argmax(sz3))+1
        mx3=ndimage.maximum(A,lab3,range(1,k3+1))
        perto3=ndimage.binary_dilation(lab3==m3,iterations=40)
        band3=np.zeros_like(perto3); band3[:40]=1; band3[-40:]=1; band3[:,:60]=1; band3[:,-60:]=1
        for c in range(1,k3+1):
            if c==m3: continue
            r=lab3==c
            if mx3[c-1]<0.5 or (r&band3).any() or not (r&perto3).any(): A=A*(~ndimage.binary_dilation(r,iterations=4))
        A=np.where((A<0.034)&~ndimage.binary_dilation(lab3==m3,iterations=20),0,A)
    out=np.dstack([np.clip(col,0,255),A*255]).astype(np.uint8)
    o=Image.fromarray(out,'RGBA'); o.save('sep/%s.png'%i)
    Image.fromarray((obj*255).astype(np.uint8)).save('sep/%s_m.png'%i)
    print(i,B.astype(int),flush=True)
