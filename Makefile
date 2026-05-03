.PHONY: setup dev build lint help clean

.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@awk '/^[a-zA-Z\t_-]+:.*?##/ {printf "\033[36m%-20s\033[0m %s\n", $$1, substr($$0, index($$0, "##") + 3)}' $(MAKEFILE_LIST)

setup: ## Initial project setup (Install tools, Node.js, and dependencies)
	bash scripts/setup.sh

dev: ## Start the development server
	npm run dev

build: ## Build the application for production
	npm run build

lint: ## Run ESLint
	npm run lint

clean: ## Remove generated build artifacts and dependencies
	rm -rf dist node_modules
