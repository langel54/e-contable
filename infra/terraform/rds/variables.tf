variable "aws_region" {
  description = "Región AWS"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre del proyecto (prefijo de recursos)"
  type        = string
}

variable "vpc_id" {
  description = "ID de la VPC donde crear RDS"
  type        = string
}

variable "subnet_ids" {
  description = "IDs de subredes para el DB subnet group (al menos 2 en distintas AZ)"
  type        = list(string)
}

variable "allowed_cidr_blocks" {
  description = "CIDRs permitidos para acceder a MySQL (ej. IP del backend o 0.0.0.0/0 para pruebas)"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "mysql_version" {
  description = "Versión de MySQL"
  type        = string
  default     = "8.0"
}

variable "instance_class" {
  description = "Clase de instancia RDS"
  type        = string
  default     = "db.t3.micro"
}

variable "allocated_storage" {
  description = "Almacenamiento inicial (GB)"
  type        = number
  default     = 20
}

variable "max_allocated_storage" {
  description = "Almacenamiento máximo para autoscaling (GB)"
  type        = number
  default     = 100
}

variable "storage_encrypted" {
  description = "Cifrado de almacenamiento"
  type        = bool
  default     = true
}

variable "db_name" {
  description = "Nombre de la base de datos"
  type        = string
}

variable "db_username" {
  description = "Usuario administrador de la BD"
  type        = string
}

variable "db_password" {
  description = "Contraseña del usuario (no dejar en código; usar TF_VAR_db_password o backend)"
  type        = string
  sensitive   = true
}

variable "publicly_accessible" {
  description = "Si la instancia RDS es accesible desde internet (solo para pruebas)"
  type        = bool
  default     = false
}

variable "skip_final_snapshot" {
  description = "No crear snapshot al destruir (true en dev)"
  type        = bool
  default     = true
}

variable "backup_retention_period" {
  description = "Días de retención de backups"
  type        = number
  default     = 7
}
