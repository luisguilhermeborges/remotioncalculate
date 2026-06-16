const localStorage = window.safeStorage || window.localStorage;

// ─── STATE ────────────────────────────────────────────────────────────────
let currentCategory = 'home';
let currentSubCategory = 'list'; // Subcategories (e.g., 'list'/'roles' for members, or illegal sub-tabs)
let currentLoggedInMember = null; // Storing the authenticated general member session
let cart = [];

// Lives Viewer state variables
let currentLivePlatformFilter = 'all';
let activeLiveStreamMemberId = null;
let livesSchedules = [];

// Active collections fetched from DB/LocalStorage
let activeComponents = [];
let activeServices = [];
let activeProducts = [];
let activeMaterials = [];
let activeMural = [];
let activeMembers = [];
let activeRoles = [];
let activeVaultLogs = [];
let activeIllegalRecords = [];
let activeImpoundedCars = [];
let activeIllegalRecipes = [];

// Session-specific locks
let isVaultUnlocked = false;
let isIllegalUnlocked = false;
let currentIllegalMember = null; // Storing the authenticated illegal member

// ─── DOM REFS ─────────────────────────────────────────────────────────────
const itemsGrid              = document.getElementById('itemsGrid');
const homeContainer          = document.getElementById('homeContainer');
const cartItemsContainer     = document.getElementById('cartItems');
const materialsListContainer = document.getElementById('materialsList');
const costTotalEl            = document.getElementById('costTotal');
const sellTotalEl            = document.getElementById('sellTotal');
const categoryBtns           = document.querySelectorAll('.category-btn[data-category]');
const searchInput            = document.getElementById('searchInput');
const clearCartBtn           = document.getElementById('clearCartBtn');
const cartBadge              = document.getElementById('cartBadge');
const floatingCartBtn        = document.getElementById('floatingCartBtn');
const floatingCartBadge      = document.getElementById('floatingCartBadge');
const categoryTitle          = document.getElementById('categoryTitle');
const categorySubtitle       = document.getElementById('categorySubtitle');

// Sub-nav container
const subCategoryTabsContainer = document.getElementById('subCategoryTabsContainer');

// Admin, Modals and Forms
const btnLoginToggle         = document.getElementById('btnLoginToggle');
const btnToggleIllegal       = document.getElementById('btnToggleIllegal');
const btnManageMaterials     = document.getElementById('btn-manage-materials');
const adminDivider           = document.getElementById('adminDivider');
const addNewItemBtn          = document.getElementById('addNewItemBtn');
const editCurrentBtn         = document.getElementById('editCurrentBtn');
const dbStatusBadge          = document.getElementById('dbStatusBadge');

const modalLogin             = document.getElementById('modalLogin');
const modalConfig            = document.getElementById('modalConfig');
const modalItemEdit          = document.getElementById('modalItemEdit');
const modalMuralPost         = document.getElementById('modalMuralPost');
const modalMaterialsManager  = document.getElementById('modalMaterialsManager');
const modalEditSelector      = document.getElementById('modalEditSelector');
const formEditSelector       = document.getElementById('formEditSelector');
const editSelectorSelect     = document.getElementById('editSelectorSelect');
const editSelectorLabel      = document.getElementById('editSelectorLabel');
const modalMemberEdit        = document.getElementById('modalMemberEdit');
const modalRoleEdit          = document.getElementById('modalRoleEdit');
const modalVaultAuth         = document.getElementById('modalVaultAuth');
const modalVaultChangePassword = document.getElementById('modalVaultChangePassword');
const modalVaultLog          = document.getElementById('modalVaultLog');
const modalIllegalAuth       = document.getElementById('modalIllegalAuth');
const modalImpoundedCar      = document.getElementById('modalImpoundedCar');
const modalActionReport      = document.getElementById('modalActionReport');
const modalEscapeCard        = document.getElementById('modalEscapeCard');
const modalActionPreset      = document.getElementById('modalActionPreset');
const modalScheduleLive      = document.getElementById('modalScheduleLive');

const formLogin              = document.getElementById('formLogin');
const formItemEdit           = document.getElementById('formItemEdit');
const formMuralPost          = document.getElementById('formMuralPost');
const formMaterialsManager   = document.getElementById('formMaterialsManager');
const formMemberEdit         = document.getElementById('formMemberEdit');
const formRoleEdit           = document.getElementById('formRoleEdit');
const formVaultAuth          = document.getElementById('formVaultAuth');
const formVaultChangePassword = document.getElementById('formVaultChangePassword');
const formVaultLog           = document.getElementById('formVaultLog');
const formIllegalAuth        = document.getElementById('formIllegalAuth');
const formImpoundedCar       = document.getElementById('formImpoundedCar');
const formActionReport       = document.getElementById('formActionReport');
const formEscapeCard         = document.getElementById('formEscapeCard');
const formActionPreset       = document.getElementById('formActionPreset');

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

const iconLabels = {
    'ecu':                      'ECU / Eletrônica',
    'brake_kit':                'Kit de Freio',
    'air_filter':               'Filtro de Ar',
    'sport_exhaust':            'Escapamento',
    'big_turbo':                'Turbina / Turbo',
    'intercooler':              'Intercooler',
    'suspension_5':             'Suspensão',
    'racing_clutch':            'Embreagem',
    'intake_manifold':          'Coletor de Admissão',
    'fuel_system':              'Combustível / Bomba',
    'refil_nitro':              'Garrafa de Nitro',
    'lockpick':                 'Lockpick Simples',
    'advanced_lockpick':        'Lockpick Avançado',
    'racing_seatbelt':          'Cinto de Corrida',
    'repair_engine':            'Ícone Motor',
    'repair_lataria':           'Ícone Sucata / Lataria',
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
    home:               { title: 'Início',                       subtitle: 'Painel de controle e mural de avisos' },
    components:         { title: 'Stages',                       subtitle: 'Componentes de performance para seu veículo' },
    services:           { title: 'Serviços de Oficina',          subtitle: 'Reparos e manutenções especializadas' },
    products:           { title: 'Produtos & Acessórios',        subtitle: 'Itens e acessórios disponíveis na loja' },
    members:            { title: 'Membros & Ranks',              subtitle: 'Gestão de membros e cargos da organização' },
    hierarchy:          { title: 'Hierarquia',                   subtitle: 'Estrutura organizacional da RE:Motion Chefiados' },
    vault:              { title: 'Baú',                          subtitle: 'Depósito e histórico de materiais' },
    'illegal-recipes':   { title: 'Produtos Ilicítos',            subtitle: 'Receitas de fabricação de itens ilegais' },
    'illegal-actions':   { title: 'Ações Disponíveis',            subtitle: 'Planejamento e início de ações da facção' },
    'illegal-hierarchy': { title: 'Hierarquia Ilegal',            subtitle: 'Estrutura de comando do crime organizado' },
    'illegal-boosting':  { title: 'Boosting & Fuga',              subtitle: 'Informações de bypass e bloqueios ativos' },
    'illegal-cars':      { title: 'Carros Detidos',              subtitle: 'Cadastro de veículos apreendidos' },
    'illegal-mural':     { title: 'Mural Ilegal',                 subtitle: 'Avisos e comunicados da facção' },
    lives:               { title: 'Lives do Pessoal',             subtitle: 'Assista às transmissões ao vivo da equipe' },
    'illegal-lives':     { title: 'Transmissões da Facção',        subtitle: 'Canais de live ativos dos membros' }
};

// ─── DATA SYNC & FLOW ─────────────────────────────────────────────────────

async function loadData() {
    updateStatusBadge('loading');
    try {
        activeMaterials = await db.getMaterials();
        
        const dbItems = await db.getItems();
        activeComponents = dbItems.components;
        activeServices = dbItems.services;
        activeProducts = dbItems.products;

        activeMural = await db.getMural();
        activeMembers = await db.getMembers();
        activeRoles = await db.getRoles();
        activeVaultLogs = await db.getVaultLogs();
        activeIllegalRecords = await db.getIllegalRecords();
        activeImpoundedCars = await db.getImpoundedCars();
        activeIllegalRecipes = await db.getIllegalRecipes();

        if (db.isConnected()) {
            updateStatusBadge('online');
            const importBtn = document.getElementById('btnImportLocalData');
            if (importBtn) {
                if (activeMaterials.length <= 6 && activeComponents.length === 0) {
                    importBtn.style.display = 'block';
                } else {
                    importBtn.style.display = 'none';
                }
            }
        } else {
            updateStatusBadge('local');
        }
    } catch (err) {
        console.error("Failed loading from DB, using fallback data.js:", err);
        activeMaterials = typeof materials !== 'undefined' ? [...materials] : [];
        activeComponents = typeof components !== 'undefined' ? [...components] : [];
        activeServices = typeof services !== 'undefined' ? [...services] : [];
        activeProducts = typeof products !== 'undefined' ? [...products] : [];
        activeMembers = JSON.parse((window.safeStorage || window.localStorage).getItem('members_local') || '[]');
        activeRoles = JSON.parse((window.safeStorage || window.localStorage).getItem('roles_local') || '[]');
        activeVaultLogs = JSON.parse((window.safeStorage || window.localStorage).getItem('vault_logs_local') || '[]');
        activeIllegalRecords = JSON.parse((window.safeStorage || window.localStorage).getItem('illegal_records_local') || '[]');
        activeImpoundedCars = JSON.parse((window.safeStorage || window.localStorage).getItem('impounded_cars_local') || '[]');
        activeIllegalRecipes = JSON.parse((window.safeStorage || window.localStorage).getItem('illegal_recipes_local') || '[]');
        updateStatusBadge('local');
    }

    // Clean up duplicate Ryan Parker (456)
    let ryanSyncChanged = false;
    const duplicates = activeMembers.filter(m => m.passport === '456' || m.id === 'mem_ryan_001');
    if (duplicates.length > 0) {
        ryanSyncChanged = true;
        for (const dup of duplicates) {
            await db.deleteMember(dup.id);
        }
        activeMembers = activeMembers.filter(m => m.passport !== '456' && m.id !== 'mem_ryan_001');
    }
    
    // Find the main Ryan Parker (M0061) and assign his stream links
    const mainRyan = activeMembers.find(m => m.passport === 'M0061' || m.name === 'Ryan Parker');
    if (mainRyan && (!mainRyan.youtubeUrl || !mainRyan.kickUrl || mainRyan.name === 'Ryan' || mainRyan.liveUrl !== 'https://www.twitch.tv/v1xenbeast')) {
        mainRyan.name = 'Ryan Parker';
        mainRyan.liveUrl = 'https://www.twitch.tv/v1xenbeast';
        mainRyan.youtubeUrl = 'https://www.youtube.com/@v1xenbeast';
        mainRyan.kickUrl = 'https://kick.com/v1xenbeast';
        await db.saveMember(mainRyan);
        ryanSyncChanged = true;
    }
    
    if (ryanSyncChanged) {
        // reload members list
        activeMembers = await db.getMembers();
    }

    updateCart();
    renderItems();
}

function updateStatusBadge(status) {
    if (!dbStatusBadge) return;
    dbStatusBadge.className = 'status-badge';
    const dot = dbStatusBadge.querySelector('.status-dot');
    const text = dbStatusBadge.querySelector('.status-text');

    if (status === 'loading') {
        dbStatusBadge.classList.add('status-local');
        text.textContent = 'Carregando...';
    } else if (status === 'online') {
        dbStatusBadge.classList.add('status-online');
        text.textContent = 'Supabase Online';
    } else {
        dbStatusBadge.classList.add('status-local');
        text.textContent = 'Modo Local';
    }

    if (db.isAdminLoggedIn()) {
        dbStatusBadge.style.cursor = 'pointer';
        dbStatusBadge.title = 'Configurar Supabase';
    } else {
        dbStatusBadge.style.cursor = 'default';
        dbStatusBadge.removeAttribute('title');
    }
}

// ─── PERMISSION CHECK ─────────────────────────────────────────────────────
function getMemberHighestRole(member) {
    if (!member || !member.role) return 'Estagiario';
    const roles = member.role.split(',').map(r => r.trim().toLowerCase());
    const legalOrder = ['ceo', 'vice presidente', 'gerente', 'mecanico senior', 'mecanico pleno', 'mecanico junior', 'estagiario'];
    for (const r of legalOrder) {
        if (roles.includes(r)) {
            const found = activeRoles.find(ar => ar.name.toLowerCase() === r);
            return found ? found.name : (r.charAt(0).toUpperCase() + r.slice(1));
        }
    }
    return 'Estagiario';
}

function getMemberHighestIllegalRole(member) {
    if (!member || !member.illegalRole) return 'Membro';
    const roles = member.illegalRole.split(',').map(r => r.trim().toLowerCase());
    const illegalOrder = ['01', 'gerente', 'corredor', 'membro', 'probatorio'];
    for (const r of illegalOrder) {
        if (roles.includes(r)) {
            if (r === '01') return '01';
            if (r === 'gerente') return 'Gerente';
            if (r === 'corredor') return 'Corredor';
            if (r === 'membro') return 'Membro';
            if (r === 'probatorio') return 'Probatorio';
            return r.charAt(0).toUpperCase() + r.slice(1);
        }
    }
    return 'Membro';
}

