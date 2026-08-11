// Shared interactions for both Valley Arbor concept drafts.
(function(){
  var nav=document.getElementById('nav');
  function onScroll(){ if(nav) nav.classList.toggle('solid', window.scrollY>40); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // mobile sheet
  var sheet=document.getElementById('msheet');
  var open=document.getElementById('navToggle');
  var close=document.getElementById('mClose');
  if(open&&sheet) open.onclick=function(){sheet.classList.add('open');};
  if(close&&sheet) close.onclick=function(){sheet.classList.remove('open');};
  if(sheet) sheet.querySelectorAll('a').forEach(function(a){a.onclick=function(){sheet.classList.remove('open');};});

  // reveal on scroll
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.14});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  // segmented toggles + urgency (generic .seg group)
  document.querySelectorAll('[data-seg]').forEach(function(group){
    group.querySelectorAll('button').forEach(function(b){
      b.onclick=function(){group.querySelectorAll('button').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false');});b.classList.add('on');b.setAttribute('aria-pressed','true');};
    });
  });

  // Service cards: on desktop, scroll an opened card into view (the takeover sits below
  // the others). Also a fallback for exclusive-open in case <details name> is unsupported.
  (function(){
    var cards=document.querySelectorAll('details.svc'); if(!cards.length) return;
    var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
    cards.forEach(function(d){
      d.addEventListener('toggle',function(){
        if(!d.open) return;
        cards.forEach(function(o){ if(o!==d&&o.open) o.open=false; });
        if(matchMedia('(min-width:861px)').matches) d.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
      });
    });
  })();

  // Quote form -> /api/quote (Vercel function) -> email to Matt.
  // Photos are downscaled in the browser (max 5, 1280px JPEG) so the payload stays small.
  // If the API is missing (local preview) or fails, the note falls back to the phone number.
  (function(){
    var form=document.querySelector('.qform'); if(!form) return;
    form.removeAttribute('onsubmit');
    var drop=form.querySelector('.drop'); var photos=[];
    if(drop){
      var inp=document.createElement('input');
      inp.type='file'; inp.accept='image/*'; inp.multiple=true; inp.style.display='none';
      inp.setAttribute('aria-hidden','true'); form.appendChild(inp);
      var d2=drop.querySelector('.d2'); var d2base=d2?d2.textContent:'';
      drop.addEventListener('click',function(){ inp.click(); });
      inp.addEventListener('change',function(){
        var files=[].slice.call(inp.files||[]).slice(0,5);
        photos=[]; var done=0;
        if(!files.length){ if(d2) d2.textContent=d2base; return; }
        files.forEach(function(f){
          var img=new Image(), url=URL.createObjectURL(f);
          img.onload=function(){
            var s=Math.min(1,1280/Math.max(img.width,img.height));
            var c=document.createElement('canvas');
            c.width=Math.round(img.width*s); c.height=Math.round(img.height*s);
            c.getContext('2d').drawImage(img,0,0,c.width,c.height);
            photos.push({name:f.name,data:c.toDataURL('image/jpeg',.8).split(',')[1]});
            URL.revokeObjectURL(url); done++;
            if(d2) d2.textContent=done+' photo'+(done>1?'s':'')+' attached';
          };
          img.onerror=function(){ done++; URL.revokeObjectURL(url); };
          img.src=url;
        });
      });
    }
    // honeypot for bots
    var hp=document.createElement('input');
    hp.type='text'; hp.name='website'; hp.tabIndex=-1; hp.autocomplete='off';
    hp.setAttribute('aria-hidden','true');
    hp.style.cssText='position:absolute;left:-9999px;height:0;width:0;opacity:0';
    form.appendChild(hp);
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=form.querySelector('button[type="submit"]'), note=form.querySelector('.qnote');
      var get=function(id){ var el=form.querySelector('#'+id); return el?(el.value||'').trim():''; };
      var segOn=form.querySelector('.toggle button.on');
      var urgOn=form.querySelector('.urg button.on .t');
      var payload={
        name:get('q-name'), phone:get('q-phone'), email:get('q-email'), suburb:get('q-suburb'),
        trees:get('q-trees'), service:get('q-service'), notes:get('q-notes'),
        enquiringAs:segOn?segOn.textContent.trim():'',
        urgency:urgOn?urgOn.textContent.trim():'',
        website:hp.value, photos:photos
      };
      btn.disabled=true; var old=btn.textContent; btn.textContent='Sending...';
      fetch('/api/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
        .then(function(r){ if(!r.ok) throw 0; return r.json(); })
        .then(function(){
          btn.textContent='Sent. Matt will be in touch.';
          if(note) note.textContent='Got it. Matt usually replies the same day.';
        })
        .catch(function(){
          btn.disabled=false; btn.textContent=old;
          if(note) note.innerHTML='Could not send just now. Please call <a href="tel:0427900858" style="font-weight:700;color:inherit">0427 900 858</a> and we will sort it out on the phone.';
        });
    });
  })();

  // Live Google reviews -> 5-star wall, newest first.
  // Tries the live feed; the static cards in the HTML stay as a no-JS / offline fallback.
  // Google's terms require the reviewer name + photo + a link, which the cards include.
  (function(){
    var tracks=document.querySelectorAll('.mq-track');
    if(!tracks.length) return;
    function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
    function card(r){
      var sub=esc(r.timeLabel||r.suburb||'');
      var nm=esc(r.author||'Google user');
      var initial=esc((r.author||'?').trim().charAt(0).toUpperCase());
      var av=r.photo
        ? '<span class="av" style="background-image:url(\''+esc(r.photo)+'\');background-size:cover;background-position:center;color:transparent"></span>'
        : '<span class="av">'+initial+'</span>';
      return '<a class="rcard" href="'+esc(r.url||'#')+'" target="_blank" rel="noopener nofollow">'
        +'<div class="top"><span class="stars" role="img" aria-label="Rated 5 stars">★★★★★</span><svg class="gg" aria-hidden="true"><use href="#g-logo"></use></svg></div>'
        +'<p>"'+esc(r.text)+'"</p>'
        +'<div class="who">'+av+'<div><div class="nm">'+nm+'</div><div class="su">'+sub+'</div></div></div></a>';
    }
    // The -50% keyframe loop is only seamless when ONE copy of the card set is
    // at least as wide as the visible row. The live feed tops out at Google's
    // 5 reviews, so on wide screens a single doubling leaves the track short:
    // blank space sweeps in at the end of every cycle and the loop jumps.
    // Fix: measure, repeat the set until it covers the row, THEN double it,
    // and stretch the duration to match so the scroll speed stays the same.
    function fillTrack(t,setHtml){
      if(!setHtml) return;
      if(matchMedia('(prefers-reduced-motion:reduce)').matches){ t.innerHTML=setHtml; return; }
      if(!t.dataset.mqDur){
        var d=parseFloat(getComputedStyle(t).animationDuration);
        t.dataset.mqDur=String((d&&isFinite(d))?d:84);
      }
      t.innerHTML=setHtml;
      var setW=Math.max(t.scrollWidth,1);
      var rowW=(t.parentElement||t).clientWidth||0;
      var reps=Math.max(1,Math.ceil((rowW+60)/setW));
      var base=''; for(var k=0;k<reps;k++) base+=setHtml;
      t.dataset.mqSet=setHtml; t.dataset.mqReps=String(reps);
      t.innerHTML=base+base;
      t.style.animationDuration=(Number(t.dataset.mqDur)*reps)+'s';
    }
    // If the window later grows wider than the repeated set, rebuild with more copies.
    var mqResizeT;
    window.addEventListener('resize',function(){
      clearTimeout(mqResizeT);
      mqResizeT=setTimeout(function(){
        tracks.forEach(function(t){
          if(!t.dataset.mqSet) return;
          var half=t.scrollWidth/2;
          if(((t.parentElement||t).clientWidth||0)+60>half) fillTrack(t,t.dataset.mqSet);
        });
      },200);
    });
    function cloneStatic(){ tracks.forEach(function(t){ fillTrack(t,t.innerHTML); }); }
    // The cards row is a .reveal that fades in via IntersectionObserver. Because
    // the live cards inject async, the row can have ~0 height when the observer
    // first checks it, so the 14% threshold never trips and it stays hidden.
    // Once we actually have cards, reveal the row unconditionally.
    function showRow(){ document.querySelectorAll('#reviews .reveal').forEach(function(el){ el.classList.add('in'); }); }
    function updateScore(p){
      if(!p) return;
      var box=document.querySelector('#reviews .gscore');
      if(!box) return;
      var n=box.querySelector('.n'); if(n&&p.rating!=null) n.textContent=Number(p.rating).toFixed(1);
      var sub=box.querySelector('.sub');
      if(sub&&p.total!=null) sub.innerHTML='<a href="'+esc(p.url||'#')+'" target="_blank" rel="noopener" style="color:inherit">Read all '+p.total+'<br>Google reviews</a>';
    }
    function fetchFirst(urls){
      return urls.reduce(function(p,u){
        return p.catch(function(){ return fetch(u).then(function(r){ if(!r.ok) throw 0; return r.json(); }); });
      }, Promise.reject());
    }
    fetchFirst(['/api/reviews','reviews.json']).then(function(data){
      var five=(data.reviews||[]).filter(function(r){return Number(r.rating)===5;})
        .sort(function(a,b){return new Date(b.time||0)-new Date(a.time||0);});
      if(!five.length) throw 0;
      var per=Math.ceil(five.length/tracks.length);
      tracks.forEach(function(t,i){
        var slice=five.slice(i*per,(i+1)*per);
        if(!slice.length) slice=five;
        fillTrack(t,slice.map(card).join(''));
      });
      updateScore(data.place);
      showRow();
    }).catch(function(){ cloneStatic(); showRow(); });
  })();
})();
