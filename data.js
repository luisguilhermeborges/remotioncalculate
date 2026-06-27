const materials = [
    {
        id: "refined_plastic",
        name: "Plástico Refinado",
        image: "assets/images/refined-plastic.png",
        price: 10
    },
    {
        id: "refined_scrap",
        name: "Sucata Refinada",
        image: "assets/images/refined-scrap.png",
        price: 10
    },
    {
        id: "refined_rubber",
        name: "Borracha Refinada",
        image: "assets/images/refined-rubber.png",
        price: 10
    },
    {
        id: "refined_glass",
        name: "Vidro Refinado",
        image: "assets/images/refined-glass.png",
        price: 10
    },
    {
        id: "refined_copper",
        name: "Cobre Refinado",
        image: "assets/images/refined-copper.png",
        price: 10
    },
    {
        id: "refined_aluminum",
        name: "Alumínio Refinado",
        image: "assets/images/refined-aluminum.png",
        price: 10
    },
    {
        id: "electronic_waste",
        name: "Lixo Eletrônico",
        image: "assets/images/electronic-waste.png",
        price: 5
    },
    {
        id: "electronic_component",
        name: "Comp. Eletrônico",
        image: "assets/images/electronic-component.png",
        price: 10
    },
    {
        id: "plastic",
        name: "Plástico",
        image: "assets/images/plastic.png",
        price: 5
    },
    {
        id: "scrap",
        name: "Sucata",
        image: "assets/images/scrap.png",
        price: 5
    },
    {
        id: "rubber",
        name: "Borracha",
        image: "assets/images/rubber.png",
        price: 5
    },
    {
        id: "glass",
        name: "Vidro",
        image: "assets/images/glass.png",
        price: 5
    },
    {
        id: "copper",
        name: "Cobre",
        image: "assets/images/copper.png",
        price: 5
    },
    {
        id: "aluminum",
        name: "Alumínio",
        image: "assets/images/aluminum.png",
        price: 5
    }
];

const components = [
    {
        id: "ecu",
        name: "ECU",
        image: "assets/images/ecu_stage1.png",
        stage: 1,
        sellPrice: 9000,
        ingredients: [
            { id: "refined_copper", quantity: 100 },
            { id: "refined_plastic", quantity: 100 },
            { id: "refined_scrap", quantity: 100 },
            { id: "refined_aluminum", quantity: 100 }
        ]
    },
    {
        id: "brake_kit",
        name: "Kit de Freio",
        image: "assets/images/brake_kit.png",
        stage: 2,
        sellPrice: 16500,
        ingredients: [
            { id: "refined_plastic", quantity: 240 },
            { id: "refined_scrap", quantity: 240 },
            { id: "refined_rubber", quantity: 240 },
            { id: "refined_copper", quantity: 240 },
            { id: "refined_aluminum", quantity: 240 }
        ]
    },
    {
        id: "sport_exhaust",
        name: "Escape Esportivo",
        image: "assets/images/sport_exhaust.png",
        stage: 2,
        sellPrice: 18000,
        ingredients: [
            { id: "refined_scrap", quantity: 500 },
            { id: "refined_copper", quantity: 500 },
            { id: "refined_aluminum", quantity: 500 }
        ]
    },
    {
        id: "air_filter",
        name: "Filtro de Ar",
        image: "assets/images/sport_air_filter.png",
        stage: 2,
        sellPrice: 11280,
        ingredients: [
            { id: "refined_plastic", quantity: 200 },
            { id: "refined_rubber", quantity: 200 },
            { id: "refined_scrap", quantity: 200 },
            { id: "refined_copper", quantity: 200 }
        ]
    },
    {
        id: "racing_clutch",
        name: "Racing Clutch",
        image: "assets/images/racing_clutch.png",
        stage: 3,
        sellPrice: 11280,
        ingredients: [
            { id: "refined_plastic", quantity: 200 },
            { id: "refined_rubber", quantity: 200 },
            { id: "refined_scrap", quantity: 200 },
            { id: "refined_copper", quantity: 200 }
        ]
    },
    {
        id: "intercooler",
        name: "Intercooler",
        image: "assets/images/intercooler.png",
        stage: 3,
        sellPrice: 11280,
        ingredients: [
            { id: "refined_plastic", quantity: 200 },
            { id: "refined_rubber", quantity: 200 },
            { id: "refined_scrap", quantity: 200 },
            { id: "refined_copper", quantity: 200 }
        ]
    },
    {
        id: "suspension",
        name: "Suspensão",
        image: "assets/images/suspension_5.png",
        stage: 3,
        sellPrice: 11280,
        ingredients: [
            { id: "refined_plastic", quantity: 200 },
            { id: "refined_rubber", quantity: 200 },
            { id: "refined_scrap", quantity: 200 },
            { id: "refined_copper", quantity: 200 }
        ]
    },
    {
        id: "intake_manifold",
        name: "Coletor de Admissão",
        image: "assets/images/intake_manifold.png",
        stage: 3,
        sellPrice: 11280,
        ingredients: [
            { id: "refined_plastic", quantity: 200 },
            { id: "refined_rubber", quantity: 200 },
            { id: "refined_scrap", quantity: 200 },
            { id: "refined_copper", quantity: 200 }
        ]
    },
    {
        id: "fuel_system",
        name: "Sistema de Combustível",
        image: "assets/images/fuel_system_upgrade.png",
        stage: 3,
        sellPrice: 11280,
        ingredients: [
            { id: "refined_plastic", quantity: 200 },
            { id: "refined_rubber", quantity: 200 },
            { id: "refined_scrap", quantity: 200 },
            { id: "refined_copper", quantity: 200 }
        ]
    },
    {
        id: "big_turbo",
        name: "Turbo",
        image: "assets/images/big_turbo.png",
        stage: 3,
        sellPrice: 22560,
        ingredients: [
            { id: "refined_plastic", quantity: 400 },
            { id: "refined_rubber", quantity: 400 },
            { id: "refined_scrap", quantity: 400 },
            { id: "refined_copper", quantity: 400 }
        ]
    }
];

