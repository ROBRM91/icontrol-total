// Declaración de variables globales para almacenar datos
let tiposMovimiento = [];
let tiposCosto = [];
let categorias = [];
let subCategorias = [];
let conceptos = [];
let transacciones = [];

// Datos del catálogo de meses para dropdowns
const meses = [
    { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
];

// Función para generar un ID único
const generateId = () => Math.random().toString(36).substr(2, 9);

// Función para mostrar mensajes de alerta
function showAlert(message, type = 'success') {
    const alertDiv = document.getElementById('global-alert');
    alertDiv.textContent = message;
    alertDiv.className = `alert-message ${type === 'success' ? 'alert-success' : 'alert-error'}`;
    alertDiv.style.display = 'block';
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000); // Ocultar después de 5 segundos
}

// --- Funciones de Carga y Guardado de Datos (localStorage) ---
function loadData() {
    tiposMovimiento = JSON.parse(localStorage.getItem('tiposMovimiento')) || [];
    tiposCosto = JSON.parse(localStorage.getItem('tiposCosto')) || [];
    categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    subCategorias = JSON.parse(localStorage.getItem('subCategorias')) || [];
    conceptos = JSON.parse(localStorage.getItem('conceptos')) || [];
    transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
}

function saveData() {
    localStorage.setItem('tiposMovimiento', JSON.stringify(tiposMovimiento));
    localStorage.setItem('tiposCosto', JSON.stringify(tiposCosto));
    localStorage.setItem('categorias', JSON.stringify(categorias));
    localStorage.setItem('subCategorias', JSON.stringify(subCategorias));
    localStorage.setItem('conceptos', JSON.stringify(conceptos));
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
}

// --- Funciones para Renderizar Dropdowns ---
function populateDropdown(selectElement, data, idKey, nameKey, selectedId = null) {
    selectElement.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[idKey];
        option.textContent = item[nameKey];
        if (selectedId && String(item[idKey]) === String(selectedId)) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}

function populateMonthYearDropdowns() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5; // Por ejemplo, 5 años atrás
    const endYear = currentYear + 5;   // Y 5 años adelante

    // Dashboard month/year
    const dashboardMonthSelect = document.getElementById('dashboard-month');
    const dashboardYearSelect = document.getElementById('dashboard-year');
    populateDropdown(dashboardMonthSelect, meses, 'id', 'nombre', new Date().getMonth() + 1);
    dashboardYearSelect.innerHTML = '';
    for (let i = startYear; i <= endYear; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === currentYear) {
            option.selected = true;
        }
        dashboardYearSelect.appendChild(option);
    }
    dashboardMonthSelect.addEventListener('change', updateDashboard);
    dashboardYearSelect.addEventListener('change', updateDashboard);

    // Income and Expense Period month/year
    const ingresoMonthSelect = document.getElementById('ingreso-periodo-mes');
    const ingresoYearSelect = document.getElementById('ingreso-periodo-anio');
    const gastoMonthSelect = document.getElementById('gasto-periodo-mes');
    const gastoYearSelect = document.getElementById('gasto-periodo-anio');

    populateDropdown(ingresoMonthSelect, meses, 'id', 'nombre', new Date().getMonth() + 1);
    populateDropdown(gastoMonthSelect, meses, 'id', 'nombre', new Date().getMonth() + 1);

    ingresoYearSelect.innerHTML = '';
    gastoYearSelect.innerHTML = '';
    for (let i = startYear; i <= endYear; i++) {
        const optionIngreso = document.createElement('option');
        optionIngreso.value = i;
        optionIngreso.textContent = i;
        if (i === currentYear) optionIngreso.selected = true;
        ingresoYearSelect.appendChild(optionIngreso);

        const optionGasto = document.createElement('option');
        optionGasto.value = i;
        optionGasto.textContent = i;
        if (i === currentYear) optionGasto.selected = true;
        gastoYearSelect.appendChild(optionGasto);
    }
}

