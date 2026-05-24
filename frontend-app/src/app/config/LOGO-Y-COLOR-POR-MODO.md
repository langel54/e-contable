# Logo y color primario en modo claro / oscuro

## Cómo lo resuelven otras aplicaciones

### Logo

1. **Dos assets (lo más habitual)**  
   - `logo.svg` o `logo.png` para fondo claro (logo oscuro).  
   - `logo-dark.svg` o `logo-dark.png` para fondo oscuro (logo claro).  
   - Se elige según `theme.palette.mode === 'dark'`.

2. **Un solo logo en SVG con colores del tema**  
   - El SVG usa `fill={theme.palette.primary.main}` o `theme.palette.text.primary`.  
   - Se adapta solo si el tema define bien primary/text para cada modo.

3. **Un solo PNG + CSS**  
   - En modo oscuro: `filter: invert(1)` o `brightness(0) invert(1)` para “voltear” el logo.  
   - Rápido pero menos control fino y a veces se ve mal.

4. **Recomendación**  
   - Si tienes PNG: dos versiones (claro/oscuro) y cambiar `src` según el modo.  
   - Si puedes usar SVG: un componente que pinte con colores del tema (primary o text.primary) para que siempre tenga contraste.

### Color primario

1. **No usar el mismo `primary.main` en ambos modos**  
   - En claro: el primario por defecto es indigo (`#6366f1`).  
   - En oscuro: se mantiene el mismo tono con variantes `light`/`dark` generadas en `palette.js` para contraste sobre fondos Slate.

2. **Paleta completa por modo**  
   - Definir `primary.lighter`, `primary.light`, `primary.main`, `primary.dark`, `primary.darker` (y `contrastText`) tanto para `light` como para `dark`.  
   - Así botones, logos y textos sobre primary siguen legibles en ambos modos.

3. **Evitar blanco y negro puros**  
   - Fondos tipo #121212 y texto #f1f5f9 suelen dar mejor contraste y menos fatiga que #000 / #fff.

### Cambios aplicados en este proyecto

- **Drawer (sidebar)**  
  - En modo oscuro se usa `/images/logo-dark.png` si existe.  
  - Si no existe, se usa `/images/logo.png` con `filter: brightness(0) invert(1)` para mantener contraste.  
  - Puedes añadir `public/images/logo-dark.png` (versión clara del logo) para mejor resultado.

- **Color primario** (`themes/palette.js`)  
  - Mismo `primary.main` en claro y oscuro (configurable con `NEXT_PUBLIC_THEME_PRIMARY_MAIN`).  
  - Variantes `light`/`dark`/`lighter` se calculan automáticamente por modo.

- **Logo SVG (login)**  
  - El texto del logo en `LogoMain.jsx` usa `theme.palette.text.primary` en lugar de `common.black` para que sea legible en ambos modos.
