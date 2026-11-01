import sys,json,os,shutil; sys.path.insert(0,'.')
from build import *
prep_bio()
LICN={'ph':('Phosphor Icons 2.x (duotone)','MIT'),'tb':('Tabler Icons (outline)','MIT'),'lu':('Lucide','ISC'),
 'hi':('Healthicons (outline + filled)','CC0 1.0 (domínio público)'),'bi':('bioicons — jaiganesh','CC0 1.0 (domínio público)'),
 'cu':('desenho próprio no tratamento da família (sem equivalente nos bancos)','próprio do app')}
mp={}
for i,(spec,why) in M.items():
    src,name=spec.split(':',1)
    _,orig=render(i)
    orig=orig.replace(SRC+'/','').replace('/hi/public/icons/svg/','healthicons/').replace('phosphor/assets/','phosphor/')
    if src=='bi': orig='bioicons/'+BIOPATH[name].split('/static/icons/')[1]
    mp[i]={'fonte':LICN[src][0],'arquivo_original':orig,'licenca':LICN[src][1],'por_que':why}
mp['_tratamento']={'viewBox':'0 0 48 48','linha':'3/48 em currentColor (100%)','preenchimento':'currentColor a 25% (duotone)','cor':'herda color do elemento pai','nota':'M-OUTRO = id interno OUTRO da matemática'}
json.dump(mp,open(OUT+'/mapa.json','w'),ensure_ascii=False,indent=1)
from collections import Counter
print(Counter(v['fonte'] for k,v in mp.items() if not k.startswith('_')))
lic=OUT+'/licencas'; os.makedirs(lic,exist_ok=True)
shutil.copy(SRC+'/phosphor/LICENSE',lic+'/phosphor-MIT.txt'); shutil.copy(SRC+'/tabler/LICENSE',lic+'/tabler-MIT.txt')
shutil.copy(SRC+'/lucide/LICENSE',lic+'/lucide-ISC.txt'); shutil.copy(SRC+'/hi/LICENSE',lic+'/healthicons-CC0.txt')
