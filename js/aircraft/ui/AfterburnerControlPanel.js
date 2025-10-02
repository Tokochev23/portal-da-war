/**
 * Afterburner Control Panel UI - War1954 Aircraft Creator
 *
 * Interactive control panel for afterburner system with real-time
 * monitoring, thermal management display, and staged ignition controls.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

import { afterburnerController } from '../systems/AfterburnerController.js';

export class AfterburnerControlPanel {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
        this.updateInterval = null;
        this.currentAircraft = null;
        this.flightConditions = {
            altitude: 0,
            speed: 0,
            throttle: 0,
            fuelFlow: 0
        };

        this.initializePanel();
    }

    /**
     * Initialize the control panel
     */
    initializePanel() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Container ${this.containerId} not found`);
            return;
        }

        this.createPanel();
        this.startUpdateLoop();

        console.log('🔥 AfterburnerControlPanel initialized');
    }

    /**
     * Creates the main control panel structure
     */
    createPanel() {
        this.container.innerHTML = `
            <div class="afterburner-control-panel">
                <div class="panel-header">
                    <h3>🔥 Sistema Pós-Queimador</h3>
                    <div class="status-indicator" id="ab-status-indicator">
                        <span class="status-light off"></span>
                        <span id="ab-status-text">Desligado</span>
                    </div>
                </div>

                <div class="panel-content">
                    <!-- Main Controls -->
                    <div class="control-section">
                        <h4>Controles Principais</h4>
                        <div class="stage-controls">
                            <label for="ab-stage-selector">Estágio:</label>
                            <div class="stage-selector-container">
                                <input type="range" id="ab-stage-selector" min="0" max="5" value="0" step="1">
                                <div class="stage-indicators">
                                    <span class="stage-label">OFF</span>
                                    <span class="stage-label">1</span>
                                    <span class="stage-label">2</span>
                                    <span class="stage-label">3</span>
                                    <span class="stage-label">4</span>
                                    <span class="stage-label">MAX</span>
                                </div>
                            </div>
                        </div>

                        <div class="button-row">
                            <button id="ab-ignite-btn" class="control-btn ignite">🔥 Acender</button>
                            <button id="ab-shutdown-btn" class="control-btn shutdown">⭕ Desligar</button>
                            <button id="ab-emergency-btn" class="control-btn emergency">🚨 Emergência</button>
                        </div>
                    </div>

                    <!-- Performance Display -->
                    <div class="performance-section">
                        <h4>Performance</h4>
                        <div class="performance-grid">
                            <div class="metric">
                                <label>Empuxo:</label>
                                <span id="thrust-multiplier">1.00x</span>
                            </div>
                            <div class="metric">
                                <label>Consumo:</label>
                                <span id="fuel-multiplier">1.00x</span>
                            </div>
                            <div class="metric">
                                <label>Eficiência:</label>
                                <span id="ab-efficiency">100%</span>
                            </div>
                            <div class="metric">
                                <label>Bocal:</label>
                                <span id="nozzle-position">30%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Thermal Management -->
                    <div class="thermal-section">
                        <h4>Gestão Térmica</h4>
                        <div class="thermal-display">
                            <div class="temperature-gauge">
                                <label>Temperatura EGT:</label>
                                <div class="gauge-container">
                                    <div class="gauge-bar" id="temp-gauge-bar"></div>
                                    <span id="temperature-value">20°C</span>
                                </div>
                            </div>
                            <div class="thermal-stress">
                                <label>Stress Térmico:</label>
                                <div class="stress-bar">
                                    <div class="stress-fill" id="stress-fill"></div>
                                    <span id="stress-value">0%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Fuel System -->
                    <div class="fuel-section">
                        <h4>Sistema de Combustível</h4>
                        <div class="fuel-injectors">
                            <div class="injector-row">
                                ${Array.from({length: 5}, (_, i) => `
                                    <div class="injector stage-${i + 1}" id="injector-${i + 1}">
                                        <div class="injector-nozzle"></div>
                                        <span class="injector-label">S${i + 1}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="fuel-flow-display">
                                <label>Fluxo AB:</label>
                                <span id="ab-fuel-flow">0.0 kg/s</span>
                            </div>
                        </div>
                    </div>

                    <!-- Operational Limits -->
                    <div class="limits-section">
                        <h4>Limites Operacionais</h4>
                        <div class="limits-grid">
                            <div class="limit-item">
                                <label>Altitude Máx:</label>
                                <span>18,000m</span>
                            </div>
                            <div class="limit-item">
                                <label>Velocidade Mín:</label>
                                <span>200 km/h</span>
                            </div>
                            <div class="limit-item">
                                <label>Throttle Mín:</label>
                                <span>80%</span>
                            </div>
                            <div class="limit-item">
                                <label>Tempo Máx:</label>
                                <span id="operating-time">0s / 300s</span>
                            </div>
                        </div>
                    </div>

                    <!-- System Messages -->
                    <div class="messages-section">
                        <h4>Status do Sistema</h4>
                        <div class="message-display" id="system-messages">
                            <div class="message info">Sistema pronto para operação</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.applyStyles();
    }

    /**
     * Attach event listeners to controls
     */
    attachEventListeners() {
        // Stage selector
        const stageSelector = document.getElementById('ab-stage-selector');
        stageSelector?.addEventListener('input', (e) => {
            this.handleStageChange(parseInt(e.target.value));
        });

        // Control buttons
        document.getElementById('ab-ignite-btn')?.addEventListener('click', () => {
            this.handleIgnition();
        });

        document.getElementById('ab-shutdown-btn')?.addEventListener('click', () => {
            this.handleShutdown();
        });

        document.getElementById('ab-emergency-btn')?.addEventListener('click', () => {
            this.handleEmergencyShutdown();
        });
    }

    /**
     * Handle stage change
     */
    handleStageChange(targetStage) {
        if (!this.currentAircraft) {
            this.showMessage('Nenhuma aeronave selecionada', 'warning');
            return;
        }

        if (targetStage === 0) {
            this.handleShutdown();
            return;
        }

        const result = afterburnerController.activateAfterburner(
            targetStage,
            this.currentAircraft,
            this.flightConditions
        );

        if (result.success) {
            this.showMessage(`Pós-queimador ativado - Estágio ${result.stage}`, 'success');
        } else {
            this.showMessage(result.reason, 'error');
            // Reset slider to current stage
            document.getElementById('ab-stage-selector').value = afterburnerController.afterburnerStage;
        }
    }

    /**
     * Handle ignition
     */
    handleIgnition() {
        const currentStage = parseInt(document.getElementById('ab-stage-selector').value);
        if (currentStage === 0) {
            this.showMessage('Selecione um estágio primeiro', 'warning');
            return;
        }

        this.handleStageChange(currentStage);
    }

    /**
     * Handle shutdown
     */
    handleShutdown() {
        const result = afterburnerController.deactivateAfterburner();
        if (result.success) {
            this.showMessage('Pós-queimador desligado', 'info');
            document.getElementById('ab-stage-selector').value = 0;
        }
    }

    /**
     * Handle emergency shutdown
     */
    handleEmergencyShutdown() {
        afterburnerController.resetToIdle();
        document.getElementById('ab-stage-selector').value = 0;
        this.showMessage('PARADA DE EMERGÊNCIA EXECUTADA', 'emergency');
    }

    /**
     * Update display with current status
     */
    updateDisplay() {
        const status = afterburnerController.getStatus();

        // Update status indicator
        const statusIndicator = document.getElementById('ab-status-indicator');
        const statusLight = statusIndicator?.querySelector('.status-light');
        const statusText = document.getElementById('ab-status-text');

        if (statusLight && statusText) {
            statusLight.className = `status-light ${status.active ? 'on' : 'off'}`;
            statusText.textContent = status.active ? `Estágio ${status.stage}` : 'Desligado';
        }

        // Update performance metrics
        document.getElementById('thrust-multiplier').textContent = `${status.thrustMultiplier.toFixed(2)}x`;
        document.getElementById('fuel-multiplier').textContent = `${status.fuelMultiplier.toFixed(2)}x`;
        document.getElementById('ab-efficiency').textContent = `${Math.round((1/status.fuelMultiplier) * 100)}%`;
        document.getElementById('nozzle-position').textContent = `${status.nozzlePosition}%`;

        // Update thermal display
        this.updateThermalDisplay(status);

        // Update fuel injectors
        this.updateFuelInjectors(status);

        // Update operating time
        document.getElementById('operating-time').textContent = `${status.operatingTime}s / 300s`;

        // Update system messages
        this.updateSystemMessages(status);
    }

    /**
     * Update thermal display
     */
    updateThermalDisplay(status) {
        const tempGaugeBar = document.getElementById('temp-gauge-bar');
        const tempValue = document.getElementById('temperature-value');
        const stressFill = document.getElementById('stress-fill');
        const stressValue = document.getElementById('stress-value');

        if (tempGaugeBar && tempValue) {
            const tempPercent = Math.min(100, (status.temperature / 1400) * 100);
            tempGaugeBar.style.width = `${tempPercent}%`;
            tempGaugeBar.className = `gauge-bar ${this.getThermalClass(status.temperature)}`;
            tempValue.textContent = `${status.temperature}°C`;
        }

        if (stressFill && stressValue) {
            stressFill.style.width = `${status.thermalStress}%`;
            stressFill.className = `stress-fill ${this.getStressClass(status.thermalStress)}`;
            stressValue.textContent = `${status.thermalStress}%`;
        }
    }

    /**
     * Update fuel injector display
     */
    updateFuelInjectors(status) {
        for (let i = 1; i <= 5; i++) {
            const injector = document.getElementById(`injector-${i}`);
            if (injector) {
                const isActive = i <= status.stage;
                injector.className = `injector stage-${i} ${isActive ? 'active' : ''}`;
            }
        }

        // Update fuel flow
        const fuelFlowDisplay = document.getElementById('ab-fuel-flow');
        if (fuelFlowDisplay) {
            const fuelFlow = afterburnerController.fuelSystem.afterburnerFuelFlow;
            fuelFlowDisplay.textContent = `${fuelFlow.toFixed(1)} kg/s`;
        }
    }

    /**
     * Update system messages
     */
    updateSystemMessages(status) {
        const messagesContainer = document.getElementById('system-messages');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = '';

        // Add status message
        const statusMsg = document.createElement('div');
        statusMsg.className = `message ${status.active ? 'success' : 'info'}`;
        statusMsg.textContent = status.statusMessage;
        messagesContainer.appendChild(statusMsg);

        // Add fault codes if any
        status.faultCodes.forEach(fault => {
            const faultMsg = document.createElement('div');
            faultMsg.className = 'message error';
            faultMsg.textContent = `FALHA: ${fault}`;
            messagesContainer.appendChild(faultMsg);
        });
    }

    /**
     * Show system message
     */
    showMessage(text, type = 'info') {
        const messagesContainer = document.getElementById('system-messages');
        if (!messagesContainer) return;

        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;

        messagesContainer.insertBefore(message, messagesContainer.firstChild);

        // Remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 5000);
    }

    /**
     * Get thermal class for color coding
     */
    getThermalClass(temperature) {
        if (temperature < 800) return 'normal';
        if (temperature < 1200) return 'warm';
        if (temperature < 1400) return 'hot';
        return 'critical';
    }

    /**
     * Get stress class for color coding
     */
    getStressClass(stress) {
        if (stress < 50) return 'low';
        if (stress < 80) return 'medium';
        return 'high';
    }

    /**
     * Update flight conditions
     */
    updateFlightConditions(conditions) {
        this.flightConditions = { ...this.flightConditions, ...conditions };
        afterburnerController.updateConditions(this.flightConditions);
    }

    /**
     * Set current aircraft
     */
    setAircraft(aircraft) {
        this.currentAircraft = aircraft;
        afterburnerController.currentAircraft = aircraft;
    }

    /**
     * Start update loop
     */
    startUpdateLoop() {
        this.updateInterval = setInterval(() => {
            this.updateDisplay();
        }, 100); // 10Hz update rate
    }

    /**
     * Stop update loop
     */
    stopUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Apply CSS styles
     */
    applyStyles() {
        const styles = `
            .afterburner-control-panel {
                background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
                border-radius: 10px;
                padding: 20px;
                color: #fff;
                font-family: 'Courier New', monospace;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }

            .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #444;
                padding-bottom: 10px;
            }

            .status-indicator {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .status-light {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                transition: all 0.3s;
            }

            .status-light.off { background: #666; }
            .status-light.on {
                background: #ff4500;
                box-shadow: 0 0 10px #ff4500;
            }

            .control-section, .performance-section, .thermal-section,
            .fuel-section, .limits-section, .messages-section {
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(255,255,255,0.05);
                border-radius: 5px;
            }

            .stage-selector-container {
                margin: 10px 0;
            }

            .stage-indicators {
                display: flex;
                justify-content: space-between;
                margin-top: 5px;
                font-size: 12px;
            }

            .button-row {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }

            .control-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
            }

            .control-btn.ignite {
                background: #ff4500;
                color: white;
            }
            .control-btn.shutdown {
                background: #666;
                color: white;
            }
            .control-btn.emergency {
                background: #dc3545;
                color: white;
            }

            .performance-grid, .limits-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }

            .metric, .limit-item {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
            }

            .temperature-gauge, .thermal-stress {
                margin: 10px 0;
            }

            .gauge-container, .stress-bar {
                position: relative;
                background: #333;
                height: 20px;
                border-radius: 10px;
                overflow: hidden;
                margin: 5px 0;
            }

            .gauge-bar, .stress-fill {
                height: 100%;
                transition: all 0.3s;
                border-radius: 10px;
            }

            .gauge-bar.normal { background: #28a745; }
            .gauge-bar.warm { background: #ffc107; }
            .gauge-bar.hot { background: #fd7e14; }
            .gauge-bar.critical { background: #dc3545; }

            .stress-fill.low { background: #28a745; }
            .stress-fill.medium { background: #ffc107; }
            .stress-fill.high { background: #dc3545; }

            .injector-row {
                display: flex;
                justify-content: space-around;
                margin: 15px 0;
            }

            .injector {
                width: 30px;
                height: 40px;
                background: #333;
                border-radius: 5px;
                position: relative;
                transition: all 0.3s;
            }

            .injector.active {
                background: #ff4500;
                box-shadow: 0 0 10px #ff4500;
            }

            .injector-nozzle {
                width: 20px;
                height: 20px;
                background: #555;
                border-radius: 50%;
                margin: 5px auto;
            }

            .injector.active .injector-nozzle {
                background: #fff;
            }

            .injector-label {
                position: absolute;
                bottom: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 10px;
            }

            .message {
                padding: 8px 12px;
                margin: 5px 0;
                border-radius: 4px;
                font-size: 12px;
            }

            .message.info { background: #17a2b8; }
            .message.success { background: #28a745; }
            .message.warning { background: #ffc107; color: #000; }
            .message.error { background: #dc3545; }
            .message.emergency {
                background: #dc3545;
                animation: blink 1s infinite;
            }

            @keyframes blink {
                50% { opacity: 0.5; }
            }
        `;

        // Add styles to document if not already present
        if (!document.getElementById('afterburner-panel-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'afterburner-panel-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }

    /**
     * Destroy the panel
     */
    destroy() {
        this.stopUpdateLoop();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

export default AfterburnerControlPanel;