# zidorin 🤖💕

## 🌟 概要

zidorin は、女子高生・女子大生をターゲットにした AI フィルター搭載の自撮り Web アプリケーションです。

### 主な機能

- 📸 **リアルタイムカメラ撮影** - スマホ対応のカメラインターフェイス
- 🎨 **AI フィルター** - TensorFlow.js による顔検出・ポーズ検出を活用した高機能フィルター
- 💅 **多彩なエフェクト** - メイクアップ、犬顔、背景置換、年齢性別推定など
- 📱 **直感的 UI** - ポップで可愛いデザインのフィルター選択インターフェイス
- 💾 **写真保存** - 撮影した写真をローカルに保存
- 📲 **SNS 連携** - Instagram への直接共有機能

### 実装済みフィルター

| フィルター | 説明 | 技術 |
|-----------|------|------|
| 🎨 なし | フィルターなし | - |
| ⚫ モノクローム | 白黒効果 | Canvas |
| 🌈 ビビッド | 色彩強調 | Canvas |
| ☁️ クラウド | 雲デコレーション | Canvas |
| ✨ スパークル | キラキラ効果 | Canvas |
| 🐶 犬顔 | 犬の耳・鼻追加 | TensorFlow.js 顔検出 |
| 👀 目玉絵文字 | 目の位置に絵文字 | TensorFlow.js 顔検出 |
| 💄 メイクアップ | リップ・チーク追加 | MediaPipe Face Mesh |
| 🏞️ 背景置換 | 背景を別画像に置換 | TensorFlow.js セグメンテーション |
| 🔍 年齢性別推定 | AI による年齢性別分析表示 | TensorFlow.js |

## 🎯 ターゲット

- **メインターゲット**: 女子高生、女子大生
- **デザイン**: ポップで可愛い、淡い色使い
- **UX**: 楽しく、わかりやすく

## 🚀 技術スタック

- **Frontend**: HTML5, TypeScript, Tailwind CSS
- **Build Tool**: Vite (高速開発環境)
- **Canvas API**: フィルター描画・画像処理
- **AI/ML**: 
  - TensorFlow.js - 顔検出、ポーズ検出、セグメンテーション
  - MediaPipe Face Mesh - 高精度顔メッシュ検出
- **Development**: Docker & Docker Compose
- **Testing**: Vitest (Unit), Playwright (E2E)
- **Code Quality**: ESLint, TypeScript

## 🛠️ 開発環境

### 必要な環境

- Docker & Docker Compose
- ローカル Node.js 不要（全て Docker 経由）

### コマンド

```bash
# 依存関係インストール
make install

# 開発サーバー起動
make dev
# → http://localhost:8000

# プロダクションビルド
make build

```

## システム戦略

- 開発環境は以下の URL の 記載 を完全に再現してください。

  - https://github.com/iitenkida7/posture-diagnosis/blob/main/Makefile
  - https://github.com/iitenkida7/posture-diagnosis/blob/main/docker-compose.yml

- バックエンドは不要で動作します。

- GithubPages にホストできるよう静的な実装を目指します。

- フィルター単位でファイルを分割、プラグイン的な感じで 抜き差しが、簡単にできるように設計。

- その他技術的な判断が必要であれば、一旦、以下のレポジトリを参照して考えてください。
  - https://github.com/iitenkida7/posture-diagnosis
