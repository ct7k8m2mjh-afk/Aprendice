# APRENDICE: o app (site + iPhone + Android)

Uma base de código só. Hoje roda **localmente**: sem servidor, sem banco na nuvem, sem login real, sem publicar nada. O progresso fica salvo no aparelho; o login e a correção por IA são simulados.

## Tecnologia (em uma frase cada)
- **React + TypeScript**: o app é feito de peças (telas e componentes), e o TypeScript aponta erros antes de o aluno vê-los.
- **Vite**: monta o site e abre a versão de desenvolvimento.
- **Capacitor**: empacota o mesmo site como app de iPhone e de Android.

## Como rodar no seu computador
É preciso ter o **Node.js** (versão 20 ou mais nova) e o **Python 3** com a biblioteca Pillow.

```bash
cd app
```

```bash
npm install
```

```bash
npm run conteudo
```

Esse passo converte o conteúdo do `app-atual/` para o formato do app. Leva poucos segundos e gera `public/conteudo/`, com cerca de 170 MB.

```bash
npm run dev
```

Depois abra http://localhost:5173 no navegador.

## Prévia de arquivo único
O comando abaixo gera `dist-previa/index.html`: um arquivo só, que abre com dois cliques, sem instalar nada.

```bash
npm run previa
```

Ele traz todas as matérias e todas as telas. Os prints originais ficam só em alguns conteúdos por matéria, para o arquivo caber em cerca de 14 MB. Nos demais, a questão aparece em texto, com um aviso.

## Testes

```bash
npm test
```

São 62 testes. Eles conferem:
- integridade do conteúdo: mesmas questões e mesmos ids do protótipo, gabarito, fonte, print e resolução;
- correção local;
- revisão espaçada;
- níveis de dificuldade e feedback por nível;
- migração do progresso.

```bash
node scripts/fluxo.cjs
```

Com o `npm run dev` rodando, esse script percorre no navegador os fluxos principais, como um aluno:
1. boas-vindas;
2. responder uma questão;
3. recarregar e conferir que o progresso ficou;
4. revisão;
5. flashcard;
6. treino geral;
7. simulados (só prova inteira);
8. importação do progresso do protótipo;
9. tema escuro e busca.

```bash
DEMO=1 node scripts/prints.cjs pasta-de-saida
```

Tira os prints de todas as telas nos temas claro e escuro, em celular (390 px) e computador. Com `DEMO=1`, usa progresso de demonstração.

## Gerar os apps de celular
```bash
npm run build
```

```bash
npx cap add android
```

```bash
npx cap add ios
```

- O **Android** abre no Android Studio, a partir da pasta `android/`.
- O **iPhone** precisa de um Mac com Xcode, a partir da pasta `ios/`.

Este ambiente de nuvem não tem o Android SDK nem o Xcode, então os apps instaláveis ainda não foram gerados.

## Onde está cada coisa
| Pasta | O que tem |
|---|---|
| `scripts/converte.py` | conversor do protótipo; os ids nunca mudam |
| `conteudo-fonte/catalogo-vestibulares.json` | catálogo nacional de 47 provas de Medicina, com fonte |
| `src/dados/` | tipos do conteúdo, carregamento, matérias (cores) e provas |
| `src/estado/` | progresso do aluno: loja, formato salvo e migração do protótipo |
| `src/logica/` | correção local, revisão espaçada, estatísticas, simulados e IA simulada |
| `src/telas/` | uma tela por arquivo |
| `src/ui/` | peças comuns: casca, ícones, questão, resolução e cartões |
| `src/estilo/` | visual herdado do protótipo: tokens, componentes e telas |

## Trocar o "simulado" pelo real, depois
- **Login**: hoje é `perfil` no `src/estado/loja.ts`. A troca é por contas reais, por exemplo Supabase Auth.
- **Progresso**: a gravação está concentrada em `src/estado/loja.ts`, na função `salvaJa`. É ali que entra a sincronização com a nuvem.
- **IA**: `src/logica/ia.ts` tem a mesma interface que a correção real terá.
