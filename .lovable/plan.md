## Objetivo

Adicionar um modo de calibração no `/adm` onde você arrasta o halo de luz amarelado com o mouse/dedo até a lente do projetor. A posição final é salva no `localStorage` e usada como origem fixa do halo dali em diante.

## Como vai funcionar

1. No topo do hero do `/adm`, aparece um pequeno botão discreto **"Calibrar lente"** (ícone de mira).
2. Ao clicar, o halo entra em **modo de calibração**:
   - O halo ganha um anel pontilhado dourado para ficar visível.
   - Você arrasta com mouse ou dedo para reposicionar.
   - Aparece um mini HUD mostrando as coordenadas atuais (ex: `58% × 55%`).
3. Botão **"Salvar posição"** grava `{x, y}` em `localStorage` (chave `arenabox_lens_pos`).
4. Botão **"Resetar"** volta para a posição padrão (58% / 55%).
5. Visitantes normais não veem o botão de calibração — só você. Vou esconder atrás de `?calibrar=1` na URL (ex: `/adm?calibrar=1`).

## Onde mexer

- **`src/routes/adm.tsx`**
  - Novo state `lensPos = { x: number; y: number }` carregado do `localStorage` no mount.
  - Novo state `calibrating: boolean` ativado se `URLSearchParams.has("calibrar")`.
  - Substituir o `left: "58%", top: "55%"` fixo dos 3 elementos do halo (radial, núcleo, lens flare) por `left: \`${lensPos.x}%\``, `top: \`${lensPos.y}%\``.
  - Quando `calibrating === true`:
    - Adicionar `onPointerDown/Move/Up` no `stageRef` para capturar arrasto e atualizar `lensPos` em `%` relativo ao palco.
    - Renderizar o anel pontilhado + HUD + botões "Salvar" / "Resetar" / "Sair".
  - Persistência: `localStorage.setItem("arenabox_lens_pos", JSON.stringify(lensPos))`.

## Detalhes técnicos

- Cálculo do drag: `x% = (clientX - rect.left) / rect.width * 100`, mesma lógica para Y.
- Limites: clamp entre 0% e 100%.
- O efeito de intensidade que segue o cursor (já existente) continua funcionando — só a **origem** do halo passa a ser configurável.
- Sem nova dependência. Tudo em React state + `localStorage`.

## Resultado

Você abre `/adm?calibrar=1`, arrasta o halo até cobrir exatamente a lente, clica em **Salvar**, e a partir daí o halo fica fixo nessa posição para todos os visitantes.