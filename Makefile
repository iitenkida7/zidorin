.PHONY: help
help:
	@echo "利用可能なコマンド:"
	@echo "  make install     - 依存関係をインストール"
	@echo "  make dev         - 開発サーバーを起動 (http://localhost:8000)"
	@echo "  make build       - プロダクションビルドを作成"
	@echo "  make preview     - ビルドしたアプリケーションをプレビュー"
	@echo "  make test        - すべてのテストを実行"
	@echo "  make test-unit   - ユニットテストを実行"
	@echo "  make test-e2e    - E2Eテストを実行"
	@echo "  make lint        - コードのリントを実行"
	@echo "  make type-check  - TypeScriptの型チェックを実行"
	@echo "  make clean       - ビルド成果物を削除"

.PHONY: install
install:
	docker-compose run --rm node-install

.PHONY: dev
dev:
	docker-compose up node-dev

.PHONY: build
build:
	docker-compose run --rm node-build

.PHONY: preview
preview:
	docker-compose up node-preview

.PHONY: test
test: test-unit test-e2e

.PHONY: test-unit
test-unit:
	docker-compose run --rm node-test npm run test:unit

.PHONY: test-e2e
test-e2e:
	docker-compose run --rm playwright

.PHONY: lint
lint:
	docker-compose run --rm node-test npm run lint

.PHONY: type-check
type-check:
	docker-compose run --rm node-test npm run type-check

.PHONY: clean
clean:
	rm -rf dist node_modules .cache