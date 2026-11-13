import { Fragment, type ReactNode } from 'react';
import { fonteLegivel } from '../../dados/revisao';

const CHAVE = /\b(?:(?:FIL|SOC|ING|GEO|HIS)-)?L\d+-F\d+-C\d+\b/;
const URL_RE = /\b(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)+\.[a-z]{2,})(\/[^\s;,)]*)?/gi;

/**
 * Fonte do slide, curta (auditoria M7): à vista só o livro e a página; o resto (conferências em outras fontes, endereços)
 * fica em "Outras fontes", fechado, com o endereço como link pelo nome do site, nunca a URL crua.
 */
export function FonteSlide({ fonte, obra }: { fonte: string; obra?: string }) {
  const partes = fonte.split(/;\s*/).map((x) => x.trim()).filter(Boolean);
  const livro = partes.filter((p) => CHAVE.test(p));
  const outras = partes.filter((p) => !CHAVE.test(p));
  const curta = (livro.length ? livro : partes.slice(0, 1)).map((p) => fonteLegivel(p, obra)).join('; ');
  const resto = livro.length ? outras : partes.slice(1);
  const longa = curta.length > 140;
  return (
    <div className="rv-fonte">
      <p>Fonte: {longa ? curta.slice(0, curta.lastIndexOf(' ', 130)) + '…' : comLinks(curta)}</p>
      {(resto.length > 0 || longa) && (
        <details className="rv-fonte-mais">
          <summary>{longa ? 'Fonte completa' : 'Outras fontes'}</summary>
          <ul>{(longa ? [curta, ...resto] : resto).map((p, i) => <li key={i}>{comLinks(p)}</li>)}</ul>
        </details>
      )}
    </div>
  );
}

function comLinks(t: string): ReactNode {
  const out: ReactNode[] = [];
  let ult = 0;
  URL_RE.lastIndex = 0;
  for (let m = URL_RE.exec(t); m; m = URL_RE.exec(t)) {
    // só endereço de verdade (com caminho ou com http): "R. Fitzpatrick" e "p. 14" não são sites
    if (!m[2] && !/^https?:/i.test(m[0])) continue;
    if (m.index > ult) out.push(<Fragment key={'t' + ult}>{t.slice(ult, m.index)}</Fragment>);
    const href = /^https?:/i.test(m[0]) ? m[0] : 'https://' + m[0];
    out.push(<a key={'a' + m.index} href={href} target="_blank" rel="noreferrer noopener">{m[1]}</a>);
    ult = m.index + m[0].length;
  }
  if (ult < t.length) out.push(<Fragment key="fim">{t.slice(ult)}</Fragment>);
  return out;
}
