# Próximo passo: trazer provas completas (rede liberada)

## 1. Liberar a rede (o dono faz, uma vez)
1. Na barra de título da sessão, abra o menu do ambiente e clique em **Edit**.
2. Em **Network access**, escolha uma das duas opções:
   - **Acesso total** (recomendado nesta fase: são dezenas de sites de universidades); ou
   - **Limitado**, colando em **Allowed domains** os domínios abaixo e mantendo marcada a caixa **Allow package managers**.
3. Abra uma **sessão nova**. A mudança só vale em sessões novas.

Passo a passo oficial: https://code.claude.com/docs/en/cloud-environments#network-access

Domínios oficiais tirados do catálogo (`app/conteudo-fonte/catalogo-vestibulares.json`), um por linha:

```
gov.br
fuvest.br
vunesp.com.br
unesp.br
unicamp.br
unifesp.br
famerp.br
famema.br
fcmsantacasasp.edu.br
saocamilo-sp.br
fmabc.br
fmj.br
puc-campinas.edu.br
pucsp.br
cmmg.edu.br
unifenas.br
unimontes.br
uerj.br
emescam.br
uel.br
ufpr.br
uem.br
uepg.br
unioeste.br
pucpr.br
ufsc.br
acafe.org.br
ufrgs.br
upe.br
upe.pe.gov.br
bahiana.edu.br
uefs.br
uneb.br
uesb.br
uncisal.edu.br
uece.br
uema.br
unifor.br
uern.br
uea.edu.br
uepa.br
ufam.edu.br
uerr.edu.br
uft.edu.br
unb.br
cebraspe.org.br
ufg.br
ueg.br
uems.br
```

## 2. O que a sessão nova faz (roteiro já aprovado pelo dono)
Seguir a linha de produção de `docs/fabrica-de-conteudo-api.md`.

1. **Ingestão (sem IA).** Baixar da fonte oficial o caderno de prova e o gabarito oficial. Respeitar o robots.txt e não fazer download em massa sem pausa.
2. **Recorte.** Gerar um print fiel por questão, com o número, a página e o link do PDF. Conferir o recorte por amostra.
3. **Gabarito.** Ligar cada questão ao gabarito oficial. Questão anulada ou sem gabarito publicado não entra.
4. **Banco.** Gravar as questões no formato de `app/src/dados/tipos.ts` com ids novos e estáveis (`P` + hash do PDF e do número). Matérias novas: `fis`, `his`, `geo`, `ing`, `fil`. As provas aparecem sozinhas no app como simulados por prova (`app/src/dados/provas.ts`, função `edicoes`).
5. **Classificação e resoluções.** Feitas depois, pela fábrica de conteúdo, com revisão em lentes. Até lá o simulado funciona só com gabarito, e a resolução aparece como "em revisão".

**Onda 1:** uma prova recente completa de cada região, nesta ordem:
- ENEM (INEP)
- Fuvest
- Unesp
- Unicamp
- UEL
- UFPR
- Acafe
- UFRGS
- Uerj
- UPE
- Bahiana
- UEA
- UnB
