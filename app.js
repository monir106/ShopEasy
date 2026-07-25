

/* ==========================================================
   LOGIN AUDIT TRAIL (frontend demo)
   Keeps user sign-in details visible to the authorised admin.
========================================================== */
(function initShopEasyLoginAudit(){
  const parse = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } };
  const browserName = () => {
    const ua = navigator.userAgent;
    if (/Edg\//.test(ua)) return 'Microsoft Edge';
    if (/OPR\//.test(ua)) return 'Opera';
    if (/Chrome\//.test(ua)) return 'Google Chrome';
    if (/Firefox\//.test(ua)) return 'Mozilla Firefox';
    if (/Safari\//.test(ua)) return 'Safari';
    return 'Unknown browser';
  };
  const deviceType = () => /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile / Tablet' : 'Desktop / Laptop';
  const nowDetails = () => {
    const now = new Date();
    return {
      iso: now.toISOString(),
      display: now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'medium' }),
      date: now.toLocaleDateString('en-IN', { dateStyle: 'medium' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  window.recordShopEasyLogin = function(user, method = 'Account login'){
    if (!user) return;
    const stamp = nowDetails();
    const key = String(user.phone || user.email || user.id || 'guest').toLowerCase();
    const audit = parse('shopEasyLoginAudit', []);
    const event = {
      id: 'LOGIN-' + Date.now(), userKey: key, userId: user.id || '', name: user.name || 'ShopEasy User',
      phone: user.phone || '', email: user.email || '', role: user.role || 'customer', method,
      loginAt: stamp.display, loginDate: stamp.date, loginTime: stamp.time, loginISO: stamp.iso,
      browser: browserName(), device: deviceType(), platform: navigator.platform || 'Unknown',
      screen: `${window.screen?.width || 0} × ${window.screen?.height || 0}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
      language: navigator.language || 'Unknown'
    };
    audit.unshift(event);
    localStorage.setItem('shopEasyLoginAudit', JSON.stringify(audit.slice(0, 1000)));

    const users = parse('shopEasyUsers', []);
    const index = users.findIndex(item => String(item.phone || item.email || item.id || '').toLowerCase() === key);
    const merged = { ...user, lastLogin: stamp.display, lastLoginISO: stamp.iso, lastLoginMethod: method,
      loginCount: Number((index >= 0 ? users[index].loginCount : user.loginCount) || 0) + 1,
      lastDevice: event.device, lastBrowser: event.browser, lastPlatform: event.platform,
      lastScreen: event.screen, lastTimezone: event.timezone, lastActive: stamp.display };
    if (index >= 0) users[index] = { ...users[index], ...merged }; else users.push(merged);
    localStorage.setItem('shopEasyUsers', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(merged));
    return merged;
  };

  const updateActivity = () => {
    const user = parse('currentUser', null); if (!user) return;
    const stamp = nowDetails();
    const key = String(user.phone || user.email || user.id || '').toLowerCase();
    user.lastActive = stamp.display;
    localStorage.setItem('currentUser', JSON.stringify(user));
    const users = parse('shopEasyUsers', []);
    const index = users.findIndex(item => String(item.phone || item.email || item.id || '').toLowerCase() === key);
    if (index >= 0) { users[index].lastActive = stamp.display; localStorage.setItem('shopEasyUsers', JSON.stringify(users)); }
  };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateActivity(); });
  setInterval(updateActivity, 60000);
})();
// ==========================================
// ShopEasy Pro - Complete Final app.js
// ==========================================


// ==========================================
// DEMO ROLE-BASED ACCESS CONTROL
// Note: localStorage access control is suitable for a frontend demo only.
// ==========================================
(function protectRestrictedPages() {
    const page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    let currentUser = null;
    try { currentUser = JSON.parse(localStorage.getItem('currentUser')); } catch (error) {}

    if ((page === 'admin.html' || page === 'vendor.html') && currentUser?.role !== 'admin') {
        document.documentElement.style.visibility = 'hidden';
        sessionStorage.setItem('shopEasyAccessMessage', 'This dashboard is available only to the authorised administrator.');
        window.location.replace('login.html?access=restricted');
    }
})();

// ==========================================
// PRODUCT DATA
// ==========================================

const products = [
    {
        id: 1,
        name: "Apple iPhone 15",
        price: 69999,
        oldPrice: 74999,
        category: "Mobiles",
        rating: 5,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 2,
        name: "Samsung Galaxy S24",
        price: 64999,
        oldPrice: 69999,
        category: "Mobiles",
        rating: 4,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 3,
        name: "HP Performance Laptop",
        price: 55999,
        oldPrice: 63999,
        category: "Laptop",
        rating: 5,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 4,
        name: "Boat Wireless Earbuds",
        price: 1499,
        oldPrice: 2499,
        category: "Electronics",
        rating: 4,
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 5,
        name: "Noise Smart Watch",
        price: 2499,
        oldPrice: 3999,
        category: "Electronics",
        rating: 5,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 6,
        name: "RGB Gaming Mouse",
        price: 799,
        oldPrice: 1499,
        category: "Electronics",
        rating: 4,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 7,
        name: "Premium Sports Shoes",
        price: 1999,
        oldPrice: 3499,
        category: "Fashion",
        rating: 5,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 8,
        name: "Premium Beauty Kit",
        price: 999,
        oldPrice: 1799,
        category: "Beauty",
        rating: 4,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85"
    }
];


// ==========================================
// LOCAL STORAGE DATA
// ==========================================

let cart = JSON.parse(
    localStorage.getItem("cart")
) || [];

let wishlist = JSON.parse(
    localStorage.getItem("wishlist")
) || [];


// ==========================================
// COMMON ELEMENTS
// ==========================================

const productGrid = document.getElementById("productGrid");
const themeBtn = document.getElementById("themeBtn");


// ==========================================
// PRICE FORMAT
// ==========================================

function formatPrice(price) {

    return new Intl.NumberFormat("en-IN", {

        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0

    }).format(price);

}


// ==========================================
// NOTIFICATION
// ==========================================

function showNotification(message) {

    let notification = document.getElementById("notification");

    if (!notification) {

        notification = document.createElement("div");

        notification.id = "notification";
        notification.className = "notification";

        document.body.appendChild(notification);

    }

    notification.textContent = message;

    notification.classList.add("show");

    clearTimeout(window.shopEasyNotificationTimer);

    window.shopEasyNotificationTimer = setTimeout(() => {

        notification.classList.remove("show");

    }, 2500);

}


// ==========================================
// DISCOUNT CALCULATION
// ==========================================

function calculateDiscount(price, oldPrice) {

    if (!oldPrice || oldPrice <= price) {
        return 0;
    }

    return Math.round(
        ((oldPrice - price) / oldPrice) * 100
    );

}


// ==========================================
// STAR RATING
// ==========================================

function createStars(rating) {

    let stars = "";

    for (let i = 1; i <= 5; i++) {

        stars += i <= rating
            ? `<i class="fas fa-star"></i>`
            : `<i class="far fa-star"></i>`;

    }

    return stars;

}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(productData) {

    if (!productGrid) {
        return;
    }

    productGrid.innerHTML = "";

    if (productData.length === 0) {

        productGrid.innerHTML = `

            <div class="empty-box">

                <i class="fas fa-box-open"></i>

                <h2>No products found</h2>

                <p>
                    Dusra product name ya category search karke dekhein.
                </p>

                <button onclick="resetProductSearch()">
                    Show All Products
                </button>

            </div>

        `;

        return;

    }

    productData.forEach(product => {

        const discount = calculateDiscount(
            product.price,
            product.oldPrice
        );

        productGrid.innerHTML += `

            <div class="product-card fade">

                <div class="product-image-box">

                    ${
                        discount > 0
                            ? `
                                <span class="product-badge">
                                    ${discount}% OFF
                                </span>
                              `
                            : ""
                    }

                    <button
                        class="wishlist-icon"
                        onclick="addWishlist(${product.id})"
                        aria-label="Add ${product.name} to wishlist"
                    >

                        <i class="far fa-heart"></i>

                    </button>

                    <a class="product-image-link" href="product.html?id=${product.id}" aria-label="View ${product.name}">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='https://placehold.co/600x450/ede9fe/6d28d9?text=ShopEasy+Product'"
                    >
                    </a>

                </div>

                <div class="product-info">

                    <p class="product-category">
                        ${product.category}
                    </p>

                    <h3><a class="product-title-link" href="product.html?id=${product.id}">${product.name}</a></h3>

                    <div class="rating">

                        ${createStars(product.rating)}

                        <span>
                            ${product.rating}.0
                        </span>

                    </div>

                    <div class="price-row">

                        <span class="price">
                            ${formatPrice(product.price)}
                        </span>

                        <span class="old-price">
                            ${formatPrice(product.oldPrice)}
                        </span>

                    </div>

                    <button onclick="addCart(${product.id})">

                        <i class="fas fa-shopping-cart"></i>

                        Add To Cart

                    </button>

                </div>

            </div>

        `;

    });

}


// ==========================================
// SEARCH SYSTEM
// ==========================================

function filterProductsBySearch() {

    const searchInput = document.getElementById("search");

    if (!searchInput || !productGrid) {
        return;
    }

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    if (searchValue === "") {

        displayProducts(products);

        showNotification("All products are now visible.");

        return;

    }

    const searchResult = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue)
        );

    });

    displayProducts(searchResult);

    scrollToProducts();

}


function resetProductSearch() {

    const searchInput = document.getElementById("search");

    if (searchInput) {
        searchInput.value = "";
    }

    displayProducts(products);

}


function connectSearchSystem() {

    const searchInput = document.getElementById("search");
    const searchButton = document.querySelector(".search button");

    if (searchInput && productGrid) {

        searchInput.addEventListener("keyup", event => {

            if (event.key === "Enter") {

                filterProductsBySearch();

                return;

            }

            const searchValue = searchInput.value
                .trim()
                .toLowerCase();

            const searchResult = products.filter(product => {

                return (
                    product.name.toLowerCase().includes(searchValue) ||
                    product.category.toLowerCase().includes(searchValue)
                );

            });

            displayProducts(searchResult);

        });

    }

    if (searchButton && productGrid) {

        searchButton.addEventListener(
            "click",
            filterProductsBySearch
        );

    }

}


// ==========================================
// CATEGORY FILTER
// ==========================================

function connectCategoryFilter() {

    const categoryCards = document.querySelectorAll(".cat");

    categoryCards.forEach(card => {

        card.addEventListener("click", () => {

            const categoryName = (
                card.dataset.category ||
                card.textContent
            )
                .trim()
                .toLowerCase();

            const filteredProducts = products.filter(product => {

                return product.category
                    .toLowerCase()
                    .includes(categoryName);

            });

            if (filteredProducts.length > 0) {

                displayProducts(filteredProducts);

                showNotification(
                    `${categoryName} category is now displayed.`
                );

            } else {

                displayProducts(products);

                showNotification(
                    "No products are currently available in this category."
                );

            }

            scrollToProducts();

        });

    });

}


function scrollToProducts() {

    const productsSection = document.querySelector(".products");

    if (productsSection) {

        productsSection.scrollIntoView({

            behavior: "smooth",
            block: "start"

        });

    }

}


// ==========================================
// CART SYSTEM
// ==========================================

function addCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }

    const existingProduct = cart.find(
        item => item.id === productId
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            ...product,
            quantity: 1

        });

    }

    saveCart();

    showNotification(
        `${product.name} has been added to your cart.`
    );

}


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    renderCart();

    renderProfile();

}


function updateCartCount() {

    const cartCount = document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    const totalItems = cart.reduce(

        (total, item) => total + item.quantity,

        0

    );

    cartCount.textContent = totalItems;

}


function increaseQuantity(productId) {

    const item = cart.find(
        product => product.id === productId
    );

    if (!item) {
        return;
    }

    item.quantity += 1;

    saveCart();

}


function decreaseQuantity(productId) {

    const item = cart.find(
        product => product.id === productId
    );

    if (!item) {
        return;
    }

    if (item.quantity > 1) {

        item.quantity -= 1;

    } else {

        cart = cart.filter(
            product => product.id !== productId
        );

    }

    saveCart();

}


function removeCartItem(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

    showNotification(
        "The product has been removed from your cart."
    );

}


function clearCart() {

    if (cart.length === 0) {

        showNotification(
            "Your cart is already empty."
        );

        return;

    }

    cart = [];

    saveCart();

    showNotification(
        "Your cart has been cleared successfully."
    );

}


// ==========================================
// CART PAGE
// ==========================================

function renderCart() {

    const cartContainer = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartSubtotal = document.getElementById("cartSubtotal");

    if (!cartContainer) {
        return;
    }

    cartContainer.innerHTML = "";

    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-box">

                <i class="fas fa-shopping-cart"></i>

                <h2>Your cart is empty</h2>

                <p>
                    Products add karne ke baad yahan show honge.
                </p>

                <a href="index.html">
                    Continue Shopping
                </a>

            </div>

        `;

        if (cartSubtotal) {
            cartSubtotal.textContent = formatPrice(0);
        }

        if (cartTotal) {
            cartTotal.textContent = formatPrice(0);
        }

        return;

    }

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        cartContainer.innerHTML += `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    onerror="this.src='https://placehold.co/160x160?text=Product'"
                >

                <div class="cart-details">

                    <h3>${item.name}</h3>

                    <p>${item.category}</p>

                    <strong>
                        ${formatPrice(item.price)}
                    </strong>

                </div>

                <div class="quantity-box">

                    <button
                        onclick="decreaseQuantity(${item.id})"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${item.id})"
                    >
                        +
                    </button>

                </div>

                <div class="cart-price">

                    <strong>
                        ${formatPrice(itemTotal)}
                    </strong>

                    <button
                        class="remove-btn"
                        onclick="removeCartItem(${item.id})"
                    >

                        <i class="fas fa-trash"></i>

                        Remove

                    </button>

                </div>

            </div>

        `;

    });

    const totalPrice = cart.reduce(

        (total, item) =>
            total + item.price * item.quantity,

        0

    );

    if (cartSubtotal) {
        cartSubtotal.textContent = formatPrice(totalPrice);
    }

    if (cartTotal) {
        cartTotal.textContent = formatPrice(totalPrice);
    }

}


// ==========================================
// CHECKOUT
// ==========================================

function proceedCheckout() {

    if (cart.length === 0) {
        showNotification("Please add a product to your cart before checkout.");
        return;
    }

    window.location.href = "checkout.html";
}


// ==========================================
// PRODUCT DETAILS PAGE
// ==========================================

function getProductFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    return products.find(item => item.id === id) || products[0];
}

function renderProductDetails() {
    const container = document.getElementById("productDetails");
    if (!container) return;

    const product = getProductFromUrl();
    const discount = calculateDiscount(product.price, product.oldPrice);

    container.innerHTML = `
      <div class="detail-gallery">
        <div class="detail-main-image">
          <span class="product-badge">${discount}% OFF</span>
          <img id="detailImage" src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/800x700/ede9fe/6d28d9?text=ShopEasy+Product'">
        </div>
        <div class="detail-thumbs">
          <button class="active" type="button"><img src="${product.image}" alt="${product.name}"></button>
          <button type="button"><img src="${product.image}&sat=-25" alt="${product.name}"></button>
          <button type="button"><img src="${product.image}&con=15" alt="${product.name}"></button>
        </div>
      </div>
      <div class="detail-content">
        <p class="product-category">${product.category}</p>
        <h1>${product.name}</h1>
        <div class="rating">${createStars(product.rating)} <span>${product.rating}.0 rating</span></div>
        <div class="detail-price"><strong>${formatPrice(product.price)}</strong><del>${formatPrice(product.oldPrice)}</del><span>${discount}% off</span></div>
        <p class="detail-description">Premium quality ${product.name} with reliable performance, modern design and excellent value. This demo product is ready to add to cart or wishlist.</p>
        <ul class="detail-features">
          <li><i class="fas fa-check-circle"></i> Original quality product</li>
          <li><i class="fas fa-truck-fast"></i> Free delivery available</li>
          <li><i class="fas fa-rotate-left"></i> 7-day easy replacement</li>
          <li><i class="fas fa-shield-halved"></i> Secure shopping experience</li>
        </ul>
        <div class="detail-actions">
          <button class="primary-buy" type="button" onclick="addCart(${product.id}); setTimeout(()=>location.href='cart.html',500)"><i class="fas fa-bolt"></i> Buy Now</button>
          <button type="button" onclick="addCart(${product.id})"><i class="fas fa-cart-shopping"></i> Add To Cart</button>
          <button class="icon-action" type="button" onclick="addWishlist(${product.id})" aria-label="Add to wishlist"><i class="far fa-heart"></i></button>
        </div>
        <div class="delivery-check"><i class="fas fa-location-dot"></i><input id="pincodeInput" inputmode="numeric" maxlength="6" placeholder="Enter 6-digit PIN code"><button type="button" onclick="checkDelivery()">Check</button></div>
      </div>`;

    document.querySelectorAll('.detail-thumbs button').forEach(btn => btn.addEventListener('click', () => {
      document.querySelectorAll('.detail-thumbs button').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('detailImage').src = btn.querySelector('img').src;
    }));

    renderRelatedProducts(product);
}

function checkDelivery() {
    const value = (document.getElementById('pincodeInput')?.value || '').trim();
    showNotification(/^\d{6}$/.test(value) ? 'Delivery is available at this PIN code.' : 'Please enter a valid 6-digit PIN code.');
}

function renderRelatedProducts(current) {
    const box = document.getElementById('relatedProducts');
    if (!box) return;
    const related = products.filter(p => p.id !== current.id).slice(0,4);
    box.innerHTML = related.map(p => `
      <article class="mini-product-card">
        <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
        <div><p>${p.category}</p><h3><a href="product.html?id=${p.id}">${p.name}</a></h3><strong>${formatPrice(p.price)}</strong><button onclick="addCart(${p.id})">Add to Cart</button></div>
      </article>`).join('');
}


// ==========================================
// CHECKOUT PAGE
// ==========================================

function renderCheckout() {
    const list = document.getElementById('checkoutItems');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const totalEl = document.getElementById('checkoutTotal');
    if (!list) return;

    if (!cart.length) {
      list.innerHTML = '<div class="empty-box"><i class="fas fa-cart-shopping"></i><h2>Your cart is empty</h2><a href="index.html">Start Shopping</a></div>';
      return;
    }

    list.innerHTML = cart.map(item => `
      <div class="checkout-item"><img src="${item.image}" alt="${item.name}"><div><h3>${item.name}</h3><p>Qty: ${item.quantity}</p></div><strong>${formatPrice(item.price * item.quantity)}</strong></div>`).join('');
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (totalEl) totalEl.textContent = formatPrice(subtotal);
}

function placeOrder(event) {
    event.preventDefault();
    if (!cart.length) { showNotification('Your cart is empty.'); return; }
    const form = event.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const order = {
      id: 'SE' + Date.now().toString().slice(-8),
      date: new Date().toLocaleString('en-IN'),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
    localStorage.setItem('latestOrder', JSON.stringify(order));
    cart = [];
    saveCart();
    window.location.href = 'order-success.html';
}

function renderOrderSuccess() {
    const el = document.getElementById('orderResult');
    if (!el) return;
    const order = JSON.parse(localStorage.getItem('latestOrder') || 'null');
    if (!order) return;
    document.getElementById('orderId').textContent = order.id;
    document.getElementById('orderTotal').textContent = formatPrice(order.total);
}


// ==========================================
// WISHLIST SYSTEM
// ==========================================

function addWishlist(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }

    const alreadyAdded = wishlist.some(
        item => item.id === productId
    );

    if (alreadyAdded) {

        showNotification(
            `${product.name} is already in your wishlist.`
        );

        return;

    }

    wishlist.push(product);

    saveWishlist();

    showNotification(
        `${product.name} has been added to your wishlist.`
    );

}


function saveWishlist() {

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    updateWishlistCount();

    renderWishlist();

    renderProfile();

}


function updateWishlistCount() {

    const wishlistCount = document.getElementById(
        "wishlistCount"
    );

    if (!wishlistCount) {
        return;
    }

    wishlistCount.textContent = wishlist.length;

}


function removeWishlistItem(productId) {

    wishlist = wishlist.filter(
        item => item.id !== productId
    );

    saveWishlist();

    showNotification(
        "The product has been removed from your wishlist."
    );

}


function moveToCart(productId) {

    addCart(productId);

    wishlist = wishlist.filter(
        item => item.id !== productId
    );

    saveWishlist();

}


// ==========================================
// WISHLIST PAGE
// ==========================================

function renderWishlist() {

    const wishlistContainer = document.getElementById(
        "wishlistItems"
    );

    if (!wishlistContainer) {
        return;
    }

    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {

        wishlistContainer.innerHTML = `

            <div class="empty-box">

                <i class="far fa-heart"></i>

                <h2>Your wishlist is empty</h2>

                <p>
                    Pasand ke products wishlist me save kar sakte hain.
                </p>

                <a href="index.html">
                    Explore Products
                </a>

            </div>

        `;

        return;

    }

    wishlist.forEach(item => {

        wishlistContainer.innerHTML += `

            <div class="product-card fade">

                <div class="product-image-box">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        onerror="this.src='https://placehold.co/300x250?text=Product'"
                    >

                </div>

                <div class="product-info">

                    <p class="product-category">
                        ${item.category}
                    </p>

                    <h3>${item.name}</h3>

                    <div class="rating">

                        ${createStars(item.rating)}

                        <span>
                            ${item.rating}.0
                        </span>

                    </div>

                    <div class="price-row">

                        <span class="price">
                            ${formatPrice(item.price)}
                        </span>

                        <span class="old-price">
                            ${formatPrice(item.oldPrice)}
                        </span>

                    </div>

                    <button
                        onclick="moveToCart(${item.id})"
                    >

                        <i class="fas fa-cart-plus"></i>

                        Move To Cart

                    </button>

                    <button
                        class="remove-btn"
                        onclick="removeWishlistItem(${item.id})"
                    >

                        <i class="fas fa-trash"></i>

                        Remove

                    </button>

                </div>

            </div>

        `;

    });

}


// ==========================================
// TRENDING PRODUCTS
// ==========================================

function renderTrendingProducts() {

    const trendingContainer = document.getElementById(
        "trendingProducts"
    );

    if (!trendingContainer) {
        return;
    }

    const trendingProducts = products
        .filter(product => product.rating >= 4)
        .slice(0, 4);

    trendingContainer.innerHTML = "";

    trendingProducts.forEach(product => {

        trendingContainer.innerHTML += `

            <div class="product-card fade">

                <div class="product-image-box">

                    <span class="product-badge">
                        Trending
                    </span>

                    <button
                        class="wishlist-icon"
                        onclick="addWishlist(${product.id})"
                    >

                        <i class="far fa-heart"></i>

                    </button>

                    <a class="product-image-link" href="product.html?id=${product.id}" aria-label="View ${product.name}">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        onerror="this.onerror=null;this.src='https://placehold.co/600x450/ede9fe/6d28d9?text=ShopEasy+Product'"
                    >

                </div>

                <div class="product-info">

                    <p class="product-category">
                        ${product.category}
                    </p>

                    <h3>${product.name}</h3>

                    <div class="rating">

                        ${createStars(product.rating)}

                        <span>
                            ${product.rating}.0
                        </span>

                    </div>

                    <div class="price-row">

                        <span class="price">
                            ${formatPrice(product.price)}
                        </span>

                        <span class="old-price">
                            ${formatPrice(product.oldPrice)}
                        </span>

                    </div>

                    <button
                        onclick="addCart(${product.id})"
                    >

                        <i class="fas fa-shopping-cart"></i>

                        Add To Cart

                    </button>

                </div>

            </div>

        `;

    });

}


// ==========================================
// FLASH SALE BUTTONS
// ==========================================

function connectFlashSaleButtons() {

    const flashCards = document.querySelectorAll(
        ".flash-sale .offer-card"
    );

    flashCards.forEach((card, index) => {

        const button = card.querySelector("button");
        const product = products[index];

        if (!button || !product) {
            return;
        }

        button.addEventListener("click", () => {

            addCart(product.id);

        });

    });

}


// ==========================================
// HERO BUTTONS
// ==========================================

function connectShopButtons() {

    const heroButton = document.querySelector(
        ".hero-text button"
    );

    const offerButton = document.querySelector(
        ".offer-left button"
    );

    if (heroButton) {

        heroButton.addEventListener(
            "click",
            scrollToProducts
        );

    }

    if (offerButton) {

        offerButton.addEventListener(
            "click",
            scrollToProducts
        );

    }

}


// ==========================================
// NEWSLETTER
// ==========================================

function connectNewsletter() {

    const newsletterButton = document.querySelector(
        ".newsletter-box button"
    );

    if (!newsletterButton) {
        return;
    }

    newsletterButton.addEventListener(
        "click",
        subscribeNewsletter
    );

}


function subscribeNewsletter() {

    const emailInput = document.querySelector(
        ".newsletter-box input"
    );

    if (!emailInput) {
        return;
    }

    const email = emailInput.value
        .trim()
        .toLowerCase();

    const validEmailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {

        showNotification(
            "Please enter your email address."
        );

        emailInput.focus();

        return;

    }

    if (!validEmailPattern.test(email)) {

        showNotification(
            "Please enter a valid email address."
        );

        emailInput.focus();

        return;

    }

    const subscribers = JSON.parse(
        localStorage.getItem("newsletterSubscribers")
    ) || [];

    if (subscribers.includes(email)) {

        showNotification(
            "This email address is already subscribed."
        );

        return;

    }

    subscribers.push(email);

    localStorage.setItem(
        "newsletterSubscribers",
        JSON.stringify(subscribers)
    );

    emailInput.value = "";

    showNotification(
        "You have subscribed to the newsletter successfully."
    );

}


// ==========================================
// DARK MODE
// ==========================================

function applyTheme(theme) {

    const isDark = theme === "dark";

    document.documentElement.classList.toggle("dark-theme", isDark);
    document.body.classList.toggle("dark-theme", isDark);

    localStorage.setItem("shopEasyTheme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);
}

function loadTheme() {

    const savedTheme = localStorage.getItem("shopEasyTheme");
    const preferredDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    applyTheme(savedTheme || (preferredDark ? "dark" : "light"));
}

function toggleTheme(event) {

    if (event) event.preventDefault();

    const isDark = document.documentElement.classList.contains("dark-theme") ||
        document.body.classList.contains("dark-theme");

    applyTheme(isDark ? "light" : "dark");
}

function updateThemeIcon(isDark) {

    const buttons = document.querySelectorAll("#themeBtn, [data-theme-toggle]");

    buttons.forEach(button => {
        button.innerHTML = isDark
            ? `<i class="fas fa-sun"></i>`
            : `<i class="fas fa-moon"></i>`;
        button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
        button.setAttribute("title", isDark ? "Light theme" : "Dark theme");
    });
}

function connectThemeButton() {

    document.querySelectorAll("#themeBtn, [data-theme-toggle]").forEach(button => {
        button.onclick = toggleTheme;
    });
}


// ==========================================
// REGISTER SYSTEM
// ==========================================

function connectRegisterForm() {

    const registerForm = document.getElementById(
        "registerForm"
    );

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const name = document
                .getElementById("registerName")
                .value
                .trim();

            const email = document
                .getElementById("registerEmail")
                .value
                .trim()
                .toLowerCase();

            const password = document
                .getElementById("registerPassword")
                .value;

            const confirmPassword = document
                .getElementById("confirmPassword")
                .value;

            if (
                name === "" ||
                email === "" ||
                password === "" ||
                confirmPassword === ""
            ) {

                showNotification(
                    "Please complete all required fields."
                );

                return;

            }

            if (password.length < 6) {

                showNotification(
                    "Password minimum 6 characters ka hona chahiye."
                );

                return;

            }

            if (password !== confirmPassword) {

                showNotification(
                    "Password and confirm password do not match."
                );

                return;

            }

            // Dedicated administrator account for this frontend demo.
            if (email === "admin@shopeasy.com" && password === "Admin@123") {

                const adminUser = {
                    id: "SHOP-EASY-ADMIN",
                    name: "ShopEasy Admin",
                    email: "admin@shopeasy.com",
                    role: "admin",
                    joinedAt: "Administrator"
                };

                const auditedAdmin = window.recordShopEasyLogin ? window.recordShopEasyLogin(adminUser, 'Email & Password') : adminUser;
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(auditedAdmin)
                );

                showNotification(
                    "Administrator login successful."
                );

                setTimeout(() => {
                    window.location.href = "admin.html";
                }, 700);

                return;
            }

            const users = JSON.parse(
                localStorage.getItem("shopEasyUsers")
            ) || [];

            const userAlreadyExists = users.some(
                user => user.email === email
            );

            if (userAlreadyExists) {

                showNotification(
                    "An account already exists with this email address."
                );

                return;

            }

            const newUser = {

                id: Date.now(),
                name,
                email,
                password,
                role: "customer",
                joinedAt: new Date().toLocaleDateString(
                    "en-IN"
                )

            };

            users.push(newUser);

            localStorage.setItem(
                "shopEasyUsers",
                JSON.stringify(users)
            );

            localStorage.setItem(
                "currentUser",
                JSON.stringify(newUser)
            );

            showNotification(
                "Your account has been created successfully."
            );

            setTimeout(() => {

                window.location.href = "profile.html";

            }, 1000);

        }
    );

}


// ==========================================
// LOGIN SYSTEM
// ==========================================

function connectLoginForm() {

    const loginForm = document.getElementById(
        "loginForm"
    );

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const email = document
                .getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();

            const password = document
                .getElementById("loginPassword")
                .value;

            if (email === "" || password === "") {

                showNotification(
                    "Please enter your email address and password."
                );

                return;

            }

            const users = JSON.parse(
                localStorage.getItem("shopEasyUsers")
            ) || [];

            const matchedUser = users.find(user => {

                return (
                    user.email === email &&
                    user.password === password
                );

            });

            if (!matchedUser) {

                showNotification(
                    "The email address or password is incorrect."
                );

                return;

            }

            const auditedUser = window.recordShopEasyLogin ? window.recordShopEasyLogin(matchedUser, 'Email & Password') : matchedUser;
            localStorage.setItem(
                "currentUser",
                JSON.stringify(auditedUser)
            );

            showNotification(
                `Welcome back, ${getFirstName(matchedUser.name)}!`
            );

            setTimeout(() => {

                window.location.href = matchedUser.role === "admin"
                    ? "admin.html"
                    : "profile.html";

            }, 1000);

        }
    );

}


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (!input) {
        return;
    }

    if (input.type === "password") {

        input.type = "text";

        button.innerHTML = `
            <i class="fas fa-eye-slash"></i>
        `;

    } else {

        input.type = "password";

        button.innerHTML = `
            <i class="fas fa-eye"></i>
        `;

    }

}


