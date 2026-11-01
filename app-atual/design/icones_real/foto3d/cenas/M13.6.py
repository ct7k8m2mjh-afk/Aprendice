from _mat import *
cena()
# dois discos de acrilico sobrepostos (A e B) sobre a placa do universo U: A uniao B, A intersecao B e o complementar
caixa((0, 0, 0.04), (2.6, 1.9, 0.08), plastico('#d7dee8', 0.35), chanfro=0.03)
decal('U', (-1.1, 0.75, 0.0815), 0.22, cor_txt=(60, 60, 60, 255), nome='M13.6_U')
def acr(hexa):
    m = bpy.data.materials.new('acr'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = cor(hexa); b.inputs['Transmission Weight'].default_value = 0.55; b.inputs['Roughness'].default_value = 0.06
    b.inputs['Coat Weight'].default_value = 0.4; return m
cilindro((-0.38, 0, 0.12), 0.72, 0.07, acr('#1f5fd6'), chanfro=0.02)
cilindro((0.38, 0, 0.2), 0.72, 0.07, acr('#f2b705'), chanfro=0.02)
decal('A', (-0.75, -0.05, 0.157), 0.24, nome='M13.6_A'); decal('B', (0.78, -0.05, 0.237), 0.24, cor_txt=(90, 60, 0, 255), nome='M13.6_B')
fim('M13.6', elev=50, azim=-10)
