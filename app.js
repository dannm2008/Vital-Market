// =============================================
// FIREBASE - NUEVO PROYECTO
// =============================================
const firebaseConfig = {
    apiKey: "AIzaSyD3zYNpu4BX0IIr0PEQBKe4aYw9LcTDpo0",
    authDomain: "vital-market-nuevo.firebaseapp.com",
    databaseURL: "https://vital-market-nuevo-default-rtdb.firebaseio.com",
    projectId: "vital-market-nuevo",
    storageBucket: "vital-market-nuevo.firebasestorage.app",
    messagingSenderId: "288650029479",
    appId: "1:288650029479:web:47be7a941553d21666ee82"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('🔥 Firebase conectado - NUEVO PROYECTO');
}
const database = firebase.database();

// =============================================
// DEPURACIÓN - AGREGADO PARA DETECTAR ERRORES
// =============================================
console.log('🔍 INICIANDO DEPURACIÓN...');

// Verificar que Firebase está disponible
if (typeof firebase !== 'undefined') {
    console.log('✅ Firebase disponible');
} else {
    console.error('❌ Firebase NO disponible');
}

// Función para verificar el estado
window.verificarEstado = function() {
    console.log('📊 Estado actual:');
    console.log('   - catalogoProductos:', catalogoProductos);
    console.log('   - longitud:', catalogoProductos?.length || 0);
    console.log('   - esPremium:', esPremium);
    
    if (catalogoProductos.length === 0) {
        console.warn('⚠️ catálogo vacío - forzando carga manual');
        cargarProductosManual();
    }
};

// Carga manual de productos (por si Firebase falla)
function cargarProductosManual() {
    console.log('📦 Cargando productos manualmente...');
    catalogoProductos = [
        { id: 'amox', nombre: 'Amoxicilina 500mg', descripcion: '10-15 cápsulas', precio: 15000, imagen: 'pill', stock: 67, vence: '2029-02-15', precioMercado: '7,500 - 12,000', estado: 'Alto', categoria: 'antibiotico' },
        { id: 'lantus', nombre: 'Lantus (Insulina)', descripcion: '3ml - Refrigerar', precio: 85000, imagen: 'vaccines', stock: 89, vence: '2026-03-13', precioMercado: '42,000 - 48,000', estado: 'Muy Alto', categoria: 'insulina' },
        { id: 'ibuprofeno', nombre: 'Ibuprofeno 400mg', descripcion: '10 cápsulas blandas', precio: 12000, imagen: 'medical_services', stock: 45, vence: '2025-12-20', precioMercado: '6,000 - 9,000', estado: 'Alto', categoria: 'analgesico' },
        { id: 'paracetamol', nombre: 'Paracetamol 500mg', descripcion: '20 comprimidos', precio: 8000, imagen: 'pill', stock: 30, vence: '2026-05-15', precioMercado: '4,500 - 6,000', estado: 'Alto', categoria: 'analgesico' },
        { id: 'salbutamol', nombre: 'Salbutamol Spray', descripcion: '200 dosis', precio: 32000, imagen: 'air', stock: 15, vence: '2025-11-30', precioMercado: '18,000 - 25,000', estado: 'Alto', categoria: 'respiratorio' },
        { id: 'metformina', nombre: 'Metformina 850mg', descripcion: '30 tabletas', precio: 9000, imagen: 'pill', stock: 40, vence: '2027-02-10', precioMercado: '8,500 - 11,000', estado: 'Bueno', categoria: 'diabetes' },
        { id: 'omeprazol', nombre: 'Omeprazol 20mg', descripcion: '30 cápsulas', precio: 11000, imagen: 'pill', stock: 25, vence: '2026-08-22', precioMercado: '10,000 - 13,000', estado: 'Bueno', categoria: 'gastrointestinal' },
        { id: 'losartan', nombre: 'Losartán 50mg', descripcion: '30 tabletas', precio: 13000, imagen: 'cardiology', stock: 20, vence: '2026-01-05', precioMercado: '10,000 - 15,000', estado: 'Normal', categoria: 'cardiovascular' },
        { id: 'enalapril', nombre: 'Enalapril 10mg', descripcion: '30 tabletas', precio: 9500, imagen: 'cardiology', stock: 35, vence: '2027-03-18', precioMercado: '8,000 - 12,000', estado: 'Normal', categoria: 'cardiovascular' },
        { id: 'atorvastatina', nombre: 'Atorvastatina 20mg', descripcion: '30 tabletas', precio: 18000, imagen: 'pill', stock: 15, vence: '2025-09-14', precioMercado: '12,000 - 16,000', estado: 'Alto', categoria: 'cardiovascular' }
    ];
    
    renderizarProductos();
    cargarProductosRapidos();
    cargarInventarioCompleto();
    actualizarSemaforos();
    crearGraficaStock();
    console.log('✅ Productos cargados manualmente:', catalogoProductos.length);
}

// Llamar a verificarEstado después de 3 segundos
setTimeout(verificarEstado, 3000);

// =============================================
// VARIABLES GLOBALES
// =============================================
let esPremium = false;
let catalogoProductos = [];
let carrito = [];
let farmacias = [];
let chartInstance = null;

