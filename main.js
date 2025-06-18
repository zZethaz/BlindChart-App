// En tu archivo index.html, justo antes de </body>, o en un archivo main.js
// <script src="main.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    // ---- Elementos del Dashboard ----
    const capitalActualElem = document.querySelector('.card:nth-child(1) .metric-value');
    const rendimientoNetoValueElem = document.querySelector('.card:nth-child(2) .metric-value');
    const rendimientoNetoDescElem = document.querySelector('.card:nth-child(2) .metric-description');
    const tasaAciertoValueElem = document.querySelector('.card:nth-child(4) .metric-value');
    const tasaAciertoProgressBar = document.querySelector('.card:nth-child(4) .progress-bar');
    const tasaAciertoProgressText = document.querySelector('.card:nth-child(4) .progress-text');
    const operacionesAbiertasTableBody = document.querySelector('.card:nth-child(6) .data-table tbody');
    const ultimosTradesCerradosTableBody = document.querySelector('.card:nth-child(7) .data-table tbody');
    const chartPlaceholder = document.querySelector('.card-chart-placeholder'); // Para el gráfico

    // ---- Elementos del Formulario de Simulación ----
    const initialCapitalInput = document.getElementById('sim-capital-inicial');
    const numOperationsInput = document.getElementById('sim-num-operaciones');
    const startDateInput = document.getElementById('sim-fecha-inicio');
    const endDateInput = document.getElementById('sim-fecha-fin');
    const cfdCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    const startSimulationBtn = document.querySelector('.simulation-config-card .start-simulation-btn');

    // ---- Variables de Estado Globales de la Simulación ----
    let currentCapital = 0;
    let initialCapital = 0;
    let totalTrades = 0;
    let winningTrades = 0;
    let losingTrades = 0;
    let tradeHistory = []; // Para almacenar todos los trades cerrados
    let openTrades = []; // Para las operaciones que aún no se cierran

    // Función para actualizar el dashboard con los datos actuales
    function updateDashboardUI() {
        capitalActualElem.textContent = `$${currentCapital.toFixed(2)}`;

        const netProfit = currentCapital - initialCapital;
        const percentageReturn = (netProfit / initialCapital) * 100;
        rendimientoNetoValueElem.textContent = `$${netProfit.toFixed(2)}`;
        rendimientoNetoDescElem.textContent = `${percentageReturn.toFixed(2)}% de Capital Inicial`;
        // Ajustar colores según el P&L
        if (netProfit > 0) {
            rendimientoNetoValueElem.classList.remove('pnl-negative', 'pnl-neutral');
            rendimientoNetoValueElem.classList.add('pnl-positive');
            rendimientoNetoDescElem.classList.remove('pnl-negative', 'pnl-neutral');
            rendimientoNetoDescElem.classList.add('pnl-positive');
        } else if (netProfit < 0) {
            rendimientoNetoValueElem.classList.remove('pnl-positive', 'pnl-neutral');
            rendimientoNetoValueElem.classList.add('pnl-negative');
            rendimientoNetoDescElem.classList.remove('pnl-positive', 'pnl-neutral');
            rendimientoNetoDescElem.classList.add('pnl-negative');
        } else {
            rendimientoNetoValueElem.classList.remove('pnl-positive', 'pnl-negative');
            rendimientoNetoValueElem.classList.add('pnl-neutral');
            rendimientoNetoDescElem.classList.remove('pnl-positive', 'pnl-negative');
            rendimientoNetoDescElem.classList.add('pnl-neutral');
        }


        const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
        tasaAciertoValueElem.textContent = `${winRate.toFixed(1)}%`;
        tasaAciertoProgressBar.style.width = `${winRate}%`;
        tasaAciertoProgressText.textContent = `${winningTrades} trades ganados de ${totalTrades}`;

        // Limpiar y poblar tabla de operaciones abiertas
        operacionesAbiertasTableBody.innerHTML = '';
        if (openTrades.length === 0) {
            operacionesAbiertasTableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="3">No hay operaciones abiertas actualmente.</td>
                </tr>
            `;
        } else {
            openTrades.forEach(trade => {
                const pnlClass = trade.pnl >= 0 ? 'pnl-positive' : 'pnl-negative';
                operacionesAbiertasTableBody.innerHTML += `
                    <tr>
                        <td>${trade.asset}</td>
                        <td>${trade.type}</td>
                        <td class="${pnlClass}">${trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}</td>
                    </tr>
                `;
            });
        }

        // Limpiar y poblar tabla de trades cerrados (mostrar solo los últimos 5, por ejemplo)
        ultimosTradesCerradosTableBody.innerHTML = '';
        if (tradeHistory.length === 0) {
            ultimosTradesCerradosTableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="3">Aún no hay trades cerrados.</td>
                </tr>
            `;
        } else {
            tradeHistory.slice(-5).reverse().forEach(trade => { // Mostrar los 5 más recientes
                const pnlClass = trade.profit >= 0 ? 'pnl-positive' : 'pnl-negative';
                const resultText = trade.profit >= 0 ? 'Ganancia' : 'Pérdida';
                ultimosTradesCerradosTableBody.innerHTML += `
                    <tr>
                        <td>${trade.asset}</td>
                        <td class="${pnlClass}">${resultText}</td>
                        <td class="${pnlClass}">${trade.percentage.toFixed(1)}%</td>
                    </tr>
                `;
            });
        }

        // Actualizar el gráfico (placeholder por ahora, se integraría con Chart.js)
        chartPlaceholder.textContent = `Gráfico de Evolución de Capital (Datos de ${initialCapital.toFixed(2)} a ${currentCapital.toFixed(2)})`;
    }

    // Inicializar el dashboard al cargar la página (todos los valores en cero/N/A)
    function resetDashboard() {
        currentCapital = 0;
        initialCapital = 0;
        totalTrades = 0;
        winningTrades = 0;
        losingTrades = 0;
        tradeHistory = [];
        openTrades = [];
        updateDashboardUI(); // Actualizar UI con valores reseteados
        // Restaurar descripciones a estado inicial "vacío"
        capitalActualElem.classList.add('pnl-neutral');
        rendimientoNetoValueElem.classList.add('pnl-neutral');
        rendimientoNetoDescElem.classList.add('pnl-neutral');
        tasaAciertoValueElem.classList.add('pnl-neutral');
        tasaAciertoProgressText.classList.add('pnl-neutral');
    }

    resetDashboard(); // Llama esto al inicio para asegurar que el dashboard esté vacío

    // --- Lógica de Simulación Aleatoria ---
    function generateRandomTrade(capital, selectedCfds) {
        // Simulación muy simplificada para fines de demostración
        const assets = {
            'Forex': ['EUR/USD', 'GBP/JPY', 'USD/CAD'],
            'Índices': ['SP500', 'DAX40', 'NASDAQ100'],
            'Materias Primas': ['XAU/USD (Oro)', 'USOIL (Petróleo)'],
            'Criptomonedas': ['BTC/USD', 'ETH/USD'],
            'Acciones': ['AAPL', 'TSLA', 'GOOGL']
        };

        const availableAssets = [];
        selectedCfds.forEach(cfdType => {
            if (assets[cfdType]) {
                availableAssets.push(...assets[cfdType]);
            }
        });

        if (availableAssets.length === 0) {
            console.warn("No se seleccionaron CFDs para la simulación.");
            return null;
        }

        const randomAsset = availableAssets[Math.floor(Math.random() * availableAssets.length)];
        const tradeType = Math.random() < 0.5 ? 'Compra' : 'Venta'; // 50% compra, 50% venta

        // Generar un P&L aleatorio (entre -5% y +5% del capital, ajustado por un factor pequeño)
        const minChange = -0.05; // -5%
        const maxChange = 0.05; // +5%
        const changePercentage = (Math.random() * (maxChange - minChange)) + minChange;
        const simulatedProfitLoss = capital * changePercentage * (Math.random() * 0.5 + 0.5); // Factor para hacerlo más "realista"

        // Simular que algunas operaciones permanecen abiertas brevemente para el demo
        const isOpen = Math.random() < 0.3; // 30% de probabilidad de que quede abierta

        return {
            asset: randomAsset,
            type: tradeType,
            pnl: simulatedProfitLoss, // P&L actual si está abierto, o P&L final si está cerrado
            isOpen: isOpen,
            percentage: (simulatedProfitLoss / initialCapital) * 100 // Porcentaje sobre capital inicial (simplificado)
        };
    }

    startSimulationBtn.addEventListener('click', () => {
        initialCapital = parseFloat(initialCapitalInput.value);
        const numOperations = parseInt(numOperationsInput.value);
        const startDate = startDateInput.value; // No se usa directamente en la simulación de P&L, pero es un input
        const endDate = endDateInput.value; // Ídem

        const selectedCfds = Array.from(cfdCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.nextElementSibling.textContent.split(' ')[0]); // Extrae "Forex", "Índices", etc.

        if (isNaN(initialCapital) || initialCapital <= 0 || isNaN(numOperations) || numOperations <= 0) {
            alert('Por favor, ingresa un capital inicial y un número de operaciones válidos.');
            return;
        }
        if (selectedCfds.length === 0) {
            alert('Por favor, selecciona al menos un tipo de CFD para simular.');
            return;
        }

        // Reiniciar variables para la nueva simulación
        currentCapital = initialCapital;
        totalTrades = 0;
        winningTrades = 0;
        losingTrades = 0;
        tradeHistory = [];
        openTrades = [];

        // Simulación paso a paso de las operaciones
        for (let i = 0; i < numOperations; i++) {
            const trade = generateRandomTrade(currentCapital, selectedCfds);
            if (!trade) continue; // Si no hay CFDs seleccionados

            totalTrades++;

            if (trade.isOpen) {
                openTrades.push(trade); // Añadir a operaciones abiertas
            } else {
                currentCapital += trade.pnl; // Aplicar P&L al capital
                tradeHistory.push({ // Guardar trade cerrado
                    asset: trade.asset,
                    type: trade.type,
                    profit: trade.pnl,
                    percentage: trade.percentage
                });
                if (trade.pnl >= 0) {
                    winningTrades++;
                } else {
                    losingTrades++;
                }
            }

            // Opcional: Cerrar aleatoriamente algunas operaciones abiertas durante la simulación
            if (openTrades.length > 0 && Math.random() < 0.2) { // 20% de probabilidad de cerrar una abierta
                const tradeToCloseIndex = Math.floor(Math.random() * openTrades.length);
                const tradeToClose = openTrades.splice(tradeToCloseIndex, 1)[0]; // Remover de abiertas
                currentCapital += tradeToClose.pnl; // Aplicar P&L
                tradeHistory.push({
                    asset: tradeToClose.asset,
                    type: tradeToClose.type,
                    profit: tradeToClose.pnl,
                    percentage: tradeToClose.percentage
                });
                if (tradeToClose.pnl >= 0) {
                    winningTrades++;
                } else {
                    losingTrades++;
                }
            }
        }

        // Una vez terminada la simulación, cerrar todas las operaciones restantes
        openTrades.forEach(trade => {
            currentCapital += trade.pnl;
            tradeHistory.push({
                asset: trade.asset,
                type: trade.type,
                profit: trade.pnl,
                percentage: trade.percentage
            });
            if (trade.pnl >= 0) {
                winningTrades++;
            } else {
                losingTrades++;
            }
        });
        openTrades = []; // Todas cerradas

        updateDashboardUI(); // Actualizar la UI con los resultados finales

        alert(`Simulación completada. Capital final: $${currentCapital.toFixed(2)}`);
    });

    // --- Cargar datos de usuario al cargar el dashboard ---
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        document.querySelector('.user-profile-compact span').textContent = loggedInUser;
        document.querySelector('.user-greeting h1').textContent = `Bienvenido, ${loggedInUser}`;
        document.querySelector('.avatar-small').textContent = loggedInUser.charAt(0).toUpperCase();
        // Aquí podrías cargar datos de simulación si se guardaron previamente para este usuario
    } else {
        // Si no hay usuario logueado, redirigir a la página de login
        window.location.href = 'login.html';
    }
});
