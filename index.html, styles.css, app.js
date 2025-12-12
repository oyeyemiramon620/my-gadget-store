<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>MyGadgetStore — Affordable Gadgets</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <h1 class="brand">MyGadgetStore</h1>
      <nav>
        <a href="#products">Products</a>
        <a href="#contact">Contact</a>
        <button id="view-cart-btn" class="cart-btn">Cart (<span id="cart-count">0</span>)</button>
      </nav>
    </div>
  </header>

  <main class="container">
    <section id="hero" class="hero">
      <h2>Buy quality gadgets at affordable prices</h2>
      <p>Fast shipping • Secure payments • Competitive prices</p>
    </section>

    <section id="products" class="products-grid" aria-label="Products">
      <!-- Product cards injected by app.js -->
    </section>

    <aside id="cart" class="cart-panel hidden" aria-hidden="true">
      <h3>Your Cart</h3>
      <div id="cart-items"></div>
      <div class="cart-summary">
        <div>Total: <strong id="cart-total">₦0.00</strong></div>
        <label>Email for receipt
          <input id="customer-email" type="email" placeholder="you@example.com" required>
        </label>
        <button id="checkout-btn" class="pay-btn">Pay with Paystack</button>
        <button id="close-cart" class="muted">Close</button>
      </div>
    </aside>

    <section id="contact" class="contact">
      <h3>Contact</h3>
      <p>Email: <a href="mailto:you@mygadgetstore.com">you@mygadgetstore.com</a></p>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">© <span id="year"></span> MyGadgetStore — Built by [Your Name]</div>
  </footer>

  <!-- Paystack inline script -->
  <script src="https://js.paystack.co/v1/inline.js"></script>

  <script src="app.js"></script>
