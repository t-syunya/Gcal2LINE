// TypeScriptでGoogle Apps Scriptを使用するための定義ファイルをインポート
/// <reference types="google-apps-script" />

function getScriptProperty(key: string): string {
  const properties = PropertiesService.getScriptProperties();
  const value = properties.getProperty(key);
  return value ? value : 'NULL'; // NULLを返してエラーを回避
}

const LINE_NOTIFY_TOKEN = getScriptProperty('LINE_NOTIFY_TOKEN');
const LINE_NOTIFY_API = 'https://notify-api.line.me/api/notify';

const calendarInfo = [
  {
    id: getScriptProperty('GMAIL') + '@tut.jp',
    name: 'メイン',
  },
  {
    id: getScriptProperty('CLASS') + '@group.calendar.google.com',
    name: '授業',
  },
  {
    id: getScriptProperty('ASSIGNMENT') + '@group.calendar.google.com',
    name: '課題',
  },
  {
    id: getScriptProperty('LABORATORY') + '@group.calendar.google.com',
    name: '研究室',
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sendMessage(): void {
  const today = new Date();
  today.setDate(today.getDate());
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000); // 翌日の午前0時

  // 予定を取得する日付の設定
  const monthNum = today.getMonth() + 1; // 月
  const dateNum = today.getDate(); // 日
  const day = today.getDay(); // 曜日
  const dayArray = ['日', '月', '火', '水', '木', '金', '土'];
  const todayInfo = `${monthNum}月${dateNum}日(${dayArray[day]})`;
  let sendMessage = `\n${todayInfo}の予定は以下の通りです。\n\n`;

  // 複数のカレンダーから予定を取得
  let events: GoogleAppsScript.Calendar.CalendarEvent[] = [];
  calendarInfo.forEach(calendar => {
    const cal = CalendarApp.getCalendarById(calendar.id);
    const calEvents = cal.getEvents(today, tomorrow);
    calEvents.forEach(event => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event as any).calendarName = calendar.name;
    });
    events = events.concat(calEvents);
  });

  // 予定の内容を整形してメッセージに追加
  if (events.length === 0) {
    sendMessage += '予定はありません。';
  } else {
    events.forEach((event, index) => {
      if (index !== 0)
        sendMessage +=
          '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n';
      const title = event.getTitle();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const startTime = formatDate(event.getStartTime() as any as Date);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const endTime = formatDate(event.getEndTime() as any as Date);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let Duration = `(${startTime} ~ ${endTime})`;
      if (startTime === '00:00' && endTime === '00:00') Duration = '終日';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sendMessage += `${index + 1}. [${(event as any).calendarName}] ${title} ${Duration}\n`;
    });
  }

  // LINEに送信
  UrlFetchApp.fetch(LINE_NOTIFY_API, {
    method: 'post',
    payload: `message=${encodeURIComponent(sendMessage)}`,
    headers: { Authorization: `Bearer ${LINE_NOTIFY_TOKEN}` },
  });
}

// 日時をHH:MM形式に整形する関数
function formatDate(date: Date): string {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'HH:mm');
}