// =============================================
// NAVEGACIÓN
// =============================================
const Navigation = {
    init: function() {
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.sections = document.querySelectorAll('.section');
        
        if (!this.navButtons.length) {
            console.warn('No hay botones');
            return;
        }
        
        this.addEventListeners();
        this.switchToSection('home');
        this.updateButtonStyles(document.getElementById('nav-btn-home'));
    },
    
    addEventListeners: function() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('data-target');
                console.log('➡️ Cambiando a:', targetId);
                this.switchToSection(targetId);
                this.updateButtonStyles(btn);
            });
        });
    },
    
    switchToSection: function(targetId) {
        this.sections.forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('section-active');
        });
        
        const targetSection = document.getElementById(`section-${targetId}`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('section-active');
            console.log('✅ Mostrando:', `section-${targetId}`);
            
            if (targetId === 'panel') {
                cargarInventarioCompleto();
                crearGraficaStock();
            }
            if (targetId === 'mapa') cargarMapa();
        }
    },
    
    updateButtonStyles: function(activeBtn) {
        if (!activeBtn) return;
        this.navButtons.forEach(btn => {
            btn.classList.remove('text-primary');
            btn.classList.add('text-slate-400');
            const p = btn.querySelector('p');
            if (p) p.classList.remove('font-bold');
        });
        activeBtn.classList.remove('text-slate-400');
        activeBtn.classList.add('text-primary');
        const p = activeBtn.querySelector('p');
        if (p) p.classList.add('font-bold');
    }
};

// =============================================
// INVENTARIO
// =============================================
const Inventory = {
    db: database,
    
    init: function() {
        console.log('📦 Inicializando Inventory...');
        this.setupListeners();
        this.setupEventListeners();
    },
    
    setupListeners: function() {
        this.db.ref('inventario').on('value', (snapshot) => {
            const data = snapshot.val() || {};
            console.log('📦 Datos recibidos de Firebase:', data);
            this.updateUI(data);
        }, (error) => {
            console.error('❌ Error de Firebase:', error);
        });
    },
    
    setupEventListeners: function() {
        const resetBtn = document.getElementById('btn-reset-db');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetInventory());
        }
    },
    
    updateUI: function(data) {
        const stockAmox = document.getElementById('stock-amox');
        if (stockAmox) stockAmox.textContent = `${data.amox || 0} unidades`;
        
        const stockLantus = document.getElementById('stock-lantus');
        if (stockLantus) stockLantus.textContent = `${data.lantus || 0} unidades`;
        
        const venceAmox = document.getElementById('vence-amox');
        if (venceAmox) venceAmox.textContent = data.vence_amox || '--';
        
        const venceLantus = document.getElementById('vence-lantus');
        if (venceLantus) venceLantus.textContent = data.vence_lantus || '--';
        
        this.updateStatus('amox', data.vence_amox);
        this.updateStatus('lantus', data.vence_lantus);
        
        const total = (data.amox || 0) + (data.lantus || 0);
        const totalStat = document.getElementById('dashboard-total');
        if (totalStat) totalStat.textContent = total;
        
        let lowCount = 0;
        if ((data.amox || 0) < 10) lowCount++;
        if ((data.lantus || 0) < 5) lowCount++;
        
        const lowStat = document.getElementById('dashboard-low-stock');
        if (lowStat) lowStat.textContent = lowCount.toString().padStart(2, '0');
    },
    
    updateStatus: function(item, expiry) {
        const el = document.getElementById(`status-${item}`);
        if (!el) return;
        
        if (!expiry) {
            el.textContent = 'SIN FECHA';
            el.className = 'px-2 py-1 rounded-lg font-bold text-[10px] uppercase bg-gray-100 text-gray-600';
            return;
        }
        
        const hoy = new Date();
        const vence = new Date(expiry);
        const dias = (vence - hoy) / (1000 * 60 * 60 * 24);
        
        if (dias <= 0) {
            el.textContent = 'VENCIDO';
            el.className = 'px-2 py-1 rounded-lg font-bold text-[10px] uppercase bg-red-100 text-red-600';
        } else if (dias <= 30) {
            el.textContent = 'POR VENCER';
            el.className = 'px-2 py-1 rounded-lg font-bold text-[10px] uppercase bg-yellow-100 text-yellow-600';
        } else {
            el.textContent = 'AL DÍA';
            el.className = 'px-2 py-1 rounded-lg font-bold text-[10px] uppercase bg-green-100 text-green-600';
        }
    },
    
    resetInventory: function() {
        if (!confirm('¿Restablecer inventario a valores por defecto?')) return;
        
        this.db.ref('inventario').set({
            amox: 67,
            vence_amox: '2029-02-15',
            lantus: 89,
            vence_lantus: '2026-03-13'
        }).then(() => {
            alert('✅ Inventario restablecido');
        }).catch(err => {
            alert('❌ Error: ' + err);
        });
    }
};

