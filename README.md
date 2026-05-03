# Dyson Sphere Program Item Manager

Dyson Sphere Program (DSP) のアイテムとその製作レシピを管理するためのローカル用 Web ツールです。
アイテム間の依存関係（材料）や、そのアイテムが何に使われるか（逆引き）を簡単に確認できます。

## 特徴

- **アイテム一覧**: 全アイテムをグリッド形式で俯瞰
- **詳細表示**: レシピ（材料、製作施設、製作時間）の確認
- **逆引きレシピ**: そのアイテムを材料として使用する上位アイテムを一覧表示
- **高速な動作**: データベース不要、すべてのデータはコード内に保持

## セットアップ

このプロジェクトは `anyenv` および `nodenv` を使用して Node.js 環境を管理することを想定しており、`Makefile` を通じて簡単にセットアップできます。

### 前提条件

- [Homebrew](https://brew.sh/) がインストールされていること

### 手順

1. リポジトリをクローンまたは配置します。
2. 以下のコマンドを実行して、必要なツール（anyenv, nodenv）、Node.js、および依存パッケージをインストールします。

```bash
make setup
```

## 開発と実行

### 開発サーバーの起動

ローカルでサイトを表示するには、以下のコマンドを実行します。

```bash
make dev
```

起動後、ブラウザで [http://localhost:5173](http://localhost:5173) にアクセスしてください。

### ビルド

本番用のファイルを生成する場合は以下のコマンドを実行します。

```bash
make build
```

### リンターの実行

```bash
make lint
```

## データの追加方法

アイテムやレシピを追加・編集するには、以下のファイルを直接編集します。

- **アイテムの定義**: `src/data/items.ts`
- **レシピの定義**: `src/data/recipes.ts`

## 技術スタック

- **Frontend**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Icon**: Emoji
