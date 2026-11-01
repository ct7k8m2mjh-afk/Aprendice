var VIS = { mapa: {}, def: {} };
VIS.liga = function (vid, ids) { ids.forEach(function (id) { (VIS.mapa[id] = VIS.mapa[id] || []).indexOf(vid) < 0 && VIS.mapa[id].push(vid); }); };