// =============================================
// CARGAR PRODUCTOS
// =============================================
function cargarProductos() {
    database.ref('productos').once('value')
        .then((snapshot) => {
            const productos = snapshot.val();
            if (productos) {
                catalogoProductos = productos;
                console.log('✅ Productos cargados desde Firebase:', catalogoProductos.length);
            } else {
                console.log('⚠️ No hay productos en Firebase, usando catálogo por defecto');
                catalogoProductos = [
                    { id: 'amox', nombre: 'Amoxicilina 500mg', descripcion: '10-15 cápsulas', precio: 15000, imagen: 'pill', stock: 67, vence: '2029-02-15', precioMercado: '7,500 - 12,000', estado: 'Alto', categoria: 'antibiotico' },
                    { id: 'lantus', nombre: 'Lantus (Insulina)', descripcion: '3ml - Refrigerar', precio: 85000, imagen: 'vaccines', stock: 89, vence: '2026-03-13', precioMercado: '42,000 - 48,000', estado: 'Muy Alto', categoria: 'insulina' },
                    { id: 'ibuprofeno', nombre: 'Ibuprofeno 400mg', descripcion: '10 cápsulas blandas', precio: 12000, imagen: 'medical_services', stock: 45, vence: '2025-12-20', precioMercado: '6,000 - 9,000', estado: 'Alto', categoria: 'analgesico' },
                    { id: 'paracetamol', nombre: 'Paracetamol 500mg', descripcion: '20 comprimidos', precio: 8000, imagen: 'pill', stock: 30, vence: '2026-05-15', precioMercado: '4,500 - 6,000', estado: 'Alto', categoria: 'analgesico' },
                    { id: 'salbutamol', nombre: 'Salbutamol Spray', descripcion: '200 dosis', precio: 32000, imagen: 'air', stock: 15, vence: '2025-11-30', precioMercado: '18,000 - 25,000', estado: 'Alto', categoria: 'respiratorio' },
                    { id: 'metformina', nombre: 'Metformina 850mg', descripcion: '30 tabletas', precio: 9000, imagen: 'pill', stock: 40, vence: '2027-02-10', precioMercado: '8,500 - 11,000', estado: 'Bueno', categoria: 'diabetes' },
                    { id: 'omeprazol', nombre: 'Omeprazol 20mg', descripcion: '30 cápsulas', precio: 11000, imagen: 'pill', stock: 25, vence: '2026-08-22', precioMercado: '10,000 - 13,000', estado: 'Bueno', categoria: 'gastrointestinal' },
                    { id: 'losartan', nombre: 'Losartán 50mg', descripcion: '30 tabletas', precio: 13000, imagen: 'cardiology', stock: 20, vence: '2026-01-05', precioMercado: '10,000 - 15,000', estado: 'Normal', categoria: 'cardiovascular' },
                    { id: 'enalapril', nombre: 'Enalapril 10mg', descripcion: '30 tabletas', precio: 9500, imagen: 'cardiology', stock: 35, vence: '2027-03-18', precioMercado: '8,000 - 12,000', estado: 'Normal', categoria: 'cardiovascular' },
                    { id: 'atorvastatina', nombre: 'Atorvastatina 20mg', descripcion: '30 tabletas', precio: 18000, imagen: 'pill', stock: 15, vence: '2025-09-14', precioMercado: '12,000 - 16,000', estado: 'Alto', categoria: 'cardiovascular' }
                ];
            }
            renderizarProductos();
            cargarProductosRapidos();
            cargarInventarioCompleto();
            actualizarSemaforos();
            crearGraficaStock();
        })
        .catch(error => {
            console.error('❌ Error cargando productos:', error);
            console.log('⚠️ Intentando carga manual por error...');
            cargarProductosManual();
        });
}

// =============================================
// SEMAFORIZACIÓN DE STOCK
// =============================================
function getStockStatus(stock, productoId) {
    const umbrales = {
        'amox': { mucho: 50, medio: 20, poco: 10 },
        'lantus': { mucho: 30, medio: 15, poco: 5 },
        'ibuprofeno': { mucho: 40, medio: 20, poco: 8 },
        'paracetamol': { mucho: 50, medio: 25, poco: 15 },
        'salbutamol': { mucho: 20, medio: 10, poco: 5 },
        'metformina': { mucho: 60, medio: 30, poco: 10 },
        'omeprazol': { mucho: 40, medio: 20, poco: 8 },
        'losartan': { mucho: 40, medio: 20, poco: 10 },
        'enalapril': { mucho: 50, medio: 25, poco: 10 },
        'atorvastatina': { mucho: 30, medio: 15, poco: 8 }
    };
    
    const umbral = umbrales[productoId] || { mucho: 50, medio: 20, poco: 10 };
    
    if (stock >= umbral.mucho) {
        return { texto: 'MUCHO STOCK', color: 'bg-green-100 text-green-700', icono: 'inventory', descripcion: 'Stock óptimo' };
    } else if (stock >= umbral.medio) {
        return { texto: 'STOCK MEDIO', color: 'bg-blue-100 text-blue-700', icono: 'hourglass_empty', descripcion: 'Stock suficiente' };
    } else if (stock >= umbral.poco) {
        return { texto: 'POCAS UNIDADES', color: 'bg-yellow-100 text-yellow-700', icono: 'warning', descripcion: 'Pedir pronto' };
    } else {
        return { texto: 'CRÍTICO', color: 'bg-red-100 text-red-700 animate-pulse', icono: 'error', descripcion: '¡URGENTE!' };
    }
}

