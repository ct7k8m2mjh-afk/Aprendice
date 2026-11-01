# -*- coding: utf-8 -*-
"""Monta index.html (pagina do artefato), test.html (para conferir localmente)
e tela.html (pagina solta, que o iPad abre em tela cheia). As tres saem das
MESMAS fontes, entao nao ha como uma ficar para tras da outra."""
head = open('head.html').read()
body = open('body.html').read()
dados = open('dados.json').read()
app = open('app.js').read()

miolo = (head + "\n" + body +
         '\n<script id="dados" type="application/json">' + dados + '</script>\n' +
         '<script>\n' + app + '\n</script>\n')
open('index.html', 'w').write(miolo)

PRE = ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
       '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
       '<meta name="apple-mobile-web-app-capable" content="yes">'
       '<meta name="mobile-web-app-capable" content="yes">'
       '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'
       '<style>:root{color-scheme:light}body{margin:0}img{max-width:100%}'
       '[hidden]{display:none!important}</style></head><body>\n')
open('test.html', 'w').write(PRE + miolo + '\n</body></html>')
open('tela.html', 'w').write(PRE + miolo + '\n</body></html>')
print('index', len(miolo), '| tela/test idem')
