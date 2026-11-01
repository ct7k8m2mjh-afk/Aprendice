/**
 * Loja do estado do aluno: um objeto só, salvo no aparelho.
 * Hoje: localStorage (web e WebView do Capacitor). A troca por armazenamento nativo ou nuvem
 * acontece só aqui — o resto do app usa useEstado()/atualiza().
 */
import { useSyncExternalStore } from 'react';
import type { Estado, EstadoMateria } from './tipos';
import { estadoMateriaVazio, estadoVazio } from './tipos';
import { migraDoNavegador } from './migracao';
import type { MateriaId } from '../dados/tipos';

export const CHAVE = 'aprendice.v1';
const CHAVE_BACKUP = 'aprendice.v1.anterior';

function lerLS(k: string): string | null { try { return localStorage.getItem(k); } catch { return null; } }
function gravarLS(k: string, v: string): boolean { try { localStorage.setItem(k, v); return true; } catch { return false; } }

function carrega(): Estado {
  const bruto = lerLS(CHAVE);
  let e = estadoVazio();
  if (bruto) {
    try {
      const d = JSON.parse(bruto) as Estado;
      if (d && d.versao === 1) e = { ...estadoVazio(), ...d, pref: { ...estadoVazio().pref, ...d.pref } };
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

export function atualiza(f: (e: Estado) => Estado) {
  estado = f(estado);
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
  atualiza(() => ({ ...estadoVazio(), perfil, pref, migradoDe: estado.migradoDe }));
}

function inscreve(o: () => void) { ouvintes.add(o); return () => ouvintes.delete(o); }

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
    try { estado = JSON.parse(ev.newValue); ouvintes.forEach((o) => o()); } catch { /* ignora */ }
  });
  window.addEventListener('pagehide', () => { if (timer) { clearTimeout(timer); salvaJa(); } });
}