function actualizarSemaforos() {
    catalogoProductos.forEach(producto => {
        const status = getStockStatus(producto.stock, producto.id);
        const stockElement = document.getElementById(`stock-${producto.id}`);
        if (stockElement) {
            let badge = document.getElementById(`semaforo-${producto.id}`);
            if (!badge) {
                badge = document.createElement('span');
                badge.id = `semaforo-${producto.id}`;
                badge.className = 'ml-2 px-2 py-1 rounded-lg text-[10px] font-bold uppercase inline-flex items-center gap-1';
                stockElement.parentElement.appendChild(badge);
            }
            badge.innerHTML = `<span class="material-symbols-outlined text-base">${status.icono}</span> ${status.texto}`;
            badge.className = `ml-2 px-2 py-1 rounded-lg text-[10px] font-bold uppercase inline-flex items-center gap-1 ${status.color}`;
        }
    });
}

// =============================================
// GRÁFICA DE STOCK
// =============================================
function crearGraficaStock() {
    const ctx = document.getElementById('grafica-stock')?.getContext('2d');
    if (!ctx || catalogoProductos.length === 0) return;
    
    if (chartInstance) chartInstance.destroy();
    
    const categorias = {
        mucho: catalogoProductos.filter(p => getStockStatus(p.stock, p.id).texto === 'MUCHO STOCK').length,
        medio: catalogoProductos.filter(p => getStockStatus(p.stock, p.id).texto === 'STOCK MEDIO').length,
        poco: catalogoProductos.filter(p => getStockStatus(p.stock, p.id).texto === 'POCAS UNIDADES').length,
        critico: catalogoProductos.filter(p => getStockStatus(p.stock, p.id).texto === 'CRÍTICO').length
    };
    
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Mucho Stock', 'Stock Medio', 'Pocas Unidades', 'Crítico'],
            datasets: [{
                data: [categorias.mucho, categorias.medio, categorias.poco, categorias.critico],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// =============================================
// GENERAR PDF
// =============================================
window.generarPDF = function() {
    const totalProductos = catalogoProductos.reduce((sum, p) => sum + p.stock, 0);
    const bajas = catalogoProductos.filter(p => p.stock < 10).length;
    const valorTotal = catalogoProductos.reduce((sum, p) => sum + (p.stock * p.precio), 0);
    
    let contenido = `
        <html>
        <head>
            <title>Inventario Vital Market</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #003366; text-align: center; }
                h2 { color: #FFD700; margin-top: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background-color: #003366; color: white; padding: 8px; text-align: left; }
                td { padding: 8px; border-bottom: 1px solid #ddd; }
                .bajo { background-color: #ffebee; color: #c62828; }
                .total { font-weight: bold; background-color: #f5f5f5; }
                .fecha { text-align: right; color: #666; margin-top: 20px; }
            </style>
        </head>
        <body>
            <h1>VITAL MARKET - INFORME DE INVENTARIO</h1>
            <p class="fecha">Fecha: ${new Date().toLocaleDateString()}</p>
            
            <h2>RESUMEN</h2>
            <table>
                <tr><th>Total Productos</th><th>Bajas Existencias</th><th>Valor Total</th></tr>
                <tr>
                    <td>${totalProductos} unidades</td>
                    <td>${bajas} productos</td>
                    <td>$${valorTotal.toLocaleString()}</td>
                </tr>
            </table>
            
            <h2>DETALLE DE PRODUCTOS</h2>
            <table>
                <tr><th>Producto</th><th>Stock</th><th>Vencimiento</th><th>Estado</th><th>Precio</th><th>Valor Total</th></tr>
                ${catalogoProductos.map(p => `
                    <tr ${p.stock < 10 ? 'class="bajo"' : ''}>
                        <td>${p.nombre}</td>
                        <td>${p.stock}</td>
                        <td>${p.vence}</td>
                        <td>${getStatusText(p.vence)}</td>
                        <td>$${p.precio.toLocaleString()}</td>
                        <td>$${(p.stock * p.precio).toLocaleString()}</td>
                    </tr>
                `).join('')}
                <tr class="total">
                    <td colspan="5" style="text-align: right;"><strong>TOTAL:</strong></td>
                    <td><strong>$${valorTotal.toLocaleString()}</strong></td>
                </tr>
            </table>
        </body>
        </html>
    `;
    
    const ventana = window.open('', '_blank');
    ventana.document.write(contenido);
    ventana.document.close();
    ventana.focus();
    ventana.print();
};

// =============================================
// GENERAR QR
// =============================================
window.generarQR = function() {
    const modal = document.getElementById('modal-qr');
    const qrDiv = document.getElementById('qr-code');
    qrDiv.innerHTML = '';
    
    const datosInventario = catalogoProductos.map(p => 
        `${p.nombre}: ${p.stock} uni, Vence: ${p.vence}`
    ).join(' | ');
    
    QRCode.toCanvas(datosInventario, { width: 200 }, (error, canvas) => {
        if (error) console.error(error);
        qrDiv.appendChild(canvas);
    });
    
    modal.classList.remove('hidden');
};

// =============================================
// EXPORTAR EXCEL
// =============================================
window.exportarExcel = function() {
    let csv = "Producto,Stock,Vencimiento,Precio,Estado\n";
    catalogoProductos.forEach(p => {
        csv += `"${p.nombre}",${p.stock},"${p.vence}",$${p.precio},"${getStatusText(p.vence)}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventario_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
};

// =============================================
// RENDERIZAR PRODUCTOS (tu código existente)
// =============================================
function renderizarProductos() {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    catalogoProductos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl shadow-sm border border-slate-200 p-4 relative overflow-hidden';
        card.setAttribute('data-nombre', producto.nombre.toLowerCase());
        card.setAttribute('data-categoria', producto.categoria || '');
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div class="flex gap-3">
                    <div class="bg-primary/10 p-2 rounded-lg">
                        <span class="material-symbols-outlined text-primary text-3xl">${producto.imagen}</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800 text-lg">${producto.nombre}</h3>
                        <p class="text-sm text-slate-500">${producto.descripcion}</p>
                        <p class="text-sm font-bold text-primary mt-1">$${producto.precio.toLocaleString()}</p>
                        <p class="text-xs text-slate-400">Vence: ${producto.vence} | Stock: ${producto.stock}</p>
                    </div>
                </div>
            </div>
            <div class="flex gap-2 mt-2 pt-3 border-t border-slate-100">
                <button onclick="verDetalles('${producto.id}')" class="flex-1 bg-slate-50 text-primary font-bold py-2 rounded-xl text-sm border border-slate-200">Ver Detalles</button>
                <button onclick="mostrarSelectorCantidad('${producto.id}')" class="flex-1 bg-primary text-white font-bold py-2 rounded-xl text-sm shadow-md">Añadir</button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando...');
    Navigation.init();
    Inventory.init();
    cargarProductos();
    
    // Event listeners
    document.getElementById('view-all-cabinet')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('nav-btn-botiquin').click();
    });
    
    document.getElementById('btn-toggle-premium')?.addEventListener('click', () => {
        esPremium = !esPremium;
        cargarProductosRapidos();
        alert(`Cambiaste a: ${esPremium ? 'PREMIUM' : 'BÁSICO'}`);
    });
    
    document.getElementById('upgrade-premium-btn')?.addEventListener('click', () => {
        esPremium = true;
        cargarProductosRapidos();
        alert('✅ ¡Ahora eres PREMIUM!');
    });
    
    document.getElementById('ver-carrito-btn')?.addEventListener('click', mostrarCarrito);
    document.getElementById('cerrar-carrito')?.addEventListener('click', () => {
        document.getElementById('modal-carrito').classList.add('hidden');
    });
    document.getElementById('cerrar-pedido')?.addEventListener('click', () => {
        document.getElementById('modal-pedido').classList.add('hidden');
    });
    document.getElementById('checkout-btn')?.addEventListener('click', confirmarPedido);
    document.getElementById('btn-pdf')?.addEventListener('click', generarPDF);
    document.getElementById('btn-qr')?.addEventListener('click', generarQR);
    document.getElementById('cerrar-qr')?.addEventListener('click', () => {
        document.getElementById('modal-qr').classList.add('hidden');
    });
    document.getElementById('btn-exportar-excel')?.addEventListener('click', exportarExcel);
    
    document.getElementById('buscar-productos')?.addEventListener('input', (e) => {
        const busqueda = e.target.value.toLowerCase();
        const productos = document.querySelectorAll('#lista-productos > div');
        let contador = 0;
        
        productos.forEach(producto => {
            const nombre = producto.getAttribute('data-nombre') || '';
            if (nombre.includes(busqueda) || busqueda === '') {
                producto.style.display = 'block';
                contador++;
            } else {
                producto.style.display = 'none';
            }
        });
        
        const resultadosSpan = document.getElementById('resultados-busqueda');
        if (resultadosSpan) {
            if (busqueda !== '') {
                resultadosSpan.textContent = contador;
                resultadosSpan.classList.remove('hidden');
            } else {
                resultadosSpan.classList.add('hidden');
            }
        }
    });
    
    // Filtros por categoría
    document.querySelectorAll('.filtro-categoria').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const categoria = e.target.dataset.categoria;
            const productos = document.querySelectorAll('#lista-productos > div');
            
            productos.forEach(producto => {
                const prodCategoria = producto.getAttribute('data-categoria') || '';
                if (categoria === 'todos' || prodCategoria === categoria) {
                    producto.style.display = 'block';
                } else {
                    producto.style.display = 'none';
                }
            });
        });
    });
    
    console.log('✅ Listo');
});

// Funciones auxiliares existentes (cargarInventarioCompleto, getStatusClass, etc.)
function cargarInventarioCompleto() {
    const contenedor = document.getElementById('inventario-completo');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    catalogoProductos.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'bg-white p-4 rounded-xl border border-slate-200 shadow-sm';
        item.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h4 class="font-bold text-slate-800">${producto.nombre}</h4>
                    <span id="status-${producto.id}" class="inline-block mt-1 px-2 py-1 rounded-lg font-bold text-[10px] uppercase ${getStatusClass(producto.vence)}">${getStatusText(producto.vence)}</span>
                </div>
            </div>
            <div class="flex items-center justify-between mb-3 bg-slate-50 p-3 rounded-lg">
                <div>
                    <p class="text-xs text-slate-500">Stock actual</p>
                    <p id="stock-${producto.id}" class="text-2xl font-bold text-primary">${producto.stock} unidades</p>
                </div>
                <button onclick="updateProductStock('${producto.id}')" class="bg-primary text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-base">edit</span> Editar
                </button>
            </div>
            <div class="bg-slate-50 p-3 rounded-lg mb-2">
                <p class="text-xs text-slate-500 mb-2">Fecha de vencimiento:</p>
                <div class="flex flex-col sm:flex-row gap-2">
                    <input type="date" id="calendario-${producto.id}" class="w-full border border-slate-300 rounded-lg p-2 text-sm" value="${producto.vence}" min="2025-01-01" max="2035-12-31">
                    <button onclick="actualizarFechaProducto('${producto.id}')" class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap">Actualizar Fecha</button>
                </div>
            </div>
            <div class="flex items-center justify-end text-xs text-slate-400">
                <span>Vence: <b>${producto.vence}</b></span>
            </div>
        `;
        contenedor.appendChild(item);
    });
    
    actualizarSemaforos();
}

function getStatusClass(vence) {
    const dias = calcularDiasVencimiento(vence);
    if (dias <= 0) return 'bg-red-100 text-red-600';
    if (dias <= 30) return 'bg-yellow-100 text-yellow-600';
    return 'bg-green-100 text-green-600';
}

function getStatusText(vence) {
    const dias = calcularDiasVencimiento(vence);
    if (dias <= 0) return 'VENCIDO';
    if (dias <= 30) return 'POR VENCER';
    return 'AL DÍA';
}

function calcularDiasVencimiento(vence) {
    const hoy = new Date();
    const fechaVence = new Date(vence);
    return (fechaVence - hoy) / (1000 * 60 * 60 * 24);
}

function cargarProductosRapidos() {
    const container = document.getElementById('quick-products');
    if (!container) return;
    
    const productosRapidos = catalogoProductos.slice(0, esPremium ? 4 : 2);
    
    container.innerHTML = productosRapidos.map(p => `
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-start mb-2">
                <span class="material-symbols-outlined text-primary text-3xl">${p.imagen}</span>
                <span class="text-xs font-bold ${p.stock < 10 ? 'text-red-500 bg-red-100' : 'text-green-500 bg-green-100'} px-2 py-0.5 rounded">
                    ${p.stock < 10 ? 'Bajo' : 'OK'}
                </span>
            </div>
            <p class="font-bold text-slate-800">${p.nombre}</p>
            <p class="text-xs text-slate-500">${p.stock} unidades</p>
            ${esPremium ? `
                <button onclick="mostrarSelectorCantidad('${p.id}')" class="mt-2 text-xs text-primary font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">add_shopping_cart</span> Añadir rápido
                </button>
            ` : ''}
        </div>
    `).join('');
    
    document.getElementById('premium-benefits').classList.toggle('hidden', !esPremium);
    document.getElementById('basic-benefits').classList.toggle('hidden', esPremium);
    
    const badge = document.getElementById('header-premium-badge');
    if (badge) {
        badge.textContent = esPremium ? 'MIEMBRO PREMIUM' : 'PLAN BÁSICO';
        badge.className = esPremium 
            ? 'bg-accent text-primary text-[10px] font-black px-2 py-0.5 rounded-full'
            : 'bg-slate-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full';
    }
}

function cargarMapa() {
    farmacias = [
        { nombre: 'Farmacia San Jorge', lat: 4.6097, lng: -74.0817, fullCombo: true, distancia: '350m', abierto: true, direccion: 'Calle 54 Sur #78-12' },
        { nombre: 'Droguería Bosa', lat: 4.6097, lng: -74.0817, fullCombo: false, distancia: '500m', abierto: true, direccion: 'Carrera 80 #55-20' },
        { nombre: 'Farmacia Brasilia', lat: 4.6097, lng: -74.0817, fullCombo: true, distancia: '800m', abierto: false, direccion: 'Diagonal 49B #79-45' },
        { nombre: 'Drogas La 55', lat: 4.6097, lng: -74.0817, fullCombo: false, distancia: '1.2km', abierto: true, direccion: 'Calle 55 #78-90' },
        { nombre: 'Farmacenter', lat: 4.6097, lng: -74.0817, fullCombo: true, distancia: '1.5km', abierto: true, direccion: 'Av. Ciudad de Cali #54-30' }
    ];
}

window.verDetalles = (productoId) => {
    const producto = catalogoProductos.find(p => p.id === productoId);
    if (!producto) return;
    
    alert(`
        🏥 ${producto.nombre}
        📋 ${producto.descripcion}
        💰 Precio: $${producto.precio.toLocaleString()}
        📦 Stock: ${producto.stock} unidades
        📅 Vence: ${producto.vence}
        📊 Mercado: $${producto.precioMercado}
        ${producto.estado === 'Bueno' ? '✅ Precio competitivo' : producto.estado === 'Normal' ? '⚖️ Precio promedio' : '⚠️ Precio superior'}
    `);
};

window.mostrarSelectorCantidad = (productoId) => {
    const producto = catalogoProductos.find(p => p.id === productoId);
    if (!producto) return;
    
    const cantidad = prompt(`¿Cuántas unidades de ${producto.nombre} deseas añadir?`, '1');
    if (!cantidad) return;
    
    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
        alert('❌ Ingresa una cantidad válida');
        return;
    }
    
    if (cantidadNum > producto.stock) {
        alert(`❌ Solo hay ${producto.stock} unidades disponibles`);
        return;
    }
    
    añadirAlCarrito(productoId, cantidadNum);
};

function añadirAlCarrito(productoId, cantidad) {
    const producto = catalogoProductos.find(p => p.id === productoId);
    if (!producto) return;
    
    const precioFinal = esPremium ? Math.round(producto.precio * 0.95) : producto.precio;
    
    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            ...producto,
            cantidad: cantidad,
            precioAplicado: precioFinal
        });
    }
    
    actualizarContadorCarrito();
    alert(`✅ ${cantidad} unidad(es) de ${producto.nombre} añadidas al carrito`);
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('carrito-contador');
    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems;
        contador.style.display = totalItems === 0 ? 'none' : 'flex';
    }
}

