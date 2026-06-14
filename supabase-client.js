// supabase-client.js - Database and Auth Integration

// Safe localStorage wrapper to prevent crashes when opening via file:// protocol
const safeStorage = {
    _memory: {},
    getItem: (key) => {
        try {
            return window.localStorage.getItem(key);
        } catch (e) {
            return safeStorage._memory[key] || null;
        }
    },
    setItem: (key, value) => {
        try {
            window.localStorage.setItem(key, value);
        } catch (e) {
            safeStorage._memory[key] = value;
        }
    },
    removeItem: (key) => {
        try {
            window.localStorage.removeItem(key);
        } catch (e) {
            delete safeStorage._memory[key];
        }
    }
};
window.safeStorage = safeStorage;

let supabaseInstance = null;

// ─── SUPABASE CREDENTIALS (hardcoded) ─────────────────────────────────────
const SUPABASE_URL     = 'https://dypgjfmvtvxgpdtnnwog.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cGdqZm12dHZ4Z3BkdG5ud29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NTExMTMsImV4cCI6MjA5NzAyNzExM30.0RWv_HzitLjSXmlqH1YFpRIvTBDlSX7SWEJ0AbqGzmk';

// Load config — always uses hardcoded credentials
const getSupabaseConfig = () => ({
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
});

// Initialize Supabase automatically on load
const initSupabase = () => {
    if (window.supabase) {
        try {
            supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log("Supabase Client initialized successfully.");
        } catch (e) {
            console.error("Error initializing Supabase client:", e);
            supabaseInstance = null;
        }
    } else {
        supabaseInstance = null;
    }
};

