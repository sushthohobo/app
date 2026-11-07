Layout.init('home');

/* ===== হিরো স্লাইডার ===== */
(function(){
  const hero = $('#hero'), slides = $$('.slide', hero), dotsBox = $('.dots', hero);
  let i = 0, timer;
  dotsBox.innerHTML = slides.map((_, k) => `<button aria-label="স্লাইড ${bn(k+1)}"></button>`).join('');
  const dots = $$('button', dotsBox); dots[0].classList.add('on');
  dots.forEach((d, k) => d.onclick = () => go(k));
  function bar(){ const b = $('.bar i', hero); b.style.animation = 'none'; b.offsetWidth; b.style.animation = ''; }
  function go(n){
    slides[i].classList.remove('active'); dots[i].classList.remove('on');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('active'); dots[i].classList.add('on'); restart();
  }
  function restart(){ clearInterval(timer); bar(); timer = setInterval(() => go(i + 1), 7000); }
  $('#prev').onclick = () => go(i - 1); $('#next').onclick = () => go(i + 1);
  let x0 = null;
  hero.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive:true });
  hero.addEventListener('touchend', e => { if(x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if(Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); x0 = null; });
  restart();
})();

/* ===== সার্চ ===== */
Geo.bind($('#sdv'), $('#sdi'), $('#sup'));
let stype = 'doctors';
$$('.stabs button').forEach(b => b.onclick = () => {
  $$('.stabs button').forEach(x => x.classList.remove('on')); b.classList.add('on');
  stype = b.dataset.t; $('#sq').placeholder = b.dataset.ph;
});
$('#sform').onsubmit = e => {
  e.preventDefault();
  location.href = stype + '.html?' + new URLSearchParams({ division:$('#sdv').value, district:$('#sdi').value, upazila:$('#sup').value, q:$('#sq').value });
};

/* ===== পরিসংখ্যান ===== */
$('#cDist').dataset.count = TOTAL_DISTRICTS; $('#cUp').dataset.count = Math.floor(TOTAL_UPAZILAS / 10) * 10;

/* ===== সার্ভিস, বিশেষজ্ঞ ===== */
$('#svcGrid').innerHTML = SERVICES.map((s, k) => `
  <a href="${s.k}.html" class="svc rv ${s.red ? 'red' : ''}" style="--d:${(k % 4) * .08}s">
    <span class="st soon">আসিতেছে</span><div class="ic">${s.i}</div><h3>${s.t}</h3><p>${s.d}</p></a>`).join('');
$('#specGrid').innerHTML = SPECIALTIES.map((s, k) => `
  <a href="doctors.html?specialty=${s.id}" class="spec rv" style="--d:${(k % 4) * .06}s"><i>${s.icon}</i><div><h4>${s.name}</h4><p>${s.desc}</p></div></a>`).join('');

/* ===== ব্লাড ===== */
$('#bgrid').innerHTML = BLOOD_GROUPS.map(g => `<button class="bgb" data-g="${g}">${g}<small>গ্রুপ</small></button>`).join('');
$('#bgrid').onclick = e => {
  const b = e.target.closest('.bgb'); if(!b) return;
  $$('.bgb').forEach(x => x.classList.remove('on')); b.classList.add('on');
  const m = BLOOD_MAP[b.dataset.g], pills = a => a.map(x => `<span class="pill">${x}</span>`).join('');
  $('#compat').innerHTML = `<p><b>${b.dataset.g}</b> গ্রুপের মানুষ যাদের <b>রক্ত দিতে পারেন</b>:</p>${pills(m.give)}<p style="margin-top:12px">যাদের কাছ থেকে <b>রক্ত নিতে পারেন</b>:</p>${pills(m.take)}`;
};
const REQ = [
  {g:'O+',n:'নমুনা রোগী ১',h:'নমুনা হাসপাতাল',a:'ঢাকা',b:2,w:'আজই',u:1},
  {g:'B+',n:'নমুনা রোগী ২',h:'নমুনা হাসপাতাল',a:'চট্টগ্রাম',b:1,w:'আগামীকাল',u:0},
  {g:'A-',n:'নমুনা রোগী ৩',h:'নমুনা হাসপাতাল',a:'সিলেট',b:3,w:'আজই',u:1}
];
$('#reqList').innerHTML = REQ.map(r => `
  <div class="req"><div class="bdrop"><span>${r.g}</span></div><div>
    <h4>${r.n} ${r.u ? '<span class="demo">জরুরি</span>' : ''}</h4>
    <div class="m">🩸 ${bn(r.b)} ব্যাগ • 📅 ${r.w} • 🏥 ${r.h} • 📍 ${r.a}</div>
    <span class="lock">🔒 মোবাইল নম্বর লগইনের পর দেখা যাবে</span></div></div>`).join('');