function hasPermission(permissionName) {
    // Admin bypass
    if (db.isAdminLoggedIn()) return true;

    // Check active member session
    const activeUser = currentLoggedInMember || (isIllegalUnlocked ? currentIllegalMember : null);
    if (activeUser) {
        const userRoles = activeUser.role ? activeUser.role.split(',').map(r => r.trim().toLowerCase()) : [];
        const illegalRoles = activeUser.illegalRole ? activeUser.illegalRole.split(',').map(r => r.trim().toLowerCase()) : [];

        // Master overrides for high ranks
        if (userRoles.includes('gerente') || 
            userRoles.includes('ceo') || 
            userRoles.includes('vice presidente') || 
            userRoles.includes('owner') || 
            illegalRoles.includes('01') || 
            illegalRoles.includes('gerente')) {
            return true;
        }

        // Check permissions for all legal roles
        for (const roleName of userRoles) {
            const role = activeRoles.find(r => r.name.toLowerCase() === roleName);
            if (role && role.permissions && role.permissions.includes(permissionName)) {
                return true;
            }
        }
    }
    return false;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────
function getItemsForCategory(category) {
    if (category === 'components') return activeComponents;
    if (category === 'services')   return activeServices;
    if (category === 'products')   return activeProducts;
    if (category === 'illegal-recipes') return activeIllegalRecipes;
    return [];
}

function formatCurrency(value) {
    return '$' + value.toLocaleString('pt-BR');
}

function getItemIconHtml(item) {
    const src = imageMap[item.id] || imageMap[item.image];
    if (src) {
        return `<img src="${src}" alt="${item.name}" class="item-img" onerror="this.parentElement.innerHTML='<i class=\\'fa-solid fa-box\\'></i>'">`;
    }
    return `<i class="fa-solid fa-box"></i>`;
}

// ─── RENDER STAGE BUTTONS ─────────────────────────────────────────────────
function renderStageButtons() {
    const container = document.getElementById('stageButtonsContainer');
    if (!container) return;

    if (currentCategory !== 'components') {
        container.innerHTML = '';
        return;
    }

    const stages = [1, 2, 3];
    container.innerHTML = stages.map(stage => {
        const stageItems = activeComponents.filter(c => c.stage === stage);
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

window.addStageToCart = function(stage) {
    const stageItems = activeComponents.filter(c => c.stage === stage);
    stageItems.forEach(item => {
        const existing = cart.find(c => c.id === item.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1, type: 'components' });
        }
    });
    updateCart();

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

// ─── RENDER ILLEGAL MURAL SCREEN ──────────────────────────────────────────
function renderIllegalMuralScreen() {
    itemsGrid.style.display = 'block';
    homeContainer.style.display = 'none';

    const illegalPosts = activeMural.filter(post => post.tag && post.tag.startsWith('[ILEGAL]'));
    const canPost = db.isAdminLoggedIn() || (currentLoggedInMember && currentLoggedInMember.flagIlegal);
    
    let muralHtml = '';
    if (illegalPosts.length === 0) {
        muralHtml = `
            <div class="empty-cart-msg" style="margin:20px 0; grid-column: 1/-1;">
                <i class="fa-solid fa-bullhorn" style="font-size:1.8rem; color:#f59e0b;"></i>
                <p>Nenhum aviso publicado no mural ilegal.</p>
            </div>`;
    } else {
        muralHtml = illegalPosts.map(post => {
            const dateStr = new Date(post.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            const cleanTag = post.tag.replace('[ILEGAL]', '').trim();
            const cardClass = cleanTag ? `${cleanTag.toLowerCase()}-card` : 'aviso-card';
            const badgeClass = cleanTag ? `tag-${cleanTag.toLowerCase()}` : 'tag-aviso';
            
            return `
                <div class="mural-card ${cardClass}" style="border-left-color:#f59e0b;">
                    <div class="mural-card-top">
                        <div class="mural-title-block">
                            <span class="mural-badge ${badgeClass}" style="background:#f59e0b; color:black; font-weight:bold;">${cleanTag}</span>
                            <h4 class="mural-title-text">${post.title}</h4>
                        </div>
                        <div class="mural-date">${dateStr}</div>
                    </div>
                    <p class="mural-body-text">${post.content}</p>
                    <div class="mural-card-footer">
                        <span class="mural-author-tag">Publicado por: ${post.author}</span>
                        ${canPost ? `
                            <button class="btn-delete-post" onclick="event.stopPropagation(); deleteMuralPost('${post.id}')" title="Excluir Aviso" style="color:#f59e0b;">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>`;
        }).join('');
    }

    itemsGrid.innerHTML = `
        <div class="mural-section" style="margin-bottom: 24px; grid-column: 1/-1; width:100%;">
            <div class="mural-header-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                <h3 style="color:#f59e0b; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-bullhorn"></i> Mural Ilegal</h3>
                ${canPost ? `
                    <button class="action-btn" id="btnOpenNewMural" onclick="openMuralModal()" style="background:rgba(245,158,11,0.08); border-color:rgba(245,158,11,0.25); color:#f59e0b; padding:6px 12px; font-weight:600;">
                        <i class="fa-solid fa-plus"></i> Novo Aviso Ilegal
                    </button>
                ` : ''}
            </div>
            <div class="mural-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:20px;">
                ${muralHtml}
            </div>
        </div>
    `;
}

// ─── STREAMING HELPERS & PLATFORM DETECTORS ────────────────────────────────
function detectPlatform(url) {
    if (!url) return 'outros';
    const cleanUrl = url.toLowerCase();
    if (cleanUrl.includes('twitch.tv')) return 'twitch';
    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) return 'youtube';
    if (cleanUrl.includes('kick.com')) return 'kick';
    if (cleanUrl.includes('tiktok.com')) return 'tiktok';
    return 'outros';
}

function getChannelName(url, platform) {
    if (!url) return '';
    try {
        const cleanUrl = url.trim().replace(/\/$/, '');
        if (platform === 'twitch') {
            const match = cleanUrl.match(/twitch\.tv\/([a-zA-Z0-9_]+)/i);
            return match ? match[1] : '';
        }
        if (platform === 'kick') {
            const match = cleanUrl.match(/kick\.com\/([a-zA-Z0-9_]+)/i);
            return match ? match[1] : '';
        }
        if (platform === 'youtube') {
            const vMatch = cleanUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/i);
            if (vMatch) return { type: 'video', id: vMatch[1] };
            const cMatch = cleanUrl.match(/youtube\.com\/(?:c\/|user\/|@)?([a-zA-Z0-9_-]+)/i);
            return cMatch ? { type: 'channel', id: cMatch[1] } : { type: 'url', id: url };
        }
        if (platform === 'tiktok') {
            const match = cleanUrl.match(/tiktok\.com\/@([a-zA-Z0-9_\.]+)/i);
            return match ? match[1] : '';
        }
    } catch (e) {
        console.error("Error parsing channel name:", e);
    }
    return url;
}

window.setLivePlatformFilter = function(platform, isIllegal) {
    currentLivePlatformFilter = platform;
    renderLivesScreen(isIllegal);
};

// ─── SCHEDULE & TIMELINE LOGIC ─────────────────────────────────────────────
function loadSchedules() {
    const stored = localStorage.getItem('lives_schedules');
    if (stored) {
        livesSchedules = JSON.parse(stored);
        return;
    }
    
    // Seed default schedules if empty
    livesSchedules = [
        { id: 'sch_1', memberId: 'mem_test_001', memberName: 'Teste Ilegal', day: 'Segunda', platform: 'twitch', start: '18:00', end: '22:00', title: 'Fugas Noturnas & Ação' },
        { id: 'sch_2', memberId: '', memberName: 'Ryan', day: 'Terça', platform: 'youtube', start: '19:00', end: '23:00', title: 'Tuning de Stages e Testes' },
        { id: 'sch_3', memberId: '', memberName: 'Bigas', day: 'Quarta', platform: 'kick', start: '20:00', end: '23:30', title: 'Treino de Pilotos' },
        { id: 'sch_4', memberId: 'mem_test_001', memberName: 'Teste Ilegal', day: 'Quinta', platform: 'tiktok', start: '21:00', end: '23:00', title: 'Resenha da Oficina' },
        { id: 'sch_5', memberId: '', memberName: 'Bigas', day: 'Sexta', platform: 'twitch', start: '18:00', end: '22:00', title: 'Ação Grande com a Facção' },
        { id: 'sch_6', memberId: '', memberName: 'Ryan', day: 'Sábado', platform: 'youtube', start: '16:00', end: '20:00', title: 'Desafios de Arrancada' }
    ];
    localStorage.setItem('lives_schedules', JSON.stringify(livesSchedules));
}

window.openScheduleModal = function() {
    const memberSelect = document.getElementById('scheduleMember');
    if (memberSelect) {
        memberSelect.innerHTML = activeMembers.map(m => `<option value="${m.id}">${m.name} (${m.passport})</option>`).join('');
        // Add option for unregistered/guest names if admin
        if (db.isAdminLoggedIn()) {
            memberSelect.innerHTML += `<option value="admin_guest">Outro (Convidado Especial)</option>`;
        }
    }
    showModal(modalScheduleLive);
};

// Handle schedule live submit
const formScheduleLive = document.getElementById('formScheduleLive');
if (formScheduleLive) {
    formScheduleLive.addEventListener('submit', async (e) => {
        e.preventDefault();
        const memberId = document.getElementById('scheduleMember').value;
        let memberName = 'Convidado';
        if (memberId === 'admin_guest') {
            const guestName = prompt('Digite o nome do Convidado:');
            if (!guestName) return;
            memberName = guestName;
        } else {
            const memberObj = activeMembers.find(m => m.id === memberId);
            if (memberObj) memberName = memberObj.name;
        }

        const newSchedule = {
            id: 'sch_' + Date.now(),
            memberId: memberId === 'admin_guest' ? '' : memberId,
            memberName: memberName,
            day: document.getElementById('scheduleDay').value,
            platform: document.getElementById('schedulePlatform').value,
            start: document.getElementById('scheduleStart').value,
            end: document.getElementById('scheduleEnd').value,
            title: document.getElementById('scheduleTitle').value.trim() || 'Gameplay'
        };

        livesSchedules.push(newSchedule);
        localStorage.setItem('lives_schedules', JSON.stringify(livesSchedules));
        
        hideModal(modalScheduleLive);
        formScheduleLive.reset();

        const isIllegal = currentCategory === 'illegal-lives';
        renderLivesScreen(isIllegal);
    });
}

window.deleteSchedule = function(id, isIllegal) {
    if (confirm('Deseja realmente remover esta transmissão agendada?')) {
        livesSchedules = livesSchedules.filter(s => s.id !== id);
        localStorage.setItem('lives_schedules', JSON.stringify(livesSchedules));
        renderLivesScreen(isIllegal);
    }
};

function getDayOrder(day) {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    return days.indexOf(day);
}

// ─── RENDER LIVES SCREEN ──────────────────────────────────────────────────
// ─── YOUTUBE VIDEOS MOCK GENERATOR ─────────────────────────────────────────
function getMemberYoutubeVideos(member) {
    const defaultThumbnails = [
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop'
    ];
    
    const nameLower = (member.name || '').toLowerCase();
    const ytUrl = (member.youtubeUrl || '').toLowerCase();
    
    if (nameLower.includes('ryan') || ytUrl.includes('v1xenbeast')) {
        return [
            { id: 'v1x_vid1', title: 'Me OBRIGARAM a fazer um ROUBO IMPOSSÍVEL ☠️ - GTA RP', duration: '24:15', views: '42K', date: 'há 2 dias', thumbnail: defaultThumbnails[0], youtubeId: 'dQw4w9WgXcQ' },
            { id: 'v1x_vid2', title: 'Me consagrei o melhor do Servidor (Illegal Racing)', duration: '32:10', views: '28K', date: 'há 4 dias', thumbnail: defaultThumbnails[1], youtubeId: 'dQw4w9WgXcQ' },
            { id: 'v1x_vid3', title: 'Mostrando como eu uso o CONTROLE nas CORRIDAS - GTA RP', duration: '15:45', views: '18K', date: 'há 6 dias', thumbnail: defaultThumbnails[2], youtubeId: 'dQw4w9WgXcQ' },
            { id: 'v1x_vid4', title: 'Me fizeram começar em ÚLTIMO na corrida e ainda ganhei! - GTA RP', duration: '21:30', views: '35K', date: 'há 1 semana', thumbnail: defaultThumbnails[3], youtubeId: 'dQw4w9WgXcQ' }
        ];
    }
    
    return [
        { id: 'gen_vid1', title: `${member.name} - Montando Stage 5 Performance no Skyline`, duration: '15:20', views: '8.4K', date: 'há 2 dias', thumbnail: defaultThumbnails[0], youtubeId: 'dQw4w9WgXcQ' },
        { id: 'gen_vid2', title: `Teste de Dyno e Ajuste Fino de Motores com ${member.name}`, duration: '20:15', views: '5.2K', date: 'há 4 dias', thumbnail: defaultThumbnails[1], youtubeId: 'dQw4w9WgXcQ' },
        { id: 'gen_vid3', title: `Dia de Trabalho na RE:Motion Performance Shop - VLOG`, duration: '12:45', views: '14K', date: 'há 6 dias', thumbnail: defaultThumbnails[2], youtubeId: 'dQw4w9WgXcQ' },
        { id: 'gen_vid4', title: `GTA V RP: Fugas com a Equipe da Oficina - ${member.name}`, duration: '45:30', views: '11K', date: 'há 1 week', thumbnail: defaultThumbnails[3], youtubeId: 'dQw4w9WgXcQ' }
    ];
}

window.playYoutubeVideo = function(videoId, isIllegal) {
    window.activeYoutubeVideoId = videoId;
    window.activeLivePlayerPlatform = 'youtube';
    const isIllegalBool = isIllegal === true || isIllegal === 'true';
    renderLivesScreen(isIllegalBool);
};

// ─── RENDER LIVES SCREEN ──────────────────────────────────────────────────
function renderLivesScreen(isIllegal) {
    itemsGrid.style.display = 'block';
    homeContainer.style.display = 'none';

    // Ensure schedules are loaded
    loadSchedules();

    // 1. Filter active live members by criteria and platform filter
    const activeLives = activeMembers.filter(m => 
        m.status === 'Ativo' && 
        (m.liveUrl || m.kickUrl || m.youtubeUrl || m.tiktokUrl) && 
        (isIllegal ? m.flagIlegal : (m.role && m.role !== 'Agregado'))
    );

    const filteredLives = activeLives.filter(m => {
        if (currentLivePlatformFilter === 'all') return true;
        if (currentLivePlatformFilter === 'twitch') return !!m.liveUrl;
        if (currentLivePlatformFilter === 'youtube') return !!m.youtubeUrl;
        if (currentLivePlatformFilter === 'kick') return !!m.kickUrl;
        if (currentLivePlatformFilter === 'tiktok') return !!m.tiktokUrl;
        return false;
    });

    // Determine current highlighted stream
    let highlightedMember = null;
    if (activeLiveStreamMemberId) {
        highlightedMember = filteredLives.find(m => m.id === activeLiveStreamMemberId) || filteredLives[0];
    } else if (filteredLives.length > 0) {
        highlightedMember = filteredLives[0];
    }

    if (highlightedMember) {
        activeLiveStreamMemberId = highlightedMember.id;
    } else {
        activeLiveStreamMemberId = null;
    }

    // 2. Build Platform Filters Bar
    const platformFiltersHtml = `
        <div class="platform-filters" style="margin-bottom: 24px;">
            <button class="platform-filter-btn ${currentLivePlatformFilter === 'all' ? 'active' : ''}" data-platform="all" onclick="setLivePlatformFilter('all', ${isIllegal})">
                <i class="fa-solid fa-play"></i> Todas
            </button>
            <button class="platform-filter-btn ${currentLivePlatformFilter === 'twitch' ? 'active' : ''}" data-platform="twitch" onclick="setLivePlatformFilter('twitch', ${isIllegal})">
                <i class="fa-brands fa-twitch"></i> Twitch
            </button>
            <button class="platform-filter-btn ${currentLivePlatformFilter === 'youtube' ? 'active' : ''}" data-platform="youtube" onclick="setLivePlatformFilter('youtube', ${isIllegal})">
                <i class="fa-brands fa-youtube"></i> YouTube
            </button>
            <button class="platform-filter-btn ${currentLivePlatformFilter === 'kick' ? 'active' : ''}" data-platform="kick" onclick="setLivePlatformFilter('kick', ${isIllegal})">
                <i class="fa-solid fa-gamepad"></i> Kick
            </button>
            <button class="platform-filter-btn ${currentLivePlatformFilter === 'tiktok' ? 'active' : ''}" data-platform="tiktok" onclick="setLivePlatformFilter('tiktok', ${isIllegal})">
                <i class="fa-brands fa-tiktok"></i> TikTok
            </button>
        </div>
    `;

    // 3. Highlighted Player HTML
    let playerHtml = '';
    let youtubeVideosGridHtml = '';

    if (highlightedMember) {
        // Find all available platforms for the highlighted member
        const availablePlatforms = [];
        if (highlightedMember.liveUrl) availablePlatforms.push('twitch');
        if (highlightedMember.kickUrl) availablePlatforms.push('kick');
        if (highlightedMember.youtubeUrl) availablePlatforms.push('youtube');
        if (highlightedMember.tiktokUrl) availablePlatforms.push('tiktok');

        // Set default player platform if not active or not supported
        if (!window.activeLivePlayerPlatform || !availablePlatforms.includes(window.activeLivePlayerPlatform)) {
            window.activeLivePlayerPlatform = availablePlatforms[0] || 'twitch';
        }

        const activePlatform = window.activeLivePlayerPlatform;
        let activeUrl = highlightedMember.liveUrl;
        if (activePlatform === 'kick') activeUrl = highlightedMember.kickUrl;
        if (activePlatform === 'youtube') activeUrl = highlightedMember.youtubeUrl;
        if (activePlatform === 'tiktok') activeUrl = highlightedMember.tiktokUrl;

        const channelInfo = getChannelName(activeUrl, activePlatform);
        const watchUrl = activeUrl.startsWith('http') ? activeUrl : 'https://' + activeUrl;
        
        let embedIframe = '';
        if (window.activeYoutubeVideoId && activePlatform === 'youtube') {
            embedIframe = `<iframe src="https://www.youtube.com/embed/${window.activeYoutubeVideoId}?autoplay=1" class="live-player-iframe" allowfullscreen></iframe>`;
        } else if (activePlatform === 'twitch' && channelInfo) {
            embedIframe = `<iframe src="https://player.twitch.tv/?channel=${channelInfo}&parent=${window.location.hostname}&muted=false" class="live-player-iframe" allowfullscreen></iframe>`;
        } else if (activePlatform === 'kick' && channelInfo) {
            embedIframe = `<iframe src="https://player.kick.com/${channelInfo}" class="live-player-iframe" allowfullscreen></iframe>`;
        } else if (activePlatform === 'youtube' && channelInfo) {
            const embedSrc = channelInfo.type === 'video' 
                ? `https://www.youtube.com/embed/${channelInfo.id}?autoplay=1` 
                : `https://www.youtube.com/embed/live_stream?channel=${channelInfo.id}`;
            embedIframe = `<iframe src="${embedSrc}" class="live-player-iframe" allowfullscreen></iframe>`;
        } else if (activePlatform === 'tiktok' && channelInfo) {
            const initial = highlightedMember.name ? highlightedMember.name.charAt(0).toUpperCase() : '?';
            embedIframe = `
                <div class="tiktok-embed-card">
                    <div class="tiktok-embed-avatar-wrapper">
                        <div class="tiktok-embed-avatar">
                            ${highlightedMember.avatarUrl ? `<img src="${highlightedMember.avatarUrl}" alt="${highlightedMember.name}" onerror="this.style.display='none';">` : `<span style="font-size:2rem; font-weight:bold; color:var(--white-main); width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:var(--black-panel);">${initial}</span>`}
                        </div>
                        <div class="live-badge" style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); background:#fe2c55; color:white; font-size:0.6rem; font-weight:800; padding:1px 6px; border-radius:4px; animation: live-blink 1.5s infinite;">TIKTOK LIVE</div>
                    </div>
                    <div style="text-align:center; display:flex; flex-direction:column; gap:4px;">
                        <h4 style="font-size:1.1rem; font-weight:bold;">@${channelInfo}</h4>
                        <p style="font-size:0.8rem; color:var(--white-muted);">O TikTok não suporta incorporação direta de lives em outros sites.</p>
                    </div>
                    <a href="${watchUrl}" target="_blank" class="action-btn primary-btn" style="background:#fe2c55; border:none; color:white; font-weight:bold; padding:8px 16px; border-radius:var(--radius-sm); font-size:0.85rem; display:flex; align-items:center; gap:6px; text-decoration:none;">
                        <i class="fa-brands fa-tiktok"></i> Assistir no TikTok
                    </a>
                </div>
            `;
        } else {
            embedIframe = `
                <div class="live-player-placeholder">
                    <i class="fa-solid fa-play"></i>
                    <div>
                        <p style="font-weight:700; color:var(--white-main); margin-bottom:4px;">Canal Externo</p>
                        <p style="font-size:0.82rem; color:var(--white-muted);">Esta live está hospedada em uma plataforma externa incompatível com reprodução direta.</p>
                    </div>
                    <a href="${watchUrl}" target="_blank" class="action-btn primary-btn" style="background:var(--red-primary); color:white; font-weight:bold; padding:8px 16px; border:none; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                        <i class="fa-solid fa-external-link"></i> Abrir Canal
                    </a>
                </div>
            `;
        }

        const initial = highlightedMember.name ? highlightedMember.name.charAt(0).toUpperCase() : '?';

        // Build player platform selectors
        const sourceButtonsHtml = availablePlatforms.map(p => {
            const isActive = activePlatform === p;
            const iconMap = {
                twitch: '<i class="fa-brands fa-twitch"></i> Twitch',
                kick: '<i class="fa-solid fa-gamepad"></i> Kick',
                youtube: '<i class="fa-brands fa-youtube"></i> YouTube',
                tiktok: '<i class="fa-brands fa-tiktok"></i> TikTok'
            };
            const colorMap = {
                twitch: '#9146ff',
                kick: '#53fc18',
                youtube: '#ff0000',
                tiktok: '#fe2c55'
            };
            
            return `
                <button class="action-btn" style="border-color:${isActive ? colorMap[p] : 'var(--border-dark)'}; background:${isActive ? 'rgba(255,255,255,0.08)' : 'transparent'}; color:${isActive ? 'var(--white-main)' : 'var(--white-muted)'}; padding: 6px 12px; font-size: 0.8rem; font-weight:600; display:flex; align-items:center; gap:6px;" onclick="window.activeLivePlayerPlatform = '${p}'; window.activeYoutubeVideoId = null; renderLivesScreen(${isIllegal});">
                    <span style="color:${colorMap[p]}">${iconMap[p]}</span>
                </button>
            `;
        }).join('');

        // Status Badge (AO VIVO vs OFFLINE)
        const isOnline = !!highlightedMember.isLive;
        const statusBadgeHtml = isOnline 
            ? `<span class="live-player-badge" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; font-weight:800; font-size:0.7rem; padding:3px 8px; border-radius:4px; display:inline-flex; align-items:center; gap:6px; letter-spacing:0.5px;">
                 <span style="width:6px; height:6px; background:#ef4444; border-radius:50%; display:inline-block; animation: live-blink 1.5s infinite;"></span> AO VIVO
               </span>`
            : `<span class="live-player-badge offline" style="background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-dark); color: var(--white-muted); font-weight:800; font-size:0.7rem; padding:3px 8px; border-radius:4px; display:inline-flex; align-items:center; gap:6px; letter-spacing:0.5px;">
                 <span style="width:6px; height:6px; background:#9ca3af; border-radius:50%; display:inline-block;"></span> OFFLINE
               </span>`;

        playerHtml = `
            <div class="live-viewer-main" style="margin-bottom: 30px;">
                <div class="live-player-wrapper">
                    ${embedIframe}
                </div>
                <div class="live-player-info">
                    <div style="display:flex; flex-direction:column; gap:16px;">
                        <div class="live-player-header">
                            <div class="live-player-member-avatar">
                                ${highlightedMember.avatarUrl ? `<img src="${highlightedMember.avatarUrl}" alt="${highlightedMember.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                                <span style="display:none; font-size:1.5rem; font-weight:bold; color:var(--white-main); width:100%; height:100%; align-items:center; justify-content:center; background:var(--black-panel);">${initial}</span>
                            </div>
                            <div class="live-player-title-block">
                                ${statusBadgeHtml}
                                <h3>${highlightedMember.name}</h3>
                                <span style="font-size:0.78rem; color:var(--white-muted); display:flex; align-items:center; gap:6px;">
                                    <i class="fa-solid fa-shield-halved"></i> ${isIllegal ? (highlightedMember.illegalRole || 'Membro') : highlightedMember.role}
                                </span>
                            </div>
                        </div>
                        
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--white-muted); letter-spacing:0.5px;">Selecionar Plataforma</span>
                            <div style="display:flex; flex-wrap:wrap; gap:8px;">
                                ${sourceButtonsHtml}
                            </div>
                        </div>

                        <div class="live-player-desc" style="font-size:0.88rem; line-height:1.5; color:var(--white-muted);">
                            ${isOnline ? 'Transmitindo ao vivo agora! Conecte-se e assista o dia a dia da nossa equipe diretamente na plataforma original ou use o player interativo.' : 'Este streamer está offline no momento. Você ainda pode visitar suas redes e canais oficiais nos botões acima ou reproduzir os vídeos do canal do YouTube listados logo abaixo.'}
                        </div>
                    </div>
                    <div class="live-player-actions" style="margin-top:auto; padding-top:15px;">
                        <a href="${watchUrl}" target="_blank" class="action-btn primary-btn" style="background:${isIllegal ? '#f59e0b' : 'var(--red-primary)'}; color:${isIllegal ? 'black' : 'white'}; font-weight:bold; text-decoration:none; padding:10px 16px; font-size:0.88rem; display:inline-flex; align-items:center; gap:8px;">
                            <i class="fa-solid fa-external-link"></i> Abrir Canal Original
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Render YouTube channel videos if they have a youtubeUrl
        if (highlightedMember.youtubeUrl) {
            const videosList = getMemberYoutubeVideos(highlightedMember);
            youtubeVideosGridHtml = `
                <div class="youtube-videos-section" style="margin-top: 35px; margin-bottom: 35px; border-top: 1px solid var(--border-dark); padding-top: 24px;">
                    <h3 style="font-family:'Rajdhani', sans-serif; font-size: 1.25rem; font-weight: 700; text-transform:uppercase; letter-spacing:1px; color: var(--white-main); margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-brands fa-youtube" style="color: #ff0000; font-size: 1.4rem;"></i> Vídeos Recentes — ${highlightedMember.name}
                    </h3>
                    <div class="youtube-videos-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
                        ${videosList.map(v => `
                            <div class="youtube-video-card" style="background: var(--black-card); border: 1px solid var(--border-dark); border-radius: var(--radius-md); overflow: hidden; display: flex; flex-direction: column; cursor: pointer; transition: var(--transition);" onclick="playYoutubeVideo('${v.youtubeId}', ${isIllegal})">
                                <div class="youtube-video-thumb-wrapper" style="position: relative; width: 100%; padding-top: 56.25%; overflow: hidden; background:#000;">
                                    <img src="${v.thumbnail}" alt="${v.title}" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; transition: var(--transition);">
                                    <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: white; font-size: 0.75rem; padding: 2px 6px; border-radius: 2px; font-weight: 600;">${v.duration}</span>
                                    <div class="play-overlay" style="position: absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; opacity:0; transition: var(--transition);">
                                        <i class="fa-brands fa-youtube" style="color:#ff0000; font-size:2.5rem;"></i>
                                    </div>
                                </div>
                                <div class="youtube-video-body" style="padding: 12px; display: flex; flex-direction: column; gap: 6px; flex: 1;">
                                    <h4 style="font-size: 0.88rem; font-weight: 600; line-height: 1.4; color: var(--white-main); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; height: 2.8em;" title="${v.title}">${v.title}</h4>
                                    <div style="font-size: 0.78rem; color: var(--white-muted); margin-top: auto;">
                                        <span>${v.views} visualizações</span> • <span>${v.date}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    } else {
        playerHtml = `
            <div class="live-viewer-main" style="margin-bottom: 30px; grid-template-columns: 1fr;">
                <div class="live-player-wrapper" style="padding-top: 30%; min-height: 200px;">
                    <div class="live-player-placeholder">
                        <i class="fa-solid fa-circle-play"></i>
                        <h4 style="font-size:1.2rem; font-weight:800; color:var(--white-main);">Nenhuma transmissão ativa</h4>
                        <p style="font-size:0.85rem; color:var(--white-muted); max-width:400px; line-height:1.5;">Selecione um dos canais disponíveis abaixo para iniciar a reprodução ou agende um horário na nossa linha do tempo.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // 4. Grid of Channels HTML
    let channelsGridHtml = '';
    if (filteredLives.length === 0) {
        channelsGridHtml = `
            <div class="empty-cart-msg" style="margin:20px 0; grid-column:1/-1; text-align:center; padding:30px;">
                <i class="fa-solid fa-play" style="font-size:2rem; color:${isIllegal ? '#f59e0b' : 'var(--red-primary)'}; opacity:0.3; margin-bottom:12px;"></i>
                <p>Nenhuma transmissão ativa para esta plataforma no momento.</p>
            </div>`;
    } else {
        channelsGridHtml = filteredLives.map(m => {
            const initial = m.name ? m.name.charAt(0).toUpperCase() : '?';
            const isHighlighted = m.id === activeLiveStreamMemberId;
            const avatarStyle = `width:80px; height:80px; border-radius:8px; border:2px solid ${isHighlighted ? (isIllegal ? '#f59e0b' : 'var(--red-primary)') : 'var(--border-dark)'}; position:relative; overflow:hidden; transition: var(--transition);`;
            
            let avatarContent = `<span style="font-size:1.8rem; font-weight:bold; color:var(--white-main); width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:var(--black-panel);">${initial}</span>`;
            if (m.avatarUrl) {
                avatarContent = `<img src="${m.avatarUrl}" alt="${m.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><span style="display:none; font-size:1.8rem; font-weight:bold; color:var(--white-main); width:100%; height:100%; align-items:center; justify-content:center; background:var(--black-panel);">${initial}</span>`;
            }

            // Detect primary platform for the icon display
            const primaryPlatform = m.liveUrl ? 'twitch' : (m.kickUrl ? 'kick' : (m.youtubeUrl ? 'youtube' : 'tiktok'));
            const platformIcons = {
                twitch: '<i class="fa-brands fa-twitch" style="color:#9146ff;" title="Twitch"></i>',
                youtube: '<i class="fa-brands fa-youtube" style="color:#ff0000;" title="YouTube"></i>',
                kick: '<i class="fa-solid fa-gamepad" style="color:#53fc18;" title="Kick"></i>',
                tiktok: '<i class="fa-brands fa-tiktok" style="color:#fe2c55;" title="TikTok"></i>',
                outros: '<i class="fa-solid fa-play" style="color:var(--white-dim);" title="Live"></i>'
            };

            const isOnline = !!m.isLive;
            const badgeHtml = isOnline
                ? `<div class="live-badge" style="position:absolute; top:12px; right:12px; background:#ef4444; color:white; font-size:0.68rem; font-weight:800; padding:2px 6px; border-radius:4px; text-transform:uppercase; letter-spacing:0.5px; display:flex; align-items:center; gap:4px; animation: live-blink 1.5s infinite;">
                     <span style="width:6px; height:6px; background:white; border-radius:50%; display:inline-block;"></span>
                     AO VIVO
                   </div>`
                : `<div class="live-badge offline" style="position:absolute; top:12px; right:12px; background:rgba(255,255,255,0.05); border: 1px solid var(--border-dark); color:var(--white-muted); font-size:0.68rem; font-weight:800; padding:2px 6px; border-radius:4px; text-transform:uppercase; letter-spacing:0.5px; display:flex; align-items:center; gap:4px;">
                     <span style="width:6px; height:6px; background:#9ca3af; border-radius:50%; display:inline-block;"></span>
                     OFFLINE
                   </div>`;

            return `
                <div class="lives-member-card ${isHighlighted ? 'active-highlight' : ''}" style="background:var(--black-card); border:1px solid ${isHighlighted ? (isIllegal ? '#f59e0b' : 'var(--red-primary)') : 'var(--border-dark)'}; border-radius:var(--radius-lg); padding:20px; display:flex; flex-direction:column; align-items:center; gap:12px; text-align:center; position:relative; transition:var(--transition); cursor:pointer;" onclick="window.activeLiveStreamMemberId = '${m.id}'; window.activeYoutubeVideoId = null; window.activeLivePlayerPlatform = null; renderLivesScreen(${isIllegal});">
                    ${badgeHtml}
                    <div class="member-avatar-wrapper" style="position:relative; ${isOnline ? 'animation: live-pulse 1.5s infinite;' : ''} border-radius:8px;">
                        <div style="${avatarStyle}">
                            ${avatarContent}
                        </div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:2px; width:100%;">
                        <h4 style="font-size:0.95rem; font-weight:700; color:var(--white-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; display:flex; align-items:center; justify-content:center; gap:6px;">
                            ${m.name} ${platformIcons[primaryPlatform] || platformIcons['outros']}
                        </h4>
                        <span style="font-size:0.75rem; color:var(--white-muted); display:flex; align-items:center; justify-content:center; gap:4px;">
                            <i class="fa-solid fa-shield-halved"></i> ${isIllegal ? (m.illegalRole || 'Membro') : m.role}
                        </span>
                    </div>
                    <button class="action-btn primary-btn" style="width:100%; justify-content:center; background:${isIllegal ? 'rgba(245,158,11,0.08)' : 'var(--black-panel)'}; color:${isIllegal ? '#f59e0b' : 'var(--white-main)'}; font-weight:bold; border:1px solid ${isIllegal ? 'rgba(245,158,11,0.25)' : 'var(--border-dark)'}; padding:8px 12px; border-radius:var(--radius-sm); font-size:0.82rem; display:flex; align-items:center; gap:6px;">
                        <i class="fa-solid fa-desktop"></i> Ver no Painel
                    </button>
                </div>`;
        }).join('');
    }

    // 5. Timeline Weekly Grid HTML
    const canSchedule = db.isAdminLoggedIn() || currentLoggedInMember !== null || currentIllegalMember !== null;
    const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    
    // Sort schedules by time
    const sortedSchedules = [...livesSchedules].sort((a, b) => a.start.localeCompare(b.start));

    // Get today's day of week in Portuguese
    const dayNamesBr = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const todayName = dayNamesBr[new Date().getDay()];

    const timelineGridHtml = weekdays.map(day => {
        const daySchedules = sortedSchedules.filter(s => s.day.toLowerCase() === day.toLowerCase() || (day === 'Segunda' && s.day === 'Segunda-feira')); // match segment or full word
        const isToday = todayName.toLowerCase() === day.toLowerCase() || (day === 'Segunda' && todayName === 'Segunda-feira');
        
        let schedulesListHtml = '';
        if (daySchedules.length === 0) {
            schedulesListHtml = `<div class="timeline-empty-day">Nenhuma live agendada</div>`;
        } else {
            schedulesListHtml = daySchedules.map(s => {
                const canDelete = db.isAdminLoggedIn() || (currentLoggedInMember && currentLoggedInMember.id === s.memberId) || (currentIllegalMember && currentIllegalMember.id === s.memberId);
                const platformIconClass = {
                    twitch: 'fa-brands fa-twitch',
                    youtube: 'fa-brands fa-youtube',
                    kick: 'fa-solid fa-gamepad',
                    tiktok: 'fa-brands fa-tiktok'
                }[s.platform] || 'fa-solid fa-play';

                return `
                    <div class="timeline-schedule-card">
                        ${canDelete ? `<button class="timeline-delete-btn" onclick="deleteSchedule('${s.id}', ${isIllegal})" title="Remover"><i class="fa-solid fa-trash"></i></button>` : ''}
                        <div class="timeline-card-header">
                            <span class="timeline-card-time"><i class="fa-regular fa-clock"></i> ${s.start} - ${s.end}</span>
                            <span class="timeline-card-platform platform-${s.platform}"><i class="${platformIconClass}"></i></span>
                        </div>
                        <div class="timeline-card-member">${s.memberName}</div>
                        <div class="timeline-card-title" title="${s.title}">${s.title}</div>
                    </div>
                `;
            }).join('');
        }

        return `
            <div class="timeline-day-col ${isToday ? 'today' : ''}">
                <div class="timeline-day-name">
                    ${isToday ? '<i class="fa-solid fa-star" style="font-size:0.75rem;"></i>' : ''}
                    ${day}
                </div>
                <div class="timeline-schedule-list">
                    ${schedulesListHtml}
                </div>
            </div>
        `;
    }).join('');

    const timelineHtml = `
        <div class="timeline-section" style="margin-top: 30px;">
            <div class="timeline-header">
                <h3><i class="fa-solid fa-calendar-days"></i> Linha do Tempo de Transmissões</h3>
                ${canSchedule ? `
                    <button class="action-btn" id="btnOpenNewSchedule" onclick="openScheduleModal()" style="background:rgba(255,255,255,0.05); border-color:var(--border-dark); color:var(--white-main); padding:6px 12px; font-weight:600; font-size:0.8rem;">
                        <i class="fa-solid fa-plus"></i> Agendar Horário
                    </button>
                ` : ''}
            </div>
            <div class="timeline-grid">
                ${timelineGridHtml}
            </div>
        </div>
    `;

    // 6. Final Assemble
    itemsGrid.innerHTML = `
        <div class="lives-layout">
            ${platformFiltersHtml}
            ${playerHtml}
            ${youtubeVideosGridHtml}
            <div>
                <h3 style="font-family:'Rajdhani', sans-serif; font-size:1.2rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:15px; color:var(--white-main); display:flex; align-items:center; gap:8px;">
                    <i class="fa-solid fa-satellite-dish"></i> Transmissões Disponíveis (${filteredLives.length})
                </h3>
                <div class="lives-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:20px;">
                    ${channelsGridHtml}
                </div>
            </div>
        </div>
    `;
}


// ─── RENDER HOME SCREEN & MURAL ───────────────────────────────────────────
function renderHomeScreen() {
    if (!homeContainer) return;

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
        const matDef = activeMaterials.find(m => m.id === matId);
        if (matDef) {
            totalCost += matDef.price * materialCount[matId];
        }
    });

    const netProfit = totalSell - totalCost;

    const quickServicesIds = ['repair_lataria', 'repair_engine', 'refil_nitro', 'repair_generic_parts'];
    const quickServiceIcons = {
        'repair_lataria': 'fa-solid fa-car-burst',
        'repair_engine': 'fa-solid fa-gears',
        'refil_nitro': 'fa-solid fa-gauge-high',
        'repair_generic_parts': 'fa-solid fa-wrench'
    };

    const quickServicesHtml = quickServicesIds.map(id => {
        const service = activeServices.find(s => s.id === id);
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
                        const matDef = activeMaterials.find(m => m.id === ing.id);
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
            <div class="quick-service-card" onclick="window.addToCart('${service.id}', 'home')" style="cursor:pointer;" title="Adicionar Serviço">
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

    const isAdmin = db.isAdminLoggedIn();
    let muralHtml = '';
    const legalPosts = activeMural.filter(post => !post.tag || !post.tag.startsWith('[ILEGAL]'));
    
    if (legalPosts.length === 0) {
        muralHtml = `
            <div class="empty-cart-msg" style="margin:20px 0;">
                <i class="fa-solid fa-bullhorn" style="font-size:1.8rem;"></i>
                <p>Nenhum aviso publicado no mural.</p>
            </div>`;
    } else {
        muralHtml = legalPosts.map(post => {
            const dateStr = new Date(post.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            const cardClass = post.tag ? `${post.tag.toLowerCase()}-card` : 'aviso-card';
            const badgeClass = post.tag ? `tag-${post.tag.toLowerCase()}` : 'tag-aviso';
            
            return `
                <div class="mural-card ${cardClass}">
                    <div class="mural-card-top">
                        <div class="mural-title-block">
                            <span class="mural-badge ${badgeClass}">${post.tag}</span>
                            <h4 class="mural-title-text">${post.title}</h4>
                        </div>
                        <div class="mural-date">${dateStr}</div>
                    </div>
                    <p class="mural-body-text">${post.content}</p>
                    <div class="mural-card-footer">
                        <span class="mural-author-tag">Publicado por: ${post.author}</span>
                        ${isAdmin ? `
                            <button class="btn-delete-post" onclick="event.stopPropagation(); deleteMuralPost('${post.id}')" title="Excluir Aviso">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>`;
        }).join('');
    }

    homeContainer.innerHTML = `
        <div class="home-hero">
            <h1>RE<span>:</span>Motion Performance Shop</h1>
            <p>Selecione um dos serviços rápidos abaixo para adicioná-lo diretamente à ordem de serviço, ou use o menu lateral esquerdo para gerenciar stages, outros serviços e acessórios.</p>
        </div>

        <div class="mural-section" style="margin-bottom: 24px;">
            <div class="mural-header-row">
                <h3><i class="fa-solid fa-bullhorn"></i> Mural de Avisos</h3>
                ${isAdmin ? `
                    <button class="action-btn" id="btnOpenNewMural" onclick="openMuralModal()" style="background:var(--red-subtle); border-color:var(--border-red); color:var(--white-main); padding:6px 12px; font-weight:600;">
                        <i class="fa-solid fa-plus"></i> Novo Aviso
                    </button>
                ` : ''}
            </div>
            <div class="mural-grid">
                ${muralHtml}
            </div>
        </div>

        <div>
            <div class="home-section-header">
                <h3>Serviços Rápidos</h3>
            </div>
            <div class="quick-services-grid">
                ${quickServicesHtml}
            </div>
        </div>

        <div style="margin-top: 24px;">
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

// ─── SUB-NAVIGATION CONTROLLER ───────────────────────────────────────────
function updateSubNavigation() {
    if (currentCategory === 'members') {
        subCategoryTabsContainer.style.display = 'flex';
        subCategoryTabsContainer.innerHTML = `
            <button class="sub-tab-btn ${currentSubCategory === 'list' ? 'active' : ''}" onclick="switchSubCategory('list')">Membros</button>
            <button class="sub-tab-btn ${currentSubCategory === 'roles' ? 'active' : ''}" onclick="switchSubCategory('roles')">Cargos & Permissões</button>
        `;
    } else if (currentCategory === 'illegal-hierarchy') {
        subCategoryTabsContainer.style.display = 'flex';
        subCategoryTabsContainer.innerHTML = `
            <button class="sub-tab-btn ${currentSubCategory === 'list' ? 'active' : ''}" onclick="switchSubCategory('list')">Hierarquia</button>
            <button class="sub-tab-btn ${currentSubCategory === 'roles' ? 'active' : ''}" onclick="switchSubCategory('roles')">Cargos & Permissões</button>
        `;
    } else {
        subCategoryTabsContainer.style.display = 'none';
        subCategoryTabsContainer.innerHTML = '';
    }
}

window.switchSubCategory = function(subCat) {
    currentSubCategory = subCat;
    updateSubNavigation();
    updateAuthUI(); // Updates header buttons
    renderItems();
};

// ─── RENDER MEMBERS & ROLES ────────────────────────────────────────────────
function renderMembersScreen(searchTerm = '') {
    const isAllowedEdit = hasPermission('edit_members');
    
    if (currentSubCategory === 'roles') {
        renderRolesScreen();
        return;
    }

    // Separate pending and active members
    const pendings = activeMembers.filter(m => m.status === 'Pendente');
    const actives = activeMembers.filter(m => m.status !== 'Pendente');

    const hasIllegalAccess = db.isAdminLoggedIn() || 
                             (currentLoggedInMember && (currentLoggedInMember.flagIlegal || hasPermission('access_illegal')));

    // Filter actives: do not show Agregado (illegal-only) members on the legal list
    let visibleActives = [];
    if (isIllegalUnlocked) {
        visibleActives = actives.filter(m => m.flagIlegal);
    } else {
        visibleActives = actives.filter(m => m.role && m.role !== 'Agregado' && m.role !== '' && !m.isAgregado);
    }

    // Filter actives by search term
    const filteredActives = visibleActives.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.passport.includes(searchTerm) || 
        (isIllegalUnlocked ? (m.illegalRole && m.illegalRole.toLowerCase().includes(searchTerm.toLowerCase())) : (m.role && m.role.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    let html = '';

    // Render pending approvals list if the user is admin/gerente and there are requests
    if (isAllowedEdit && pendings.length > 0) {
        html += `
            <div class="pending-requests-section" style="grid-column: 1 / -1;">
                <h3 style="color:var(--danger); font-size:1rem; font-weight:700; display:flex; align-items:center; gap:8px;">
                    <i class="fa-solid fa-user-clock"></i> Solicitações de Cadastro Pendentes (${pendings.length})
                </h3>
                <div class="pending-grid">
                    ${pendings.map(p => {
                        return `
                            <div class="pending-card">
                                <div class="pending-card-header">
                                    <strong style="color:var(--white-main);">${p.name}</strong>
                                    <span style="font-size:0.75rem; background:rgba(239,68,68,0.1); color:var(--danger); padding:2px 6px; border-radius:4px; font-weight:bold;">PENDENTE</span>
                                </div>
                                <div style="font-size:0.8rem; color:var(--white-off); display:flex; flex-direction:column; gap:4px;">
                                    <div><strong>Passaporte:</strong> ${p.passport}</div>
                                    <div><strong>Telefone:</strong> ${p.phone}</div>
                                </div>
                                
                                <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px; border-top:1px solid var(--border-dark); padding-top:8px;">
                                    <div class="form-group" style="margin-bottom:0;">
                                        <label style="font-size:0.75rem; color:var(--white-muted); display:block; margin-bottom:4px;">Atribuir Cargo Mecânica</label>
                                        <select id="assign-role-${p.id}" style="width:100%; padding:6px; background:var(--black-card); border:1px solid var(--border-dark); border-radius:4px; color:var(--white-main); font-size:0.8rem;">
                                            ${activeRoles.map(r => `<option value="${r.name}" ${p.role === r.name ? 'selected' : ''}>${r.name}</option>`).join('')}
                                            <option value="Estagiario" ${p.role === 'Estagiario' ? 'selected' : ''}>Estagiario</option>
                                            <option value="Agregado" ${p.role === 'Agregado' ? 'selected' : ''}>Agregado (Somente Ilegal)</option>
                                        </select>
                                    </div>
                                    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
                                        <label style="display:flex; align-items:center; gap:6px; font-size:0.8rem; color:var(--white-off); cursor:pointer;">
                                            <input type="checkbox" id="assign-illegal-${p.id}" ${p.flagIlegal ? 'checked' : ''} style="accent-color:#f59e0b;" onchange="window.toggleAssignIllegalSelect('${p.id}')"> Habilitar Flag Ilegal
                                        </label>
                                        <select id="assign-illegal-role-${p.id}" style="padding:4px; background:var(--black-card); border:1px solid var(--border-dark); border-radius:4px; color:#f59e0b; font-size:0.75rem; display:${p.flagIlegal ? 'block' : 'none'};">
                                              <option value="01" ${p.illegalRole.includes('01') ? 'selected' : ''}>01</option>
                                              <option value="Gerente" ${p.illegalRole.includes('Gerente') ? 'selected' : ''}>Gerente</option>
                                              <option value="Corredor" ${p.illegalRole.includes('Corredor') ? 'selected' : ''}>Corredor</option>
                                              <option value="Membro" ${p.illegalRole.includes('Membro') ? 'selected' : ''}>Membro</option>
                                              <option value="Probatorio" ${p.illegalRole.includes('Probatorio') ? 'selected' : ''}>Probatorio</option>
                                          </select>
                                    </div>
                                </div>

                                <div class="pending-actions">
                                    <button class="pending-btn-approve" onclick="approveMemberRequest('${p.id}')">
                                        <i class="fa-solid fa-check"></i> Aprovar
                                    </button>
                                    <button class="pending-btn-reject" onclick="rejectMemberRequest('${p.id}')">
                                        <i class="fa-solid fa-xmark"></i> Rejeitar
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    if (filteredActives.length === 0) {
        if (html === '') {
            itemsGrid.innerHTML = `
                <p style="color:var(--white-dim);grid-column:1/-1;text-align:center;padding:40px 0;">
                    <i class="fa-solid fa-users" style="opacity:0.3;font-size:2rem;display:block;margin-bottom:10px;"></i>
                    Nenhum membro cadastrado.
                </p>`;
            return;
        }
    }

    // Grid columns layout
    itemsGrid.style.display = 'grid';

    html += filteredActives.map(m => {
        const initial = m.name ? m.name.charAt(0).toUpperCase() : '?';
        const dateStr = m.joinDate;
        
        const isIlegalTag = (m.flagIlegal && hasIllegalAccess) 
            ? `<span class="member-status-label" style="background:rgba(245,158,11,0.08); border-color:rgba(245,158,11,0.2); color:#f59e0b; margin-left:6px;">ILEGAL</span>` 
            : '';

        return `
            <div class="member-card" onclick="window.handleMemberCardClick('${m.id}')" style="cursor: pointer;">
                <div class="member-card-badges" style="position: absolute; top: 12px; right: 12px; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; z-index: 10;">
                    <span class="member-status-label status-${m.status.toLowerCase()}">${m.status}</span>
                    ${isIlegalTag}
                </div>
                <div class="member-card-header">
                    <div class="member-avatar ${m.liveUrl ? 'is-live' : ''}" ${m.liveUrl ? `onclick="window.open('${m.liveUrl.startsWith('http') ? m.liveUrl : 'https://' + m.liveUrl}', '_blank'); event.stopPropagation();" title="Assistir Live"` : ''}>
                        ${m.avatarUrl ? `<img src="${m.avatarUrl}" alt="${m.name}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><span style="display:none; align-items:center; justify-content:center; width:100%; height:100%;">${initial}</span>` : initial}
                    </div>
                    <div class="member-meta" style="margin-right: 75px;">
                        <h4 class="member-name" style="white-space: normal; word-break: break-word; line-height: 1.2; margin-bottom: 2px;">${m.name}</h4>
                        <span class="member-role-badge" style="${isIllegalUnlocked ? 'color:#f59e0b; border-color:rgba(245,158,11,0.25); background:rgba(245,158,11,0.05);' : ''}">
                            <i class="fa-solid fa-shield-halved"></i> ${isIllegalUnlocked ? (m.illegalRole || 'Membro') : m.role}
                        </span>
                    </div>
                </div>
                <div class="member-info-list">
                    <div class="member-info-row">
                        <span>Passaporte:</span>
                        <span>${m.passport}</span>
                    </div>
                    <div class="member-info-row">
                        <span>Telefone:</span>
                        <span>${m.phone}</span>
                    </div>
                    <div class="member-info-row">
                        <span>Data Ingresso:</span>
                        <span>${dateStr}</span>
                    </div>
                </div>
                ${(() => {
                    const isOwn = (currentLoggedInMember && currentLoggedInMember.id === m.id) || (currentIllegalMember && currentIllegalMember.id === m.id);
                    if (isOwn) {
                        return `
                            <div style="display: grid; width: 100%; margin-top: auto; border-top: 1px solid var(--border-dark); padding-top: 12px;">
                                <button class="action-btn" onclick="event.stopPropagation(); openMemberEditModal('${m.id}')" style="width:100%; justify-content:center; border-color:var(--border-red); color:var(--red-primary);">
                                    <i class="fa-solid fa-user-pen"></i> Editar Perfil
                                </button>
                            </div>
                        `;
                    } else if (isAllowedEdit) {
                        return `
                            <div class="member-card-actions">
                                <button class="action-btn" onclick="event.stopPropagation(); openMemberEditModal('${m.id}')" style="width:100%; justify-content:center;">
                                    <i class="fa-solid fa-pen"></i> Editar
                                </button>
                            </div>
                        `;
                    }
                    return '';
                })()}
            </div>
        `;
    }).join('');

    itemsGrid.innerHTML = html;
}

window.approveMemberRequest = async function(memberId) {
    const role = document.getElementById(`assign-role-${memberId}`).value;
    const flagIlegal = document.getElementById(`assign-illegal-${memberId}`).checked;
    const illegalRole = flagIlegal ? document.getElementById(`assign-illegal-role-${memberId}`).value : '';

    const member = activeMembers.find(m => m.id === memberId);
    if (member) {
        member.status = 'Ativo';
        member.role = role;
        member.flagIlegal = flagIlegal;
        member.illegalRole = illegalRole;

        await db.saveMember(member);
        alert(`Membro ${member.name} aprovado com sucesso!`);
        await loadData();
        renderItems();
    }
};

window.rejectMemberRequest = async function(memberId) {
    const member = activeMembers.find(m => m.id === memberId);
    if (member && confirm(`Deseja rejeitar e remover a solicitação de cadastro de ${member.name}?`)) {
        await db.deleteMember(memberId);
        await loadData();
        renderItems();
    }
};

window.toggleAssignIllegalSelect = function(id) {
    const chk = document.getElementById(`assign-illegal-${id}`);
    const sel = document.getElementById(`assign-illegal-role-${id}`);
    if (chk && sel) {
        sel.style.display = chk.checked ? 'block' : 'none';
    }
};

function renderRolesScreen() {
    const isAllowedEdit = hasPermission('manage_roles');
    
    if (activeRoles.length === 0) {
        itemsGrid.innerHTML = `<p style="grid-column:1/-1; color:var(--white-dim); text-align:center; padding:40px 0;">Nenhum cargo configurado.</p>`;
        return;
    }

    itemsGrid.innerHTML = activeRoles.map(role => {
        return `
            <div class="member-card" style="min-height:160px; justify-content:space-between;">
                <div class="member-card-header">
                    <div class="member-avatar" style="border-radius:10px;"><i class="fa-solid fa-shield-halved"></i></div>
                    <div class="member-meta">
                        <h4 class="member-name">${role.name}</h4>
                        <span class="member-role-badge" style="color:var(--white-muted); font-size:0.75rem;">
                            ${role.permissions.length} permissões ativas
                        </span>
                    </div>
                </div>
                <div class="member-info-list" style="margin-bottom:8px; border-top:none; padding-top:0;">
                    <div style="font-size:0.72rem; color:var(--white-dim); display:flex; flex-wrap:wrap; gap:4px;">
                        ${role.permissions.map(p => `<span style="background:rgba(255,255,255,0.03); border:1px solid var(--border-dark); padding:2px 6px; border-radius:4px;">${p}</span>`).join('')}
                    </div>
                </div>
                ${isAllowedEdit ? `
                    <div class="member-card-actions" style="border-top:1px solid var(--border-dark); padding-top:10px;">
                        <button class="action-btn" onclick="openRoleEditModal('${role.id}')" style="width:100%; justify-content:center;">
                            <i class="fa-solid fa-wrench"></i> Configurar Cargo
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// ─── RENDER HIERARCHY SCREEN ──────────────────────────────────────────────
function renderHierarchyScreen() {
    // Dynamic grouping based on existing roles
    let hierarchyHtml = '<div class="hierarchy-container">';
    
    if (activeRoles.length === 0) {
        hierarchyHtml += `<p style="color:var(--white-dim); text-align:center; padding:40px 0;">Crie cargos para estruturar a hierarquia.</p>`;
    } else {
        activeRoles.forEach(role => {
            if (role.name === 'Agregado') return;
            const membersOfRole = activeMembers.filter(m => {
                if (!m.role || m.status !== 'Ativo') return false;
                return getMemberHighestRole(m).toLowerCase() === role.name.toLowerCase();
            });
            
            hierarchyHtml += `
                <div class="hierarchy-group">
                    <div class="hierarchy-level-header">
                        <div class="hierarchy-level-title" style="color:var(--red-primary);">
                            <i class="fa-solid fa-shield-halved"></i> ${role.name.toUpperCase()} (0${membersOfRole.length})
                        </div>
                        <span class="hierarchy-level-count">${membersOfRole.length} membros ativos</span>
                    </div>
                    <div class="hierarchy-members-grid">
            `;

            if (membersOfRole.length === 0) {
                hierarchyHtml += `
                    <p style="color:var(--white-dim); font-size:0.82rem; grid-column:1/-1; padding:10px 0;">
                        Nenhum membro ativo cadastrado neste cargo.
                    </p>`;
            } else {
                const loggedInRoles = currentLoggedInMember && currentLoggedInMember.role 
                    ? currentLoggedInMember.role.split(',').map(r => r.trim().toLowerCase()) 
                    : [];
                const isCEO = db.isAdminLoggedIn() || (currentLoggedInMember && (
                    loggedInRoles.includes('ceo') || 
                    loggedInRoles.includes('vice presidente') || 
                    loggedInRoles.includes('gerente') || 
                    loggedInRoles.includes('owner') || 
                    loggedInRoles.includes('night boss')
                ));

                membersOfRole.forEach(m => {
                    const initial = m.name ? m.name.charAt(0).toUpperCase() : '?';
                    const ceoControls = isCEO ? `
                        <div style="display:flex; flex-direction:column; gap:4px; margin-left:auto; justify-content:center; align-items:center;">
                            <button onclick="promoteMember('${m.id}')" title="Promover" style="background:none; border:none; color:var(--success); cursor:pointer; font-size:0.85rem;"><i class="fa-solid fa-arrow-up"></i></button>
                            <button onclick="demoteMember('${m.id}')" title="Rebaixar" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:0.85rem;"><i class="fa-solid fa-arrow-down"></i></button>
                        </div>
                    ` : '';

                    const avatarContent = m.avatarUrl 
                        ? `<img src="${m.avatarUrl}" alt="${m.name}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><span style="display:none; align-items:center; justify-content:center; width:100%; height:100%;">${initial}</span>` 
                        : initial;

                    hierarchyHtml += `
                        <div class="hierarchy-member-card" style="display:flex; align-items:center; width:100%; cursor: pointer;" onclick="window.handleMemberCardClick('${m.id}')">
                            <div class="hierarchy-member-avatar ${m.liveUrl ? 'is-live' : ''}" ${m.liveUrl ? `onclick="window.open('${m.liveUrl.startsWith('http') ? m.liveUrl : 'https://' + m.liveUrl}', '_blank'); event.stopPropagation();" title="Assistir Live"` : ''}>${avatarContent}</div>
                            <div class="hierarchy-member-info">
                                <span class="hierarchy-member-name">${m.name}</span>
                                <span class="hierarchy-member-status">${m.role}</span>
                            </div>
                            ${ceoControls}
                        </div>
                    `;
                });
            }

            hierarchyHtml += `
                    </div>
                </div>
            `;
        });
    }

    hierarchyHtml += '</div>';
    itemsGrid.innerHTML = hierarchyHtml;
}

// ─── RENDER VAULT (BAÚ) ───────────────────────────────────────────────────
function renderVaultScreen() {
    if (!isVaultUnlocked) {
        itemsGrid.innerHTML = `
            <div class="vault-lock-screen">
                <i class="fa-solid fa-vault vault-lock-icon"></i>
                <h2 style="font-weight:800; font-size:1.4rem;">Baú da Oficina Protegido</h2>
                <p style="font-size:0.88rem; color:var(--white-muted);">Este painel é de acesso restrito. É necessário inserir a senha de abertura para ver os materiais e movimentações.</p>
                <button class="modal-submit-btn" onclick="showModal(modalVaultAuth)" style="width:auto; padding:12px 30px;">
                    <i class="fa-solid fa-key"></i> Digitar Senha
                </button>
            </div>
        `;
        return;
    }

    const isAdmin = db.isAdminLoggedIn();
    
    // Vault notices (mock notices in in-memory vault)
    const vaultNotices = [
        "Atenção: Todo material retirado deve ser registrado imediatamente para batermos o balanço semanal.",
        "Meta de plástico refinado desta semana: 2.000 unidades.",
        "Senha do Baú atualizada recentemente. Não compartilhe com terceiros."
    ];

    let logsHtml = '';
    if (activeVaultLogs.length === 0) {
        logsHtml = `<tr><td colspan="5" style="text-align:center; color:var(--white-dim); padding:20px 0;">Nenhuma movimentação registrada no Baú.</td></tr>`;
    } else {
        logsHtml = activeVaultLogs.map(log => {
            const dateStr = new Date(log.timestamp).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
            });
            const actionClass = log.action === 'Entrada' ? 'log-action-entrada' : 'log-action-saida';
            
            return `
                <tr>
                    <td style="color:var(--white-muted);">${dateStr}</td>
                    <td style="font-weight:600;">${log.member}</td>
                    <td class="${actionClass}">${log.action}</td>
                    <td style="font-weight:600;">${log.item}</td>
                    <td style="color:var(--red-primary); font-weight:700;">${log.quantity}x</td>
                </tr>
            `;
        }).join('');
    }

    itemsGrid.innerHTML = `
        <div class="vault-unlocked-container">
            <div class="vault-announcements">
                <div class="vault-announcement-header">
                    <i class="fa-solid fa-bullhorn"></i> Quadro de Avisos Baú
                </div>
                ${vaultNotices.map(n => `<div class="vault-announcement-item">${n}</div>`).join('')}
            </div>
            <div class="vault-logs-panel">
                <div class="vault-logs-header">
                    <h3>Histórico de Entrada e Saída</h3>
                    <div style="display:flex; gap:10px;">
                        ${isAdmin ? `
                            <button class="action-btn danger-btn" onclick="openVaultChangePassModal()" title="Mudar Senha">
                                <i class="fa-solid fa-lock"></i> Senha
                            </button>
                        ` : ''}
                        <button class="action-btn success-btn" onclick="openVaultLogModal()">
                            <i class="fa-solid fa-right-left"></i> Registrar
                        </button>
                    </div>
                </div>
                <div class="vault-table-wrapper">
                    <table class="vault-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Membro</th>
                                <th>Operação</th>
                                <th>Item</th>
                                <th>Qtd</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${logsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// ─── ACTIONS PRESETS AND RENDERER ─────────────────────────────────────────
let presetActions = {};
function initPresetActions() {
    try {
        presetActions = JSON.parse(localStorage.getItem('preset_actions_local') || '{}');
    } catch(e){}
    // Upgrade check: if old keys exist, or roubo_247 is missing, reset presetActions to current rules
    if (Object.keys(presetActions).length === 0 || presetActions['carro_forte'] || !presetActions['roubo_247'] || !presetActions['boosting']) {
        presetActions = {
            'roubo_247': {
                id: 'roubo_247',
                name: 'Roubo à 24/7 (Supermarket)',
                desc: 'Assalto rápido ao supermercado 24/7 com negociação e troca de tiros obrigatória.',
                members: 'Mínimo 2 e máximo 4 criminosos. Polícia: 4 policiais.',
                weapons: 'Pistola.',
                rules: [
                    'O roubo será realizado exclusivamente com troca de tiros, não sendo permitida resolução em fuga após o início da ação.',
                    'Ação limitada a solo, isto é, é proibido subir em qualquer elevação para trocar tiro (pular muro e obstáculos é permitido, desde que não atire de cima).',
                    'O roubo não pode começar sem ter o refém dentro da loja.',
                    'Na falta de atendimento policial, será obrigatório que os envolvidos aguardem 30 minutos após a finalização do hacking antes de se retirar do local.',
                    'Se os criminosos estiverem no mínimo de pessoas permitido (2), a polícia pode (se quiser) diminuir a quantidade de policiais na ação. Porém, a resposta inicial da polícia sempre será de 4 oficiais.',
                    'O refém serve só para negociar o final do roubo (máximo 1 refém), evitando que a troca de tiros comece antes do roubo terminar.',
                    'Não é permitido iniciar a troca de tiros antes da liberação do refém.',
                    'Durante a negociação, é estritamente proibido, tanto para criminosos quanto para a polícia, realizar roleplay de blefe.',
                    'A polícia é obrigada a respeitar a negociação, não avançando durante esse período, com exceção do negociador e um veículo de apoio para resgate de reféns.',
                    'Após a conclusão do assalto, os envolvidos podem se retirar do local, caso a polícia não chegue no local a tempo.',
                    'Qualquer tentativa de estender a ação, fugir do local ou desviar da proposta do heist será considerada quebra de regra.',
                    'É proibido realizar o roubo à 24/7 de forma repetitiva visando farmar dinheiro. A prática de spam de roubos será considerada quebra de regra com agravante.',
                    'É extremamente proibido lootear ou pegar qualquer item da polícia.',
                    'Proibido o uso da seringa durante a ação.',
                    'Proibido uso de blindados e veículos para rotacionar.',
                    'Proibido utilizar o píer de Chumash.',
                    'Os criminosos não podem se afastar muito da 24/7 durante a ação, pois isso foge do contexto.',
                    'Os criminosos deverão manter o dinheiro em seus próprios inventários, sendo proibido armazená-lo em carros, baús ou qualquer outro local. O dinheiro deverá permanecer nos inventários até o fim da ação/perseguição.'
                ]
            },
            'joalheria': {
                id: 'joalheria',
                name: 'Roubo a Joalheria',
                desc: 'Assalto tático à joalheria de Rockford Hills com limite de perímetro e troca de tiros direta.',
                members: 'Obrigatório 8 criminosos. Polícia: Máximo de 9 policiais.',
                weapons: 'Submetralhadoras.',
                rules: [
                    'Negociação: não tem negociação, isto é, não é permitido ter reféns.',
                    'Ação limitada a solo, isto é, é proibido subir em qualquer elevação para trocar tiro (pular muro e obstáculos é permitido, desde que não atire de cima).',
                    'Extremamente proibido utilizar MLO\'s/interior (toda Little Tokyo, loja de roupa, cabeleireiro, prefeitura e metrô) externos ao perímetro da joalheria para vantagem tática.',
                    'É proibido sair do perímetro definido após o início da ação.',
                    'Não é permitido iniciar a ação sem o número mínimo exigido (8 criminosos).',
                    'A ação deve ter coerência e organização prévia, não sendo permitido iniciar de forma desordenada ou improvisada.',
                    'Liberado a polícia utilizar o máximo de 2 smokes e 2 stun.',
                    'Proibido uso de blindados e veículos para rotacionar.',
                    'Proibido o uso de helicóptero.',
                    'Proibido looting policial após fim da troca de tiros (looting liberado apenas durante a ação, após o último oficial cair, não será mais permitido lootear).',
                    'Pode-se lootear durante a ação apenas: bandagem, munição, spike, colete e placas balísticas.',
                    'Proibido o uso da seringa durante a ação.',
                    'Os criminosos deverão manter o dinheiro em seus próprios inventários, sendo proibido armazená-lo em carros, baús ou qualquer outro local. O dinheiro deverá permanecer nos inventários até o fim da ação/perseguição.',
                    'Observação: Não é permitido utilizar o interior para troca de tiros o Bombeiro/Redondo, mas é permitido utilizar o espaço para rotação.',
                    'Observação 2: O perímetro vai até a calçada, ficando sempre rente a ela.'
                ]
            },
            'fleeca_tiroteio': {
                id: 'fleeca_tiroteio',
                name: 'Banco Fleeca (Troca de Tiros)',
                desc: 'Assalto ao banco Fleeca configurado para confronto direto (troca de tiros) no perímetro.',
                members: 'Mínimo de 4, máximo de 8 criminosos. Polícia: Máximo de 9 policiais.',
                weapons: 'Submetralhadoras.',
                rules: [
                    'Negociação: não tem negociação, isto é, não é permitido ter reféns.',
                    'Não pode ter veículo na porta do banco.',
                    'É proibido subir em prédios, telhados ou qualquer lugar alto sem uma forma real de acesso (escada, lixeira, entrada do prédio ou qualquer objeto do mapa que realmente dê acesso).',
                    'Na falta de atendimento policial, será obrigatório que os envolvidos aguardem 30 minutos após a finalização do hacking antes de se retirar do local.',
                    'A ação deve respeitar escalonamento e não pode ser iniciada apenas com intuito de farm ou confronto forçado.',
                    'Proibido o uso da seringa durante a ação.',
                    'Liberado a polícia utilizar o máximo de 2 smokes e 2 stun.',
                    'Proibido reparar o blindado durante a ação.',
                    'Pode reparar o helicóptero uma única vez durante a ação caso os criminosos permaneçam em uma posição sem counter.',
                    'Proibido looting policial após fim da troca de tiros (looting liberado apenas durante a ação, após o último oficial cair, não será mais permitido lootear).',
                    'Pode-se lootear durante a ação apenas: bandagem, munição, spike, colete e placas balísticas.',
                    'Os criminosos deverão manter o dinheiro em seus próprios inventários, sendo proibido armazená-lo em carros, baús ou qualquer outro local. O dinheiro deverá permanecer nos inventários até o fim da ação/perseguição.',
                    'Perímetro do Fleeca da Great Ocean Highway (Banco 6/8): Não é permitido utilizar o interior para troca de tiros no Estacionamento Colorido, mas é permitido utilizar o espaço para rotação.'
                ]
            },
            'fleeca_fuga': {
                id: 'fleeca_fuga',
                name: 'Banco Fleeca (Fuga)',
                desc: 'Assalto ao banco Fleeca configurado para fuga negociada.',
                members: 'Mínimo de 4, máximo de 8 criminosos, obrigatório ter no mínimo 3 dentro do banco. Polícia: 9 veículos terrestres e 1 helicóptero.',
                weapons: 'Obrigatório no mínimo 2 submetralhadoras.',
                rules: [
                    'Máximo de 2 veículos no banco, Máximo de 1 veículo de apoio. Total máximo de 3 veículos.',
                    'Na ausência de helicóptero da polícia, será permitido o uso de até 10 veículos terrestres.',
                    'Negociação: obrigatória, máximo 2 reféns.',
                    'Se for na fuga, os dois veículos devem estar estacionados na porta do banco.',
                    'O refém serve só para negociar o final do roubo e negociar uma fuga do banco sem disparos. (Não é permitido negociar itens, dinheiro ou qualquer coisa do gênero).',
                    'Durante a negociação, é estritamente proibido, tanto para criminosos quanto para a polícia, realizar roleplay de blefe.',
                    'A ação deve respeitar escalonamento e não pode ser iniciada apenas com intuito de farm ou confronto forçado.',
                    'Os criminosos deverão manter o dinheiro em seus próprios inventários, sendo proibido armazená-lo em carros, baús ou qualquer outro local. O dinheiro deverá permanecer nos inventários até o fim da ação/perseguição.'
                ]
            },
            'ammunation': {
                id: 'ammunation',
                name: 'Roubo à Ammunation',
                desc: 'Assalto rápido à loja de armas Ammunation.',
                members: 'Máximo de 4 criminosos, obrigatório que todos estejam dentro da Ammunation. Polícia: 4 veículos terrestres.',
                weapons: 'Obrigatório no mínimo 2 pistolas.',
                rules: [
                    'Máximo de 1 veículo do ilegal. Proibido apoio/resgate.',
                    'Proibido o uso de helicóptero pela polícia.',
                    'Negociação: obrigatória, no máximo 1 refém.',
                    'A ação é exclusivamente voltada para fuga, não devendo ocorrer troca de tiros.',
                    'O refém serve só para negociar o final do roubo e negociar uma fuga sem disparos (não é permitido negociar itens, dinheiro ou similar).',
                    'Não é permitido iniciar a ação sem o número mínimo exigido.',
                    'Não é permitido iniciar a ação sem o refém estar dentro da loja.',
                    'A ação deve respeitar escalonamento e não pode ser iniciada apenas com intuito de farm.',
                    'Os criminosos deverão manter o dinheiro em seus próprios inventários, sendo proibido armazená-lo em carros, baús ou qualquer outro local. O dinheiro deverá permanecer nos inventários até o fim da ação/perseguição.'
                ]
            },
            'paleto': {
                id: 'paleto',
                name: 'Roubo ao Banco de Paleto',
                desc: 'Invasão em grande escala ao banco de Paleto Bay com negociação e regras estritas de perímetro.',
                members: 'Obrigatório 10 criminosos. Polícia: máximo de 11 policiais.',
                weapons: 'Submetralhadoras.',
                rules: [
                    'Negociação: obrigatória, no máximo 2 reféns.',
                    'É proibido subir em prédios, telhados ou qualquer lugar alto sem uma forma real de acesso (escada, lixeira, entrada do prédio ou similar).',
                    'Extremamente proibido utilizar interiores sem ser o do banco, como por exemplo o interior do galinheiro.',
                    'A polícia é obrigada a respeitar a negociação, não avançando durante esse período, com exceção do negociador e um veículo de apoio para resgate.',
                    'O refém serve só para negociar o final do roubo, evitando que a troca de tiros comece antes do roubo terminar.',
                    'Liberado da polícia utilizar o máximo de 2 smokes e 2 stun.',
                    'Proibido looting policial após fim da troca de tiros (looting liberado apenas durante a ação, proibido após o último oficial cair).',
                    'Pode-se lootear durante a ação apenas: bandagem, munição, spike, colete e placas balísticas.',
                    'Proibido utilizar o drone.',
                    'Os criminosos deverão manter o dinheiro em seus próprios inventários, sendo proibido armazená-lo em carros, baús ou qualquer outro local. O dinheiro deverá permanecer nos inventários até o fim da ação/perseguição.'
                ]
            },
            'supply': {
                id: 'supply',
                name: 'Supply Gang x Gang',
                desc: 'Ação de dominação de território com disputa direta entre gangues.',
                members: 'Máximo de 6 criminosos (regra dos 6). Polícia não participa diretamente.',
                weapons: 'Livre para qualquer armamento.',
                rules: [
                    'Negociação: não há.',
                    'É liberado o looting durante a ação (respeitando a regra de pocket wipe), entretanto, após a queda do último participante da gangue oposta, não será mais permitido realizar looting.',
                    'A polícia não pode participar da troca de tiros nesta ação, a polícia deve aguardar o término da ação para iniciar a perseguição na gangue sobrevivente.',
                    'É proibido sair do perímetro após o início da ação.',
                    'É proibido que todos os participantes se dirijam ao hospital antes do fim da ação.',
                    'Está liberado o uso de seringa durante a ação.'
                ]
            },
            'rota_68': {
                id: 'rota_68',
                name: 'Roubo ao Banco da Rota 68',
                desc: 'Assalto ao banco da Rota 68 configurado para fuga.',
                members: 'Mínimo 4, máximo 8 criminosos. Polícia: máximo de 10 veículos terrestres, máximo de 2 helicópteros.',
                weapons: 'Obrigatório todos estarem com submetralhadora.',
                rules: [
                    'Máximo de 3 veículos na frente do banco, Máximo de 1 veículo de apoio.',
                    'Na ausência de helicóptero policial, será permitido o uso de até 12 veículos terrestres.',
                    'Negociação: obrigatória, no máximo 1 refém.',
                    'Os veículos devem estar estacionados na porta do banco.',
                    'O refém serve só para negociar o final do roubo e negociar uma fuga do banco sem disparos (proibido negociar itens, dinheiro ou similar).',
                    'Durante a negociação, é estritamente proibido realizar roleplay de blefe por ambas as partes.',
                    'Na falta de atendimento policial, será obrigatório que os envolvidos aguardem 30 minutos após a finalização do hacking antes de se retirar do local.',
                    'A ação deve respeitar escalonamento e não pode ser iniciada apenas com intuito de farm ou confronto forçado.',
                    'Proibido reparar o veículo durante a perseguição.',
                    'Os criminosos deverão manter o dinheiro em seus próprios inventários, sendo proibido armazená-lo em carros, baús ou qualquer outro local. O dinheiro deverá permanecer nos inventários até o fim da ação/perseguição.'
                ]
            },
            'bobcat': {
                id: 'bobcat',
                name: 'Roubo ao Bobcat Security',
                desc: 'Invasão tática à instalação da Bobcat Security sem negociação.',
                members: 'Máximo de 6 criminosos. Polícia: máximo de 8 policiais.',
                weapons: 'Obrigatório todos estarem com submetralhadora.',
                rules: [
                    'Negociação: não tem negociação, isto é, não é permitido ter reféns.',
                    'Todos os bandidos devem permanecer dentro do Bobcat Security.',
                    'Os criminosos não podem ficar dentro do cofre (devem apenas pegar o que tem dentro e sair).',
                    'É proibido sair do perímetro após o início da ação.',
                    'A ação deve ter coerência e organização prévia, não sendo permitido iniciar de forma desordenada ou improvisada.',
                    'Liberado a polícia utilizar o máximo de 3 smokes e 3 stun.',
                    'Na falta de atendimento policial, será obrigatório que os envolvidos aguardem 45 minutos após a finalização do hacking antes de se retirar do local.',
                    'Proibido looting policial após fim da troca de tiros (looting liberado apenas durante a ação, proibido após o último oficial cair).',
                    'Pode-se lootear durante a ação apenas: bandagem, munição, spike, colete e placas balísticas.',
                    'Proibido o uso da seringa durante a ação.',
                    'Proibido colocar veículos dentro do interior.',
                    'Os criminosos deverão manter o dinheiro em seus próprios inventários, sendo proibido armazená-lo em carros, baús ou qualquer outro local. O dinheiro deverá permanecer nos inventários até o fim da ação/perseguição.'
                ]
            },
            'banco_central': {
                id: 'banco_central',
                name: 'Roubo ao Banco Central',
                desc: 'Assalto de grande escala ao Banco Central com negociação, restrições táticas e armamento pesado.',
                members: 'Obrigatório 12 criminosos. Polícia: máximo de 14 policiais.',
                weapons: 'Obrigatório todos estarem com classe 3 (AK-47/Groza).',
                rules: [
                    'Negociação: obrigatória, no máximo 2 reféns.',
                    'É proibido subir em prédios, telhados ou qualquer lugar alto sem uma forma real de acesso (escada, lixeira, entrada do prédio ou similar).',
                    'É proibido sair do perímetro após o início da ação.',
                    'Máximo de 5 criminosos na sala em frente ao cofre do banco (proibido ficar dentro do cofre final).',
                    'Durante a negociação, é estritamente proibido realizar roleplay de blefe por ambas as partes.',
                    'A polícia é obrigada a respeitar a negociação, não avançando durante esse período, com exceção do negociador e um veículo de apoio.',
                    'A ação deve ter coerência e organização prévia, não sendo permitido iniciar de forma desordenada ou improvisada.',
                    'Liberado a polícia utilizar o máximo de 4 smokes e 4 stun. Caso utilize uma delas e ela falhe, ela não entrará na contagem.',
                    'Na falta de atendimento policial, será obrigatório que os envolvidos aguardem 45 minutos após a finalização do hacking antes de se retirar do local.',
                    'Proibido looting policial após fim da troca de tiros (looting liberado apenas durante a ação, proibido após o último oficial cair).',
                    'Pode-se lootear durante a ação apenas: bandagem, munição, spike, colete e placas balísticas.',
                    'Proibido colocar veículos dentro do interior.',
                    'Proibido o uso da seringa durante a ação.',
                    'Proibido reparar o blindado durante a ação.',
                    'Pode reparar o helicóptero uma única vez durante a ação caso os criminosos permaneçam em uma posição sem counter.',
                    'Os criminosos deverão manter o dinheiro em seus próprios inventários, sendo proibido armazená-lo em carros, baús ou qualquer outro local. O dinheiro deverá permanecer nos inventários até o fim da ação/perseguição.'
                ]
            },
            'boosting': {
                id: 'boosting',
                name: 'Regras de Boosting',
                desc: 'Diretrizes gerais para a realização de contratos de Boosting.',
                members: 'Limite máximo de participantes no boosting: 6 integrantes.',
                weapons: 'Armamento geral.',
                rules: [
                    'É proibido iniciar ou participar de qualquer boosting nos 15 minutos anteriores e nos 15 minutos posteriores ao horário de RR.',
                    'Proibido o uso de veículos para matar os NPC\'s armados.',
                    'Máximo de 3 veículos de apoio.'
                ]
            },
            'coke_run': {
                id: 'coke_run',
                name: 'Regras de Coke Run',
                desc: 'Diretrizes gerais para transporte e perseguição de Coke Run.',
                members: 'Número máximo de criminosos na ação: 8 pessoas no total (pode começar sem número mínimo).',
                weapons: 'Armamento geral.',
                rules: [
                    'Na perseguição inicial podem participar 6 unidades policiais no total, podendo ser apenas 1 aérea. A cada veículo de apoio envolvido na fuga, é adicionada mais 1 unidade na perseguição.',
                    'A polícia pode aumentar o número de unidades, se necessário, caso os criminosos coloquem a vida dos oficiais em risco (principalmente se começarem a atirar contra a polícia).',
                    'Proibido o uso de veículos para matar os NPCs armados.',
                    'É proibido a polícia entrar no veículo do Coke Run antes do término da ação.'
                ]
            }
        };
        localStorage.setItem('preset_actions_local', JSON.stringify(presetActions));
    }
}
initPresetActions();

let currentSelectedPreset = 'roubo_247';

function renderIllegalActions() {
    // Left pane: Start action form
    // Right pane: Selected action details + past logs
    let listHtml = '';
    if (activeIllegalRecords.length === 0) {
        listHtml = `<p style="color:var(--white-dim); text-align:center; padding:20px 0; font-size:0.85rem;">Nenhuma ação registrada no histórico.</p>`;
    } else {
        listHtml = activeIllegalRecords.map(rec => {
            const dateStr = new Date(rec.timestamp).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
            });
            const isSuccess = rec.outcome === 'Sucesso' || rec.outcome === 'Deu Bom';
            return `
                <div class="mural-card" style="border-left-color:#f59e0b; padding:12px; margin-bottom:10px;">
                    <div class="mural-card-top" style="display:flex; justify-content:space-between; align-items:center;">
                        <div class="mural-title-block" style="display:flex; align-items:center; gap:8px;">
                            <span class="mural-badge" style="background:${isSuccess ? '#22c55e' : '#d0021b'}; color:white; font-size:0.75rem; padding:2px 6px; border-radius:4px;">${rec.outcome}</span>
                            <h4 class="mural-title-text" style="font-size:0.9rem; font-weight:700; color:var(--white-main);">${rec.description}</h4>
                        </div>
                        <div class="mural-date" style="font-size:0.75rem; color:var(--white-muted);">${dateStr}</div>
                    </div>
                    <p class="mural-body-text" style="font-size:0.8rem; color:var(--white-off); margin-top:6px; line-height:1.4;">
                        <strong>Participantes:</strong> ${rec.participants}<br>
                        <strong>Loot Obtido:</strong> ${rec.loot || 'Nenhum'}
                    </p>
                    <div class="mural-card-footer" style="margin-top:6px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.03); padding-top:6px;">
                        <span style="font-size:0.7rem; color:var(--white-dim);">Registrado por: Chefiados</span>
                        <button class="btn-delete-post" onclick="deleteIllegalRecord('${rec.id}')" title="Excluir Registro" style="background:none; border:none; color:var(--danger); cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
        }).join('');
    }

    const preset = presetActions[currentSelectedPreset] || { name: 'Outra Ação', desc: 'Ação personalizada', members: 'N/A', weapons: 'N/A', rules: [] };

    itemsGrid.innerHTML = `
        <div class="actions-container">
            <!-- LEFT PANEL: START/INIT FORM -->
            <div class="actions-sidebar">
                <h3 style="font-size:1rem; font-weight:700; color:#f59e0b; border-bottom:1px solid var(--border-dark); padding-bottom:10px; margin-bottom:10px;">
                    <i class="fa-solid fa-play"></i> Iniciar Nova Ação
                </h3>
                <form id="actionStartForm" style="display:flex; flex-direction:column; gap:12px;">
                    <div class="form-group">
                        <label for="actionPresetSelect" style="font-size:0.78rem; font-weight:600; color:var(--white-dim);">Tipo de Ação</label>
                        <select id="actionPresetSelect" onchange="handlePresetChange(this.value)" style="width:100%; padding:10px; background:var(--black-panel); border:1px solid var(--border-dark); border-radius:var(--radius-sm); color:var(--white-main); margin-bottom:8px;">
                            ${Object.keys(presetActions).map(key => `
                                <option value="${key}" ${currentSelectedPreset === key ? 'selected' : ''}>${presetActions[key].name}</option>
                            `).join('')}
                            <option value="outro" ${currentSelectedPreset === 'outro' ? 'selected' : ''}>Outra (Personalizada)</option>
                        </select>
                        <div style="display:flex; gap:8px;">
                            <button type="button" class="action-btn success-btn" onclick="openActionPresetModal('')" style="flex:1; justify-content:center; font-size:0.75rem; padding:4px 8px; background:rgba(245,158,11,0.08); border-color:rgba(245,158,11,0.25); color:#f59e0b; font-weight:600;">
                                <i class="fa-solid fa-plus"></i> Novo Tipo
                            </button>
                            ${currentSelectedPreset !== 'outro' ? `
                                <button type="button" class="action-btn" onclick="openActionPresetModal('${currentSelectedPreset}')" style="flex:1; justify-content:center; font-size:0.75rem; padding:4px 8px; font-weight:600;">
                                    <i class="fa-solid fa-pen"></i> Alterar Tipo
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    <div class="form-group" id="customActionNameGroup" style="display:${currentSelectedPreset === 'outro' ? 'block' : 'none'};">
                        <label for="actionCustomName" style="font-size:0.78rem; font-weight:600; color:var(--white-dim);">Nome da Ação</label>
                        <input type="text" id="actionCustomName" placeholder="Ex: Assalto ao Ninho" style="width:100%; padding:10px; background:var(--black-panel); border:1px solid var(--border-dark); border-radius:var(--radius-sm); color:var(--white-main);">
                    </div>

                    <div class="form-group">
                        <label for="actionMembersInput" style="font-size:0.78rem; font-weight:600; color:var(--white-dim);">Integrantes / Participantes</label>
                        <input type="text" id="actionMembersInput" required placeholder="Ex: Bigas, Carlinhos, Mateus" style="width:100%; padding:10px; background:var(--black-panel); border:1px solid var(--border-dark); border-radius:var(--radius-sm); color:var(--white-main);">
                    </div>

                    <div class="form-group">
                        <label for="actionLootInput" style="font-size:0.78rem; font-weight:600; color:var(--white-dim);">O que veio da ação (Loot)</label>
                        <textarea id="actionLootInput" rows="2" placeholder="Ex: 20x Ouro, 1x USB de Fuga" style="width:100%; padding:10px; background:var(--black-panel); border:1px solid var(--border-dark); border-radius:var(--radius-sm); color:var(--white-main); resize:none;"></textarea>
                    </div>

                    <div class="form-group">
                        <label style="font-size:0.78rem; font-weight:600; color:var(--white-dim); display:block; margin-bottom:6px;">Resultado da Ação</label>
                        <div style="display:flex; gap:16px;">
                            <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:0.85rem; color:var(--white-off);">
                                <input type="radio" name="actionOutcomeRadio" value="Deu Bom" checked style="accent-color:#22c55e;"> Deu Bom (Sucesso)
                            </label>
                            <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:0.85rem; color:var(--white-off);">
                                <input type="radio" name="actionOutcomeRadio" value="Deu Ruim" style="accent-color:#d0021b;"> Deu Ruim (Fracasso)
                            </label>
                        </div>
                    </div>

                    <button type="submit" class="modal-submit-btn" style="background:#f59e0b; color:black; font-weight:700; width:100%; padding:12px; margin-top:6px;">
                        <i class="fa-solid fa-check"></i> Registrar Ação
                    </button>
                </form>
            </div>

            <!-- RIGHT PANEL: RULES PREVIEW & LOGS -->
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Active Rules Box -->
                <div class="vault-logs-panel" style="border-left: 4px solid #f59e0b; cursor: pointer;" onclick="window.handleActionPresetClick('${preset.id || currentSelectedPreset}')">
                    <h3 style="font-size:1.1rem; font-weight:700; color:#f59e0b; display:flex; align-items:center; gap:8px;">
                        <i class="fa-solid fa-scroll"></i> Regras & Planejamento: ${preset.name}
                    </h3>
                    <p style="font-size:0.88rem; color:var(--white-off); line-height:1.5; margin-bottom:10px;">${preset.desc}</p>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
                        <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid var(--border-dark);">
                            <span style="font-size:0.75rem; color:var(--white-muted); display:block; margin-bottom:2px;">Integrantes Mínimos</span>
                            <strong style="color:var(--white-main); font-size:0.88rem;">${preset.members}</strong>
                        </div>
                        <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid var(--border-dark);">
                            <span style="font-size:0.75rem; color:var(--white-muted); display:block; margin-bottom:2px;">Armamento Recomendado</span>
                            <strong style="color:var(--white-main); font-size:0.88rem;">${preset.weapons}</strong>
                        </div>
                    </div>
                    <div class="action-rules-box">
                        <div class="action-rules-title">Diretrizes da Ação</div>
                        ${preset.rules.map(r => `<div class="action-rules-item">• ${r}</div>`).join('')}
                    </div>
                </div>

                <!-- History Logs -->
                <div class="vault-logs-panel">
                    <div class="vault-logs-header">
                        <h3>Histórico de Ações Realizadas</h3>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${listHtml}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Bind form submit
    const actionForm = document.getElementById('actionStartForm');
    if (actionForm) {
        actionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const presetSelect = document.getElementById('actionPresetSelect').value;
            const customName = document.getElementById('actionCustomName').value.trim();
            const participants = document.getElementById('actionMembersInput').value.trim();
            const loot = document.getElementById('actionLootInput').value.trim();
            const outcome = document.querySelector('input[name="actionOutcomeRadio"]:checked').value;

            let finalName = '';
            if (presetSelect === 'outro') {
                finalName = customName || 'Ação Personalizada';
            } else {
                finalName = presetActions[presetSelect].name;
            }

            const record = {
                id: 'act_' + Date.now(),
                timestamp: new Date().toISOString(),
                description: finalName,
                participants: participants,
                loot: loot,
                outcome: outcome
            };

            db.saveIllegalRecord(record);
            await loadData();
            renderIllegalActions();
        });
    }
}

