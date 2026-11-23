/* Project Reel by Kill Vanilla Studio: https://github.com/sq-assets/project-reel */
document.querySelectorAll('.reel').forEach(async row=>{
  const SMOOTH=.12;
  const ds=row.dataset,sec=row.closest('.page-section');if(!sec)return;
  const num=(v,d)=>{const n=parseFloat(v);return isNaN(n)?d:n};
  const clamp=(v,a=0,b=1)=>Math.min(Math.max(v,a),b);
  const esc=s=>String(s||'').replace(/&amp;/g,'&').replace(/&#39;|&rsquo;/g,'’').replace(/&quot;/g,'"').replace(/<[^>]+>/g,'').trim();
  const isMob=()=>innerWidth<(num(ds.mobileBreak,768))||matchMedia('(hover:none)').matches;
  const MSCROLL=(ds.mobile||'swipe').toLowerCase()==='scroll';let ph=false;
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
  /* click an image: it grows to fill the screen, then the post opens (post.js picks it up) */
  const OPEN=(ds.open||'grow').toLowerCase(),GMS=num(ds.growSpeed,1400);let growing=0;
  const grow=(fr,im,it,url)=>{if(growing)return;growing=1;
    const r=fr.getBoundingClientRect(),big=it.assetUrl.split('?')[0]+'?format=2500w';
    try{sessionStorage.setItem('rl-arrive',JSON.stringify({url:new URL(url,location.href).pathname,src:big,pos:im.style.objectPosition||'50% 50%',t:Date.now()}))}catch(e){}
    const g=document.createElement('div'),gi=new Image();g.className='rl-grow';gi.src=im.currentSrc||im.src;gi.style.objectPosition=im.style.objectPosition;g.append(gi);
    g.style.cssText='top:'+r.top+'px;left:'+r.left+'px;width:'+r.width+'px;height:'+r.height+'px;border-radius:'+getComputedStyle(fr).borderRadius+';--rl-gms:'+GMS+'ms';
    document.body.append(g);const pre=new Image();pre.onload=()=>{gi.src=big};pre.src=big;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{g.style.top=g.style.left='0px';g.style.width=innerWidth+'px';g.style.height=innerHeight+'px';g.style.borderRadius='0px'}));
    let done=0;const go=()=>{if(!done){done=1;location.href=url}};
    g.addEventListener('transitionend',e=>{if(e.propertyName==='height')go()});setTimeout(go,GMS+400)};
  /* page-to-page crossfade (Chrome/Safari): the full-screen image stays on screen while the post loads */
  if(OPEN==='grow'&&!document.getElementById('rl-vt')){const v=document.createElement('style');v.id='rl-vt';v.textContent='@view-transition{navigation:auto}::view-transition-group(root){animation-duration:.6s}';document.head.append(v)}
  addEventListener('pageshow',()=>{document.querySelectorAll('.rl-grow').forEach(n=>n.remove());growing=0});
  const isPost=(it,url)=>!NEWTAB&&OPEN==='grow'&&it.assetUrl&&new URL(url,location.href).origin===location.origin;
  row.innerHTML='';sec.classList.add('rl-on');
  const layer=document.createElement('div');layer.className='rl-layer';
  const track=document.createElement('div');track.className='rl-track';layer.append(track);
  const css=(p,v)=>v!=null&&v!==''&&layer.style.setProperty(p,v);
  const px=v=>/^[\d.]+$/.test(String(v))?v+'px':v;
  css('--rl-y',ds.y&&num(ds.y,14)+'%');css('--rl-ym',ds.yMobile&&num(ds.yMobile,22)+'%');css('--rl-gm',ds.gapMobile&&px(ds.gapMobile));css('--rl-gap',ds.gap&&px(ds.gap));css('--rl-pad',ds.padding);
  css('--rl-radius',ds.radius&&px(ds.radius));css('--rl-border',ds.border);css('--rl-color',ds.textColor);css('--rl-accent',ds.linkColor);
  css('--rl-ts',ds.titleSize);css('--rl-xs',ds.textSize);css('--rl-font',ds.fontName&&'"'+ds.fontName+'", var(--heading-font-font-family,sans-serif)');
  css('--rl-zoom',ds.zoom);css('--rl-wm',ds.widthMobile&&num(ds.widthMobile,78)+'vw');css('--rl-ratio-m',ds.ratioMobile);
  if((ds.uppercase||'on')==='off')css('--rl-case','none');
  const DIM=ds.dim==='off'?null:num(ds.dim,.35);if(DIM!=null)css('--rl-dim',DIM);
  if(INFO==='always')layer.classList.add('rl-always');
  const capH=()=>Math.max(0,...[...track.querySelectorAll('.rl-cap')].map(c=>c.offsetHeight+parseFloat(getComputedStyle(c).marginTop)));
  const phBlock=()=>ph&&FIT==='block'&&!ds.yMobile&&host.getBoundingClientRect().height>0;
  const H=()=>{if(ph){const hm=String(ds.heightMobile||'').trim();
      if(phBlock()&&(!hm||hm==='fill'))return Math.max(60,host.clientHeight-capH());
      return /px$/.test(hm)?parseFloat(hm):num(hm,50)*innerHeight/100}
    const hv=String(ds.height||'').trim();
    if(FIT==='block'&&(!hv||hv==='fill'))return Math.max(60,host.clientHeight-capH());
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
    if(LINK&&isPost(it,url)){let pf=0;
      el.addEventListener('pointerenter',()=>{if(pf)return;pf=1;const l=document.createElement('link');l.rel='prefetch';l.href=url;document.head.append(l)});
      el.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;e.preventDefault();grow(fr,im,it,url)}))}
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
    if(FIT==='block'&&!ph){const o=BLEED?host.getBoundingClientRect().left-sec.getBoundingClientRect().left:0;
      layer.style.left=-o+'px';layer.style.width=(BLEED?sec.clientWidth:host.clientWidth)+'px';if(BLEED&&!ds.padding)layer.style.setProperty('--rl-pad',o+'px')}
    const VARY=on('vary'),AMT=clamp(num(ds.varyAmount,.3),0,.9),AL={top:0,center:.5,middle:.5,bottom:1}[(ds.align||'bottom').toLowerCase()];
    /* phones: the strip sits where the Code Block is in your phone layout */
    track.style.top=phBlock()?(host.getBoundingClientRect().top-sec.getBoundingClientRect().top).toFixed(1)+'px':'';
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
    const edit=document.body.classList.contains('sqs-edit-mode-active');const sm=isMob(),m=sm&&!MSCROLL,p=sm&&MSCROLL;
    if(m!==mob||p!==ph){mob=m;ph=p;layer.classList.toggle('rl-inblock',FIT==='block'&&!m&&!p);(m||p||FIT==='section'?sec:host).append(layer);if(m||p){layer.style.left=layer.style.width=''}layer.classList.toggle('rl-phone',p);sec.classList.toggle('rl-phone',p);layer.classList.toggle('rl-mobile',m);sec.classList.toggle('rl-mobile',m);if(m){track.style.transform='';layer.classList.add('rl-always')}else if(INFO!=='always')layer.classList.remove('rl-always')}
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
