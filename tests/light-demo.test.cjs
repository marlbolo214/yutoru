const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
function extract(start, end) { const a=html.indexOf(start), b=html.indexOf(end,a); assert(a>=0&&b>a); return html.slice(a,b+end.length); }
const store = new Map();
const context = {console, localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)}, mins:t=>{const [h,m]=t.split(':').map(Number);return h*60+m}, masterSettings:()=>context.settings};
context.settings={roundUnit:1,overtimeHours:8,nightStart:'22:00',nightEnd:'05:00'}; vm.createContext(context);
vm.runInContext(extract('roundPunchTime=function', '};'),context);
const calcStart=html.lastIndexOf('calc=function(rows)'); const calcEnd=html.indexOf('\n};',calcStart)+3;
vm.runInContext(html.slice(calcStart,calcEnd),context);
assert.equal(context.roundPunchTime('出勤','09:07'),'09:07');
context.settings.roundUnit=15;
assert.equal(context.roundPunchTime('出勤','09:01'),'09:15');
assert.equal(context.roundPunchTime('休憩開始','12:14'),'12:00');
assert.equal(context.roundPunchTime('休憩終了','12:46'),'13:00');
assert.equal(context.roundPunchTime('退勤','18:14'),'18:00');
assert.equal(context.roundPunchTime('出勤','23:59'),'24:00');
assert.deepEqual([...context.calc([['出勤','22:00'],['退勤','24:00']])],[120,0,0,120]);
assert.deepEqual([...context.calc([['出勤','22:00'],['休憩開始','23:30'],['休憩終了','00:15'],['退勤','06:00']])],[435,45,0,375]);
assert.equal(context.calc([['出勤','09:00'],['退勤','08:00']])[0],null);
assert.equal(context.calc([['出勤','09:00'],['退勤','18:30']])[2],90); // 休憩なしで8時間超
context.settings.nightStart='21:00'; context.settings.nightEnd='04:00';
assert.equal(context.calc([['出勤','20:00'],['休憩開始','23:00'],['休憩終了','23:30'],['退勤','05:00']])[3],390); // 設定時間帯・休憩・日跨ぎ
context.yutoruWorkRules=()=>({earlyStart:'05:00',earlyEnd:'08:00'});
context._ymins=context.mins;
const earlyStart=html.indexOf('function earlyMinutesForRows'); const earlyEnd=html.indexOf('\nfunction staffEarlySummary',earlyStart);
vm.runInContext(html.slice(earlyStart,earlyEnd),context);
assert.equal(context.earlyMinutesForRows([['出勤','04:30'],['休憩開始','06:00'],['休憩終了','06:30'],['退勤','08:30']]),150); // 早朝から休憩を除外
assert.equal(context.earlyMinutesForRows([['出勤','23:00'],['退勤','06:00']]),60); // 日跨ぎ勤務の早朝

assert.match(html,/日付,スタッフ名,出勤,退勤,休憩,実働,残業,早朝,深夜,交通費/);
assert.match(html,/workTime:c\[0\],overtime:c\[2\],earlyTime:earlyMinutesForRows\(rows\),nightTime:c\[3\]/);
assert.match(html,/<th>実働<\/th><th>残業<\/th><th>早朝<\/th><th>深夜<\/th><th>交通費<\/th>/);
assert.doesNotMatch(html.slice(html.indexOf('window.buildAttendanceCsv'),html.indexOf('window.csv=')),/給与|時給|支給/);
assert.match(html,/r\.transport===null\?'':r\.transport/); // 0円と未設定を分離
assert.match(html,/\^yutoru_distribution_demo_/); // デモ名前空間だけをバックアップ対象に含む
assert.match(html,/#v34History,#v34Insurance,#v34Plus/);
assert.match(html,/MutationObserver/);
assert.match(html,/function payrollDetail/); assert.match(html,/PLUS_INSURANCE_KEY/); // 上位版コードを保持
assert.match(html,/<h1 id="distributionDemoTitle">YUTORU デモ版<\/h1>/);
assert.match(html,/実在するスタッフ名・電話番号・メールアドレスなどの個人情報は入力しないでください/);
assert.match(html,/id="distributionDemoStart"[^>]*>デモを始める<\/button>/);
assert.match(html,/const sampleNames=\['山田 太郎','佐藤 花子','鈴木 一郎'\]/);
assert.match(html,/\['退勤','24:00'\]/); // 24:00 と日跨ぎのサンプル
assert.match(html,/daily\[name\]\[date\]=i===5\?0:/); // 交通費0円を明示
assert.match(html,/デモデータを初期状態に戻します。よろしいですか？/);
assert.match(html,/key\.startsWith\(OWNED_PREFIX\)/); // 本番用キーには触れない
assert.match(html,/デモ用管理者PIN：<b>1234<\/b>/);
console.log('light-demo tests: ok');
