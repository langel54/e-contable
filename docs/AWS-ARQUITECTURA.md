# Infraestructura AWS para el proyecto

## Resumen del proyecto

- **Frontend**: Next.js 15 (React 19) — app web.
- **Backend**: Node.js + Express, API REST, Prisma.
- **Base de datos**: MySQL (vía `DATABASE_URL` en Prisma).

---

## Mejor alternativa recomendada

Para este stack, la opción más equilibrada en **costo, simplicidad y mantenimiento** es:

| Componente   | Servicio AWS recomendado     | Alternativa                    |
|-------------|------------------------------|--------------------------------|
| **Frontend**| **Amplify** (Next.js)        | S3 + CloudFront (export estático) |
| **Backend** | **App Runner** o **Elastic Beanstalk** | ECS Fargate (contenedores) |
| **Base de datos** | **RDS MySQL** (o Aurora MySQL) | RDS MySQL en VPC privada |

### Por qué esta combinación

1. **Amplify**: Despliegue de Next.js desde Git (SSR/SSG), preview por rama, HTTPS y dominio integrados, bajo mantenimiento.
2. **App Runner**: Despliega el backend desde imagen Docker o código; escalado automático, pago por uso; menos configuración que ECS/Beanstalk.
3. **RDS MySQL**: Compatible con Prisma; backups, réplicas y parches gestionados por AWS.

---

## Opción A: Arquitectura recomendada (Amplify + App Runner + RDS)

```
                    Internet
                        │
                        ▼
              ┌─────────────────┐
              │  Route 53 (DNS) │  (opcional)
              └────────┬────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│ AWS Amplify     │         │  App Runner     │
│ (Next.js)       │ ──API──▶│  (Backend Node) │
│ Frontend        │         │  /api/*         │
└─────────────────┘         └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  RDS MySQL      │
                            │  (VPC privada)  │
                            └─────────────────┘
```

- **Frontend**: Amplify construye y sirve Next.js; las llamadas al API van al backend en App Runner.
- **Backend**: App Runner corre la app Express (contenedor o “source”); variable `DATABASE_URL` apuntando a RDS.
- **Base de datos**: RDS MySQL en subred privada; acceso solo desde el backend (y, si aplica, desde tu red/VPN).

---

## Opción B: Todo en contenedores (ECS Fargate)

Si prefieres **todo en Docker** y más control:

| Componente   | Servicio        |
|-------------|------------------|
| Frontend    | ECS Fargate (Next.js en contenedor) |
| Backend     | ECS Fargate (Node/Express en contenedor) |
| Balanceador | Application Load Balancer (ALB) |
| Base de datos | RDS MySQL en VPC |

- **Ventaja**: Un solo modelo (contenedores), mismo pipeline para front y back.
- **Desventaja**: Más configuración (VPC, ECS, ALB, tareas, servicios) y normalmente mayor costo que Amplify + App Runner para cargas pequeñas/medianas.

---

## Opción C: Serverless (Lambda + API Gateway)

- **Frontend**: Amplify o S3 + CloudFront.
- **Backend**: Lambda + API Gateway (Express con adaptador, p. ej. `@vendia/serverless-express`).
- **Base de datos**: RDS MySQL (o Aurora Serverless v2) en VPC; Lambda en la misma VPC para acceder a RDS.

Útil si quieres **escalado a cero** y pago por solicitud; implica adaptar el backend actual para Lambda.

---

## Recomendación final

- **Para la mayoría de los casos**: usar **Opción A** (Amplify + App Runner + RDS MySQL).
- **Si ya usas Docker y quieres todo unificado**: **Opción B** (ECS Fargate + ALB + RDS).
- **Si priorizas coste variable y escalado a cero**: **Opción C** (Lambda + API Gateway + RDS/Aurora).

En la carpeta `infra/` se incluyen plantillas para desplegar la **Opción A** (y referencias para B/C) con **Terraform** o **AWS SAM/CDK** según prefieras.

---

## Presupuestos (costes estimados)

Estimación **mensual** en USD para la **Opción A** (Amplify + App Runner + RDS), región **us-east-1** (Virginia). Los precios varían por región y uso real.

### Escenario 1: Desarrollo / pruebas (mínimo)

