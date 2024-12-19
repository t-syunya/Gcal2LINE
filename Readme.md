<!--
Copyright 2024 t-syunya

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# Google Calendarの予定をLINEに送信するプログラム
2025年3月31日にLine Notifyがサービス終了するためSlack APIへ移行予定

- このプログラムでは、送信時点の日付の予定をLINEに通知する。
- プログラムはGoogle Apps Script上で動作させ、トリガーを設定することで決まった時間に通知する。

## 使用準備
- APIキーやcalendarのidはGASのスクリプトプロパティで設定
- LINE Notifyの有効化とトークンの発行が必要。トークンはGASのスクリプトプロパティで設定

## 使用方法
- `npm run deploy`でデプロイ
- GAS上でトリガーとスクリプトプロパティを設定