</body>
</html>
:root{
  --accent:#0b74de;
  --muted:#666;
  --bg:#0f1720;
  --card:#0b1220;
}
*{box-sizing:border-box}
body{
  margin:0;
  font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
  background:#f4f6f8;
  color:#111;
  line-height:1.4;
}
.container{max-width:1100px;margin:0 auto;padding:20px}
.site-header{background:#fff;border-bottom:1px solid #e6e9ee}
.site-header .container{display:flex;align-items:center;justify-content:space-between}
.brand{margin:12px 0;font-size:22px;color:var(--accent)}
.site-header nav a{margin-right:14px;color:#333;text-decoration:none}
.cart-btn{background:var(--accent);color:#fff;padding:8px 12px;border-radius:6px;border:0;cursor:pointer}
.hero{background:#fff;border-radius:8px;padding:28px;margin:18px 0;text-align:center}
.products-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin:18px 0}
.card{background:#fff;border-radius:8px;padding:12px;box-shadow:0 2px 8px rgba(12,20,40,0.05)}
.card img{width:100%;height:140px;object-fit:contain}
.card h4{margin:10px 0 6px;font-size:16px}
.card p{margin:6px 0;color:var(--muted);font-size:14px}
.card .price{font-weight:700;margin-top:10px}
.add-btn{display:inline-block;margin-top:10px;padding:8px 10px;background:var(--accent);color:#fff;border:0;border-radius:6px;cursor:pointer}
.cart-panel{position:fixed;right:20px;top:100px;width:320px;background:#fff;padding:14px;border-radius:8px;box-shadow:0 10px 30px rgba(10,20,40,0.15);z-index:999}
.hidden{display:none}
.cart-item{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #eee}
.cart-item img{width:48px;height:48px;object-fit:contain}
.cart-summary{margin-top:12px}
.pay-btn{background:#00a859;color:#fff;padding:10px 12px;border:0;border-radius:6px;cursor:pointer}
.muted{background:#eee;color:#333;border:0;padding:8px 10px;border-radius:6px;cursor:pointer;margin-left:6px}
.site-footer{padding:14px 0;text-align:center;color:#666;margin-top:40px}
label input{display:block;width:100%;margin-top:6px;padding:8px;border-radius:6px;border:1px solid #ddd}
// ====== PRODUCTS: edit or add more products here ======
const PRODUCTS = [
  { id: 'p1', title: 'Wireless Earbuds', price: 8000, img: 'https://via.placeholder.com/400x300?text=Earbuds' },
  { id: 'p2', title: 'Smart Watch', price: 15000, img: 'https://via.placeholder.com/400x300?text=Smart+Watch' },
  { id: 'p3', title: 'Power Bank 20000mAh', price: 9000, img: 'https://via.placeholder.com/400x300?text=Power+Bank' },
  { id: 'p4', title: 'Bluetooth Speaker', price: 6000, img: 'https://via.placeholder.com/400x300?text=Speaker' }
];

// ====== Replace this with your Paystack PUBLIC key ======
const PAYSTACK_PUBLIC_KEY = "YOUR_PAYSTACK_PUBLIC_KEY";

// ====== Helper & UI code ======
const el = id => document.getElementById(id);
const currencyFormat = n => '₦' + (n).toLocaleString();

function renderProducts() {
  const container = document.querySelector('.products-grid');
  container.innerHTML = '';
  PRODUCTS.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h4>${p.title}</h4>
      <p class="price">${currencyFormat(p.price)}</p>
      <button class="add-btn" data-id="${p.id}">Add to cart</button>`;
    container.appendChild(card);
  });
}

// CART using localStorage
const CART_KEY = 'mygadget_cart_v1';
function getCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function addToCart(productId){
  const cart = getCart();
  const item = cart.find(i=>i.id===productId);
  if(item) item.qty++;
  else { const p = PRODUCTS.find(x=>x.id===productId); cart.push({id:productId,title:p.title,price:p.price,qty:1}); }
  saveCart(cart); updateCartUI();
}
function removeFromCart(productId){
  let cart = getCart();
  cart = cart.filter(i=>i.id!==productId);
  saveCart(cart); updateCartUI();
}
function updateCartUI(){
  const cart = getCart();
  el('cart-count').innerText = cart.reduce((s,i)=>s+i.qty,0);
  const itemsDiv = el('cart-items'); itemsDiv.innerHTML = '';
  if(cart.length===0){ itemsDiv.innerHTML = '<p>Your cart is empty.</p>'; el('cart-total').innerText='₦0.00'; return; }
  cart.forEach(i=>{
    const div = document.createElement('div'); div.className='cart-item';
    div.innerHTML = `<img src="https://via.placeholder.com/100?text=img"><div style="flex:1"><strong>${i.title}</strong><div>${i.qty} × ${currencyFormat(i.price)}</div></div>
      <div><button class="muted remove-btn" data-id="${i.id}">Remove</button></div>`;
    itemsDiv.appendChild(div);
  });
  const total = cart.reduce((s,i)=>s + i.price * i.qty,0);
  el('cart-total').innerText = currencyFormat(total);
}

// Checkout using Paystack inline
function startPaystackCheckout() {
  const email = el('customer-email').value.trim();
  if(!email){ alert('Please enter an email for receipt.'); return; }
  const cart = getCart();
  if(cart.length===0) { alert('Cart is empty'); return; }

  const amountKobo = cart.reduce((s,i)=>s + i.price * i.qty, 0) * 100; // NGN -> kobo
  if(!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.includes('YOUR')) {
    alert('Please set your Paystack public key in app.js (PAYSTACK_PUBLIC_KEY).');
    return;
  }

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: amountKobo,
    metadata: {
      custom_fields: [
        { display_name: "Order Items", variable_name: "order_items", value: JSON.stringify(cart) }
      ]
    },
    callback: function(response){
      // Successful payment (client-side). response.reference is the transaction reference.
      // IMPORTANT: verify the transaction on the server (see instructions).
      localStorage.removeItem(CART_KEY);
      updateCartUI();
      window.location.href = `thankyou.html?reference=${response.reference}&email=${encodeURIComponent(email)}`;
    },
    onClose: function(){
      // user closed the modal
      console.log('Payment closed');
    }
  });
  handler.openIframe();
}

// Event listeners
document.addEventListener('click', function(e){
  if(e.target.matches('.add-btn')) addToCart(e.target.dataset.id);
  if(e.target.matches('#view-cart-btn')) { el('cart').classList.toggle('hidden'); el('cart').ariaHidden = el('cart').classList.contains('hidden'); updateCartUI(); }
  if(e.target.matches('#close-cart')) { el('cart').classList.add('hidden'); el('cart').ariaHidden = true; }
  if(e.target.matches('.remove-btn')) removeFromCart(e.target.dataset.id);
  if(e.target.matches('#checkout-btn')) startPaystackCheckout();
});

document.addEventListener('DOMContentLoaded', function(){
  renderProducts();
  updateCartUI();
  el('year').innerText = new Date().getFullYear();
});
<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thank you</title></head>
<body style="font-family:Arial,Helvetica,sans-serif;padding:40px">
  <h1>Thanks for your order!</h1>
  <p id="msg">Processing...</p>
  <script>
    const params = new URLSearchParams(location.search);
    const ref = params.get('reference'), email = params.get('email');
    if(ref){
      document.getElementById('msg').innerHTML = `Payment reference: <strong>${ref}</strong><br/>A receipt has been sent to <strong>${email || 'your email'}</strong> (if provided).<br/><br/>IMPORTANT: This payment should be verified server-side for full confirmation.`;
    } else {
      document.getElementById('msg').innerText = 'No payment reference found.';
    }
  </script>
</body>
</html>
// verify.js (Node/Express example)
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/verify/:reference', async (req, res) => {
  const ref = req.params.reference;
  const resp = await fetch(`https://api.paystack.co/transaction/verify/${ref}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
  });
  const data = await resp.json();
  res.json(data);
});
app.listen(3000);
