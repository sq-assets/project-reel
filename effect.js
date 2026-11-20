/* Project Reel by Kill Vanilla Studio: https://github.com/sq-assets/project-reel */
document.querySelectorAll('.reel').forEach(async row=>{
  const SMOOTH=.12;
  const ds=row.dataset,sec=row.closest('.page-section');if(!sec)return;
  const num=(v,d)=>{const n=parseFloat(v);return isNaN(n)?d:n};
  const clamp=(v,a=0,b=1)=>Math.min(Math.max(v,a),b);
  const esc=s=>String(s||'').replace(/&amp;/g,'&').replace(/&#39;|&rsquo;/g,'’').replace(/&quot;/g,'"').replace(/<[^>]+>/g,'').trim();
  const isMob=()=>innerWidth<(num(ds.mobileBreak,768))||matchMedia('(hover:none)').matches;
  let items=[];
  try{const r=await fetch(ds.collection+(ds.collection.includes('?')?'&':'?')+'format=json');items=(await r.json()).items||[]}catch(e){return}
  if((ds.order||'newest')==='oldest')items.reverse();
  items=items.filter(i=>i.assetUrl).slice(0,num(ds.max,12));
  if(!items.length)return;
  const on=k=>(ds[k]||'').toLowerCase()==='on',off=k=>(ds[k]||'').toLowerCase()==='off';
  const INFO=(ds.info||'hover').toLowerCase(),LINK=!off('link'),NEWTAB=on('linkNewTab');
  const FIT=(ds.fit||'block').toLowerCase()==='section'?'section':'block',BLEED=on('bleed');
  const host=FIT==='block'?(row.closest('.fe-block')||row.parentElement):sec;if(FIT==='block')host.classList.add('rl-host');
    const PAT=[0,.7,.3,1,.15,.55,.85,.4];
  row.innerHTML='';sec.classList.add('rl-on');
  const layer=document.createElement('div');layer.className='rl-layer';
  const track=document.createElement('div');track.className='rl-track';layer.append(track);
  const css=(p,v)=>v!=null&&v!==''&&layer.style.setProperty(p,v);
  const px=v=>/^[\d.]+$/.test(String(v))?v+'px':v;
  css('--rl-y',ds.y&&num(ds.y,14)+'%');css('--rl-gap',ds.gap&&px(ds.gap));css('--rl-pad',ds.padding);
  css('--rl-radius',ds.radius&&px(ds.radius));css('--rl-border',ds.border);css('--rl-color',ds.textColor);css('--rl-accent',ds.linkColor);
  css('--rl-ts',ds.titleSize);css('--rl-xs',ds.textSize);css('--rl-font',ds.fontName&&'"'+ds.fontName+'", var(--heading-font-font-family,sans-serif)');
  css('--rl-zoom',ds.zoom);css('--rl-wm',ds.widthMobile&&num(ds.widthMobile,78)+'vw');css('--rl-ratio-m',ds.ratioMobile);
  if((ds.uppercase||'on')==='off')css('--rl-case','none');
  const DIM=ds.dim==='off'?null:num(ds.dim,.35);if(DIM!=null)css('--rl-dim',DIM);
  if(INFO==='always')layer.classList.add('rl-always');
  const H=()=>{const hv=String(ds.height||'').trim();
    if(FIT==='block'&&(!hv||hv==='fill')){const ch=Math.max(0,...[...track.querySelectorAll('.rl-cap')].map(c=>c.offsetHeight+parseFloat(getComputedStyle(c).marginTop)));return Math.max(60,host.clientHeight-ch)}
    return /px$/.test(hv)?parseFloat(hv):num(hv,48)*innerHeight/100};
  const ratio=(()=>{const r=(ds.ratio||'auto').split('/').map(Number);return r.length===2&&r[0]&&r[1]?r[0]/r[1]:null})();
  const img=u=>/\.(gif|webp)$/i.test(u.split('?')[0])?u:u+'?format=1000w';
  const cards=items.map((it,i)=>{
    const el=document.createElement('article');el.className='rl-item';
    const url=it.sourceUrl||it.fullUrl;
    const fr=document.createElement(LINK?'a':'div');fr.className='rl-frame';if(LINK){fr.href=url;if(NEWTAB){fr.target='_blank';fr.rel='noopener'}}
    const im=document.createElement('img');im.alt=esc(it.title);im.loading=i<4?'eager':'lazy';im.decoding='async';im.src=img(it.assetUrl);fr.append(im);
    const fs=(it.mediaFocalPoint||{});if(fs.x!=null)im.style.objectPosition=(fs.x*100)+'% '+(fs.y*100)+'%';
    el.append(fr);
    if(!off('captions')){const c=document.createElement('p');c.className='rl-cap';
      if(!off('numbers')){const n=document.createElement('span');n.className='rl-num';n.textContent=String(i+1).padStart(2,'0');c.append(n)}
      const t=document.createElement('span');t.className='rl-title';t.textContent=esc(it.title);c.append(t);el.append(c)}
    if(INFO!=='off'){const box=document.createElement('div');box.className='rl-info';const inner=document.createElement('div');
      const ex=esc(it.excerpt);if(ex&&!off('excerpt')){const p=document.createElement('p');p.className='rl-ex';p.textContent=ex;inner.append(p)}
      const tags=[...(it.categories||[]),...(it.tags||[])];if(tags.length&&!off('tags')){const p=document.createElement('p');p.className='rl-tags';p.textContent=tags.join(' · ');inner.append(p)}
      if(LINK&&!off('more')){const a=document.createElement('a');a.className='rl-more';a.href=url;a.textContent=ds.linkText||'View project';if(NEWTAB){a.target='_blank';a.rel='noopener'}inner.append(a)}
      box.append(inner);el.append(box)}
    el.ar=ratio;if(!ratio)im.addEventListener('load',()=>{if(im.naturalWidth){el.ar=im.naturalWidth/im.naturalHeight;size()}},{once:true});
    track.append(el);return el});
  /* hover: open one panel at a time, dim the rest */
  let openT=null;
  const open=el=>{clearTimeout(openT);cards.forEach(c=>c.classList.toggle('on',c===el));layer.classList.toggle('rl-dim',!!el&&DIM!=null)};
  cards.forEach(el=>{el.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')open(el)});el.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')openT=setTimeout(()=>open(null),120)})});
  (FIT==='block'?host:sec).append(layer);if(sec.querySelectorAll('.fe-block').length<2)sec.classList.add('rl-solo');
  /* layout and scroll */
  let W=0,D=0,len=0,cur=0,tgt=0,raf=null,mob=null;
  const scene=document.createElement('div');scene.className='rl-scene';
  const hb=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-bottom'))||0;
  const size=()=>{
    const frames=cards.map(c=>c.querySelector('.rl-frame'));
    if(mob){cards.forEach((c,i)=>{c.style.width=c.style.marginTop=frames[i].style.height=''});return}
    if(FIT==='block'){const o=BLEED?host.getBoundingClientRect().left-sec.getBoundingClientRect().left:0;
      layer.style.left=-o+'px';layer.style.width=(BLEED?sec.clientWidth:host.clientWidth)+'px';if(BLEED&&!ds.padding)layer.style.setProperty('--rl-pad',o+'px')}
    const VARY=on('vary'),AMT=clamp(num(ds.varyAmount,.3),0,.9),AL={top:0,center:.5,middle:.5,bottom:1}[(ds.align||'bottom').toLowerCase()];
    const mh=H();
    cards.forEach((c,i)=>{const h=mh*(VARY?1-AMT*PAT[i%PAT.length]:1);
      frames[i].style.height=h.toFixed(1)+'px';c.style.width=(h*(c.ar||num(ds.fallbackRatio,.8))).toFixed(1)+'px';c.style.marginTop=((mh-h)*(AL??1)).toFixed(1)+'px'});
    W=layer.clientWidth;D=Math.max(0,track.scrollWidth-W);len=D/(innerHeight*num(ds.speed,1));
    if(scene.isConnected)scene.style.height=(sec.getBoundingClientRect().height+innerHeight*len+innerHeight*num(ds.hold,.3))+'px';
    update();paint()};
  const paint=()=>{if(mob)return;const p=len?clamp(cur/len):0;track.style.transform='translateX('+(-D*p).toFixed(1)+'px)'};
  const tick=()=>{cur+=(tgt-cur)*SMOOTH;if(Math.abs(tgt-cur)<.0005)cur=tgt;paint();raf=cur!==tgt?requestAnimationFrame(tick):null};
  const update=()=>{if(mob||!scene.isConnected)return;tgt=clamp((hb()-scene.getBoundingClientRect().top)/innerHeight,0,len);if(!raf)raf=requestAnimationFrame(tick)};
  const mode=()=>{
    const edit=document.body.classList.contains('sqs-edit-mode-active');const m=isMob();
    if(m!==mob){mob=m;layer.classList.toggle('rl-inblock',FIT==='block'&&!m);(m||FIT==='section'?sec:host).append(layer);if(m){layer.style.left=layer.style.width=''}layer.classList.toggle('rl-mobile',m);sec.classList.toggle('rl-mobile',m);if(m){track.style.transform='';layer.classList.add('rl-always')}else if(INFO!=='always')layer.classList.remove('rl-always')}
    const want=!edit&&!mob;
    if(!want&&scene.isConnected){scene.replaceWith(sec)}
    if(want&&!scene.isConnected){sec.before(scene);scene.append(sec)}
    size()};
  if(mob===null)mode();
  new MutationObserver(mode).observe(document.body,{attributes:true,attributeFilter:['class']});
  addEventListener('scroll',update,{passive:true});
  addEventListener('resize',mode);if(window.ResizeObserver&&FIT==='block'){let q;new ResizeObserver(()=>{cancelAnimationFrame(q);q=requestAnimationFrame(size)}).observe(host)}addEventListener('load',size);
  if(document.fonts)document.fonts.ready.then(size);
});