function mostrarCarrito() {
    const modal = document.getElementById('modal-carrito');
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoItems = document.getElementById('carrito-items');
    const totalContainer = document.getElementById('carrito-total-container');
    
    if (!modal) return;
    
    if (carrito.length === 0) {
        carritoVacio.classList.remove('hidden');
        carritoItems.classList.add('hidden');
        totalContainer.classList.add('hidden');
    } else {
        carritoVacio.classList.add('hidden');
        carritoItems.classList.remove('hidden');
        totalContainer.classList.remove('hidden');
        
        carritoItems.innerHTML = carrito.map(item => `
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary">${item.imagen}</span>
                    <div>
                        <p class="font-bold">${item.nombre}</p>
                        <p class="text-sm text-slate-500">$${(item.precioAplicado || item.precio).toLocaleString()} x ${item.cantidad}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="eliminarDelCarrito('${item.id}')" class="text-red-500">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `).join('');
        
        const total = carrito.reduce((sum, item) => sum + ((item.precioAplicado || item.precio) * item.cantidad), 0);
        document.getElementById('carrito-total').textContent = `$${total.toLocaleString()}`;
    }
    
    modal.classList.remove('hidden');
}

window.eliminarDelCarrito = (productoId) => {
    carrito = carrito.filter(item => item.id !== productoId);
    actualizarContadorCarrito();
    mostrarCarrito();
};

