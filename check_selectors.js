const cheerio = require('cheerio');
fetch('https://ubfsf.org/nonprofit-conference/').then(r=>r.text()).then(html=>{
  const $ = cheerio.load(html);
  const sel=['#main-content','#main','#content','#et-main-area','.entry-content','.et_pb_page_content'];
  sel.forEach(s=>{
    const el=$(s);
    if(el.length){
      console.log('SELECTOR', s, 'length', el.length);
      console.log(el.html().slice(0,200));
      console.log('---');
    }
  });
});
