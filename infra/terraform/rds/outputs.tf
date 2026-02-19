output "db_endpoint" {
  description = "Endpoint de la instancia RDS"
  value       = aws_db_instance.main.endpoint
}

output "db_address" {
  description = "Host de la instancia RDS"
  value       = aws_db_instance.main.address
}

output "db_port" {
  description = "Puerto MySQL"
  value       = aws_db_instance.main.port
}

output "db_name" {
  description = "Nombre de la base de datos"
  value       = aws_db_instance.main.db_name
}

# Ejemplo de DATABASE_URL (la contraseña no se muestra en output por sensitive)
output "database_url_example" {
  description = "Ejemplo: DATABASE_URL=mysql://USER:PASSWORD@<db_address>:3306/<db_name>"
  value       = "mysql://${aws_db_instance.main.username}:****@${aws_db_instance.main.address}:3306/${aws_db_instance.main.db_name}"
}
