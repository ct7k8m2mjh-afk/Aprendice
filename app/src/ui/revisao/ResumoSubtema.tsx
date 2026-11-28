import type { MateriaId } from '../../dados/tipos';
import { urlRevisao, type ResumoSubtema } from '../../dados/revisao';
import { contaEhTexto } from '../../logica/fracao';
import { Formula, TextoMat } from '../Formula';

/**
 * RESUMO CURTO DO SUBTEMA (comando 35): título, pontos (com fórmula em $…$ desenhada à mão, fração empilhada),
 * pegadinha e a imagem. Enquanto o dono não envia a imagem (docs/imagens/<m>/<sub>.png), nada aparece no lugar dela
 * (material incompleto não vai ao ar); quando ela chega, o build a converte em WebP leve.
 */
export function ResumoSubtemaView({ m, r, compacto }: { m: MateriaId; r: ResumoSubtema; compacto?: boolean }) {
  const prosa = contaEhTexto('1 + 1', m);
  const img = r.imagem?.img;
  return (
    <article className={'rs' + (compacto ? ' compacto' : '')} aria-label={`Resumo: ${r.titulo}`}>
      <div className="rs-txt">
        <h3 className="rs-tit">{r.titulo}</h3>
        {/* "a | b" nos dados (Biologia) vira dois itens: a barra é sinal técnico (revisão de 20/11/2026, matérias 6) */}
        <ul className="rs-pontos">{r.pontos.flatMap((p) => p.split(/\s+\|\s+/)).map((p, k) => <li key={k}><span className="rs-p"><TextoMat t={p} prosa={prosa} /></span></li>)}</ul>
        {r.formula && <Formula tex={r.formula} prosa={prosa} className="rv-formula rs-formula" />}
        {r.pegadinha && <p className="es-pegadinha"><b>Pegadinha</b><TextoMat t={r.pegadinha} prosa={prosa} /></p>}
      </div>
      {/* imagem que ainda não existe não aparece (material incompleto não vai ao ar; revisão de 19/11/2026, item 8) */}
      {img && (
        <figure className="rs-fig">
          <img src={urlRevisao(m, img)} alt={r.imagem?.descricao || ''} loading="lazy" />
        </figure>
      )}
    </article>
  );
}
