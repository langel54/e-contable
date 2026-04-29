# Requiere Docker Compose V2 (`docker compose`).
# MySQL debe estar en el host (p. ej. puerto 3307); los contenedores usan host.docker.internal.

COMPOSE_BASE := compose.yaml
COMPOSE_DEV_FILES := -f $(COMPOSE_BASE) -f compose.dev.yaml
COMPOSE_PROD_FILES := -f $(COMPOSE_BASE) -f compose.prod.yaml

.PHONY: help dev dev-down dev-logs prod prod-down prod-logs ps

help:
	@echo "Entornos Docker (BD MySQL fuera de Docker, puerto host 3307 por defecto en compose.yaml):"
	@echo ""
	@echo "  make dev          Levanta desarrollo (foreground, hot reload)"
	@echo "  make dev-down     Detiene y elimina contenedores de desarrollo"
	@echo "  make dev-logs     Logs en seguimiento (desarrollo)"
	@echo ""
	@echo "  make prod         Construye y levanta producción en segundo plano"
	@echo "  make prod-down    Detiene producción"
	@echo "  make prod-logs    Logs en seguimiento (producción)"
	@echo ""
	@echo "  make ps           Estado de los servicios del proyecto"
	@echo ""
	@echo "Variables opcionales: HTTP_PORT (default 80), DATABASE_URL, ALLOWED_ORIGINS"

dev:
	docker compose $(COMPOSE_DEV_FILES) up --build

dev-down:
	docker compose $(COMPOSE_DEV_FILES) down

dev-logs:
	docker compose $(COMPOSE_DEV_FILES) logs -f

prod:
	docker compose $(COMPOSE_PROD_FILES) up --build -d

prod-down:
	docker compose $(COMPOSE_PROD_FILES) down

prod-logs:
	docker compose $(COMPOSE_PROD_FILES) logs -f

ps:
	docker compose $(COMPOSE_BASE) ps -a
