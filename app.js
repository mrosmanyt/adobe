'use strict';
/* ===== SETTINGS: yahan se prices, promo aur WhatsApp badlein ===== */
const WHATSAPP = '923445739206';
const prices = {'1 Month':2500,'4 Months':6500,'7 Months':9800,'12 Months':16000};
const DEFAULT_PLAN = '4 Months';
const PROMO_PLAN = '12 Months';
const PROMO_PRICE = 14400;      // 12 Months 10% OFF
const PROMO_LABEL = '10% OFF';
/* ================================================================== */

const $=id=>document.getElementById(id);
const plans=[...document.querySelectorAll('.plan')];
const storage={get:k=>{try{return sessionStorage.getItem('MDC_'+k)}catch{return null}},set:(k,v)=>{try{sessionStorage.setItem('MDC_'+k,v)}catch{}}};
let discountActive=storage.get('annual_discount')==='1';
let promoEmail=storage.get('promo_email')||'';
let selected={name:DEFAULT_PLAN,price:prices[DEFAULT_PLAN]};
let activeModal=null,previousFocus=null;
const money=n=>'PKR '+n.toLocaleString('en-US');
const waLink=msg=>'https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(msg);

function selectPlan(name){
 if(!Object.hasOwn(prices,name))throw new Error('Invalid plan');
 selected={name,price:name===PROMO_PLAN&&discountActive?PROMO_PRICE:prices[name]};
 plans.forEach(p=>{const chosen=p.dataset.name===name;p.classList.toggle('selected',chosen);p.setAttribute('aria-checked',String(chosen));});
 const promoCard=document.querySelector('[data-name="'+PROMO_PLAN+'"] .pp');
 promoCard.innerHTML=discountActive?'<strong>'+money(PROMO_PRICE)+'</strong><span style="color:#16a34a;font-weight:700">'+PROMO_LABEL+' · was '+prices[PROMO_PLAN].toLocaleString('en-US')+'</span>':'<strong>'+money(prices[PROMO_PLAN])+'</strong><span>'+PROMO_PLAN.toLowerCase()+'</span>';
 $('mn').textContent=name;$('mp').textContent=money(selected.price);
 $('bn').textContent=name.toUpperCase();$('bp').textContent=money(selected.price);
 if(name===PROMO_PLAN&&discountActive){const tag=document.createElement('span');tag.className='promo-discount-tag';tag.textContent=PROMO_LABEL;$('bp').append(tag);}
}
plans.forEach((p,i)=>{p.tabIndex=0;p.setAttribute('role','radio');p.onclick=()=>selectPlan(p.dataset.name);p.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();p.click();}if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(e.key)){e.preventDefault();const next=plans[(i+(['ArrowDown','ArrowRight'].includes(e.key)?1:plans.length-1))%plans.length];next.focus();next.click();}};});
document.querySelector('.plans').setAttribute('role','radiogroup');document.querySelector('.plans').setAttribute('aria-label','Subscription duration');

function showModal(id){previousFocus=document.activeElement;activeModal=$(id);activeModal.classList.add('open');activeModal.setAttribute('aria-hidden','false');document.body.classList.add('dialog-open');for(const el of document.querySelectorAll('.top,.hero,.trust-pills,main,.bottom,.wa-support,.site-foot'))el.inert=true;activeModal.querySelector('button').focus();}
function closeModal(){if(!activeModal)return;if(activeModal.id==='promoModal')storage.set('promo_shown','1');activeModal.classList.remove('open');activeModal.setAttribute('aria-hidden','true');activeModal=null;document.body.classList.remove('dialog-open');document.querySelectorAll('[inert]').forEach(el=>el.inert=false);previousFocus?.focus();}
function openCheckout(){if(activeModal)closeModal();$('mn').textContent=selected.name;$('mp').textContent=money(selected.price);if(promoEmail&&!$('customerEmail').value)$('customerEmail').value=promoEmail;showModal('modal');}
document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=openCheckout);
$('close').onclick=closeModal;$('promoClose').onclick=closeModal;
[$('modal'),$('promoModal')].forEach(m=>{m.setAttribute('aria-hidden','true');m.onclick=e=>{if(e.target===m)closeModal();};});
document.addEventListener('keydown',e=>{if(!activeModal)return;if(e.key==='Escape')closeModal();if(e.key==='Tab'){const fields=[...activeModal.querySelectorAll('button,input,a[href]')];const first=fields[0],last=fields.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});

function validField(id){const input=$(id);input.required=true;input.setCustomValidity('');if(!input.value.trim())input.setCustomValidity('Please complete this field.');else if(input.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()))input.setCustomValidity('Please enter a valid email address.');return input.reportValidity();}
document.querySelectorAll('input').forEach(i=>i.addEventListener('input',()=>i.setCustomValidity('')));

$('promoClaim').onclick=()=>{if(!validField('promoEmail'))return;promoEmail=$('promoEmail').value.trim();discountActive=true;storage.set('annual_discount','1');storage.set('promo_email',promoEmail);closeModal();selectPlan(PROMO_PLAN);$('plans').scrollIntoView({behavior:'smooth',block:'center'});};
$('promoEmail').onkeydown=e=>{if(e.key==='Enter')$('promoClaim').click();};

