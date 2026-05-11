
(function(){
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('aniskin-theme');
  if(savedTheme){ root.setAttribute('data-theme', savedTheme); }
  const setTheme = (theme)=>{ root.setAttribute('data-theme', theme); localStorage.setItem('aniskin-theme', theme); ScrollTrigger && ScrollTrigger.refresh(); };
  document.addEventListener('DOMContentLoaded', () => {
    if (window.gsap && window.ScrollTrigger) { gsap.registerPlugin(ScrollTrigger); if(window.CustomEase){ gsap.registerPlugin(CustomEase); CustomEase.create('luxEase','0.22,1,0.36,1'); } }
    let lenis;
    if(window.Lenis){
      lenis = new Lenis({lerp:0.065, wheelMultiplier:.82, smoothWheel:true});
      lenis.on('scroll', () => ScrollTrigger.update());
      gsap.ticker.add((time)=>lenis.raf(time*1000));
      gsap.ticker.lagSmoothing(0);
    }
    const progress = document.querySelector('.scroll-indicator');
    const updateProgress = () => {
      if(!progress) return;
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = h > 0 ? `${(scrollY / h) * 100}%` : '0%';
    };
    updateProgress(); addEventListener('scroll', updateProgress, {passive:true}); addEventListener('resize', updateProgress);

    document.querySelectorAll('.theme-toggle').forEach(btn=>btn.addEventListener('click',()=>{
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    }));
    document.querySelectorAll('.menu-toggle').forEach(btn=>btn.addEventListener('click',()=>document.body.classList.toggle('menu-open')));
    document.querySelectorAll('.curtain-links a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));

    const cursor = document.querySelector('.cursor-orb');
    if(cursor && matchMedia('(pointer:fine)').matches){
      gsap.to(cursor,{opacity:.85,duration:.5});
      addEventListener('pointermove',e=>gsap.to(cursor,{x:e.clientX,y:e.clientY,duration:.28,ease:'power3.out'}));
    }

    gsap.utils.toArray('[data-reveal]').forEach((el)=>{
      gsap.to(el,{opacity:1,y:0,duration:1.1,ease:'luxEase',scrollTrigger:{trigger:el,start:'top 86%',toggleActions:'play none none reverse'}});
    });

    gsap.utils.toArray('[data-split-title]').forEach(title=>{
      const text = title.textContent.trim();
      title.innerHTML = text.split(' ').map(w=>`<span class="line-wrap"><span>${w}</span></span>`).join(' ');
      gsap.from(title.querySelectorAll('.line-wrap span'),{yPercent:110,rotate:2,stagger:.08,duration:1.1,ease:'luxEase',scrollTrigger:{trigger:title,start:'top 92%'}});
    });

    gsap.utils.toArray('[data-parallax]').forEach(el=>{
      const val = parseFloat(el.getAttribute('data-parallax')) || -10;
      gsap.to(el,{yPercent:val,ease:'none',scrollTrigger:{trigger:el.parentElement || el,start:'top bottom',end:'bottom top',scrub:true}});
    });

    const hero = document.querySelector('.hero');
    if(hero){
      gsap.from('.hero-title .title-line',{yPercent:110,rotate:3,stagger:.12,duration:1.3,ease:'luxEase'});
      gsap.from('.hero-card',{opacity:0,y:60,duration:1.1,delay:.35,ease:'luxEase'});
    }

    const work = document.querySelector('.work-section');
    if(work && matchMedia('(min-width: 1101px)').matches){
      const items = gsap.utils.toArray('.work-item');
      const tl = gsap.timeline({scrollTrigger:{trigger:work,start:'top top',end:()=>`+=${items.length * innerHeight * 1.05}`,pin:true,scrub:true,anticipatePin:1}});
      items.forEach((item,i)=>{
        const img = item.querySelector('.work-img img');
        const lines = item.querySelectorAll('[data-line]');
        if(i>0){
          tl.to(item,{clipPath:'inset(0% 0 0 0)',duration:1,ease:'none'},i);
        }
        tl.from(lines,{yPercent:120,rotate:2.5,stagger:.05,duration:.7,ease:'power2.out'},i+.12);
      });
    }

    gsap.utils.toArray('.horizontal-section').forEach((horizontal)=>{
      const track = horizontal.querySelector('.horizontal-track');
      if(!track || !matchMedia('(min-width: 1101px)').matches) return;
      const distance = () => Math.max(0, track.scrollWidth - innerWidth);
      const isReverse = horizontal.getAttribute('data-direction') === 'reverse';

      if(isReverse){
        gsap.set(track,{x:()=>-distance()});
        gsap.to(track,{x:0,ease:'none',scrollTrigger:{trigger:horizontal,start:'top top',end:()=>`+=${distance()}`,pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true,onRefresh:()=>gsap.set(track,{x:-distance()})}});
      } else {
        gsap.to(track,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:horizontal,start:'top top',end:()=>`+=${distance()}`,pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true}});
      }
    });

    gsap.utils.toArray('.gallery-grid figure').forEach((fig,i)=>{
      gsap.from(fig,{clipPath:'inset(100% 0 0 0)',duration:1.05,delay:(i%5)*.04,ease:'luxEase',scrollTrigger:{trigger:fig,start:'top 86%'}});
    });
  });
})();