| Componente   | Configuración              | Coste aprox. mensual |
|-------------|----------------------------|----------------------|
| **Amplify** | Free tier (builds, 500k SSR, 15 GB salida) | **0 USD** |
| **App Runner** | 0.25 vCPU, 0.5 GB, poco tráfico (escala a cero cuando idle) | **5–15 USD** |
| **RDS MySQL** | db.t3.micro, 20 GB gp3      | **25–35 USD** |
| **Total**   |                            | **~30–50 USD/mes** |

Amplify suele quedar dentro del free tier (1.000 min build, 15 GB transfer, 500k peticiones SSR). RDS es el mayor coste fijo.

### Escenario 2: Bajo tráfico (producción pequeña)

| Componente   | Configuración              | Coste aprox. mensual |
|-------------|----------------------------|----------------------|
| **Amplify** | Hasta ~1M peticiones SSR, algo de transfer extra | **0–15 USD** |
| **App Runner** | 0.25–1 vCPU, 1–2 GB, tráfico bajo-medio | **20–50 USD** |
| **RDS MySQL** | db.t3.micro o db.t3.small, 20–50 GB | **30–60 USD** |
| **Total**   |                            | **~50–125 USD/mes** |

### Escenario 3: Tráfico medio

| Componente   | Configuración              | Coste aprox. mensual |
|-------------|----------------------------|----------------------|
| **Amplify** | Varios millones de peticiones, más datos transferidos | **20–80 USD** |
| **App Runner** | 1–2 vCPU, 2–4 GB, siempre activo | **80–150 USD** |
| **RDS MySQL** | db.t3.small o db.t3.medium, 50–100 GB | **60–120 USD** |
| **Total**   |                            | **~160–350 USD/mes** |

### Resumen rápido

| Escenario     | Total aprox. (USD/mes) |
|---------------|-------------------------|
| Dev / pruebas | **30–50**              |
| Producción pequeña | **50–125**       |
| Producción media   | **160–350**       |

### Cómo reducir costes

- **RDS**: La instancia es el coste fijo principal. Mantener `db.t3.micro` y solo subir cuando haga falta. Reservar instancia (1 año) si el entorno es estable (~40 % ahorro).
- **App Runner**: Usar el mínimo de vCPU/GB que necesites; solo pagas vCPU cuando hay tráfico (idle = solo memoria).
- **Amplify**: El free tier cubre muchos proyectos pequeños. Revisar que el build no se dispare (ramas/PRs = más builds).
- **Región**: us-east-1 suele ser más barata. Sudamérica (São Paulo) puede ser ~2x más cara en RDS y compute.
- **Free tier AWS**: Cuentas nuevas tienen 12 meses de free tier (EC2, RDS, etc.); RDS free tier incluye db.t2.micro (o similar) 750 h/mes.

Para una estimación exacta según tu uso: [AWS Pricing Calculator](https://calculator.aws/).

---

## Variables de entorno necesarias

### Backend (App Runner / ECS / Beanstalk)

- `PORT`: puerto del servidor (ej. `3001`).
- `DATABASE_URL`: URL de conexión MySQL para Prisma, por ejemplo:
  - `mysql://USER:PASSWORD@RDS_ENDPOINT:3306/DATABASE`
- Cualquier otra variable que use la app (JWT, CORS, etc.).

### Frontend (Amplify)

- `NEXT_PUBLIC_API_URL`: URL base del backend (ej. `https://xxx.us-east-1.awsapprunner.com` o tu dominio en App Runner).

---

## Próximos pasos

1. Crear **Dockerfile** para el backend (para App Runner o ECS).
2. Configurar **RDS MySQL** y ejecutar migraciones de Prisma (`npx prisma migrate deploy`).
3. Desplegar **backend** en App Runner (o Beanstalk/ECS) con `DATABASE_URL` y `PORT`.
4. Conectar el repo en **Amplify**, definir `NEXT_PUBLIC_API_URL` y desplegar el frontend.
5. (Opcional) Dominio en **Route 53** y certificados en **ACM** para URLs amigables.

Si indicas si prefieres **Terraform** o **AWS CDK/SAM**, se puede detallar la IaC paso a paso para tu repo.
