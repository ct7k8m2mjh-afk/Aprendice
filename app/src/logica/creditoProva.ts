/**
 * Crédito de direito autoral da questão de prova, na barra de baixo do print (pedido do dono de 27/11/2026: "dê direito a
 * tudo que é necessário e obrigatório"; Lei 9.610/98, art. 46, III: citação para estudo "indicando-se o nome do autor e a
 * origem da obra", e art. 24, II: o nome do autor na utilização da obra).
 *
 * Decisão do dono (27/11/2026): o crédito é curto ("© Inep · ENEM 2024") e o link vai SÓ ao site oficial da banca ou da
 * fundação dona da prova, nunca ao lugar exato de onde o arquivo foi tirado (PDF de cursinho, Drive etc.). O mesmo vale
 * para o ícone do topo da questão sem print, a aba Fonte e o rodapé da correção. O link do arquivo e o nome de quem
 * publicou a cópia ficam só no registro interno (`url`, `origem`, logica/origemLink.ts `nome`; princípio 10).
 *
 * A banca vem do campo `banca` da questão (quem aplicou aquela edição: Vunesp na FMJ, na São Camilo e na UEA; Cebraspe na
 * UERR de 2023, 2025 e 2026; Comvest na Unicamp...). Sites conferidos na web em 27/11/2026.
 */
import type { Questao } from '../dados/tipos';

interface Banca { nome: string; site: string }

/** banca (como está nos dados) → nome curto do crédito e site oficial */
const BANCAS: Record<string, Banca> = {
  'Inep': { nome: 'Inep', site: 'https://www.gov.br/inep/pt-br' },
  'INEP': { nome: 'Inep', site: 'https://www.gov.br/inep/pt-br' },
  'Vunesp': { nome: 'Vunesp', site: 'https://www.vunesp.com.br/' },
  'Fuvest': { nome: 'Fuvest', site: 'https://www.fuvest.br/' },
  'Comvest': { nome: 'Comvest', site: 'https://www.comvest.unicamp.br/' },
  'CEV-UECE': { nome: 'CEV-UECE', site: 'https://www.uece.br/cev/' },
  'CEV-URCA': { nome: 'CEV-URCA', site: 'https://www.urca.br/cev/' },
  'Unitins': { nome: 'Unitins', site: 'https://www.unitins.br/' },
  'Núcleo de Seleção UEG': { nome: 'UEG', site: 'https://www.nucleodeselecao.ueg.br/' },
  'Covest-UDESC': { nome: 'UDESC', site: 'https://www.udesc.br/vestibular' },
  'Acafe': { nome: 'Acafe', site: 'https://www.acafe.org.br/' },
  'UPE': { nome: 'UPE', site: 'https://processodeingresso.upe.pe.gov.br/' },
  'UERJ (DSEA)': { nome: 'UERJ', site: 'https://www.vestibular.uerj.br/' },
  'DIRPS-UFU': { nome: 'DIRPS-UFU', site: 'https://www.portalselecao.ufu.br/' },
  'NC-UFPR': { nome: 'NC-UFPR', site: 'https://www.nc.ufpr.br/' },
  'Centro Paula Souza': { nome: 'CPS', site: 'https://www.cps.sp.gov.br/' },
  'Fundação Cecierj': { nome: 'Cecierj', site: 'https://www.cecierj.edu.br/' },
  'Copese/UFT': { nome: 'Copese-UFT', site: 'https://www.uft.edu.br/copese' },
  'UNIRG': { nome: 'UNIRG', site: 'https://www.unirg.edu.br/' },
  'PUCPR': { nome: 'PUCPR', site: 'https://www.pucpr.br/' },
  'Coorps-Unicentro': { nome: 'Unicentro', site: 'https://www3.unicentro.br/vestibular/' },
  'Feluma': { nome: 'Feluma', site: 'https://vestibular.cmmg.edu.br/' },
  'Coperves-UFSM': { nome: 'UFSM', site: 'https://www.ufsm.br/' },
  'CPV/UFRR': { nome: 'UFRR', site: 'https://www.ufrr.br/cpv' },
  'ITA': { nome: 'ITA', site: 'https://vestibular.ita.br/' },
  'Cops-UEL': { nome: 'Cops-UEL', site: 'https://www.cops.uel.br/' },
  'PUC-Rio': { nome: 'PUC-Rio', site: 'https://www.puc-rio.br/' },
  'PUC-Campinas': { nome: 'PUC-Campinas', site: 'https://vestibular.puc-campinas.edu.br/' },
  'Compec-UFAM': { nome: 'Compec-UFAM', site: 'https://compec.ufam.edu.br/' },
  'UEMA (ASCONS)': { nome: 'UEMA', site: 'https://www.paes.uema.br/' },
  'PUC Minas': { nome: 'PUC Minas', site: 'https://www.pucminas.br/' },
  'Mackenzie': { nome: 'Mackenzie', site: 'https://www.mackenzie.br/vestibular' },
  'FGV': { nome: 'FGV', site: 'https://conhecimento.fgv.br/' },
  'PUCRS': { nome: 'PUCRS', site: 'https://portal.pucrs.br/' },
  'Unifor (CPPS)': { nome: 'Unifor', site: 'https://unifor.br/' },
  'IME': { nome: 'IME', site: 'http://www.ime.eb.mil.br/' },
  'Copese-UFJF': { nome: 'Copese-UFJF', site: 'https://www2.ufjf.br/copese/' },
  'CCCV-Unespar': { nome: 'Unespar', site: 'https://vestibular.unespar.edu.br/' },
  'Ipefae': { nome: 'Ipefae', site: 'https://www.ipefae.org.br/' },
  'Cebraspe': { nome: 'Cebraspe', site: 'https://www.cebraspe.org.br/' },
  'Cotec-Unimontes': { nome: 'Unimontes', site: 'https://www.coteps.unimontes.br/' },
  'Covest-UNEMAT': { nome: 'UNEMAT', site: 'https://unemat.br/site/vestibular' },
  'CCV-UVA': { nome: 'UVA', site: 'https://www.uvanet.br/' },
  'UTFPR': { nome: 'UTFPR', site: 'https://www.utfpr.edu.br/' },
  'NucVest': { nome: 'NucVest', site: 'https://www.nucvest.com.br/' },
  'Cogeps-Unioeste': { nome: 'Unioeste', site: 'https://www.unioeste.br/' },
  'UERR (CPCV)': { nome: 'UERR', site: 'https://www.uerr.edu.br/' },
  'EMESCAM': { nome: 'EMESCAM', site: 'https://emescam.br/' },
  // o Centro de Seleção da UFG virou o Instituto Verbena (mesmo órgão, site novo)
  'UFG/Centro de Seleção': { nome: 'UFG', site: 'https://institutoverbena.ufg.br/' },
  'Fema': { nome: 'Fema', site: 'https://www.fema.edu.br/' },
  'Instituto AOCP': { nome: 'Instituto AOCP', site: 'https://www.institutoaocp.org.br/' },
  'UEMG': { nome: 'UEMG', site: 'https://www.uemg.br/' },
  'Sírio-Libanês': { nome: 'Sírio-Libanês', site: 'https://www.hospitalsiriolibanes.org.br/' },
};

