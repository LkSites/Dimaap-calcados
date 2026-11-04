// Banco de Dados de Produtos (Calçados, Bolsas e Bolsas de Couro Legítimo)
// Produtos padrão iniciais
const defaultProducts = [
    {
        id: 1,
        title: "Scarpin Clássico Salto Fino Verniz",
        category: "calcados",
        tag: "Lançamento",
        price: 189.90,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
        description: "Scarpin sofisticado em acabamento verniz com salto fino de 9cm. Conforto e elegância reunidos para qualquer ocasião.",
        sizes: ["34", "35", "36", "37", "38", "39"]
    },
    {
        id: 2,
        title: "Sandália Rasteira Trançada Dourada",
        category: "calcados",
        tag: "Mais Vendido",
        price: 129.90,
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80",
        description: "Rasteirinha confortável com tiras trançadas artesanais e detalhes metalizados. Perfeita para os dias ensolarados.",
        sizes: ["34", "35", "36", "37", "38"]
    },
    {
        id: 3,
        title: "Bolsa Tote Couro Legítimo Burgundy",
        category: "bolsas-couro",
        tag: "Exclusivo",
        price: 349.90,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
        description: "Bolsa tote confeccionada em 100% couro legítimo de alta durabilidade, tom marsala exclusivo, amplo espaço interno e divisórias.",
        sizes: ["Único"]
    },
    {
        id: 4,
        title: "Bolsa Crossbody Matelassê",
        category: "bolsas",
        tag: "Tendência",
        price: 199.90,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80",
        description: "Bolsa transversal com acabamento em matelassê e alça de corrente dourada. Sofisticação e praticidade para o dia a dia.",
        sizes: ["Único"]
    },
    {
        id: 5,
        title: "Bota Ankle Boot Couro Salto Bloco",
        category: "calcados",
        tag: "Inverno",
        price: 289.90,
        image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80",
        description: "Bota ankle boot em couro com salto bloco estável e fechamento lateral em zíper. O equilíbrio perfeito entre atitude e conforto.",
        sizes: ["35", "36", "37", "38", "39"]
    },
    {
        id: 6,
        title: "Bolsa Shoulder Bag Couro Premium",
        category: "bolsas-couro",
        tag: "Luxo",
        price: 299.90,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
        description: "Shoulder bag estruturada em couro legítimo macio. Design minimalista com fecho magnético de alta segurança.",
        sizes: ["Único"]
    },
    {
        id: 7,
        title: "Mocassim Casual Tratorado",
        category: "calcados",
        tag: "Conforto",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=600&q=80",
        description: "Mocassim com solado tratorado leve e palmilha acolchoada anatômica. Modernidade e bem-estar para suas caminhadas.",
        sizes: ["34", "35", "36", "37", "38", "39"]
    },
    {
        id: 8,
        title: "Bolsa Saco Franjas Estilo Boho",
        category: "bolsas",
        tag: "Oferta",
        price: 179.90,
        image: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80",
        description: "Bolsa estilo saco com franjas delicadas e cordão de ajuste. Um toque boho chic irresistível para compor looks casuais.",
        sizes: ["Único"]
    }
];

// Junta os produtos padrão com os cadastrados no painel administrativo
const customProducts = JSON.parse(localStorage.getItem('dimaap_custom_products')) || [];
const products = [...customProducts, ...defaultProducts];

// Estado da Aplicação
let cart = [];
let wishlist = [];

// Elementos DOM
const productsGrid = document.getElementById('products-grid');
const cartDrawer = document.getElementById('cart-drawer');
const overlay = document.getElementById('overlay');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const wishlistBtn = document.getElementById('wishlist-btn');
const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartItemCount = document.getElementById('cart-item-count');
const progressFill = document.getElementById('progress-fill');
const shippingText = document.getElementById('shipping-text');
const checkoutBtn = document.getElementById('checkout-btn');
const searchInput = document.getElementById('search-input');

// Modals
const quickviewModal = document.getElementById('quickview-modal');
const closeModal = document.getElementById('close-modal');
const modalContentInner = document.getElementById('modal-content-inner');
const storeModal = document.getElementById('store-modal');
const openStoreModal = document.getElementById('open-store-modal');
const closeStoreModal = document.getElementById('close-store-modal');

