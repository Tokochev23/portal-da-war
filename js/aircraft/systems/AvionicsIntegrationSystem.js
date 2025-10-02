/**
 * Avionics Integration System - War1954 Aircraft Creator
 *
 * Advanced system that manages complex interactions between avionics components,
 * handles system dependencies, power management, and performance effects.
 * Simulates realistic 1954-era avionics with emerging jet-age technology.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

import { AvionicsComponent } from '../components/AvionicsComponent.js';

export class AvionicsIntegrationSystem {
    constructor() {
        this.initialized = false;

        // System dependency mapping
        this.systemDependencies = {
            // Fire control systems need radar for targeting
            fire_control_lead_computing: ['radar_intercept_x_band', 'radar_search_s_band'],
            fire_control_ballistic_computer: ['radar_intercept_x_band'],

            // Advanced autopilot needs navigation and flight control
            autopilot_three_axis: ['navigation_gyroscopic', 'flight_control_hydraulic'],
            autopilot_coupled_approach: ['navigation_precision', 'flight_control_powered'],

            // Data link systems need communication
            datalink_tactical: ['communication_uhf_secure', 'navigation_precision'],

            // ECM systems need power and cooling
            ecm_active_jamming: ['power_generator_heavy_duty', 'cooling_system_advanced'],

            // Precision navigation needs stable platform
            navigation_inertial: ['gyroscope_platform_stabilized'],
            navigation_doppler: ['radar_navigation'],
        };

        // System conflicts (mutually exclusive)
        this.systemConflicts = {
            // Different radar types conflict
            radar_intercept_x_band: ['radar_intercept_s_band'],
            radar_search_s_band: ['radar_search_x_band'],

            // Different navigation systems conflict
            navigation_manual: ['navigation_inertial'],
            navigation_basic: ['navigation_precision'],

            // Power systems conflict
            power_generator_standard: ['power_generator_heavy_duty'],

            // Communication frequency conflicts
            communication_hf: ['communication_uhf_secure'],
        };

        // System synergies (work better together)
        this.systemSynergies = {
            radar_intercept_x_band: {
                fire_control_lead_computing: { accuracyBonus: 0.3, rangeBonus: 0.2 },
                autopilot_coupled_approach: { precisionBonus: 0.25 }
            },
            navigation_inertial: {
                autopilot_three_axis: { stabilityBonus: 0.4 },
                fire_control_ballistic_computer: { accuracyBonus: 0.2 }
            },
            communication_uhf_secure: {
                datalink_tactical: { rangeBonus: 0.5, reliabilityBonus: 0.3 }
            },
            ecm_passive_warning: {
                ecm_active_jamming: { effectivenessBonus: 0.4 }
            }
        };

        // Power bus architecture
        this.powerSystems = {
            primary_bus: {
                voltage: 28,          // Volts DC
                capacity: 10,         // kW
                priority: 'essential',
                systems: []
            },
            secondary_bus: {
                voltage: 115,         // Volts AC
                capacity: 5,          // kW
                priority: 'normal',
                systems: []
            },
            battery_backup: {
                voltage: 24,          // Volts DC
                capacity: 2,          // kW
                duration: 30,         // minutes
                systems: []
            }
        };

        // Cooling system management
        this.coolingRequirements = {
            ambient_air: {
                capacity: 5,          // kW thermal
                systems: []
            },
            forced_air: {
                capacity: 15,         // kW thermal
                systems: []
            },
            liquid_cooling: {
                capacity: 30,         // kW thermal
                systems: []
            }
        };

        // Technology eras and availability
        this.technologyEras = {
            early_1940s: {
                available_tech: ['vacuum_tubes', 'analog_computers_basic', 'mechanical_systems'],
                max_complexity: 3,
                reliability_factor: 0.7
            },
            late_1940s: {
                available_tech: ['vacuum_tubes', 'analog_computers_advanced', 'early_transistors'],
                max_complexity: 5,
                reliability_factor: 0.8
            },
            early_1950s: {
                available_tech: ['transistors', 'analog_computers_advanced', 'early_digital'],
                max_complexity: 7,
                reliability_factor: 0.85
            },
            mid_1950s: {
                available_tech: ['transistors', 'digital_computers_basic', 'integrated_systems'],
                max_complexity: 9,
                reliability_factor: 0.9
            }
        };

        console.log('🔌 AvionicsIntegrationSystem initialized');
    }

    /**
     * Integrates avionics systems for an aircraft
     * @param {Object} aircraft - Aircraft entity
     * @returns {AvionicsComponent} Integrated avionics component
     */
    integrateAvionicsSystems(aircraft) {
        const avionics = new AvionicsComponent();

        try {
            // Install systems from aircraft configuration
            if (aircraft.avionics && aircraft.avionics.length > 0) {
                aircraft.avionics.forEach(systemId => {
                    this.installSystemWithValidation(avionics, systemId);
                });
            }

            // Analyze system integration
            this.analyzeSystemIntegration(avionics);

            // Calculate power requirements
            this.calculatePowerRequirements(avionics, aircraft);

            // Calculate cooling requirements
            this.calculateCoolingRequirements(avionics);

            // Apply system synergies
            this.applySynergies(avionics);

            // Validate system compatibility
            this.validateSystemCompatibility(avionics, aircraft);

            // Generate integration report
            const integrationReport = this.generateIntegrationReport(avionics, aircraft);

            // Store integration data
            avionics.integrationReport = integrationReport;

            console.log('✅ Avionics integration completed');

        } catch (error) {
            console.error('❌ Avionics integration failed:', error);
            avionics.integrationError = error.message;
        }

        return avionics;
    }

    /**
     * Installs a system with full validation
     */
    installSystemWithValidation(avionics, systemId) {
        const systemData = this.getSystemData(systemId);
        if (!systemData) {
            console.warn(`⚠️ System data not found: ${systemId}`);
            return false;
        }

        // Determine system type
        const systemType = this.determineSystemType(systemData);

        // Check technology requirements
        if (!this.checkTechnologyRequirements(systemData)) {
            console.warn(`⚠️ Technology requirements not met for ${systemId}`);
            return false;
        }

        // Check dependencies
        const dependencies = this.systemDependencies[systemId] || [];
        for (const dependency of dependencies) {
            if (!avionics.installedSystems.includes(dependency)) {
                console.warn(`⚠️ Missing dependency: ${systemId} requires ${dependency}`);

                // Try to auto-install basic dependencies
                if (this.canAutoInstallDependency(dependency)) {
                    console.log(`🔧 Auto-installing dependency: ${dependency}`);
                    this.installSystemWithValidation(avionics, dependency);
                } else {
                    return false;
                }
            }
        }

        // Check conflicts
        const conflicts = this.systemConflicts[systemId] || [];
        for (const conflict of conflicts) {
            if (avionics.installedSystems.includes(conflict)) {
                console.warn(`❌ Conflict detected: ${systemId} conflicts with ${conflict}`);
                return false;
            }
        }

        // Install the system
        return avionics.installSystem(systemId, systemType);
    }

    /**
     * Determines system type from system data
     */
    determineSystemType(systemData) {
        const typeMapping = {
            radar: ['radar', 'search', 'intercept', 'navigation_radar'],
            navigation: ['navigation', 'compass', 'gyroscope', 'inertial'],
            communication: ['communication', 'radio', 'uhf', 'vhf', 'hf'],
            flightControl: ['flight_control', 'autopilot', 'stability'],
            fireControl: ['fire_control', 'gunsight', 'ballistic', 'targeting'],
            countermeasures: ['ecm', 'eccm', 'chaff', 'jamming', 'warning'],
            autopilot: ['autopilot', 'coupled', 'three_axis'],
            instruments: ['instruments', 'display', 'indicator', 'gauge']
        };

        for (const [type, keywords] of Object.entries(typeMapping)) {
            if (keywords.some(keyword =>
                systemData.type?.toLowerCase().includes(keyword) ||
                systemData.name?.toLowerCase().includes(keyword)
            )) {
                return type;
            }
        }

        return 'instruments'; // Default type
    }

    /**
     * Checks if technology requirements are met
     */
    checkTechnologyRequirements(systemData) {
        const currentYear = window.currentUserCountry?.year || 1954;
        const techLevel = window.currentUserCountry?.aircraftTech || 50;

        // Check year requirements
        if (systemData.year_introduced && currentYear < systemData.year_introduced) {
            return false;
        }

        // Check tech level requirements
        if (systemData.tech_level && techLevel < systemData.tech_level) {
            return false;
        }

        // Check era-specific technology
        const currentEra = this.getCurrentTechnologyEra(currentYear);
        if (systemData.required_technology) {
            const availableTech = this.technologyEras[currentEra]?.available_tech || [];
            for (const requiredTech of systemData.required_technology) {
                if (!availableTech.includes(requiredTech)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Checks if a dependency can be auto-installed
     */
    canAutoInstallDependency(systemId) {
        const basicSystems = [
            'power_generator_standard',
            'cooling_system_basic',
            'communication_vhf_basic',
            'navigation_compass_basic'
        ];

        return basicSystems.includes(systemId);
    }

    /**
     * Analyzes overall system integration
     */
    analyzeSystemIntegration(avionics) {
        // Calculate integration complexity
        const systemCount = avionics.installedSystems.length;
        const complexityScore = this.calculateIntegrationComplexity(avionics);

        // Check for integration issues
        const issues = this.identifyIntegrationIssues(avionics);

        // Calculate integration efficiency
        const efficiency = this.calculateIntegrationEfficiency(avionics);

        avionics.integrationAnalysis = {
            systemCount,
            complexityScore,
            issues,
            efficiency,
            overallRating: this.calculateOverallIntegrationRating(complexityScore, issues.length, efficiency)
        };

        console.log(`🔍 Integration analysis: ${systemCount} systems, complexity ${complexityScore}`);
    }

    /**
     * Calculates integration complexity score
     */
    calculateIntegrationComplexity(avionics) {
        let complexity = 0;

        // Base complexity from number of systems
        complexity += avionics.installedSystems.length * 2;

        // Additional complexity from dependencies
        avionics.installedSystems.forEach(systemId => {
            const dependencies = this.systemDependencies[systemId] || [];
            complexity += dependencies.length;

            // Advanced systems add more complexity
            const systemData = this.getSystemData(systemId);
            if (systemData?.tech_level > 60) {
                complexity += 3;
            }
        });

        // Complexity from system interactions
        const interactionCount = this.countSystemInteractions(avionics);
        complexity += interactionCount * 1.5;

        return Math.round(complexity);
    }

    /**
     * Identifies integration issues
     */
    identifyIntegrationIssues(avionics) {
        const issues = [];

        // Power overload issues
        if (avionics.powerRequirements.totalPowerDraw > this.getTotalPowerCapacity()) {
            issues.push({
                type: 'power_overload',
                severity: 'critical',
                description: 'Total power draw exceeds generator capacity',
                recommendation: 'Install higher capacity generator or reduce power-hungry systems'
            });
        }

        // Cooling issues
        if (avionics.physicalCharacteristics.coolingRequirement > this.getTotalCoolingCapacity()) {
            issues.push({
                type: 'cooling_overload',
                severity: 'warning',
                description: 'Heat generation exceeds cooling capacity',
                recommendation: 'Install additional cooling systems or reduce heat-generating equipment'
            });
        }

        // Weight and balance issues
        if (avionics.physicalCharacteristics.totalWeight > 500) { // 500kg limit for 1954 aircraft
            issues.push({
                type: 'excessive_weight',
                severity: 'warning',
                description: 'Avionics weight may affect aircraft performance',
                recommendation: 'Consider lighter alternatives or reduce system count'
            });
        }

        // Reliability issues
        if (avionics.reliability.overallMTBF < 100) {
            issues.push({
                type: 'poor_reliability',
                severity: 'warning',
                description: 'System reliability below acceptable levels',
                recommendation: 'Add redundant systems or improve maintenance procedures'
            });
        }

        // Technology compatibility issues
        const techCompatibilityIssues = this.checkTechnologyCompatibility(avionics);
        issues.push(...techCompatibilityIssues);

        return issues;
    }

    /**
     * Calculates integration efficiency
     */
    calculateIntegrationEfficiency(avionics) {
        let efficiency = 100;

        // Reduce efficiency for excessive complexity
        if (avionics.integrationAnalysis?.complexityScore > 20) {
            efficiency -= (avionics.integrationAnalysis.complexityScore - 20) * 2;
        }

        // Reduce efficiency for missing synergies
        const potentialSynergies = this.countPotentialSynergies(avionics);
        const actualSynergies = this.countActualSynergies(avionics);
        if (potentialSynergies > 0) {
            const synergyRatio = actualSynergies / potentialSynergies;
            efficiency *= synergyRatio;
        }

        // Reduce efficiency for conflicts
        const conflictPenalty = this.calculateConflictPenalty(avionics);
        efficiency -= conflictPenalty;

        return Math.max(0, Math.min(100, efficiency));
    }

    /**
     * Calculates power requirements and distribution
     */
    calculatePowerRequirements(avionics, aircraft) {
        // Reset power systems
        Object.values(this.powerSystems).forEach(bus => {
            bus.systems = [];
        });

        let totalPowerDraw = 0;

        avionics.installedSystems.forEach(systemId => {
            const systemData = this.getSystemData(systemId);
            if (systemData && systemData.powerDraw) {
                totalPowerDraw += systemData.powerDraw;

                // Assign to appropriate power bus
                const powerBus = this.assignToPowerBus(systemData);
                this.powerSystems[powerBus].systems.push(systemId);
            }
        });

        // Calculate generator requirements
        const requiredGeneratorCapacity = totalPowerDraw * 1.3; // 30% margin

        // Update avionics power requirements
        avionics.powerRequirements.totalPowerDraw = totalPowerDraw;
        avionics.powerRequirements.generatorCapacity = requiredGeneratorCapacity;
        avionics.powerRequirements.primaryBusPower = this.calculateBusPower('primary_bus');
        avionics.powerRequirements.secondaryBusPower = this.calculateBusPower('secondary_bus');

        // Calculate battery backup time
        const essentialPower = this.calculateEssentialPower();
        avionics.powerRequirements.batteryBackupTime =
            essentialPower > 0 ? (this.powerSystems.battery_backup.capacity * 60) / essentialPower : 0;

        console.log(`⚡ Power requirements: ${totalPowerDraw.toFixed(1)}kW total`);
    }

    /**
     * Assigns system to appropriate power bus based on criticality
     */
    assignToPowerBus(systemData) {
        const criticalSystems = ['navigation', 'flight_control', 'communication_emergency'];
        const normalSystems = ['radar', 'fire_control', 'autopilot'];

        if (criticalSystems.some(type => systemData.type?.includes(type))) {
            return 'primary_bus';
        } else if (normalSystems.some(type => systemData.type?.includes(type))) {
            return 'secondary_bus';
        } else {
            return 'secondary_bus'; // Default to secondary
        }
    }

    /**
     * Calculates cooling requirements
     */
    calculateCoolingRequirements(avionics) {
        // Reset cooling systems
        Object.values(this.coolingRequirements).forEach(system => {
            system.systems = [];
        });

        let totalHeatGeneration = 0;

        avionics.installedSystems.forEach(systemId => {
            const systemData = this.getSystemData(systemId);
            if (systemData && systemData.heatGeneration) {
                totalHeatGeneration += systemData.heatGeneration;

                // Assign to appropriate cooling system
                const coolingSystem = this.assignToCoolingSystem(systemData);
                this.coolingRequirements[coolingSystem].systems.push(systemId);
            }
        });

        avionics.physicalCharacteristics.coolingRequirement = totalHeatGeneration;

        console.log(`🌡️ Cooling requirements: ${totalHeatGeneration.toFixed(1)}kW thermal`);
    }

    /**
     * Assigns system to appropriate cooling system
     */
    assignToCoolingSystem(systemData) {
        const heatGeneration = systemData.heatGeneration || 0;

        if (heatGeneration > 5) {
            return 'liquid_cooling';
        } else if (heatGeneration > 1) {
            return 'forced_air';
        } else {
            return 'ambient_air';
        }
    }

    /**
     * Applies synergistic effects between systems
     */
    applySynergies(avionics) {
        let totalSynergyBonus = 0;

        avionics.installedSystems.forEach(systemId => {
            const synergies = this.systemSynergies[systemId];
            if (synergies) {
                Object.keys(synergies).forEach(partnerSystemId => {
                    if (avionics.installedSystems.includes(partnerSystemId)) {
                        const synergyEffect = synergies[partnerSystemId];

                        // Apply synergy bonuses
                        if (synergyEffect.accuracyBonus) {
                            avionics.performanceModifiers.weaponAccuracy += synergyEffect.accuracyBonus;
                            totalSynergyBonus += synergyEffect.accuracyBonus;
                        }

                        if (synergyEffect.rangeBonus) {
                            avionics.performanceModifiers.communicationRange += synergyEffect.rangeBonus;
                            totalSynergyBonus += synergyEffect.rangeBonus;
                        }

                        if (synergyEffect.precisionBonus) {
                            avionics.performanceModifiers.navigationAccuracy += synergyEffect.precisionBonus;
                            totalSynergyBonus += synergyEffect.precisionBonus;
                        }

                        console.log(`🔗 Synergy applied: ${systemId} + ${partnerSystemId}`);
                    }
                });
            }
        });

        console.log(`✨ Total synergy bonus: ${totalSynergyBonus.toFixed(2)}`);
    }

    /**
     * Validates system compatibility with aircraft
     */
    validateSystemCompatibility(avionics, aircraft) {
        const compatibilityIssues = [];

        // Check aircraft category compatibility
        const aircraftCategory = aircraft.category || 'fighter';

        avionics.installedSystems.forEach(systemId => {
            const systemData = this.getSystemData(systemId);
            if (systemData && systemData.incompatible_aircraft) {
                if (systemData.incompatible_aircraft.includes(aircraftCategory)) {
                    compatibilityIssues.push({
                        systemId,
                        issue: `System not compatible with ${aircraftCategory} aircraft`,
                        severity: 'warning'
                    });
                }
            }
        });

        // Check size constraints
        const aircraftSize = aircraft.structure?.size || 'medium';
        const sizeConstraints = {
            light: { maxWeight: 200, maxVolume: 2 },
            medium: { maxWeight: 500, maxVolume: 5 },
            heavy: { maxWeight: 1000, maxVolume: 10 },
            super_heavy: { maxWeight: 2000, maxVolume: 20 }
        };

        const constraints = sizeConstraints[aircraftSize];
        if (constraints) {
            if (avionics.physicalCharacteristics.totalWeight > constraints.maxWeight) {
                compatibilityIssues.push({
                    issue: `Avionics weight (${avionics.physicalCharacteristics.totalWeight}kg) exceeds ${aircraftSize} aircraft limit (${constraints.maxWeight}kg)`,
                    severity: 'error'
                });
            }

            if (avionics.physicalCharacteristics.totalVolume > constraints.maxVolume) {
                compatibilityIssues.push({
                    issue: `Avionics volume (${avionics.physicalCharacteristics.totalVolume}m³) exceeds ${aircraftSize} aircraft limit (${constraints.maxVolume}m³)`,
                    severity: 'error'
                });
            }
        }

        avionics.compatibilityIssues = compatibilityIssues;

        if (compatibilityIssues.length > 0) {
            console.warn(`⚠️ Found ${compatibilityIssues.length} compatibility issues`);
        }
    }

    /**
     * Generates comprehensive integration report
     */
    generateIntegrationReport(avionics, aircraft) {
        return {
            summary: {
                totalSystems: avionics.installedSystems.length,
                totalWeight: avionics.physicalCharacteristics.totalWeight,
                totalPowerDraw: avionics.powerRequirements.totalPowerDraw,
                complexityScore: avionics.integrationAnalysis?.complexityScore || 0,
                efficiency: avionics.integrationAnalysis?.efficiency || 0,
                overallRating: avionics.integrationAnalysis?.overallRating || 0
            },
            powerAnalysis: {
                primaryBusLoad: this.calculateBusPower('primary_bus'),
                secondaryBusLoad: this.calculateBusPower('secondary_bus'),
                batteryBackupTime: avionics.powerRequirements.batteryBackupTime,
                powerMargin: this.calculatePowerMargin(avionics)
            },
            coolingAnalysis: {
                totalHeatGeneration: avionics.physicalCharacteristics.coolingRequirement,
                coolingCapacity: this.getTotalCoolingCapacity(),
                coolingMargin: this.calculateCoolingMargin(avionics)
            },
            systemInteractions: {
                dependencies: this.mapSystemDependencies(avionics),
                conflicts: this.mapSystemConflicts(avionics),
                synergies: this.mapSystemSynergies(avionics)
            },
            recommendations: this.generateSystemRecommendations(avionics, aircraft),
            issues: avionics.integrationAnalysis?.issues || [],
            timestamp: Date.now()
        };
    }

    /**
     * Generates system recommendations for optimization
     */
    generateSystemRecommendations(avionics, aircraft) {
        const recommendations = [];

        // Power optimization recommendations
        if (avionics.powerRequirements.totalPowerDraw > this.getTotalPowerCapacity() * 0.8) {
            recommendations.push({
                type: 'power_optimization',
                priority: 'high',
                title: 'Otimizar Consumo de Energia',
                description: 'Consumo de energia próximo do limite',
                suggestions: [
                    'Instalar gerador de maior capacidade',
                    'Substituir sistemas por versões mais eficientes',
                    'Implementar gerenciamento inteligente de energia'
                ]
            });
        }

        // Reliability recommendations
        if (avionics.reliability.overallMTBF < 200) {
            recommendations.push({
                type: 'reliability',
                priority: 'medium',
                title: 'Melhorar Confiabilidade',
                description: 'Confiabilidade do sistema abaixo do ideal',
                suggestions: [
                    'Adicionar sistemas redundantes críticos',
                    'Implementar programa de manutenção preventiva',
                    'Substituir componentes menos confiáveis'
                ]
            });
        }

        // Integration efficiency recommendations
        if (avionics.integrationAnalysis?.efficiency < 70) {
            recommendations.push({
                type: 'integration',
                priority: 'medium',
                title: 'Otimizar Integração',
                description: 'Eficiência de integração pode ser melhorada',
                suggestions: [
                    'Explorar sinergias entre sistemas',
                    'Simplificar arquitetura de sistemas',
                    'Reduzir dependências desnecessárias'
                ]
            });
        }

        // Role-specific recommendations
        const roleRecommendations = avionics.getInstallationRecommendations(
            aircraft.category || 'fighter',
            aircraft.primaryRole || 'multi_role'
        );
        recommendations.push(...roleRecommendations);

        return recommendations;
    }

    // ===== UTILITY METHODS =====

    getCurrentTechnologyEra(year) {
        if (year < 1945) return 'early_1940s';
        if (year < 1950) return 'late_1940s';
        if (year < 1955) return 'early_1950s';
        return 'mid_1950s';
    }

    getTotalPowerCapacity() {
        return Object.values(this.powerSystems).reduce((total, bus) => total + bus.capacity, 0);
    }

    getTotalCoolingCapacity() {
        return Object.values(this.coolingRequirements).reduce((total, system) => total + system.capacity, 0);
    }

    calculateBusPower(busName) {
        const bus = this.powerSystems[busName];
        if (!bus) return 0;

        return bus.systems.reduce((total, systemId) => {
            const systemData = this.getSystemData(systemId);
            return total + (systemData?.powerDraw || 0);
        }, 0);
    }

    calculateEssentialPower() {
        return this.calculateBusPower('primary_bus');
    }

    calculatePowerMargin(avionics) {
        const totalCapacity = this.getTotalPowerCapacity();
        const totalDraw = avionics.powerRequirements.totalPowerDraw;
        return totalCapacity > 0 ? ((totalCapacity - totalDraw) / totalCapacity) * 100 : 0;
    }

    calculateCoolingMargin(avionics) {
        const totalCapacity = this.getTotalCoolingCapacity();
        const totalHeat = avionics.physicalCharacteristics.coolingRequirement;
        return totalCapacity > 0 ? ((totalCapacity - totalHeat) / totalCapacity) * 100 : 0;
    }

    countSystemInteractions(avionics) {
        let interactions = 0;

        avionics.installedSystems.forEach(systemId => {
            const dependencies = this.systemDependencies[systemId] || [];
            const conflicts = this.systemConflicts[systemId] || [];
            const synergies = Object.keys(this.systemSynergies[systemId] || {});

            interactions += dependencies.length + conflicts.length + synergies.length;
        });

        return interactions;
    }

    countPotentialSynergies(avionics) {
        let potential = 0;

        avionics.installedSystems.forEach(systemId => {
            const synergies = this.systemSynergies[systemId];
            if (synergies) {
                potential += Object.keys(synergies).length;
            }
        });

        return potential;
    }

    countActualSynergies(avionics) {
        let actual = 0;

        avionics.installedSystems.forEach(systemId => {
            const synergies = this.systemSynergies[systemId];
            if (synergies) {
                Object.keys(synergies).forEach(partnerSystemId => {
                    if (avionics.installedSystems.includes(partnerSystemId)) {
                        actual++;
                    }
                });
            }
        });

        return actual;
    }

    calculateConflictPenalty(avionics) {
        // Implementation would check for any unresolved conflicts
        return 0; // Simplified for now
    }

    calculateOverallIntegrationRating(complexity, issueCount, efficiency) {
        let rating = 100;

        // Penalize high complexity
        rating -= Math.max(0, complexity - 10) * 2;

        // Penalize issues
        rating -= issueCount * 10;

        // Factor in efficiency
        rating = rating * (efficiency / 100);

        return Math.max(0, Math.min(100, rating));
    }

    checkTechnologyCompatibility(avionics) {
        const issues = [];

        // Check for technology mix issues
        const techTypes = avionics.installedSystems.map(systemId => {
            const systemData = this.getSystemData(systemId);
            return systemData?.technology_type;
        }).filter(type => type);

        // Warning if mixing too many technology types
        const uniqueTechTypes = [...new Set(techTypes)];
        if (uniqueTechTypes.length > 3) {
            issues.push({
                type: 'technology_mix',
                severity: 'warning',
                description: 'Mixing many different technology types may cause integration issues',
                recommendation: 'Consider standardizing on fewer technology platforms'
            });
        }

        return issues;
    }

    mapSystemDependencies(avionics) {
        const dependencies = {};

        avionics.installedSystems.forEach(systemId => {
            const deps = this.systemDependencies[systemId];
            if (deps) {
                dependencies[systemId] = deps.filter(dep =>
                    avionics.installedSystems.includes(dep)
                );
            }
        });

        return dependencies;
    }

    mapSystemConflicts(avionics) {
        const conflicts = {};

        avionics.installedSystems.forEach(systemId => {
            const conf = this.systemConflicts[systemId];
            if (conf) {
                conflicts[systemId] = conf.filter(conflict =>
                    avionics.installedSystems.includes(conflict)
                );
            }
        });

        return conflicts;
    }

    mapSystemSynergies(avionics) {
        const synergies = {};

        avionics.installedSystems.forEach(systemId => {
            const syn = this.systemSynergies[systemId];
            if (syn) {
                const activeSynergies = {};
                Object.keys(syn).forEach(partnerSystemId => {
                    if (avionics.installedSystems.includes(partnerSystemId)) {
                        activeSynergies[partnerSystemId] = syn[partnerSystemId];
                    }
                });

                if (Object.keys(activeSynergies).length > 0) {
                    synergies[systemId] = activeSynergies;
                }
            }
        });

        return synergies;
    }

    getSystemData(systemId) {
        return window.AIRCRAFT_COMPONENTS?.avionics?.[systemId] || null;
    }
}

// Create global instance
export const avionicsIntegrationSystem = new AvionicsIntegrationSystem();

// Make it available globally
window.avionicsIntegrationSystem = avionicsIntegrationSystem;

console.log('🔌 AvionicsIntegrationSystem module loaded');