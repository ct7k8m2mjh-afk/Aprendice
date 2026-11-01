from _mat import *
cena()
# quadro de cortica com duas reguas que se cruzam e uma tachinha no ponto de encontro: a solucao do sistema
cort = bpy.data.materials.new('cort'); cort.use_nodes = True; nt = cort.node_tree; b = nt.nodes['Principled BSDF']
nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 90; nz.inputs['Detail'].default_value = 8
cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = cor('#9c6a3a'); cr.color_ramp.elements[1].color = cor('#d9a46a')
nt.links.new(nz.outputs['Fac'], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = 0.9
caixa((0, 0, 0.04), (2.0, 1.6, 0.08), madeira('#b5793f'), chanfro=0.02)
caixa((0, 0, 0.05), (1.84, 1.44, 0.08), cort, chanfro=0.005)
def regua(rz, c, nome):
    im, d = tex(nome, 1200, 120, (0, 0, 0, 0))
    for k in range(0, 61):
        x = 20 + k * 19.3; L = 50 if k % 10 == 0 else (36 if k % 5 == 0 else 24)
        d.line((x, 0, x, L), fill=(20, 20, 20, 255), width=4)
    m = img_mat(salva(im, nome), rugos=0.3, alpha=True)
    o = caixa((0, 0, 0), (2.0, 0.24, 0.03), plastico(c, 0.25), chanfro=0.008)
    p = plano_img((0, 0.0, 0.016), 1.96, 0.2, m)
    return [o, p]
grupo(regua(R(28), AZUL, 'M04.3a'), loc=(0, 0, 0.11), rot=(0, 0, R(26)))
grupo(regua(R(-28), VERM, 'M04.3b'), loc=(0, 0, 0.145), rot=(0, 0, R(-30)))
cilindro((0, 0, 0.19), 0.1, 0.06, plastico(AMAR, 0.25), chanfro=0.02)
cilindro((0, 0, 0.25), 0.05, 0.1, plastico(AMAR, 0.25), chanfro=0.015)
esfera((0, 0, 0.31), 0.085, plastico(AMAR, 0.25))
fim('M04.3', elev=50, azim=-10)
