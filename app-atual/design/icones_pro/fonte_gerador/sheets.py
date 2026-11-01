import sys,os,subprocess,ast,collections
sys.path.insert(0,'.')
from build import *
COL={'bio':('#177E36','#56D364','Biologia'),'qui':('#C2185B','#F45D9C','Química'),'mat':('#087884','#2CCFD0','Matemática'),'por':('#8A6200','#F7C548','Português')}
def nomes(mm):
    o=subprocess.run(['python3','-I','-c',f"import sys;sys.path.insert(0,'/home/claude/escadas-sc');import dados_util as u;D=u.le('{mm}');print({{k:v['nome'] for k,v in D['teoria'].items()}});print(D['nomesub'])"],capture_output=True,text=True).stdout.split('\n')
    return ast.literal_eval(o[0]),ast.literal_eval(o[1])
prep_bio()
which=sys.argv[1:] or list(COL)
for mm in which:
    mods,subs=nomes(mm)
    fid=lambda k:'M-OUTRO' if k=='OUTRO' else k
    E=[]; miss=[]
    for k in mods:
        E.append((k,'■ '+mods[k],k))
        for s in subs:
            if s.split('.')[0]==k: E.append((s,subs[s],s))
    for s in subs:
        if '.' not in s or s.split('.')[0] not in mods:
            if all(s!=e[0] for e in E): E.append((s,subs[s],s))
    rows=[]
    for k,l,_ in E:
        if fid(k) not in M: miss.append(k); continue
        rows.append((k,l,wrap(render(fid(k))[0])))
    # dup check per subject
    c=collections.Counter(M[fid(k)][0] for k,_,_ in E if fid(k) in M)
    print(mm,'n=',len(rows),'faltam',miss,'dup',[x for x,v in c.items() if v>1])
    cl,cd,t=COL[mm]
    sheet(rows,f'{t} — ícones (56 e 24 px) · fundos #FFFFFF / #F5F5F3 / #16171B',cl,cd,f'{S}/folha_{mm}.png',cols=3)