// Seed LocalStorage/safeStorage with data.js values if empty
const initLocalStorageFallback = () => {
    const seedIfEmpty = (key, dataValue) => {
        const stored = safeStorage.getItem(key);
        if (!stored || stored === '[]' || stored === 'null') {
            safeStorage.setItem(key, JSON.stringify(dataValue));
        }
    };

    seedIfEmpty('materials_local', typeof materials !== 'undefined' ? materials : []);
    seedIfEmpty('components_local', typeof components !== 'undefined' ? components : []);
    seedIfEmpty('services_local', typeof services !== 'undefined' ? services : []);
    seedIfEmpty('products_local', typeof products !== 'undefined' ? products : []);

    // Seeding roles/cargos and permissions list
    const defaultRoles = [
        { id: 'r_nightboss', name: 'Night Boss', permissions: ['view_stages', 'edit_stages', 'view_services', 'edit_services', 'view_products', 'edit_products', 'view_members', 'edit_members', 'access_vault', 'access_illegal', 'manage_roles'] },
        { id: 'r_underboss', name: 'Under Boss', permissions: ['view_stages', 'edit_stages', 'view_services', 'edit_services', 'view_products', 'edit_products', 'view_members', 'edit_members', 'access_vault', 'access_illegal'] },
        { id: 'r_gerente', name: 'Gerente', permissions: ['view_stages', 'edit_stages', 'view_services', 'edit_services', 'view_products', 'edit_products', 'view_members', 'edit_members', 'access_vault', 'access_illegal'] },
        { id: 'r_racer', name: 'Racer', permissions: ['view_stages', 'view_services', 'view_products', 'view_members', 'access_vault'] },
        { id: 'r_runner', name: 'Runner', permissions: ['view_stages', 'view_services', 'view_products'] }
    ];
    seedIfEmpty('roles_local', defaultRoles);

    // Seeding default illegal recipes matching uploaded screenshots
    const defaultIllegalRecipes = [
        { id: 'id_falso', name: 'ID Falso (Vazio)', time: '10 seconds', image: 'icones/lockpickavançada.png', ingredients: [{ id: 'refined_plastic', name: 'Plástico', quantity: 30 }, { id: 'refined_aluminum', name: 'Alumínio', quantity: 20 }] },
        { id: 'placa_falsa', name: 'Placa Falsa', time: '60 seconds', image: 'icones/sucata.png', ingredients: [{ id: 'refined_aluminum', name: 'Alumínio', quantity: 100 }] },
        { id: 'nitro_g', name: 'Nitro (G)', time: '120 seconds', image: 'icones/nitro.png', ingredients: [{ id: 'refined_aluminum', name: 'Alumínio', quantity: 300 }, { id: 'refined_copper', name: 'Cobre', quantity: 300 }, { id: 'refined_plastic', name: 'Plástico', quantity: 300 }] },
        { id: 'cinto_corrida', name: 'Cinto de Corrida', time: '60 seconds', image: 'icones/cintodecorrida.png', ingredients: [{ id: 'refined_aluminum', name: 'Alumínio', quantity: 50 }, { id: 'refined_plastic', name: 'Plástico', quantity: 10 }] },
        { id: 'usb_corrida', name: 'USB de Corrida', time: '180 seconds', image: 'icones/ecu.png', ingredients: [{ id: 'refined_aluminum', name: 'Alumínio', quantity: 100 }, { id: 'refined_copper', name: 'Cobre', quantity: 100 }, { id: 'refined_scrap', name: 'Componente', quantity: 200 }] },
        { id: 'usb_boosting', name: 'Boosting USB', time: '180 seconds', image: 'icones/ecu.png', ingredients: [{ id: 'refined_aluminum', name: 'Alumínio', quantity: 100 }, { id: 'refined_copper', name: 'Cobre', quantity: 100 }, { id: 'refined_scrap', name: 'Componente', quantity: 200 }] },
        { id: 'maconha', name: 'Maconha', time: '30 seconds', image: 'icones/borracha.png', ingredients: [{ id: 'refined_plastic', name: 'Plástico', quantity: 10 }, { id: 'refined_rubber', name: 'Borracha', quantity: 5 }] },
        { id: 'metanfetamina', name: 'Metanfetamina', time: '60 seconds', image: 'icones/sucata.png', ingredients: [{ id: 'refined_glass', name: 'Vidro Refinado', quantity: 20 }, { id: 'refined_plastic', name: 'Plástico', quantity: 10 }] }
    ];
    seedIfEmpty('illegal_recipes_local', defaultIllegalRecipes);

    // Initializing Vault and Ilegal empty states
    if (!safeStorage.getItem('vault_password_local')) {
        safeStorage.setItem('vault_password_local', '1234');
    }
    seedIfEmpty('vault_logs_local', []);
    seedIfEmpty('illegal_records_local', []);
    seedIfEmpty('impounded_cars_local', []);

    // Initialize members — seed a default test member with passport 123 for local testing
    const MEMBERS_SEED_VERSION = 'v2_test123';
    if (safeStorage.getItem('members_seed_version') !== MEMBERS_SEED_VERSION) {
        const defaultMembers = [
            {
                id: 'mem_test_001',
                name: 'Teste Ilegal',
                passport: '123',
                phone: '555-0001',
                role: 'Runner',
                joinDate: new Date().toLocaleDateString('pt-BR'),
                status: 'Ativo',
                password: 'teste123',
                flagIlegal: true,
                illegalRole: 'Novato'
            }
        ];
        safeStorage.setItem('members_local', JSON.stringify(defaultMembers));
        safeStorage.setItem('members_seed_version', MEMBERS_SEED_VERSION);
    } else if (!safeStorage.getItem('members_local')) {
        safeStorage.setItem('members_local', JSON.stringify([]));
    }
    if (!safeStorage.getItem('mural_local')) {
        const defaultPosts = [
            {
                id: 'm1',
                created_at: new Date().toISOString(),
                title: 'Bem-vindo ao RE:Motion Performance Shop!',
                content: 'Use este painel para calcular orçamentos de serviços, kits de stage e produtos. Admins podem logar para publicar avisos e gerenciar preços.',
                author: 'Bigas',
                tag: 'Novidade'
            }
        ];
        safeStorage.setItem('mural_local', JSON.stringify(defaultPosts));
    }
};

// Initialize everything immediately
initSupabase();
initLocalStorageFallback();

