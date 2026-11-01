/* ==== APRENDICE · icones desenhados (traco 2,2 · duotone) ====
   Revisao 29/10/2026: parte dos icones vem de bibliotecas abertas, adaptadas ao formato deste arquivo
   (traco em currentColor/degrade, preenchimento duotone F/F4). Lista das trocas: design/ICONES_REVISAO.md
   - Lucide (lucide.dev) - ISC License. Copyright (c) 2026 Lucide Icons and Contributors.
     Usados: brain (B08), trees (B09), book-open-text (P01), link (P04), message-circle + sparkle (P06).
   - Tabler Icons (tabler.io) - MIT License. Copyright (c) 2020-2026 Pawel Kuna.
     Usados: butterfly (B12), ballpen (P12).
   - Phosphor Icons (phosphoricons.com) - MIT License. Copyright (c) 2023 Phosphor Icons.
     Usado: book-open, peso duotone (glifo de Portugues).
   Permission to use, copy, modify, and/or distribute these icons for any purpose with or without fee is hereby
   granted, provided the copyright notices and permission notices above are kept (textos completos: ISC e MIT). */
var ICO = (function () {
  var F = ' fill="currentColor" fill-opacity=".2"', F4 = ' fill="currentColor" fill-opacity=".42"', FC = ' fill="currentColor"';
  function sv(vb, corpo, cls) {
    return '<svg class="' + (cls || 'ic') + '" viewBox="' + vb + '" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + corpo + '</svg>';
  }
  function txt(x, y, s, t, extra) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + s + '" text-anchor="middle" fill="currentColor" stroke="none" ' + (extra || 'font-family="Georgia,Cambria,serif" font-style="italic"') + '>' + t + '</text>';
  }
  /* icones de bibliotecas de grade 24 (Lucide/Tabler) ampliados para 48: traco 1,1 x 2 = 2,2, igual aos demais */
  function L(c) { return '<g transform="scale(2)" stroke-width="1.1">' + c + '</g>'; }
  /* ---------- temas (modulos), 48x48 ----------
     Regra: o degrade #ad-grad usa a caixa de cada traco; traco 100% horizontal ou vertical sozinho some no app.
     Por isso linhas retas isoladas levam um "toque" de .02 (ex.: M10 16h28M38 15.99v.02). */
  var M = {
    /* MATEMATICA */
    M01: '<rect x="6" y="6" width="36" height="36" rx="8"' + F + '/><path d="M24 9v30M9 24h30" stroke-opacity=".35"/><path d="M15 11v9M10.5 15.5h9M28.5 15.5h9M11.5 29l8 8M19.5 29l-8 8M28.5 33h9"/><circle cx="33" cy="29" r="1.3"' + FC + '/><circle cx="33" cy="37" r="1.3"' + FC + '/>',
    M02: '<path d="M24 8v31M16 40h16M8 14h32"/><path d="M8 14 3.5 26M8 14l4.5 12M40 14l-4.5 12M40 14l4.5 12"/><path d="M2.5 26a5.5 3.6 0 0 0 11 0z"' + F4 + '/><path d="M34.5 26a5.5 3.6 0 0 0 11 0z"' + F4 + '/><circle cx="24" cy="8" r="2.2"' + FC + '/>',
    M03: '<circle cx="15" cy="15" r="6"' + F4 + '/><circle cx="33" cy="33" r="6"' + F4 + '/><path d="M37 9 11 39"/>',
    M04: '<path d="M8 6v34h34" stroke-opacity=".45"/><path d="M11 35 41 13"/><path d="M11 15l30 20"/><circle cx="24.4" cy="24" r="3.4"' + FC + '/>',
    M05: '<path d="M8 6v34h34" stroke-opacity=".55"/><path d="M5 9l3-3 3 3M39 37l3 3-3 3" stroke-opacity=".55"/><path d="M13 10q11 40 22 0"/><path d="M13 10q11 40 22 0v30H13z"' + F + ' stroke="none"/><path d="M10 37 40 15" stroke-opacity=".75"/>',
    M06: '<path d="M8 6v34h34" stroke-opacity=".55"/><path d="M8 40 41 7" stroke-dasharray="2.5 3.5" stroke-opacity=".45"/><path d="M9 35.5C21 34.5 28 28 32 7"/><path d="M12.5 39C13.5 27 20 20 41 16" stroke-opacity=".7"/><circle cx="8" cy="35.5" r="1.9"' + FC + ' stroke="none"/><circle cx="12.5" cy="40" r="1.9"' + FC + ' stroke="none"/>',
    M07: '<rect x="7" y="30" width="7" height="11" rx="1.5"' + FC + ' fill-opacity=".45" stroke="none"/><rect x="16.5" y="23" width="7" height="18" rx="1.5"' + FC + ' fill-opacity=".62" stroke="none"/><rect x="26" y="15" width="7" height="26" rx="1.5"' + FC + ' fill-opacity=".8" stroke="none"/><rect x="35.5" y="7" width="7" height="34" rx="1.5"' + FC + ' stroke="none"/>',
    M08: '<path d="M8 38 16 12h18l8 26z"' + F + '/><path d="M16 12v26M15.99 38h.02" stroke-dasharray="3 3.2" stroke-opacity=".7"/><path d="M16 33h4.5v5"/>',
    M09: '<path d="M8 40h32L8 10z"' + F + '/><path d="M8 34h6v6"/><path d="M31 40a9 9 0 0 0 2.4-6.2" /><circle cx="8" cy="10" r="2"' + FC + '/>',
    M10: '<path d="M4 24h40M44 23.99v.02" stroke-opacity=".35"/><path d="M4 24c4-14 9-17 10-17s6 3 10 17 9 17 10 17 6-3 10-17"/>',
    M11: '<path d="M24 6l16 8-16 8-16-8z"' + F4 + '/><path d="M8 14l16 8v20L8 34z"' + F + '/><path d="M40 14 24 22v20l16-8z"' + F + ' fill-opacity=".3"/>',
    M12: '<path d="M5 24h38M24 5v38" stroke-opacity=".5"/><path d="M40 21l3 3-3 3M21 8l3-3 3 3" stroke-opacity=".5"/><circle cx="29" cy="19" r="10"' + F + '/><circle cx="29" cy="19" r="2.2"' + FC + '/>',
    M13: '<path d="M24 6l16 8-16 8-16-8z"' + F4 + '/><path d="M8 14l16 8v20L8 34z"' + F + '/><path d="M40 14 24 22v20l16-8z"' + F + ' fill-opacity=".3"/><ellipse cx="24" cy="14" rx="2.6" ry="1.5"' + FC + ' stroke="none"/><circle cx="13" cy="23" r="1.8"' + FC + ' stroke="none"/><circle cx="19" cy="33" r="1.8"' + FC + ' stroke="none"/><circle cx="29" cy="25.5" r="1.8"' + FC + ' stroke="none"/><circle cx="32" cy="29" r="1.8"' + FC + ' stroke="none"/><circle cx="35" cy="32.5" r="1.8"' + FC + ' stroke="none"/>',
    M14: '<path d="M5 41h38M43 40.99v.02" stroke-opacity=".5"/><rect x="7" y="27" width="6" height="14"' + FC + ' fill-opacity=".5" stroke="none"/><rect x="14" y="17" width="6" height="24"' + FC + ' fill-opacity=".75" stroke="none"/><rect x="21" y="8" width="6" height="33"' + FC + ' stroke="none"/><rect x="28" y="15" width="6" height="26"' + FC + ' fill-opacity=".75" stroke="none"/><rect x="35" y="24" width="6" height="17"' + FC + ' fill-opacity=".5" stroke="none"/>',
    M15: '<path d="M13 7H8v34h5M35 7h5v34h-5"/>' + txt(18.5, 21, 10, '1', 'font-family="ui-monospace,Consolas,monospace"') + txt(29.5, 21, 10, '0', 'font-family="ui-monospace,Consolas,monospace"') + txt(18.5, 35, 10, '1', 'font-family="ui-monospace,Consolas,monospace"') + txt(29.5, 35, 10, '1', 'font-family="ui-monospace,Consolas,monospace"'),
    M16: txt(20, 34, 26, 'x') + txt(33, 20, 14, '2', 'font-family="Georgia,Cambria,serif"'),
    M17: '<rect x="16" y="4" width="16" height="9" rx="2.5"' + F4 + '/><path d="M24 13v4M23.99 17h.02"/><path d="M24 17l8 7-8 7-8-7z"' + F + '/><path d="M16 24H9v9M32 24h7v9"/><rect x="3" y="33" width="12" height="9" rx="2.5"' + F + '/><rect x="33" y="33" width="12" height="9" rx="2.5"' + F + '/>',
    /* BIOLOGIA */
    B01: '<path d="M24 6c11 0 19 6 19 17s-8 19-19 19S5 35 5 24 13 6 24 6z"' + F + '/><circle cx="21" cy="23" r="7"' + F4 + '/><circle cx="22.5" cy="21.5" r="1.8"' + FC + '/><ellipse cx="34" cy="31" rx="4.6" ry="2.4" transform="rotate(-30 34 31)"' + F4 + '/><path d="M11 15q3-3 6 0M12 32q2.5 2.5 5 0" stroke-opacity=".7"/>',
    B02: '<path d="M30.5 16.6A14 14 0 1 1 17.5 16.6L24 24z"' + F + '/><path d="M17.5 5h13L24 12.4z"' + F4 + '/>',
    B03: '<ellipse cx="24" cy="24" rx="19" ry="11" transform="rotate(-24 24 24)"' + F + '/><path d="M10 31c3-9 5 3 8-5s5 3 8-6 5 3 8-6 4 2 5-1" transform="rotate(-2 24 24)"/>',
    B04: '<path d="M24 15.5a10 10 0 1 0 0 17 10 10 0 1 0 0-17z"' + F + '/><path d="M24 15.5c-1.6 3-1.6 14 0 17" stroke-opacity=".6"/><circle cx="15" cy="24" r="3.6"' + F4 + '/><circle cx="33" cy="24" r="3.6"' + F4 + '/><path d="M4 24h3M41 24h3M44 23.99v.02" stroke-dasharray="1 3"/>',
    B05: '<path d="M14 5c22 8 20 14 10 19S4 34 34 43"/><path d="M34 5C12 13 14 19 24 24s20 10-10 19"/><path d="M18 9.5h12M20.5 15.5h7M20.5 32.5h7M18 38.5h12" stroke-opacity=".7"/>',
    B06: '<rect x="10" y="10" width="30" height="30" rx="4"' + F + '/><rect x="10" y="10" width="15" height="15" rx="2"' + F4 + ' stroke="none"/><rect x="25" y="10" width="15" height="15" rx="2"' + F4 + ' stroke="none"/><rect x="10" y="25" width="15" height="15" rx="2"' + F4 + ' stroke="none"/><path d="M25 10v30M10 25h30"/>' + txt(17.5, 7, 7, 'A', 'font-family="system-ui,sans-serif" font-weight="700"') + txt(32.5, 7, 7, 'a', 'font-family="system-ui,sans-serif" font-weight="700"') + txt(5, 20, 7, 'A', 'font-family="system-ui,sans-serif" font-weight="700"') + txt(5, 35, 7, 'a', 'font-family="system-ui,sans-serif" font-weight="700"'),
    B07: '<path d="M24 41C10 31 4 23 8 15c3-6 11-7 16-1 5-6 13-5 16 1 4 8-2 16-16 26z"' + F + '/><path d="M5 25h10l3-6 4 12 3-7h18"/>',
    B08: L('<path d="M12 18V5M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.707 6.294A3 3 0 1 0 12 5a3 3 0 1 0-5.707 1.294"/><path d="M17.996 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.465"/><path d="M19.967 17.482a4 4 0 1 1-7.967.517 4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.465"/><path d="M6.004 5.125a4 4 0 0 0-2.526 5.77"/><path d="M12 5a3 3 0 0 0-5.7 1.3 4 4 0 0 0-2.8 4.6A4 4 0 0 0 4 17.5a4 4 0 0 0 8 .5 4 4 0 0 0 8-.5 4 4 0 0 0 .5-6.6 4 4 0 0 0-2.8-4.6A3 3 0 0 0 12 5z"' + F + ' stroke="none"/>'),
    B09: L('<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"' + F4 + '/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3 9.6 6.6 10 10v.2A3 3 0 0 1 11 15z"' + F + ' stroke="none"/><path d="M7 16v6M13 19v3M2.5 22h19"/>'),
    B10: '<circle cx="24" cy="24" r="10.5"' + F + '/><path d="M24 13.5V7M24 34.5V41M13.5 24H7M34.5 24H41M16.6 16.6l-4.5-4.5M31.4 31.4l4.5 4.5M31.4 16.6l4.5-4.5M16.6 31.4l-4.5 4.5"/><circle cx="24" cy="6" r="1.9"' + FC + '/><circle cx="24" cy="42" r="1.9"' + FC + '/><circle cx="6" cy="24" r="1.9"' + FC + '/><circle cx="42" cy="24" r="1.9"' + FC + '/><circle cx="11.3" cy="11.3" r="1.9"' + FC + '/><circle cx="36.7" cy="36.7" r="1.9"' + FC + '/><circle cx="36.7" cy="11.3" r="1.9"' + FC + '/><circle cx="11.3" cy="36.7" r="1.9"' + FC + '/><circle cx="21" cy="22" r="1.6"' + FC + '/><circle cx="27" cy="27" r="1.6"' + FC + '/>',
    B11: '<path d="M24 43V31M24 31 12 19M24 31l12-12M12 19 6 8M12 19l6-11M36 19l-6-11M36 19l6-11"/><circle cx="6" cy="7" r="2.6"' + FC + '/><circle cx="18" cy="7" r="2.6"' + FC + '/><circle cx="30" cy="7" r="2.6"' + FC + '/><circle cx="42" cy="7" r="2.6"' + FC + '/><circle cx="24" cy="31" r="2.2"' + F4 + '/>',
    B12: L('<path d="M12 18.176a3 3 0 1 1-4.953-2.449l-.025.023a4.502 4.502 0 0 1 1.483-8.75c1.414 0 2.675.652 3.5 1.671a4.5 4.5 0 1 1 4.983 7.079 3 3 0 1 1-4.983 2.25l-.005.176"' + F + '/><path d="M12 19V9M9 3l3 2 3-2"/>'),
    /* QUIMICA */
    Q01: '<ellipse cx="24" cy="24" rx="19" ry="7.5"/><ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(120 24 24)"/><circle cx="24" cy="24" r="4"' + FC + '/><circle cx="43" cy="24" r="2"' + FC + '/>',
    Q02: '<path d="M24 22 10 32M24 22l14 10M24 22V9"/><circle cx="24" cy="22" r="6.5"' + F4 + '/><circle cx="10" cy="33" r="5"' + F + '/><circle cx="38" cy="33" r="5"' + F + '/><circle cx="24" cy="8" r="4"' + F + '/>',
    Q03: '<circle cx="15" cy="24" r="10"' + F4 + '/><circle cx="35" cy="24" r="8"' + F + '/><path d="M15 19v10M10 24h10M31 24h8"/>',
    Q04: '<circle cx="12" cy="36" r="5.6"' + F4 + '/><circle cx="24" cy="36" r="5.6"' + F4 + '/><circle cx="36" cy="36" r="5.6"' + F4 + '/><circle cx="18" cy="25.5" r="5.6"' + F + '/><circle cx="30" cy="25.5" r="5.6"' + F + '/><circle cx="24" cy="15" r="5.6"' + F + '/>',
    Q05: '<path d="M19 5h10M20.5 5v13L9.5 37.5A3 3 0 0 0 12 42h24a3 3 0 0 0 2.5-4.5L27.5 18V5"/><path d="M13.6 30.5h20.8l4.1 7a3 3 0 0 1-2.5 4.5H12a3 3 0 0 1-2.5-4.5z"' + F4 + ' stroke="none"/><circle cx="21" cy="35" r="1.5"' + FC + '/><circle cx="27" cy="37" r="1.2"' + FC + '/><circle cx="25" cy="25" r="1.2"' + FC + ' fill-opacity=".6"/>',
    Q06: '<path d="M10 9v29a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V9"/><path d="M10 16h28M38 15.99v.02" stroke-width="3.4"/><path d="M24 16V4M19 4h10"/><rect x="11" y="18" width="26" height="22" rx="2"' + F + ' stroke="none"/><circle cx="17" cy="25" r="1.8"' + FC + '/><circle cx="29" cy="23" r="1.8"' + FC + '/><circle cx="23" cy="32" r="1.8"' + FC + '/><circle cx="31" cy="35" r="1.8"' + FC + '/><path d="M14 33l-2 2M33 27l2-1" stroke-opacity=".6"/>',
    Q07: '<path d="M24 43c-10 0-14-8-11-16 2-6 7-8 6-19 8 5 14 12 15 20 1 8-3 15-10 15z"' + F + '/><path d="M24 43c-4 0-6-4-4-8 1-3 4-4 4-8 4 4 6 8 4 12-1 3-2 4-4 4z"' + F4 + '/>',
    Q08: '<path d="M7 19h33l-7-7"/><path d="M41 29H8l7 7"/>',
    Q09: '<rect x="5" y="14" width="33" height="20" rx="3.5"' + F + '/><rect x="38" y="20" width="5" height="8" rx="1.5"' + F4 + '/><path d="M13 24h6M29 20v8M25 24h8"/><path d="M24 14v20M23.99 34h.02" stroke-opacity=".3"/>',
    Q10: '<circle cx="21" cy="36" r="6.5"' + F4 + '/><path d="M18 31V9a3 3 0 0 1 6 0v22"/><path d="M21 34V17M20.99 17h.02" stroke-width="3.4"/><path d="M29 12h5M29 18h3.5M29 24h5"/>',
    Q11: '<path d="M24 9l13 7.5v15L24 39l-13-7.5v-15z"' + F + '/><circle cx="24" cy="24" r="7"/><circle cx="24" cy="9" r="1.9"' + FC + '/><circle cx="37" cy="16.5" r="1.9"' + FC + '/><circle cx="37" cy="31.5" r="1.9"' + FC + '/><circle cx="24" cy="39" r="1.9"' + FC + '/><circle cx="11" cy="31.5" r="1.9"' + FC + '/><circle cx="11" cy="16.5" r="1.9"' + FC + '/>',
    Q12: '<rect x="12" y="10" width="24" height="28" rx="2"' + F + ' stroke="none"/><path d="M15 9h-4v30h4M33 9h4v30h-4"/><path d="M3 24h7M38 24h7M45 23.99v.02" stroke-opacity=".6"/><path d="M15 29l4.5-9 4.5 9 4.5-9 4.5 9"/>' + txt(42, 44, 11, 'n'),
    /* PORTUGUES */
    P01: L('<path d="M20.001 19A2 2 0 0 0 22 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"' + F + '/><path d="M12 5v16M16 13h2M16 9h2M6 13h2M6 9h2"/>'),
    P02: '<path d="M8 8h21a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H15l-6 5v-5H8a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3z"' + F4 + '/><path d="M36 18h4a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-1v5l-6-5H24a3 3 0 0 1-3-3v-1"' + F + '/>',
    P03: '<rect x="14" y="5" width="24" height="30" rx="3" transform="rotate(8 26 20)"' + F + '/><rect x="9" y="11" width="24" height="31" rx="3"' + F4 + '/><path d="M14 19h14M14 25h14M14 31h9"/>',
    P04: L('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
    P05: '<circle cx="20" cy="20" r="13"' + F + '/><path d="M30 30l12 12" stroke-width="3.6"/>' + txt(20, 24.5, 12, 'abc', 'font-family="Georgia,Cambria,serif" font-weight="700"'),
    P06: L('<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"' + F + '/><path transform="translate(6.6 6.6) scale(.45)" stroke-width="2.2" d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"' + F4 + '/>'),
    P07: txt(24, 33, 25, 'Aa', 'font-family="Georgia,Cambria,serif" font-weight="700"'),
    P08: '<rect x="4" y="16" width="15" height="12" rx="4"' + F4 + '/><rect x="22" y="16" width="19" height="12" rx="4"' + F + '/><circle cx="44.5" cy="26" r="1.9"' + FC + '/><path d="M4 35h37M41 34.99v.02" stroke-opacity=".45"/>' + txt(11.5, 25.5, 8, 'S', 'font-family="system-ui,sans-serif" font-weight="700"') + txt(31.5, 25.5, 8, 'P', 'font-family="system-ui,sans-serif" font-weight="700"'),
    P09: '<rect x="4" y="8" width="20" height="12" rx="4"' + F4 + '/><rect x="24" y="28" width="20" height="12" rx="4"' + F + '/><path d="M14 20c0 9 4 14 10 14"/><path d="M21 31l3 3-3 3"/>',
    P10: txt(24, 39, 32, 'a', 'font-family="Georgia,Cambria,serif"') + '<path d="M17 7l7.5 6" stroke-width="3.4"/>',
    P11: '<path d="M40 5C27 7 17 17 13 33l-2 9 6-7c14-3 22-13 23-30z"' + F + '/><path d="M11 42 30 16M20 26h7M24 20h8" stroke-opacity=".85"/>',
    P12: L('<path d="M5.828 18.172a2.828 2.828 0 0 0 4 0l10.586-10.586a2 2 0 0 0 0-2.829l-1.171-1.171a2 2 0 0 0-2.829 0L5.828 14.172a2.828 2.828 0 0 0 0 4"' + F + '/><path d="M14 6l7 7-4 4"/><path d="M4 20l1.768-1.768"/>')
  };
  /* icones das materias (design/icones_pro: Phosphor MIT, Tabler MIT, Lucide ISC, Healthicons CC0, bioicons CC0 e desenhos
     proprios; creditos em icones_pro/LICENCAS.md). Embutidos pelo gera_design.py: so os da propria materia em cada app. */
  var PRO = %ICOPRO%;
  /* icones REALISTAS dos modulos (29/10, pedido do dono: "desenho plano de paint" saiu): design/icones_real/<id>.svg.
     Ilustracoes: Servier Medical Art, CC BY 3.0 (smart.servier.com) e desenhos 3D do projeto; creditos em icones_real/LICENCAS.md.
     Nas materias vem o SVG (so os da materia); no shell, miniatura WebP 64 px (so a busca usa). Entram como <img>:
     cada SVG tem seus proprios filtros/ids, que repetidos na mesma pagina se atrapalhariam. */
  var REAL = %ICOREAL%, REALU = {};
  /* auditoria 31/10: icones 'pk:' vem do pacote da materia (ic.json, guardado pelo navegador); ate ele chegar a <img> leva
     data-ic e uma imagem vazia, trocada quando o pacote chega */
  var VAZIO = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', PK = null, PACOTE = null;
  if ('%ICPACK%' && Object.keys(REAL).some(function (k) { return REAL[k] === 'pk:'; }) && window.fetch) {
    PACOTE = fetch('%ICPACK%').then(function (r) { if (!r.ok) throw r.status; return r.json(); }).then(function (d) {
      PK = d; REALU = {};
      document.querySelectorAll('img[data-ic]').forEach(function (im) { var u = realUrl(im.getAttribute('data-ic')); if (u) im.src = u; });
    });
    PACOTE.catch(function () { });
  }
  function realUrl(k) {
    if (!REAL[k]) return '';
    if (REAL[k] === 'pk:') { if (!PK || !PK[k]) return ''; if (!REALU[k]) REALU[k] = 'data:image/webp;base64,' + PK[k]; return REALU[k]; }
    if (!REALU[k]) REALU[k] = REAL[k].indexOf('data:') === 0 ? REAL[k] : 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(REAL[k]);   /* ic/: arquivo WebP da materia (31/10) */
    return REALU[k];
  }
  function real(k, cls) { var u = realUrl(k); return '<img class="' + (cls || 'ic-tema') + ' ic-real" src="' + (u || VAZIO) + '"' + (REAL[k] === 'pk:' ? ' data-ic="' + k + '"' : '') + ' alt="" aria-hidden="true" draggable="false" decoding="async">'; }
  /* modulo (B01) e conteudo (B01.5, 30/10): ilustracao realista, objeto solto (sem ladrilho).
     Conteudo realista leva tambem .ic-sub (as regras de tamanho por lugar continuam valendo); o ladrilho do CSS so pega svg.ic-sub,
     o desenho de traco que sobra como reserva se faltar o realista. */
  function tema(id, cls) {
    id = String(id); var mod = id.split('.')[0], ehSub = id.indexOf('.') > 0;
    if (REAL[id]) return real(id, (cls || 'ic-tema') + (ehSub || id === 'OUTRO' ? ' ic-sub' : ''));
    if (!ehSub && REAL[mod]) return real(mod, cls);
    if (ehSub && PRO[id]) return '<svg class="' + (cls || 'ic-tema') + ' ic-pro ic-sub" viewBox="-7.5 -7.5 63 63" fill="none" aria-hidden="true">' + PRO[id] + '</svg>';
    if (REAL[mod]) return real(mod, cls);
    if (PRO[mod]) return '<svg class="' + (cls || 'ic-tema') + ' ic-pro ic-sub" viewBox="-7.5 -7.5 63 63" fill="none" aria-hidden="true">' + PRO[mod] + '</svg>';
    return temaVelho(mod, cls);
  }
  function temaVelho(id, cls) { return M[id] ? sv('0 0 48 48', M[id], cls || 'ic-tema') : sv('0 0 48 48', '<circle cx="24" cy="24" r="14"' + F + '/>', cls || 'ic-tema'); }

  /* ---------- interface, 24x24 (traco 1,8) ---------- */
  function ui(c) { return '<svg class="ic-ui" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + c + '</svg>'; }
  var U = {
    inicio: ui('<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/>'),
    inicioCheio: '<svg class="ic-ui" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" fill="currentColor"/></svg>',
    questoes: ui('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="m8 12 3 3 5-6"/>'),
    treino: ui('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
    simulados: ui('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><circle cx="12" cy="14.5" r="3.2"/><path d="M12 13v1.5l1 1"/>'),
    plano: ui('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14h2M14 14h2M8 17.5h2"/>'),
    desempenho: ui('<path d="M5 20v-7M10 20V5M15 20v-9M20 20V9"/>'),
    revisao: ui('<path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.5L5 21V4.5a1 1 0 0 1 1-1z"/>'),
    revisaoCheia: '<svg class="ic-ui" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.5L5 21V4.5a1 1 0 0 1 1-1z" fill="currentColor"/></svg>',
    config: ui('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
    busca: ui('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
    seta: ui('<path d="m9 6 6 6-6 6"/>'),
    voltar: ui('<path d="m15 6-6 6 6 6"/>'),
    relogio: ui('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    cronometro: ui('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 1.5M10 2.5h4M18.5 6.5l1.5-1.5M5.5 6.5 4 5"/>'),
    alvo: ui('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
    lampada: ui('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.8.6 1.1 1.4 1.1 2.2h5c0-.8.3-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>'),
    camadas: ui('<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>'),
    /* Lucide image (ISC): cartoes com imagem */
    imagem: ui('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>'),
    doc: ui('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
    check: ui('<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/>'),
    xis: ui('<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>'),
    tema: ui('<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/>'),
    tela: ui('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    nuvem: ui('<path d="M7 18a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.4 1.5A3.8 3.8 0 0 1 17.5 18z"/>'),
    livro: ui('<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5v13"/>'),
    escada: ui('<path d="M4 20h4v-4h4v-4h4V8h4V4"/>'),
    /* flashcards (30/10): dois cartoes empilhados; lapis = escrever a resposta */
    cartoes: ui('<rect x="3" y="7.5" width="14" height="13" rx="2"/><path d="M7 4.5h11a2 2 0 0 1 2 2V17"/><path d="M6.5 12.5h7M6.5 16h4.5"/>'),
    lapis: ui('<path d="M15.5 4.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/><path d="m13.5 6.5 3 3"/>'),
    teclado: ui('<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>')
  };

  /* ---------- glifos das materias (menu lateral), 24x24 cheios ---------- */
  var G = {
    /* pi desenhado (o mesmo traco do menu da pagina principal), nao letra de fonte */
    mat: '<svg class="ic-mat" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 8.5c.6-2 1.9-3 3.6-3h11.4"/><path d="M9.5 5.5v13"/><path d="M15.5 5.5v10.4c0 1.7.9 2.6 2.5 2.6"/></g></svg>',
    qui: '<svg class="ic-mat" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 2.5h6M10 2.5v6.2L4.2 18.6A2 2 0 0 0 6 21.5h12a2 2 0 0 0 1.8-2.9L14 8.7V2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.3 14h9.4l3 4.9a1.7 1.7 0 0 1-1.5 2.6H5.8a1.7 1.7 0 0 1-1.5-2.6z" fill="currentColor"/></svg>',
    bio: '<svg class="ic-mat" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20.5C4 10 10 3.5 21 3.5c0 10.5-6.5 17-17 17z" fill="currentColor"/><path d="M4 20.5 15.5 9" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1.6" stroke-linecap="round"/></svg>',
    /* Phosphor book-open (duotone), MIT: livro aberto simetrico, paginas em tom forte e contorno cheio */
    por: '<svg class="ic-mat" viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" fill-opacity=".5" d="M232,56V200H160a32,32,0,0,0-32,32,32,32,0,0,0-32-32H24V56H96a32,32,0,0,1,32,32,32,32,0,0,1,32-32Z"/><path fill="currentColor" d="M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z"/></svg>'
  };

  /* ---------- ilustracoes das materias: desenhadas em design/gera_ilu.py (luz e sombra, sem brilho) ---------- */
  var ILU_SVG = %ILU%, ILU = {};
  ['bio', 'qui', 'mat', 'por'].forEach(function (m) { ILU[m] = function (k) { return ILU_SVG[m].split('@K@').join(String(k || m)); }; });
  /* desenho de traco (o antigo), para quem precisa do miolo do SVG: o motivo apagado do fundo da materia */
  function traco(id, cls) { id = String(id); var k = PRO[id] ? id : (PRO[id.split('.')[0]] ? id.split('.')[0] : null); return k ? '<svg class="' + (cls || 'ic-tema') + ' ic-pro" viewBox="0 0 48 48" fill="none" aria-hidden="true">' + PRO[k] + '</svg>' : temaVelho(id.split('.')[0], cls); }
  /* simulados (30/10): selo da banca com o nome escrito (desenho proprio, nao e logo) e um objeto por objetivo; so nas materias */
  var SIM = %ICOSIM%, SIMU = {};
  function sim(id) {
    if (!SIM[id]) return '';
    if (!SIMU[id]) SIMU[id] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SIM[id]);
    return '<img class="ic-simr" src="' + SIMU[id] + '" alt="" aria-hidden="true" draggable="false" decoding="async">';
  }
  return { pacote: PACOTE, tema: tema, sim: sim, traco: traco, temPro: function (id) { return !!PRO[id]; }, temReal: function (id) { return !!REAL[id]; }, realUrl: realUrl, ui: U, glifo: G, ilu: ILU,
    creditoReal: 'Ilustrações: Servier Medical Art, CC BY 3.0' };
})();
