from _mat import *
cena()
# pecas de madeira de jogo de letras num suporte formando 2x + 1 = 7 (solucao x = 3)
mad = madeira('#efd3a0', escala=14, rugos=0.45); sup = madeira('#9a6235', escala=10, rugos=0.4)
s = 0.34; gap = 0.02; car = ['2', 'x', '+', '1', '=', '7']
n = len(car); Ltot = n * (s + gap)
objs = [caixa((0, 0.06, 0.05), (Ltot + 0.12, 0.42, 0.1), sup, chanfro=0.02),
        caixa((0, 0.24, 0.17), (Ltot + 0.12, 0.08, 0.34), sup, chanfro=0.02, rot=(R(-12), 0, 0))]
for k, ch in enumerate(car):
    x = -Ltot / 2 + (k + 0.5) * (s + gap)
    t = caixa((0, 0, 0), (s, 0.08, s), mad, chanfro=0.02)
    fp = FS if ch == 'x' else FB
    d = decal(ch, (0, -0.0415, 0.0), 0.2, cor_txt=(30, 24, 20, 255), fonte_p=fp, rot=(R(90), 0, 0), nome='M04.1_%d' % k)
    objs.append(grupo([t, d], loc=(x, 0.12, 0.1 + s / 2 + 0.005), rot=(R(-12), 0, 0)))
grupo(objs, rot=(0, 0, R(-36)))
fim('M04.1', elev=32, azim=-8)