const services = [
    {
        id: "refil_nitro",
        name: "Refil de Nitro",
        price: 625,
        ingredients: []
    },
    {
        id: "repair_ecu",
        name: "Reparo ECU",
        price: 900,
        ingredients: [
            { id: "refined_copper", quantity: 10 },
            { id: "refined_plastic", quantity: 6 },
            { id: "refined_scrap", quantity: 5 }
        ]
    },
    {
        id: "repair_filter",
        name: "Reparo Filtro de Ar",
        price: 900,
        ingredients: [
            { id: "refined_rubber", quantity: 10 },
            { id: "refined_plastic", quantity: 10 },
            { id: "refined_aluminum", quantity: 9 }
        ]
    },
    {
        id: "repair_intercooler",
        name: "Reparo Intercooler",
        price: 900,
        ingredients: [
            { id: "refined_aluminum", quantity: 15 },
            { id: "refined_copper", quantity: 14 },
            { id: "refined_scrap", quantity: 13 }
        ]
    },
    {
        id: "repair_coletor",
        name: "Reparo Coletor de Admissão",
        price: 900,
        ingredients: [
            { id: "refined_aluminum", quantity: 15 },
            { id: "refined_copper", quantity: 14 },
            { id: "refined_scrap", quantity: 13 }
        ]
    },
    {
        id: "repair_bomba_combustivel",
        name: "Reparo Sistema de Combustível",
        price: 900,
        ingredients: [
            { id: "refined_aluminum", quantity: 15 },
            { id: "refined_copper", quantity: 14 },
            { id: "refined_scrap", quantity: 13 }
        ]
    },
    {
        id: "repair_turbo",
        name: "Reparo Turbo",
        price: 900,
        ingredients: [
            { id: "refined_scrap", quantity: 15 },
            { id: "refined_aluminum", quantity: 14 }
        ]
    },
    {
        id: "repair_exaustor",
        name: "Reparo Escape Esportivo",
        price: 900,
        ingredients: [
            { id: "refined_scrap", quantity: 15 },
            { id: "refined_aluminum", quantity: 14 }
        ]
    },
    {
        id: "repair_clutch",
        name: "Reparo Racing Clutch",
        price: 900,
        ingredients: [
            { id: "refined_scrap", quantity: 14 },
            { id: "refined_aluminum", quantity: 14 },
            { id: "refined_rubber", quantity: 14 }
        ]
    },
    {
        id: "repair_brake",
        name: "Reparo Kit Freio",
        price: 900,
        ingredients: [
            { id: "refined_rubber", quantity: 8 },
            { id: "refined_scrap", quantity: 9 }
        ]
    },
    {
        id: "repair_suspension",
        name: "Reparo Suspensão 5",
        price: 900,
        ingredients: [
            { id: "refined_rubber", quantity: 8 },
            { id: "refined_scrap", quantity: 9 }
        ]
    },
    {
        id: "repair_lataria",
        name: "Lataria",
        price: 240,
        ingredients: [
            { id: "refined_aluminum", quantity: 6 },
            { id: "refined_scrap", quantity: 7 }
        ]
    },
    {
        id: "repair_engine",
        name: "Motor",
        price: 840,
        ingredients: [
            { id: "refined_aluminum", quantity: 7 },
            { id: "refined_copper", quantity: 10 },
            { id: "refined_scrap", quantity: 20 }
        ]
    },
    {
        id: "repair_generic_parts",
        name: "Reparo de Peças",
        price: 900,
        ingredients: []
    },
    {
        id: "pneu",
        name: "Pneu (cada)",
        price: 150,
        ingredients: []
    },
    {
        id: "guincho_ls",
        name: "Guincho Los Santos",
        price: 600,
        ingredients: []
    },
    {
        id: "guincho_sandy",
        name: "Guincho Sandy/Grape",
        price: 1200,
        ingredients: []
    },
    {
        id: "guincho_paleto",
        name: "Guincho Paleto",
        price: 1800,
        ingredients: []
    }
];

const products = [
    {
        id: "lockpick",
        name: "Lockpick",
        image: "assets/images/lockpick.png",
        sellPrice: 300,
        ingredients: [
            { id: "refined_aluminum", quantity: 15 },
            { id: "refined_scrap", quantity: 10 }
        ]
    },
    {
        id: "advanced_lockpick",
        name: "Lockpick Avançada",
        image: "assets/images/lockpick_advanced.png",
        sellPrice: 600,
        ingredients: [
            { id: "refined_aluminum", quantity: 30 },
            { id: "refined_scrap", quantity: 20 }
        ]
    },
    {
        id: "engine_repair_kit",
        name: "Kit Reparo",
        image: "assets/images/engine_repair_kit.png",
        sellPrice: 3000,
        ingredients: []
    },
    {
        id: "garrafa_nitro_pequena",
        name: "Garrafa Nitro Pequena",
        image: "assets/images/garrafa_nitro_pequena.png",
        sellPrice: 5625,
        ingredients: []
    },
    {
        id: "garrafa_nitro_grande",
        name: "Garrafa de Nitro Grande",
        image: "assets/images/garrafa_nitro_grande.png",
        sellPrice: 20000,
        ingredients: []
    },
    {
        id: "racing_seatbelt",
        name: "Cinto de Segurança de Corrida",
        image: "assets/images/racing_seatbelt.png",
        sellPrice: 2000,
        ingredients: []
    }
];

const partners = [
    { name: "Funcionário", discount: 15 }
];