window.confirmarPedido = () => {
    if (carrito.length === 0) {
        alert('❌ Tu carrito está vacío');
        return;
    }
    
    const modalCarrito = document.getElementById('modal-carrito');
    const modalPedido = document.getElementById('modal-pedido');
    const pedidoResumen = document.getElementById('pedido-resumen');
    
    const resumen = carrito.map(item => 
        `${item.nombre}: ${item.cantidad} x $${(item.precioAplicado || item.precio).toLocaleString()} = $${((item.precioAplicado || item.precio) * item.cantidad).toLocaleString()}`
    ).join('<br>');
    
    const total = carrito.reduce((sum, item) => sum + ((item.precioAplicado || item.precio) * item.cantidad), 0);
    
    pedidoResumen.innerHTML = `
        <p class="font-bold mb-2">Tu pedido:</p>
        ${resumen}
        <p class="font-bold mt-4 text-primary">Total: $${total.toLocaleString()}</p>
    `;
    
    database.ref('pedidos').push({
        items: carrito,
        total: total,
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        premium: esPremium
    });
    
    modalCarrito.classList.add('hidden');
    modalPedido.classList.remove('hidden');
    
    carrito = [];
    actualizarContadorCarrito();
};

window.updateProductStock = (productoId) => {
    const producto = catalogoProductos.find(p => p.id === productoId);
    if (!producto) return;
    
    const stock = prompt(`Stock de ${producto.nombre}:`, producto.stock);
    if (!stock || isNaN(stock)) return;
    
    producto.stock = parseInt(stock);
    document.getElementById(`stock-${productoId}`).textContent = `${producto.stock} unidades`;
    actualizarSemaforos();
    crearGraficaStock();
    
    database.ref(`productos/${productoId}/stock`).set(parseInt(stock))
        .then(() => alert(`✅ Stock de ${producto.nombre} actualizado`))
        .catch(err => alert('❌ Error: ' + err));
};

