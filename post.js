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
    '.rlh-img{position:absolute;inset:0;background:center/cover no-repeat;will-change:transform}'+
    '.rlh-in #header,.rlh-in .rlh~*{animation:rlhFade .7s ease both}@keyframes rlhFade{from{opacity:0}to{opacity:1}}';
  document.head.append(st);
  const name=s=>(s||'').split('?')[0].split('/').pop();
  const build=()=>{
    if(!document.body.classList.contains('view-item')){root.classList.remove('rlh-on','rlh-arriving');return}
    const og=document.querySelector('meta[property="og:image"]');
    const src=arr?arr.src:og&&og.content&&og.content.split('?')[0].replace(/^http:/,'https:')+'?format=2500w';
    if(!src){root.classList.remove('rlh-arriving');return}
    const hero=document.createElement('section'),bg=document.createElement('div'),im=new Image();hero.className='rlh';bg.className='rlh-img';
    bg.style.backgroundImage='url("'+src+'")';bg.style.backgroundPosition=arr&&arr.pos||'50% 50%';hero.setAttribute('role','img');hero.append(bg);im.src=src;
    const host=document.querySelector('#sections')||document.querySelector('main')||document.body;host.prepend(hero);
    /* hide the post's own copy of the same image */
    if(ds.hideImage!=='off')document.querySelectorAll('article img').forEach(i=>{if(name(i.dataset.src||i.src)===name(src))(i.closest('figure,.image-block-outer-wrapper,.blog-item-image')||i).style.display='none'});
    if(ds.parallax!=='off'){const p=parseFloat(ds.parallax)||.35;addEventListener('scroll',()=>{if(scrollY<innerHeight*1.5)bg.style.transform='translateY('+(scrollY*p).toFixed(1)+'px)'},{passive:true})}
    let shown=false;const show=()=>{if(shown)return;shown=true;if(root.classList.contains('rlh-arriving')){root.classList.remove('rlh-arriving');root.classList.add('rlh-in')}};
    if(im.complete)show();else{im.addEventListener('load',show);im.addEventListener('error',show);setTimeout(show,1500)}
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',build):build();
})();