// ==========================================
// DEMO ACCOUNT
// ==========================================

function createDemoAccount() {

    const users = JSON.parse(
        localStorage.getItem("shopEasyUsers")
    ) || [];

    const demoEmail = "demo@shopeasy.com";

    const demoExists = users.some(
        user => user.email === demoEmail
    );

    if (demoExists) {
        return;
    }

    users.push({

        id: 1001,
        name: "Demo User",
        email: demoEmail,
        password: "123456",
        role: "customer",
        joinedAt: new Date().toLocaleDateString("en-IN")

    });

    localStorage.setItem(
        "shopEasyUsers",
        JSON.stringify(users)
    );

}


function fillDemoLogin() {

    const emailInput = document.getElementById(
        "loginEmail"
    );

    const passwordInput = document.getElementById(
        "loginPassword"
    );

    if (emailInput) {
        emailInput.value = "demo@shopeasy.com";
    }

    if (passwordInput) {
        passwordInput.value = "123456";
    }

    showNotification(
        "Demo login details have been filled in."
    );

}


// ==========================================
// LOGIN HEADER STATUS
// ==========================================

function getFirstName(fullName) {

    if (!fullName) {
        return "Profile";
    }

    return fullName.trim().split(" ")[0];

}


function updateLoginStatus() {

    const loginLink = document.querySelector(
        '.right a[href="login.html"], .right a[href="profile.html"]'
    );

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
    );

    if (!loginLink) {
        return;
    }

    if (currentUser) {

        loginLink.href = "profile.html";

        loginLink.innerHTML = `

            <i class="fas fa-user-circle"></i>

            <span>
                ${getFirstName(currentUser.name)}
            </span>

        `;

    } else {

        loginLink.href = "login.html";

        loginLink.innerHTML = `

            <i class="fas fa-user"></i>

            <span>Login</span>

        `;

    }

}