// Database API wrapper
const db = {
    isConnected: () => supabaseInstance !== null,

    // Set connection configuration
    setConnection: (url, anonKey) => {
        if (!url || !anonKey) {
            safeStorage.removeItem('supabase_url');
            safeStorage.removeItem('supabase_anon_key');
        } else {
            safeStorage.setItem('supabase_url', url);
            safeStorage.setItem('supabase_anon_key', anonKey);
        }
        initSupabase();
        return db.isConnected();
    },

    // Get connection info
    getConnectionInfo: () => getSupabaseConfig(),
    // --- MATERIALS ---
    getMaterials: async () => {
        if (supabaseInstance) {
            const { data, error } = await supabaseInstance.from('materials').select('*');
            if (!error && data) {
                // Auto-seed missing default materials
                const existingIds = new Set(data.map(m => m.id));
                const missingMaterials = [];
                if (typeof materials !== 'undefined') {
                    materials.forEach(m => {
                        if (!existingIds.has(m.id)) {
                            missingMaterials.push(m);
                        }
                    });
                }
                if (missingMaterials.length > 0) {
                    console.log(`Auto-seeding ${missingMaterials.length} missing default materials to Supabase...`);
                    for (const mat of missingMaterials) {
                        await supabaseInstance.from('materials').upsert(mat);
                    }
                    const { data: refreshedData } = await supabaseInstance.from('materials').select('*');
                    if (refreshedData) return refreshedData;
                }
                return data;
            }
            console.warn("Supabase materials empty or errored. Falling back to local storage.", error);
        }
        return JSON.parse(safeStorage.getItem('materials_local') || '[]');
    },

    saveMaterial: async (material) => {
        if (supabaseInstance) {
            const { error } = await supabaseInstance.from('materials').upsert(material);
            if (!error) return true;
            console.error("Supabase error saving material:", error);
        }
        // Save to local fallback
        const locals = JSON.parse(safeStorage.getItem('materials_local') || '[]');
        const idx = locals.findIndex(m => m.id === material.id);
        if (idx >= 0) locals[idx] = material;
        else locals.push(material);
        safeStorage.setItem('materials_local', JSON.stringify(locals));
        return true;
    },

    processItemsData: (data) => {
        const components = data.filter(i => i.category === 'components').map(i => ({
            id: i.id,
            name: i.name,
            stage: i.stage,
            sellPrice: Number(i.sell_price),
            ingredients: typeof i.ingredients === 'string' ? JSON.parse(i.ingredients) : i.ingredients
        }));
        const services = data.filter(i => i.category === 'services').map(i => ({
            id: i.id,
            name: i.name,
            price: Number(i.price),
            ingredients: typeof i.ingredients === 'string' ? JSON.parse(i.ingredients) : i.ingredients
        }));
        const products = data.filter(i => i.category === 'products').map(i => ({
            id: i.id,
            name: i.name,
            sellPrice: Number(i.sell_price),
            ingredients: typeof i.ingredients === 'string' ? JSON.parse(i.ingredients) : i.ingredients
        }));
        return { components, services, products };
    },

    // --- ITEMS (components, services, products) ---
    getItems: async () => {
        if (supabaseInstance) {
            const { data, error } = await supabaseInstance.from('items').select('*');
            if (!error && data) {
                // Check if any default items are missing in Supabase
                const existingIds = new Set(data.map(i => i.id));
                const missingItems = [];

                if (typeof components !== 'undefined') {
                    components.forEach(item => {
                        if (!existingIds.has(item.id)) {
                            missingItems.push({ item, category: 'components' });
                        }
                    });
                }
                if (typeof services !== 'undefined') {
                    services.forEach(item => {
                        if (!existingIds.has(item.id)) {
                            missingItems.push({ item, category: 'services' });
                        }
                    });
                }
                if (typeof products !== 'undefined') {
                    products.forEach(item => {
                        if (!existingIds.has(item.id)) {
                            missingItems.push({ item, category: 'products' });
                        }
                    });
                }

                if (missingItems.length > 0) {
                    console.log(`Auto-seeding ${missingItems.length} missing default items to Supabase...`);
                    for (const { item, category } of missingItems) {
                        const dbItem = {
                            id: item.id,
                            category: category,
                            name: item.name,
                            stage: item.stage || null,
                            price: category === 'services' ? (item.price || 0) : 0,
                            sell_price: category !== 'services' ? (item.sellPrice || 0) : 0,
                            ingredients: JSON.stringify(item.ingredients || []),
                            image: item.image || null
                        };
                        await supabaseInstance.from('items').upsert(dbItem);
                    }
                    const { data: refreshedData } = await supabaseInstance.from('items').select('*');
                    if (refreshedData) {
                        return db.processItemsData(refreshedData);
                    }
                }
                return db.processItemsData(data);
            }
            console.warn("Supabase items empty or errored. Using local storage.", error);
        }
        // Fallback to local storage
        return {
            components: JSON.parse(safeStorage.getItem('components_local') || '[]'),
            services: JSON.parse(safeStorage.getItem('services_local') || '[]'),
            products: JSON.parse(safeStorage.getItem('products_local') || '[]')
        };
    },

    saveItem: async (item, category) => {
        if (supabaseInstance) {
            const dbItem = {
                id: item.id,
                category: category,
                name: item.name,
                stage: item.stage || null,
                price: category === 'services' ? (item.price || 0) : 0,
                sell_price: category !== 'services' ? (item.sellPrice || 0) : 0,
                ingredients: JSON.stringify(item.ingredients || []),
                image: item.image || null
            };
            const { error } = await supabaseInstance.from('items').upsert(dbItem);
            if (!error) return true;
            console.error("Supabase error saving item:", error);
        }

        // Local storage fallback
        const key = category === 'illegal-recipes' ? 'illegal_recipes_local' : `${category}_local`;
        const locals = JSON.parse(safeStorage.getItem(key) || '[]');
        const idx = locals.findIndex(i => i.id === item.id);
        if (idx >= 0) locals[idx] = item;
        else locals.push(item);
        safeStorage.setItem(key, JSON.stringify(locals));
        return true;
    },

    deleteItem: async (itemId, category) => {
        if (supabaseInstance) {
            const { error } = await supabaseInstance.from('items').delete().eq('id', itemId);
            if (!error) return true;
            console.error("Supabase error deleting item:", error);
        }
        // Local storage fallback
        const key = category === 'illegal-recipes' ? 'illegal_recipes_local' : `${category}_local`;
        let locals = JSON.parse(safeStorage.getItem(key) || '[]');
        locals = locals.filter(i => i.id !== itemId);
        safeStorage.setItem(key, JSON.stringify(locals));
        return true;
    },

    // --- MURAL DE AVISOS ---
    getMural: async () => {
        if (supabaseInstance) {
            const { data, error } = await supabaseInstance.from('mural').select('*').order('created_at', { ascending: false });
            if (!error && data) return data;
            console.warn("Supabase mural errored. Using local storage.", error);
        }
        const posts = JSON.parse(safeStorage.getItem('mural_local') || '[]');
        return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    saveMuralPost: async (post) => {
        if (supabaseInstance) {
            const { error } = await supabaseInstance.from('mural').insert({
                title: post.title,
                content: post.content,
                author: post.author,
                tag: post.tag
            });
            if (!error) return true;
            console.error("Supabase error saving mural post:", error);
        }
        // Local storage fallback
        const posts = JSON.parse(safeStorage.getItem('mural_local') || '[]');
        const newPost = {
            id: 'm_' + Date.now(),
            created_at: new Date().toISOString(),
            ...post
        };
        posts.push(newPost);
        safeStorage.setItem('mural_local', JSON.stringify(posts));
        return true;
    },

    deleteMuralPost: async (postId) => {
        if (supabaseInstance) {
            const { error } = await supabaseInstance.from('mural').delete().eq('id', postId);
            if (!error) return true;
            console.error("Supabase error deleting mural post:", error);
        }
        // Local storage fallback
        let posts = JSON.parse(safeStorage.getItem('mural_local') || '[]');
        posts = posts.filter(p => p.id !== postId);
        safeStorage.setItem('mural_local', JSON.stringify(posts));
        return true;
    },

    processMembersData: (data) => {
        return data.map(m => ({
            id: m.id,
            name: m.name,
            passport: m.passport,
            phone: m.phone,
            role: m.role,
            joinDate: m.join_date,
            status: m.status,
            password: m.password,
            flagIlegal: m.flag_ilegal,
            illegalRole: m.illegal_role
        }));
    },

    // --- MEMBERS ---
    getMembers: async () => {
        if (supabaseInstance) {
            const { data, error } = await supabaseInstance.from('members').select('*');
            if (!error && data) {
                // Fetch local storage members to see if any are missing in Supabase
                const localMembers = JSON.parse(safeStorage.getItem('members_local') || '[]');
                const existingIds = new Set(data.map(m => m.id));
                const missingMembers = localMembers.filter(m => !existingIds.has(m.id));

                if (missingMembers.length > 0) {
                    console.log(`Auto-seeding ${missingMembers.length} missing members to Supabase...`);
                    for (const member of missingMembers) {
                        const dbMember = {
                            id: member.id,
                            name: member.name,
                            passport: member.passport,
                            phone: member.phone,
                            role: member.role,
                            join_date: member.joinDate,
                            status: member.status,
                            password: member.password,
                            flag_ilegal: member.flagIlegal,
                            illegal_role: member.illegalRole
                        };
                        await supabaseInstance.from('members').upsert(dbMember);
                    }
                    // Fetch all members again to get the complete set
                    const { data: refreshedData } = await supabaseInstance.from('members').select('*');
                    if (refreshedData) {
                        return db.processMembersData(refreshedData);
                    }
                }
                return db.processMembersData(data);
            }
            console.warn("Supabase members error, using local storage", error);
        }
        return JSON.parse(safeStorage.getItem('members_local') || '[]');
    },

    saveMember: async (member) => {
        if (supabaseInstance) {
            const dbMember = {
                id: member.id,
                name: member.name,
                passport: member.passport,
                phone: member.phone,
                role: member.role,
                join_date: member.joinDate,
                status: member.status,
                password: member.password,
                flag_ilegal: member.flagIlegal,
                illegal_role: member.illegalRole
            };
            const { error } = await supabaseInstance.from('members').upsert(dbMember);
            if (!error) return true;
            console.error("Supabase error saving member:", error);
        }
        const locals = JSON.parse(safeStorage.getItem('members_local') || '[]');
        const idx = locals.findIndex(m => m.id === member.id);
        if (idx >= 0) locals[idx] = member;
        else locals.push(member);
        safeStorage.setItem('members_local', JSON.stringify(locals));
        return true;
    },

    memberLogin: async (passportOrEmail, password) => {
        // Load members list (queries Supabase if connected)
        const membersList = await db.getMembers();
        const member = membersList.find(m => (m.passport === passportOrEmail || m.email === passportOrEmail) && m.password === password);
        if (!member) {
            return { success: false, error: 'Usuário ou senha incorretos.' };
        }
        if (member.status === 'Pendente') {
            return { success: false, error: 'Seu cadastro está pendente de aprovação por um administrador.' };
        }
        return { success: true, member };
    },

    deleteMember: async (memberId) => {
        if (supabaseInstance) {
            const { error } = await supabaseInstance.from('members').delete().eq('id', memberId);
            if (!error) return true;
            console.error("Supabase error deleting member:", error);
        }
        let locals = JSON.parse(safeStorage.getItem('members_local') || '[]');
        locals = locals.filter(m => m.id !== memberId);
        safeStorage.setItem('members_local', JSON.stringify(locals));
        return true;
    },

    // --- CARGOS & PERMISSÕES (ROLES) ---
    getRoles: async () => {
        return JSON.parse(safeStorage.getItem('roles_local') || '[]');
    },

    saveRole: async (role) => {
        const locals = JSON.parse(safeStorage.getItem('roles_local') || '[]');
        const idx = locals.findIndex(r => r.id === role.id);
        if (idx >= 0) locals[idx] = role;
        else locals.push(role);
        safeStorage.setItem('roles_local', JSON.stringify(locals));
        return true;
    },

    deleteRole: async (roleId) => {
        let locals = JSON.parse(safeStorage.getItem('roles_local') || '[]');
        locals = locals.filter(r => r.id !== roleId);
        safeStorage.setItem('roles_local', JSON.stringify(locals));
        return true;
    },

    // --- BAÚ (VAULT) ---
    getVaultPassword: () => {
        return safeStorage.getItem('vault_password_local') || '1234';
    },

    saveVaultPassword: (newPass) => {
        safeStorage.setItem('vault_password_local', newPass);
        return true;
    },

    getVaultLogs: () => {
        return JSON.parse(safeStorage.getItem('vault_logs_local') || '[]');
    },

    saveVaultLog: (log) => {
        const logs = JSON.parse(safeStorage.getItem('vault_logs_local') || '[]');
        const newLog = {
            id: 'vl_' + Date.now(),
            timestamp: new Date().toISOString(),
            ...log
        };
        logs.unshift(newLog); // newest first
        safeStorage.setItem('vault_logs_local', JSON.stringify(logs));
        return true;
    },

    // --- RELATÓRIOS ILEGAIS ---
    getIllegalRecords: () => {
        return JSON.parse(safeStorage.getItem('illegal_records_local') || '[]');
    },

    saveIllegalRecord: (record) => {
        const records = JSON.parse(safeStorage.getItem('illegal_records_local') || '[]');
        const newRec = {
            id: 'ir_' + Date.now(),
            timestamp: new Date().toISOString(),
            ...record
        };
        records.unshift(newRec);
        safeStorage.setItem('illegal_records_local', JSON.stringify(records));
        return true;
    },

    deleteIllegalRecord: (recId) => {
        let records = JSON.parse(safeStorage.getItem('illegal_records_local') || '[]');
        records = records.filter(r => r.id !== recId);
        safeStorage.setItem('illegal_records_local', JSON.stringify(records));
        return true;
    },

    // --- CARROS DETIDOS ---
    getImpoundedCars: () => {
        return JSON.parse(safeStorage.getItem('impounded_cars_local') || '[]');
    },

    saveImpoundedCar: (car) => {
        const cars = JSON.parse(safeStorage.getItem('impounded_cars_local') || '[]');
        const idx = cars.findIndex(c => c.id === car.id);
        if (idx >= 0) cars[idx] = car;
        else cars.push({ id: 'ic_' + Date.now(), ...car });
        safeStorage.setItem('impounded_cars_local', JSON.stringify(cars));
        return true;
    },

    deleteImpoundedCar: (carId) => {
        let cars = JSON.parse(safeStorage.getItem('impounded_cars_local') || '[]');
        cars = cars.filter(c => c.id !== carId);
        safeStorage.setItem('impounded_cars_local', JSON.stringify(cars));
        return true;
    },

    // --- RECEITAS ILEGAIS ---
    getIllegalRecipes: () => {
        return JSON.parse(safeStorage.getItem('illegal_recipes_local') || '[]');
    },

    // --- IMPORT SEED DATA TO SUPABASE ---
    importSeedData: async (localItems, localMaterials) => {
        if (!supabaseInstance) return false;
        try {
            // Bulk insert materials
            for (const mat of localMaterials) {
                await supabaseInstance.from('materials').upsert({
                    id: mat.id,
                    name: mat.name,
                    price: mat.price
                });
            }

            // Bulk insert items
            for (const item of localItems.components) {
                await supabaseInstance.from('items').upsert({
                    id: item.id,
                    category: 'components',
                    name: item.name,
                    stage: item.stage,
                    sell_price: item.sellPrice || 0,
                    ingredients: JSON.stringify(item.ingredients || [])
                });
            }
            for (const item of localItems.services) {
                await supabaseInstance.from('items').upsert({
                    id: item.id,
                    category: 'services',
                    name: item.name,
                    price: item.price || 0,
                    ingredients: JSON.stringify(item.ingredients || [])
                });
            }
            for (const item of localItems.products) {
                await supabaseInstance.from('items').upsert({
                    id: item.id,
                    category: 'products',
                    name: item.name,
                    sell_price: item.sellPrice || 0,
                    ingredients: JSON.stringify(item.ingredients || [])
                });
            }
            return true;
        } catch (e) {
            console.error("Failed to seed Supabase database:", e);
            return false;
        }
    },

    // --- AUTHENTICATION ---
    login: async (email, password) => {
        // Always check local admins first (works with or without Supabase)
        const localAdmins = [
            { email: 'ryan@remotion.com', password: 'lasanha' },
            { email: 'bigas@remotion.com', password: '2928' },
            { email: 'teste@remotion.com', password: 'teste123' }
        ];
        const localMatch = localAdmins.find(u => u.email === email && u.password === password);
        if (localMatch) {
            safeStorage.setItem('admin_logged_in', 'true');
            safeStorage.setItem('admin_email', email);
            return { success: true, email };
        }

        if (supabaseInstance) {
            const { data, error } = await supabaseInstance.auth.signInWithPassword({ email, password });
            if (!error && data.user) {
                safeStorage.setItem('admin_logged_in', 'true');
                safeStorage.setItem('admin_email', data.user.email);
                return { success: true, email: data.user.email };
            }
            return { success: false, error: error.message };
        }

        return { success: false, error: 'Credenciais inválidas.' };
    },

    logout: async () => {
        if (supabaseInstance) {
            await supabaseInstance.auth.signOut();
        }
        safeStorage.removeItem('admin_logged_in');
        safeStorage.removeItem('admin_email');
    },

    isAdminLoggedIn: () => {
        return safeStorage.getItem('admin_logged_in') === 'true';
    },

    getAdminEmail: () => {
        return safeStorage.getItem('admin_email') || '';
    }
};

window.db = db;
