// ─── STATE ────────────────────────────────────────────────────────────────
let currentCategory = 'home';
let cart = [];

// ─── DOM REFS ─────────────────────────────────────────────────────────────
const itemsGrid              = document.getElementById('itemsGrid');
const homeContainer          = document.getElementById('homeContainer');
const cartItemsContainer     = document.getElementById('cartItems');
const materialsListContainer = document.getElementById('materialsList');
const costTotalEl            = document.getElementById('costTotal');
const sellTotalEl            = document.getElementById('sellTotal');
const categoryBtns           = document.querySelectorAll('.category-btn');
const searchInput            = document.getElementById('searchInput');
const clearCartBtn           = document.getElementById('clearCartBtn');
const cartBadge              = document.getElementById('cartBadge');
const floatingCartBtn        = document.getElementById('floatingCartBtn');
const floatingCartBadge      = document.getElementById('floatingCartBadge');
const categoryTitle          = document.getElementById('categoryTitle');
const categorySubtitle       = document.getElementById('categorySubtitle');

// ─── IMAGE MAP (local icons folder) ───────────────────────────────────────
const imageMap = {
    // Components
    'ecu':                      'icones/ecu.png',
    'brake_kit':                'icones/kitfreio.png',
    'air_filter':               'icones/filtrodear.png',
    'sport_exhaust':            'icones/escapamento.png',
    'big_turbo':                'icones/turbina.png',
    'intercooler':              'icones/intercooler.png',
    'suspension_5':             'icones/suspensao.png',
    'racing_clutch':            'icones/embreagem.png',
    'intake_manifold':          'icones/coletor.png',
    'fuel_system':              'icones/combustivel.png',
    // Services
    'refil_nitro':              'icones/nitro.png',
    'repair_ecu':               'icones/ecu.png',
    'repair_filter':            'icones/filtrodear.png',
    'repair_intercooler':       'icones/intercooler.png',
    'repair_coletor':           'icones/coletor.png',
    'repair_bomba_combustivel': 'icones/combustivel.png',
    'repair_turbo':             'icones/turbina.png',
    'repair_exaustor':          'icones/escapamento.png',
    'repair_clutch':            'icones/embreagem.png',
    'repair_brake':             'icones/kitfreio.png',
    'repair_suspension':        'icones/suspensao.png',
    'repair_engine':            'icones/reparomotor.png',
    'repair_lataria':           'icones/sucata.png',
    'repair_generic_parts':     'icones/coletor.png',
    // Products
    'lockpick':                 'icones/lockpick.png',
    'advanced_lockpick':        'icones/lockpickavançada.png',
    'garrafa_nitro_grande':     'icones/nitro.png',
    'racing_seatbelt':          'icones/cintodecorrida.png',
};

// Material icons
const materialImageMap = {
    'refined_aluminum': 'icones/aluminio.png',
    'refined_rubber':   'icones/borracha.png',
    'refined_copper':   'icones/cobre.png',
    'refined_plastic':  'icones/plastico.png',
    'refined_scrap':    'icones/sucata.png',
};

const categoryMeta = {
    home:       { title: 'Início',                 subtitle: 'Painel de controle e serviços rápidos' },
    components: { title: 'Stages',                 subtitle: 'Componentes de performance para seu veículo' },
    services:   { title: 'Serviços de Oficina',    subtitle: 'Reparos e manutenções especializadas' },
    products:   { title: 'Produtos & Acessórios',  subtitle: 'Itens e acessórios disponíveis na loja' }
};

// ─── HELPERS ──────────────────────────────────────────────────────────────
function getItemsForCategory(category) {
    if (category === 'components') return components;
    if (category === 'services')   return services;
    if (category === 'products')   return products;
    return [];
}

function formatCurrency(value) {
    return '$' + value.toLocaleString('pt-BR');
}

// Build the icon/image HTML for an item
function getItemIconHtml(item) {
    const src = imageMap[item.id];
    if (src) {
        return `<img src="${src}" alt="${item.name}" class="item-img" onerror="this.parentElement.innerHTML='<i class=\\'fa-solid fa-box\\'></i>'">`;
    }
    return `<i class="fa-solid fa-box"></i>`;
}

// ─── RENDER STAGE BUTTONS (only for components) ───────────────────────────
function renderStageButtons() {
    const container = document.getElementById('stageButtonsContainer');
    if (!container) return;

    if (currentCategory !== 'components') {
        container.innerHTML = '';
        return;
    }

    const stages = [1, 2, 3];
    container.innerHTML = stages.map(stage => {
        const stageItems = components.filter(c => c.stage === stage);
        const totalPrice = stageItems.reduce((acc, i) => acc + (i.sellPrice || 0), 0);
        return `
            <button class="stage-bundle-btn" onclick="addStageToCart(${stage})" id="stage-btn-${stage}">
                <span class="stage-btn-label">
                    <i class="fa-solid fa-layer-group"></i>
                    Stage ${stage}
                </span>
                <span class="stage-btn-info">${stageItems.length} peças · ${formatCurrency(totalPrice)}</span>
            </button>
        `;
    }).join('');
}

