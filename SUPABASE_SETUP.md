# Supabase 設定手順

このアプリはログインすると Supabase にユーザー別でデータを保存します（未ログイン時は端末内 localStorage のみ）。
以下を一度だけ設定してください。

## 1. プロジェクト作成と認証情報の取得
1. https://supabase.com でプロジェクトを作成
2. **Settings → API** を開き、以下をコピー
   - **Project URL**（例: `https://xxxx.supabase.co`）
   - **anon public key**（`anon` `public` の JWT）
   - ※ anon key はクライアントに埋め込んで公開しても安全です（RLSで各ユーザーのデータは保護されます）

## 2. データベース初期化
1. **SQL Editor** を開く
2. リポジトリの `supabase/schema.sql` の内容を貼り付けて実行
   - `user_data` テーブルと Row Level Security ポリシーが作成されます

## 3. リダイレクトURLの設定
1. **Authentication → URL Configuration**
2. **Site URL** に本番URL（Vercel のURL、例: `https://cultivation-management-system.vercel.app`）を設定
3. **Redirect URLs** に以下を追加
   - 本番URL（例: `https://cultivation-management-system.vercel.app`）
   - 独自ドメインがあればそれも追加
   - ローカル検証する場合は `http://localhost:3000` など

## 4. ログインプロバイダの設定
**Authentication → Providers** で有効化します。

### Google
1. Google Cloud Console で OAuth 2.0 クライアントIDを作成（種類: ウェブアプリケーション）
2. 承認済みリダイレクトURIに Supabase のコールバックを追加
   `https://<プロジェクトRef>.supabase.co/auth/v1/callback`
3. 取得した **Client ID / Client Secret** を Supabase の Google プロバイダに入力して有効化

### Apple（Sign in with Apple）
1. Apple Developer（有料メンバーシップ必要）で
   - **App ID**（Sign in with Apple 有効化）
   - **Service ID**（Web用、リダイレクトに Supabase のコールバックを設定）
   - **Sign in with Apple 用のキー(.p8)**
   を作成
2. Supabase の Apple プロバイダに Service ID / Team ID / Key ID / 秘密鍵を入力して有効化
3. コールバック: `https://<プロジェクトRef>.supabase.co/auth/v1/callback`

### メール（マジックリンク）
- Email プロバイダはデフォルトで有効。特別な設定は不要です。
- 本番で確実に届かせたい場合は Authentication → Emails でSMTPを設定推奨。

## 5. Vercel の環境変数に設定
コードへの埋め込みは不要です。Vercel の **Project → Settings → Environment Variables** に以下を追加してください。

| Key | Value |
|---|---|
| `SUPABASE_URL` | 手順1でコピーした Project URL |
| `SUPABASE_ANON_KEY` | 手順1でコピーした anon public key |

設定後、再デプロイ（または次回のデプロイ）で反映されます。
アプリは起動時に `/api/config`（サーバーレス関数）経由でこの2つの値を取得します。
未設定の場合はローカル保存モードのまま正常に動作します。
