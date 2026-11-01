"""objeto recortado (sem sombra) -> PNG com a sombra padrao (luz de frente), para ilustracoes. uso: ilu_sombra.py in.png out.png"""
import sys, numpy as np
from PIL import Image
sys.path.insert(0, __import__('os').path.dirname(__file__)); import post
post.S = 600
o = post._quadro(Image.open(sys.argv[1]).convert('RGBA'), 0.9)
A = np.array(o.getchannel('A')).astype(np.float32) / 255; sh = post._sombra_sintetica(A)
img = Image.fromarray(np.dstack([np.zeros((600, 600, 3), np.uint8), (sh * 255).astype(np.uint8)]), 'RGBA'); img.alpha_composite(o); img.save(sys.argv[2])