// Renderizar Produtos
function renderProducts(filter = 'all', searchQuery = '') {
    productsGrid.innerHTML = '';
    
    let filtered = products.filter(p => {
        const matchesCategory = filter === 'all' || p.category === filter;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px;">Nenhum produto encontrado.</p>`;
        return;
    }

    filtered.forEach(product => {
        const isWishlisted = wishlist.includes(product.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper">
                <span class="product-tag">${product.tag}</span>
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                    <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <div>
                    <span class="product-category">${formatCategoryName(product.category)}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="product-actions-btn">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-bag-shopping"></i> Comprar
                    </button>
                    <button class="btn-quickview" onclick="openQuickView(${product.id})" title="Visualização Rápida">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

function formatCategoryName(cat) {
    if (cat === 'calcados') return 'Calçados';
    if (cat === 'bolsas') return 'Bolsas';
    if (cat === 'bolsas-couro') return 'Bolsas de Couro';
    return cat;
}

// Filtros de Categoria
document.querySelectorAll('.filter-btn, .nav-links a').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = btn.getAttribute('data-filter');
        if (!filter) return;

        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        
        btn.classList.add('active');
        document.querySelectorAll(`[data-filter="${filter}"]`).forEach(el => el.classList.add('active'));

        renderProducts(filter, searchInput.value);
    });
});

// Pesquisa Dinâmica
searchInput.addEventListener('input', (e) => {
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    renderProducts(activeFilter, e.target.value);
});

// Carrinho de Compras
function addToCart(productId, selectedSize = null) {
    const product = products.find(p => p.id === productId);
    const size = selectedSize || (product.sizes.length > 0 ? product.sizes[0] : 'Único');
    
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, size, qty: 1 });
    }
    
    updateCartUI();
    openCartDrawer();
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let totalCount = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align: center; color: var(--text-light); margin-top: 40px;">Sua sacola está vazia.</p>`;
    } else {
        cart.forEach((item, index) => {
            totalCount += item.qty;
            totalPrice += item.price * item.qty;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')} ${item.size !== 'Único' ? `(Tam: ${item.size})` : ''}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})"><i class="fa-regular fa-trash-can"></i></button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    cartCount.innerText = totalCount;
    cartItemCount.innerText = totalCount;
    cartTotalPrice.innerText = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

    // Progresso Frete Grátis (Meta R$ 250,00)
    const freeShippingGoal = 250.00;
    const progress = Math.min((totalPrice / freeShippingGoal) * 100, 100);
    progressFill.style.width = `${progress}%`;

    if (totalPrice >= freeShippingGoal) {
        shippingText.innerHTML = `Parabéns! Você ganhou <strong>Frete Grátis</strong>!`;
    } else {
        const diff = freeShippingGoal - totalPrice;
        shippingText.innerHTML = `Faltam <strong>R$ ${diff.toFixed(2).replace('.', ',')}</strong> para Frete Grátis`;
    }
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function openCartDrawer() {
    cartDrawer.classList.add('open');
    overlay.classList.add('active');
}

function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    overlay.classList.remove('active');
}

cartBtn.addEventListener('click', openCartDrawer);
closeCart.addEventListener('click', closeCartDrawer);
overlay.addEventListener('click', () => {
    closeCartDrawer();
    quickviewModal.classList.remove('open');
    storeModal.classList.remove('open');
    overlay.classList.remove('active');
});

// Wishlist
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    wishlistCount.innerText = wishlist.length;
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    renderProducts(activeFilter, searchInput.value);
}

// Modal Quick View
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    modalContentInner.innerHTML = `
        <div class="modal-img">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="modal-details">
            <span class="product-category">${formatCategoryName(product.category)}</span>
            <h3>${product.title}</h3>
            <div class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            <p>${product.description}</p>
            <div class="options-group">
                <label>Escolha o Tamanho:</label>
                <div class="size-options">
                    ${product.sizes.map((sz, idx) => `<button class="size-btn ${idx === 0 ? 'selected' : ''}" onclick="selectSize(this)">${sz}</button>`).join('')}
                </div>
            </div>
            <button class="btn-primary" style="width: 100%; background-color: var(--primary); color: #fff; padding: 12px; border-radius: 6px;" onclick="addQuickViewToCart(${product.id})">
                Adicionar à Sacola
            </button>
        </div>
    `;
    quickviewModal.classList.add('open');
    overlay.classList.add('active');
}

function selectSize(btn) {
    btn.parentElement.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

function addQuickViewToCart(productId) {
    const selectedSizeBtn = modalContentInner.querySelector('.size-btn.selected');
    const size = selectedSizeBtn ? selectedSizeBtn.innerText : 'Único';
    addToCart(productId, size);
    quickviewModal.classList.remove('open');
    overlay.classList.remove('active');
}

closeModal.addEventListener('click', () => {
    quickviewModal.classList.remove('open');
    overlay.classList.remove('active');
});

// Modal Localização
openStoreModal.addEventListener('click', (e) => {
    e.preventDefault();
    storeModal.classList.add('open');
    overlay.classList.add('active');
});

closeStoreModal.addEventListener('click', () => {
    storeModal.classList.remove('open');
    overlay.classList.remove('active');
});

// Checkout WhatsApp e Histórico de Pedidos
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Sua sacola está vazia!');
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
    });

    // Salvar no histórico de pedidos do Admin
    const newOrder = {
        date: new Date().toLocaleString('pt-BR'),
        items: [...cart],
        total: total
    };

    let orders = JSON.parse(localStorage.getItem('dimaap_orders')) || [];
    orders.push(newOrder);
    localStorage.setItem('dimaap_orders', JSON.stringify(orders));

    // Montar mensagem para o WhatsApp
    let message = "Olá! Gostaria de finalizar o meu pedido na Dimaap Calçados:%0A%0A";
    cart.forEach(item => {
        let subtotal = item.price * item.qty;
        message += `- ${item.qty}x ${item.title} ${item.size !== 'Único' ? `(Tam: ${item.size})` : ''} - R$ ${subtotal.toFixed(2).replace('.', ',')}%0A`;
    });

    message += `%0A*Total do Pedido: R$ ${total.toFixed(2).replace('.', ',')}*%0A%0AAguardo instruções para pagamento e entrega!`;

    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
});
// Inicializar Catálogo
renderProducts();