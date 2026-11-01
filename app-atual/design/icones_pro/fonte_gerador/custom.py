"""Desenhos proprios no MESMO tratamento (grade 48, linha 3, tinta 25%), so onde nenhum banco tem o conceito."""
L = 'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"'
F = 'fill="currentColor" opacity=".25"'


def tube(uid, paths, w=10):
    """tubo com contorno (cromatide): mascara branca larga - preta estreita."""
    ds = ''.join('<path d="%s"/>' % d for d in paths)
    return ('<mask id="%s" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">'
            '<g fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="#fff" stroke-width="%s">%s</g>'
            '<g stroke="#000" stroke-width="%s">%s</g></g></mask>'
            '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="%s" opacity=".25">%s</g>'
            '<rect width="48" height="48" fill="currentColor" mask="url(#%s)"/>') % (uid, w, ds, w - 6, ds, w - 6, ds, uid)


def get(name, uid):
    import re
    def dedup(tag):
        attrs = re.findall(r'\s([\w:-]+)="([^"]*)"', tag)
        d = {}
        for k, v in attrs: d[k] = v
        name_ = re.match(r'<(\w+)', tag).group(1)
        end = '/>' if tag.endswith('/>') else '>'
        return '<%s %s%s' % (name_, ' '.join('%s="%s"' % kv for kv in d.items()), end)
    return re.sub(r'<\w+\b[^>]*>', lambda m_: dedup(m_.group(0)), _get(name, uid))


