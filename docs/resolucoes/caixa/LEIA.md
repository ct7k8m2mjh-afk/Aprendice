# Caixa de mensagens das sessões para a coordenadora

Decisão do dono (13/11/2026): as sessões não podem ficar pedindo confirmação. Mandar mensagem entre sessões
(send_message) pede aprovação do dono a cada envio, então as sessões NÃO usam send_message.

Para falar com a coordenadora, a sessão acrescenta ao fim de `docs/resolucoes/caixa/<matéria>.md` (ex.: `mat.md`) um bloco:

    ## <data e hora UTC> — <TROCA | PENDENCIAS | AVISO> — <id da sessão>
    <texto: último lote gravado, lotes abertos, pendências com id e motivo>

e faz commit e push junto com o lote (ou sozinho). A coordenadora vigia esta pasta no git e responde abrindo a sessão
nova (TROCA) ou tratando as pendências. Nunca apague blocos antigos.
