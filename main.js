// ===== PAGES & ROUTING =====
const pages = document.querySelectorAll('.page');
function showPage(id){pages.forEach(p=>p.hidden=true); document.getElementById(id).hidden=false;}
function handleRoute(){
  const route = location.hash.replace('#','')||'home';
  if(route.startsWith('shop')){
    showPage('shop');
    const type = route.split('/')[1] || 'all';
    renderProducts(type);
  } else showPage(route);
}
window.addEventListener('hashchange', handleRoute);
handleRoute();

// ===== CART =====
const cartCount = document.getElementById('cartCount');
let cart=0;

// ===== PRODUCT DATA =====
const productImageSets = [
["photos/pic1.avif","photos/pic2.avif","photos/pic3.avif","photos/pic4.avif","photos/pic5.avif","photos/pic6.avif","photos/pic7.avif"],
["photos/vol9.1.avif","photos/vol9.2.avif","photos/vol9.3.avif","photos/vol9.4.avif","photos/vol9.5.avif","photos/vol9.6.avif","photos/vol9.7.avif"], 
["photos/kobe1.avif","photos/kobe2.avif","photos/kobe3.avif","photos/kobe4.avif","photos/kobe5.avif","photos/kobe6.avif"], 
["photos/kd1.avif","photos/kd2.avif","photos/kd3.avif","photos/kd4.avif","photos/kd5.avif","photos/kd6.avif","photos/kd7.avif"], 
["photos/hard1.jpg","photos/hard2.avif","photos/hard3.jpg"], 
["photos/jer1.jpg","photos/jer2.jpg","photos/jer3.avif"], 
["photos/durantula1.jpg","photos/durantula2.jpg","photos/durantula3.jpg"], 
["photos/mvp1.jpg","photos/mvp2.avif","photos/mvp3.avif"] 
];

const products = [
  { name:'Adidas Harden Vol10', price:179.99, type:'shoes', images:productImageSets[0] },
  { name:'Adidas Harden vol9', price:159.99, type:'shoes', images:productImageSets[1] },
  { name:'Nike Kobe Grinch', price:160, type:'shoes', images:productImageSets[2] },
  { name:'Nike KD19 Slim Reaper', price:169.99, type:'shoes', images:productImageSets[3] },
  { name:'James Harden Jersey', price:120, type:'jerseys', images:productImageSets[4] },
  { name:'James Harden Jersey', price:120, type:'jerseys', images:productImageSets[5] },
  { name:'Kevin Durant Jersey', price:120, type:'jerseys', images:productImageSets[6] },
  { name:'Nikola Jokic Jersey', price:120, type:'jerseys', images:productImageSets[7] }
];

const productList = document.getElementById('productList');

// ===== RENDER PRODUCTS =====
function renderProducts(filter='all'){
  productList.innerHTML='';
  products.filter(p=>filter==='all'||p.type===filter).forEach((product,index)=>{
    const card = document.createElement('div');
    card.className='product-card';

    const slidesHtml = product.images.map((src,i)=>
      `<div class="slide" data-index="${i}">
        <img src="${src}" alt="${product.name} image ${i+1}" loading="lazy">
      </div>`).join('');

    const dotsHtml = product.images.map((_,i)=>
      `<button class="dot${i===0?' active':''}" data-index="${i}" aria-label="Go to image ${i+1}"></button>`).join('');

    card.innerHTML=`
      <figure class="product-img-wrapper">
        <div class="slider" data-slider-id="${index}">
          <div class="slides">${slidesHtml}</div>
          <button class="slider-btn prev" aria-label="Previous">‹</button>
          <button class="slider-btn next" aria-label="Next">›</button>
          <div class="dots">${dotsHtml}</div>
        </div>
      </figure>
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button class="btn add-cart">Add to cart</button>
    `;

    card.querySelector('button').addEventListener('click',()=>{
      cart++; cartCount.textContent=cart;
    });

    initSlider(card);
    productList.appendChild(card);
  });
}

// ===== SLIDER LOGIC =====
function initSlider(card){
  const slider = card.querySelector('.slider');
  if(!slider) return;

  const slidesContainer = slider.querySelector('.slides');
  const slides = slider.querySelectorAll('.slide');
  const prevBtn = slider.querySelector('.slider-btn.prev');
  const nextBtn = slider.querySelector('.slider-btn.next');
  const dots = slider.querySelectorAll('.dot');
  let current=0;

  function update(){
    slidesContainer.style.transform=`translateX(-${current*100}%)`;
    dots.forEach(d=>d.classList.toggle('active',Number(d.dataset.index)===current));
  }

  function goTo(idx){
    current=(idx+slides.length)%slides.length;
    update();
  }

  prevBtn.addEventListener('click',()=>goTo(current-1));
  nextBtn.addEventListener('click',()=>goTo(current+1));
  dots.forEach(dot=>dot.addEventListener('click',e=>goTo(Number(e.currentTarget.dataset.index))));

  update();
}

// ===== SHOP TABS =====
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>location.hash=`shop/${btn.dataset.shop}`);
});

// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const nav = document.getElementById('navLinks');
if(burger&&nav) burger.addEventListener('click',()=>nav.classList.toggle('active'));

// ===== COOKIE BANNER =====
const cookieBtn = document.getElementById('acceptCookies');
if(cookieBtn) cookieBtn.addEventListener('click',()=>{
  document.getElementById('cookieBanner').style.display='none';
  localStorage.setItem('cookiesAccepted','1');
});

// ===== PASSWORD TOGGLE =====
const toggle = document.getElementById('togglePassword');
const password = document.getElementById('password');
if(toggle&&password) toggle.addEventListener('click',()=>{ password.type=password.type==='password'?'text':'password'; });

// ===== REGISTER FORM =====
const registerForm = document.getElementById('registerForm');
if(registerForm){
  registerForm.addEventListener('submit',e=>{
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const passwordVal = document.getElementById('password').value;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRe = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    const errors = [];
    if(!username) errors.push('Username required');
    if(!emailRe.test(email)) errors.push('Valid email required');
    if(!passRe.test(passwordVal)) errors.push('Password must be 6+ chars and include letters and numbers');
    if(errors.length){ alert(errors.join('\n')); return; }
    localStorage.setItem('hoop_user',JSON.stringify({username,email}));
    alert('Registration successful');
    registerForm.reset();
  });
}

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('header');
window.addEventListener('scroll',()=>{ window.scrollY>40?header.classList.add('scrolled'):header.classList.remove('scrolled'); });
