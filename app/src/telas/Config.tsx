import { useConta } from '../estado/sessao';
import { Link } from 'react-router-dom';
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
  const comConta = useConta().fase !== 'local';
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
        <p className="miolo cfg-tema-aparelho">No celular e no tablet, o tema segue o do aparelho.</p>
        <div className="chips cfg-tema-escolha" role="radiogroup" aria-label="Tema claro ou escuro">
          {([['claro', 'Claro', 'sol'], ['escuro', 'Escuro', 'lua'], ['sistema', 'Igual ao aparelho', 'config']] as const).map(([v, t, ic]) => (
            <button key={v} role="radio" aria-checked={tema === v} className="chip" onClick={() => defineTema(v)}><Icone nome={ic} tam={15} /> {t}</button>
          ))}
        </div>
      </section>

      <section className="bloco secao">
        <h2 className="sec-tit">Meus dados</h2>
        <p className="miolo">{!comConta ? 'Seu progresso fica salvo neste aparelho.' : 'Seu progresso fica salvo na sua conta e neste aparelho: funciona sem internet e é enviado quando a conexão volta.'} Baixe uma cópia de vez em quando ou traga o progresso de outro aparelho ou do protótipo antigo: a importação junta tudo e não apaga nada.</p>
        <div className="dados-acoes">
          <button className="btn sec" onClick={exporta}><Icone nome="download" /> Baixar meu progresso</button>
          <button className="btn sec" onClick={() => arq.current?.click()}><Icone nome="upload" /> Importar progresso</button>
          <input ref={arq} type="file" accept="application/json,.json" hidden onChange={(ev) => { const f = ev.target.files?.[0]; if (f) importa(f); ev.target.value = ''; }} />
        </div>
        <p className="fraco" style={{ fontSize: 14 }}>Aceita o arquivo do Aprendice e os arquivos “Baixar meu progresso” do protótipo (uma matéria por arquivo).{e.migradoDe.length ? (e.migradoDe.length === 1 ? ' Progresso da versão anterior importado deste navegador: 1 matéria.' : ` Progresso da versão anterior importado deste navegador: ${e.migradoDe.length} matérias.`) : ''}</p>
        <div className="zona-perigo">
          {!zerando ? <button className="btn fantasma" onClick={() => setZerando(true)}><Icone nome="lixo" /> Zerar progresso</button> : (
            <div className="confirma-zera">
              <p><b>Zerar todo o progresso?</b>{comConta ? ' As estatísticas recomeçam do zero, também na sua conta. Uma cópia de segurança fica guardada neste aparelho.' : ' Uma cópia de segurança fica guardada neste aparelho, mas as estatísticas recomeçam do zero.'}</p>
              <div className="fc-acoes"><button className="btn sec" onClick={() => setZerando(false)}>Cancelar</button><button className="btn perigo" onClick={() => { zera(); setZerando(false); setToast('Progresso zerado. A cópia de segurança ficou guardada.'); }}>Zerar</button></div>
            </div>
          )}
        </div>
      </section>

      <section className="bloco secao">
        <h2 className="sec-tit">Correção dos flashcards</h2>
        <p className="miolo">Nesta versão, a correção é feita no próprio aparelho, comparando ideias-chave e valores numéricos. Nada do que você escreve sai daqui. Se no futuro a correção usar inteligência artificial, a resposta será enviada sem nome nem e-mail.</p>
      </section>

      <section className="bloco secao">
        <h2 className="sec-tit">Atalhos de teclado</h2>
        <dl className="atalhos">
          <div><dt><kbd>A</kbd>–<kbd>E</kbd> ou <kbd>1</kbd>–<kbd>5</kbd></dt><dd>escolher alternativa</dd></div>
          <div><dt><kbd>Shift</kbd> + letra</dt><dd>riscar alternativa</dd></div>
          <div><dt><kbd>Enter</kbd></dt><dd>confirmar / próxima</dd></div>
          <div><dt><kbd>H</kbd></dt><dd>dica</dd></div>
          <div><dt><kbd>P</kbd></dt><dd>pausar o cronômetro</dd></div>
          <div><dt><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd></dt><dd>flashcard: errei, quase, acertei</dd></div>
          <div><dt><kbd>Ctrl</kbd> + <kbd>K</kbd></dt><dd>buscar</dd></div>
          <div><dt><kbd>Esc</kbd></dt><dd>sair da questão ou fechar</dd></div>
        </dl>
      </section>

      <section className="bloco secao">
        <h2 className="sec-tit">Privacidade</h2>
        <p className="miolo">{comConta
          ? 'Seu e-mail, perfil de estudo e progresso ficam na sua conta; cada conta só lê os próprios dados. Sem anúncios, sem rastreamento, fontes hospedadas no próprio site. Detalhes em'
          : 'Sem servidor nesta versão: nenhum dado pessoal é enviado a ninguém. Sem anúncios, sem rastreamento, fontes hospedadas no próprio site. Você pode baixar seu progresso aqui e apagar tudo em Perfil, no botão “Excluir minha conta”. Detalhes em'} <Link to="/privacidade" state={{ voltar: '/config' }}>Privacidade</Link>.</p>
      </section>

      <section className="bloco secao">
        <h2 className="sec-tit">Créditos e fontes</h2>
        <ul className="creditos">
          <li>Questões de prova: cada uma é das instituições e bancas que fizeram a prova, e o crédito aparece embaixo do print, com o link do site oficial (por exemplo, “© Inep · ENEM 2024”). Bancas das provas do site: Inep (ENEM), Vunesp (Unesp, Unifesp, Einstein, Santa Casa, São Camilo, Famema, Famerp, FMJ, FMABC, Anhembi Morumbi, UEA e UERR 2021), Fuvest, Comvest (Unicamp), DSEA (UERJ), Coperves (UFSM), Cebraspe e CPCV (UERR), FGV, Centro Paula Souza (Fatec), Fundação Cecierj (Cederj), Feluma (Ciências Médicas MG), NucVest (PUC‑SP), Acafe, ITA, IME, Mackenzie, PUC‑Rio, PUC‑Campinas, PUC Minas, PUCPR, PUCRS, e as comissões de UECE, URCA, UEG, UDESC, UPE, UFU, UFPR, UFT, UNIRG, Ipefae, Unicentro, UEL, UFAM, UEMA, UFJF, Unespar, Unimontes, UNEMAT, UVA, UTFPR, Unioeste, Unitins, UFRR, Unifor, EMESCAM, Fema, UEMG, Instituto AOCP, UFG e Sírio‑Libanês. Textos, imagens e gráficos que a banca citou dentro da prova continuam com o crédito que ela deu no caderno.</li>
          <li>Base legal: as questões aparecem como citação para fins de estudo, com o nome do autor e a origem da obra (Lei 9.610/98, art. 46, III; nome do autor, art. 24, II). Cada questão traz o crédito da banca e da prova (“© banca · prova ano”), com link para o site oficial da banca; na aba Fonte estão a prova, o ano, a fase, o número da questão e a banca. O gabarito é o oficial publicado pela banca ou, quando a banca não publicou, o gabarito do Aprendice, conferido por dois especialistas e sempre identificado. Resoluções, teoria, flashcards e revisões são escritos pelo Aprendice. As Questões Aprendice são criadas pelo site e aparecem com esse nome.</li>
          <li>Revisões em slides: escritas com palavras próprias a partir dos livros PV (Poliedro) de Biologia, Química, Física, História, Geografia, Língua Inglesa, Filosofia e Sociologia; cada slide traz o livro e a página.</li>
          <li>Fotos, pinturas e mapas das revisões: Wikimedia Commons, com autor, licença e link em cada imagem; reproduzidas em tamanho reduzido e em WebP, sem outra alteração. Licenças: domínio público, <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.pt-br" target="_blank" rel="noreferrer noopener">CC0</a>, <a href="https://creativecommons.org/licenses/by/4.0/deed.pt-br" target="_blank" rel="noreferrer noopener">CC BY</a> (2.0, 2.5, 3.0 e 4.0) e <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br" target="_blank" rel="noreferrer noopener">CC BY-SA</a> (2.0, 2.5, 3.0 e 4.0), que pedem o nome do autor, o link da licença e a indicação de alteração; as em CC BY-SA continuam na mesma licença.</li>
          <li>Ilustrações de flashcards e de figuras de Biologia e Química: Servier Medical Art (Les Laboratoires Servier), <a href="https://creativecommons.org/licenses/by/3.0/deed.pt" target="_blank" rel="noreferrer noopener">CC BY 3.0</a>, adaptadas pelo Aprendice (números e chamadas acrescentados); ícones de DBCLS, Helicase_11 e Frédéric Bouché, <a href="https://creativecommons.org/licenses/by/4.0/deed.pt-br" target="_blank" rel="noreferrer noopener">CC BY 4.0</a>, e ícones CC0, todos pelo repositório Bioicons; ícones Phosphor (MIT) em duas figuras de Português. As demais figuras são desenhadas pelo Aprendice, com dados públicos (IBGE, NIST, CRC Handbook) indicados na legenda.</li>
          <li>Logos guardados para os simulados (ainda não exibidos): Fuvest, de FUVEST (Wikimedia Commons, <a href="https://creativecommons.org/licenses/by/3.0/deed.pt" target="_blank" rel="noreferrer noopener">CC BY 3.0</a>); Centro Universitário São Camilo, de Paulo Marcondes Salles (Wikimedia Commons, licença de atribuição). As marcas são das instituições.</li>
          <li>Ícones de interface: Lucide (ISC; Copyright Lucide Icons and Contributors e Cole Bemis). Fontes: Familjen Grotesk, Dancing Script, Literata, Caveat e DM Sans (SIL Open Font License 1.1; Copyright de cada projeto). Textos completos das licenças: <a href="licencas.txt" target="_blank" rel="noreferrer noopener">avisos de licença</a>.</li>
          <li>Catálogo de provas: editais e sites oficiais das bancas, ciclo 2027.</li>
        </ul>
        <p className="fraco" style={{ fontSize: 14, marginTop: 12 }}>{comConta ? 'Aprendice · progresso salvo na sua conta e neste aparelho' : 'Aprendice · progresso salvo neste aparelho'}</p>
      </section>
      <Toast texto={toast} aoFechar={() => setToast(null)} />
    </div>
  );
}
