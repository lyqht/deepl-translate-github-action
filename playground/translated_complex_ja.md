<p align="center">
<img src="https://user-images.githubusercontent.com/8291514/213727234-cda046d6-28c6-491a-b284-b86c5cede25d.png#gh-light-mode-only">
<img src="https://user-images.githubusercontent.com/8291514/213727225-56186826-bee8-43b5-9b15-86e839d89393.png#gh-dark-mode-only">
</p>

---

# スーパーベース

[Supabase](https://supabase.com)はオープンソースのFirebase代替ツールです。エンタープライズグレードのオープンソースツールを使ってFirebaseの機能を構築しています。

- [x] Postgresデータベースをホストしています。[ドキュメント](https://supabase.com/docs/guides/database)
- [x] 認証と認可。[ドキュメント](https://supabase.com/docs/guides/auth)
- [x] 自動生成API。
  - [x] REST。[ドキュメント](https://supabase.com/docs/guides/database/api#rest-api)
  - [x] GraphQL。[ドキュメント](https://supabase.com/docs/guides/database/api#graphql-api)
  - [x] リアルタイムサブスクリプション。[ドキュメント](https://supabase.com/docs/guides/database/api#realtime-api)
- [x] 関数。
  - [x] データベース関数。[ドキュメント](https://supabase.com/docs/guides/database/functions)
  - [x] エッジ関数 [Docs](https://supabase.com/docs/guides/functions)
- [x] ファイルストレージ。[ドキュメント](https://**supabase**.com/docs/guides/storage)
- [x] ダッシュボード

[Supabase ダッシュボード](https://raw.githubusercontent.com/supabase/supabase/master/apps/www/public/images/github/supabase-dashboard.png)

## ドキュメント

完全なドキュメントは、[supabase.com/docs](https://supabase.com/docs) を参照してください。

コントリビュート方法については、[Getting Started](./DEVELOPERS.md) を参照してください。

## コミュニティとサポート

- [コミュニティフォーラム](https://github.com/supabase/supabase/discussions).最適な場所: 構築に関するヘルプ、データベースのベストプラクティスに関する議論。
- [GitHub Issues](https://github.com/supabase/supabase/issues).Supabaseを使っていて遭遇したバグやエラー。
- [メールサポート](https://supabase.com/docs/support#business-support).データベースやインフラに関する問題。
- [Discord](https://discord.supabase.com)。アプリケーションの共有やコミュニティとの交流に最適です。

## ステータス

- [x] アルファ：Supabaseをクローズドな顧客とテスト中。
- [x] パブリック・アルファ：誰でも[app.supabase.com](https://app.supabase.com)からサインアップできる。ただし、いくつかの問題がありますので、ご容赦ください。
- [x] パブリックベータ：ほとんどの非企業ユースケースには十分安定している。
- [パブリック：一般公開 [[ステータス](https://supabase.com/docs/guides/getting-started/features#feature-status)]

現在、パブリックベータ版です。メジャーアップデートの通知を受けるには、このリポジトリの "releases" を見てください。

<kbd><img src="https://raw.githubusercontent.com/supabase/supabase/d5f7f413ab356dc1a92075cb3cee4e40a957d5b1/web/static/watch-repo.gif" alt="Watch this repo"/></kbd>

---

## How it works

Supabaseはオープンソースツールの組み合わせです。エンタープライズグレードのオープンソース製品を使用してFirebaseの機能を構築しています。ツールやコミュニティが存在し、MIT、Apache 2、または同等のオープンライセンスがあれば、そのツールを使用し、サポートします。ツールが存在しない場合は、私たち自身で構築し、オープンソース化します。SupabaseはFirebaseの1対1のマッピングではありません。私たちの目的は、オープンソースツールを使ってFirebaseのような開発者体験を開発者に提供することです。

**アーキテクチャ

[Supabaseは[ホステッドプラットフォーム](https://app.supabase.com)です。サインアップすれば、何もインストールせずに Supabase を使い始めることができます。
また、[セルフホスト](https://supabase.com/docs/guides/hosting/overview) や [ローカル開発](https://supabase.com/docs/guides/local-development) も可能です。

[アーキテクチャ](https://github.com/supabase/supabase/blob/master/apps/docs/public/img/supabase-architecture.png)

- [PostgreSQL](https://www.postgresql.org/)はオブジェクトリレーショナルデータベースシステムであり、30年以上にわたる活発な開発により、信頼性、機能の堅牢性、パフォーマンスにおいて高い評価を得ています。
- [Realtime](https://github.com/supabase/realtime)はElixirサーバーで、ウェブソケットを使ってPostgreSQLのインサート、アップデート、削除をリッスンすることができます。RealtimeはPostgreSQLのビルトインレプリケーション機能を使ってデータベースの変更をポーリングし、変更をJSONに変換し、そのJSONをwebsocket経由で認可されたクライアントにブロードキャストします。
- [PostgREST](http://postgrest.org/)は、PostgreSQLデータベースを直接RESTful APIに変換するWebサーバです。
- [pg_graphql](http://github.com/supabase/pg_graphql/) GraphQL APIを公開するPostgreSQL拡張です。
- [Storage](https://github.com/supabase/storage-api)はS3に保存されたファイルを管理するためのRESTfulインタフェースを提供し、パーミッションを管理するためにPostgresを使用します。
- [postgres-meta](https://github.com/supabase/postgres-meta)はPostgresを管理するためのRESTful APIで、テーブルの取得、ロールの追加、クエリの実行などができます。
- [GoTrue](https://github.com/netlify/gotrue)は、ユーザ管理とSWTトークンの発行のためのSWTベースのAPIです。
- [Kong](https://github.com/Kong/kong)は、クラウドネイティブなAPIゲートウェイです。

#### クライアント・ライブラリ

クライアント・ライブラリに対する我々のアプローチはモジュール化されている。各サブライブラリは、単一の外部システム用のスタンドアロン実装です。これは、既存のツールをサポートする方法の1つです。

<table style="table-layout:fixed; white-space: nowrap;">
  <tr>
    <th>言語</th>
    <th>クライアント</th>
    <th colspan="5">フィーチャー・クライアント (Supabaseクライアントにバンドル)</th>
  </tr>
  <!-- notranslate -->
  <tr>
    <th></th>
    <th>Supabase</th>
    <th><a href="https://github.com/postgrest/postgrest" target="_blank" rel="noopener noreferrer">PostgREST</a></th>
    <th><a href="https://github.com/supabase/gotrue" target="_blank" rel="noopener noreferrer">GoTrue</a></th>
    <th><a href="https://github.com/supabase/realtime" target="_blank" rel="noopener noreferrer">リアルタイム</a></th>
    <th><a href="https://github.com/supabase/storage-api" target="_blank" rel="noopener noreferrer">ストレージ</a></th>
    <th>ファンクション</th>
  </tr>
  <!-- TEMPLATE FOR NEW ROW -->
  <!-- START ROW
  <tr>
    <td>lang</td>
    <td><a href="https://github.com/supabase-community/supabase-lang" target="_blank" rel="noopener noreferrer">supabase-lang</a></td>
    <td><a href="https://github.com/supabase-community/postgrest-lang" target="_blank" rel="noopener noreferrer">postgrest-lang</a></td>
    <td><a href="https://github.com/supabase-community/gotrue-lang" target="_blank" rel="noopener noreferrer">gotrue-lang</a></td>
    <td><a href="https://github.com/supabase-community/realtime-lang" target="_blank" rel="noopener noreferrer">realtime-lang</a></td>
    <td><a href="https://github.com/supabase-community/storage-lang" target="_blank" rel="noopener noreferrer">storage-lang</a></td>
  </tr>
  END ROW -->
  <!-- /notranslate -->
  <th colspan="7">⚡️ 公式 ⚡️</th>
  <!-- notranslate -->
  <tr>
    <td>JavaScript (TypeScript)</td>
    <td><a href="https://github.com/supabase/supabase-js" target="_blank" rel="noopener noreferrer">supabase-js</a></td>
    <td><a href="https://github.com/supabase/postgrest-js" target="_blank" rel="noopener noreferrer">postgrest-js</a></td>
    <td><a href="https://github.com/supabase/gotrue-js" target="_blank" rel="noopener noreferrer">gotrue-js</a></td>
    <td><a href="https://github.com/supabase/realtime-js" target="_blank" rel="noopener noreferrer">realtime-js</a></td>
    <td><a href="https://github.com/supabase/storage-js" target="_blank" rel="noopener noreferrer">storage-js</a></td>
    <td><a href="https://github.com/supabase/functions-js" target="_blank" rel="noopener noreferrer">関数-js</a></td>
  </tr>
    <tr>
    <td>フラッター</td>
    <td><a href="https://github.com/supabase/supabase-flutter" target="_blank" rel="noopener noreferrer">supabase-flutter</a></td>
    <td><a href="https://github.com/supabase/postgrest-dart" target="_blank" rel="noopener noreferrer">postgrest-dart</a></td>
    <td><a href="https://github.com/supabase/gotrue-dart" target="_blank" rel="noopener noreferrer">gotrue-ダート</a></td>
    <td><a href="https://github.com/supabase/realtime-dart" target="_blank" rel="noopener noreferrer">リアルタイムダート</a></td>
    <td><a href="https://github.com/supabase/storage-dart" target="_blank" rel="noopener noreferrer">ストレージダート</a></td>
    <td><a href="https://github.com/supabase/functions-dart" target="_blank" rel="noopener noreferrer">ファンクションダート</a></td>
  </tr>
  <!-- /notranslate -->
  <th colspan="7">コミュニティ</th>
  <!-- notranslate -->
  <tr>
    <td>C#</td>
    <td><a href="https://github.com/supabase-community/supabase-csharp" target="_blank" rel="noopener noreferrer">スーパーベース</a></td>
    <td><a href="https://github.com/supabase-community/postgrest-csharp" target="_blank" rel="noopener noreferrer">postgrest-csharp</a></td>
    <td><a href="https://github.com/supabase-community/gotrue-csharp" target="_blank" rel="noopener noreferrer">gotrue-csharp</a></td>
    <td><a href="https://github.com/supabase-community/realtime-csharp" target="_blank" rel="noopener noreferrer">リアルタイム・シャープ</a></td>
    <td><a href="https://github.com/supabase-community/storage-csharp" target="_blank" rel="noopener noreferrer">ストレージ-シャープ</a></td>
    <td><a href="https://github.com/supabase-community/functions-csharp" target="_blank" rel="noopener noreferrer">関数-シャープ</a></td>
  </tr>
  <tr>
    <td>ゴー</td>
    <td>-</td>
    <td><a href="https://github.com/supabase-community/postgrest-go" target="_blank" rel="noopener noreferrer">ポストグレスト囲碁</a></td>
    <td><a href="https://github.com/supabase-community/gotrue-go" target="_blank" rel="noopener noreferrer">gotrue囲碁</a></td>
    <td>-</td>
    <td><a href="https://github.com/supabase-community/storage-go" target="_blank" rel="noopener noreferrer">ストレージ号</a></td>
    <td><a href="https://github.com/supabase-community/functions-go" target="_blank" rel="noopener noreferrer">関数行き</a></td>
  </tr>
  <tr>
    <td>ジャワ</td>
    <td>-</td>
    <td>-</td>
    <td><a href="https://github.com/supabase-community/gotrue-java" target="_blank" rel="noopener noreferrer">Java</a></td>
    <td>-</td>
    <td><a href="https://github.com/supabase-community/storage-java" target="_blank" rel="noopener noreferrer">ストレージ-Java</a></td>
    <td>-</td>
  </tr>
  <tr>
    <td>コトリン</td>
    <td><a href="https://github.com/supabase-community/supabase-kt" target="_blank" rel="noopener noreferrer">supabase-kt</a></td>
    <td><a href="https://github.com/supabase-community/supabase-kt/tree/master/Postgrest" target="_blank" rel="noopener noreferrer">postgrest-kt</a></td>
    <td><a href="https://github.com/supabase-community/supabase-kt/tree/master/GoTrue" target="_blank" rel="noopener noreferrer">gotrue-kt</a></td>
    <td><a href="https://github.com/supabase-community/supabase-kt/tree/master/Realtime" target="_blank" rel="noopener noreferrer">リアルタイム計算機</a></td>
    <td><a href="https://github.com/supabase-community/supabase-kt/tree/master/Storage" target="_blank" rel="noopener noreferrer">ストレージ-KT</a></td>
    <td><a href="https://github.com/supabase-community/supabase-kt/tree/master/Functions" target="_blank" rel="noopener noreferrer">関数-KT</a></td>
  </tr>
  <tr>
    <td>パイソン</td>
    <td><a href="https://github.com/supabase-community/supabase-py" target="_blank" rel="noopener noreferrer">supabase-py</a></td>
    <td><a href="https://github.com/supabase-community/postgrest-py" target="_blank" rel="noopener noreferrer">postgrest-py</a></td>
    <td><a href="https://github.com/supabase-community/gotrue-py" target="_blank" rel="noopener noreferrer">gotrue-py</a></td>
    <td><a href="https://github.com/supabase-community/realtime-py" target="_blank" rel="noopener noreferrer">realtime-py</a></td>
    <td><a href="https://github.com/supabase-community/storage-py" target="_blank" rel="noopener noreferrer">storage-py</a></td>
    <td><a href="https://github.com/supabase-community/functions-py" target="_blank" rel="noopener noreferrer">関数-py</a></td>
  </tr>
  <tr>
    <td>Ruby</td>
    <td><a href="https://github.com/supabase-community/supabase-rb" target="_blank" rel="noopener noreferrer">supabase-rb</a></td>
    <td><a href="https://github.com/supabase-community/postgrest-rb" target="_blank" rel="noopener noreferrer">postgrest-rb</a></td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>さび</td>
    <td>-</td>
    <td><a href="https://github.com/supabase-community/postgrest-rs" target="_blank" rel="noopener noreferrer">postgrest-rs</a></td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>スウィフト</td>
    <td><a href="https://github.com/supabase-community/supabase-swift" target="_blank" rel="noopener noreferrer">スーパーベース-スウィフト</a></td>
    <td><a href="https://github.com/supabase-community/postgrest-swift" target="_blank" rel="noopener noreferrer">ポストグレストスウィフト</a></td>
    <td><a href="https://github.com/supabase-community/gotrue-swift" target="_blank" rel="noopener noreferrer">ゴトルースウィフト</a></td>
    <td><a href="https://github.com/supabase-community/realtime-swift" target="_blank" rel="noopener noreferrer">リアルタイムスウィフト</a></td>
    <td><a href="https://github.com/supabase-community/storage-swift" target="_blank" rel="noopener noreferrer">storage-swift</a></td>
    <td><a href="https://github.com/supabase-community/functions-swift" target="_blank" rel="noopener noreferrer">関数-swift</a></td>
  </tr>
  <tr>
    <td>Godot エンジン (GDScript)</td>
    <td><a href="https://github.com/supabase-community/godot-engine.supabase" target="_blank" rel="noopener noreferrer">supabase-gdscript</a></td>
    <td><a href="https://github.com/supabase-community/postgrest-gdscript" target="_blank" rel="noopener noreferrer">postgrest-gdscript</a></td>
    <td><a href="https://github.com/supabase-community/gotrue-gdscript" target="_blank" rel="noopener noreferrer">gotrue-gdscript</a></td>
    <td><a href="https://github.com/supabase-community/realtime-gdscript" target="_blank" rel="noopener noreferrer">realtime-gdscript</a></td>
    <td><a href="https://github.com/supabase-community/storage-gdscript" target="_blank" rel="noopener noreferrer">storage-gdscript</a></td>
    <td><a href="https://github.com/supabase-community/functions-gdscript" target="_blank" rel="noopener noreferrer">関数-gdscript</a></td>
  </tr>
  <!-- /notranslate -->
</table>

<!--- Remove this list if you're translating to another language, it's hard to keep updated across multiple files-->
<!--- Keep only the link to the list of translation files-->

## 翻訳

- [アラビア語｜العربية](/i18n/README.ar.md)
- [アルバニア語 / Shqip](/i18n/README.sq.md)
- [バングラ語 / বাংলা](/i18n/README.bn.md)
- [ブルガリア語 / Български](/i18n/README.bg.md)
- [カタロニア語 / Català](/i18n/README.ca.md)
- [デンマーク語 / Dansk](/i18n/README.da.md)
- [オランダ語 / オランダ語](/i18n/README.nl.md)
- [英語](https://github.com/supabase/supabase)
- [フィンランド語 / Suomalainen](/i18n/README.fi.md)
- [フランス語 / Français](/i18n/README.fr.md)
- [ドイツ語 / Deutsch](/i18n/README.de.md)
- [ギリシャ語 / Ελληνικά](/i18n/README.gr.md)
- [ヘブライ語 / עברית](/i18n/README.he.md)
- [ヒンディー語 / हिंदी](/i18n/README.hi.md)
- [ハンガリー語 / マジャール語](/i18n/README.hu.md)
- [ネパール語 / नेपाली](/i18n/README.ne.md)
- [インドネシア語 / Bahasa Indonesia](/i18n/README.id.md)
- [イタリア語 / Italiano](/i18n/README.it.md)
- [日本語 / 日本語](/i18n/README.jp.md)
- [韓国語 / 한국어](/i18n/README.ko.md)
- [マレー語 / Bahasa Malaysia](/i18n/README.ms.md)
- [ノルウェー語 / ノルスク語](/i18n/README.nb-no.md)
- [ペルシア語 / فارسی](/i18n/README.fa.md)
- [ポーランド語 / Polski](/i18n/README.pl.md)
- [ポルトガル語 / Português](/i18n/README.pt.md)
- [ポルトガル語 (ブラジル) / Português Brasileiro](/i18n/README.pt-br.md)
- [ルーマニア語 / Română](/i18n/README.ro.md)
- [ロシア語 / Pусский](/i18n/README.ru.md)
- [セルビア語 / Srpski](/i18n/README.sr.md)
- [シンハラ語 / ස ිÔ탕](/i18n/README.si.md)
- [スペイン語 / Español](/i18n/README.es.md)
- [簡体中文](/i18n/README.zh-cn.md)
- [スウェーデン語 / Svenska](/i18n/README.sv.md)
- [タイ語 / ไทย](/i18n/README.th.md)
- [繁体中文](/i18n/README.zh-tw.md)
- [トルコ語 / Türkçe](/i18n/README.tr.md)
- [ウクライナ語 / Українська](/i18n/README.uk.md)
- [ベトナム語 / Tiếng Việt](/i18n/README.vi-vn.md)
- [翻訳リスト](/i18n/languages.md)<!--- Keep only this -->

---

## スポンサー

[新スポンサー](https://user-images.githubusercontent.com/10214025/90518111-e74bbb00-e198-11ea-8f88-c9e3c1aa4b5b.png)](https://github.com/sponsors/supabase)