window.actualizarFechaProducto = (productoId) => {
    const producto = catalogoProductos.find(p => p.id === productoId);
    if (!producto) return;
    
    const calendario = document.getElementById(`calendario-${productoId}`);
    const nuevaFecha = calendario.value;
    if (!nuevaFecha) return;
    
    producto.vence = nuevaFecha;
    document.getElementById(`status-${productoId}`).className = `inline-block mt-1 px-2 py-1 rounded-lg font-bold text-[10px] uppercase ${getStatusClass(nuevaFecha)}`;
    document.getElementById(`status-${productoId}`).textContent = getStatusText(nuevaFecha);
    
    database.ref(`productos/${productoId}/vence`).set(nuevaFecha)
        .then(() => alert(`✅ Fecha de ${producto.nombre} actualizada`))
        .catch(err => alert('❌ Error: ' + err));
};

window.testFirebase = function() {
    database.ref('inventario').once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            alert(`📦 INVENTARIO:\nAmox: ${data.amox}\nLantus: ${data.lantus}`);
        });
};

window.updateStock = (med) => {
    const nombre = med === 'amox' ? 'Amoxicilina' : 'Lantus';
    const stock = prompt(`Stock de ${nombre}:`);
    if (!stock || isNaN(stock)) return;
    
    const updates = {};
    updates[`inventario/${med}`] = parseInt(stock);
    
    database.ref().update(updates)
        .then(() => alert(`✅ Stock de ${nombre} actualizado a ${stock}`))
        .catch(err => alert('❌ Error: ' + err));
};

