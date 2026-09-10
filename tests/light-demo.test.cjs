const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
function extract(start, end) { const a=html.indexOf(start), b=html.indexOf(end,a); assert(a>=0&&b>a); return html.slice(a,b+end.length); }
const store = new Map();
const context = {console, localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)}, mins:t=>{const [h,m]=t.split(':').map(Number);return h*60+m}, masterSettings:()=>context.settings};
context.settings={roundUnit:1,overtimeHours:8}; vm.createContext(context);
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
assert.match(html,/日付,スタッフ名,出勤,退勤,休憩,実働,深夜,交通費/);
assert.doesNotMatch(html.slice(html.indexOf('window.buildAttendanceCsv'),html.indexOf('window.csv=')),/給与|時給|支給/);
assert.match(html,/r\.transport===null\?'':r\.transport/); // 0円と未設定を分離
assert.match(html,/\^\(yutoru_\|attendance_master_\|zucca_\)/); // 勤怠をバックアップ対象に含む
assert.match(html,/#v34History,#v34Insurance,#v34Plus/);
assert.match(html,/MutationObserver/);
assert.match(html,/function payrollDetail/); assert.match(html,/PLUS_INSURANCE_KEY/); // 上位版コードを保持
console.log('light-demo tests: ok');