// ==========================================
// PROFILE PAGE
// ==========================================

function renderProfile() {

    const profileContainer = document.getElementById(
        "profileContainer"
    );

    if (!profileContainer) {
        return;
    }

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
    );

    if (!currentUser) {

        profileContainer.innerHTML = `

            <div class="empty-box">

                <i class="fas fa-user-lock"></i>

                <h2>Please login first</h2>

                <p>
                    Profile dekhne ke liye account me login karein.
                </p>

                <a href="login.html">
                    Go To Login
                </a>

            </div>

        `;

        return;

    }

    const totalCartItems = cart.reduce(

        (total, item) => total + item.quantity,

        0

    );

    const totalCartValue = cart.reduce(

        (total, item) =>
            total + item.price * item.quantity,

        0

    );

    profileContainer.innerHTML = `

        <div class="profile-card">

            <div class="profile-avatar">

                <i class="fas fa-user"></i>

            </div>

            <h2>${currentUser.name}</h2>

            <p>${currentUser.email}</p>

            <span class="profile-role">
                ${currentUser.role || "customer"}
            </span>

            <div class="profile-info-grid">

                <div class="profile-stat">

                    <i class="fas fa-shopping-cart"></i>

                    <strong>
                        ${totalCartItems}
                    </strong>

                    <span>Cart Items</span>

                </div>

                <div class="profile-stat">

                    <i class="fas fa-heart"></i>

                    <strong>
                        ${wishlist.length}
                    </strong>

                    <span>Wishlist</span>

                </div>

                <div class="profile-stat">

                    <i class="fas fa-wallet"></i>

                    <strong>
                        ${formatPrice(totalCartValue)}
                    </strong>

                    <span>Cart Value</span>

                </div>

            </div>

            <div class="profile-details">

                <div>

                    <span>Full Name</span>

                    <strong>
                        ${currentUser.name}
                    </strong>

                </div>

                <div>

                    <span>Email Address</span>

                    <strong>
                        ${currentUser.email}
                    </strong>

                </div>

                <div>

                    <span>Joined On</span>

                    <strong>
                        ${currentUser.joinedAt || "Not available"}
                    </strong>

                </div>

            </div>

            <div class="profile-actions">

                <a href="cart.html">

                    <i class="fas fa-shopping-cart"></i>

                    View Cart

                </a>

                <a href="wishlist.html">

                    <i class="fas fa-heart"></i>

                    View Wishlist

                </a>

                <button onclick="logoutUser()">

                    <i class="fas fa-sign-out-alt"></i>

                    Logout

                </button>

            </div>

        </div>

    `;

}


