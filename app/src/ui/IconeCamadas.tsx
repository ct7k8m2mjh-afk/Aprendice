/**
 * Ícone 3D CONSTRUÍDO em camadas (cena do Blender com cada peça renderizada separadamente; ver
 * app-atual/design/icones_real/foto3d/camadas.py). Composição: sombra no chão + peças do fundo para a frente.
 * Ao passar o mouse (ou focar o cartão que o contém), cada peça se afasta um pouco do centro do ícone e
 * a sombra se abre junto, como se o objeto se "desmontasse" — sem sair do lugar no chão.
 */
const IMAGENS = import.meta.glob('../assets/ic3d/*/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const METAS = import.meta.glob('../assets/ic3d/*/camadas.json', { eager: true, import: 'default' }) as Record<string, { id: string; partes: { nome: string; cx: number; cy: number }[] }>;

const ICONES: Record<string, { sombra: string; partes: { nome: string; src: string; dx: number; dy: number }[] }> = {};
for (const [caminho, meta] of Object.entries(METAS)) {
  const pasta = caminho.replace(/camadas\.json$/, '');
  ICONES[meta.id] = {
    sombra: IMAGENS[pasta + 'sombra.webp'],
    partes: meta.partes.map((p) => ({ nome: p.nome, src: IMAGENS[pasta + p.nome + '.webp'], dx: p.cx - 0.5, dy: p.cy - 0.5 })),
  };
}

export function temCamadas(id: string | undefined): boolean {
  return !!id && !!ICONES[id];
}

export function IconeCamadas({ id, tam, className = '', rotulo }: { id: string; tam?: number; className?: string; rotulo?: string }) {
  const ic = ICONES[id];
  if (!ic) return null;
  return (
    <span className={'ic-camadas ' + className} style={tam ? { ['--tam' as string]: tam + 'px' } : undefined} role={rotulo ? 'img' : undefined} aria-label={rotulo} aria-hidden={rotulo ? undefined : true}>
      <img className="icc-sombra" src={ic.sombra} alt="" draggable={false} />
      {ic.partes.map((p, i) => (
        <img key={p.nome} className="icc-peca" src={p.src} alt="" draggable={false}
          style={{ ['--dx' as string]: p.dx.toFixed(3), ['--dy' as string]: p.dy.toFixed(3), ['--i' as string]: i }} />
      ))}
    </span>
  );
}
