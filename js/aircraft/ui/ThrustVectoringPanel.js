/**
 * Thrust Vectoring Control Panel UI - War1954 Aircraft Creator
 *
 * Interactive control panel for thrust vectoring system with real-time
 * visualization, nozzle position display, and super-maneuver controls.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

import { thrustVectoringController } from '../systems/ThrustVectoringController.js';

export class ThrustVectoringPanel {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
        this.updateInterval = null;
        this.currentAircraft = null;
        this.joystickActive = false;
        this.joystickCenter = { x: 0, y: 0 };

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

        console.log('🎯 ThrustVectoringPanel initialized');
    }

    /**
     * Creates the main control panel structure
     */
    createPanel() {
        this.container.innerHTML = `
            <div class="thrust-vectoring-panel">
                <div class="panel-header">
                    <h3>🎯 Controle de Vetorização</h3>
                    <div class="system-status" id="tv-system-status">
                        <span class="status-light" id="tv-status-light"></span>
                        <span id="tv-status-text">Sistema Indisponível</span>
                    </div>
                </div>

                <div class="panel-content">
                    <!-- System Configuration -->
                    <div class="config-section">
                        <h4>Configuração do Sistema</h4>
                        <div class="config-grid">
                            <div class="config-item">
                                <label>Tipo:</label>
                                <span id="tv-type">Nenhum</span>
                            </div>
                            <div class="config-item">
                                <label>Deflexão Máx:</label>
                                <span id="tv-max-deflection">0°</span>
                            </div>
                            <div class="config-item">
                                <label>Tempo Resposta:</label>
                                <span id="tv-response-time">0.0s</span>
                            </div>
                            <div class="config-item">
                                <label>Autoridade:</label>
                                <span id="tv-authority">0%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Control Mode Selection -->
                    <div class="mode-section">
                        <h4>Modo de Controle</h4>
                        <div class="mode-selector">
                            <select id="tv-control-mode">
                                <option value="manual">Manual</option>
                                <option value="stability">Estabilidade</option>
                                <option value="performance">Performance</option>
                                <option value="combat">Combate</option>
                            </select>
                        </div>
                        <div class="mode-description" id="mode-description">
                            Controle manual direto pelo piloto
                        </div>
                    </div>

                    <!-- Nozzle Control -->
                    <div class="control-section">
                        <h4>Controle dos Bocais</h4>
                        <div class="joystick-container">
                            <svg class="joystick-display" id="joystick-svg" width="200" height="200">
                                <!-- Background circle -->
                                <circle cx="100" cy="100" r="90" fill="none" stroke="#333" stroke-width="2"/>
                                <circle cx="100" cy="100" r="60" fill="none" stroke="#555" stroke-width="1"/>
                                <circle cx="100" cy="100" r="30" fill="none" stroke="#555" stroke-width="1"/>

                                <!-- Crosshairs -->
                                <line x1="10" y1="100" x2="190" y2="100" stroke="#555" stroke-width="1"/>
                                <line x1="100" y1="10" x2="100" y2="190" stroke="#555" stroke-width="1"/>

                                <!-- Labels -->
                                <text x="100" y="25" text-anchor="middle" fill="#ccc" font-size="12">UP</text>
                                <text x="100" y="185" text-anchor="middle" fill="#ccc" font-size="12">DOWN</text>
                                <text x="25" y="105" text-anchor="middle" fill="#ccc" font-size="12">L</text>
                                <text x="175" y="105" text-anchor="middle" fill="#ccc" font-size="12">R</text>

                                <!-- Command position (target) -->
                                <circle id="command-position" cx="100" cy="100" r="8" fill="#ff4500" opacity="0.7"/>

                                <!-- Actual position -->
                                <circle id="actual-position" cx="100" cy="100" r="6" fill="#00ff00"/>
                            </svg>

                            <div class="joystick-controls">
                                <div class="axis-control">
                                    <label>Pitch:</label>
                                    <input type="range" id="pitch-slider" min="-20" max="20" value="0" step="0.5">
                                    <span id="pitch-value">0.0°</span>
                                </div>
                                <div class="axis-control">
                                    <label>Yaw:</label>
                                    <input type="range" id="yaw-slider" min="-20" max="20" value="0" step="0.5">
                                    <span id="yaw-value">0.0°</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Performance Display -->
                    <div class="performance-section">
                        <h4>Efeitos na Performance</h4>
                        <div class="performance-grid">
                            <div class="metric">
                                <label>Eficiência Empuxo:</label>
                                <div class="metric-bar">
                                    <div class="bar-fill efficiency" id="thrust-efficiency-bar"></div>
                                    <span id="thrust-efficiency-value">100%</span>
                                </div>
                            </div>
                            <div class="metric">
                                <label>Manobrabilidade:</label>
                                <div class="metric-bar">
                                    <div class="bar-fill maneuver" id="maneuverability-bar"></div>
                                    <span id="maneuverability-value">100%</span>
                                </div>
                            </div>
                            <div class="metric">
                                <label>Aumento Arrasto:</label>
                                <div class="metric-bar">
                                    <div class="bar-fill drag" id="drag-increase-bar"></div>
                                    <span id="drag-increase-value">0%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Super Maneuvers -->
                    <div class="maneuver-section">
                        <h4>Super Manobras</h4>
                        <div class="maneuver-buttons">
                            <button class="maneuver-btn" data-maneuver="cobra">🐍 Cobra</button>
                            <button class="maneuver-btn" data-maneuver="kulbit">🔄 Kulbit</button>
                            <button class="maneuver-btn" data-maneuver="pugachev">🎪 Pugachev</button>
                            <button class="maneuver-btn" data-maneuver="tailslide">📉 Tailslide</button>
                        </div>
                        <div class="intensity-control">
                            <label>Intensidade:</label>
                            <input type="range" id="maneuver-intensity" min="0.1" max="1.0" value="1.0" step="0.1">
                            <span id="intensity-value">100%</span>
                        </div>
                    </div>

                    <!-- System Health -->
                    <div class="health-section">
                        <h4>Saúde do Sistema</h4>
                        <div class="health-grid">
                            <div class="health-item">
                                <label>Pressão Hidráulica:</label>
                                <div class="health-bar">
                                    <div class="health-fill" id="hydraulic-health"></div>
                                    <span id="hydraulic-value">100%</span>
                                </div>
                            </div>
                            <div class="health-item">
                                <label>Atuador Pitch:</label>
                                <div class="health-bar">
                                    <div class="health-fill" id="actuator1-health"></div>
                                    <span id="actuator1-value">100%</span>
                                </div>
                            </div>
                            <div class="health-item">
                                <label>Atuador Yaw:</label>
                                <div class="health-bar">
                                    <div class="health-fill" id="actuator2-health"></div>
                                    <span id="actuator2-value">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Control Actions -->
                    <div class="action-section">
                        <div class="action-buttons">
                            <button id="tv-center-btn" class="action-btn">🎯 Centralizar</button>
                            <button id="tv-test-btn" class="action-btn">🔧 Teste Sistema</button>
                            <button id="tv-reset-btn" class="action-btn">♻️ Reset</button>
                        </div>
                    </div>

                    <!-- System Messages -->
                    <div class="messages-section">
                        <h4>Mensagens do Sistema</h4>
                        <div class="message-display" id="tv-messages">
                            <div class="message info">Sistema aguardando configuração</div>
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
        // Control mode selection
        document.getElementById('tv-control-mode')?.addEventListener('change', (e) => {
            this.handleModeChange(e.target.value);
        });

        // Pitch and yaw sliders
        document.getElementById('pitch-slider')?.addEventListener('input', (e) => {
            this.handleDeflectionChange(parseFloat(e.target.value), null);
        });

        document.getElementById('yaw-slider')?.addEventListener('input', (e) => {
            this.handleDeflectionChange(null, parseFloat(e.target.value));
        });

        // Joystick interaction
        const joystickSvg = document.getElementById('joystick-svg');
        if (joystickSvg) {
            joystickSvg.addEventListener('mousedown', (e) => this.startJoystickControl(e));
            joystickSvg.addEventListener('mousemove', (e) => this.updateJoystickControl(e));
            joystickSvg.addEventListener('mouseup', () => this.endJoystickControl());
            joystickSvg.addEventListener('mouseleave', () => this.endJoystickControl());
        }

        // Super maneuver buttons
        document.querySelectorAll('.maneuver-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const maneuver = e.target.dataset.maneuver;
                this.executeManeuver(maneuver);
            });
        });

        // Intensity slider
        document.getElementById('maneuver-intensity')?.addEventListener('input', (e) => {
            document.getElementById('intensity-value').textContent = `${Math.round(e.target.value * 100)}%`;
        });

        // Action buttons
        document.getElementById('tv-center-btn')?.addEventListener('click', () => {
            this.centerNozzles();
        });

        document.getElementById('tv-test-btn')?.addEventListener('click', () => {
            this.testSystem();
        });

        document.getElementById('tv-reset-btn')?.addEventListener('click', () => {
            this.resetSystem();
        });
    }

    /**
     * Handle control mode change
     */
    handleModeChange(mode) {
        const result = thrustVectoringController.setControlMode(mode);
        if (result.success) {
            document.getElementById('mode-description').textContent = result.description;
            this.showMessage(`Modo alterado para: ${mode}`, 'info');
        } else {
            this.showMessage(result.reason, 'error');
        }
    }

    /**
     * Handle deflection change
     */
    handleDeflectionChange(pitch, yaw) {
        const currentPitch = pitch !== null ? pitch : parseFloat(document.getElementById('pitch-slider').value);
        const currentYaw = yaw !== null ? yaw : parseFloat(document.getElementById('yaw-slider').value);

        const result = thrustVectoringController.commandDeflection(currentPitch, currentYaw);

        if (result.success) {
            // Update displays
            document.getElementById('pitch-value').textContent = `${currentPitch.toFixed(1)}°`;
            document.getElementById('yaw-value').textContent = `${currentYaw.toFixed(1)}°`;

            // Update joystick visualization
            this.updateJoystickVisualization(currentPitch, currentYaw);
        } else {
            this.showMessage(result.reason, 'error');
        }
    }

    /**
     * Joystick control methods
     */
    startJoystickControl(e) {
        this.joystickActive = true;
        this.updateJoystickFromMouse(e);
    }

    updateJoystickControl(e) {
        if (this.joystickActive) {
            this.updateJoystickFromMouse(e);
        }
    }

    endJoystickControl() {
        this.joystickActive = false;
    }

    updateJoystickFromMouse(e) {
        const svg = document.getElementById('joystick-svg');
        const rect = svg.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;

        // Convert to degrees (max deflection at edge of circle)
        const maxRadius = 90;
        const radius = Math.min(Math.sqrt(x*x + y*y), maxRadius);
        const angle = Math.atan2(y, x);

        const maxDeflection = thrustVectoringController.vectoringConfig.maxDeflection;
        const deflectionMagnitude = (radius / maxRadius) * maxDeflection;

        const pitchDeflection = -deflectionMagnitude * Math.sin(angle); // Negative for up = positive pitch
        const yawDeflection = deflectionMagnitude * Math.cos(angle);

        // Update sliders
        document.getElementById('pitch-slider').value = pitchDeflection;
        document.getElementById('yaw-slider').value = yawDeflection;

        // Update system
        this.handleDeflectionChange(pitchDeflection, yawDeflection);
    }

    /**
     * Update joystick visualization
     */
    updateJoystickVisualization(pitch, yaw) {
        const maxDeflection = thrustVectoringController.vectoringConfig.maxDeflection || 20;

        // Convert deflections to SVG coordinates
        const centerX = 100;
        const centerY = 100;
        const maxRadius = 90;

        const radiusScale = maxRadius / maxDeflection;
        const commandX = centerX + yaw * radiusScale;
        const commandY = centerY - pitch * radiusScale; // Negative for up = positive pitch

        // Update command position
        const commandPos = document.getElementById('command-position');
        if (commandPos) {
            commandPos.setAttribute('cx', commandX);
            commandPos.setAttribute('cy', commandY);
        }

        // Update actual position (with some lag simulation)
        const status = thrustVectoringController.getStatus();
        const actualX = centerX + status.deflections.actualYaw * radiusScale;
        const actualY = centerY - status.deflections.actualPitch * radiusScale;

        const actualPos = document.getElementById('actual-position');
        if (actualPos) {
            actualPos.setAttribute('cx', actualX);
            actualPos.setAttribute('cy', actualY);
        }
    }

    /**
     * Execute super maneuver
     */
    executeManeuver(maneuverType) {
        const intensity = parseFloat(document.getElementById('maneuver-intensity').value);
        const result = thrustVectoringController.executeSuperManeuver(maneuverType, intensity);

        if (result.success) {
            this.showMessage(`Executando manobra: ${maneuverType}`, 'success');
            // Update displays
            document.getElementById('pitch-slider').value = result.targetPitch || 0;
            document.getElementById('yaw-slider').value = result.targetYaw || 0;
        } else {
            this.showMessage(result.reason, 'error');
        }
    }

    /**
     * Center nozzles
     */
    centerNozzles() {
        document.getElementById('pitch-slider').value = 0;
        document.getElementById('yaw-slider').value = 0;
        this.handleDeflectionChange(0, 0);
        this.showMessage('Bocais centralizados', 'info');
    }

    /**
     * Test system
     */
    testSystem() {
        this.showMessage('Executando teste de sistema...', 'info');

        // Simple test sequence
        setTimeout(() => {
            this.handleDeflectionChange(10, 0);
            setTimeout(() => {
                this.handleDeflectionChange(-10, 0);
                setTimeout(() => {
                    this.handleDeflectionChange(0, 10);
                    setTimeout(() => {
                        this.handleDeflectionChange(0, -10);
                        setTimeout(() => {
                            this.centerNozzles();
                            this.showMessage('Teste de sistema concluído', 'success');
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }

    /**
     * Reset system
     */
    resetSystem() {
        thrustVectoringController.resetToNeutral();
        this.centerNozzles();
        this.showMessage('Sistema resetado', 'info');
    }

    /**
     * Update display with current status
     */
    updateDisplay() {
        const status = thrustVectoringController.getStatus();

        // Update system status
        const statusLight = document.getElementById('tv-status-light');
        const statusText = document.getElementById('tv-status-text');

        if (statusLight && statusText) {
            if (status.available && status.canOperate) {
                statusLight.className = 'status-light operational';
                statusText.textContent = 'Operacional';
            } else if (status.available) {
                statusLight.className = 'status-light warning';
                statusText.textContent = 'Disponível';
            } else {
                statusLight.className = 'status-light off';
                statusText.textContent = 'Indisponível';
            }
        }

        // Update configuration display
        document.getElementById('tv-type').textContent = status.type.toUpperCase();
        document.getElementById('tv-max-deflection').textContent = `${status.deflections.maxDeflection}°`;
        document.getElementById('tv-response-time').textContent = `${thrustVectoringController.vectoringConfig.responseTime}s`;
        document.getElementById('tv-authority').textContent = `${Math.round(thrustVectoringController.vectoringConfig.authority * 100)}%`;

        // Update performance metrics
        this.updatePerformanceDisplay(status);

        // Update health display
        this.updateHealthDisplay(status);

        // Update joystick visualization
        this.updateJoystickVisualization(
            status.deflections.actualPitch,
            status.deflections.actualYaw
        );
    }

    /**
     * Update performance display
     */
    updatePerformanceDisplay(status) {
        // Thrust efficiency
        const efficiencyPercent = Math.round(status.performance.thrustEfficiency * 100);
        const efficiencyBar = document.getElementById('thrust-efficiency-bar');
        const efficiencyValue = document.getElementById('thrust-efficiency-value');

        if (efficiencyBar && efficiencyValue) {
            efficiencyBar.style.width = `${efficiencyPercent}%`;
            efficiencyValue.textContent = `${efficiencyPercent}%`;
        }

        // Maneuverability
        const maneuverPercent = Math.round(status.performance.maneuverability * 100);
        const maneuverBar = document.getElementById('maneuverability-bar');
        const maneuverValue = document.getElementById('maneuverability-value');

        if (maneuverBar && maneuverValue) {
            maneuverBar.style.width = `${Math.min(200, maneuverPercent)}%`;
            maneuverValue.textContent = `${maneuverPercent}%`;
        }

        // Drag increase
        const dragPercent = Math.round(status.performance.dragIncrease * 100);
        const dragBar = document.getElementById('drag-increase-bar');
        const dragValue = document.getElementById('drag-increase-value');

        if (dragBar && dragValue) {
            dragBar.style.width = `${Math.min(100, dragPercent)}%`;
            dragValue.textContent = `${dragPercent}%`;
        }
    }

    /**
     * Update health display
     */
    updateHealthDisplay(status) {
        // Hydraulic pressure
        const hydraulicBar = document.getElementById('hydraulic-health');
        const hydraulicValue = document.getElementById('hydraulic-value');

        if (hydraulicBar && hydraulicValue) {
            hydraulicBar.style.width = `${status.systemHealth.hydraulicPressure}%`;
            hydraulicBar.className = `health-fill ${this.getHealthClass(status.systemHealth.hydraulicPressure)}`;
            hydraulicValue.textContent = `${status.systemHealth.hydraulicPressure}%`;
        }

        // Actuator health
        status.systemHealth.actuatorHealth.forEach((health, index) => {
            const bar = document.getElementById(`actuator${index + 1}-health`);
            const value = document.getElementById(`actuator${index + 1}-value`);

            if (bar && value) {
                bar.style.width = `${health}%`;
                bar.className = `health-fill ${this.getHealthClass(health)}`;
                value.textContent = `${health}%`;
            }
        });
    }

    /**
     * Get health class for color coding
     */
    getHealthClass(percentage) {
        if (percentage >= 80) return 'good';
        if (percentage >= 60) return 'warning';
        return 'critical';
    }

    /**
     * Show system message
     */
    showMessage(text, type = 'info') {
        const messagesContainer = document.getElementById('tv-messages');
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
     * Set current aircraft and configure system
     */
    setAircraft(aircraft, techLevel = 50) {
        this.currentAircraft = aircraft;
        thrustVectoringController.configureSystem(aircraft, techLevel);

        const status = thrustVectoringController.getStatus();
        if (status.available) {
            this.showMessage(`Sistema configurado: ${status.type}`, 'success');
        } else {
            this.showMessage('Aeronave não possui vetorização de empuxo', 'warning');
        }
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
            .thrust-vectoring-panel {
                background: linear-gradient(145deg, #1a1a2e, #16213e);
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

            .system-status {
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
            .status-light.warning { background: #ffc107; box-shadow: 0 0 10px #ffc107; }
            .status-light.operational { background: #28a745; box-shadow: 0 0 10px #28a745; }

            .config-section, .mode-section, .control-section,
            .performance-section, .maneuver-section,
            .health-section, .action-section, .messages-section {
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(255,255,255,0.05);
                border-radius: 5px;
            }

            .config-grid, .health-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }

            .config-item, .health-item {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
            }

            .joystick-container {
                display: flex;
                gap: 20px;
                align-items: center;
            }

            .joystick-display {
                background: #000;
                border-radius: 10px;
                border: 2px solid #444;
            }

            .joystick-controls {
                flex: 1;
            }

            .axis-control {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }

            .axis-control label {
                min-width: 40px;
            }

            .axis-control input[type="range"] {
                flex: 1;
            }

            .axis-control span {
                min-width: 50px;
                text-align: right;
            }

            .performance-grid {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .metric {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .metric label {
                min-width: 120px;
            }

            .metric-bar, .health-bar {
                position: relative;
                background: #333;
                height: 20px;
                border-radius: 10px;
                overflow: hidden;
                flex: 1;
                margin-right: 10px;
            }

            .bar-fill, .health-fill {
                height: 100%;
                transition: all 0.3s;
                border-radius: 10px;
            }

            .bar-fill.efficiency { background: #17a2b8; }
            .bar-fill.maneuver { background: #28a745; }
            .bar-fill.drag { background: #dc3545; }

            .health-fill.good { background: #28a745; }
            .health-fill.warning { background: #ffc107; }
            .health-fill.critical { background: #dc3545; }

            .maneuver-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 15px;
            }

            .maneuver-btn {
                padding: 10px;
                border: none;
                border-radius: 5px;
                background: #6f42c1;
                color: white;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
            }

            .maneuver-btn:hover {
                background: #8a63d4;
                transform: translateY(-2px);
            }

            .maneuver-btn:disabled {
                background: #666;
                cursor: not-allowed;
                transform: none;
            }

            .intensity-control {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .action-buttons {
                display: flex;
                gap: 10px;
            }

            .action-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 5px;
                background: #6c757d;
                color: white;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
            }

            .action-btn:hover {
                background: #5a6268;
                transform: translateY(-1px);
            }

            .mode-selector select {
                padding: 8px;
                border-radius: 5px;
                background: #333;
                color: white;
                border: 1px solid #555;
                width: 100%;
            }

            .mode-description {
                margin-top: 10px;
                padding: 10px;
                background: rgba(255,255,255,0.1);
                border-radius: 5px;
                font-style: italic;
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

            input[type="range"] {
                width: 100%;
                height: 5px;
                border-radius: 5px;
                background: #333;
                outline: none;
            }

            input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background: #007bff;
                cursor: pointer;
            }

            input[type="range"]::-moz-range-thumb {
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background: #007bff;
                cursor: pointer;
                border: none;
            }
        `;

        // Add styles to document if not already present
        if (!document.getElementById('thrust-vectoring-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'thrust-vectoring-styles';
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

export default ThrustVectoringPanel;