import { useRef, useState } from 'react';
import { carregaMateria, MATERIAS_COM_CONTEUDO } from '../dados/conteudo';
import { pegaEstado, substitui, useEstado, zera } from '../estado/loja';
import { aplicaAlias, importaArquivo } from '../estado/migracao';
import { Toast, useTitulo } from '../ui/comum';
import { Icone } from '../ui/Icone';
import { defineTema } from '../ui/Casca';

async function idsPorMateria() {
  const out: Record<string, Set<string>> = {};
  for (const m of MATERIAS_COM_CONTEUDO) { const mc = await carregaMateria(m); out[m] = new Set([...mc.banco.map((q) => q.id), ...Object.keys(mc.conteudo.alias)]); }
  return out;
}

export function Config() {
  useTitulo('Configurações');
  const e = useEstado();
  const arq = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [zerando, setZerando] = useState(false);

  const exporta = () => {
    const blob = new Blob([JSON.stringify(pegaEstado(), null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `aprendice-progresso-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setToast('Arquivo de progresso baixado.');
  };
  const importa = async (f: File) => {
    const texto = await f.text();
    const ids = await idsPorMateria();
    const { estado, r } = importaArquivo(pegaEstado(), texto, ids);
    if (r.erro) { setToast(r.erro); return; }
    let novo = estado;
    for (const m of r.materias) { const mc = await carregaMateria(m); if (novo.materias[m]) novo = { ...novo, materias: { ...novo.materias, [m]: aplicaAlias(novo.materias[m]!, mc.conteudo.alias) } }; }
    substitui(novo);
    setToast(`Progresso importado: ${r.questoes} questões e ${r.cartoes} cartões, sem apagar nada do que já havia.`);
  };

  const tema = e.pref.tema;
  return (
    <div className="conteudo estreito">
      <div className="titulo-pag"><h1>Configurações</h1></div>

      <section className="bloco">
        <h2 className="sec-tit">Aparência</h2>
        <div className="chips" role="radiogroup" aria-label="Tema">
          {([['claro', 'Claro', 'sol'], ['escuro', 'Escuro', 'lua'], ['sistema', 'Igual ao aparelho', 'config']] as const).map(([v, t, ic]) => (
            <button key={v} role="radio" aria-checked={tema === v} className="chip" aria-pressed={tema === v} onClick={() => defineTema(v)}><Icone nome={ic} tam={15} /> {t}</button>
          ))}
        </div>
      </section>

      <section className="bloco sec">
        <h2 className="sec-tit">Meus dados</h2>
        <p className="miolo">Seu progresso fica salvo neste aparelho. Baixe uma cópia de vez em quando ou traga o progresso de outro aparelho ou do protótipo antigo: a importação junta tudo e não apaga nada.</p>
        <div className="dados-acoes">
          <button className="btn sec" onClick={exporta}><Icone nome="download" /> Baixar meu progresso</button>
          <button className="btn sec" onClick={() => arq.current?.click()}><Icone nome="upload" /> Importar progresso</button>
          <input ref={arq} type="file" accept="application/json,.json" hidden onChange={(ev) => { const f = ev.target.files?.[0]; if (f) importa(f); ev.target.value = ''; }} />
        </div>
        <p className="fraco" style={{ fontSize: 14 }}>Aceita o arquivo do APRENDICE e os arquivos “Baixar meu progresso” do protótipo (uma matéria por arquivo).{e.migradoDe.length ? ` Progresso do protótipo trazido automaticamente deste navegador: ${e.migradoDe.length} matéria(s).` : ''}</p>
        <div className="zona-perigo">
          {!zerando ? <button className="btn fantasma" onClick={() => setZerando(true)}><Icone nome="lixo" /> Zerar progresso</button> : (
            <div className="confirma-zera">
              <p><b>Zerar todo o progresso?</b> Uma cópia de segurança fica guardada neste aparelho, mas as estatísticas recomeçam do zero.</p>
              <div className="fc-acoes"><button className="btn sec" onClick={() => setZerando(false)}>Cancelar</button><button className="btn perigo" onClick={() => { zera(); setZerando(false); setToast('Progresso zerado. A cópia de segurança ficou guardada.'); }}>Zerar</button></div>
            </div>
          )}
        </div>
      </section>

      <section className="bloco sec">
        <h2 className="sec-tit">Correção dos flashcards</h2>
        <p className="miolo">Nesta versão, a “correção por IA” é simulada: quem corrige é o próprio aparelho, comparando ideias-chave e números pelo valor. Nada do que você escreve sai daqui. Na versão com servidor, a resposta vai para a IA sem nome nem e-mail.</p>
      </section>

      <section className="bloco sec">
        <h2 className="sec-tit">Atalhos de teclado</h2>
        <dl className="atalhos">
          <div><dt><kbd>A</kbd>–<kbd>E</kbd> ou <kbd>1</kbd>–<kbd>5</kbd></dt><dd>escolher alternativa</dd></div>
          <div><dt><kbd>Shift</kbd> + letra</dt><dd>riscar alternativa</dd></div>
          <div><dt><kbd>Enter</kbd></dt><dd>confirmar / próxima</dd></div>
          <div><dt><kbd>H</kbd></dt><dd>pista</dd></div>
          <div><dt><kbd>P</kbd></dt><dd>pausar o cronômetro</dd></div>
          <div><dt><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd></dt><dd>flashcard: errei, quase, acertei</dd></div>
          <div><dt><kbd>Ctrl</kbd> + <kbd>K</kbd></dt><dd>buscar</dd></div>
          <div><dt><kbd>Esc</kbd></dt><dd>sair da questão ou fechar</dd></div>
        </dl>
      </section>

      <section className="bloco sec">
        <h2 className="sec-tit">Privacidade</h2>
        <p className="miolo">Sem servidor nesta versão: nenhum dado pessoal é enviado a ninguém. Sem anúncios, sem rastreamento, fontes hospedadas no próprio app. Quando houver contas na nuvem, você poderá baixar e apagar seus dados a qualquer momento (LGPD).</p>
      </section>

      <section className="bloco sec">
        <h2 className="sec-tit">Créditos e fontes</h2>
        <ul className="creditos">
          <li>Questões: cadernos oficiais das provas e listas públicas de exercícios; cada questão traz o link da fonte e o gabarito publicado.</li>
          <li>Ilustrações de flashcards: Servier Medical Art, CC BY 3.0; figuras de Matemática geradas por código.</li>
          <li>Logos de simulados: Wikimedia Commons (Fuvest, CC BY 3.0; São Camilo).</li>
          <li>Ícones de interface: Lucide (ISC). Fontes: Familjen Grotesk e Caveat (SIL Open Font License).</li>
          <li>Catálogo de provas: editais e sites oficiais das bancas, ciclo 2027.</li>
        </ul>
        <p className="fraco" style={{ fontSize: 13, marginTop: 12 }}>Aprendice · versão 0.1 (protótipo local)</p>
      </section>
      <Toast texto={toast} aoFechar={() => setToast(null)} />
    </div>
  );
}
