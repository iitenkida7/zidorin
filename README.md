# zidorin 🤖💕

## 🌟 概要

- zidorin は、 自撮りをするための WEB アプリケーションです。
- 主にスマホ(iPhone,Android)で自撮りをします。
- 女子高生や、女子大生に人気のアプリになるでよう。
- 様々なフィルターがあり、好みのフィルターを選んで写真を撮ります。
- TensorFlow で 顔にを検知して顔周辺にデコレーションをしたりする、フィルターもあり、AI ネイティブなフィルターがあります。

### 主な機能

- 📸 **カメラ撮影**
- 📱 **適用するフィルターを楽しく選べるインターフェイス**
- 📱 **写真を保存するボタン**
- 📱 **Instagram を起動できるボタン**

## 🎯 ターゲット

- **メインターゲット**: 女子高生、女子大生
- **デザイン**: ポップで可愛い、淡い色使い
- **UX**: 楽しく、わかりやすく

## 🚀 技術スタック

- **Frontend**: HTML5, TypeScript, Tailwind CSS
- **フィルターデコレーション**: Canvas
- **AI**: TensorFlow.js (人物、体のパーツ検出)
- **Build**: Vite (高速開発環境)
- **Development**: Docker

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