// ==========================================
// LOGOUT
// ==========================================

function logoutUser() {

    localStorage.removeItem("currentUser");

    showNotification(
        "Aap successfully logout ho gaye."
    );

    setTimeout(() => {

        window.location.href = "index.html";

    }, 800);

}


// ==========================================
// FINAL INITIALIZATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        createDemoAccount();

        loadTheme();

        connectThemeButton();

        updateCartCount();

        updateWishlistCount();

        if (productGrid) {
            displayProducts(products);
        }

        connectSearchSystem();

        connectCategoryFilter();

        connectFlashSaleButtons();

        connectShopButtons();

        connectNewsletter();

        connectRegisterForm();

        connectLoginForm();

        renderCart();

        renderWishlist();

        renderTrendingProducts();

        renderProfile();

        updateLoginStatus();

    }
);
// ==========================================
// MOBILE NAVIGATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");
    if (!menuBtn || !mainNav) return;

    const closeMenu = () => {
        mainNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        const icon = menuBtn.querySelector("i");
        if (icon) icon.className = icon.className.includes("fa-solid") ? "fa-solid fa-bars" : "fas fa-bars";
    };

    menuBtn.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        const icon = menuBtn.querySelector("i");
        if (icon) icon.className = icon.className.includes("fa-solid")
            ? `fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`
            : `fas ${isOpen ? "fa-xmark" : "fa-bars"}`;
    });

    mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("click", (event) => {
        if (!mainNav.contains(event.target) && !menuBtn.contains(event.target)) closeMenu();
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) closeMenu();
    });
});

