import sys
h=open('mat/index.html').read(); d=open('mat/dados.json').read()
assert '</script' not in d
a=h.find('<script id="dados"'); a=h.find('>',a)+1; b=h.find('</script>',a)
open('mat/index.html','w').write(h[:a]+d+h[b:]); print('encaixado', len(d))
