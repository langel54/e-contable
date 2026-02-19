# Terraform para AWS (opción recomendada: Amplify + App Runner + RDS)

Esta carpeta contiene ejemplos de Terraform para desplegar la **Opción A** descrita en `docs/AWS-ARQUITECTURA.md`.

## Requisitos

- [Terraform](https://www.terraform.io/downloads) >= 1.x
- AWS CLI configurado (`aws configure`) o variables de entorno `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`

## Uso

1. **RDS MySQL** (base de datos):
   ```bash
   cd infra/terraform/rds
   cp terraform.tfvars.example terraform.tfvars   # editar con tu región y contraseña
   terraform init
   terraform plan
   terraform apply
   ```
   Anota el endpoint de RDS y crea `DATABASE_URL`:
   `mysql://usuario:contraseña@endpoint:3306/nombre_bd`

2. **Backend en App Runner**:
   - Crea un ECR (repositorio de imágenes Docker) y sube la imagen del backend:
     ```bash
     cd backend
     docker build -t nombre-backend .
     aws ecr get-login-password --region REGION | docker login --username AWS --password-stdin CUENTA.dkr.ecr.REGION.amazonaws.com
     docker tag nombre-backend:latest CUENTA.dkr.ecr.REGION.amazonaws.com/nombre-backend:latest
     docker push CUENTA.dkr.ecr.REGION.amazonaws.com/nombre-backend:latest
     ```
   - Crea el servicio en App Runner desde la consola AWS (o usa el módulo `apprunner` si lo añadimos), con variable de entorno `DATABASE_URL`.

3. **Frontend en Amplify**:
   - En AWS Amplify: "New app" → "Host web app" → conecta tu repositorio Git.
   - Rama principal, framework Next.js, build: `npm run build`, output: `.next` (o el que use Amplify por defecto para Next).
   - Añade variable de entorno: `NEXT_PUBLIC_API_URL` = URL del servicio App Runner.

## Estructura propuesta

```
infra/terraform/
├── README.md           # este archivo
├── rds/                # RDS MySQL (opcional: VPC + subnet group + security group)
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars.example
└── ecr/                # ECR para la imagen del backend (opcional)
    ├── main.tf
    └── outputs.tf
```

### Obtener VPC y subredes (cuenta por defecto)

```bash
# VPC por defecto
aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text

# Subredes de esa VPC (sustituir VPC_ID)
aws ec2 describe-subnets --filters "Name=vpc-id,Values=VPC_ID" --query "Subnets[*].SubnetId" --output text
```

Pon en `terraform.tfvars`: `vpc_id`, `subnet_ids` (al menos 2) y `db_password` (o `export TF_VAR_db_password=...`).

---

Para un despliegue mínimo **sin Terraform**: crea RDS y App Runner desde la consola AWS, conecta Amplify a tu repo y configura las variables de entorno indicadas en `docs/AWS-ARQUITECTURA.md`.
