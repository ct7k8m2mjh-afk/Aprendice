import re
def rnd(s, nd=1):
    def f(m):
        v=float(m.group(0)); r=round(v,nd)
        t=('%.*f'%(nd,r)).rstrip('0').rstrip('.') if nd>0 else str(int(r))
        if t in ('-0',''): t='0'
        if t.startswith('0.'): t=t[1:]
        elif t.startswith('-0.'): t='-'+t[2:]
        return t
    # only inside d="..", points, transform, x,y etc: apply to whole doc except text content -> ok since we strip text
    out=re.sub(r'-?\d*\.\d+|-?\d+', f, s)
    return out
def inner(svgtext):
    a=svgtext.find('>', svgtext.find('<svg'))+1; b=svgtext.rfind('</svg>')
    return svgtext[a:b]
def viewbox(s):
    return [float(v) for v in re.split(r'[ ,]+', re.search(r'viewBox="([^"]+)"', s).group(1).strip())]
def strip_labels(s, colors=()):
    s=re.sub(r'<text\b.*?</text>','',s,flags=re.S)
    for c in colors:
        s=re.sub(r'<path[^>]*(?:stroke|fill)="%s"[^>]*/>'%c,'',s)
    return s
def prefix_ids(s, p):
    ids=set(re.findall(r'\bid="([^"]+)"',s))
    for i in sorted(ids,key=len,reverse=True):
        s=re.sub(r'\bid="%s"'%re.escape(i), 'id="%s%s"'%(p,i), s)
        s=s.replace('url(#%s)'%i,'url(#%s%s)'%(p,i)).replace('href="#%s"'%i,'href="#%s%s"'%(p,i))
    return s