window.handlePresetChange = function(val) {
    currentSelectedPreset = val;
    renderIllegalActions();
};

function renderIllegalRules() {
    const rules = [
        "1. Limite máximo de integrantes por ação é definido por regras municipais gerais.",
        "2. Fugas planejadas devem possuir no mínimo um piloto de fuga credenciado na banca.",
        "3. Em caso de apreensão, preencher imediatamente o relatório de Carros Detidos para planejamento de resgates.",
        "4. Todo e qualquer lucro proveniente de roubos deve ter a taxa da facção depositada no Baú Ilegal em até 24 horas."
    ];

    itemsGrid.innerHTML = `
        <div class="vault-logs-panel">
            <div class="vault-logs-header">
                <h3>Regras Básicas de Ações</h3>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px;">
                ${rules.map((r, i) => `
                    <div style="background:var(--black-panel); padding:16px; border-radius:var(--radius-md); border-left:3px solid #f59e0b;">
                        <p style="font-size:0.88rem; color:var(--white-off); line-height:1.5;">${r}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderIllegalBoosting() {
    // Load escape cards
    let escapeCards = [];
    try {
        escapeCards = JSON.parse(localStorage.getItem('escape_cards_local') || '[]');
    } catch(e){}
    if (escapeCards.length === 0) {
        escapeCards = [
            { id: 'esc_1', title: 'Fuga dos Canais de Drenagem', location: 'Canais de escoamento rápido na parte sul da cidade.', photo: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=400' },
            { id: 'esc_2', title: 'Túnel Ferroviário Oculto', location: 'Túnel desativado nos trilhos na saída da rodovia leste.', photo: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=400' }
        ];
        localStorage.setItem('escape_cards_local', JSON.stringify(escapeCards));
    }

    const isAllowedEdit = hasPermission('edit_services');

    // Local state simulation for signal blockers if not initialized
    if (!window.activeBlockers) {
        window.activeBlockers = [
            { id: 'b1', name: 'Bloqueador GPS Los Santos Customs', location: 'Burton', status: 'Ativo', signalDisruption: 85 },
            { id: 'b2', name: 'Disruptor de Frequência Policial', location: 'Pillbox Hill', status: 'Inativo', signalDisruption: 60 },
            { id: 'b3', name: 'Bypass de Rastreador de Carga', location: 'Docks', status: 'Ativo', signalDisruption: 90 },
        ];
    }

    const toggleBlockerStatus = (id) => {
        const blocker = window.activeBlockers.find(b => b.id === id);
        if (blocker) {
            blocker.status = blocker.status === 'Ativo' ? 'Inativo' : 'Ativo';
            renderIllegalBoosting();
        }
    };
    window.toggleBlockerStatus = toggleBlockerStatus;

    const activeCount = window.activeBlockers.filter(b => b.status === 'Ativo').length;
    const avgDisruption = Math.round(window.activeBlockers.reduce((acc, curr) => acc + (curr.status === 'Ativo' ? curr.signalDisruption : 0), 0) / window.activeBlockers.length);

    const escapeCardsHtml = escapeCards.map(esc => {
        return `
            <div class="recipe-card" style="padding:15px; display:flex; flex-direction:column; gap:12px; cursor: pointer;" onclick="window.handleEscapeCardClick('${esc.id}')">
                <div style="height:140px; border-radius:8px; overflow:hidden; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05);">
                    <img src="${esc.photo}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='icones/sucata.png';">
                </div>
                <div>
                    <h4 style="font-size:0.95rem; font-weight:700; color:var(--white-main);">${esc.title}</h4>
                    <p style="font-size:0.8rem; color:var(--white-muted); margin-top:4px; line-height:1.4;">${esc.location}</p>
                </div>
                ${isAllowedEdit ? `
                    <div style="display:flex; gap:8px; margin-top:auto; border-top:1px solid rgba(255,255,255,0.05); padding-top:10px;">
                        <button class="action-btn" onclick="event.stopPropagation(); openEscapeCardModal('${esc.id}')" style="flex:1; justify-content:center; padding:4px 8px; font-size:0.75rem;">
                            <i class="fa-solid fa-pen"></i> Editar
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    itemsGrid.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:20px; padding-bottom:40px;">
            <!-- ESCAPE CARDS PANEL -->
            <div class="vault-logs-panel">
                <div class="vault-logs-header">
                    <h3>Rotas e Trajetos de Fuga</h3>
                    ${isAllowedEdit ? `
                        <button class="action-btn success-btn" onclick="openEscapeCardModal('')" style="background:rgba(245,158,11,0.08); border-color:rgba(245,158,11,0.25); color:#f59e0b;">
                            <i class="fa-solid fa-plus"></i> Novo Trajeto
                        </button>
                    ` : ''}
                </div>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
                    ${escapeCardsHtml}
                </div>
            </div>

            <!-- SIGNAL BLOCKERS PANEL -->
            <div class="vault-logs-panel">
                <div class="vault-logs-header" style="flex-wrap:wrap; gap:12px;">
                    <div>
                        <h3>Bloqueios e Disruptores Disponíveis</h3>
                        <p style="font-size:0.8rem; color:var(--white-muted); margin-top:2px;">Gerenciamento de sinal ativo para facilitar fugas e interceptar carregamentos.</p>
                    </div>
                    <div style="background:rgba(245, 158, 11, 0.08); padding:8px 16px; border-radius:8px; border:1px solid rgba(245,158,11,0.25); text-align:right;">
                        <span style="font-size:0.75rem; color:var(--white-muted); display:block;">Disrupção Média de Sinal</span>
                        <strong style="color:#f59e0b; font-size:1.1rem;">${avgDisruption}%</strong>
                    </div>
                </div>

                <div class="vault-table-wrapper">
                    <table class="vault-table">
                        <thead>
                            <tr>
                                <th>Dispositivo</th>
                                <th>Localização / Setor</th>
                                <th>Eficiência</th>
                                <th>Status</th>
                                <th style="text-align:right;">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${window.activeBlockers.map(b => {
                                const isActive = b.status === 'Ativo';
                                return `
                                    <tr>
                                        <td style="font-weight:700; color:var(--white-main);">${b.name}</td>
                                        <td style="color:var(--white-muted);">${b.location}</td>
                                        <td style="color:#f59e0b; font-weight:bold;">${b.signalDisruption}%</td>
                                        <td>
                                            <span class="member-status-label" style="background:${isActive ? 'rgba(34,197,94,0.08)' : 'rgba(208,2,27,0.08)'}; color:${isActive ? 'var(--success)' : 'var(--danger)'}; border-color:${isActive ? 'rgba(34,197,94,0.2)' : 'rgba(208,2,27,0.2)'};">
                                                ${b.status}
                                            </span>
                                        </td>
                                        <td style="text-align:right;">
                                            <button class="action-btn" onclick="toggleBlockerStatus('${b.id}')" style="padding:6px 12px; font-size:0.78rem; background:${isActive ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)'}; border-color:${isActive ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}; color:${isActive ? 'var(--danger)' : 'var(--success)'}; font-weight:bold;">
                                                ${isActive ? 'Desativar' : 'Ativar'}
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderIllegalCars() {
    let carsHtml = '';
    if (activeImpoundedCars.length === 0) {
        carsHtml = `<tr><td colspan="5" style="text-align:center; color:var(--white-dim); padding:20px 0;">Nenhum veículo apreendido listado.</td></tr>`;
    } else {
        carsHtml = activeImpoundedCars.map(c => {
            const isRetrieved = c.retrieved === 'Sim';
            const ownerText = c.owner === 'Não sei o dono' ? '<em style="color:var(--white-muted);">Dono Desconhecido</em>' : c.owner;
            return `
                <tr onclick="handleCarRowClick('${c.id}')" style="cursor: pointer;">
                    <td style="font-weight:700; color:var(--white-main);">${c.model}</td>
                    <td style="font-family:monospace; font-size:0.95rem; color:#f59e0b;">${c.plate}</td>
                    <td>${ownerText}</td>
                    <td>
                        <span class="member-status-label" style="background:${isRetrieved ? 'rgba(34,197,94,0.08)' : 'rgba(208,2,27,0.08)'}; color:${isRetrieved ? 'var(--success)' : 'var(--danger)'}; border-color:${isRetrieved ? 'rgba(34,197,94,0.2)' : 'rgba(208,2,27,0.2)'};">
                            ${isRetrieved ? 'Sim' : 'Não'}
                        </span>
                    </td>
                    <td style="text-align:right;">
                        <button class="action-btn" onclick="event.stopPropagation(); openImpoundedCarModal('${c.id}')" style="padding:4px 8px; font-size:0.75rem;">
                            <i class="fa-solid fa-pen"></i> Editar
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    itemsGrid.innerHTML = `
        <div class="vault-logs-panel">
            <div class="vault-logs-header">
                <h3>Carros Detidos (Apreendidos)</h3>
                <button class="action-btn success-btn" onclick="openImpoundedCarModal('')" style="background:rgba(245,158,11,0.08); border-color:rgba(245,158,11,0.25); color:#f59e0b;">
                    <i class="fa-solid fa-plus"></i> Adicionar Veículo
                </button>
            </div>
            <div class="vault-table-wrapper">
                <table class="vault-table">
                    <thead>
                        <tr>
                            <th>Modelo</th>
                            <th>Placa</th>
                            <th>Piloto / Dono</th>
                            <th>Retirado?</th>
                            <th style="text-align:right;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${carsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderIllegalHierarchy() {
    // We filter active members who have the flagIlegal active
    const illegalMembers = activeMembers.filter(m => m.flagIlegal && m.status === 'Ativo');

    let hierarchyHtml = '<div class="hierarchy-container">';
    
    // Sort ranks for illegal hierarchy
    const illegalRoles = ['01', 'Gerente', 'Corredor', 'Membro', 'Probatorio'];
    const icons = {
        '01': 'fa-solid fa-crown',
        'Gerente': 'fa-solid fa-crown',
        'Corredor': 'fa-solid fa-gauge-high',
        'Membro': 'fa-solid fa-user-group',
        'Probatorio': 'fa-solid fa-user-clock'
    };

    illegalRoles.forEach(roleName => {
        const membersOfLevel = illegalMembers.filter(m => {
            return getMemberHighestIllegalRole(m).toLowerCase() === roleName.toLowerCase();
        });

        hierarchyHtml += `
            <div class="hierarchy-group">
                <div class="hierarchy-level-header">
                    <div class="hierarchy-level-title rank-racer" style="color:#f59e0b;">
                        <i class="${icons[roleName]}"></i> ${roleName.toUpperCase()} (0${membersOfLevel.length})
                    </div>
                    <span class="hierarchy-level-count" style="color:var(--white-dim);">${membersOfLevel.length} ilegais ativos</span>
                </div>
                <div class="hierarchy-members-grid">
        `;

        if (membersOfLevel.length === 0) {
            hierarchyHtml += `
                <p style="color:var(--white-dim); font-size:0.82rem; grid-column:1/-1; padding:10px 0;">
                    Nenhum membro ativo listado neste cargo de ação.
                </p>`;
        } else {
            const isCEO = db.isAdminLoggedIn() || (currentLoggedInMember && (
                currentLoggedInMember.role.toLowerCase() === 'ceo' || 
                currentLoggedInMember.role.toLowerCase() === 'owner' || 
                currentLoggedInMember.role.toLowerCase() === 'night boss'
            ));

            membersOfLevel.forEach(m => {
                const initial = m.name ? m.name.charAt(0).toUpperCase() : '?';
                const ceoControls = isCEO ? `
                    <div style="display:flex; flex-direction:column; gap:4px; margin-left:auto; justify-content:center; align-items:center;">
                        <button onclick="promoteMember('${m.id}')" title="Promover" style="background:none; border:none; color:var(--success); cursor:pointer; font-size:0.85rem;"><i class="fa-solid fa-arrow-up"></i></button>
                        <button onclick="demoteMember('${m.id}')" title="Rebaixar" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:0.85rem;"><i class="fa-solid fa-arrow-down"></i></button>
                    </div>
                ` : '';

                const avatarContent = m.avatarUrl 
                    ? `<img src="${m.avatarUrl}" alt="${m.name}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><span style="display:none; align-items:center; justify-content:center; width:100%; height:100%;">${initial}</span>` 
                    : initial;

                hierarchyHtml += `
                    <div class="hierarchy-member-card" style="display:flex; align-items:center; width:100%; cursor: pointer;" onclick="window.handleMemberCardClick('${m.id}')">
                        <div class="hierarchy-member-avatar ${m.liveUrl ? 'is-live' : ''}" ${m.liveUrl ? `onclick="window.open('${m.liveUrl.startsWith('http') ? m.liveUrl : 'https://' + m.liveUrl}', '_blank'); event.stopPropagation();" title="Assistir Live"` : ''}>${avatarContent}</div>
                        <div class="hierarchy-member-info">
                            <span class="hierarchy-member-name">${m.name}</span>
                            <span class="hierarchy-member-status" style="color:#f59e0b;">${m.illegalRole}</span>
                        </div>
                        ${ceoControls}
                    </div>
                `;
            });
        }

        hierarchyHtml += `
                </div>
            </div>
        `;
    });

    hierarchyHtml += '</div>';
    itemsGrid.innerHTML = hierarchyHtml;
}

function renderIllegalRecipes() {
    const isAllowedEdit = hasPermission('edit_products');
    itemsGrid.innerHTML = `
        <div class="recipes-grid">
            ${activeIllegalRecipes.map(recipe => {
                return `
                    <div class="recipe-card" data-id="${recipe.id}" onclick="window.handleRecipeCardClick('${recipe.recipeId || recipe.id}')" style="cursor: pointer;">
                        ${isAllowedEdit ? `
                            <div class="card-admin-controls" onclick="event.stopPropagation();" style="position:absolute; top:12px; right:12px; z-index:10;">
                                <button class="card-edit-icon-btn" onclick="openItemEditModal('${recipe.id}', 'illegal-recipes')" title="Editar Receita" style="background:var(--black-panel); border:1px solid var(--border-dark); color:var(--white-main); padding:6px; border-radius:4px; cursor:pointer; font-size:0.8rem; width:28px; height:28px; display:flex; align-items:center; justify-content:center; transition:var(--transition);">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                            </div>
                        ` : ''}
                        <div class="recipe-header">
                            <div class="recipe-icon-wrapper">
                                <img src="${recipe.image || 'icones/sucata.png'}" class="recipe-icon-img" alt="${recipe.name}">
                            </div>
                            <div class="recipe-info">
                                <h4 class="recipe-name">${recipe.name}</h4>
                                <span class="recipe-time">${recipe.time}</span>
                            </div>
                        </div>
                        <div class="recipe-materials-title">Materiais Requeridos</div>
                        <div class="recipe-ingredients-list">
                            ${recipe.ingredients.map(ing => {
                                const matImg = materialImageMap[ing.id] || 'icones/sucata.png';
                                return `
                                    <div class="recipe-ingredient-tag">
                                        <div class="recipe-qty-label">
                                            <img src="${matImg}" class="mat-icon" alt="${ing.name}">
                                            <span>${ing.name}</span>
                                        </div>
                                        <span class="recipe-qty-badge">${ing.quantity}x</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ─── RENDER STANDARD LIST OF ITEMS ────────────────────────────────────────
function renderItems(searchTerm = '') {
    const stageButtonsContainer = document.getElementById('stageButtonsContainer');
    const searchBar = document.querySelector('.search-bar');

    itemsGrid.style.gridTemplateColumns = '';

    if (currentCategory === 'home') {
        itemsGrid.style.display = 'none';
        homeContainer.style.display = 'flex';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        if (searchBar) searchBar.style.display = 'none';
        renderHomeScreen();
        return;
    } else if (currentCategory === 'members') {
        itemsGrid.style.display = 'grid';
        itemsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        homeContainer.style.display = 'none';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        
        if (currentSubCategory === 'roles') {
            if (searchBar) searchBar.style.display = 'none';
        } else {
            if (searchBar) searchBar.style.display = 'flex';
        }
        renderMembersScreen(searchTerm);
        return;
    } else if (currentCategory === 'hierarchy') {
        itemsGrid.style.display = 'block';
        homeContainer.style.display = 'none';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        if (searchBar) searchBar.style.display = 'none';
        renderHierarchyScreen();
        return;
    } else if (currentCategory === 'vault') {
        itemsGrid.style.display = 'block';
        homeContainer.style.display = 'none';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        if (searchBar) searchBar.style.display = 'none';
        renderVaultScreen();
        return;
    } else if (currentCategory === 'illegal-recipes') {
        itemsGrid.style.display = 'block';
        homeContainer.style.display = 'none';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        if (searchBar) searchBar.style.display = 'none';
        renderIllegalRecipes();
        return;
    } else if (currentCategory === 'illegal-actions') {
        itemsGrid.style.display = 'block';
        homeContainer.style.display = 'none';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        if (searchBar) searchBar.style.display = 'none';
        renderIllegalActions();
        return;
    } else if (currentCategory === 'illegal-hierarchy') {
        itemsGrid.style.display = 'block';
        homeContainer.style.display = 'none';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        if (searchBar) searchBar.style.display = 'none';
        if (currentSubCategory === 'roles') {
            renderRolesScreen();
        } else {
            renderIllegalHierarchy();
        }
        return;
    } else if (currentCategory === 'illegal-boosting') {
        itemsGrid.style.display = 'block';
        homeContainer.style.display = 'none';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        if (searchBar) searchBar.style.display = 'none';
        renderIllegalBoosting();
        return;
    } else if (currentCategory === 'illegal-cars') {
        itemsGrid.style.display = 'block';
        homeContainer.style.display = 'none';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        if (searchBar) searchBar.style.display = 'none';
        renderIllegalCars();
        return;
    } else if (currentCategory === 'illegal-mural') {
        itemsGrid.style.display = 'block';
        homeContainer.style.display = 'none';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        if (searchBar) searchBar.style.display = 'none';
        renderIllegalMuralScreen();
        return;
    } else if (currentCategory === 'lives') {
        itemsGrid.style.display = 'block';
        homeContainer.style.display = 'none';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        if (searchBar) searchBar.style.display = 'none';
        renderLivesScreen(false);
        return;
    } else if (currentCategory === 'illegal-lives') {
        itemsGrid.style.display = 'block';
        homeContainer.style.display = 'none';
        if (stageButtonsContainer) stageButtonsContainer.style.display = 'none';
        if (searchBar) searchBar.style.display = 'none';
        renderLivesScreen(true);
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

    // Checking edit permissions
    let isAllowedEdit = false;
    if (currentCategory === 'components' && hasPermission('edit_stages')) isAllowedEdit = true;
    if (currentCategory === 'services' && hasPermission('edit_services')) isAllowedEdit = true;
    if (currentCategory === 'products' && hasPermission('edit_products')) isAllowedEdit = true;

    filtered.forEach(item => {
        const price     = item.sellPrice || item.price || 0;
        const stageText = item.stage ? `Stage ${item.stage}` : '';

        const hasMaterials = item.ingredients && item.ingredients.length > 0;
        const materialsHtml = hasMaterials
            ? `
                <div class="quick-service-materials">
                    <div class="quick-service-materials-title">Materiais Requeridos</div>
                    ${item.ingredients.map(ing => {
                        const matDef = activeMaterials.find(m => m.id === ing.id);
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
        card.setAttribute('onclick', `window.addToCart('${item.id}', '${currentCategory}')`);
        card.style.cursor = 'pointer';
        card.setAttribute('title', 'Adicionar ao carrinho');
        card.innerHTML = `
            ${stageText ? `<div class="item-stage">Stage ${item.stage}</div>` : ''}
            
            ${isAllowedEdit ? `
                <div class="card-admin-controls" onclick="event.stopPropagation();">
                    <button class="card-edit-icon-btn" onclick="openItemEditModal('${item.id}', '${currentCategory}')" title="Editar Item">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </div>
            ` : ''}

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

    if (window.isEditModeActive) {
        openItemEditModal(itemId, actualCategory);
        return;
    }

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

        const card = document.querySelector(`[data-id="${itemId}"]`);
        if (card) {
            card.style.borderColor = 'var(--success)';
            card.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.35)';
            setTimeout(() => {
                card.style.borderColor = '';
                card.style.boxShadow = '';
            }, 1000);
        }

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
        const imgSrc = imageMap[item.id] || imageMap[item.image];
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
            const matDef  = activeMaterials.find(m => m.id === matId);
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

// ─── AUTHENTICATION FLOW UI UPDATES ───────────────────────────────────────
function updateAuthUI() {
    updateStatusBadge(db.isConnected() ? 'online' : 'local');
    const isLoggedIn = db.isAdminLoggedIn() || currentLoggedInMember !== null;
    const isAdminMode = db.isAdminLoggedIn() || (currentLoggedInMember && (currentLoggedInMember.role.toLowerCase() === 'gerente' || currentLoggedInMember.role.toLowerCase() === 'night boss' || currentLoggedInMember.role.toLowerCase() === 'owner'));

    if (btnManageMaterials) btnManageMaterials.style.display = isAdminMode ? 'flex' : 'none';
    if (adminDivider) adminDivider.style.display = isAdminMode ? 'block' : 'none';

    // Toggle visibility of restricted pages (Membros, Hierarquia, Baú)
    const btnMembers = document.getElementById('btn-members');
    const btnHierarchy = document.getElementById('btn-hierarchy');
    const btnVault = document.getElementById('btn-vault');

    const isIllegalOnly = currentLoggedInMember && 
                          (!currentLoggedInMember.role || currentLoggedInMember.role === 'Agregado') && 
                          currentLoggedInMember.flagIlegal;

    const normalNav = document.getElementById('normalNav');
    const illegalNav = document.getElementById('illegalNav');

    if (isLoggedIn && isIllegalOnly) {
        isIllegalUnlocked = true;
        currentIllegalMember = currentLoggedInMember;
        document.body.classList.add('theme-gold');

        const brandLogo = document.querySelector('.brand-logo');
        const brandTagline = document.querySelector('.brand-tagline');
        if (brandLogo) {
            brandLogo.innerHTML = '<span class="brand-re" style="color:#f59e0b;">SECRET</span>';
        }
        if (brandTagline) {
            brandTagline.textContent = 'Criminal Operations';
        }

        if (normalNav) normalNav.style.display = 'none';
        if (illegalNav) illegalNav.style.display = 'flex';

        const illegalAllowed = ['illegal-recipes', 'illegal-actions', 'illegal-hierarchy', 'illegal-boosting', 'illegal-cars', 'illegal-mural', 'illegal-lives', 'members'];
        if (!illegalAllowed.includes(currentCategory)) {
            currentCategory = 'illegal-recipes';
        }
    } else if (isLoggedIn) {
        if (isIllegalUnlocked) {
            if (normalNav) normalNav.style.display = 'none';
            if (illegalNav) illegalNav.style.display = 'flex';
        } else {
            if (normalNav) normalNav.style.display = 'flex';
            if (illegalNav) illegalNav.style.display = 'none';
        }
    }

    if (!isLoggedIn) {
        if (btnMembers) btnMembers.style.display = 'none';
        if (btnHierarchy) btnHierarchy.style.display = 'none';
        if (btnVault) btnVault.style.display = 'none';

        isIllegalUnlocked = false;
        currentIllegalMember = null;
        if (normalNav) normalNav.style.display = 'flex';
        if (illegalNav) illegalNav.style.display = 'none';
        document.body.classList.remove('theme-gold');
        
        // Restore Brand header
        const brandLogo = document.querySelector('.brand-logo');
        const brandTagline = document.querySelector('.brand-tagline');
        if (brandLogo) {
            brandLogo.innerHTML = '<span class="brand-re">RE:</span><span class="brand-colon">:</span><span class="brand-motion">Motion</span>';
        }
        if (brandTagline) {
            brandTagline.textContent = 'Performance Shop';
        }

        // Redirect if on restricted category
        if (['members', 'hierarchy', 'vault', 'illegal-recipes', 'illegal-actions', 'illegal-hierarchy', 'illegal-boosting', 'illegal-cars', 'illegal-mural', 'illegal-lives'].includes(currentCategory)) {
            switchCategory('home');
        }
    } else {
        if (!isIllegalOnly) {
            if (btnMembers) btnMembers.style.display = 'flex';
            if (btnHierarchy) btnHierarchy.style.display = 'flex';
            if (btnVault) btnVault.style.display = 'flex';
        } else {
            if (btnMembers) btnMembers.style.display = 'none';
            if (btnHierarchy) btnHierarchy.style.display = 'none';
            if (btnVault) btnVault.style.display = 'none';
        }
    }
    
    // Header add button depending on category permissions
    if (addNewItemBtn) {
        addNewItemBtn.style.display = 'none';

        if (currentCategory === 'components' && hasPermission('edit_stages')) {
            addNewItemBtn.style.display = 'flex';
            addNewItemBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Novo Stage`;
        } else if (currentCategory === 'services' && hasPermission('edit_services')) {
            addNewItemBtn.style.display = 'flex';
            addNewItemBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Novo Serviço`;
        } else if (currentCategory === 'products' && hasPermission('edit_products')) {
            addNewItemBtn.style.display = 'flex';
            addNewItemBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Novo Produto`;
        } else if (currentCategory === 'illegal-recipes' && hasPermission('edit_products')) {
            addNewItemBtn.style.display = 'flex';
            addNewItemBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Novo Item Ilegal`;
        } else if (currentCategory === 'members' || currentCategory === 'illegal-hierarchy') {
            if (currentSubCategory === 'roles' && hasPermission('manage_roles')) {
                addNewItemBtn.style.display = 'flex';
                addNewItemBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Novo Cargo`;
            } else if (currentSubCategory === 'list' && hasPermission('edit_members') && currentCategory === 'members') {
                addNewItemBtn.style.display = 'flex';
                addNewItemBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Novo Membro`;
            }
        }
    }

    if (editCurrentBtn) {
        editCurrentBtn.style.display = 'none';

        if (currentCategory === 'components' && hasPermission('edit_stages')) {
            editCurrentBtn.style.display = 'flex';
            editCurrentBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Alterar Stage`;
        } else if (currentCategory === 'services' && hasPermission('edit_services')) {
            editCurrentBtn.style.display = 'flex';
            editCurrentBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Alterar Serviço`;
        } else if (currentCategory === 'products' && hasPermission('edit_products')) {
            editCurrentBtn.style.display = 'flex';
            editCurrentBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Alterar Produto`;
        } else if (currentCategory === 'illegal-recipes' && hasPermission('edit_products')) {
            editCurrentBtn.style.display = 'flex';
            editCurrentBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Alterar Item Ilegal`;
        } else if (currentCategory === 'members' || currentCategory === 'illegal-hierarchy') {
            if (currentSubCategory === 'roles' && hasPermission('manage_roles')) {
                editCurrentBtn.style.display = 'flex';
                editCurrentBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Alterar Cargo`;
            } else if (currentSubCategory === 'list' && hasPermission('edit_members') && currentCategory === 'members') {
                editCurrentBtn.style.display = 'flex';
                editCurrentBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Alterar Membro`;
            }
        } else if (currentCategory === 'illegal-actions') {
            editCurrentBtn.style.display = 'flex';
            editCurrentBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Alterar Ação`;
        } else if (currentCategory === 'illegal-boosting' && hasPermission('edit_services')) {
            editCurrentBtn.style.display = 'flex';
            editCurrentBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Alterar Trajeto`;
        } else if (currentCategory === 'illegal-cars') {
            editCurrentBtn.style.display = 'flex';
            editCurrentBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Alterar Veículo`;
        }
    }
    
    if (btnLoginToggle) {
        if (isLoggedIn) {
            const displayName = currentLoggedInMember ? currentLoggedInMember.name : db.getAdminEmail().split('@')[0];
            btnLoginToggle.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Logout (${displayName})`;
            btnLoginToggle.style.color = 'var(--red-primary)';
        } else {
            btnLoginToggle.innerHTML = `<i class="fa-solid fa-lock"></i> Login Admin / Membro`;
            btnLoginToggle.style.color = '';
        }
    }

    // Set illegal toggle text/color and visibility
    if (btnToggleIllegal) {
        if (isIllegalOnly) {
            btnToggleIllegal.style.display = 'none';
        } else {
            const hasIllegalAccess = db.isAdminLoggedIn() || 
                                     (currentLoggedInMember && (currentLoggedInMember.flagIlegal || hasPermission('access_illegal')));
            
            if (isIllegalUnlocked || hasIllegalAccess) {
                btnToggleIllegal.style.display = 'flex';
                if (isIllegalUnlocked) {
                    btnToggleIllegal.innerHTML = `<i class="fa-solid fa-mask"></i> Voltar p/ Oficina`;
                    btnToggleIllegal.style.background = 'rgba(239, 68, 68, 0.08)';
                    btnToggleIllegal.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                    btnToggleIllegal.style.color = '#ef4444';
                } else {
                    btnToggleIllegal.innerHTML = `<i class="fa-solid fa-mask"></i> Área Ilegal`;
                    btnToggleIllegal.style.background = 'rgba(245, 158, 11, 0.05)';
                    btnToggleIllegal.style.borderColor = 'rgba(245, 158, 11, 0.25)';
                    btnToggleIllegal.style.color = '#f59e0b';
                }
            } else {
                btnToggleIllegal.style.display = 'none';
            }
        }
    }

    const actionRow = document.querySelector('.header-action-buttons-row');
    if (actionRow) {
        const hasVisibleButtons = (addNewItemBtn && addNewItemBtn.style.display !== 'none') || 
                                  (editCurrentBtn && editCurrentBtn.style.display !== 'none');
        actionRow.style.display = hasVisibleButtons ? 'flex' : 'none';
    }

    renderItems();
}

// ─── MODALS OPEN/CLOSE CONTROL ────────────────────────────────────────────
function showModal(modal) {
    if (modal) modal.style.display = 'flex';
}

function hideModal(modal) {
    if (modal) modal.style.display = 'none';
}

document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        hideModal(e.target.closest('.modal-overlay'));
    });
});


// ─── LOGIN & CONFIG SUBMISSIONS ───────────────────────────────────────────
if (btnLoginToggle) {
    btnLoginToggle.addEventListener('click', () => {
        if (db.isAdminLoggedIn() || currentLoggedInMember) {
            db.logout();
            currentLoggedInMember = null;
            updateAuthUI();
        } else {
            // Reset modal tabs to login
            const tabLogin = document.getElementById('authTabLogin');
            if (tabLogin) tabLogin.click();
            showModal(modalLogin);
        }
    });
}

if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputVal = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('loginErrorMsg');

        errorEl.style.display = 'none';

        // 1. Try Admin Login first
        const adminResult = await db.login(inputVal, pass);
        if (adminResult.success) {
            currentLoggedInMember = null;
            hideModal(modalLogin);
            formLogin.reset();
            updateAuthUI();
            return;
        }

        // 2. Try Member Login next
        const memberResult = await db.memberLogin(inputVal, pass);
        if (memberResult.success) {
            currentLoggedInMember = memberResult.member;
            hideModal(modalLogin);
            formLogin.reset();
            updateAuthUI();
        } else {
            errorEl.textContent = memberResult.error || "Credenciais inválidas.";
            errorEl.style.display = 'block';
        }
    });
}

const formRegister = document.getElementById('formRegister');
if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const passport = document.getElementById('regPassport').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const password = document.getElementById('regPassword').value;
        const errorEl = document.getElementById('regErrorMsg');

        errorEl.style.display = 'none';

        // Check if passport is already in use
        const existing = activeMembers.find(m => m.passport === passport);
        if (existing) {
            errorEl.textContent = "Passaporte já cadastrado.";
            errorEl.style.display = 'block';
            return;
        }

        const newMember = {
            id: 'mem_' + Date.now(),
            name: name,
            passport: passport,
            phone: phone,
            role: 'Estagiario',
            joinDate: new Date().toLocaleDateString('pt-BR'),
            status: 'Ativo',
            password: password,
            flagIlegal: false,
            illegalRole: ''
        };

        await db.saveMember(newMember);
        alert(`Conta criada com sucesso! Faça login com seu passaporte e senha.`);
        hideModal(modalLogin);
        formRegister.reset();
        await loadData();
        renderItems();
    });
}

const authTabLogin = document.getElementById('authTabLogin');
const authTabRegister = document.getElementById('authTabRegister');
if (authTabLogin && authTabRegister) {
    authTabLogin.addEventListener('click', () => {
        authTabLogin.classList.add('active');
        authTabLogin.style.borderBottomColor = 'var(--red-primary)';
        authTabLogin.style.color = 'var(--white-main)';

        authTabRegister.classList.remove('active');
        authTabRegister.style.borderBottomColor = 'transparent';
        authTabRegister.style.color = 'var(--white-muted)';

        document.getElementById('formLogin').style.display = 'block';
        document.getElementById('formRegister').style.display = 'none';
        document.getElementById('loginModalTitle').innerHTML = '<i class="fa-solid fa-lock"></i> Autenticação';
    });

    authTabRegister.addEventListener('click', () => {
        authTabRegister.classList.add('active');
        authTabRegister.style.borderBottomColor = 'var(--red-primary)';
        authTabRegister.style.color = 'var(--white-main)';

        authTabLogin.classList.remove('active');
        authTabLogin.style.borderBottomColor = 'transparent';
        authTabLogin.style.color = 'var(--white-muted)';

        document.getElementById('formLogin').style.display = 'none';
        document.getElementById('formRegister').style.display = 'block';
        document.getElementById('loginModalTitle').innerHTML = '<i class="fa-solid fa-user-plus"></i> Criar Conta';
    });
}

if (dbStatusBadge) {
    dbStatusBadge.addEventListener('click', () => {
        if (!db.isAdminLoggedIn()) return;
        const config = db.getConnectionInfo();
        document.getElementById('configUrl').value = config.url;
        document.getElementById('configKey').value = config.anonKey;
        showModal(modalConfig);
    });
}

const btnSaveConfig = document.getElementById('btnSaveConfig');
if (btnSaveConfig) {
    btnSaveConfig.addEventListener('click', () => {
        const url = document.getElementById('configUrl').value.trim();
        const key = document.getElementById('configKey').value.trim();
        db.setConnection(url, key);
        hideModal(modalConfig);
        window.location.reload();
    });
}

// ─── MATERIALS MANAGER SUBMISSIONS ────────────────────────────────────────
if (btnManageMaterials) {
    btnManageMaterials.addEventListener('click', () => {
        const grid = document.getElementById('materialsPriceGrid');
        grid.innerHTML = activeMaterials.map(mat => `
            <div class="material-price-input-row" data-id="${mat.id}">
                <label>${mat.name}</label>
                <input type="number" value="${mat.price}" required min="0" step="any">
            </div>
        `).join('');
        showModal(modalMaterialsManager);
    });
}

if (formMaterialsManager) {
    formMaterialsManager.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rows = document.querySelectorAll('.material-price-input-row');
        
        for (const row of rows) {
            const id = row.getAttribute('data-id');
            const price = Number(row.querySelector('input').value);
            const original = activeMaterials.find(m => m.id === id);
            if (original) {
                await db.saveMaterial({
                    id: id,
                    name: original.name,
                    price: price,
                    image: original.image || null
                });
            }
        }

        hideModal(modalMaterialsManager);
        alert("Preços de materiais atualizados!");
        await loadData();
    });
}

// ─── MURAL ANNOUNCEMENTS SUBMISSIONS ──────────────────────────────────────
window.openMuralModal = function() {
    formMuralPost.reset();
    document.getElementById('muralAuthor').value = db.getAdminEmail().split('@')[0] || 'Admin';
    showModal(modalMuralPost);
};

if (formMuralPost) {
    formMuralPost.addEventListener('submit', async (e) => {
        e.preventDefault();
        let tagVal = document.getElementById('muralTag').value.trim();
        if (currentCategory === 'illegal-mural') {
            if (!tagVal.startsWith('[ILEGAL]')) {
                tagVal = `[ILEGAL] ${tagVal}`;
            }
        }
        const post = {
            title: document.getElementById('muralTitle').value,
            tag: tagVal,
            author: document.getElementById('muralAuthor').value,
            content: document.getElementById('muralContent').value
        };

        await db.saveMuralPost(post);
        hideModal(modalMuralPost);
        await loadData();
    });
}

window.deleteMuralPost = async function(postId) {
    if (confirm("Deseja realmente remover este aviso do mural?")) {
        await db.deleteMuralPost(postId);
        await loadData();
    }
};

// ─── VAULT (BAÚ) SECURITY & LOGS SUBMISSIONS ──────────────────────────────
if (formVaultAuth) {
    formVaultAuth.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredPass = document.getElementById('vaultPasswordInput').value;
        const correctPass = db.getVaultPassword();
        const errorMsg = document.getElementById('vaultAuthErrorMsg');

        if (enteredPass === correctPass) {
            isVaultUnlocked = true;
            hideModal(modalVaultAuth);
            formVaultAuth.reset();
            renderVaultScreen();
        } else {
            errorMsg.textContent = "Senha incorreta!";
            errorMsg.style.display = 'block';
        }
    });
}

window.openVaultChangePassModal = function() {
    document.getElementById('vaultChangePassError').style.display = 'none';
    formVaultChangePassword.reset();
    showModal(modalVaultChangePassword);
};

if (formVaultChangePassword) {
    formVaultChangePassword.addEventListener('submit', (e) => {
        e.preventDefault();
        const oldPass = document.getElementById('vaultOldPass').value;
        const newPass = document.getElementById('vaultNewPass').value;
        const errorEl = document.getElementById('vaultChangePassError');

        if (oldPass !== db.getVaultPassword()) {
            errorEl.textContent = "Senha antiga incorreta!";
            errorEl.style.display = 'block';
            return;
        }

        db.saveVaultPassword(newPass);
        hideModal(modalVaultChangePassword);
        alert("Senha do Baú atualizada com sucesso!");
    });
}

window.openVaultLogModal = function() {
    formVaultLog.reset();
    
    // Populate executant member list
    const memberSel = document.getElementById('vaultLogMember');
    memberSel.innerHTML = activeMembers.map(m => `<option value="${m.name}">${m.name} (Passaporte: ${m.passport})</option>`).join('');
    
    // Populate items list (materials + shop items)
    const itemSel = document.getElementById('vaultLogItem');
    const matsOptions = activeMaterials.map(m => `<option value="${m.name}">${m.name} (Material)</option>`).join('');
    
    const allItems = [...activeComponents, ...activeServices, ...activeProducts];
    const itemsOptions = allItems.map(i => `<option value="${i.name}">${i.name}</option>`).join('');

    itemSel.innerHTML = matsOptions + itemsOptions;
    showModal(modalVaultLog);
};

if (formVaultLog) {
    formVaultLog.addEventListener('submit', async (e) => {
        e.preventDefault();
        const log = {
            member: document.getElementById('vaultLogMember').value,
            action: document.getElementById('vaultLogAction').value,
            item: document.getElementById('vaultLogItem').value,
            quantity: Number(document.getElementById('vaultLogQty').value)
        };

        db.saveVaultLog(log);
        hideModal(modalVaultLog);
        await loadData();
    });
}

// ─── ILEGAL DASHBOARD SECURITY & ACTIONS SUBMISSIONS ──────────────────────
function activateIllegalArea() {
    isIllegalUnlocked = true;
    currentIllegalMember = currentLoggedInMember || null;

    // Activate Gold Theme
    document.body.classList.add('theme-gold');

    // Change Brand header to SECRET
    const brandLogo = document.querySelector('.brand-logo');
    const brandTagline = document.querySelector('.brand-tagline');
    if (brandLogo) {
        brandLogo.innerHTML = '<span class="brand-re" style="color:#f59e0b;">SECRET</span>';
    }
    if (brandTagline) {
        brandTagline.textContent = 'Criminal Operations';
    }

    // Toggle sidebar navs
    document.getElementById('normalNav').style.display = 'none';
    document.getElementById('illegalNav').style.display = 'flex';

    // Direct navigation to illegal recipes category tab
    switchCategory('illegal-recipes');
    updateAuthUI();
}

if (btnToggleIllegal) {
    btnToggleIllegal.addEventListener('click', () => {
        if (isIllegalUnlocked) {
            // Locking back and reverting to Red theme
            isIllegalUnlocked = false;
            currentIllegalMember = null;
            document.body.classList.remove('theme-gold');

            // Restore Brand header
            const brandLogo = document.querySelector('.brand-logo');
            const brandTagline = document.querySelector('.brand-tagline');
            if (brandLogo) {
                brandLogo.innerHTML = '<span class="brand-re">RE:</span><span class="brand-colon">:</span><span class="brand-motion">Motion</span>';
            }
            if (brandTagline) {
                brandTagline.textContent = 'Performance Shop';
            }

            // Toggle sidebar navs
            document.getElementById('normalNav').style.display = 'flex';
            document.getElementById('illegalNav').style.display = 'none';

            // Switch view back to home
            const homeBtn = document.getElementById('btn-home');
            if (homeBtn) homeBtn.click();
            updateAuthUI();
        } else {
            // Enter illegal area directly — no password required
            activateIllegalArea();
        }
    });
}

// Dynamic routing function for sidebar clicks
function switchCategory(cat) {
    if (!cat || !categoryMeta[cat]) return;

    const isIllegalOnly = currentLoggedInMember && 
                          (!currentLoggedInMember.role || currentLoggedInMember.role === 'Agregado') && 
                          currentLoggedInMember.flagIlegal;
                          
    if (isIllegalOnly) {
        const illegalAllowed = ['illegal-recipes', 'illegal-actions', 'illegal-hierarchy', 'illegal-boosting', 'illegal-cars', 'illegal-mural', 'illegal-lives', 'members'];
        if (!illegalAllowed.includes(cat)) {
            cat = 'illegal-recipes';
        }
    }

    // Reset edit mode when changing category
    window.isEditModeActive = false;
    document.body.classList.remove('edit-mode-active');
    if (editCurrentBtn) {
        editCurrentBtn.style.background = 'rgba(255,255,255,0.05)';
        editCurrentBtn.style.borderColor = 'var(--border-dark)';
        editCurrentBtn.style.color = 'var(--white-main)';
    }

    categoryBtns.forEach(b => {
        b.classList.remove('active');
        if (b.dataset.category === cat) b.classList.add('active');
    });
    
    currentCategory = cat;
    currentSubCategory = 'list';
    
    searchInput.value = '';

    const meta = { ...categoryMeta[currentCategory] };
    if (currentCategory === 'members' && isIllegalUnlocked) {
        meta.title = 'Membros Ilícitos';
        meta.subtitle = 'Gestão de membros e cargos da facção ilegal';
    }
    categoryTitle.textContent    = meta.title;
    categorySubtitle.textContent = meta.subtitle;

    if (currentCategory === 'members') {
        searchInput.placeholder = 'Buscar por passaporte, nome ou cargo...';
    } else {
        searchInput.placeholder = 'Buscar item...';
    }

    updateSubNavigation();
    updateAuthUI();
}

// ─── IMPOUNDED CARS CRUD ──────────────────────────────────────────────────
window.openImpoundedCarModal = function(carId = '') {
    formImpoundedCar.reset();
    const titleEl = document.getElementById('impoundedCarTitle');
    const deleteBtn = document.getElementById('btnDeleteImpoundedCar');
    const ownerInput = document.getElementById('editCarOwner');
    const unknownCheckbox = document.getElementById('editCarOwnerUnknown');

    ownerInput.disabled = false;
    unknownCheckbox.checked = false;

    if (carId) {
        titleEl.textContent = "Editar Veículo Detido";
        deleteBtn.style.display = 'block';

        const car = activeImpoundedCars.find(c => c.id === carId);
        if (car) {
            document.getElementById('editCarId').value = car.id;
            document.getElementById('editCarModel').value = car.model;
            document.getElementById('editCarPlate').value = car.plate;
            
            ownerInput.value = car.owner || '';
            if (car.owner === 'Não sei o dono') {
                unknownCheckbox.checked = true;
                ownerInput.disabled = true;
            }
            document.getElementById('editCarRetrieved').value = car.retrieved || 'Não';
        }
    } else {
        titleEl.textContent = "Adicionar Veículo Detido";
        deleteBtn.style.display = 'none';
        document.getElementById('editCarId').value = '';
    }
    showModal(modalImpoundedCar);
};

if (formImpoundedCar) {
    formImpoundedCar.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isUnknown = document.getElementById('editCarOwnerUnknown').checked;
        const car = {
            id: document.getElementById('editCarId').value || null,
            model: document.getElementById('editCarModel').value,
            plate: document.getElementById('editCarPlate').value,
            owner: isUnknown ? 'Não sei o dono' : document.getElementById('editCarOwner').value,
            retrieved: document.getElementById('editCarRetrieved').value
        };

        db.saveImpoundedCar(car);
        hideModal(modalImpoundedCar);
        await loadData();
    });
}

const btnDeleteImpoundedCar = document.getElementById('btnDeleteImpoundedCar');
if (btnDeleteImpoundedCar) {
    btnDeleteImpoundedCar.addEventListener('click', async () => {
        const id = document.getElementById('editCarId').value;
        if (id && confirm("Deseja remover este veículo da lista de detidos?")) {
            db.deleteImpoundedCar(id);
            hideModal(modalImpoundedCar);
            await loadData();
        }
    });
}

// ─── ESCAPE CARDS CRUD ──────────────────────────────────────────────────
window.openEscapeCardModal = function(escapeId = '') {
    formEscapeCard.reset();
    const titleEl = document.getElementById('escapeCardTitle');
    const deleteBtn = document.getElementById('btnDeleteEscapeCard');

    if (escapeId) {
        titleEl.textContent = "Editar Rota de Fuga";
        deleteBtn.style.display = 'block';

        let escapeCards = JSON.parse(localStorage.getItem('escape_cards_local') || '[]');
        const esc = escapeCards.find(e => e.id === escapeId);
        if (esc) {
            document.getElementById('editEscapeId').value = esc.id;
            document.getElementById('editEscapeTitle').value = esc.title;
            document.getElementById('editEscapePhoto').value = esc.photo;
            document.getElementById('editEscapeLocation').value = esc.location;
        }
    } else {
        titleEl.textContent = "Adicionar Nova Rota";
        deleteBtn.style.display = 'none';
        document.getElementById('editEscapeId').value = '';
    }
    showModal(modalEscapeCard);
};

if (formEscapeCard) {
    formEscapeCard.addEventListener('submit', async (e) => {
        e.preventDefault();
        const escapeId = document.getElementById('editEscapeId').value;
        const newEsc = {
            id: escapeId || 'esc_' + Date.now(),
            title: document.getElementById('editEscapeTitle').value,
            photo: document.getElementById('editEscapePhoto').value,
            location: document.getElementById('editEscapeLocation').value
        };

        let escapeCards = JSON.parse(localStorage.getItem('escape_cards_local') || '[]');
        const idx = escapeCards.findIndex(e => e.id === newEsc.id);
        if (idx >= 0) escapeCards[idx] = newEsc;
        else escapeCards.push(newEsc);

        localStorage.setItem('escape_cards_local', JSON.stringify(escapeCards));
        hideModal(modalEscapeCard);
        renderIllegalBoosting();
    });
}

const btnDeleteEscapeCard = document.getElementById('btnDeleteEscapeCard');
if (btnDeleteEscapeCard) {
    btnDeleteEscapeCard.addEventListener('click', () => {
        const id = document.getElementById('editEscapeId').value;
        if (id && confirm("Deseja remover esta rota de fuga?")) {
            let escapeCards = JSON.parse(localStorage.getItem('escape_cards_local') || '[]');
            escapeCards = escapeCards.filter(e => e.id !== id);
            localStorage.setItem('escape_cards_local', JSON.stringify(escapeCards));
            hideModal(modalEscapeCard);
            renderIllegalBoosting();
        }
    });
}

// ─── ACTION PRESETS CRUD ──────────────────────────────────────────────────
window.openActionPresetModal = function(presetId = '') {
    formActionPreset.reset();
    const titleEl = document.getElementById('actionPresetTitle');
    const deleteBtn = document.getElementById('btnDeleteActionPreset');

    if (presetId) {
        titleEl.textContent = "Alterar Tipo de Ação";
        deleteBtn.style.display = 'block';

        const preset = presetActions[presetId];
        if (preset) {
            document.getElementById('editActionPresetId').value = presetId;
            document.getElementById('editActionPresetName').value = preset.name;
            document.getElementById('editActionPresetDesc').value = preset.desc;
            document.getElementById('editActionPresetMembers').value = preset.members;
            document.getElementById('editActionPresetWeapons').value = preset.weapons;
            document.getElementById('editActionPresetRules').value = (preset.rules || []).join('\n');
        }
    } else {
        titleEl.textContent = "Novo Tipo de Ação";
        deleteBtn.style.display = 'none';
        document.getElementById('editActionPresetId').value = '';
    }
    showModal(modalActionPreset);
};

if (formActionPreset) {
    formActionPreset.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editActionPresetId').value || 'preset_' + Date.now();
        const name = document.getElementById('editActionPresetName').value;
        const desc = document.getElementById('editActionPresetDesc').value;
        const members = document.getElementById('editActionPresetMembers').value;
        const weapons = document.getElementById('editActionPresetWeapons').value;
        const rulesText = document.getElementById('editActionPresetRules').value;
        const rules = rulesText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        presetActions[id] = { id, name, desc, members, weapons, rules };
        localStorage.setItem('preset_actions_local', JSON.stringify(presetActions));

        hideModal(modalActionPreset);
        currentSelectedPreset = id;
        renderIllegalActions();
    });
}

const btnDeleteActionPreset = document.getElementById('btnDeleteActionPreset');
if (btnDeleteActionPreset) {
    btnDeleteActionPreset.addEventListener('click', () => {
        const id = document.getElementById('editActionPresetId').value;
        if (id && confirm("Deseja remover este tipo de ação permanentemente?")) {
            delete presetActions[id];
            localStorage.setItem('preset_actions_local', JSON.stringify(presetActions));
            hideModal(modalActionPreset);
            const keys = Object.keys(presetActions);
            currentSelectedPreset = keys.length > 0 ? keys[0] : 'outro';
            renderIllegalActions();
        }
    });
}


// ─── ACTION REPORT LOGS ───────────────────────────────────────────────────
if (formActionReport) {
    formActionReport.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rec = {
            description: document.getElementById('actionDesc').value,
            outcome: document.getElementById('actionOutcome').value,
            participants: document.getElementById('actionParticipants').value
        };

        db.saveIllegalRecord(rec);
        hideModal(modalActionReport);
        await loadData();
    });
}

window.deleteIllegalRecord = async function(recId) {
    if (confirm("Deseja remover este registro de ação?")) {
        db.deleteIllegalRecord(recId);
        await loadData();
    }
};

// ─── EDIT/CREATE ITEMS LOGIC ──────────────────────────────────────────────
if (addNewItemBtn) {
    addNewItemBtn.addEventListener('click', () => {
        if (currentCategory === 'members' || currentCategory === 'illegal-hierarchy') {
            if (currentSubCategory === 'roles') {
                openRoleEditModal('');
            } else {
                openMemberEditModal('');
            }
        } else {
            openItemEditModal('', currentCategory);
        }
    });
}

window.openItemEditModal = function(itemId = '', category = '') {
    formItemEdit.reset();
    const titleEl = document.getElementById('itemModalTitle');
    const deleteBtn = document.getElementById('btnDeleteItem');
    const ingredientsBuilder = document.getElementById('ingredientsListBuilder');
    ingredientsBuilder.innerHTML = '';

    const editImgSel = document.getElementById('editItemImage');
    editImgSel.innerHTML = '<option value="">Sem ícone</option>' + Object.keys(iconLabels).map(key => `
        <option value="${key}">${iconLabels[key]}</option>
    `).join('');

    const catSelect = document.getElementById('editItemCategory');
    const stageGroup = document.getElementById('groupItemStage');

    catSelect.onchange = () => {
        const val = catSelect.value;
        const priceLabel = document.getElementById('labelItemPrice');
        if (val === 'components') {
            stageGroup.style.display = 'block';
            priceLabel.textContent = 'Preço de Venda ($)';
        } else if (val === 'services') {
            stageGroup.style.display = 'none';
            priceLabel.textContent = 'Preço do Serviço ($)';
        } else {
            stageGroup.style.display = 'none';
            priceLabel.textContent = 'Preço de Venda ($)';
        }
    };

    if (itemId) {
        titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editar Item`;
        deleteBtn.style.display = 'block';
        
        const items = getItemsForCategory(category);
        const item = items.find(i => i.id === itemId);
        if (item) {
            document.getElementById('editItemId').value = item.id;
            document.getElementById('editItemName').value = item.name;
            catSelect.value = category;
            
            catSelect.onchange();
            if (category === 'components') {
                document.getElementById('editItemStage').value = item.stage || '';
                document.getElementById('editItemPrice').value = item.sellPrice || 0;
            } else if (category === 'services') {
                document.getElementById('editItemPrice').value = item.price || 0;
            } else {
                document.getElementById('editItemPrice').value = item.sellPrice || 0;
            }

            const matchedKey = Object.keys(imageMap).find(key => imageMap[key] === item.image) || item.image || '';
            editImgSel.value = matchedKey;

            if (item.ingredients && item.ingredients.length > 0) {
                item.ingredients.forEach(ing => {
                    addIngredientRowBuilder(ing.id, ing.quantity);
                });
            }
        }
    } else {
        titleEl.innerHTML = `<i class="fa-solid fa-plus"></i> Novo Item`;
        deleteBtn.style.display = 'none';
        document.getElementById('editItemId').value = '';
        catSelect.value = (category === 'home' || category === 'members' || category === 'hierarchy') ? 'components' : category;
        catSelect.onchange();
    }

    showModal(modalItemEdit);
};

function addIngredientRowBuilder(selectedId = '', quantity = 1) {
    const builder = document.getElementById('ingredientsListBuilder');
    const row = document.createElement('div');
    row.className = 'ingredient-edit-row';
    
    const optionsHtml = activeMaterials.map(mat => `
        <option value="${mat.id}" ${mat.id === selectedId ? 'selected' : ''}>${mat.name}</option>
    `).join('');

    row.innerHTML = `
        <select required>
            ${optionsHtml}
        </select>
        <input type="number" value="${quantity}" min="1" required placeholder="Qtd">
        <button type="button" class="qty-btn danger-btn" onclick="this.parentElement.remove()" style="width:28px; height:28px;">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;
    builder.appendChild(row);
}

document.getElementById('btnAddIngredientRow').addEventListener('click', () => {
    const firstMatId = activeMaterials[0] ? activeMaterials[0].id : '';
    addIngredientRowBuilder(firstMatId, 1);
});

if (formItemEdit) {
    formItemEdit.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editItemId').value || 'item_' + Date.now();
        const name = document.getElementById('editItemName').value;
        const category = document.getElementById('editItemCategory').value;
        const stageVal = document.getElementById('editItemStage').value;
        const price = Number(document.getElementById('editItemPrice').value);
        const imageKey = document.getElementById('editItemImage').value;

        const ingredients = [];
        const rows = document.querySelectorAll('.ingredient-edit-row');
        rows.forEach(row => {
            const selectEl = row.querySelector('select');
            const qtyEl = row.querySelector('input');
            if (selectEl && qtyEl) {
                ingredients.push({
                    id: selectEl.value,
                    quantity: Number(qtyEl.value)
                });
            }
        });

        const item = {
            id: id,
            name: name,
            ingredients: ingredients,
            image: imageMap[imageKey] || imageKey || null
        };

        if (category === 'components') {
            item.stage = stageVal ? Number(stageVal) : null;
            item.sellPrice = price;
        } else if (category === 'services') {
            item.price = price;
        } else {
            item.sellPrice = price;
        }

        await db.saveItem(item, category);
        hideModal(modalItemEdit);
        await loadData();
    });
}

const btnDeleteItem = document.getElementById('btnDeleteItem');
if (btnDeleteItem) {
    btnDeleteItem.addEventListener('click', async () => {
        const id = document.getElementById('editItemId').value;
        const category = document.getElementById('editItemCategory').value;
        if (id && confirm("Deseja excluir este item permanentemente?")) {
            await db.deleteItem(id, category);
            hideModal(modalItemEdit);
            await loadData();
        }
    });
}

window.openMemberEditModal = function(memberId = '') {
    formMemberEdit.reset();
    const titleEl = document.getElementById('memberModalTitle');
    const deleteBtn = document.getElementById('btnDeleteMember');

    // Populate legal roles checklist
    const rolesList = activeRoles.length > 0 ? activeRoles : [
        { name: 'CEO' }, { name: 'Vice Presidente' }, { name: 'Gerente' },
        { name: 'Mecanico Senior' }, { name: 'Mecanico Pleno' }, { name: 'Mecanico Junior' },
        { name: 'Estagiario' }
    ];
    const rolesContainer = document.getElementById('editMemberRolesContainer');
    rolesContainer.innerHTML = rolesList.map(r => `
        <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:var(--white-main); cursor:pointer;">
            <input type="checkbox" class="edit-member-role-cb" value="${r.name}" style="accent-color:var(--red-primary);"> ${r.name}
        </label>
    `).join('');

    // Populate illegal roles checklist
    const illegalRolesList = ['01', 'Gerente', 'Corredor', 'Membro', 'Probatorio'];
    const illegalRolesContainer = document.getElementById('editMemberIllegalRolesContainer');
    illegalRolesContainer.innerHTML = illegalRolesList.map(r => `
        <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:var(--white-main); cursor:pointer;">
            <input type="checkbox" class="edit-member-illegal-role-cb" value="${r}" style="accent-color:#f59e0b;"> ${r}
        </label>
    `).join('');

    // Reset disabled states
    document.getElementById('editMemberStatus').disabled = false;
    document.getElementById('editMemberPassport').disabled = false;
    document.getElementById('editMemberJoinDate').disabled = false;
    document.getElementById('editMemberIlegal').disabled = false;
    document.getElementById('editMemberName').disabled = false;

    const loggedInId = (currentLoggedInMember ? currentLoggedInMember.id : '') || (currentIllegalMember ? currentIllegalMember.id : '');
    const isOwnProfile = loggedInId && loggedInId === memberId;
    const isAllowedGeneral = hasPermission('edit_members');
    const restrictEdit = isOwnProfile && !isAllowedGeneral;

    if (memberId) {
        titleEl.innerHTML = restrictEdit ? `<i class="fa-solid fa-user-pen"></i> Editar Meu Perfil` : `<i class="fa-solid fa-user-pen"></i> Editar Membro`;
        deleteBtn.style.display = restrictEdit ? 'none' : 'block';

        const member = activeMembers.find(m => m.id === memberId);
        if (member) {
            document.getElementById('editMemberId').value = member.id;
            document.getElementById('editMemberName').value = member.name;
            document.getElementById('editMemberStatus').value = member.status;
            document.getElementById('editMemberPassport').value = member.passport;
            document.getElementById('editMemberPhone').value = member.phone;
            document.getElementById('editMemberJoinDate').value = member.joinDate;
            document.getElementById('editMemberAvatarUrl').value = member.avatarUrl || '';
            document.getElementById('editMemberLiveUrl').value = member.liveUrl || '';
            document.getElementById('editMemberKickUrl').value = member.kickUrl || '';
            document.getElementById('editMemberYoutubeUrl').value = member.youtubeUrl || '';
            document.getElementById('editMemberTiktokUrl').value = member.tiktokUrl || '';
            document.getElementById('editMemberIsLive').checked = !!member.isLive;
            
            // Set checkboxes for legal roles
            const userRoles = member.role ? member.role.split(',').map(r => r.trim().toLowerCase()) : [];
            document.querySelectorAll('.edit-member-role-cb').forEach(cb => {
                cb.checked = userRoles.includes(cb.value.toLowerCase());
                cb.disabled = restrictEdit;
            });

            const hasIllegal = !!member.flagIlegal;
            document.getElementById('editMemberIlegal').checked = hasIllegal;
            document.getElementById('editMemberIllegalRoleGroup').style.display = hasIllegal ? 'block' : 'none';

            // Set checkboxes for illegal roles
            const userIllegalRoles = member.illegalRole ? member.illegalRole.split(',').map(r => r.trim().toLowerCase()) : [];
            document.querySelectorAll('.edit-member-illegal-role-cb').forEach(cb => {
                cb.checked = userIllegalRoles.includes(cb.value.toLowerCase());
                cb.disabled = restrictEdit;
            });

            if (restrictEdit) {
                document.getElementById('editMemberStatus').disabled = true;
                document.getElementById('editMemberPassport').disabled = true;
                document.getElementById('editMemberJoinDate').disabled = true;
                document.getElementById('editMemberIlegal').disabled = true;
            }
        }
    } else {
        titleEl.innerHTML = `<i class="fa-solid fa-user-plus"></i> Adicionar Membro`;
        deleteBtn.style.display = 'none';
        document.getElementById('editMemberId').value = '';
        document.getElementById('editMemberJoinDate').value = new Date().toISOString().substring(0, 10);
        document.getElementById('editMemberAvatarUrl').value = '';
        document.getElementById('editMemberLiveUrl').value = '';
        document.getElementById('editMemberKickUrl').value = '';
        document.getElementById('editMemberYoutubeUrl').value = '';
        document.getElementById('editMemberTiktokUrl').value = '';
        document.getElementById('editMemberIsLive').checked = false;
        document.getElementById('editMemberIllegalRoleGroup').style.display = 'none';
        
        // Select Estagiario as default for new members
        document.querySelectorAll('.edit-member-role-cb').forEach(cb => {
            cb.checked = cb.value.toLowerCase() === 'estagiario';
            cb.disabled = false;
        });
    }
    showModal(modalMemberEdit);
};

if (formMemberEdit) {
    formMemberEdit.addEventListener('submit', async (e) => {
        e.preventDefault();
        const flagIlegal = document.getElementById('editMemberIlegal').checked;
        
        // Collect checked roles
        const selectedRoles = Array.from(document.querySelectorAll('.edit-member-role-cb:checked')).map(cb => cb.value).join(', ');
        const selectedIllegalRoles = Array.from(document.querySelectorAll('.edit-member-illegal-role-cb:checked')).map(cb => cb.value).join(', ');

        const memberId = document.getElementById('editMemberId').value;
        const existingMember = memberId ? activeMembers.find(m => m.id === memberId) : null;

        const member = {
            id: memberId || 'm_' + Date.now(),
            name: document.getElementById('editMemberName').value,
            role: selectedRoles || 'Agregado',
            status: document.getElementById('editMemberStatus').value,
            passport: document.getElementById('editMemberPassport').value,
            phone: document.getElementById('editMemberPhone').value,
            joinDate: document.getElementById('editMemberJoinDate').value,
            flagIlegal: flagIlegal,
            illegalRole: flagIlegal ? selectedIllegalRoles : '',
            avatarUrl: document.getElementById('editMemberAvatarUrl').value.trim(),
            liveUrl: document.getElementById('editMemberLiveUrl').value.trim(),
            kickUrl: document.getElementById('editMemberKickUrl').value.trim(),
            youtubeUrl: document.getElementById('editMemberYoutubeUrl').value.trim(),
            tiktokUrl: document.getElementById('editMemberTiktokUrl').value.trim(),
            isLive: document.getElementById('editMemberIsLive').checked,
            password: existingMember ? existingMember.password : 'membro123'
        };

        await db.saveMember(member);
        hideModal(modalMemberEdit);
        await loadData();
    });
}

const btnDeleteMember = document.getElementById('btnDeleteMember');
if (btnDeleteMember) {
    btnDeleteMember.addEventListener('click', async () => {
        const id = document.getElementById('editMemberId').value;
        if (id && confirm("Deseja realmente remover este membro da organização?")) {
            await db.deleteMember(id);
            hideModal(modalMemberEdit);
            await loadData();
        }
    });
}

// ─── CARGOS & PERMISSÕES (ROLES) CRUD HANDLERS ────────────────────────────
window.openRoleEditModal = function(roleId = '') {
    formRoleEdit.reset();
    const titleEl = document.getElementById('roleModalTitle');
    const deleteBtn = document.getElementById('btnDeleteRole');

    if (roleId) {
        titleEl.innerHTML = `<i class="fa-solid fa-wrench"></i> Configurar Cargo`;
        deleteBtn.style.display = 'block';

        const role = activeRoles.find(r => r.id === roleId);
        if (role) {
            document.getElementById('editRoleId').value = role.id;
            document.getElementById('editRoleName').value = role.name;
            
            // Check boxes
            document.querySelectorAll('#rolePermissionsList input').forEach(box => {
                box.checked = role.permissions.includes(box.value);
            });
        }
    } else {
        titleEl.innerHTML = `<i class="fa-solid fa-plus"></i> Criar Novo Cargo`;
        deleteBtn.style.display = 'none';
        document.getElementById('editRoleId').value = '';
    }
    showModal(modalRoleEdit);
};

if (formRoleEdit) {
    formRoleEdit.addEventListener('submit', async (e) => {
        e.preventDefault();
        const roleId = document.getElementById('editRoleId').value || 'r_' + Date.now();
        const roleName = document.getElementById('editRoleName').value;

        // Parse checked permissions
        const permissions = [];
        document.querySelectorAll('#rolePermissionsList input:checked').forEach(box => {
            permissions.push(box.value);
        });

        const role = {
            id: roleId,
            name: roleName,
            permissions: permissions
        };

        await db.saveRole(role);
        hideModal(modalRoleEdit);
        await loadData();
    });
}

const btnDeleteRole = document.getElementById('btnDeleteRole');
if (btnDeleteRole) {
    btnDeleteRole.addEventListener('click', async () => {
        const id = document.getElementById('editRoleId').value;
        if (id && confirm("Deseja excluir este cargo permanentemente?")) {
            await db.deleteRole(id);
            hideModal(modalRoleEdit);
            await loadData();
        }
    });
}

window.promoteMember = async function(memberId) {
    const member = activeMembers.find(m => m.id === memberId);
    if (!member) return;

    // Load roles list to find hierarchy order
    const roleIdx = activeRoles.findIndex(r => r.name === member.role);
    if (roleIdx > 0) {
        // Move to higher role (index roleIdx - 1)
        member.role = activeRoles[roleIdx - 1].name;
        await db.saveMember(member);
        await loadData();
        renderItems();
    }
};

window.demoteMember = async function(memberId) {
    const member = activeMembers.find(m => m.id === memberId);
    if (!member) return;

    // Load roles list to find hierarchy order
    const roleIdx = activeRoles.findIndex(r => r.name === member.role);
    if (roleIdx >= 0 && roleIdx < activeRoles.length - 1) {
        // Move to lower role (index roleIdx + 1)
        member.role = activeRoles[roleIdx + 1].name;
        await db.saveMember(member);
        await loadData();
        renderItems();
    }
};

// ─── CATEGORIES NAVIGATION LISTENERS ──────────────────────────────────────
categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.dataset.category;
        switchCategory(cat);
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

// ─── EDIT MODE TOGGLE LOGIC ──────────────────────────────────────────────
window.isEditModeActive = false;

if (editCurrentBtn) {
    editCurrentBtn.addEventListener('click', () => {
        window.isEditModeActive = !window.isEditModeActive;

        if (window.isEditModeActive) {
            editCurrentBtn.style.background = 'rgba(245, 158, 11, 0.2)';
            editCurrentBtn.style.borderColor = '#f59e0b';
            editCurrentBtn.style.color = '#f59e0b';
            editCurrentBtn.innerHTML = `<i class="fa-solid fa-xmark"></i> Concluir Alterações`;
            document.body.classList.add('edit-mode-active');
        } else {
            editCurrentBtn.style.background = 'rgba(255,255,255,0.05)';
            editCurrentBtn.style.borderColor = 'var(--border-dark)';
            editCurrentBtn.style.color = 'var(--white-main)';
            updateAuthUI();
            document.body.classList.remove('edit-mode-active');
        }
    });
}

// Global click intercept handlers for different cards
// Works if edit mode is active OR if user has the relevant permission
window.handleRecipeCardClick = function(id) {
    if (window.isEditModeActive || hasPermission('edit_products')) {
        openItemEditModal(id, 'illegal-recipes');
    }
};

window.handleMemberCardClick = function(id) {
    const loggedInId = (currentLoggedInMember ? currentLoggedInMember.id : '') || (currentIllegalMember ? currentIllegalMember.id : '');
    const isOwnProfile = loggedInId && loggedInId === id;
    if (window.isEditModeActive || hasPermission('edit_members') || isOwnProfile) {
        openMemberEditModal(id);
    }
};

window.handleEscapeCardClick = function(id) {
    if (window.isEditModeActive || hasPermission('edit_services')) {
        openEscapeCardModal(id);
    }
};

window.handleCarRowClick = function(id) {
    if (window.isEditModeActive || hasPermission('edit_members')) {
        openImpoundedCarModal(id);
    }
};

window.handleActionPresetClick = function(id) {
    if (window.isEditModeActive || db.isAdminLoggedIn() || hasPermission('edit_services')) {
        openActionPresetModal(id);
    }
};

// ─── INIT ─────────────────────────────────────────────────────────────────
(async () => {
    await loadData();
    updateAuthUI();
})();
