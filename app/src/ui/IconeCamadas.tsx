/**
 * Ícone 3D CONSTRUÍDO em camadas (cena do Blender; ver app-atual/design/icones_real/foto3d/camadas.py).
 * Composição: sombra no chão + peças do fundo para a frente, todas no mesmo quadro.
 *
 * A animação ao passar o mouse segue o que o objeto FAZ (camadas.json → "animacao"), nunca desmonta à toa:
 *  - corrente: um pulso de luz sai do polo + da pilha, corre pelo fio até a lâmpada, volta pelo fio de baixo,
 *              e a lâmpada acende mais forte (trajeto e centro do vidro projetados da própria cena 3D);
 *  - inteiro:  o ícone se ergue de leve e a sombra no chão se abre e clareia (objeto saindo do chão).
 */
type Meta = {
  id: string;
  partes: { nome: string; cx: number; cy: number }[];
  animacao?: 'corrente' | 'inteiro';
  trajetos?: Record<string, [number, number][]>;
  pontos?: Record<string, { xy: [number, number]; r: number }>;
};
const IMAGENS = import.meta.glob('../assets/ic3d/*/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const METAS = import.meta.glob('../assets/ic3d/*/camadas.json', { eager: true, import: 'default' }) as Record<string, Meta>;

const ICONES: Record<string, { meta: Meta; sombra: string; partes: { nome: string; src: string }[] }> = {};
for (const [caminho, meta] of Object.entries(METAS)) {
  const pasta = caminho.replace(/camadas\.json$/, '');
  ICONES[meta.id] = { meta, sombra: IMAGENS[pasta + 'sombra.webp'], partes: meta.partes.map((p) => ({ nome: p.nome, src: IMAGENS[pasta + p.nome + '.webp'] })) };
}

export function temCamadas(id: string | undefined): boolean {
  return !!id && !!ICONES[id];
}

const caminho = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(4)} ${y.toFixed(4)}`).join(' ');

export function IconeCamadas({ id, tam, className = '', rotulo }: { id: string; tam?: number; className?: string; rotulo?: string }) {
  const ic = ICONES[id];
  if (!ic) return null;
  const { meta } = ic;
  const anim = meta.animacao || 'inteiro';
  const brilho = meta.pontos?.brilho;
  const trajeto = meta.trajetos ? caminho([...(meta.trajetos.ida || []), ...(meta.trajetos.volta || [])]) : '';
  const uid = 'icc-' + id;
  return (
    <span className={`ic-camadas anim-${anim} ${className}`} style={tam ? { ['--tam' as string]: tam + 'px' } : undefined}
      role={rotulo ? 'img' : undefined} aria-label={rotulo} aria-hidden={rotulo ? undefined : true}>
      <img className="icc-sombra" src={ic.sombra} alt="" draggable={false} />
      <span className="icc-objeto">
        {ic.partes.map((p) => <img key={p.nome} className="icc-peca" src={p.src} alt="" draggable={false} />)}
        {anim === 'corrente' && (
          <svg className="icc-fx" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden>
            <defs>
              <radialGradient id={uid + '-g'}>
                <stop offset="0" stopColor="#fff6c8" stopOpacity=".95" />
                <stop offset=".45" stopColor="#ffd34a" stopOpacity=".55" />
                <stop offset="1" stopColor="#ffb000" stopOpacity="0" />
              </radialGradient>
            </defs>
            {brilho && <circle className="icc-luz" cx={brilho.xy[0]} cy={brilho.xy[1]} r={brilho.r * 1.25} fill={`url(#${uid}-g)`} />}
            {trajeto && <path className="icc-pulso" d={trajeto} pathLength={1} />}
            {trajeto && <path className="icc-pulso p2" d={trajeto} pathLength={1} />}
          </svg>
        )}
      </span>
    </span>
  );
}
