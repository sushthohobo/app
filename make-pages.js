// ব্যবহার: টার্মিনালে  node make-pages.js
const fs = require('fs');
const keys = ['doctors','hospitals','blood','help-request','help-donate','ai','firstaid','tips',
  'emergency','career','tests','ambulance','medicine','appointment','vaccine','mental'];

keys.forEach(k => {
  const f = k + '.html';
  if (fs.existsSync(f)) { console.log('⏭️  আছে, বাদ:', f); return; }   // আসল কোড লেখা ফাইল মুছবে না
  fs.writeFileSync(f, `<!DOCTYPE html>
<html lang="bn"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>সুস্থ হবো</title><meta name="theme-color" content="#006a4e">
<link rel="icon" href="images/logo.svg" type="image/svg+xml">
<link rel="stylesheet" href="css/style.css">
</head><body>
<div id="site-header"></div>
<main id="page"></main>
<div id="site-footer"></div>
<script src="js/config.js"></script><script src="js/data.js"></script><script src="js/app.js"></script>
<script>Page.coming('${k}')</script>
</body></html>`);
  console.log('✅ তৈরি:', f);
});
