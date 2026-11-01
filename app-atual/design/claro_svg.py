# -*- coding: utf-8 -*-
"""Versao 'papel branco' das figuras do banco: o app mostra toda figura sobre fundo branco, nos dois temas,
para nao depender do tema do sistema (o <img> segue o prefers-color-scheme do Windows, nao o do app).
- bio: as regras de @media (prefers-color-scheme: light) passam a valer sempre.
- mat/por: paleta escura -> paleta clara equivalente (mesma matiz, contraste AA no branco).
- qui: ja e neutra; so troca o pouco de fundo escuro."""
import re
MAPA = {
    '#0F1529': '#FFFFFF', '#111833': '#FFFFFF', '#131A33': '#F6F7FB', '#1C2443': '#E3E6F0', '#2A3460': '#D3D8EA',
    '#E7E9F5': '#1E2440', '#9AA0BD': '#565C7C', '#D5DAFF': '#2F3A8F', '#3C408D': '#C9CEEA',
    '#F5B83D': '#9A6A06', '#7B8FFF': '#3F51D6', '#34D17F': '#17834C', '#F0566E': '#C42840',
    '#B48CFF': '#6F42C9', '#4CC9C0': '#0E7F78', '#FF9A5C': '#B5531B', '#8890C4': '#6B739F',
}
def _troca(t):
    return re.sub(r'#[0-9A-Fa-f]{6}\b', lambda m: MAPA.get(m.group(0).upper(), m.group(0)), t)
def claro(svg, materia):
    if materia == 'bio' or 'prefers-color-scheme' in svg:
        def unwrap(st):
            css = st.group(1); out = css; extra = ''
            for mm in re.finditer(r'@media\s*\(prefers-color-scheme:\s*light\)\s*\{', css):
                i = mm.end(); d = 1; j = i
                while j < len(css) and d:
                    d += {'{': 1, '}': -1}.get(css[j], 0); j += 1
                extra += css[i:j - 1]
            return '<style>' + out + extra + '</style>'
        svg = re.sub(r'<style>(.*?)</style>', unwrap, svg, flags=re.S)
        return svg
    return _troca(svg)