/* ===== প্রাথমিক চিকিৎসা ===== */
const FA = [
 {i:'🩸',t:'প্রচুর রক্তপাত',s:['পরিষ্কার কাপড় দিয়ে ক্ষতস্থানে সরাসরি জোরে চাপ দিন','আহত অংশ হৃদপিণ্ডের উপরে তুলে রাখুন','কাপড় ভিজে গেলে সরাবেন না, উপরে আরেকটি দিন','দ্রুত হাসপাতালে নিন বা ৯৯৯-এ কল করুন']},
 {i:'🔥',t:'পুড়ে গেলে',s:['১০–২০ মিনিট ঠান্ডা (বরফ নয়) চলমান পানি ঢালুন','আংটি, ঘড়ি বা আঁটসাঁট কাপড় আলগা করুন','ফোসকা ফাটাবেন না; তেল, টুথপেস্ট বা মাখন দেবেন না','পরিষ্কার কাপড়ে আলগা করে ঢেকে হাসপাতালে যান']},
 {i:'😮‍💨',t:'গলায় খাবার আটকালে',s:['কাশতে উৎসাহ দিন','না পারলে পিঠে দুই কাঁধের মাঝে ৫ বার জোরে চাপড় দিন','তারপর পেটের উপরে ৫ বার ঠেলা দিন (হাইমলিক)','অজ্ঞান হলে ৯৯৯ কল করে CPR শুরু করুন']},
 {i:'💔',t:'বুকে ব্যথা / হার্ট অ্যাটাকের সন্দেহ',s:['রোগীকে আরামে বসিয়ে বিশ্রামে রাখুন','আঁটসাঁট জামা ঢিলা করে দিন','হাঁটতে দেবেন না, দেরি না করে ৯৯৯-এ কল করুন','চিকিৎসকের নির্দেশ ছাড়া নিজে ওষুধ দেবেন না']},
 {i:'⚡',t:'খিঁচুনি',s:['রোগীকে নিরাপদ জায়গায় পাশ ফিরিয়ে শোয়ান','আশেপাশের শক্ত জিনিস সরিয়ে দিন','মুখে চামচ, পানি বা কিছু দেবেন না','৫ মিনিটের বেশি স্থায়ী হলে বা বারবার হলে জরুরি সেবা নিন']},
 {i:'🐍',t:'সাপে কাটলে',s:['রোগীকে শান্ত রাখুন, নড়াচড়া কমান','কামড়ের জায়গা কাটা, চোষা বা শক্ত করে বাঁধা যাবে না','আংটি/চুড়ি খুলে নিন, অঙ্গ হৃদপিণ্ডের নিচে রাখুন','ওঝা নয় — এখনই অ্যান্টিভেনম আছে এমন হাসপাতালে নিন']}
];
$('#faGrid').innerHTML = FA.map((f, k) => `<div class="fa rv" style="--d:${(k % 3) * .08}s"><h3><span>${f.i}</span>${f.t}</h3><ol>${f.s.map(x => `<li>${x}</li>`).join('')}</ol></div>`).join('');

/* ===== জরুরি নম্বর ===== */
const NUMS = [
 {n:'৯৯৯',t:'জাতীয় জরুরি সেবা',d:'পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স',tel:'999',r:1},
 {n:'১৬২৬৩',t:'স্বাস্থ্য বাতায়ন',d:'স্বাস্থ্য পরামর্শ ও তথ্য (২৪ ঘণ্টা)',tel:'16263'},
 {n:'১০৯',t:'নারী ও শিশু সহায়তা',d:'নির্যাতন প্রতিরোধ হেল্পলাইন',tel:'109',r:1},
 {n:'১০৯৮',t:'শিশু হেল্পলাইন',d:'বিপদগ্রস্ত শিশুর জন্য',tel:'1098'},
 {n:'৩৩৩',t:'সরকারি তথ্য সেবা',d:'জাতীয় তথ্য বাতায়ন কলসেন্টার',tel:'333'},
 {n:'১৬৪৩০',t:'বিনামূল্যে আইনি সহায়তা',d:'জাতীয় আইনগত সহায়তা',tel:'16430'},
 {n:'১০৬',t:'দুর্নীতি দমন কমিশন',d:'সেবায় ঘুষ/দুর্নীতির অভিযোগ',tel:'106'},
 {n:'০১৭৭৯-৫৫৪৩৯১',t:'কান পেতে রই',d:'মানসিক সহায়তা',tel:'01779554391'}
];
$('#numGrid').innerHTML = NUMS.map((x, k) => `<div class="numc rv ${x.r ? 'r' : ''}" style="--d:${(k % 4) * .06}s"><b style="font-size:${x.n.length > 6 ? 21 : 30}px">${x.n}</b><h4>${x.t}</h4><p>${x.d}</p><a href="tel:${x.tel}" class="btn ${x.r ? 'btn-r' : 'btn-g'} btn-sm">📞 কল করুন</a></div>`).join('');

