import sys,json,torch,numpy as np,spandrel
from PIL import Image
torch.set_num_threads(2)
mod=sys.argv[1]; ids=sys.argv[2].split(',') if len(sys.argv)>2 else None
m=spandrel.ModelLoader().load_from_file('/home/claude/modelos/%s.pth'%mod).eval()
ref=Image.open('ref.png').convert('RGB'); cells=json.load(open('cells.json'))
import os; os.makedirs('sr_'+mod,exist_ok=True)
for i,(x0,y0,x1,y1) in cells.items():
    if ids and i not in ids: continue
    c=np.array(ref.crop((x0-12,y0-12,x1+12,y1+12))).astype(np.float32)/255
    t=torch.from_numpy(c).permute(2,0,1)[None]
    with torch.no_grad(): o=m(t)[0].clamp(0,1).permute(1,2,0).numpy()
    Image.fromarray((o*255+0.5).astype(np.uint8)).save('sr_%s/%s.png'%(mod,i)); print(i,flush=True)
