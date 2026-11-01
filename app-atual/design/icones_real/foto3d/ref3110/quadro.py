import sys,os,glob,numpy as np
from PIL import Image
from scipy import ndimage
os.makedirs('final',exist_ok=True)
S=288; FIT=0.86
for f in sorted(glob.glob('sep/???.png')):
    i=os.path.basename(f)[:-4]
    im=Image.open(f).convert('RGBA'); A=np.array(im)[...,3]
    m=(np.array(Image.open('sep/%s_m.png'%i))>127)&(A>128)
    ys,xs=np.nonzero(m); ob=(xs.min(),ys.min(),xs.max()+1,ys.max()+1)
    w,h=ob[2]-ob[0],ob[3]-ob[1]; k=FIT*S/max(w,h)
    cx,cy=(ob[0]+ob[2])/2,(ob[1]+ob[3])/2
    tx,ty=S/2-cx*k,S/2-0.02*S-cy*k
    # mapeia a imagem inteira para o quadro (afim) em premultiplicado
    big=im.convert('RGBa')
    nw,nh=round(im.width*k),round(im.height*k)
    sm=big.resize((nw,nh),Image.LANCZOS,reducing_gap=3.0).convert('RGBA')
    mo=Image.fromarray((ndimage.binary_dilation(m,iterations=3)*255).astype(np.uint8)).resize((nw,nh),Image.BILINEAR)
    q=Image.new('RGBA',(S,S),(0,0,0,0)); q.alpha_composite(sm,(round(tx),round(ty))) if (round(tx)>=0 and round(ty)>=0) else None
    if round(tx)<0 or round(ty)<0:
        ox,oy=round(tx),round(ty); q.alpha_composite(sm.crop((max(0,-ox),max(0,-oy),nw,nh)),(max(0,ox),max(0,oy)))
    qm=Image.new('L',(S,S),0); qm.paste(mo,(round(tx),round(ty)))
    a=np.array(q).astype(np.float32); om=np.array(qm).astype(np.float32)/255
    yy,xx=np.mgrid[:S,:S]; e=np.minimum(np.minimum(yy,S-1-yy),np.minimum(xx,S-1-xx)).astype(np.float32)
    fade=np.clip((e-2)/18,0,1)
    a[...,3]=a[...,3]*(om+(1-om)*fade)
    Image.fromarray(a.astype(np.uint8),'RGBA').save('final/%s.png'%i)
    ys2,xs2=np.nonzero(a[...,3]>40)
    print(i,round(k,3),'obj', (int(xs2.min()),int(ys2.min()),int(xs2.max()),int(ys2.max())),end=' | ')
