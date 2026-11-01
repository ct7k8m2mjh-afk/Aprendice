import sys,os,glob,json,numpy as np,cv2
from PIL import Image
from scipy import ndimage
SC='/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad'
os.makedirs('al',exist_ok=True)
ids=sys.argv[1].split(',') if len(sys.argv)>1 else [os.path.basename(f)[:-4] for f in sorted(glob.glob('sr_gen_x4v3/*.png'))]
res={}
for i in ids:
    tgt=np.array(Image.open('sr_gen_x4v3/%s.png'%i).convert('RGB')).astype(np.float32)
    H,W,_=tgt.shape
    f=SC+('/icref/por/up/obj_%s.png' if i[0]=='P' else '/icref/up/obj_%s.png')%i
    ob=Image.open(f).convert('RGBA'); ob=ob.crop(ob.getbbox())
    core=np.array(Image.open('sep/%s_m.png'%i))>127
    ys,xs=np.nonzero(core); bx=(xs.min(),ys.min(),xs.max(),ys.max())
    # escala inicial pela largura/altura do nucleo (max dos dois ajustes)
    s0=max((bx[2]-bx[0])/ob.width,(bx[3]-bx[1])/ob.height)
    obA=np.array(ob).astype(np.float32)/255
    def comp(A):  # objeto sobre branco, cinza
        return (A[...,:3]*A[...,3:]+ (1-A[...,3:]))
    src=comp(obA).mean(2)
    tg=(tgt.mean(2)/255)
    # warp inicial: escala s0, centro do bbox
    cxo,cyo=ob.width/2,ob.height/2; cxt,cyt=(bx[0]+bx[2])/2,(bx[1]+bx[3])/2
    M=np.array([[s0,0,cxt-s0*cxo],[0,s0,cyt-s0*cyo]],np.float32)
    best=None
    for mode in [cv2.MOTION_AFFINE]:
        Mi=M.copy()
        try:
            # ECC encontra warp de tg -> src; usamos src->tg invertendo papel: template=tg, input=src
            sb=cv2.GaussianBlur(src.astype(np.float32),(0,0),1.5); tb=cv2.GaussianBlur(tg.astype(np.float32),(0,0),1.5)
            cc,Mi=cv2.findTransformECC(tb,sb,cv2.invertAffineTransform(Mi).astype(np.float32),mode,(cv2.TERM_CRITERIA_EPS|cv2.TERM_CRITERIA_COUNT,300,1e-6),None,5)
            Mi=cv2.invertAffineTransform(Mi)
        except cv2.error as e:
            cc=-1; Mi=M
        best=(cc,Mi)
    cc,Mf=best
    A=cv2.warpAffine(obA,Mf,(W,H),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=0)
    Image.fromarray((A*255).astype(np.uint8),'RGBA').save('al/%s.png'%i)
    res[i]=[float(cc),Mf.tolist()]
    print(i,round(float(cc),4),np.round(Mf,3).tolist(),flush=True)
json.dump(res,open('al/res.json','w'))