// ==========================================
// HOME PAGE PREMIUM SECTIONS
// ==========================================
function productCardMarkup(product) {
    const discount = calculateDiscount(product.price, product.oldPrice);
    return `
      <article class="mini-product-card">
        <div class="mini-product-image">
          ${discount ? `<span>${discount}% OFF</span>` : ""}
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x450/ede9fe/6d28d9?text=ShopEasy+Product'">
          <button type="button" onclick="addWishlist(${product.id})" aria-label="Add ${product.name} to wishlist"><i class="far fa-heart"></i></button>
        </div>
        <div class="mini-product-content">
          <small>${product.category}</small>
          <h3>${product.name}</h3>
          <div class="mini-rating">${createStars(product.rating)}</div>
          <div class="mini-price"><strong>${formatPrice(product.price)}</strong><del>${formatPrice(product.oldPrice)}</del></div>
          <button type="button" class="mini-cart-btn" onclick="addCart(${product.id})"><i class="fas fa-cart-plus"></i> Add to Cart</button>
        </div>
      </article>`;
}

function renderHomeShowcases() {
    const best = document.getElementById("bestSellerProducts");
    const newest = document.getElementById("newArrivalProducts");
    if (best) best.innerHTML = products.slice(0, 4).map(productCardMarkup).join("");
    if (newest) newest.innerHTML = products.slice(4, 8).reverse().map(productCardMarkup).join("");
}

function filterHomeCategory(category) {
    const filtered = products.filter(item => item.category === category);
    displayProducts(filtered);
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
}

function initHeroSlider() {
    const slides = [...document.querySelectorAll(".hero-slide")];
    const dotsBox = document.querySelector(".slider-dots");
    if (!slides.length || !dotsBox) return;
    let current = 0;
    let timer;

    dotsBox.innerHTML = slides.map((_, i) => `<button type="button" aria-label="Show slide ${i + 1}" class="${i === 0 ? "active" : ""}"></button>`).join("");
    const dots = [...dotsBox.querySelectorAll("button")];

    const show = index => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    };
    const restart = () => {
        clearInterval(timer);
        timer = setInterval(() => show(current + 1), 5000);
    };
    document.querySelector(".slider-prev")?.addEventListener("click", () => { show(current - 1); restart(); });
    document.querySelector(".slider-next")?.addEventListener("click", () => { show(current + 1); restart(); });
    dots.forEach((dot, i) => dot.addEventListener("click", () => { show(i); restart(); }));
    restart();
}

function initBackToTop() {
    const button = document.getElementById("backToTop");
    if (!button) return;
    window.addEventListener("scroll", () => button.classList.toggle("show", window.scrollY > 500));
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

document.addEventListener("DOMContentLoaded", () => {
    renderHomeShowcases();
    initHeroSlider();
    initBackToTop();
});


document.addEventListener("DOMContentLoaded", () => {
  renderProductDetails();
  renderCheckout();
  renderOrderSuccess();
});

// ==========================================
// MOBILE OTP DEMO LOGIN + ADVANCED PROFILE
// ==========================================
(function () {
  const readJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch (_) { return fallback; }
  };
  const notify = message => typeof showNotification === 'function' ? showNotification(message) : alert(message);

  function initAuthTabs() {
    const buttons = document.querySelectorAll('[data-auth-tab]');
    if (!buttons.length) return;
    buttons.forEach(button => button.addEventListener('click', () => {
      buttons.forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.auth-panel').forEach(panel => panel.classList.remove('active'));
      button.classList.add('active');
      const panel = document.getElementById(button.dataset.authTab === 'mobile' ? 'mobileLoginPanel' : 'emailLoginPanel');
      panel?.classList.add('active');
    }));
  }

  function initOtpLogin() {
    const form = document.getElementById('mobileOtpForm');
    if (!form) return;
    const mobile = document.getElementById('otpMobile');
    const verifyBox = document.getElementById('otpVerifyBox');
    const inputs = [...document.querySelectorAll('#otpInputs input')];
    const verify = document.getElementById('verifyOtpBtn');
    const resend = document.getElementById('resendOtpBtn');
    const timerText = document.getElementById('otpTimer');
    let otp = '123456';
    let timerId;

    const startTimer = () => {
      clearInterval(timerId);
      let seconds = 30;
      resend.disabled = true;
      timerText.textContent = `Resend OTP in ${seconds}s`;
      timerId = setInterval(() => {
        seconds -= 1;
        timerText.textContent = seconds > 0 ? `Resend OTP in ${seconds}s` : 'OTP not received?';
        if (seconds <= 0) { clearInterval(timerId); resend.disabled = false; }
      }, 1000);
    };

    const sendOtp = () => {
      const number = mobile.value.replace(/\D/g, '');
      if (!/^[6-9]\d{9}$/.test(number)) {
        notify('Please enter a valid 10-digit Indian mobile number.');
        return false;
      }
      otp = '123456';
      document.getElementById('maskedMobile').textContent = `+91 ${number.slice(0, 2)}******${number.slice(-2)}`;
      document.getElementById('demoOtpText').textContent = otp;
      verifyBox.hidden = false;
      inputs.forEach(input => input.value = '');
      inputs[0]?.focus();
      startTimer();
      notify('Demo OTP generated: 123456');
      return true;
    };

    form.addEventListener('submit', event => { event.preventDefault(); sendOtp(); });
    resend.addEventListener('click', sendOtp);

    inputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '').slice(0, 1);
        if (input.value && inputs[index + 1]) inputs[index + 1].focus();
      });
      input.addEventListener('keydown', event => {
        if (event.key === 'Backspace' && !input.value && inputs[index - 1]) inputs[index - 1].focus();
      });
      input.addEventListener('paste', event => {
        const value = (event.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
        if (value.length === 6) {
          event.preventDefault();
          inputs.forEach((box, i) => box.value = value[i] || '');
          inputs[5].focus();
        }
      });
    });

    verify.addEventListener('click', () => {
      const entered = inputs.map(input => input.value).join('');
      if (entered !== otp) { notify('Incorrect OTP. Please use the demo OTP: 123456.'); return; }
      const number = mobile.value.replace(/\D/g, '');
      const ADMIN_MOBILE = '7599821960';
      const users = readJSON('shopEasyUsers', []);
      let user = users.find(item => item.phone === number);
      const isAdminMobile = number === ADMIN_MOBILE;

      if (!user) {
        user = {
          id: isAdminMobile ? 'SHOP-EASY-ADMIN' : Date.now(),
          name: isAdminMobile ? 'Mohit Kumar' : 'ShopEasy User',
          phone: number,
          email: isAdminMobile ? 'mohitkumar6396105@gmail.com' : '',
          role: isAdminMobile ? 'admin' : 'customer',
          joinedAt: new Date().toLocaleDateString('en-IN')
        };
        users.push(user);
      } else {
        user.role = isAdminMobile ? 'admin' : 'customer';
        if (isAdminMobile) {
          user.name = user.name && user.name !== 'ShopEasy User' ? user.name : 'Mohit Kumar';
          user.email = user.email || 'mohitkumar6396105@gmail.com';
        }
        const index = users.findIndex(item => item.phone === number);
        if (index >= 0) users[index] = user;
      }

      localStorage.setItem('shopEasyUsers', JSON.stringify(users));
      user = window.recordShopEasyLogin ? window.recordShopEasyLogin(user, 'Mobile OTP') : user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      notify(isAdminMobile ? 'Administrator login successful.' : 'Mobile number verified. Login successful!');
      setTimeout(() => location.href = isAdminMobile ? 'admin.html' : 'profile.html', 700);
    });
  }

  function initAdvancedProfile() {
    const form = document.getElementById('advancedProfileForm');
    if (!form) return;
    const user = readJSON('currentUser', null);
    if (!user) { location.href = 'login.html'; return; }

    const fields = ['name','phone','email','dob','gender','address','city','state','pin','landmark'];
    fields.forEach(key => {
      const element = document.getElementById('edit' + key.charAt(0).toUpperCase() + key.slice(1));
      if (element) element.value = user[key] || '';
    });
    const name = user.name || 'ShopEasy User';
    document.getElementById('profileWelcomeName').textContent = name;
    document.getElementById('sidebarName').textContent = name;
    document.getElementById('sidebarMobile').textContent = user.phone ? `+91 ${user.phone}` : 'Mobile not added';
    document.getElementById('avatarFallback').textContent = name.charAt(0).toUpperCase();

    const photo = document.getElementById('profilePhoto');
    if (user.photo) { photo.src = user.photo; photo.style.display = 'block'; document.getElementById('avatarFallback').style.display = 'none'; }
    const cart = readJSON('cart', []), wishlist = readJSON('wishlist', []);
    const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    document.getElementById('profileCartCount').textContent = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    document.getElementById('profileWishlistCount').textContent = wishlist.length;
    document.getElementById('profileCartValue').textContent = '₹' + total.toLocaleString('en-IN');

    document.getElementById('photoInput').addEventListener('change', event => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 1.5 * 1024 * 1024) { notify('Please select a profile photo smaller than 1.5 MB.'); return; }
      const reader = new FileReader();
      reader.onload = () => { photo.src = reader.result; photo.style.display = 'block'; document.getElementById('avatarFallback').style.display = 'none'; };
      reader.readAsDataURL(file);
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      const updated = { ...user };
      fields.forEach(key => {
        const element = document.getElementById('edit' + key.charAt(0).toUpperCase() + key.slice(1));
        updated[key] = element?.value.trim() || '';
      });
      if (!/^[6-9]\d{9}$/.test(updated.phone)) { notify('Please enter a valid 10-digit mobile number.'); return; }
      if (updated.pin && !/^\d{6}$/.test(updated.pin)) { notify('The PIN code must contain exactly 6 digits.'); return; }
      if (photo.src && photo.style.display === 'block') updated.photo = photo.src;
      localStorage.setItem('currentUser', JSON.stringify(updated));
      const users = readJSON('shopEasyUsers', []);
      const index = users.findIndex(item => item.id === updated.id || (updated.phone && item.phone === updated.phone));
      if (index >= 0) users[index] = updated; else users.push(updated);
      localStorage.setItem('shopEasyUsers', JSON.stringify(users));
      document.getElementById('profileWelcomeName').textContent = updated.name;
      document.getElementById('sidebarName').textContent = updated.name;
      document.getElementById('sidebarMobile').textContent = `+91 ${updated.phone}`;
      notify('Your profile details have been updated successfully.');
    });
  }

  function autofillCheckout() {
    const form = document.querySelector('.checkout-form');
    if (!form) return;
    const user = readJSON('currentUser', null);
    if (!user) return;
    ['name','phone','address','city','state','pin','landmark'].forEach(key => {
      const field = form.elements[key];
      if (field && user[key]) field.value = user[key];
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAuthTabs(); initOtpLogin(); initAdvancedProfile(); autofillCheckout();
  });
})();

