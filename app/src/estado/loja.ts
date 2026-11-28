/**
 * Loja do estado do aluno: um objeto só, salvo no aparelho.
 * Hoje: localStorage (web e WebView do Capacitor). A troca por armazenamento nativo ou nuvem
 * acontece só aqui — o resto do app usa useEstado()/atualiza().
 */
import { useSyncExternalStore } from 'react';
import type { Estado, EstadoMateria } from './tipos';
import { estadoMateriaVazio, estadoVazio } from './tipos';
import { migraDoNavegador, migraEstado, VERSAO_ATUAL } from './migracao';
import type { MateriaId } from '../dados/tipos';

export const CHAVE = 'aprendice.v1';
const CHAVE_BACKUP = 'aprendice.v1.anterior';

function lerLS(k: string): string | null { try { return localStorage.getItem(k); } catch { return null; } }
function gravarLS(k: string, v: string): boolean { try { localStorage.setItem(k, v); return true; } catch { return false; } }

let migrou = false;

function carrega(): Estado {
  const bruto = lerLS(CHAVE);
  let e = estadoVazio();
  if (bruto) {
    try {
      const d = JSON.parse(bruto) as Estado;
      if (d && typeof d.versao === 'number' && d.versao >= 1 && d.versao <= VERSAO_ATUAL) {
        // formato antigo: guarda uma cópia intacta antes de migrar (princípio 7), uma vez por versão
        if (d.versao < VERSAO_ATUAL && !lerLS(CHAVE + '.antes-v' + VERSAO_ATUAL)) gravarLS(CHAVE + '.antes-v' + VERSAO_ATUAL, bruto);
        migrou = d.versao < VERSAO_ATUAL;
        e = migraEstado({ ...estadoVazio(), ...d, versao: d.versao, pref: { ...estadoVazio().pref, ...d.pref } });
      }
    } catch {
      // arquivo corrompido: guarda uma cópia antes de qualquer coisa, para nunca perder
      gravarLS(CHAVE + '.corrompido.' + Date.now(), bruto);
    }
  }
  return migraDoNavegador(e, lerLS);
}

let estado: Estado = carrega();
const ouvintes = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | null = null;
export let falhouSalvar = false;

function salvaJa() {
  timer = null;
  const txt = JSON.stringify(estado);
  const anterior = lerLS(CHAVE);
  if (anterior && anterior !== txt) gravarLS(CHAVE_BACKUP, anterior);
  falhouSalvar = !gravarLS(CHAVE, txt);
}

// estado migrado de uma versão antiga: grava já no formato novo (a cópia antiga ficou em CHAVE.antes-vN)
if (migrou) setTimeout(salvaJa, 0);

export function atualiza(f: (e: Estado) => Estado) {
  const antes = estado;
  estado = f(estado);
  // marca a mudança do aluno (desempate ao juntar com a nuvem, estado/mescla.ts)
  if (estado !== antes && estado.mexidoEm === antes.mexidoEm) estado = { ...estado, mexidoEm: Date.now() };
  avisa();
}

/** Troca o estado inteiro sem marcar como mudança do aluno (o estado juntado com a nuvem já traz o seu mexidoEm). */
export function substituiSemMarcar(novo: Estado) {
  estado = novo;
  avisa();
}

/** Grava já, sem esperar (antes de sair da conta). */
export function salvaAgora() { if (timer) clearTimeout(timer); salvaJa(); }

/** Sair da conta (contas de verdade, 20/11/2026): o progresso desta conta sai do aparelho (já está na nuvem, ou numa
 *  cópia pendente da própria conta) e a cópia de segurança do arquivo anterior também, para outra pessoa no mesmo
 *  aparelho não ver nada. Tema e preferências do aparelho ficam. */
export function limpaAparelho(copiasTambem = true, manter: Partial<Estado> = {}) {
  const pref = estado.pref;
  estado = { ...estadoVazio(), pref, ...manter };
  ouvintes.forEach((o) => o());
  if (timer) clearTimeout(timer);
  salvaJa();
  try {
    localStorage.removeItem(CHAVE_BACKUP);
    // cópias de segurança antigas (zerado, antes de migrar, corrompido): só com o progresso já guardado na conta
    if (copiasTambem) for (const k of Object.keys(localStorage)) if (k.startsWith(CHAVE + '.')) localStorage.removeItem(k);
  } catch { /* sem armazenamento */ }
}

function avisa() {
  ouvintes.forEach((o) => o());
  if (timer) clearTimeout(timer);
  timer = setTimeout(salvaJa, 300);
}

export function atualizaMateria(m: MateriaId, f: (s: EstadoMateria) => EstadoMateria) {
  atualiza((e) => ({ ...e, materias: { ...e.materias, [m]: f(e.materias[m] || estadoMateriaVazio()) } }));
}

export function pegaEstado(): Estado { return estado; }

export function substitui(novo: Estado) { atualiza(() => novo); }

export function zera() {
  gravarLS(CHAVE + '.zerado.' + Date.now(), JSON.stringify(estado));
  const perfil = estado.perfil, pref = estado.pref;
  atualiza(() => ({ ...estadoVazio(), perfil, pref, migradoDe: estado.migradoDe, conta: estado.conta }));
}

export function inscreve(o: () => void) { ouvintes.add(o); return () => { ouvintes.delete(o); }; }

export function useEstado(): Estado {
  return useSyncExternalStore(inscreve, () => estado, () => estado);
}

export function useMateriaEstado(m: MateriaId): EstadoMateria {
  const e = useEstado();
  return e.materias[m] || VAZIO;
}
const VAZIO = estadoMateriaVazio();

// outra aba abriu e salvou: recarrega o estado (sem perder o desta aba: o último a salvar vence por objeto)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (ev) => {
    if (ev.key !== CHAVE || !ev.newValue) return;
    try { estado = migraEstado(JSON.parse(ev.newValue)); ouvintes.forEach((o) => o()); } catch { /* ignora */ }
  });
  window.addEventListener('pagehide', () => { if (timer) { clearTimeout(timer); salvaJa(); } });
}
