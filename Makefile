# Path ke data-source
DATA_SOURCE=src/core/data_source.ts
MIGRATION_DIR=./src/core/migrations

# Generate migration
migration:
	@if [ -z "$(name)" ]; then \
		echo "Usage: make migration name=user_table"; \
	else \
		bun run typeorm -- migration:generate $(MIGRATION_DIR)/$(name) -d $(DATA_SOURCE); \
	fi

# Run all migrations
migrate:
	bun run typeorm -- migration:run -d $(DATA_SOURCE)

# Revert last migration
migrate-revert:
	bun run typeorm -- migration:revert -d $(DATA_SOURCE)

deploy:
	docker-compose down && docker-compose build && docker-compose up -d

freshInstall:
	rm -rf node_modules bun.lock
	bun install