def _get(name, uid):
    if name == 'canal':  # bicamada lipidica com proteina-canal; soluto atravessando (transporte passivo)
        return (f'<path {F} d="M4 22H17V32H4ZM31 22H44V32H31Z"/>'
                f'<path {L} d="M4 22H17M4 32H17M31 22H44M31 32H44"/>'
                f'<path {F} d="M17 15H22V39H17ZM26 15H31V39H26Z"/>'
                f'<path {L} d="M17 15H22V39H17ZM26 15H31V39H26Z"/>'
                f'<circle cx="24" cy="7" r="2.2" fill="currentColor"/><circle cx="24" cy="27" r="2.2" fill="currentColor"/>'
                f'<circle cx="24" cy="42" r="2.2" fill="currentColor"/>')
    if name == 'vesicula':  # endocitose: membrana invaginando e vesicula ja destacada
        return (f'<path {F} d="M4 8H14C14 22 34 22 34 8H44V15H38C38 31 10 31 10 15H4Z"/>'
                f'<path {L} d="M4 8H14C14 22 34 22 34 8H44M4 15H10C10 31 38 31 38 15H44"/>'
                f'<circle cx="24" cy="38" r="7" {F}/><circle cx="24" cy="38" r="7" {L}/><circle cx="24" cy="38" r="2.5" {L} stroke-width="2.4"/>')
    if name == 'comparacao':  # celula vegetal (parede + membrana) ao lado de celula animal
        return (f'<rect x="4" y="9" width="22" height="30" rx="3" {F}/><rect x="4" y="9" width="22" height="30" rx="3" {L}/>'
                f'<rect x="8.5" y="13.5" width="13" height="21" rx="1.5" {L} stroke-width="2.2"/>'
                f'<circle cx="15" cy="19.5" r="2.8" fill="currentColor"/>'
                f'<circle cx="36" cy="27" r="9" {F}/><circle cx="36" cy="27" r="9" {L}/><circle cx="36" cy="27" r="2.8" fill="currentColor"/>')
    if name == 'fago':  # bacteriofago: capsideo icosaedrico, cauda, placa basal e fibras
        return (f'<path {F} d="M24 3L32 7.5V16.5L24 21L16 16.5V7.5Z"/><path {L} d="M24 3L32 7.5V16.5L24 21L16 16.5V7.5Z"/>'
                f'<path {F} d="M21 21H27V33H21Z"/><path {L} d="M21 21H27V33H21ZM21 25H27M21 29H27"/>'
                f'<path {L} d="M15 34H33M18 34L11 40L13 45M30 34L37 40L35 45M22 34L19 44M26 34L29 44"/>')
    if name == 'golgi':  # complexo golgiense: cisternas empilhadas + vesiculas
        def cis(y, x0, x1):
            return f'M{x0} {y}C{x0+6} {y-7} {x1-6} {y-7} {x1} {y}C{x1-6} {y-3} {x0+6} {y-3} {x0} {y}Z'
        d = cis(17, 8, 40) + cis(27, 6, 42) + cis(37, 9, 39)
        return (f'<path {F} d="{d}"/><path {L} d="{d}"/>'
                f'<circle cx="42" cy="41" r="3" {L}/><circle cx="6" cy="42" r="2.5" {L}/><circle cx="24" cy="6" r="2.5" {L}/>')
    if name == 'mitose':  # citocinese: duas celulas-filhas ainda unidas, cada uma com nucleo
        d = 'M24 14.6A11 11 0 1 0 24 33.4A11 11 0 1 0 24 14.6Z'
        return (f'<path {F} d="{d}"/><path {L} d="{d}"/>'
                f'<circle cx="14.5" cy="24" r="4" {L}/><circle cx="33.5" cy="24" r="4" {L}/>'
                f'<path {L} d="M24 15.5V32.5" stroke-dasharray="2 4"/>')
    if name == 'crossing':  # par de homologos: segmentos trocados (preenchimento invertido) + quiasma
        return (f'<rect x="7" y="4" width="11" height="40" rx="5.5" {L}/><rect x="30" y="4" width="11" height="40" rx="5.5" {L}/>'
                f'<path {F} d="M7 24V9.5A5.5 5.5 0 0 1 18 9.5V24Z"/><path {F} d="M30 24V38.5A5.5 5.5 0 0 0 41 38.5V24Z"/>'
                f'<path fill="currentColor" d="M7 26V38.5A5.5 5.5 0 0 0 18 38.5V26Z"/><path fill="currentColor" d="M30 22V9.5A5.5 5.5 0 0 1 41 9.5V22Z"/>'
                f'<path {L} d="M20 19L28 29M28 19L20 29" stroke-width="2.4"/>')
    if name == 'transcricao':  # DNA (duas fitas) -> RNA (fita simples) saindo
        return (f'<path {L} d="M4 8H44M4 20H44"/>'
                f'<path {L} d="M9 8V20M17 8V20M25 8V20M33 8V20M41 8V20" stroke-width="2.4"/>'
                f'<path {L} d="M6 38C12 31 18 31 24 36S36 41 44 33"/>'
                f'<path {L} d="M11 33V28M19 32V27M27 38V33M35 38V33" stroke-width="2.4"/>')
    if name == 'traducao':  # ribossomo (subunidades maior e menor) sobre o RNAm; cadeia polipeptidica saindo
        return (f'<path {F} d="M11 27A13 10 0 0 1 37 27Z"/><path {L} d="M11 27A13 10 0 0 1 37 27Z"/>'
                f'<path {F} d="M14 31H34A10 6 0 0 1 14 31Z"/><path {L} d="M14 31H34A10 6 0 0 1 14 31Z"/>'
                f'<path {L} d="M3 29H45"/>'
                f'<path {L} d="M24 17V13L19 9L24 5" stroke-width="2.4"/>'
                f'<circle cx="24" cy="13" r="2.2" fill="currentColor"/><circle cx="19" cy="9" r="2.2" fill="currentColor"/><circle cx="24" cy="5" r="2.2" fill="currentColor"/>')
    if name == 'mutacao':  # escada do DNA com um par de bases trocado (destacado)
        return (f'<path {L} d="M14 4C14 16 34 32 34 44M34 4C34 16 14 32 14 44"/>'
                f'<path {L} d="M16 9H32M23 24H25M16 39H32" stroke-width="2.4"/>'
                f'<rect x="14.5" y="14" width="19" height="5" rx="2.5" fill="currentColor"/>'
                f'<path {L} d="M38 26l4 4M42 26l-4 4" stroke-width="2.4"/>')
    if name == 'sinapse':  # botao pre-sinaptico com vesiculas, fenda e membrana pos-sinaptica
        b = 'M17 4V12C8 15 7 30 18 30H30C41 30 40 15 31 12V4'
        return (f'<path {L} d="{b}"/>'
                + ''.join(f'<circle cx="{x}" cy="{y}" r="2.6" fill="currentColor" opacity=".25"/><circle cx="{x}" cy="{y}" r="2.6" {L} stroke-width="2.2"/>' for x, y in ((17, 18), (25, 16), (21, 24), (29, 24))) +
                f'<path {F} d="M5 44C10 36 38 36 43 44Z"/><path {L} d="M5 44C10 36 38 36 43 44"/>'
                f'<path {L} d="M20 34.5h.01M28 34.5h.01M24 33.5h.01"/>')
    if name == 'osmose':  # tubo em U com membrana semipermeavel: nivel sobe do lado da solucao
        return (f'<path {F} d="M10 26V31A14 14 0 0 0 38 31V14H30V31A6 6 0 0 1 18 31V26Z"/>'
                f'<path {L} d="M10 6V31A14 14 0 0 0 38 31V6M18 6V31A6 6 0 0 0 30 31V6"/>'
                f'<path {L} d="M24 36.5V45.5" stroke-width="2" stroke-dasharray="1.6 1.6" stroke-linecap="butt"/>'
                f'<path {L} d="M10 26H18M30 14H38" stroke-width="2.4"/>')
    if name == 'tales':  # feixe de paralelas cortado por duas transversais
        return (f'<path {F} d="M15.2 12L34.4 12L41.6 36L19.4 36Z"/>'
                f'<path {L} d="M4 12H44M4 24H44M4 36H44"/>'
                f'<path {L} d="M13 4.7L21 43.3M31.6 4.7L44 44"/>')
    if name == 'pitagoras':  # triangulo retangulo com quadrados sobre os tres lados
        return (f'<path fill="currentColor" d="M19 21L19 30L31 30Z"/>'
                f'<path {L} d="M19 21L19 30L31 30Z"/>'
                f'<path {L} d="M19 30V42H31V30M19 21H10V30H19M19 21L28 9L40 18L31 30"/>')
    if name == 'afim':  # funcao afim: reta nos eixos
        return (f'<path {L} d="M8 5V41H44"/>'
                f'<path {F} d="M8 41L8 33L40 9L40 41Z"/>'
                f'<path {L} d="M8 33L40 9"/><circle cx="8" cy="33" r="2.6" fill="currentColor"/>')
    if name == 'parabola':  # funcao quadratica: parabola com vertice marcado
        return (f'<path {L} d="M8 5V41H44"/>'
                f'<path {F} d="M14 8Q27 62 40 8Z"/>'
                f'<path {L} d="M14 8Q27 62 40 8"/><circle cx="27" cy="35" r="3" fill="currentColor"/>')
    if name == 'paralelas':  # posicao relativa: duas retas paralelas e uma concorrente
        return (f'<path {F} d="M11.6 30.6L24.8 13.2L35.4 22.8L22.2 40.2Z"/>'
                f'<path {L} d="M6 38L30 6M18 44L42 12M4 18L44 36"/>')
    raise KeyError(name)
