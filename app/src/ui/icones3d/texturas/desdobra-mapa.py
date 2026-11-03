# Desdobra o mapa da referência (bussola.png) em textura plana 2048 px, painel a painel.
import numpy as np, cv2, sys
from PIL import Image, ImageFilter
S='/tmp/claude-0/-home-user-aprendice/aee5743b-68b8-515c-b692-c4a8e9011d85/scratchpad/'
REF='/home/user/aprendice/docs/referencias/icones3d/bussola.png'
OUT='/home/user/aprendice/app/src/ui/icones3d/texturas/'
im=Image.open(REF).convert('RGBA'); bg=Image.new('RGBA',im.size,'white'); bg.alpha_composite(im); src=bg.convert('RGB')
K=6  # superamostragem da fonte
big=np.asarray(src.resize((src.width*K,src.height*K),Image.LANCZOS)).astype(np.float32)
# máscara do que tapa o mapa (bússola, alfinete e sua base) em coords da fonte
m=Image.new('L',src.size,0)
from PIL import ImageDraw
d=ImageDraw.Draw(m)
d.ellipse((121-67,171-67,121+67,171+67),fill=255)    # bússola
d.ellipse((97,68,145,113),fill=255)                  # argola
d.rectangle((111,98,132,124),fill=255)               # haste
d.ellipse((185,12,251,84),fill=255)                  # cabeça do alfinete
d.polygon([(190,58),(246,58),(219,109)],fill=255)    # ponta
d.ellipse((201,95,235,115),fill=255)                 # base branca
mb=np.asarray(m.resize((src.width*K,src.height*K),Image.NEAREST)).astype(np.float32)/255
# bordas da área colorida na fonte (topo e base), com nós em u (fração da folha); dobras em u=0.351 e 0.622
U1,U2=0.338,0.668
TOPO=[(0,(67,55)),(0.2,(111,54)),(U1,(143,40)),(0.385,(151,44)),(0.431,(167,54)),(0.493,(183,61)),(U2,(228,74)),(0.82,(258,67)),(1,(291,61))]
BASE=[(0,(35,180)),(U1,(122,173)),(U2,(215,196)),(1,(267,204))]
def interp(K_,u):
  us=np.array([k[0] for k in K_]); xs=np.array([k[1][0] for k in K_]); ys=np.array([k[1][1] for k in K_])
  return np.interp(u,us,xs),np.interp(u,us,ys)
TW,TH=2048,1356; MG=int(0.042*TW)
CW,CH=TW-2*MG,TH-2*MG
u=(np.arange(CW)+0.5)/CW; v=(np.arange(CH)+0.5)/CH
tx,ty=interp(TOPO,u); bx,by=interp(BASE,u)
V_,U_=np.meshgrid(v,np.arange(CW),indexing='ij')
mx=((tx[None,:]*(1-v[:,None])+bx[None,:]*v[:,None])*K).astype(np.float32)
my=((ty[None,:]*(1-v[:,None])+by[None,:]*v[:,None])*K).astype(np.float32)
cor=cv2.remap(big,mx,my,cv2.INTER_CUBIC,borderMode=cv2.BORDER_REPLICATE)
tapa=cv2.remap(mb,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=1)
tapa=(tapa>0.02).astype(np.uint8)
tapa=cv2.dilate(tapa,np.ones((21,21),np.uint8))
# preenche cada buraco espelhando o terreno vizinho por inteiro (sem listras): o da bússola espelha
# horizontalmente a partir da borda direita; o do alfinete espelha verticalmente a partir de baixo
# buracos: cor de fundo contínua (inpaint em baixa resolução, sem emendas) + detalhe fino (curvas de nível)
# clonado por translação de uma área vizinha; o do alfinete espelha o terreno de baixo
q=8; small=cv2.resize(np.clip(cor,0,255).astype(np.uint8),(CW//q,CH//q),interpolation=cv2.INTER_AREA)
ms=cv2.resize(tapa,(CW//q,CH//q),interpolation=cv2.INTER_NEAREST); ms=cv2.dilate(ms,np.ones((3,3),np.uint8))
low=cv2.inpaint(small,ms,6,cv2.INPAINT_TELEA)
low=cv2.GaussianBlur(cv2.resize(low,(CW,CH),interpolation=cv2.INTER_CUBIC).astype(np.float32),(0,0),10)
base=cv2.GaussianBlur(cor,(0,0),14); hf=cor-base
hff=hf.copy(); falta=tapa.astype(bool).copy()
for dx,dy in [(0.40,0),(0.17,0),(0.34,0.05),(0.30,-0.12),(-0.36,0),(0,0.33),(0,-0.3),(0.2,0.3),(-0.2,0.3),(0.5,-0.2)]:
  dx=int(dx*CW); dy=int(dy*CH)
  ys,xs=np.where(falta); sx=xs+dx; sy=ys+dy
  ok=(sx>=0)&(sx<CW)&(sy>=0)&(sy<CH)
  ys,xs,sx,sy=ys[ok],xs[ok],sx[ok],sy[ok]
  ok=~falta[sy,sx]; hff[ys[ok],xs[ok]]=hff[sy[ok],sx[ok]]; falta[ys[ok],xs[ok]]=False
fill=low+hff*0.9
al=np.clip(cv2.GaussianBlur(tapa.astype(np.float32),(0,0),14)*1.6,0,1)[...,None]
fill=cor*(1-al)+fill*al
fill8=np.clip(fill,0,255).astype(np.uint8)
img=Image.fromarray(fill8).filter(ImageFilter.UnsharpMask(radius=5,percent=110,threshold=2))
folha=Image.new('RGB',(TW,TH),(255,255,253)); folha.paste(img,(MG,MG))
folha.save(OUT+'mapa.webp',quality=90); folha.save(S+'mapa_flat.png')
print('ok')

# ponto da base do alfinete na referência -> (u,v) da folha
d2=(mx/K-218)**2+(my/K-105)**2; iy,ix=np.unravel_index(np.argmin(d2),d2.shape)
print('alfinete u,v (área colorida)',ix/CW,iy/CH,' folha',(ix+MG)/TW,(iy+MG)/TH)
# relevo (bump): nível hipsométrico pela matiz, em degraus macios; rio rebaixado
hsv=cv2.cvtColor(np.asarray(folha),cv2.COLOR_RGB2HSV_FULL).astype(np.float32)
H=hsv[...,0]*360/256; Sa=hsv[...,1]/255
lv=np.clip((125-H)/90,0,1)                 # verde 0 .. laranja 1
agua=np.clip((H-150)/30,0,1)*np.clip((Sa-0.3)/0.2,0,1)
lv=np.round(lv*12)/12
lv=cv2.GaussianBlur(lv,(0,0),4)
h=0.25+0.6*lv-0.22*cv2.GaussianBlur(agua,(0,0),4)
h[Sa<0.12]=0.2
Image.fromarray(np.clip(h*255,0,255).astype(np.uint8)).save(OUT+'mapa-relevo.webp',quality=92)