// ==========================================
// ADVANCED COMMERCE: COUPONS, ORDERS, TRACKING, REVIEWS
// ==========================================
(function () {
  const couponRules = {
    WELCOME10: { type: 'percent', value: 10, max: 1000, label: '10% off (up to ₹1,000)' },
    SAVE200: { type: 'flat', value: 200, min: 1499, label: '₹200 off above ₹1,499' },
    FREESHIP: { type: 'shipping', value: 0, label: 'Free delivery' }
  };

  function readStore(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }

  function cartSubtotalValue() {
    const currentCart = readStore('cart', []);
    return currentCart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  }

  function calculateCoupon(code, subtotal) {
    const rule = couponRules[code];
    if (!rule) return { valid: false, discount: 0, message: 'Invalid coupon code.' };
    if (rule.min && subtotal < rule.min) return { valid: false, discount: 0, message: `Minimum order ${formatPrice(rule.min)} required.` };
    let discount = 0;
    if (rule.type === 'percent') discount = Math.min(subtotal * rule.value / 100, rule.max || Infinity);
    if (rule.type === 'flat') discount = Math.min(rule.value, subtotal);
    return { valid: true, discount: Math.round(discount), message: `${rule.label} applied successfully.` };
  }

  window.applyCoupon = function () {
    const input = document.getElementById('couponInput');
    const message = document.getElementById('couponMessage');
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    const result = calculateCoupon(code, cartSubtotalValue());
    if (!result.valid) {
      localStorage.removeItem('activeCoupon');
      if (message) { message.textContent = result.message; message.style.color = '#dc2626'; }
    } else {
      localStorage.setItem('activeCoupon', code);
      if (message) { message.textContent = result.message; message.style.color = '#16a34a'; }
      showNotification(result.message);
    }
    updateCouponTotals();
  };

  function updateCouponTotals() {
    const subtotal = cartSubtotalValue();
    const code = localStorage.getItem('activeCoupon') || '';
    const result = calculateCoupon(code, subtotal);
    const discount = result.valid ? result.discount : 0;
    const total = Math.max(0, subtotal - discount);
    const cartDiscount = document.getElementById('cartDiscount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutDiscount = document.getElementById('checkoutDiscount');
    const checkoutTotal = document.getElementById('checkoutTotal');
    if (cartDiscount) cartDiscount.textContent = '−' + formatPrice(discount);
    if (cartTotal) cartTotal.textContent = formatPrice(total);
    if (checkoutDiscount) checkoutDiscount.textContent = '−' + formatPrice(discount);
    if (checkoutTotal) checkoutTotal.textContent = formatPrice(total);
    const input = document.getElementById('couponInput');
    if (input && code) input.value = code;
  }

  const originalRenderCart = window.renderCart;
  if (typeof originalRenderCart === 'function') {
    window.renderCart = function () { originalRenderCart(); setTimeout(updateCouponTotals, 0); };
  }
  const originalRenderCheckout = window.renderCheckout;
  if (typeof originalRenderCheckout === 'function') {
    window.renderCheckout = function () { originalRenderCheckout(); setTimeout(updateCouponTotals, 0); };
  }

  window.placeOrder = function (event) {
    event.preventDefault();
    const currentCart = readStore('cart', []);
    if (!currentCart.length) { showNotification('Your cart is empty.'); return; }
    const form = event.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const subtotal = currentCart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity || 1), 0);
    const couponCode = localStorage.getItem('activeCoupon') || '';
    const coupon = calculateCoupon(couponCode, subtotal);
    const discount = coupon.valid ? coupon.discount : 0;
    const data = new FormData(form);
    const order = {
      id: 'SE' + Date.now().toString().slice(-8),
      date: new Date().toLocaleString('en-IN'),
      timestamp: Date.now(),
      items: currentCart,
      subtotal,
      discount,
      coupon: coupon.valid ? couponCode : '',
      total: Math.max(0, subtotal - discount),
      statusIndex: 0,
      status: 'Order Placed',
      payment: data.get('payment') || 'cod',
      customer: (() => {
        const loggedIn = readStore('currentUser', null);
        return {
          id: loggedIn?.id || '',
          name: loggedIn?.name || data.get('name') || 'Guest Customer',
          email: loggedIn?.email || '',
          phone: loggedIn?.phone || data.get('phone') || ''
        };
      })(),
      address: {
        name: data.get('name'), phone: data.get('phone'), address: data.get('address'),
        city: data.get('city'), state: data.get('state'), pin: data.get('pin'), landmark: data.get('landmark') || ''
      }
    };
    const orders = readStore('shopEasyOrders', []);
    orders.unshift(order);
    localStorage.setItem('shopEasyOrders', JSON.stringify(orders));
    localStorage.setItem('latestOrder', JSON.stringify(order));
    localStorage.removeItem('activeCoupon');
    localStorage.setItem('cart', JSON.stringify([]));
    if (typeof cart !== 'undefined') cart = [];
    if (typeof saveCart === 'function') saveCart();
    location.href = 'order-success.html';
  };

  function renderOrders() {
    const box = document.getElementById('ordersList');
    if (!box) return;
    const orders = readStore('shopEasyOrders', []);
    if (!orders.length) {
      box.innerHTML = '<div class="empty-box"><i class="fas fa-box-open"></i><h2>No orders yet</h2><p>Your placed orders will appear here.</p><a href="index.html">Start Shopping</a></div>';
      return;
    }
    box.innerHTML = orders.map(order => `
      <article class="order-card">
        <div class="order-head"><div><small>ORDER ID</small><h3>${order.id}</h3></div><div><small>PLACED ON</small><p>${order.date}</p></div><span class="order-status">${order.status || 'Order Placed'}</span></div>
        <div class="order-items">${order.items.map(item => `<div class="order-mini-item"><img src="${item.image}" alt="${item.name}"><div><strong>${item.name}</strong><p>Qty: ${item.quantity || 1}</p></div><b>${formatPrice(item.price * (item.quantity || 1))}</b></div>`).join('')}</div>
        <div class="order-foot"><div><small>${order.coupon ? `Coupon ${order.coupon}: −${formatPrice(order.discount)}` : 'No coupon used'}</small><h3>Total: ${formatPrice(order.total)}</h3></div><a class="track-btn" href="tracking.html?id=${order.id}"><i class="fas fa-location-dot"></i> Track Order</a></div>
      </article>`).join('');
  }

  function renderTracking() {
    const box = document.getElementById('trackingDetails');
    if (!box) return;
    const id = new URLSearchParams(location.search).get('id');
    const orders = readStore('shopEasyOrders', []);
    const order = orders.find(o => o.id === id) || orders[0];
    if (!order) { box.innerHTML = '<div class="empty-box"><h2>Order not found</h2><a href="orders.html">Back to Orders</a></div>'; return; }
    const elapsedDays = Math.floor((Date.now() - Number(order.timestamp || Date.now())) / 86400000);
    const currentIndex = Math.min(4, Math.max(Number(order.statusIndex || 0), elapsedDays));
    const stages = [
      ['Order Placed','fa-receipt'],['Packed','fa-box'],['Shipped','fa-truck-fast'],['Out for Delivery','fa-motorcycle'],['Delivered','fa-circle-check']
    ];
    box.innerHTML = `<div class="tracking-summary"><div><span>Tracking Order</span><h1>${order.id}</h1><p>Placed ${order.date}</p></div><div><small>Order Total</small><h2>${formatPrice(order.total)}</h2><p>${order.items.length} product(s)</p></div></div><div class="tracking-steps">${stages.map((stage,i)=>`<div class="track-step ${i<currentIndex?'done':i===currentIndex?'active':''}"><div class="icon"><i class="fas ${stage[1]}"></i></div><div><p>${stage[0]}</p><small>${i<=currentIndex?'Completed / Active':'Pending'}</small></div></div>`).join('')}</div><div class="safe-checkout" style="margin-top:35px"><i class="fas fa-location-dot"></i><div><strong>Delivery Address</strong><span>${order.address?.address || ''}, ${order.address?.city || ''}, ${order.address?.state || ''} - ${order.address?.pin || ''}</span></div></div>`;
  }

  function reviewKey() {
    const id = Number(new URLSearchParams(location.search).get('id')) || 1;
    return `shopEasyReviews_${id}`;
  }

  function renderReviews() {
    const list = document.getElementById('reviewsList');
    if (!list) return;
    const reviews = readStore(reviewKey(), []);
    const count = reviews.length;
    const avg = count ? reviews.reduce((sum,r)=>sum+Number(r.rating),0)/count : 0;
    const average = document.getElementById('reviewAverage');
    const stars = document.getElementById('reviewStars');
    const countEl = document.getElementById('reviewCount');
    if (average) average.textContent = avg.toFixed(1);
    if (stars) stars.textContent = '★'.repeat(Math.round(avg)) + '☆'.repeat(5-Math.round(avg));
    if (countEl) countEl.textContent = `${count} review${count===1?'':'s'}`;
    if (!count) { list.innerHTML = '<div class="empty-box"><i class="far fa-comment-dots"></i><h3>No reviews yet</h3><p>Be the first to review this product.</p></div>'; return; }
    list.innerHTML = reviews.map(r=>`<article class="review-card"><div class="review-card-head"><div><strong>${r.name}</strong><div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div></div><small>${r.date}</small></div><p>${String(r.text).replace(/[<>]/g,'')}</p></article>`).join('');
  }

  function initReviews() {
    const form = document.getElementById('reviewForm');
    if (!form) return;
    renderReviews();
    form.addEventListener('submit', e => {
      e.preventDefault();
      const rating = Number(document.getElementById('reviewRating').value);
      const text = document.getElementById('reviewText').value.trim();
      if (!rating || !text) return;
      const user = readStore('currentUser', null);
      const reviews = readStore(reviewKey(), []);
      reviews.unshift({ id: Date.now(), name: user?.name || 'ShopEasy Customer', rating, text, date: new Date().toLocaleDateString('en-IN') });
      localStorage.setItem(reviewKey(), JSON.stringify(reviews));
      form.reset(); renderReviews(); showNotification('Your review has been submitted.');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCouponTotals(); renderOrders(); renderTracking(); initReviews();
    setTimeout(updateCouponTotals, 80);
  });
})();