function orderUrl(){
 const msg=['Hello Malik Data Centre, I want to purchase Adobe Creative Cloud All Apps.','',
  'Customer Name: '+$('customerName').value.trim(),
  'Contact Email: '+$('customerEmail').value.trim(),
  'Adobe Account Email: '+$('preferredEmail').value.trim(),
  'Plan: '+selected.name,'AI Credits: 4,000','Cloud Storage: 100GB','Devices: 2 Devices','Account: Your Own Email',
  'Total: '+money(selected.price)];
 if(selected.name===PROMO_PLAN&&discountActive)msg.push('Discount: '+PROMO_LABEL+' claimed (was '+money(prices[PROMO_PLAN])+')','Promo Email: '+promoEmail);
 return waLink(msg.join('\n'));
}
$('confirm').onclick=()=>{for(const id of ['customerName','customerEmail','preferredEmail'])if(!validField(id))return;window.location.assign(orderUrl());};

document.querySelectorAll('.faq-q').forEach((btn,i)=>{const answer=btn.closest('.faq-item').querySelector('.faq-a');answer.id='faq-answer-'+i;btn.setAttribute('aria-controls',answer.id);btn.setAttribute('aria-expanded',String(btn.closest('.faq-item').classList.contains('open')));btn.onclick=()=>{const item=btn.closest('.faq-item'),wasOpen=item.classList.contains('open');document.querySelectorAll('.faq-item').forEach(x=>{x.classList.remove('open');x.querySelector('button').setAttribute('aria-expanded','false');});item.classList.toggle('open',!wasOpen);btn.setAttribute('aria-expanded',String(!wasOpen));};});

selectPlan(discountActive?PROMO_PLAN:DEFAULT_PLAN);
if(!storage.get('promo_shown')&&!discountActive)setTimeout(()=>{if(!activeModal)showModal('promoModal');},650);
if($('yr'))$('yr').textContent=new Date().getFullYear();

if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'select_subscription_plan',description:'Select a Malik Data Centre subscription duration and update its displayed price. Does not submit an order.',inputSchema:{type:'object',properties:{months:{type:'integer',enum:[1,4,7,12]}},required:['months'],additionalProperties:false},annotations:{readOnlyHint:false},execute:({months})=>{if(![1,4,7,12].includes(months))throw new Error('Invalid duration');selectPlan(months===1?'1 Month':months+' Months');return {...selected,currency:'PKR'};}})).catch(()=>{});}catch{}}

// Motion follows visibility and the visitor's reduced-motion preference.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const heroCta=document.querySelector('.hero .cta');
heroCta.classList.add('animate-pop');
const finalCta=document.querySelector('.final .cta');
const finalObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){finalCta.classList.add('animate-pop');finalObserver.disconnect();}},{threshold:.6});
finalObserver.observe(finalCta);

function startMarquee(selector,label,speed){
 const strip=document.querySelector(selector);
 if(!strip)return;
 const shell=document.createElement('div');shell.className='marquee-shell';strip.before(shell);shell.append(strip);
 const originals=[...strip.children];
 const copies=originals.map(el=>{const clone=el.cloneNode(true);clone.setAttribute('aria-hidden','true');strip.append(clone);return clone;});
 let hover=false,touch=false,visible=false,last=0,position=strip.scrollLeft,frame=0;
 function syncControl(){copies.forEach(c=>c.hidden=reducedMotion.matches);}
 strip.tabIndex=0;strip.setAttribute('aria-label',label+' — scroll to browse');
 strip.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hover=true;});strip.addEventListener('pointerleave',()=>hover=false);
 strip.addEventListener('pointerdown',()=>touch=true);window.addEventListener('pointerup',()=>{touch=false;position=strip.scrollLeft;});window.addEventListener('pointercancel',()=>touch=false);
 strip.addEventListener('scroll',()=>{if(hover||touch||strip===document.activeElement)position=strip.scrollLeft;},{passive:true});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:0});observer.observe(strip);
 function loop(now){const dt=Math.min((now-last)/1000,.05);last=now;const distance=copies[0].offsetLeft-originals[0].offsetLeft;
 if(visible&&!document.hidden&&!activeModal&&!hover&&!touch&&!reducedMotion.matches&&document.activeElement!==strip&&distance>0){position=(position+speed*dt)%distance;strip.scrollLeft=position;}
 frame=requestAnimationFrame(loop);}
 syncControl();reducedMotion.addEventListener('change',()=>{syncControl();position=0;strip.scrollLeft=0;});frame=requestAnimationFrame(loop);
}
startMarquee('.app-strip','apps',24);
startMarquee('.trust-pills','Subscription benefits',22);

const comparison=document.querySelector('.diff-head').closest('section');
comparison.classList.add('comparison');
comparison.querySelectorAll('.diff-row').forEach((row,i)=>row.style.setProperty('--row-delay',`${i*140}ms`));
const comparisonObserver=new IntersectionObserver(entries=>{
 if(entries.some(entry=>entry.isIntersecting)){
  comparison.classList.add('comparison-visible');comparisonObserver.disconnect();
 }
},{threshold:.3});
comparisonObserver.observe(comparison);

startMarquee('.apps-orbit','Adobe apps',24);