/* ===== স্বাস্থ্য শিক্ষা (আনুমানিক) ===== */
const CAR = [
 {i:'👨‍⚕️',t:'MBBS',q:'এইচএসসি (বিজ্ঞান) + ভর্তি পরীক্ষা',y:'৫ বছর + ১ বছর ইন্টার্ন',c:'সরকারি: খুবই কম • বেসরকারি: কয়েক লাখ থেকে ৪০ লাখ+',d:5},
 {i:'🦷',t:'BDS (দন্ত)',q:'এইচএসসি (বিজ্ঞান) + ভর্তি পরীক্ষা',y:'৫ বছর + ১ বছর ইন্টার্ন',c:'সরকারি: কম • বেসরকারি: ১০–২০ লাখ+',d:4},
 {i:'👩‍⚕️',t:'বি.এসসি নার্সিং',q:'এইচএসসি (বিজ্ঞান)',y:'৪ বছর',c:'সরকারি: কম • বেসরকারি: ২–৪ লাখ+',d:5},
 {i:'🩺',t:'ডিপ্লোমা নার্সিং ও মিডওয়াইফারি',q:'এসএসসি',y:'৩ বছর',c:'সরকারি: কম • বেসরকারি: ১–২.৫ লাখ+',d:5},
 {i:'🔬',t:'ডিপ্লোমা মেডিকেল টেকনোলজি',q:'এসএসসি',y:'৪ বছর',c:'১–৩ লাখ+',d:4},
 {i:'💊',t:'ডিপ্লোমা ফার্মেসি',q:'এসএসসি',y:'৪ বছর',c:'১–২.৫ লাখ+',d:3},
 {i:'🧪',t:'বি.ফার্ম',q:'এইচএসসি (বিজ্ঞান)',y:'৪ বছর',c:'বেসরকারি: ৪–৮ লাখ+',d:4},
 {i:'🏃',t:'ফিজিওথেরাপি',q:'এইচএসসি (বিজ্ঞান)',y:'৪ বছর + ১ বছর ইন্টার্ন',c:'৩–৬ লাখ+',d:4}
];
$('#carGrid').innerHTML = CAR.map((c, k) => `<div class="cc rv" style="--d:${(k % 4) * .07}s"><h3><span>${c.i}</span>${c.t}</h3>
  <dl><dt>ভর্তির যোগ্যতা</dt><dd>${c.q}</dd><dt>মেয়াদ</dt><dd>${c.y}</dd><dt>আনুমানিক খরচ</dt><dd>${c.c}</dd><dt>চাকরির চাহিদা</dt><dd class="stars">${'★'.repeat(c.d)}${'☆'.repeat(5 - c.d)}</dd></dl></div>`).join('');

/* ===== BMI (এশীয় মানদণ্ড) ও টিপস ===== */
$('#bbtn').onclick = () => {
  const h = +$('#bh').value / 100, w = +$('#bw').value, o = $('#bout');
  if(!h || !w){ toast('উচ্চতা ও ওজন দিন'); return; }
  const v = w / (h * h);
  const s = v < 18.5 ? ['কম ওজন','পুষ্টিকর খাবার বাড়ান, প্রয়োজনে পুষ্টিবিদের পরামর্শ নিন।'] : v < 23 ? ['স্বাভাবিক ওজন 👏','এভাবেই সুস্থ জীবনযাপন চালিয়ে যান।'] : v < 27.5 ? ['ওজন বেশি','নিয়মিত হাঁটুন, চিনি ও তেল কমান।'] : ['স্থূলতা','চিকিৎসক বা পুষ্টিবিদের পরামর্শ নিন।'];
  o.style.display = 'block'; o.innerHTML = `আপনার BMI: <b>${bn(v.toFixed(1))}</b> — ${s[0]}<br><small style="font-weight:400">${s[1]} (এশীয় মানদণ্ড অনুযায়ী)</small>`;
};
const TIPS = ['দিনে অন্তত ৮ গ্লাস নিরাপদ পানি পান করুন 💧','প্রতিদিন কমপক্ষে ৩০ মিনিট হাঁটুন 🚶','খাবারে লবণ কম, ফল ও সবজি বেশি রাখুন 🥦','প্রাপ্তবয়স্কদের রাতে ৭–৮ ঘণ্টা ঘুম দরকার 😴','ডেঙ্গুর মৌসুমে বাসার আশেপাশে পানি জমতে দেবেন না 🦟','৪০ বছরের পর বছরে অন্তত একবার রক্তচাপ ও সুগার পরীক্ষা করান 🩺','সুস্থ প্রাপ্তবয়স্করা সাধারণত ৩–৪ মাস পর পর রক্ত দিতে পারেন 🩸','ডাক্তারের পরামর্শ ছাড়া অ্যান্টিবায়োটিক খাবেন না 💊','খাওয়ার আগে ও টয়লেটের পর সাবান দিয়ে হাত ধুয়ে নিন 🧼'];
let ti = Math.floor(Math.random() * TIPS.length);
const showTip = () => { const t = $('#tip'); t.style.opacity = 0; setTimeout(() => { t.textContent = TIPS[ti]; t.style.opacity = 1; }, 200); };
$('#tbtn').onclick = () => { ti = (ti + 1) % TIPS.length; showTip(); }; showTip();

