const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('standard-demo.html', 'utf8');

assert.match(html, /YUTORU Standard デモ版/);
assert.match(html, /打刻専用で試す/);
assert.match(html, /管理者で試す/);
assert.match(html, /経理で試す/);
assert.match(html, /const KEY='yutoru_standard_demo_v1'/);
assert.match(html, /schemaVersion:2/);
assert.match(html, /data\?\.schemaVersion===2\?data:initial\(\)/);
assert.match(html, /punch:\['punch'\]/);
assert.match(html, /manager:\['dashboard','staff','attendance','settings','devices','export'\]/);
assert.match(html, /accounting:\['dashboard','attendance','payroll','history','export'\]/);
const punchView = html.slice(html.indexOf('punch:()=>`'), html.indexOf('\ndashboard:()=>'));
const staffView = html.slice(html.indexOf('\nstaff:()=>`'), html.indexOf('\nattendance:()=>'));
assert.ok(punchView.length > 100);
assert.ok(staffView.length > 100);
assert.doesNotMatch(punchView, /給与明細を見る|salary/);
assert.doesNotMatch(staffView, /基本時給|給与設定|給与明細/);
assert.match(html, /staff:\[\s*\n \{id:'s1'/);
assert.ok((html.match(/employment:'(?:正社員|アルバイト)'/g) || []).length >= 5);
assert.doesNotMatch(html, /payType/);
assert.doesNotMatch(html, new RegExp('月' + '給'));
for (const [name, rate] of [['山田 太郎',1500],['佐藤 花子',1300],['鈴木 一郎',1250],['田中 美咲',1400],['高橋 健',1600]]) {
  assert.match(html, new RegExp(`name:'${name}'.*rate:${rate}`));
}
for (const pattern of ['通常勤務','8時間超・残業','早朝勤務','深夜・日跨ぎ','休憩なし','交通費0円']) assert.match(html, new RegExp(pattern));
assert.match(html, /overtime:1\.25,night:1\.25/);
assert.match(html, /base=sum\.work\/60\*s\.rate/); // 基本給与 = 時給 × 全実働
assert.match(html, /ot=sum\.ot\/60\*s\.rate\*\(overtimeRate-1\)/); // 残業の割増部分
assert.match(html, /night=sum\.night\/60\*s\.rate\*\(state\.settings\.night-1\)/);
assert.match(html, /early=sum\.early\/60\*state\.settings\.earlyHourly/);
assert.match(html, /total=base\+ot\+night\+early\+sum\.transport\+s\.other/);
assert.match(html, /a\.transport===null\|\|a\.transport===undefined/); // 0円と未設定を区別
assert.match(html, /transport:0,type:'休憩なし・日別交通費0円'/);
for (const label of ['基本時給','実働時間','基本給与（時給×実働）','残業時間 / 残業手当','早朝時間 / 早朝手当','深夜時間 / 深夜手当','その他手当','交通費','支給合計']) assert.match(html, new RegExp(label));
assert.match(html, /給与明細PDF \/ 印刷/);
assert.match(html, /勤怠CSV/);
assert.match(html, /勤怠PDF \/ 印刷/);
assert.match(html, /デモを初期状態に戻す/);
assert.match(html, /Lightデモや本番データには影響しません/);
assert.match(html, /店舗打刻端末',1/);
assert.match(html, /管理者端末',2/);
assert.match(html, /経理端末',1/);
assert.match(html, /スタッフ登録人数 無制限/);
assert.match(html, /requestedRole!==role\|\|!access\[role\]\.includes\(page\)/);
assert.match(html, /if\(state\.role!==['"]accounting['"]\)return/);
assert.match(html, /税金・社会保険等の控除は本デモでは未実装/);

const light = fs.readFileSync('index.html', 'utf8');
assert.match(light, /YUTORU デモ版/);
assert.doesNotMatch(light, /yutoru_standard_demo_v1/);
console.log('standard-demo tests: ok');
