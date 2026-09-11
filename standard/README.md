# YUTORU Standard — Vercel Production

このディレクトリは、Light版とは別のVercelプロジェクトとして公開するための独立した公開ルートです。

## Vercelプロジェクト設定

| 項目 | 設定値 |
| --- | --- |
| Project Name | `yutoru-standard` |
| Production Domain | `yutoru-standard.vercel.app` |
| Root Directory | `standard` |
| Framework Preset | `Other` |
| Build Command | 空欄 |
| Output Directory | `.` |

リポジトリ全体ではなく、Vercelの **Root Directoryを必ず `standard`** に設定してください。これによりProductionへ含まれるアプリファイルは、このディレクトリの `index.html`、`standard.css`、`standard.js` のみに限定されます。

既存のLight版プロジェクト `yutoru` のRoot Directory、ドメイン、デプロイ設定は変更しないでください。

## Production URL

<https://yutoru-standard.vercel.app/>

Vercelで上記設定の新規プロジェクトを作成し、Production Deploymentが成功した後に利用できます。
