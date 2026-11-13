# Caixa de mensagens das sessões para a coordenadora

Decisão do dono (13/11/2026): as sessões não podem ficar pedindo confirmação. Mandar mensagem entre sessões
(send_message) pede aprovação do dono a cada envio, então as sessões NÃO usam send_message.

Para falar com a coordenadora, a sessão acrescenta ao fim de `docs/resolucoes/caixa/<matéria>.md` (ex.: `mat.md`) um bloco:

    ## <data e hora UTC> — <FIM | PENDENCIAS | AVISO | ACABOU> — <id da sessão>
    <último lote gravado e lotes abertos; depois uma pendência por linha, com etiqueta:>
    RECLASS <id> <atual> -> <destino>      (destino obrigatório: conteúdo ou matéria+conteúdo)
    PRINT <id> (<prova> q<n>): <o que falta no print>
    DADO <id>: <campo errado na entrada> -> <como está no print>
    GABARITO <id> (<prova> q<n>): <o que conferir e onde>
    ANULAR <id>: <o erro, com a conta ou o fato>
    OBRA | AUTORAL | OUTRA <id>: <motivo>

e faz commit e push junto com o lote (ou sozinho). A coordenadora vigia esta pasta no git e responde abrindo a sessão
nova (FIM; ACABOU = a vaga vai para outra matéria) ou tratando as pendências. Nunca apague blocos antigos.
