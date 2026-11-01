/* ===== visuais das resolucoes (Biologia) =====
   mapa: questao -> lista de visuais. def: cada visual.
   tipo 'anim': monta(svg) devolve desenha(t) (t em segundos, 0..dur); o motor cuida de play/pausa/linha do tempo.
   tipo 'galeria': fotos reais com legenda e credito (arquivos em vis/). */
var VIS = { mapa: {}, def: {} };

/* liga um visual a questoes (usado pelos arquivos de visuais/<materia>/) */
VIS.liga = function (vid, ids) { ids.forEach(function (id) { (VIS.mapa[id] = VIS.mapa[id] || []).indexOf(vid) < 0 && VIS.mapa[id].push(vid); }); };