// ─── ADD ENTIRE STAGE TO CART ─────────────────────────────────────────────
window.addStageToCart = function(stage) {
    const stageItems = components.filter(c => c.stage === stage);
    stageItems.forEach(item => {
        const existing = cart.find(c => c.id === item.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1, type: 'components' });
        }
    });
    updateCart();

    // Visual feedback on button
    const btn = document.getElementById(`stage-btn-${stage}`);
    if (btn) {
        btn.classList.add('stage-btn-added');
        const label = btn.querySelector('.stage-btn-label');
        const orig = label.innerHTML;
        label.innerHTML = `<i class="fa-solid fa-check"></i> Adicionado!`;
        setTimeout(() => {
            btn.classList.remove('stage-btn-added');
            label.innerHTML = orig;
        }, 1200);
    }
};

// ─── RENDER HOME SCREEN ───────────────────────────────────────────────────
function renderHomeScreen() {
    if (!homeContainer) return;

    // Calculate totals for stats
    let totalSell = 0;
    let totalCost = 0;
    let totalQty = 0;
    let materialCount = {};

    cart.forEach(item => {
        totalQty += item.qty;
        const price = item.sellPrice || item.price || 0;
        totalSell += price * item.qty;

        if (item.ingredients) {
            item.ingredients.forEach(ing => {
                if (!materialCount[ing.id]) materialCount[ing.id] = 0;
                materialCount[ing.id] += ing.quantity * item.qty;
            });
        }
    });

    Object.keys(materialCount).forEach(matId => {
        const matDef = materials.find(m => m.id === matId);
        if (matDef) {
            totalCost += matDef.price * materialCount[matId];
        }
    });

    const netProfit = totalSell - totalCost;

    // Quick services list
    const quickServicesIds = ['repair_lataria', 'repair_engine', 'refil_nitro', 'repair_generic_parts'];
    const quickServiceIcons = {
        'repair_lataria': 'fa-solid fa-car-burst',
        'repair_engine': 'fa-solid fa-gears',
        'refil_nitro': 'fa-solid fa-gauge-high',
        'repair_generic_parts': 'fa-solid fa-wrench'
    };

    const quickServicesHtml = quickServicesIds.map(id => {
        const service = services.find(s => s.id === id);
        if (!service) return '';

        const src = imageMap[id];
        const iconHtml = src
            ? `<img src="${src}" alt="${service.name}" onerror="this.outerHTML='<i class=\\'${quickServiceIcons[id]}\\'></i>'">`
            : `<i class="${quickServiceIcons[id]}"></i>`;

        const hasMaterials = service.ingredients && service.ingredients.length > 0;
        const materialsHtml = hasMaterials
            ? `
                <div class="quick-service-materials">
                    <div class="quick-service-materials-title">Materiais Requeridos</div>
                    ${service.ingredients.map(ing => {
                        const matDef = materials.find(m => m.id === ing.id);
                        const name = matDef ? matDef.name : ing.id;
                        return `
                            <div class="quick-service-material-item">
                                <span>${name}</span>
                                <span>${ing.quantity}x</span>
                            </div>
                        `;
                    }).join('')}
                </div>`
            : '';

        return `
            <div class="quick-service-card" onclick="addToCart('${service.id}', 'home')" style="cursor:pointer;" title="Adicionar Serviço">
                <div class="quick-service-header">
                    <div class="quick-service-icon">
                        ${iconHtml}
                    </div>
                    <div class="quick-service-info">
                        <h4>${service.name}</h4>
                        <div class="quick-service-price">${formatCurrency(service.price)}</div>
                    </div>
                </div>
                ${materialsHtml}
                <button class="quick-service-btn" id="qs-btn-${service.id}" style="pointer-events: none;">
                    <i class="fa-solid fa-plus"></i> Adicionar Serviço
                </button>
            </div>
        `;
    }).join('');

    homeContainer.innerHTML = `
        <div class="home-hero">
            <h1>RE<span>:</span>Motion Performance Shop</h1>
            <p>Selecione um dos serviços rápidos abaixo para adicioná-lo diretamente à ordem de serviço, ou use o menu lateral esquerdo para gerenciar stages, outros serviços e acessórios.</p>
        </div>

        <div>
            <div class="home-section-header">
                <h3>Serviços Rápidos</h3>
            </div>
            <div class="quick-services-grid">
                ${quickServicesHtml}
            </div>
        </div>

        <div>
            <div class="home-section-header">
                <h3>Resumo da Sessão</h3>
            </div>
            <div class="home-stats-row">
                <div class="home-stat-card">
                    <div class="home-stat-card-left">
                        <span class="home-stat-label">Itens Selecionados</span>
                        <span class="home-stat-value">${totalQty}</span>
                    </div>
                    <div class="home-stat-icon">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </div>
                </div>
                <div class="home-stat-card">
                    <div class="home-stat-card-left">
                        <span class="home-stat-label">Custo Estimado</span>
                        <span class="home-stat-value">${formatCurrency(totalCost)}</span>
                    </div>
                    <div class="home-stat-icon">
                        <i class="fa-solid fa-wallet"></i>
                    </div>
                </div>
                <div class="home-stat-card">
                    <div class="home-stat-card-left">
                        <span class="home-stat-label">Lucro Bruto</span>
                        <span class="home-stat-value success">${formatCurrency(totalSell)}</span>
                    </div>
                    <div class="home-stat-icon">
                        <i class="fa-solid fa-dollar-sign"></i>
                    </div>
                </div>
                <div class="home-stat-card">
                    <div class="home-stat-card-left">
                        <span class="home-stat-label">Lucro Líquido</span>
                        <span class="home-stat-value success">${formatCurrency(netProfit)}</span>
                    </div>
                    <div class="home-stat-icon">
                        <i class="fa-solid fa-chart-line"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ─── RENDER ITEMS ─────────────────────────────────────────────────────────
function renderItems(searchTerm = '') {
    const stageButtonsContainer = document.getElementById('stageButtonsContainer');
    const searchBar = document.querySelector('.search-bar');

    if (currentCategory === 'home') {
        itemsGrid.style.display = 'none';
        homeContainer.style.display = 'flex';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        if (searchBar) searchBar.style.display = 'none';
        renderHomeScreen();
        return;
    } else {
        itemsGrid.style.display = 'grid';
        homeContainer.style.display = 'none';
        if (stageButtonsContainer) stageButtonsContainer.style.display = currentCategory === 'components' ? 'flex' : 'none';
        if (searchBar) searchBar.style.display = 'flex';
    }

    const items = getItemsForCategory(currentCategory);
    itemsGrid.innerHTML = '';

    renderStageButtons();

    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
        itemsGrid.innerHTML = `
            <p style="color:var(--white-dim);grid-column:1/-1;text-align:center;padding:40px 0;">
                <i class="fa-solid fa-magnifying-glass" style="opacity:0.3;font-size:2rem;display:block;margin-bottom:10px;"></i>
                Nenhum item encontrado.
            </p>`;
        return;
    }

    filtered.forEach(item => {
        const price     = item.sellPrice || item.price || 0;
        const stageText = item.stage ? `Stage ${item.stage}` : '';

        // Generate ingredients HTML for this item
        const hasMaterials = item.ingredients && item.ingredients.length > 0;
        const materialsHtml = hasMaterials
            ? `
                <div class="quick-service-materials">
                    <div class="quick-service-materials-title">Materiais Requeridos</div>
                    ${item.ingredients.map(ing => {
                        const matDef = materials.find(m => m.id === ing.id);
                        const name = matDef ? matDef.name : ing.id;
                        return `
                            <div class="quick-service-material-item">
                                <span>${name}</span>
                                <span>${ing.quantity}x</span>
                            </div>
                        `;
                    }).join('')}
                </div>`
            : '';

        const card = document.createElement('div');
        card.className = 'quick-service-card';
        card.setAttribute('data-id', item.id);
        card.setAttribute('onclick', `addToCart('${item.id}', '${currentCategory}')`);
        card.style.cursor = 'pointer';
        card.setAttribute('title', 'Adicionar ao carrinho');
        card.innerHTML = `
            ${stageText ? `<div class="item-stage" style="top: 8px; right: 8px;">Stage ${item.stage}</div>` : ''}
            <div class="quick-service-header">
                <div class="quick-service-icon">
                    ${getItemIconHtml(item)}
                </div>
                <div class="quick-service-info">
                    <h4>${item.name}</h4>
                    <div class="quick-service-price">${formatCurrency(price)}</div>
                </div>
            </div>
            ${materialsHtml}
            <button class="quick-service-btn" id="qs-btn-${item.id}" style="pointer-events: none;">
                <i class="fa-solid fa-plus"></i> Adicionar
            </button>
        `;
        itemsGrid.appendChild(card);
    });
}

// ─── CART LOGIC ───────────────────────────────────────────────────────────
window.addToCart = function(itemId, category) {
    const actualCategory = (category === 'home') ? 'services' : category;
    const items = getItemsForCategory(actualCategory);
    const item  = items.find(i => i.id === itemId);

    if (item) {
        const existing = cart.find(c => c.id === item.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1, type: actualCategory });
        }
        updateCart();

        // 1. Feedback visual no card (borda verde + glow)
        const card = document.querySelector(`[data-id="${itemId}"]`);
        if (card) {
            card.style.borderColor = 'var(--success)';
            card.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.35)';
            setTimeout(() => {
                card.style.borderColor = '';
                card.style.boxShadow = '';
            }, 1000);
        }

        // 2. Feedback no botão do card
        const qsBtn = document.getElementById(`qs-btn-${itemId}`);
        if (qsBtn) {
            qsBtn.classList.add('added');
            const origHTML = qsBtn.innerHTML;
            qsBtn.innerHTML = '<i class="fa-solid fa-check"></i> Adicionado!';
            setTimeout(() => {
                qsBtn.classList.remove('added');
                qsBtn.innerHTML = origHTML;
            }, 1000);
        }
    }
};

window.removeFromCart = function(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
};

window.updateQty = function(itemId, delta) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) removeFromCart(itemId);
        else updateCart();
    }
};

function clearCart() {
    cart = [];
    updateCart();
}

function updateCart() {
    renderCartItems();
    calculateTotals();
    const totalQty = cart.reduce((acc, i) => acc + i.qty, 0);
    cartBadge.textContent = totalQty;
    cartBadge.style.display = totalQty > 0 ? 'inline-block' : 'none';
    if (floatingCartBadge) {
        floatingCartBadge.textContent = totalQty;
    }
    if (currentCategory === 'home') {
        renderHomeScreen();
    }
}

// ─── RENDER CART ──────────────────────────────────────────────────────────
function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Nenhum item selecionado</p>
            </div>`;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => {
        const price  = item.sellPrice || item.price || 0;
        const imgSrc = imageMap[item.id];
        const imgHtml = imgSrc
            ? `<img src="${imgSrc}" alt="${item.name}" class="cart-item-img">`
            : `<i class="fa-solid fa-box" style="color:var(--red-primary)"></i>`;
        return `
            <div class="cart-item">
                <div class="cart-item-icon">${imgHtml}</div>
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${formatCurrency(price)} × ${item.qty}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQty('${item.id}', -1)">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="qty-display">${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty('${item.id}', 1)">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>`;
    }).join('');
}

