import type { MateriaId } from '../../dados/tipos';
import { urlRevisao, type ResumoSubtema } from '../../dados/revisao';
import { contaEhTexto } from '../../logica/fracao';
import { Formula, TextoMat } from '../Formula';
import { Icone } from '../Icone';

/**
 * RESUMO CURTO DO SUBTEMA (comando 35): título, pontos (com fórmula em $…$ desenhada à mão, fração empilhada),
 * pegadinha e a imagem. Enquanto o dono não envia a imagem (docs/imagens/<m>/<sub>.png), uma caixa tracejada diz o que
 * será ilustrado; quando ela chega, o build a converte em WebP leve e ela toma o lugar da caixa.
 */
export function ResumoSubtemaView({ m, r, compacto }: { m: MateriaId; r: ResumoSubtema; compacto?: boolean }) {
  const prosa = contaEhTexto('1 + 1', m);
  const img = r.imagem?.img;
  return (
    <article className={'rs' + (compacto ? ' compacto' : '')} aria-label={`Resumo: ${r.titulo}`}>
      <div className="rs-txt">
        <h3 className="rs-tit">{r.titulo}</h3>
        <ul className="rs-pontos">{r.pontos.map((p, k) => <li key={k}><span className="rs-p"><TextoMat t={p} prosa={prosa} /></span></li>)}</ul>
        {r.formula && <Formula tex={r.formula} prosa={prosa} className="rv-formula rs-formula" />}
        {r.pegadinha && <p className="es-pegadinha"><b>Pegadinha</b><TextoMat t={r.pegadinha} prosa={prosa} /></p>}
      </div>
      {(img || r.imagem?.descricao) && (
        <figure className="rs-fig">
          {img
            ? <img src={urlRevisao(m, img)} alt={r.imagem?.descricao || ''} loading="lazy" />
            : (
              <div className="rs-caixa" role="img" aria-label={`Imagem em preparação: ${r.imagem!.descricao}`}>
                <Icone nome="olho" tam={18} />
                <span><b>Imagem em preparação</b>{r.imagem!.descricao}</span>
              </div>
            )}
        </figure>
      )}
    </article>
  );
}
