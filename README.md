## POT(ぽしゃば用プラべBot)
**ゆう(@s95g)が作ったものを自分の環境用 & セキュリティ強化のために改編したものです**

ぬーーーーーーーーーーーーーーーーーん


## コマンド

*   `/verify`: 3種類の認証（ワンクリック、足し算、掛け算）パネルを設置します。（管理者のみ）
*   `/kinro`: 金曜ロードショーの情報を表示します。
*   `/top`: チャンネルの最初のメッセージを取得します。

## 導入

### Step 1: Node.jsのインスト

 [Node.js](https://nodejs.org/) (v16.9.0以上) をPCにインストール

### Step 2: ライブラリ

```bash
npm install discord.js dotenv axios
```

### Step 3: トークン設定

.env ファイルの中身:
```
DISCORD_TOKEN="トークン張り付け"
```

### Step 4: 起動

```bash
node index.js
```
