/**
 * Modo administrador (decisão do dono, 20/11/2026): quem entra com papel 'admin' (lido do perfil na nuvem, que só muda
 * por SQL no servidor) vê o site todo liberado — o que fica escondido do aluno aparece com a etiqueta "oculto para o
 * aluno". É só exibição de conteúdo público do site; nada de dado de aluno depende deste sinal.
 */
import { useSyncExternalStore } from 'react';

let admin = false;
const ouvintes = new Set<() => void>();

export function ehAdmin(): boolean { return admin; }

export function defineAdmin(v: boolean) {
  if (v === admin) return;
  admin = v;
  ouvintes.forEach((o) => o());
}

export function inscreveAdmin(o: () => void) { ouvintes.add(o); return () => { ouvintes.delete(o); }; }

export function useAdmin(): boolean { return useSyncExternalStore(inscreveAdmin, ehAdmin, ehAdmin); }

/** texto da etiqueta, o mesmo em todo o site */
export const ETIQUETA_OCULTO = 'oculto para o aluno';
