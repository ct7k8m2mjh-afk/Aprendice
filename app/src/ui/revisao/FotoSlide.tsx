import { useLayoutEffect, useRef, useState } from 'react';
import { urlRevisao, type VisualSlide } from '../../dados/revisao';
import type { MateriaId } from '../../dados/tipos';
import { animaEntrada } from '../motorAnima';
import { Icone } from '../Icone';

/**
 * Imagem do slide (só as de visual.foto, com autor, licença e origem sempre visíveis), servida pelo próprio site.
 * Entra pelo motor único (surge e assenta). O roteiro de produção (`visual.movimento`, `visual.descricao`) NUNCA aparece
 * para o aluno (auditoria A1): o que o motor ainda não desenha fica pedido em docs/revisao/PEDIDOS-MOTOR.md.
 * Imagem sensível (o roteiro pede um aviso antes): primeiro o aviso, a imagem só quando o aluno escolhe ver.
 */
export function FotoSlide({ m, v, anima = true }: { m: MateriaId; v: VisualSlide; anima?: boolean }) {
  const foto = v.foto!;
  const aviso = avisoDe(v);
  const [ver, setVer] = useState(!aviso);
  const img = useRef<HTMLImageElement>(null);
  const menos = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  useLayoutEffect(() => {
    if (!ver || menos || !anima || !img.current) return;
    const c = animaEntrada(img.current);
    return () => c.cancela();
  }, [ver, menos, anima]);
  return (
    <figure className={'rv-vis rv-foto' + (reduzida(v) ? ' reduzida' : '')}>
      {ver ? (
        <img ref={img} src={urlRevisao(m, foto.img!)} alt={v.alt || ''} loading="lazy" />
      ) : (
        <div className="rv-foto-aviso" role="note">
          <Icone nome="info" tam={20} />
          <p><b>Antes da imagem:</b> {aviso}</p>
          <button type="button" className="btn sec peq" onClick={() => setVer(true)}><Icone nome="olho" tam={16} />Ver a imagem</button>
        </div>
      )}
      <figcaption className="rv-credito">
        {rotuloImagem(v)}: {foto.autor} · {foto.licenca} · <a href={foto.url} target="_blank" rel="noreferrer noopener">{origem(foto.url)} <Icone nome="externo" tam={12} /></a>
      </figcaption>
    </figure>
  );
}

/** "Foto", "Pintura", "Gravura", "Mapa"... pelo que a descrição diz da imagem (auditoria B3). */
export function rotuloImagem(v: VisualSlide): string {
  const t = `${v.descricao || ''} ${v.foto?.por_que || ''} ${v.alt || ''}`.toLowerCase();
  if (/\bpintura|\bóleo sobre|\bquadro de\b|\btela de\b/.test(t)) return 'Pintura';
  if (/\bgravura|\bxilogravura|\blitografia/.test(t)) return 'Gravura';
  if (/\bmapa\b/.test(t) && !/\bfoto/.test(t)) return 'Mapa';
  if (/\bilustração|\bdesenho\b|\bcharge\b|\bcartaz\b/.test(t) && !/\bfoto/.test(t)) return 'Imagem';
  return 'Foto';
}

/** O roteiro pede aviso antes da imagem? Devolve o texto do aviso (entre aspas no roteiro) ou um aviso geral. */
export function avisoDe(v: VisualSlide): string | null {
  const linhas = [...(v.movimento || []), v.descricao || ''];
  const l = linhas.find((x) => /\baviso\b/i.test(x));
  if (!l) return null;
  const q = /[‘'“"]([^’'”"]{4,120})[’'”"]/.exec(l.slice(l.search(/aviso/i)));
  const t = (q ? q[1] : 'imagem sensível').trim();
  return t.charAt(0).toUpperCase() + t.slice(1) + (/[.!?]$/.test(t) ? '' : '.');
}

function origem(url: string): string {
  try {
    const h = new URL(url).hostname.replace(/^www\./, '');
    return h === 'commons.wikimedia.org' ? 'Wikimedia Commons' : h;
  } catch { return 'origem'; }
}

/** o roteiro pede a imagem em tamanho reduzido (imagem sensível) */
function reduzida(v: VisualSlide): boolean {
  return [...(v.movimento || []), v.descricao || ''].some((x) => /tamanho reduzido/i.test(x));
}