// ==========================================
// LANGUAGE SELECTOR (ENGLISH / HINDI)
// Popup and toast messages intentionally remain in English.
// ==========================================
(function () {
  'use strict';

  const STORAGE_KEY = 'shopEasyLanguage';
  const translations = {
    'Home': 'होम', 'Shop': 'शॉप', 'Categories': 'श्रेणियाँ', 'Deals': 'ऑफर',
    'New Arrivals': 'नए उत्पाद', 'Best Sellers': 'सबसे लोकप्रिय', 'About': 'हमारे बारे में',
    'About Developer': 'डेवलपर के बारे में', 'Contact': 'संपर्क', 'Support': 'सहायता',
    'My Account': 'मेरा अकाउंट', 'Profile': 'प्रोफाइल', 'My Orders': 'मेरे ऑर्डर',
    'Orders': 'ऑर्डर', 'Wishlist': 'विशलिस्ट', 'Cart': 'कार्ट', 'Login': 'लॉगिन',
    'Register': 'रजिस्टर', 'Logout': 'लॉगआउट', 'Search': 'खोजें',
    'Search products...': 'उत्पाद खोजें...', 'Shop Now': 'अभी खरीदें',
    'View All': 'सभी देखें', 'Add to Cart': 'कार्ट में जोड़ें', 'Buy Now': 'अभी खरीदें',
    'Quick View': 'झटपट देखें', 'Featured Products': 'चुनिंदा उत्पाद',
    'Trending Products': 'ट्रेंडिंग उत्पाद', 'Flash Sale': 'फ्लैश सेल',
    'Top Brands': 'प्रमुख ब्रांड', 'Customer Reviews': 'ग्राहक समीक्षाएँ',
    'Order Summary': 'ऑर्डर सारांश', 'Subtotal': 'उप-योग', 'Delivery': 'डिलीवरी',
    'Discount': 'छूट', 'Total': 'कुल', 'Apply': 'लागू करें', 'Place Order': 'ऑर्डर करें',
    'Continue Shopping': 'खरीदारी जारी रखें', 'Track Order': 'ऑर्डर ट्रैक करें',
    'Order History': 'ऑर्डर इतिहास', 'Delivery Address': 'डिलीवरी पता',
    'Payment Method': 'भुगतान का तरीका', 'Save Changes': 'बदलाव सेव करें',
    'Full Name': 'पूरा नाम', 'Mobile Number': 'मोबाइल नंबर', 'Email Address': 'ईमेल पता',
    'Address': 'पता', 'City': 'शहर', 'State': 'राज्य', 'PIN Code': 'पिन कोड',
    'Password': 'पासवर्ड', 'Confirm Password': 'पासवर्ड की पुष्टि करें',
    'Welcome Back': 'वापसी पर स्वागत है', 'Create Account': 'अकाउंट बनाएँ',
    'Dashboard': 'डैशबोर्ड', 'Products': 'उत्पाद', 'Customers': 'ग्राहक',
    'Revenue': 'आय', 'Total Orders': 'कुल ऑर्डर', 'Total Customers': 'कुल ग्राहक',
    'Total Revenue': 'कुल आय', 'Recent Orders': 'हाल के ऑर्डर',
    'Order Status': 'ऑर्डर स्थिति', 'Pending': 'लंबित', 'Confirmed': 'पुष्टि हुई',
    'Packed': 'पैक किया गया', 'Shipped': 'भेज दिया गया',
    'Out for Delivery': 'डिलीवरी के लिए निकला', 'Delivered': 'डिलीवर हुआ',
    'Cancelled': 'रद्द', 'English': 'English', 'Hindi': 'हिंदी', 'Language': 'भाषा'
  };
  const reverse = Object.fromEntries(Object.entries(translations).map(([en, hi]) => [hi, en]));

  function shouldSkip(node) {
    const parent = node.parentElement;
    return !parent || parent.closest('.notification, .toast-notification, script, style, option, .language-switcher');
  }

  function translateText(text, language) {
    const trimmed = text.trim();
    if (!trimmed) return text;
    const map = language === 'hi' ? translations : reverse;
    if (!map[trimmed]) return text;
    return text.replace(trimmed, map[trimmed]);
  }

  function translatePage(language) {
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!shouldSkip(node)) node.nodeValue = translateText(node.nodeValue, language);
    });
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
      const value = el.getAttribute('placeholder');
      const map = language === 'hi' ? translations : reverse;
      if (map[value]) el.setAttribute('placeholder', map[value]);
    });
    document.querySelectorAll('.language-select').forEach(select => select.value = language);
  }

  function bindProfileLanguageSelector() {
    const selectors = document.querySelectorAll('.language-select');
    selectors.forEach(select => {
      select.value = localStorage.getItem(STORAGE_KEY) || 'en';
      select.addEventListener('change', event => {
        const language = event.target.value;
        localStorage.setItem(STORAGE_KEY, language);
        translatePage(language);
        if (typeof showNotification === 'function') {
          showNotification(language === 'hi' ? 'Website language changed to Hindi.' : 'Website language changed to English.');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    translatePage(localStorage.getItem(STORAGE_KEY) || 'en');
    bindProfileLanguageSelector();
  });
})();


// ==========================================
// ROLE-AWARE NAVIGATION AND ADMIN SESSION UI
// ==========================================
(function initRoleAwareInterface() {
    function readCurrentUser() {
        try { return JSON.parse(localStorage.getItem('currentUser')); }
        catch (error) { return null; }
    }

    function applyRoleNavigation() {
        const user = readCurrentUser();
        const isAdmin = user?.role === 'admin';

        document.querySelectorAll('a[href="admin.html"], a[href="vendor.html"]').forEach(link => {
            const item = link.closest('li');
            const target = item || link;
            target.style.display = isAdmin ? '' : 'none';
        });

        if (isAdmin && (document.body.classList.contains('admin-body') || document.body.classList.contains('vendor-body'))) {
            document.documentElement.style.visibility = 'visible';
            document.querySelectorAll('a[href="login.html"]').forEach(link => {
                link.innerHTML = '<i class="fas fa-right-from-bracket"></i><span>Logout</span>';
                link.href = '#';
                link.addEventListener('click', event => {
                    event.preventDefault();
                    localStorage.removeItem('currentUser');
                    showNotification('Administrator logged out successfully.');
                    setTimeout(() => location.href = 'login.html', 500);
                });
            });
        }

        const accessMessage = sessionStorage.getItem('shopEasyAccessMessage');
        if (accessMessage && document.getElementById('loginForm')) {
            sessionStorage.removeItem('shopEasyAccessMessage');
            setTimeout(() => showNotification(accessMessage), 150);
        }
    }

    document.addEventListener('DOMContentLoaded', applyRoleNavigation);
})();

// ==========================================
// V4.0 PREMIUM EXPERIENCE
// Existing mobile-role logic remains unchanged.
// ==========================================
(function shopEasyPremiumExperience(){
  const safeJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}};
  const saveJSON=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const defaultNotifications=[
    {id:1,icon:'fa-box',title:'Order tracking is ready',text:'Open My Orders to view the latest delivery status.',time:'Just now',read:false},
    {id:2,icon:'fa-tag',title:'Welcome offer unlocked',text:'Use coupon WELCOME10 during checkout for a demo discount.',time:'Today',read:false},
    {id:3,icon:'fa-coins',title:'Reward coins available',text:'Visit Rewards Center and claim your profile-completion coins.',time:'Today',read:false}
  ];
  if(!localStorage.getItem('shopEasyNotifications')) saveJSON('shopEasyNotifications',defaultNotifications);
  if(!localStorage.getItem('shopEasyRewards')) saveJSON('shopEasyRewards',{points:120,claimed:[]});

  function currentUser(){return safeJSON('currentUser',null)}
  function initials(name='Guest'){return name.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
  function unreadCount(){return safeJSON('shopEasyNotifications',defaultNotifications).filter(n=>!n.read).length}

  function injectDock(){
    if(document.querySelector('.se-premium-dock')) return;
    const user=currentUser(); const admin=user?.role==='admin';
    const wrap=document.createElement('div'); wrap.className='se-premium-dock';
    wrap.innerHTML=`<div class="se-dock-panel" id="seDockPanel"><div class="se-dock-top"><h3>Quick Access</h3><a href="notifications.html">${unreadCount()} new</a></div><div class="se-dock-user"><div class="se-dock-avatar">${initials(user?.name || (admin?'Admin':'Guest'))}</div><div><b>${user?.name || (admin?'Administrator':'ShopEasy Guest')}</b><small>${admin?'Admin + Vendor access':user?'Customer account':'Login for full access'}</small></div></div><div class="se-dock-links"><a href="${user?'profile.html':'login.html'}"><i class="fas fa-user"></i> ${user?'Profile':'Login'}</a><a href="notifications.html"><i class="fas fa-bell"></i> Notifications</a><a href="rewards.html"><i class="fas fa-gift"></i> Rewards</a><a href="orders.html"><i class="fas fa-box"></i> Orders</a>${admin?'<a href="admin.html"><i class="fas fa-shield-halved"></i> Admin</a><a href="vendor.html"><i class="fas fa-store"></i> Vendor</a>':''}</div></div><button class="se-dock-button" id="seDockButton" aria-label="Open quick access"><i class="fas fa-bolt"></i>${unreadCount()?'<span class="se-dot"></span>':''}</button>`;
    document.body.appendChild(wrap);
    wrap.querySelector('#seDockButton').addEventListener('click',()=>wrap.querySelector('#seDockPanel').classList.toggle('open'));
  }

  window.renderNotifications=function(){
    const root=document.getElementById('notificationList'); if(!root)return;
    const items=safeJSON('shopEasyNotifications',defaultNotifications);
    root.innerHTML=items.length?items.map(n=>`<article class="notification-item ${n.read?'':'unread'}"><div class="notification-icon"><i class="fas ${n.icon}"></i></div><div class="notification-copy"><h3>${n.title}</h3><p>${n.text}</p><small>${n.time}</small>${n.read?'':`<div class="notification-actions"><button class="mini-btn" onclick="readNotification(${n.id})">Mark as read</button></div>`}</div></article>`).join(''):'<div class="empty-box"><i class="fas fa-bell-slash"></i><h2>No notifications</h2><p>You are all caught up.</p></div>';
  };
  window.readNotification=function(id){const list=safeJSON('shopEasyNotifications',defaultNotifications).map(n=>n.id===id?{...n,read:true}:n);saveJSON('shopEasyNotifications',list);renderNotifications();showNotification('Notification marked as read.');};
  window.markAllNotificationsRead=function(){saveJSON('shopEasyNotifications',safeJSON('shopEasyNotifications',defaultNotifications).map(n=>({...n,read:true})));renderNotifications();showNotification('All notifications marked as read.');};
  window.clearNotifications=function(){saveJSON('shopEasyNotifications',[]);renderNotifications();showNotification('Notifications cleared.');};

  const tasks=[{id:'profile',title:'Complete your profile',desc:'Add your personal and address details.',coins:50},{id:'wishlist',title:'Create a wishlist',desc:'Save at least one favourite product.',coins:25},{id:'order',title:'Place your first order',desc:'Complete one demo checkout.',coins:100},{id:'daily',title:'Daily visit bonus',desc:'Claim once in this demo session.',coins:10}];
  window.renderRewards=function(){
    const root=document.getElementById('rewardTasks'); if(!root)return;
    const data=safeJSON('shopEasyRewards',{points:120,claimed:[]});
    document.getElementById('rewardPoints').textContent=`${data.points} Coins`;
    document.getElementById('rewardProgress').style.width=`${Math.min(100,(data.points/500)*100)}%`;
    document.getElementById('membershipTier').textContent=data.points>=500?'Gold':data.points>=250?'Plus':'Silver';
    root.innerHTML=tasks.map(t=>`<div class="reward-task"><div><b>${t.title}</b><span>${t.desc} • +${t.coins} coins</span></div><button class="claim-btn" ${data.claimed.includes(t.id)?'disabled':''} onclick="claimReward('${t.id}')">${data.claimed.includes(t.id)?'Claimed':'Claim'}</button></div>`).join('');
  };
  window.claimReward=function(id){const data=safeJSON('shopEasyRewards',{points:120,claimed:[]});if(data.claimed.includes(id))return;const task=tasks.find(t=>t.id===id);data.points+=task.coins;data.claimed.push(id);saveJSON('shopEasyRewards',data);renderRewards();showNotification(`${task.coins} reward coins added.`);};

  document.addEventListener('DOMContentLoaded',()=>{injectDock();renderNotifications();renderRewards();});
})();

// ==========================================
// V4.1 MOBILE BOTTOM NAVIGATION
// Makes Login/Profile, Menu, Orders, Wishlist and Cart always reachable.
// Existing admin/vendor/customer role logic is not changed.
// ==========================================
(function initMobileBottomNavigation(){
  function readUser(){
    try{return JSON.parse(localStorage.getItem('currentUser'))}catch(error){return null}
  }
  function readCount(key){
    try{const value=JSON.parse(localStorage.getItem(key));return Array.isArray(value)?value.length:0}catch(error){return 0}
  }
  function inject(){
    if(document.querySelector('.se-mobile-bottom-nav')) return;
    const user=readUser();
    const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const accountHref=user?'profile.html':'login.html';
    const accountLabel=user?'Profile':'Login';
    const cartCount=readCount('cart');
    const wishCount=readCount('wishlist');
    const nav=document.createElement('div');
    nav.className='se-mobile-bottom-nav';
    nav.setAttribute('aria-label','Mobile navigation');
    nav.innerHTML=`
      <a href="index.html" class="${page==='index.html'?'active':''}"><i class="fas fa-house"></i><span>Home</span></a>
      <button type="button" id="mobileBottomMenu"><i class="fas fa-bars"></i><span>Menu</span></button>
      <a href="${accountHref}" class="${['login.html','profile.html','register.html'].includes(page)?'active':''}"><i class="${user?'fas fa-user-circle':'fas fa-right-to-bracket'}"></i><span>${accountLabel}</span></a>
      <a href="wishlist.html" class="${page==='wishlist.html'?'active':''}"><i class="fas fa-heart"></i><span>Wishlist</span>${wishCount?`<b class="mobile-nav-count">${wishCount}</b>`:''}</a>
      <a href="cart.html" class="${page==='cart.html'?'active':''}"><i class="fas fa-cart-shopping"></i><span>Cart</span>${cartCount?`<b class="mobile-nav-count">${cartCount}</b>`:''}</a>`;
    document.body.appendChild(nav);
    nav.querySelector('#mobileBottomMenu')?.addEventListener('click',()=>{
      const menu=document.getElementById('mainNav');
      const topButton=document.getElementById('mobileMenuBtn');
      if(!menu) return;
      const opened=menu.classList.toggle('open');
      menu.classList.remove('active');
      topButton?.setAttribute('aria-expanded',String(opened));
      const icon=topButton?.querySelector('i');
      if(icon) icon.className=`fa-solid ${opened?'fa-xmark':'fa-bars'}`;
    });
  }
  document.addEventListener('DOMContentLoaded',inject);
})();