/** questão sem banca registrada: a instituição da prova, quando é conhecida */
const ESCOLAS: Record<string, Banca> = {
  'Santa Casa (FCMSCSP)': { nome: 'Santa Casa', site: 'https://fcmsantacasasp.edu.br/' },
};

const limpa = (x: string | undefined) => (x || '').replace(/\s+/g, ' ').trim();

/** nome da prova curto na barra, para caber em 390 px (o nome inteiro continua na aba Fonte e nas etiquetas) */
const PROVA_CURTA: Record<string, string> = { 'Albert Einstein': 'Einstein', 'Anhembi Morumbi': 'Anhembi' };

export interface CreditoProva { texto: string; site: string | null; titulo: string }

/** "© Inep · ENEM 2024" (o nome da prova só aparece quando é outro que o da banca: "© Fuvest 2024") */
export function creditoProva(q: Pick<Questao, 'banca' | 'escola' | 'ano'>): CreditoProva {
  const banca = limpa(q.banca);
  // nome curto da prova na barra ("Santa Casa (FCMSCSP)" → "Santa Casa"): o texto cabe no celular; o nome inteiro fica na aba Fonte
  const nomeProva = limpa(q.escola).replace(/\s*\([^)]*\)\s*$/, '');
  const escola = PROVA_CURTA[nomeProva] || nomeProva;
  const ano = limpa(q.ano);
  const b = BANCAS[banca] || ESCOLAS[limpa(q.escola)] || null;
  const nome = b ? b.nome : banca || escola;
  const prova = [escola && escola !== nome ? escola : '', ano].filter(Boolean).join(' ');
  const texto = `© ${nome}${prova ? (escola && escola !== nome ? ' · ' : ' ') + prova : ''}`;
  return { texto, site: b ? b.site : null, titulo: b ? `Site oficial da banca: ${nome}` : texto };
}
