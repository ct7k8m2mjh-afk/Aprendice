/**
 * Ícone 3D em tempo real (Three.js). Um único motor WebGL para o app inteiro, fora da tela: desenha cada cena e copia
 * para um quadro dentro do próprio elemento (cartões, destaque da tela inicial); só redesenha quando algo muda.
 * Passar o mouse, focar ou tocar dispara a animação pela função do objeto; arrastar gira. Sem WebGL, mostra `reserva`.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { ChaveCena, Palco } from './cenas3d';

let palco: Promise<Palco | null> | null = null;

function suportaWebGL(): boolean {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

function obterPalco(): Promise<Palco | null> {
  if (palco) return palco;
  if (typeof window === 'undefined' || !suportaWebGL()) return (palco = Promise.resolve(null));
  palco = import('./cenas3d.js').then(async ({ criarPalco }) => {
    const claro = () => document.documentElement.dataset.theme !== 'dark';
    const p = await criarPalco(null, { claro: claro() });
    new MutationObserver(() => p.tema(claro())).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return p;
  }).catch(() => null);
  return palco;
}

export function Icone3D({ chave, className = '', rotulo, reserva, tam }: { chave: ChaveCena; className?: string; rotulo?: string; reserva?: ReactNode; tam?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [sem3d, setSem3d] = useState(false);
  useEffect(() => {
    let vivo = true; let vista: ReturnType<Palco['montar']> = null; let p: Palco | null = null;
    obterPalco().then((pp) => {
      if (!vivo) return;
      if (!pp || !ref.current) { setSem3d(true); return; }
      if (ref.current.closest('a, button')) ref.current.dataset.semgiro = '1';   // dentro de link: arrastar não gira (evita navegar sem querer)
      p = pp; vista = pp.montar(ref.current, chave);
      // o cartão inteiro (link/botão que contém o ícone) também dispara a animação
      const alvo = ref.current.closest('a, button');
      if (alvo && vista) {
        const v = vista; const on = () => { v.ativo = true; }; const off = () => { v.ativo = false; };
        alvo.addEventListener('pointerenter', on); alvo.addEventListener('pointerleave', off); alvo.addEventListener('focus', on); alvo.addEventListener('blur', off);
        limpar = () => { alvo.removeEventListener('pointerenter', on); alvo.removeEventListener('pointerleave', off); alvo.removeEventListener('focus', on); alvo.removeEventListener('blur', off); };
      }
    });
    let limpar = () => {};
    return () => { vivo = false; limpar(); if (p && vista) p.desmontar(vista); };
  }, [chave]);
  if (sem3d) return <>{reserva}</>;
  return <div ref={ref} className={'icone3d ' + className} style={tam ? { width: tam, height: tam } : undefined} role={rotulo ? 'img' : undefined} aria-label={rotulo} aria-hidden={rotulo ? undefined : true} />;
}
