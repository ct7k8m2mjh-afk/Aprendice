import json,os
F={}
for l in ['a1','a2','v1','v2']:
    for suf in ['_ABA','_AB','_A','']:
        p=f'saida_{l}{suf}.json'
        if os.path.exists(p): print(l,'<-',p); break
    for k,v in json.load(open(p)).items():
        assert not any(x in v for x in ('_problema','_divergencia','_suspeita')),(k)
        F[k]={a:b for a,b in v.items() if not a.startswith('_')}
print(len(F)); json.dump(F,open('final.json','w'),ensure_ascii=False,indent=1)