/* ===== অঙ্গীকার, ধাপ, FAQ ===== */
$('#trustGrid').innerHTML = [['✅','যাচাইকৃত তথ্য','ডাক্তার, হাসপাতাল ও খরচের তথ্য যাচাই করে প্রকাশ'],['🆓','সম্পূর্ণ বিনামূল্যে','রোগী ও রক্তদাতার জন্য কোনো ফি নেই'],['🇧🇩','সবকিছু বাংলায়','সহজ ভাষায়, যে কেউ বুঝতে পারবেন'],['🔒','গোপনীয়তা সুরক্ষা','আপনার তথ্য নিরাপদ, নম্বর শুধু লগইন করা ব্যবহারকারী দেখবেন']]
  .map((t, k) => `<div class="trust rv" style="--d:${k * .08}s"><i>${t[0]}</i><h4>${t[1]}</h4><p>${t[2]}</p></div>`).join('');
$('#howGrid').innerHTML = [['১','এলাকা বাছুন','বিভাগ, জেলা ও উপজেলা নির্বাচন করুন'],['২','সমস্যা জানান','নিজে খুঁজুন বা এআই গাইডকে বলুন'],['৩','তুলনা করুন','ডাক্তার, হাসপাতাল ও খরচ দেখুন'],['৪','সিদ্ধান্ত নিন','যোগাযোগ করুন বা সিরিয়াল নিন']]
  .map((s, k) => `<div class="trust rv" style="--d:${k * .08}s"><span class="n" style="width:50px;height:50px;border-radius:50%;background:${k % 2 ? 'var(--r)' : 'var(--g)'};color:#fff;display:grid;place-items:center;font-weight:700;font-size:20px;margin:0 auto 10px">${s[0]}</span><h4>${s[1]}</h4><p>${s[2]}</p></div>`).join('');
$('#faq').innerHTML = [
 ['এই সাইট ব্যবহার করতে কি টাকা লাগবে?','না। রোগী, রক্তদাতা ও সহযোগিতা অনুরোধকারী — সবার জন্য সেবা সম্পূর্ণ বিনামূল্যে।'],
 ['এআই গাইড কি ডাক্তারের বিকল্প?','না। এটি শুধু দিকনির্দেশনা দেয় — কোন বিভাগে যাবেন, কী করবেন। রোগ নির্ণয় ও চিকিৎসা শুধু রেজিস্টার্ড চিকিৎসকই করতে পারেন।'],
 ['রক্তদাতা হলে আমার নম্বর কি সবাই দেখবে?','না। আপনার নম্বর শুধু লগইন করা ব্যবহারকারীরা প্রয়োজনের সময় দেখতে পাবেন।'],
 ['সহযোগিতা অনুরোধ কীভাবে যাচাই হয়?','রোগীর ডকুমেন্ট, হাসপাতালের তথ্য ও স্থানীয় সূত্রে খোঁজ নিয়ে নিশ্চিত হওয়ার পরই পোস্ট প্রকাশ করা হয়।'],
 ['কোন এলাকার জন্য সেবা পাওয়া যাবে?','পুরো বাংলাদেশের ৮ বিভাগের সব জেলা ও উপজেলা সাজানো আছে। এলাকাভিত্তিক তথ্য ধাপে ধাপে যুক্ত হচ্ছে।']
].map(q => `<details class="rv"><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join('');

Reveal.scan();