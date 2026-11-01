# P12.3 Modernismo de 30 e romance do Nordeste: chapeu de couro do sertao (vaqueiro/cangaceiro), aba da frente virada em meia-lua
# (Vidas Secas, Fabiano; o sertao do romance de 30). Revisao 31/10: copa mais alta e aba da frente bem levantada (antes ficava achatado),
# estrela de couro e moedas douradas na meia-lua, como nos chapeus de couro do Nordeste.
from _por import *
cena_p()
cou = ruido_cor('#7a4220', '#9c5a2b', 5, 0.5, bump=0.12)
aba = torno([(0.42, 0.0), (0.62, 0.0), (0.8, 0.05), (0.9, 0.14), (0.92, 0.17), (0.89, 0.18), (0.79, 0.09), (0.62, 0.045), (0.42, 0.045)], cou, seg=160)
def lev(a): return max(0.0, -math.sin(a)) ** 1.6
for v in aba.data.vertices:
    r = math.hypot(v.co.x, v.co.y); a = math.atan2(v.co.y, v.co.x)
    if r > 0.48:
        t = ((r - 0.48) / 0.44) ** 1.2 * lev(a)
        v.co.z += 0.85 * t                                  # aba da frente sobe quase vertical (meia-lua)
        k = 1 - 0.38 * t; v.co.x *= k; v.co.y *= k          # e encosta na copa
aba.modifiers.new('sd', 'SUBSURF').levels = 2
cop = torno([(0.0, 0.98), (0.18, 0.97), (0.33, 0.9), (0.42, 0.7), (0.45, 0.4), (0.46, 0.15), (0.47, 0.0)], cou, seg=128)
cop.modifiers.new('sd', 'SUBSURF').levels = 1
# vinco no topo da copa
cl = ruido_cor('#3e1e0c', '#5a2e16', 20, 0.6)
torno([(0.475, 0.04), (0.462, 0.2), (0.45, 0.2), (0.46, 0.04)], cl, seg=128)
# estrela de couro escuro costurada na frente da meia-lua
st = []
for i in range(10):
    a = math.pi / 2 + i * math.pi / 5; r = 0.2 if i % 2 == 0 else 0.085; st.append((r * math.cos(a), r * math.sin(a)))
s = placa(st, 0.025, cl, chanfro=0.007); s.location = (0, -0.665, 0.56); s.rotation_euler = (math.radians(74), 0, 0)
# moedas douradas ao longo da meia-lua
ouro = metal('#d4a52a', 0.25)
for k in range(9):
    a = math.radians(-160 + 140 * k / 8)
    r = 0.8; t = ((r - 0.48) / 0.44) ** 1.2 * lev(a); kk = 1 - 0.38 * t
    x, y, z = r * kk * math.cos(a), r * kk * math.sin(a), 0.1 + 0.85 * t + 0.02
    if abs(math.degrees(a) + 90) < 22: continue
    c = cilindro((x * 1.03, y * 1.03, z), 0.045, 0.012, ouro, chanfro=0.004)
    c.rotation_euler = (math.radians(70), 0, a + math.pi / 2)
render(saida('P12.3'), elev=20, azim=-33)