// ─── CALCULATE TOTALS ─────────────────────────────────────────────────────
function calculateTotals() {
    let totalSell     = 0;
    let totalCost     = 0;
    let materialCount = {};

    cart.forEach(item => {
        const price = item.sellPrice || item.price || 0;
        totalSell += price * item.qty;

        if (item.ingredients) {
            item.ingredients.forEach(ing => {
                if (!materialCount[ing.id]) materialCount[ing.id] = 0;
                materialCount[ing.id] += ing.quantity * item.qty;
            });
        }
    });

    materialsListContainer.innerHTML = '';
    const matKeys = Object.keys(materialCount);

    if (matKeys.length === 0) {
        materialsListContainer.innerHTML = '<span class="text-muted">Nenhum material necessário</span>';
    } else {
        matKeys.forEach(matId => {
            const matDef  = materials.find(m => m.id === matId);
            if (matDef) {
                totalCost += matDef.price * materialCount[matId];
                const matImg = materialImageMap[matId];
                const matImgHtml = matImg
                    ? `<img src="${matImg}" alt="${matDef.name}" class="mat-icon">`
                    : '';
                materialsListContainer.innerHTML += `
                    <div class="material-item">
                        <span class="mat-name">${matImgHtml}${matDef.name}</span>
                        <span class="material-qty">${materialCount[matId]}x</span>
                    </div>`;
            }
        });
    }

    costTotalEl.textContent = formatCurrency(totalCost);
    sellTotalEl.textContent = formatCurrency(totalSell);
}

// ─── EVENT LISTENERS ──────────────────────────────────────────────────────
categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentCategory = e.currentTarget.dataset.category;
        searchInput.value = '';

        const meta = categoryMeta[currentCategory];
        categoryTitle.textContent    = meta.title;
        categorySubtitle.textContent = meta.subtitle;

        renderItems();
    });
});

searchInput.addEventListener('input', (e) => renderItems(e.target.value));
clearCartBtn.addEventListener('click', clearCart);

if (floatingCartBtn) {
    floatingCartBtn.addEventListener('click', () => {
        const cartPanel = document.querySelector('.cart-panel');
        if (cartPanel) {
            cartPanel.scrollIntoView({ behavior: 'smooth' });
        }
    });
}



// ─── INIT ─────────────────────────────────────────────────────────────────
updateCart();
renderItems();
