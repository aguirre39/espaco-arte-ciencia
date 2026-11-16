# Guia de Manutenção Editorial — Espaço Arte-Ciência

Toda a agenda de seminários, a equipe de profissionais e os contatos de WhatsApp estão centralizados em arquivos JSON dentro de `src/data/` e `src/content/seminarios/`. **Não há duplicação manual de eventos no HTML**: qualquer edição nos arquivos de dados atualiza automaticamente a Página Principal (`/`), a central `Atividades do Espaço` (`/cursos-e-seminários/`), a página individual do seminário (`/seminarios/<slug>/`) e o `sitemap.xml` ao executar o build.

---

## 1. Como Adicionar um Novo Seminário

1. Crie um novo arquivo `.json` na pasta `src/content/seminarios/` seguindo o padrão de nome `AAAA-MM-DD-slug-do-seminario.json` (exemplo: `2027-03-15-alquimia-e-individuacao.json`).
2. Preencha os campos conforme o modelo validado abaixo:

```json
{
  "id": "sem-2027-03-15-alquimia",
  "slug": "alquimia-e-individuacao-em-jung",
  "titulo": "Alquimia e Individuação na Obra de C. G. Jung",
  "tipo": "Seminário Temático",
  "ano": 2027,
  "resumo": "Resumo objetivo de uma frase sobre a proposta do seminário.",
  "descricao": "Descrição completa sobre o tema e a abordagem na perspectiva de C. G. Jung e Marie-Louise von Franz.",
  "publicoAlvo": "Estudantes, pesquisadores e interessados na Psicologia Analítica.",
  "topicos": [
    "Primeiro eixo temático confirmado",
    "Segundo eixo temático confirmado"
  ],
  "data": "2027-03-15",
  "horario": null,
  "fuso": "America/Sao_Paulo",
  "modalidade": "a_confirmar",
  "modalidadeTextoPublico": "Consulte os detalhes pelo WhatsApp",
  "localOuLinkPublico": null,
  "ministrantes": [
    "Equipe de Analistas do Espaço Arte-Ciência"
  ],
  "preco": null,
  "moeda": "BRL",
  "precoTextoPublico": "Consulte os detalhes pelo WhatsApp",
  "situacao": "consulta_aberta",
  "situacaoTextoPublico": "Programado — consulte disponibilidade de inscrições pelo WhatsApp",
  "prazoInscricao": "Inscrição necessária com no mínimo 48 horas de antecedência da data do encontro para recebimento do link.",
  "certificado": null,
  "gravacao": null,
  "imagem": {
    "src": "/assets/images/institucional/relevo-simbolico-institucional.jpg",
    "webp": "/assets/images/institucional/relevo-simbolico-institucional.webp",
    "avif": "/assets/images/institucional/relevo-simbolico-institucional.avif",
    "width": 279,
    "height": 250,
    "alt": "Relevo circular simbólico do Espaço Arte-Ciência"
  },
  "fonte": "https://www.espacoarteciencia.com.br/cursos-e-seminarios",
  "dataRevisao": "2026-11-16",
  "pendenciasEditoriais": []
}
```

> **Atenção:**
> - Se o valor do investimento ainda não estiver confirmado, mantenha `"preco": null` (nunca use `0`, pois o validador bloqueia zero para evitar confundir preço desconhecido com evento gratuito).
> - Caso um evento seja efetivamente gratuito, utilize `"preco": "gratuito"`. Caso tenha valor confirmado em reais, informe o número positivo (ex.: `"preco": 450.00`).

3. Gere e valide o site executando:
   ```powershell
   node scripts/build.mjs
   node scripts/validate.mjs
   ```

---

## 2. Como Alterar a Data de um Seminário

1. Abra o arquivo correspondente em `src/content/seminarios/`.
2. Atualize o campo `"data"` no formato ISO `"AAAA-MM-DD"` (ex.: `"2026-11-28"`) e atualize `"dataRevisao"` para a data da edição.
3. Execute `node scripts/build.mjs`. O card na Home, a central de Atividades, a página do evento e a mensagem pré-preenchida do WhatsApp serão atualizados automaticamente.

---

## 3. Como Encerrar Inscrições ou Atualizar a Situação de um Evento

Os estados de **data** e de **disponibilidade de inscrições** são independentes:

- Para **manter um evento futuro com inscrições abertas/sob consulta**:
  - `"situacao": "consulta_aberta"` ou `"inscricoes_abertas"`
- Para **encerrar inscrições antes da data do evento** (ex.: vagas esgotadas ou prazo de 48h encerrado):
  - Altere `"situacao"` para `"encerrado"` e `"situacaoTextoPublico"` para `"Inscrições encerradas"`.
  - O evento deixará de ser ofertado como aberto na Home e o botão de WhatsApp passará a consultar próximas edições.
- Para **eventos cuja data já passou**:
  - Basta atualizar a data de referência do build (`dataBaseRevisao` em `src/data/site.json` ou a variável de ambiente `BUILD_REFERENCE_DATE=AAAA-MM-DD` em rotina agendada de CI/CD) ou alterar `"situacao": "realizado"`.
  - O gerador estático remove automaticamente eventos passados do destaque da Home e os transfere para a seção **Histórico de atividades realizadas** em `/cursos-e-seminários/`.

---

## 4. Como Trocar a Foto de um Profissional da Equipe

1. Coloque a nova foto em alta qualidade em `public/assets/images/equipe/` ou atualize o script `scripts/optimize-assets.py` para gerar automaticamente os formatos `.avif`, `.webp` e `.jpg` (e variantes `240w` e `340w`).
2. Confira no arquivo `src/data/analistas.json` o bloco `"imagem"` do profissional correspondente (`src`, `webp`, `avif`, `width`, `height` e `alt`).
3. Reexecute `node scripts/build.mjs` e `node scripts/validate.mjs`.

---

## 5. Como Modificar o Número ou as Mensagens de WhatsApp

1. Abra o arquivo `src/data/site.json`.
2. Localize o objeto `"contatos"`:
   ```json
   "whatsappPrincipal": {
     "rotulo": "(51) 98175-1727",
     "numeroE164": "5551981751727",
     "urlBase": "https://wa.me/5551981751727"
   },
   "whatsappSecundario": {
     "rotulo": "(51) 99247-7179",
     "numeroE164": "5551992477179",
     "urlBase": "https://wa.me/5551992477179"
   }
   ```
3. Altere `rotulo`, `numeroE164` e `urlBase` conforme desejado, ou edite os textos dentro de `"mensagensPadrao"`.
4. Execute `node scripts/build.mjs`. Todos os botões do cabeçalho, hero, cards de seminários, páginas internas, rodapé e botão flutuante serão atualizados simultaneamente.
