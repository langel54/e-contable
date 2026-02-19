# Permisos por id_tipo (tabla usuarios)

Una sola regla: **si `id_tipo` está en la lista `ids` → puede ver**. Si no está → no puede ver (o redirige).

---

## 1. Rutas / vistas (menú y páginas)

**Archivo:** `src/app/config/routePermissions.js`

Cada ruta tiene **`ids`** = id_tipo que pueden verla. Quien no esté en la lista no ve el enlace en el menú y, si entra por URL, va a `/unauthorized`.

```js
{ text: "Usuarios", path: "/main/users", ids: [1] },
{ text: "Clientes", path: "/main/clients", ids: [1, 2, 3] },
{ text: "Caja", path: "/main/incomes", ids: [1, 6] },
```

Para cambiar quién ve una ruta: edita el array **`ids`** de ese ítem.

---

## 2. Componentes (ocultar o mostrar un card, botón, etc.)

**Para ocultar o mostrar un componente** según id_tipo se usa **ShowForIdTipo**.

- Quien esté en **`ids`** → ve el contenido.
- Quien no esté → no lo ve (o ves el `fallback` si lo pones).

```jsx
import ShowForIdTipo from "@/app/main/menu/ShowForIdTipo";

// Solo 1 y 6 ven este card
<ShowForIdTipo ids={[1, 6]}>
  <Card>...</Card>
</ShowForIdTipo>

// Todos menos el 6 (ocultar solo para tipo 6)
<ShowForIdTipo ids={[1, 2, 3, 4, 5]}>
  <SaldoAnual />
</ShowForIdTipo>

// Solo 1 ve el botón; el resto ve el mensaje
<ShowForIdTipo ids={[1]} fallback={<Typography>Solo administrador</Typography>}>
  <Button>Eliminar</Button>
</ShowForIdTipo>
```

**En el código (condicional):**

```jsx
import { useIdTipoIn } from "@/app/main/menu/ShowForIdTipo";

const puedeVer = useIdTipoIn([1, 6]);
return puedeVer ? <MiCard /> : null;
```

---

## Resumen

| Qué quieres           | Qué usas        | Dónde / cómo                          |
|-----------------------|-----------------|----------------------------------------|
| Quién ve una **ruta** | `ids` en config | `routePermissions.js` → editar `ids`   |
| Quién ve un **componente** | **ShowForIdTipo** | `<ShowForIdTipo ids={[1,6]}>{...}</ShowForIdTipo>` |

- **Rutas** → se controlan en `routePermissions.js` (y el layout usa AuthGuard con la URL).
- **Componentes** → se envuelven con **ShowForIdTipo** y la lista de **ids** que sí pueden ver.