function renderCatalogLists() {
    // Tipos de Movimiento
    const listaTiposMovimiento = document.getElementById('lista-tipos-movimiento');
    listaTiposMovimiento.innerHTML = '';
    tiposMovimiento.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.TipoMovimiento} (ID: ${item.ID_TipoMovimiento})`;
        listaTiposMovimiento.appendChild(li);
    });
    populateDropdown(document.getElementById('tipo-movimiento-fk-costo'), tiposMovimiento, 'ID_TipoMovimiento', 'TipoMovimiento');
    populateDropdown(document.getElementById('tipo-movimiento-fk-categoria'), tiposMovimiento, 'ID_TipoMovimiento', 'TipoMovimiento');
    populateDropdown(document.getElementById('tipo-movimiento-fk-subcategoria'), tiposMovimiento, 'ID_TipoMovimiento', 'TipoMovimiento');
    populateDropdown(document.getElementById('tipo-movimiento-fk-concepto'), tiposMovimiento, 'ID_TipoMovimiento', 'TipoMovimiento');
    populateDropdown(document.getElementById('filter-tipo-movimiento'), tiposMovimiento, 'ID_TipoMovimiento', 'TipoMovimiento');


    // Tipos de Costo
    const listaTiposCosto = document.getElementById('lista-tipos-costo');
    listaTiposCosto.innerHTML = '';
    tiposCosto.forEach(item => {
        const tipoMovimiento = tiposMovimiento.find(tm => tm.ID_TipoMovimiento === item.ID_TipoMovimiento_FK);
        const li = document.createElement('li');
        li.textContent = `${item.TipoCosto} (ID: ${item.ID_TipoCosto}) - Movimiento: ${tipoMovimiento ? tipoMovimiento.TipoMovimiento : 'N/A'}`;
        listaTiposCosto.appendChild(li);
    });
    populateDropdown(document.getElementById('tipo-costo-fk-categoria'), tiposCosto, 'ID_TipoCosto', 'TipoCosto');
    populateDropdown(document.getElementById('tipo-costo-fk-subcategoria'), tiposCosto, 'ID_TipoCosto', 'TipoCosto');
    populateDropdown(document.getElementById('tipo-costo-fk-concepto'), tiposCosto, 'ID_TipoCosto', 'TipoCosto');


    // Categorías
    const listaCategorias = document.getElementById('lista-categorias');
    listaCategorias.innerHTML = '';
    categorias.forEach(item => {
        const tipoMovimiento = tiposMovimiento.find(tm => tm.ID_TipoMovimiento === item.ID_TipoMovimiento_FK);
        const tipoCosto = tiposCosto.find(tc => tc.ID_TipoCosto === item.ID_TipoCosto_FK);
        const li = document.createElement('li');
        li.textContent = `${item.Categoría} (ID: ${item.ID_Categoria}) - Mov: ${tipoMovimiento ? tipoMovimiento.TipoMovimiento : 'N/A'}, Costo: ${tipoCosto ? tipoCosto.TipoCosto : 'N/A'}`;
        listaCategorias.appendChild(li);
    });
    populateDropdown(document.getElementById('categoria-fk-subcategoria'), categorias, 'ID_Categoria', 'Categoría');
    populateDropdown(document.getElementById('categoria-fk-concepto'), categorias, 'ID_Categoria', 'Categoría');
    populateDropdown(document.getElementById('filter-categoria'), categorias, 'ID_Categoria', 'Categoría');


    // SubCategorías
    const listaSubCategorias = document.getElementById('lista-subcategorias');
    listaSubCategorias.innerHTML = '';
    subCategorias.forEach(item => {
        const categoria = categorias.find(c => c.ID_Categoria === item.ID_Categoria_FK);
        const li = document.createElement('li');
        li.textContent = `${item.SubCategoria} (ID: ${item.ID_SubCategoria}) - Cat: ${categoria ? categoria.Categoría : 'N/A'}`;
        listaSubCategorias.appendChild(li);
    });
    populateDropdown(document.getElementById('subcategoria-fk-concepto'), subCategorias, 'ID_SubCategoria', 'SubCategoria');


    // Conceptos
    const listaConceptos = document.getElementById('lista-conceptos');
    listaConceptos.innerHTML = '';
    conceptos.forEach(item => {
        const categoria = categorias.find(c => c.ID_Categoria === item.ID_Categoria_FK);
        const li = document.createElement('li');
        li.textContent = `${item.Concepto} (ID: ${item.ID_Concepto}) - Cat: ${categoria ? categoria.Categoría : 'N/A'}`;
        listaConceptos.appendChild(li);
    });
    populateDropdown(document.getElementById('ingreso-concepto'), conceptos, 'ID_Concepto', 'Concepto');
    populateDropdown(document.getElementById('gasto-concepto'), conceptos, 'ID_Concepto', 'Concepto');

    // Populate pago-gasto-pendiente (only pending expenses)
    const pagoGastoPendienteSelect = document.getElementById('pago-gasto-pendiente');
    const pendingExpenses = transacciones.filter(t => t.TipoMovimiento === 'Gasto' && t.EstatusGasto === 'Pendiente');
    pagoGastoPendienteSelect.innerHTML = '<option value="">Seleccione un Gasto Pendiente</option>';
    pendingExpenses.forEach(expense => {
        const concepto = conceptos.find(c => c.ID_Concepto === expense.ID_Concepto_FK);
        const option = document.createElement('option');
        option.value = expense.ID_Transaccion;
        option.textContent = `${concepto ? concepto.Concepto : 'N/A'} - $${expense.MontoTransaccion.toFixed(2)} (${new Date(expense.FechaLimite).toLocaleDateString()})`;
        pagoGastoPendienteSelect.appendChild(option);
    });
}

// --- Lógica del Dashboard ---
function updateDashboard() {
    const dashboardMonth = parseInt(document.getElementById('dashboard-month').value);
    const dashboardYear = parseInt(document.getElementById('dashboard-year').value);

    let totalIngresos = 0;
    let totalGastos = 0;
    let pagosRealizados = 0;
    let pagosPendientes = 0;
    const proximosVencimientosList = document.getElementById('proximos-vencimientos');
    proximosVencimientosList.innerHTML = '';
    const today = new Date();
    today.setHours(0,0,0,0); // Normalizar a inicio del día

    const filteredTransactions = transacciones.filter(t => {
        const transaccionDate = new Date(t.FechaTransaccion);
        return transaccionDate.getMonth() + 1 === dashboardMonth && transaccionDate.getFullYear() === dashboardYear;
    });

    const upcomingDueDates = [];

    filteredTransactions.forEach(t => {
        if (t.TipoMovimiento === 'Ingreso') {
            totalIngresos += t.MontoTransaccion;
        } else if (t.TipoMovimiento === 'Gasto') {
            totalGastos += t.MontoTransaccion;
            if (t.EstatusGasto === 'Pendiente') {
                pagosPendientes += t.MontoTransaccion;
                // Revisar vencimientos
                if (t.FechaLimite) {
                    const limiteDate = new Date(t.FechaLimite);
                    if (limiteDate >= today) { // Solo si la fecha límite no ha pasado
                        upcomingDueDates.push({
                            concept: conceptos.find(c => c.ID_Concepto === t.ID_Concepto_FK)?.Concepto || 'Gasto',
                            amount: t.MontoTransaccion,
                            dueDate: limiteDate
                        });
                    }
                }
            } else if (t.EstatusGasto === 'Pagado') {
                pagosRealizados += t.MontoTransaccion;
            }
        } else if (t.TipoMovimiento === 'Pago') {
            // Los pagos ya se restaron de los gastos pendientes cuando se registraron
            // y sumaron a pagos realizados. Aquí solo es para reflejar el monto total pagado en el mes
            // sin doble conteo con 'pagosRealizados' de 'Gasto'
        }
    });

    // Ordenar vencimientos por fecha
    upcomingDueDates.sort((a, b) => a.dueDate - b.dueDate);
    if (upcomingDueDates.length > 0) {
        upcomingDueDates.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `Concepto: ${item.concept}, Monto: $${item.amount.toFixed(2)}, Vence: ${item.dueDate.toLocaleDateString()}`;
            proximosVencimientosList.appendChild(li);
        });
    } else {
        proximosVencimientosList.innerHTML = '<li class="text-gray-500">No hay vencimientos próximos.</li>';
    }

    const saldoDisponible = totalIngresos - totalGastos;

    document.getElementById('total-ingresos').textContent = `$${totalIngresos.toFixed(2)}`;
    document.getElementById('total-gastos').textContent = `$${totalGastos.toFixed(2)}`;
    document.getElementById('saldo-disponible').textContent = `$${saldoDisponible.toFixed(2)}`;
    document.getElementById('pagos-realizados').textContent = `$${pagosRealizados.toFixed(2)}`;
    document.getElementById('pagos-pendientes').textContent = `$${pagosPendientes.toFixed(2)}`;

    // TODO: Implementar gráfico de distribución de gastos por categorías
    document.getElementById('gastos-por-categoria').textContent = 'Gráfico de torta o barras (Pendiente de implementación con librería de gráficos)';
}

// --- Lógica de la Tabla de Transacciones ---
function renderTransactionsTable(filters = {}) {
    const tbody = document.getElementById('tabla-transacciones-body');
    tbody.innerHTML = ''; // Limpiar tabla

    let filteredTrans = [...transacciones];

    // Aplicar filtros
    if (filters.fechaInicio) {
        const startDate = new Date(filters.fechaInicio);
        filteredTrans = filteredTrans.filter(t => new Date(t.FechaTransaccion) >= startDate);
    }
    if (filters.fechaFin) {
        const endDate = new Date(filters.fechaFin);
        filteredTrans = filteredTrans.filter(t => new Date(t.FechaTransaccion) <= endDate);
    }
    if (filters.tipoMovimiento && filters.tipoMovimiento !== '') {
        filteredTrans = filteredTrans.filter(t => t.ID_TipoMovimiento_FK === filters.tipoMovimiento);
    }
    if (filters.categoria && filters.categoria !== '') {
        filteredTrans = filteredTrans.filter(t => {
            const concepto = conceptos.find(c => c.ID_Concepto === t.ID_Concepto_FK);
            return concepto && concepto.ID_Categoria_FK === filters.categoria;
        });
    }

    if (filteredTrans.length === 0) {
        const row = tbody.insertRow();
        row.innerHTML = `<td colspan="11" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No hay transacciones registradas que coincidan con los filtros.</td>`;
        return;
    }

    filteredTrans.forEach(t => {
        const row = tbody.insertRow();
        let rowClass = '';
        if (t.TipoMovimiento === 'Ingreso') {
            rowClass = 'row-ingreso';
        } else if (t.TipoMovimiento === 'Gasto') {
            rowClass = 'row-gasto';
        } else if (t.TipoMovimiento === 'Pago') {
            rowClass = 'row-pago';
        }
        row.className = rowClass;

        const tipoMovimiento = tiposMovimiento.find(tm => tm.ID_TipoMovimiento === t.ID_TipoMovimiento_FK);
        const concepto = conceptos.find(c => c.ID_Concepto === t.ID_Concepto_FK);
        const categoria = concepto ? categorias.find(cat => cat.ID_Categoria === concepto.ID_Categoria_FK) : null;
        const subcategoria = concepto ? subCategorias.find(subcat => subcat.ID_SubCategoria === concepto.ID_SubCategoria_FK) : null;

        row.insertCell().textContent = t.ID_Transaccion.substring(0, 8); // Mostrar solo una parte del ID
        row.insertCell().textContent = new Date(t.FechaTransaccion).toLocaleDateString();
        row.insertCell().textContent = tipoMovimiento ? tipoMovimiento.TipoMovimiento : 'N/A';
        row.insertCell().textContent = concepto ? concepto.Concepto : 'N/A';
        row.insertCell().textContent = `$${t.MontoTransaccion.toFixed(2)}`;
        row.insertCell().textContent = t.FechaPagoRecibo ? new Date(t.FechaPagoRecibo).toLocaleDateString() : 'N/A';
        row.insertCell().textContent = `${t.PeriodoMes}/${t.PeriodoAnio}`;
        row.insertCell().textContent = t.EstatusGasto || 'N/A';
        row.insertCell().textContent = t.PrioridadGasto || 'N/A';
        row.insertCell().textContent = t.Notas || '';

        const actionsCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2';
        editButton.onclick = () => openModalForEdit(t.ID_Transaccion);
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded';
        deleteButton.onclick = () => openModalForDelete(t.ID_Transaccion);
        actionsCell.appendChild(deleteButton);
    });
}


// --- Lógica de la Modal ---
const transactionModal = document.getElementById('transaction-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const cancelModalButton = document.getElementById('cancel-modal');
const confirmModalButton = document.getElementById('confirm-modal');

let currentTransactionId = null; // Para saber qué transacción estamos editando/eliminando
let modalMode = ''; // 'edit' or 'delete'

function openModalForEdit(id) {
    currentTransactionId = id;
    modalMode = 'edit';
    modalTitle.textContent = 'Editar Transacción';
    const transaction = transacciones.find(t => t.ID_Transaccion === id);

    if (!transaction) {
        showAlert('Transacción no encontrada para edición.', 'error');
        return;
    }

    // Crear formulario de edición dinámicamente
    modalBody.innerHTML = `
        <form id="form-edit-transaction" class="space-y-4">
            <div>
                <label for="edit-monto" class="block text-sm font-medium text-gray-700">Monto</label>
                <input type="number" id="edit-monto" value="${transaction.MontoTransaccion}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" step="0.01" required>
            </div>
            <div>
                <label for="edit-fecha-transaccion" class="block text-sm font-medium text-gray-700">Fecha de Transacción</label>
                <input type="date" id="edit-fecha-transaccion" value="${transaction.FechaTransaccion}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" required>
            </div>
            ${transaction.TipoMovimiento === 'Gasto' ? `
                <div>
                    <label for="edit-estatus-gasto" class="block text-sm font-medium text-gray-700">Estatus de Gasto</label>
                    <select id="edit-estatus-gasto" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" required>
                        <option value="Pendiente" ${transaction.EstatusGasto === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="Pagado" ${transaction.EstatusGasto === 'Pagado' ? 'selected' : ''}>Pagado</option>
                    </select>
                </div>
                <div>
                    <label for="edit-prioridad-gasto" class="block text-sm font-medium text-gray-700">Prioridad de Gasto</label>
                    <input type="text" id="edit-prioridad-gasto" value="${transaction.PrioridadGasto || ''}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div>
                    <label for="edit-fecha-limite" class="block text-sm font-medium text-gray-700">Fecha Límite (Solo Gastos)</label>
                    <input type="date" id="edit-fecha-limite" value="${transaction.FechaLimite || ''}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500">
                </div>
            ` : ''}
            <div>
                <label for="edit-notas" class="block text-sm font-medium text-gray-700">Notas</label>
                <textarea id="edit-notas" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500">${transaction.Notas || ''}</textarea>
            </div>
        </form>
    `;
    confirmModalButton.textContent = 'Guardar Cambios';
    confirmModalButton.className = 'px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'; // Color para guardar
    transactionModal.classList.remove('hidden');
}

function openModalForDelete(id) {
    currentTransactionId = id;
    modalMode = 'delete';
    modalTitle.textContent = 'Eliminar Transacción';
    modalBody.innerHTML = `<p class="text-gray-700">¿Estás seguro de que quieres eliminar esta transacción? Esta acción no se puede deshacer.</p>`;
    confirmModalButton.textContent = 'Eliminar';
    confirmModalButton.className = 'px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'; // Color para eliminar
    transactionModal.classList.remove('hidden');
}

function closeModal() {
    transactionModal.classList.add('hidden');
    currentTransactionId = null;
    modalMode = '';
}

async function handleModalConfirm() {
    if (!currentTransactionId) return;

    if (modalMode === 'edit') {
        const form = document.getElementById('form-edit-transaction');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const index = transacciones.findIndex(t => t.ID_Transaccion === currentTransactionId);
        if (index > -1) {
            transacciones[index].MontoTransaccion = parseFloat(document.getElementById('edit-monto').value);
            transacciones[index].FechaTransaccion = document.getElementById('edit-fecha-transaccion').value;
            transacciones[index].Notas = document.getElementById('edit-notas').value;

            // Specific fields for Gasto
            if (transacciones[index].TipoMovimiento === 'Gasto') {
                transacciones[index].EstatusGasto = document.getElementById('edit-estatus-gasto').value;
                transacciones[index].PrioridadGasto = document.getElementById('edit-prioridad-gasto').value;
                transacciones[index].FechaLimite = document.getElementById('edit-fecha-limite').value;
            }

            saveData();
            showAlert('Transacción actualizada con éxito.', 'success');
        } else {
            showAlert('Error: Transacción no encontrada.', 'error');
        }
    } else if (modalMode === 'delete') {
        transacciones = transacciones.filter(t => t.ID_Transaccion !== currentTransactionId);
        saveData();
        showAlert('Transacción eliminada con éxito.', 'success');
    }

    closeModal();
    renderCatalogLists(); // Actualizar dropdowns de pagos pendientes
    renderTransactionsTable();
    updateDashboard();
}

// --- Manejo de Formularios ---

// Formulario Tipo de Movimiento
document.getElementById('form-tipo-movimiento').addEventListener('submit', function(e) {
    e.preventDefault();
    const tipoMovimientoNombre = document.getElementById('tipo-movimiento').value;
    const nuevoTipoMovimiento = {
        ID_TipoMovimiento: generateId(),
        TipoMovimiento: tipoMovimientoNombre
    };
    tiposMovimiento.push(nuevoTipoMovimiento);
    saveData();
    renderCatalogLists();
    this.reset();
    showAlert('Tipo de Movimiento guardado con éxito.', 'success');
});

// Formulario Tipo de Costo
document.getElementById('form-tipo-costo').addEventListener('submit', function(e) {
    e.preventDefault();
    const tipoCostoNombre = document.getElementById('tipo-costo').value;
    const idTipoMovimientoFK = document.getElementById('tipo-movimiento-fk-costo').value;

    if (!idTipoMovimientoFK) {
        showAlert('Por favor, seleccione un Tipo de Movimiento.', 'error');
        return;
    }

    const nuevoTipoCosto = {
        ID_TipoCosto: generateId(),
        TipoCosto: tipoCostoNombre,
        ID_TipoMovimiento_FK: idTipoMovimientoFK
    };
    tiposCosto.push(nuevoTipoCosto);
    saveData();
    renderCatalogLists();
    this.reset();
    showAlert('Tipo de Costo guardado con éxito.', 'success');
});

// Formulario Categoría
document.getElementById('form-categoria').addEventListener('submit', function(e) {
    e.preventDefault();
    const categoriaNombre = document.getElementById('categoria').value;
    const idTipoMovimientoFK = document.getElementById('tipo-movimiento-fk-categoria').value;
    const idTipoCostoFK = document.getElementById('tipo-costo-fk-categoria').value;

    if (!idTipoMovimientoFK || !idTipoCostoFK) {
        showAlert('Por favor, seleccione un Tipo de Movimiento y un Tipo de Costo.', 'error');
        return;
    }

    const nuevaCategoria = {
        ID_Categoria: generateId(),
        Categoría: categoriaNombre,
        ID_TipoMovimiento_FK: idTipoMovimientoFK,
        ID_TipoCosto_FK: idTipoCostoFK
    };
    categorias.push(nuevaCategoria);
    saveData();
    renderCatalogLists();
    this.reset();
    showAlert('Categoría guardada con éxito.', 'success');
});

// Formulario SubCategoría
document.getElementById('form-subcategoria').addEventListener('submit', function(e) {
    e.preventDefault();
    const subCategoriaNombre = document.getElementById('subcategoria').value;
    const idTipoMovimientoFK = document.getElementById('tipo-movimiento-fk-subcategoria').value;
    const idTipoCostoFK = document.getElementById('tipo-costo-fk-subcategoria').value;
    const idCategoriaFK = document.getElementById('categoria-fk-subcategoria').value;

    if (!idTipoMovimientoFK || !idTipoCostoFK || !idCategoriaFK) {
        showAlert('Por favor, seleccione Tipo de Movimiento, Tipo de Costo y Categoría.', 'error');
        return;
    }

    const nuevaSubCategoria = {
        ID_SubCategoria: generateId(),
        SubCategoria: subCategoriaNombre,
        ID_TipoMovimiento_FK: idTipoMovimientoFK,
        ID_TipoCosto_FK: idTipoCostoFK,
        ID_Categoria_FK: idCategoriaFK
    };
    subCategorias.push(nuevaSubCategoria);
    saveData();
    renderCatalogLists();
    this.reset();
    showAlert('SubCategoría guardada con éxito.', 'success');
});

// Formulario Concepto
document.getElementById('form-concepto').addEventListener('submit', function(e) {
    e.preventDefault();
    const conceptoNombre = document.getElementById('concepto').value;
    const idTipoMovimientoFK = document.getElementById('tipo-movimiento-fk-concepto').value;
    const idTipoCostoFK = document.getElementById('tipo-costo-fk-concepto').value;
    const idCategoriaFK = document.getElementById('categoria-fk-concepto').value;
    const idSubCategoriaFK = document.getElementById('subcategoria-fk-concepto').value; // Opcional

    if (!idTipoMovimientoFK || !idTipoCostoFK || !idCategoriaFK) {
        showAlert('Por favor, seleccione Tipo de Movimiento, Tipo de Costo y Categoría.', 'error');
        return;
    }

    const nuevoConcepto = {
        ID_Concepto: generateId(),
        Concepto: conceptoNombre,
        ID_TipoMovimiento_FK: idTipoMovimientoFK,
        ID_TipoCosto_FK: idTipoCostoFK,
        ID_Categoria_FK: idCategoriaFK,
        ID_SubCategoria_FK: idSubCategoriaFK || null // Puede ser nulo
    };
    conceptos.push(nuevoConcepto);
    saveData();
    renderCatalogLists();
    this.reset();
    showAlert('Concepto guardado con éxito.', 'success');
});

// Formulario Ingreso
document.getElementById('form-ingreso').addEventListener('submit', function(e) {
    e.preventDefault();
    const idConcepto = document.getElementById('ingreso-concepto').value;
    const periodoMes = parseInt(document.getElementById('ingreso-periodo-mes').value);
    const periodoAnio = parseInt(document.getElementById('ingreso-periodo-anio').value);
    const quincena = document.getElementById('ingreso-quincena').value;
    const montoIngreso = parseFloat(document.getElementById('ingreso-monto').value);
    const fechaIngreso = document.getElementById('ingreso-fecha').value;

    if (!idConcepto || !periodoMes || !periodoAnio || !quincena || isNaN(montoIngreso) || !fechaIngreso) {
        showAlert('Por favor, complete todos los campos requeridos para el ingreso.', 'error');
        return;
    }

    const conceptoObj = conceptos.find(c => c.ID_Concepto === idConcepto);
    if (!conceptoObj) {
        showAlert('Concepto seleccionado no válido.', 'error');
        return;
    }
    const tipoMovimiento = tiposMovimiento.find(tm => tm.TipoMovimiento === 'Ingreso');
    if (!tipoMovimiento) {
         showAlert('Error: Tipo de movimiento "Ingreso" no encontrado. Por favor, regístrelo en la sección correspondiente.', 'error');
         return;
    }

    const nuevoIngreso = {
        ID_Transaccion: generateId(),
        FechaTransaccion: fechaIngreso,
        ID_TipoMovimiento_FK: tipoMovimiento.ID_TipoMovimiento,
        TipoMovimiento: 'Ingreso', // Añadir para fácil filtrado
        ID_Concepto_FK: idConcepto,
        MontoTransaccion: montoIngreso,
        FechaPagoRecibo: null, // No aplica para ingresos
        PeriodoAnio: periodoAnio,
        PeriodoMes: periodoMes,
        Quincena: quincena,
        EstatusGasto: null,
        PrioridadGasto: null,
        Notas: null
    };
    transacciones.push(nuevoIngreso);
    saveData();
    renderTransactionsTable();
    updateDashboard();
    this.reset();
    showAlert('Ingreso registrado con éxito.', 'success');
});

// Lógica para el formulario de Gasto (cálculo de fechas de corte y límite)
const gastoDiaCorte = document.getElementById('gasto-dia-corte');
const gastoDiaLimite = document.getElementById('gasto-dia-limite');
const gastoMesPeriodo = document.getElementById('gasto-periodo-mes');
const gastoAnioPeriodo = document.getElementById('gasto-periodo-anio');
const gastoFechaCorteInput = document.getElementById('gasto-fecha-corte');
const gastoFechaLimiteInput = document.getElementById('gasto-fecha-limite');

function calculateGastoDates() {
    const diaCorte = parseInt(gastoDiaCorte.value);
    const diaLimite = parseInt(gastoDiaLimite.value);
    const mesPeriodo = parseInt(gastoMesPeriodo.value);
    const anioPeriodo = parseInt(gastoAnioPeriodo.value);

    if (!diaCorte || !diaLimite || !mesPeriodo || !anioPeriodo) {
        gastoFechaCorteInput.value = '';
        gastoFechaLimiteInput.value = '';
        return;
    }

    let fechaCorte = new Date(anioPeriodo, mesPeriodo - 1, diaCorte);
    gastoFechaCorteInput.value = fechaCorte.toISOString().split('T')[0];

    let fechaLimiteMes = mesPeriodo - 1; // Mes base para la fecha límite
    let fechaLimiteAnio = anioPeriodo;

    if (diaCorte > diaLimite) {
        // Si el día límite es menor que el día de corte, el mes de la fecha límite debe ser el siguiente
        fechaLimiteMes = mesPeriodo; // Se incrementa el mes
        if (fechaLimiteMes > 11) { // Si pasa de diciembre, incrementa el año
            fechaLimiteMes = 0; // Enero
            fechaLimiteAnio++;
        }
    } else {
         // Si el día límite es mayor o igual al día de corte, el mes de la fecha límite es el mismo que el mes de corte
         fechaLimiteMes = mesPeriodo - 1;
    }

    let fechaLimite = new Date(fechaLimiteAnio, fechaLimiteMes, diaLimite);
    gastoFechaLimiteInput.value = fechaLimite.toISOString().split('T')[0];
}

gastoDiaCorte.addEventListener('change', calculateGastoDates);
gastoDiaLimite.addEventListener('change', calculateGastoDates);
gastoMesPeriodo.addEventListener('change', calculateGastoDates);
gastoAnioPeriodo.addEventListener('change', calculateGastoDates);

// Formulario Gasto (submit)
document.getElementById('form-gasto').addEventListener('submit', function(e) {
    e.preventDefault();
    const idConcepto = document.getElementById('gasto-concepto').value;
    const periodoMes = parseInt(document.getElementById('gasto-periodo-mes').value);
    const periodoAnio = parseInt(document.getElementById('gasto-periodo-anio').value);
    const montoGasto = parseFloat(document.getElementById('gasto-monto').value);
    const diaCorte = parseInt(document.getElementById('gasto-dia-corte').value);
    const diaLimite = parseInt(document.getElementById('gasto-dia-limite').value);
    const fechaCorte = document.getElementById('gasto-fecha-corte').value;
    const fechaLimite = document.getElementById('gasto-fecha-limite').value;
    const notas = document.getElementById('gasto-notas').value;

    if (!idConcepto || !periodoMes || !periodoAnio || isNaN(montoGasto) || isNaN(diaCorte) || isNaN(diaLimite) || !fechaCorte || !fechaLimite) {
        showAlert('Por favor, complete todos los campos requeridos para el gasto.', 'error');
        return;
    }

    const conceptoObj = conceptos.find(c => c.ID_Concepto === idConcepto);
    if (!conceptoObj) {
        showAlert('Concepto seleccionado no válido.', 'error');
        return;
    }
    const tipoMovimiento = tiposMovimiento.find(tm => tm.TipoMovimiento === 'Gasto');
    if (!tipoMovimiento) {
        showAlert('Error: Tipo de movimiento "Gasto" no encontrado. Por favor, regístrelo en la sección correspondiente.', 'error');
        return;
    }

    const nuevoGasto = {
        ID_Transaccion: generateId(),
        FechaTransaccion: fechaCorte, // La fecha de la transacción será la fecha de corte
        ID_TipoMovimiento_FK: tipoMovimiento.ID_TipoMovimiento,
        TipoMovimiento: 'Gasto', // Añadir para fácil filtrado
        ID_Concepto_FK: idConcepto,
        MontoTransaccion: montoGasto,
        FechaPagoRecibo: null, // Se llenará al registrar el pago
        PeriodoAnio: periodoAnio,
        PeriodoMes: periodoMes,
        DiaCorte: diaCorte,
        DiaLimite: diaLimite,
        FechaCorte: fechaCorte,
        FechaLimite: fechaLimite,
        EstatusGasto: 'Pendiente', // Inicialmente Pendiente
        PrioridadGasto: null, // Se puede añadir después
        Notas: notas
    };
    transacciones.push(nuevoGasto);
    saveData();
    renderTransactionsTable();
    updateDashboard();
    renderCatalogLists(); // Para actualizar dropdown de pagos pendientes
    this.reset();
    showAlert('Gasto registrado con éxito.', 'success');
});

// Formulario Pagos
document.getElementById('form-pago').addEventListener('submit', function(e) {
    e.preventDefault();
    const idGastoPendiente = document.getElementById('pago-gasto-pendiente').value;
    const montoPago = parseFloat(document.getElementById('pago-monto').value);
    const fechaPago = document.getElementById('pago-fecha').value;
    const notas = document.getElementById('pago-notas').value;

    if (!idGastoPendiente || isNaN(montoPago) || !fechaPago) {
        showAlert('Por favor, complete todos los campos requeridos para el pago.', 'error');
        return;
    }

    const gastoIndex = transacciones.findIndex(t => t.ID_Transaccion === idGastoPendiente && t.TipoMovimiento === 'Gasto' && t.EstatusGasto === 'Pendiente');

    if (gastoIndex === -1) {
        showAlert('Gasto pendiente no encontrado o ya pagado.', 'error');
        return;
    }

    const gasto = transacciones[gastoIndex];
    if (montoPago > gasto.MontoTransaccion) {
        showAlert('El monto del pago no puede ser mayor al monto del gasto pendiente.', 'error');
        return;
    }

    // Actualizar el gasto original
    gasto.FechaPagoRecibo = fechaPago;
    gasto.EstatusGasto = 'Pagado'; // Marcar como pagado
    gasto.Notas = (gasto.Notas ? gasto.Notas + '; ' : '') + `Pago realizado el ${new Date(fechaPago).toLocaleDateString()} por $${montoPago.toFixed(2)}. ${notas}`;

    // Podríamos crear una transacción de tipo 'Pago' separada si necesitamos un registro granular de pagos.
    // Por ahora, actualizamos el gasto y lo reflejamos en el dashboard.
    const tipoMovimientoPago = tiposMovimiento.find(tm => tm.TipoMovimiento === 'Pago');
    if (!tipoMovimientoPago) {
        showAlert('Error: Tipo de movimiento "Pago" no encontrado. Por favor, regístrelo en la sección correspondiente.', 'error');
        return;
    }

    const nuevoPagoRegistro = {
        ID_Transaccion: generateId(),
        FechaTransaccion: fechaPago,
        ID_TipoMovimiento_FK: tipoMovimientoPago.ID_TipoMovimiento,
        TipoMovimiento: 'Pago',
        ID_Concepto_FK: gasto.ID_Concepto_FK, // Asociar al concepto del gasto
        MontoTransaccion: montoPago,
        FechaPagoRecibo: fechaPago,
        PeriodoAnio: new Date(fechaPago).getFullYear(),
        PeriodoMes: new Date(fechaPago).getMonth() + 1,
        EstatusGasto: 'Completado', // Estatus para el registro de pago
        PrioridadGasto: null,
        Notas: `Pago para ${conceptos.find(c => c.ID_Concepto === gasto.ID_Concepto_FK)?.Concepto || 'Gasto'} original (ID: ${gasto.ID_Transaccion.substring(0,8)}). ${notas}`
    };
    transacciones.push(nuevoPagoRegistro);


    saveData();
    renderTransactionsTable();
    updateDashboard();
    renderCatalogLists(); // Para actualizar dropdown de pagos pendientes
    this.reset();
    showAlert('Pago registrado con éxito.', 'success');
});


// --- Event Listeners para la Navegación y Modal ---
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(nav => {
            nav.classList.remove('active-nav');
        });
        const targetSectionId = this.getAttribute('data-section');
        document.getElementById(targetSectionId).classList.add('active');
        this.classList.add('active-nav');

        // Si es la sección de transacciones, renderizar tabla
        if (targetSectionId === 'transacciones') {
            renderTransactionsTable();
        }
        // Si es el dashboard, actualizar
        if (targetSectionId === 'dashboard') {
            updateDashboard();
        }
        // Cerrar sidebar en móvil después de la navegación
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.add('hidden');
            document.getElementById('main-content').classList.add('full-width');
        }
    });
});

// Toggle sidebar en móviles
document.getElementById('toggle-sidebar').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    sidebar.classList.toggle('hidden');
    mainContent.classList.toggle('full-width');
});

// Event listeners para los filtros de la tabla de transacciones
document.getElementById('apply-filters').addEventListener('click', function() {
    const filters = {
        fechaInicio: document.getElementById('filter-fecha-inicio').value,
        fechaFin: document.getElementById('filter-fecha-fin').value,
        tipoMovimiento: document.getElementById('filter-tipo-movimiento').value,
        categoria: document.getElementById('filter-categoria').value
    };
    renderTransactionsTable(filters);
});

// Event listeners para la modal
cancelModalButton.addEventListener('click', closeModal);
confirmModalButton.addEventListener('click', handleModalConfirm);
transactionModal.addEventListener('click', function(e) {
    if (e.target === transactionModal) {
        closeModal();
    }
});


// --- Inicialización de la Aplicación ---
function init() {
    loadData();
    populateMonthYearDropdowns(); // Primero poblar dropdowns de años y meses
    renderCatalogLists();
    renderTransactionsTable();
    updateDashboard(); // Actualizar dashboard con datos iniciales del mes/año actual
}

document.addEventListener('DOMContentLoaded', init); // Cargar datos y renderizar al cargar la página