window.actualizarFecha = (med) => {
    const nombre = med === 'amox' ? 'Amoxicilina' : 'Lantus';
    const calendario = document.getElementById(`calendario-${med}`);
    if (!calendario) return;
    
    const nuevaFecha = calendario.value;
    if (!nuevaFecha) return;
    
    const updates = {};
    updates[`inventario/vence_${med}`] = nuevaFecha;
    
    database.ref().update(updates)
        .then(() => alert(`✅ Fecha de ${nombre} actualizada a ${nuevaFecha}`))
        .catch(err => alert('❌ Error: ' + err));
};
// =============================================
// BOTONES ADICIONALES - Agrega esto al FINAL de tu app.js
// =============================================

// Botón COMPRAR AHORA en Home
document.getElementById('comprar-ahora-btn')?.addEventListener('click', () => {
    // Redirigir a la sección de Amoxicilina en el botiquín
    document.getElementById('nav-btn-botiquin').click();
    setTimeout(() => {
        const busqueda = document.getElementById('buscar-productos');
        if (busqueda) {
            busqueda.value = 'Amoxicilina';
            busqueda.dispatchEvent(new Event('input'));
        }
    }, 500);
});

// Reportar inconsistencias - conectar a Firebase
document.getElementById('btn-reportar-inconsistencia')?.addEventListener('click', () => {
    const farmacia = document.querySelector('#farmacia-seleccionada h2')?.textContent || 'Farmacia San Jorge';
    
    database.ref('reportes').push({
        farmacia: farmacia,
        fecha: new Date().toISOString(),
        usuario: 'anónimo',
        estado: 'pendiente'
    }).then(() => {
        alert('✅ Reporte enviado. Gracias por mejorar la comunidad.');
    }).catch(err => {
        console.error('Error al reportar:', err);
        alert('❌ Error al enviar reporte');
    });
});

// Filtros del mapa funcionales
document.getElementById('filtro-fullcombo')?.addEventListener('click', () => {
    const farmaciasFullCombo = farmacias.filter(f => f.fullCombo);
    mostrarListaFarmacias(farmaciasFullCombo);
});

document.getElementById('filtro-cercanos')?.addEventListener('click', () => {
    // Ordenar por distancia (simulado)
    const farmaciasOrdenadas = [...farmacias].sort((a, b) => 
        parseInt(a.distancia) - parseInt(b.distancia)
    );
    mostrarListaFarmacias(farmaciasOrdenadas);
});

function mostrarListaFarmacias(lista) {
    const contenedor = document.getElementById('farmacias-lista');
    const seleccionada = document.getElementById('farmacia-seleccionada');
    
    if (!contenedor || !seleccionada) return;
    
    contenedor.innerHTML = lista.map(f => `
        <div class="p-2 hover:bg-slate-100 cursor-pointer rounded" onclick="seleccionarFarmacia('${f.nombre}')">
            <div class="flex justify-between">
                <span class="font-bold">${f.nombre}</span>
                <span class="text-xs ${f.fullCombo ? 'bg-accent text-primary' : 'bg-slate-200'} px-2 py-0.5 rounded">
                    ${f.fullCombo ? 'FULL COMBO' : 'Stock básico'}
                </span>
            </div>
            <p class="text-xs text-slate-500">${f.distancia} - ${f.direccion}</p>
        </div>
    `).join('');
    
    contenedor.classList.remove('hidden');
    
    // Actualizar seleccionada
    seleccionada.querySelector('h2').textContent = lista[0]?.nombre || 'Farmacias';
    seleccionada.querySelector('p').textContent = `${lista[0]?.distancia || '0m'} - ${lista[0]?.abierto ? 'Abierto' : 'Cerrado'}`;
}

window.seleccionarFarmacia = (nombre) => {
    const farmacia = farmacias.find(f => f.nombre === nombre);
    if (!farmacia) return;
    
    const seleccionada = document.getElementById('farmacia-seleccionada');
    seleccionada.querySelector('h2').textContent = farmacia.nombre;
    seleccionada.querySelector('p').textContent = `${farmacia.distancia} - ${farmacia.abierto ? 'Abierto' : 'Cerrado'}`;
    
    document.getElementById('farmacias-lista').classList.add('hidden');
};
