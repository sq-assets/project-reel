/* Project Reel: full-screen image hero on blog posts, picks up the grow-out from the reel. Put in the HEADER. */
(()=>{
  const ds=(document.currentScript||{}).dataset||{};
  const cols=(ds.collections||'').split(',').map(s=>s.trim().replace(/\/$/,'')).filter(Boolean),path=location.pathname;
  if(!cols.some(c=>path.startsWith(c+'/')))return;
  let arr=null;try{arr=JSON.parse(sessionStorage.getItem('rl-arrive')||'null')}catch(e){}
  if(arr&&(arr.url!==path||Date.now()-arr.t>20000))arr=null;
  const root=document.documentElement;root.classList.add('rlh-on');if(arr)root.classList.add('rlh-arriving');
  const st=document.createElement('style');st.textContent=
    'html.rlh-arriving body{visibility:hidden}html.rlh-arriving .rlh{visibility:visible}'+
    '.rlh{position:relative;height:100vh;height:100svh;overflow:hidden;margin:0;background:'+(ds.background||'transparent')+'}'+
    '.rlh-frame{position:absolute;top:var(--rlh-t,0px);left:var(--rlh-i,0px);right:var(--rlh-i,0px);bottom:var(--rlh-i,0px);overflow:hidden;border-radius:var(--rlh-r,0px);border:var(--rlh-b,0 none);transition:top .3s ease}'+
    '.rlh-img{position:absolute;inset:-30% 0 0 0;background:center/cover no-repeat;will-change:transform}.rlh:not(.rlh-framed) .rlh-img{inset:0}'+
    '.rlh-in #header,.rlh-in .rlh~*{animation:rlhFade .9s ease both}@keyframes rlhFade{from{opacity:0}to{opacity:1}}'+
    '@view-transition{navigation:auto}::view-transition-group(root){animation-duration:.6s}'+
    '.rlh-back-wrap{position:fixed;z-index:100001}.rlh-back{display:inline-flex;align-items:center;gap:.5em;padding:0;text-decoration:none!important;transition:opacity .25s ease,color .25s ease}'+
    '.rlh-back:hover{opacity:.6}.rlh-back[style*="--rlh-hover"]:hover{opacity:1;color:var(--rlh-hover)!important}.rlh-blend{mix-blend-mode:difference;color:#fff!important}'+
    '.rlh-top-left{top:var(--rlh-o);left:var(--rlh-x)}.rlh-top-right{top:var(--rlh-o);right:var(--rlh-x)}.rlh-bottom-left{bottom:24px;left:var(--rlh-x)}.rlh-bottom-right{bottom:24px;right:var(--rlh-x)}'+
    '.rlh-pill{padding:.55em 1.3em;border:1px solid var(--rlh-bc,currentColor);border-radius:999px;background:var(--rlh-bg,transparent);line-height:1!important}'+
    'body.sqs-edit-mode-active .rlh-back-wrap{display:none}';
  document.head.append(st);
  const name=s=>(s||'').split('?')[0].split('/').pop();
  const build=()=>{
    if(!document.body.classList.contains('view-item')){root.classList.remove('rlh-on','rlh-arriving');return}
    const og=document.querySelector('meta[property="og:image"]');
    const src=arr?arr.src:og&&og.content&&og.content.split('?')[0].replace(/^http:/,'https:')+'?format=2500w';
    if(!src){root.classList.remove('rlh-arriving');return}
    const hero=document.createElement('section'),fr=document.createElement('div'),bg=document.createElement('div'),im=new Image();hero.className='rlh';fr.className='rlh-frame';bg.className='rlh-img';
    bg.style.backgroundImage='url("'+src+'")';bg.style.backgroundPosition=arr&&arr.pos||'50% 50%';hero.setAttribute('role','img');fr.append(bg);hero.append(fr);im.src=src;
    /* framed hero: data-hero-inset (px gap round the image), data-hero-radius, data-hero-border */
    const px=v=>/^[\d.]+$/.test(v)?v+'px':v,ins=parseFloat(ds.heroInset)||0,framed=ins>0||!!ds.heroRadius||!!ds.heroBorder;
    if(framed){hero.classList.add('rlh-framed');hero.style.setProperty('--rlh-i',ins+'px');if(ds.heroRadius)hero.style.setProperty('--rlh-r',px(ds.heroRadius));if(ds.heroBorder)hero.style.setProperty('--rlh-b',ds.heroBorder)}
    const frameTop=below=>{if(!framed)return;const hd=document.querySelector('#header'),b=Math.max(below||0,hd?hd.getBoundingClientRect().bottom:0);hero.style.setProperty('--rlh-t',(ins?b+ins:0)+'px')};frameTop();addEventListener('resize',()=>frameTop());
    const host=document.querySelector('#sections')||document.querySelector('main')||document.body;host.prepend(hero);
    /* hide the post's own copy of the same image */
    if(ds.hideImage!=='off')document.querySelectorAll('article img').forEach(i=>{if(name(i.dataset.src||i.src)===name(src))(i.closest('figure,.image-block-outer-wrapper,.blog-item-image')||i).style.display='none'});
    if(ds.parallax!=='off'){const p=parseFloat(ds.parallax)||.35;addEventListener('scroll',()=>{if(scrollY<innerHeight*1.5)bg.style.transform='translateY('+(framed?Math.min(scrollY*p,fr.offsetHeight*.28):scrollY*p).toFixed(1)+'px)'},{passive:true})}
    /* back link: nav-styled text, or a pill below the header (data-back-style="pill") */
    if(ds.back!=='off'){
      const url=ds.backUrl||'/',pos=ds.backPosition||'top-left',w=document.createElement('div'),a=document.createElement('a');
      w.className='rlh-back-wrap rlh-'+pos;a.className='rlh-back'+(ds.backBlend==='on'?' rlh-blend':'');a.href=url;
      a.textContent=(ds.backArrow==='off'?'':'\u2190 ')+(ds.backText||'Back');w.append(a);document.body.append(w);
      const navA=()=>document.querySelector('#header .header-display-desktop .header-nav-item a')||document.querySelector('#header .header-nav-item a');
      const sty=ds.backStyle||'nav',pill=sty==='pill';if(pill){a.classList.add('rlh-pill');if(ds.backBg)a.style.setProperty('--rlh-bg',ds.backBg);if(ds.backBorder)a.style.setProperty('--rlh-bc',ds.backBorder)}
      const look=()=>{const n=navA();if(n&&sty!=='none'){const cs=getComputedStyle(n);
          ['fontFamily','fontSize','fontWeight','fontStyle','letterSpacing','textTransform'].concat(pill?[]:['lineHeight','color']).forEach(k=>a.style[k]=cs[k])}
        if(ds.backFont)a.style.fontFamily=ds.backFont;if(ds.backFontSize)a.style.fontSize=/^[\d.]+$/.test(ds.backFontSize)?ds.backFontSize+'px':ds.backFontSize;
        if(ds.backColor)a.style.color=ds.backColor;if(ds.backLetterSpacing)a.style.letterSpacing=ds.backLetterSpacing;
        if(ds.backUppercase)a.style.textTransform=ds.backUppercase==='on'?'uppercase':'none';if(ds.backHoverColor)a.style.setProperty('--rlh-hover',ds.backHoverColor)};
      const place=()=>{const mob=innerWidth<768,hd=document.querySelector('#header'),bar=hd&&hd.querySelector('.header-display-desktop'),list=bar&&bar.querySelector('.header-nav-list');
        let top=parseFloat(ds.backOffset),x;
        if(isNaN(top)&&(pill||ds.backBelow==='on')&&hd)top=hd.getBoundingClientRect().bottom+(parseFloat(ds.backGap)||16);
        if(isNaN(top))top=mob?(hd?hd.getBoundingClientRect().bottom+12:24):(list&&list.getBoundingClientRect().height?list.getBoundingClientRect().top:24);
        x=!mob&&bar?bar.getBoundingClientRect().left+parseFloat(getComputedStyle(bar).paddingLeft||0):(mob?innerWidth*.06:24);
        if(pos.endsWith('right'))x=!mob&&bar?innerWidth-bar.getBoundingClientRect().right+parseFloat(getComputedStyle(bar).paddingRight||0):x;
        w.style.setProperty('--rlh-o',Math.max(0,top)+'px');w.style.setProperty('--rlh-x',Math.max(0,x)+'px');requestAnimationFrame(()=>{const r=a.getBoundingClientRect();if(r.height&&pos.startsWith('top'))frameTop(r.bottom)})};
      const fit=()=>{look();if(scrollY<5)place()};fit();addEventListener('resize',fit);addEventListener('load',fit);if(document.fonts)document.fonts.ready.then(fit);
      a.addEventListener('click',e=>{try{const r=new URL(document.referrer);if(r.origin===location.origin&&r.pathname===new URL(url,location.href).pathname&&history.length>1){e.preventDefault();history.back()}}catch(x){}});
    }
    let shown=false;const show=()=>{if(shown)return;shown=true;if(root.classList.contains('rlh-arriving')){root.classList.remove('rlh-arriving');root.classList.add('rlh-in')}};
    if(im.complete)show();else{im.addEventListener('load',show);im.addEventListener('error',show);setTimeout(show,1500)}
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',build):build();
})();
