import sys; sys.path.insert(0, '/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/tools')
from compose import *
OUT = '/home/claude/escadas-sc/design/flash_img/bio/'
HP = 'Human_physiology/Servier/'
def card(cid, src, crop, place, H, tgt, lab, **kw):
    L = layer(src, crop, place, **kw)
    t = L['T'](*tgt); l = L['T'](*lab) if lab[0] != 'c' else lab[1:]
    n = write(OUT + cid + '.svg', [L], t, l, H, title='Cartão ' + cid)
    print(cid, n // 1024, 'KB', 'alvo canvas', tuple(round(v) for v in t))
    return t
# ---- encéfalo (brain-2): posterior à esquerda (cerebelo), anterior à direita
BR = dict(src=HP + 'brain-2.svg', crop=None, place=(80, 12, 440), H=478)
card('bio-i01', tgt=(128, 292), lab=(-30, 345), **BR)            # cerebelo
card('bio-i02', tgt=(198, 335), lab=(330, 365), **BR)            # tronco encefálico
card('bio-i03', tgt=(358, 150), lab=(425, 70), **BR)             # lobo frontal
card('bio-i04', tgt=(180, 228), lab=(305, 318), **BR)            # lobo temporal
# ---- coração
HI = dict(src=HP + 'heart-interior-1.svg', crop=None, place=(120, 22, 360), H=500)
card('bio-i05', tgt=(70, 230), lab=(-70, 175), **HI)              # átrio direito
card('bio-i06', tgt=(178, 48), lab=(290, 25), **HI)               # aorta
card('bio-i07', tgt=(65, 110), lab=(-70, 60), **HI)               # veia cava superior
HC = dict(src=HP + 'heart-chambers-visible.svg', crop=None, place=(110, 12, 360), H=500)
card('bio-i08', tgt=(240, 295), lab=(375, 170), **HC)             # ventrículo esquerdo
# ---- sistema digestório (digestive-system-labeled, rótulos e linhas-guia removidos; recorte do abdome)
DG = dict(src=HP + 'digestive-system-labeled.svg', crop=(112, 250, 302, 462), place=(150, 10, 340), H=410, strip=('#b2b2b2',), mode='raster', pid='dg')
card('bio-i09', tgt=(165, 288), lab=(40, 262), **DG)             # fígado
card('bio-i10', tgt=(158, 321), lab=(40, 345), **DG)             # vesícula biliar
card('bio-i11', tgt=(238, 318), lab=(330, 285), **DG)            # estômago
card('bio-i12', tgt=(181, 372), lab=(40, 398), **DG)             # pâncreas
# ---- célula animal (cell-complete, rótulos e setas removidos)
CE = dict(src='Intracellular_components/Servier/cell-complete.svg', crop=(110, 15, 750, 565), place=(30, 46, 540), H=572, strip=('#939393',), mode='raster', pid='ce', rs=1.3, q=74)
card('bio-i13', tgt=(562, 256), lab=('c', 560, 26), **CE)            # mitocôndria
card('bio-i14', tgt=(345, 137), lab=('c', 215, 24), **CE)             # complexo golgiense
card('bio-i15', tgt=(318, 357), lab=('c', 110, 548), **CE)            # retículo endoplasmático rugoso
