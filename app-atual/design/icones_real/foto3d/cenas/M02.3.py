from _mat import *
cena()
# mapa dobrado em sanfona com escala grafica (medida no papel x medida real) e um alfinete
# revisao 31/10: cores do mapa mais saturadas (verde, azul, laranja), escala grafica maior, papel mais grosso e alfinete maior
W, H = 1000, 720
im, d = tex('mapa', W, H, (246, 232, 190, 255))
d.polygon([(0, 0), (380, 0), (330, 200), (120, 260), (0, 230)], fill=(96, 184, 84, 255))
d.polygon([(640, 420), (1000, 380), (1000, 720), (720, 720)], fill=(96, 184, 84, 255))
d.line([(0, 470), (200, 430), (380, 470), (560, 390), (760, 330), (1000, 300)], fill=(36, 128, 230, 255), width=46, joint='curve')
for pts in ([(0, 330), (1000, 210)], [(470, 0), (520, 720)], [(0, 640), (520, 560), (1000, 600)], [(760, 0), (820, 330)]):
    d.line(pts, fill=(255, 255, 255, 255), width=28); d.line(pts, fill=(240, 120, 30, 255), width=14)
for (x, y) in ((150, 520), (260, 560), (640, 120), (880, 140), (300, 330), (600, 260)):
    d.rectangle((x, y, x + 46, y + 34), fill=(200, 120, 100, 255))
# escala grafica 0 1 2 km
x0, y0, s = 560, 640, 150
d.rectangle((x0 - 30, y0 - 75, x0 + 2 * s + 110, y0 + 48), fill=(255, 255, 255, 255), outline=(30, 30, 30, 255), width=3)
for k in range(2):
    d.rectangle((x0 + k * s, y0, x0 + (k + 1) * s, y0 + 28), fill=(30, 30, 30, 255) if k == 0 else (255, 255, 255, 255), outline=(30, 30, 30, 255), width=3)
ft = fonte(FB, 42)
for k, t in enumerate(['0', '1', '2 km']): d.text((x0 + k * s, y0 - 8), t, font=ft, fill=(30, 30, 30, 255), anchor='ls' if k == 2 else 'ms')
mt = img_mat(salva(im, 'M02.3_mapa'), rugos=0.6, coat=0.05)
# malha sanfonada com 4 paineis
import bmesh
n = 4; pw = 2.0 / n; hgt = 1.44; zs = [0, 0.16, 0, 0.16, 0]
me = bpy.data.meshes.new('mapa'); bm = bmesh.new(); uv = bm.loops.layers.uv.new()
vs = []
for i in range(n + 1):
    x = -1.0 + i * pw * 0.97
    vs.append((bm.verts.new((x, -hgt / 2, zs[i])), bm.verts.new((x, hgt / 2, zs[i]))))
for i in range(n):
    f = bm.faces.new((vs[i][0], vs[i + 1][0], vs[i + 1][1], vs[i][1]))
    for l, (u, v) in zip(f.loops, ((i / n, 0), ((i + 1) / n, 0), ((i + 1) / n, 1), (i / n, 1))): l[uv].uv = (u, v)
bm.to_mesh(me); bm.free()
o = bpy.data.objects.new('mapa', me); bpy.context.scene.collection.objects.link(o); o.data.materials.append(mt)
s = o.modifiers.new('s', 'SOLIDIFY'); s.thickness = 0.03
o.rotation_euler = (0, 0, R(-20))
# alfinete vermelho
p = mathutils.Matrix.Rotation(R(-20), 3, 'Z') @ mathutils.Vector((-0.55, 0.15, 0.08))
bastao((p.x, p.y, p.z), (p.x, p.y, p.z + 0.36), 0.016, metal('#cfcfd4', 0.2))
cilindro((p.x, p.y, p.z + 0.38), 0.07, 0.06, plastico(VERM, 0.2), chanfro=0.015)
esfera((p.x, p.y, p.z + 0.48), 0.12, plastico(VERM, 0.2))
fim('M02.3', elev=44, azim=-14)
