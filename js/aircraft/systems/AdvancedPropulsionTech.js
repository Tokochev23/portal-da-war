/**
 * Advanced Propulsion Technologies System - War1954 Aircraft Creator
 *
 * Implements cutting-edge propulsion technologies including scramjets,
 * electric propulsion, hybrid systems, and experimental concepts.
 * Designed for future aircraft development beyond 1954 era.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

export class AdvancedPropulsionTech {
    constructor() {
        this.initialized = false;
        this.availableTechnologies = new Map();

        // Technology maturity levels
        this.technologyReadinessLevels = {
            1: 'Basic principles observed',
            2: 'Technology concept formulated',
            3: 'Experimental proof of concept',
            4: 'Technology validated in lab',
            5: 'Technology validated in relevant environment',
            6: 'Technology demonstrated in relevant environment',
            7: 'System prototype demonstration',
            8: 'System complete and qualified',
            9: 'Actual system proven in operational environment'
        };

        // Initialize technology database
        this.initializeTechnologies();
    }

    /**
     * Initialize the advanced propulsion technologies database
     */
    initializeTechnologies() {
        // Scramjet Technology
        this.availableTechnologies.set('scramjet', {
            name: 'Scramjet (Supersonic Combustion Ramjet)',
            description: 'Airbreathing engine operating at hypersonic speeds',
            category: 'airbreathing',
            minTechLevel: 85,
            trl: 6,
            operationalSpeed: { min: 2500, max: 8000 }, // km/h
            operationalAltitude: { min: 20000, max: 60000 }, // meters
            advantages: [
                'Extremely high specific impulse at hypersonic speeds',
                'No moving parts in combustion chamber',
                'Potential for single-stage-to-orbit vehicles'
            ],
            disadvantages: [
                'Requires rocket booster to reach operational speed',
                'Complex fuel injection and mixing',
                'Extreme thermal management challenges'
            ],
            performance: {
                specificImpulse: 3000, // seconds (theoretical)
                thrustToWeight: 15,
                efficiency: 0.45,
                fuelType: 'hydrogen',
                coolingRequirement: 'regenerative'
            },
            developmentCost: 50000000, // credits
            researchTime: 180, // months
            implementationComplexity: 9
        });

        // Electric Propulsion
        this.availableTechnologies.set('electric_propulsion', {
            name: 'Electric Propulsion System',
            description: 'Battery or fuel cell powered electric motors driving propellers',
            category: 'electric',
            minTechLevel: 70,
            trl: 7,
            operationalSpeed: { min: 0, max: 500 }, // km/h
            operationalAltitude: { min: 0, max: 8000 }, // meters
            advantages: [
                'Zero emissions during flight',
                'Very quiet operation',
                'High efficiency at low speeds',
                'Instant torque availability'
            ],
            disadvantages: [
                'Limited by battery energy density',
                'Significant weight penalty',
                'Limited range and endurance'
            ],
            performance: {
                specificPower: 2.5, // kW/kg
                efficiency: 0.95,
                energyDensity: 300, // Wh/kg (battery)
                fuelType: 'electric',
                coolingRequirement: 'air'
            },
            developmentCost: 5000000,
            researchTime: 36,
            implementationComplexity: 5
        });

        // Hybrid Electric
        this.availableTechnologies.set('hybrid_electric', {
            name: 'Hybrid Electric Propulsion',
            description: 'Combination of conventional engine with electric assistance',
            category: 'hybrid',
            minTechLevel: 75,
            trl: 6,
            operationalSpeed: { min: 0, max: 800 }, // km/h
            operationalAltitude: { min: 0, max: 12000 }, // meters
            advantages: [
                'Extended range compared to pure electric',
                'Reduced fuel consumption',
                'Power boost capability',
                'Redundancy for safety'
            ],
            disadvantages: [
                'Complex control systems',
                'Weight penalty from dual systems',
                'Higher maintenance requirements'
            ],
            performance: {
                fuelSavings: 0.30, // 30% fuel reduction
                powerBoost: 1.5, // 50% temporary power increase
                efficiency: 0.38,
                fuelType: 'hybrid',
                coolingRequirement: 'liquid'
            },
            developmentCost: 15000000,
            researchTime: 60,
            implementationComplexity: 7
        });

        // Pulse Detonation Engine
        this.availableTechnologies.set('pulse_detonation', {
            name: 'Pulse Detonation Engine',
            description: 'Engine using detonation waves for propulsion',
            category: 'experimental',
            minTechLevel: 90,
            trl: 4,
            operationalSpeed: { min: 200, max: 3000 }, // km/h
            operationalAltitude: { min: 0, max: 25000 }, // meters
            advantages: [
                'High theoretical efficiency',
                'Simpler design than turbojets',
                'Works across wide speed range',
                'Self-pressurizing combustion'
            ],
            disadvantages: [
                'Extreme noise levels',
                'Severe vibration',
                'Combustion timing challenges',
                'Durability concerns'
            ],
            performance: {
                specificImpulse: 3500,
                thrustToWeight: 8,
                efficiency: 0.55,
                fuelType: 'kerosene',
                coolingRequirement: 'regenerative'
            },
            developmentCost: 75000000,
            researchTime: 240,
            implementationComplexity: 10
        });

        // Nuclear Thermal Propulsion
        this.availableTechnologies.set('nuclear_thermal', {
            name: 'Nuclear Thermal Propulsion',
            description: 'Nuclear reactor heating propellant for thrust',
            category: 'nuclear',
            minTechLevel: 95,
            trl: 5,
            operationalSpeed: { min: 500, max: 15000 }, // km/h (atmospheric and space)
            operationalAltitude: { min: 30000, max: 100000 }, // meters
            advantages: [
                'Extremely high specific impulse',
                'No air requirement',
                'Long operational duration',
                'High thrust-to-weight potential'
            ],
            disadvantages: [
                'Radiation shielding requirements',
                'Political and safety concerns',
                'Complex cooling systems',
                'Environmental impact'
            ],
            performance: {
                specificImpulse: 8500,
                thrustToWeight: 3,
                efficiency: 0.85,
                fuelType: 'hydrogen',
                coolingRequirement: 'nuclear'
            },
            developmentCost: 200000000,
            researchTime: 360,
            implementationComplexity: 10
        });

        // Magnetohydrodynamic (MHD) Propulsion
        this.availableTechnologies.set('mhd_propulsion', {
            name: 'Magnetohydrodynamic Propulsion',
            description: 'Using magnetic fields to accelerate conductive fluids',
            category: 'exotic',
            minTechLevel: 98,
            trl: 3,
            operationalSpeed: { min: 1000, max: 25000 }, // km/h
            operationalAltitude: { min: 15000, max: 80000 }, // meters
            advantages: [
                'No moving parts',
                'Silent operation',
                'Variable specific impulse',
                'Scalable thrust levels'
            ],
            disadvantages: [
                'Requires conductive propellant',
                'Enormous power requirements',
                'Complex magnetic field generation',
                'Theoretical technology'
            ],
            performance: {
                specificImpulse: 12000,
                thrustToWeight: 0.1,
                efficiency: 0.65,
                fuelType: 'plasma',
                coolingRequirement: 'superconducting'
            },
            developmentCost: 500000000,
            researchTime: 480,
            implementationComplexity: 10
        });

        // Variable Cycle Engine
        this.availableTechnologies.set('variable_cycle', {
            name: 'Variable Cycle Engine',
            description: 'Engine that can change its cycle characteristics in flight',
            category: 'adaptive',
            minTechLevel: 80,
            trl: 7,
            operationalSpeed: { min: 0, max: 2500 }, // km/h
            operationalAltitude: { min: 0, max: 20000 }, // meters
            advantages: [
                'Optimized for multiple flight regimes',
                'Improved fuel efficiency',
                'Enhanced performance envelope',
                'Mission adaptability'
            ],
            disadvantages: [
                'Complex control systems',
                'Additional mechanical complexity',
                'Higher maintenance requirements',
                'Weight penalty'
            ],
            performance: {
                efficiencyGain: 0.25, // 25% efficiency improvement
                thrustRange: { min: 0.3, max: 1.8 }, // thrust variation
                bypassRatioRange: { min: 0.5, max: 8.0 },
                fuelType: 'kerosene',
                coolingRequirement: 'air'
            },
            developmentCost: 30000000,
            researchTime: 84,
            implementationComplexity: 8
        });

        console.log('🚀 Advanced Propulsion Technologies initialized');
        this.initialized = true;
    }

    /**
     * Get available technologies for given tech level
     */
    getAvailableTechnologies(techLevel) {
        const available = [];

        for (const [key, tech] of this.availableTechnologies) {
            if (techLevel >= tech.minTechLevel) {
                available.push({
                    id: key,
                    ...tech,
                    developmentProgress: this.calculateDevelopmentProgress(tech, techLevel)
                });
            }
        }

        return available.sort((a, b) => a.minTechLevel - b.minTechLevel);
    }

    /**
     * Calculate development progress based on tech level
     */
    calculateDevelopmentProgress(technology, currentTechLevel) {
        const techDifference = currentTechLevel - technology.minTechLevel;
        const progressBonus = Math.min(20, techDifference * 2); // Max 20% bonus

        return {
            baseProgress: technology.trl * 10, // Base progress from TRL
            techBonus: progressBonus,
            totalProgress: Math.min(90, technology.trl * 10 + progressBonus),
            timeReduction: Math.min(0.5, techDifference * 0.05), // Max 50% time reduction
            costReduction: Math.min(0.3, techDifference * 0.03) // Max 30% cost reduction
        };
    }

    /**
     * Start technology development
     */
    startDevelopment(technologyId, country, resources = {}) {
        const technology = this.availableTechnologies.get(technologyId);
        if (!technology) {
            return { success: false, reason: 'Technology not found' };
        }

        const countryTechLevel = resources.techLevel || 50;
        if (countryTechLevel < technology.minTechLevel) {
            return {
                success: false,
                reason: `Insufficient technology level. Required: ${technology.minTechLevel}, Current: ${countryTechLevel}`
            };
        }

        const developmentProgress = this.calculateDevelopmentProgress(technology, countryTechLevel);
        const adjustedCost = technology.developmentCost * (1 - developmentProgress.costReduction);
        const adjustedTime = technology.researchTime * (1 - developmentProgress.timeReduction);

        if (resources.budget && resources.budget < adjustedCost) {
            return {
                success: false,
                reason: `Insufficient budget. Required: ${adjustedCost}, Available: ${resources.budget}`
            };
        }

        // Create development project
        const project = {
            id: `${technologyId}_${Date.now()}`,
            technologyId,
            country,
            startDate: Date.now(),
            estimatedCompletion: Date.now() + (adjustedTime * 30 * 24 * 60 * 60 * 1000), // Convert months to ms
            progress: developmentProgress.totalProgress,
            cost: adjustedCost,
            timeMonths: adjustedTime,
            status: 'in_development',
            milestones: this.generateMilestones(technology),
            risks: this.assessDevelopmentRisks(technology, resources),
            team: {
                scientists: Math.ceil(technology.implementationComplexity * 10),
                engineers: Math.ceil(technology.implementationComplexity * 15),
                technicians: Math.ceil(technology.implementationComplexity * 20)
            }
        };

        console.log(`🚀 Started development of ${technology.name} for ${country}`);

        return {
            success: true,
            project,
            technology,
            estimatedCompletion: new Date(project.estimatedCompletion)
        };
    }

    /**
     * Generate development milestones
     */
    generateMilestones(technology) {
        const milestones = [
            { name: 'Concept Design', progress: 10, completed: false },
            { name: 'Initial Prototyping', progress: 25, completed: false },
            { name: 'Laboratory Testing', progress: 40, completed: false },
            { name: 'Component Integration', progress: 60, completed: false },
            { name: 'System Testing', progress: 80, completed: false },
            { name: 'Flight Testing', progress: 95, completed: false },
            { name: 'Production Ready', progress: 100, completed: false }
        ];

        // Adjust milestones based on technology complexity
        if (technology.implementationComplexity >= 9) {
            milestones.splice(3, 0, { name: 'Advanced Materials Development', progress: 50, completed: false });
            milestones.splice(5, 0, { name: 'Safety Certification', progress: 85, completed: false });
        }

        return milestones;
    }

    /**
     * Assess development risks
     */
    assessDevelopmentRisks(technology, resources) {
        const risks = [];

        // Technical risks
        if (technology.trl < 6) {
            risks.push({
                type: 'technical',
                level: 'high',
                description: 'Low technology readiness level',
                mitigation: 'Extensive prototype testing required'
            });
        }

        if (technology.implementationComplexity >= 9) {
            risks.push({
                type: 'technical',
                level: 'high',
                description: 'Extremely complex implementation',
                mitigation: 'Phased development approach recommended'
            });
        }

        // Resource risks
        if (technology.developmentCost > 50000000) {
            risks.push({
                type: 'financial',
                level: 'medium',
                description: 'High development cost',
                mitigation: 'Consider international cooperation'
            });
        }

        // Environmental/Political risks
        if (technology.category === 'nuclear') {
            risks.push({
                type: 'political',
                level: 'high',
                description: 'Nuclear technology regulatory challenges',
                mitigation: 'Extensive safety analysis and public engagement'
            });
        }

        if (technology.category === 'exotic') {
            risks.push({
                type: 'scientific',
                level: 'very_high',
                description: 'Unproven scientific principles',
                mitigation: 'Fundamental research phase required'
            });
        }

        return risks;
    }

    /**
     * Calculate performance integration for aircraft
     */
    integrateTechnology(aircraft, technologyId, integrationLevel = 1.0) {
        const technology = this.availableTechnologies.get(technologyId);
        if (!technology) {
            return null;
        }

        // Base performance modifications
        const performanceModifier = {
            thrustMultiplier: 1.0,
            efficiencyMultiplier: 1.0,
            weightMultiplier: 1.0,
            costMultiplier: 1.0,
            maintenanceMultiplier: 1.0,
            specialCapabilities: [],
            operationalLimitations: []
        };

        // Apply technology-specific modifications
        switch (technology.category) {
            case 'airbreathing':
                performanceModifier.thrustMultiplier = 1.0 + (technology.performance.thrustToWeight - 5) * 0.1;
                performanceModifier.efficiencyMultiplier = technology.performance.efficiency / 0.3; // Relative to baseline
                performanceModifier.specialCapabilities.push('hypersonic_flight');
                performanceModifier.operationalLimitations.push('requires_boost_to_operational_speed');
                break;

            case 'electric':
                performanceModifier.efficiencyMultiplier = technology.performance.efficiency / 0.3;
                performanceModifier.weightMultiplier = 1.5; // Battery weight penalty
                performanceModifier.specialCapabilities.push('zero_emissions', 'quiet_operation');
                performanceModifier.operationalLimitations.push('limited_range', 'battery_degradation');
                break;

            case 'hybrid':
                performanceModifier.efficiencyMultiplier = 1.0 + technology.performance.fuelSavings;
                performanceModifier.thrustMultiplier = technology.performance.powerBoost;
                performanceModifier.weightMultiplier = 1.2;
                performanceModifier.specialCapabilities.push('variable_power', 'fuel_efficiency');
                break;

            case 'experimental':
                performanceModifier.thrustMultiplier = technology.performance.thrustToWeight / 5;
                performanceModifier.efficiencyMultiplier = technology.performance.efficiency / 0.3;
                performanceModifier.maintenanceMultiplier = 3.0;
                performanceModifier.specialCapabilities.push('experimental_performance');
                performanceModifier.operationalLimitations.push('high_noise', 'reliability_concerns');
                break;

            case 'nuclear':
                performanceModifier.thrustMultiplier = technology.performance.thrustToWeight / 5;
                performanceModifier.efficiencyMultiplier = technology.performance.efficiency / 0.3;
                performanceModifier.weightMultiplier = 2.0; // Shielding weight
                performanceModifier.specialCapabilities.push('unlimited_endurance', 'space_capable');
                performanceModifier.operationalLimitations.push('radiation_shielding', 'political_restrictions');
                break;

            case 'exotic':
                performanceModifier.thrustMultiplier = technology.performance.thrustToWeight / 5;
                performanceModifier.efficiencyMultiplier = technology.performance.efficiency / 0.3;
                performanceModifier.costMultiplier = 10.0;
                performanceModifier.specialCapabilities.push('exotic_propulsion', 'theoretical_performance');
                performanceModifier.operationalLimitations.push('unproven_technology', 'enormous_power_requirements');
                break;

            case 'adaptive':
                performanceModifier.thrustMultiplier = 1.0 + technology.performance.efficiencyGain;
                performanceModifier.efficiencyMultiplier = 1.0 + technology.performance.efficiencyGain;
                performanceModifier.weightMultiplier = 1.1;
                performanceModifier.specialCapabilities.push('variable_cycle', 'mission_adaptability');
                break;
        }

        // Apply integration level scaling
        Object.keys(performanceModifier).forEach(key => {
            if (typeof performanceModifier[key] === 'number' && key.includes('Multiplier')) {
                const baseValue = performanceModifier[key];
                performanceModifier[key] = 1.0 + (baseValue - 1.0) * integrationLevel;
            }
        });

        return {
            technology,
            performanceModifier,
            integrationLevel,
            recommendedApplications: this.getRecommendedApplications(technology),
            developmentRequirements: this.getDevelopmentRequirements(technology)
        };
    }

    /**
     * Get recommended applications for technology
     */
    getRecommendedApplications(technology) {
        const applications = [];

        switch (technology.category) {
            case 'airbreathing':
                applications.push('hypersonic_interceptors', 'space_planes', 'high_speed_reconnaissance');
                break;
            case 'electric':
                applications.push('training_aircraft', 'short_range_transport', 'surveillance_drones');
                break;
            case 'hybrid':
                applications.push('general_aviation', 'regional_transport', 'multi_role_aircraft');
                break;
            case 'experimental':
                applications.push('research_aircraft', 'technology_demonstrators');
                break;
            case 'nuclear':
                applications.push('strategic_bombers', 'space_vehicles', 'long_endurance_platforms');
                break;
            case 'exotic':
                applications.push('experimental_concepts', 'far_future_vehicles');
                break;
            case 'adaptive':
                applications.push('multi_role_fighters', 'variable_mission_aircraft');
                break;
        }

        return applications;
    }

    /**
     * Get development requirements
     */
    getDevelopmentRequirements(technology) {
        return {
            minimumTechLevel: technology.minTechLevel,
            estimatedCost: technology.developmentCost,
            developmentTime: technology.researchTime,
            complexityRating: technology.implementationComplexity,
            technologyReadinessLevel: technology.trl,
            keyResearchAreas: this.getKeyResearchAreas(technology),
            requiredFacilities: this.getRequiredFacilities(technology),
            skillRequirements: this.getSkillRequirements(technology)
        };
    }

    /**
     * Get key research areas for technology
     */
    getKeyResearchAreas(technology) {
        const areas = [];

        switch (technology.category) {
            case 'airbreathing':
                areas.push('hypersonic_aerodynamics', 'supersonic_combustion', 'thermal_management');
                break;
            case 'electric':
                areas.push('energy_storage', 'power_electronics', 'electric_motors');
                break;
            case 'hybrid':
                areas.push('power_management', 'system_integration', 'control_algorithms');
                break;
            case 'experimental':
                areas.push('detonation_physics', 'combustion_dynamics', 'structural_dynamics');
                break;
            case 'nuclear':
                areas.push('nuclear_engineering', 'radiation_shielding', 'heat_transfer');
                break;
            case 'exotic':
                areas.push('plasma_physics', 'magnetohydrodynamics', 'superconductivity');
                break;
            case 'adaptive':
                areas.push('variable_geometry', 'control_systems', 'materials_science');
                break;
        }

        return areas;
    }

    /**
     * Get required facilities
     */
    getRequiredFacilities(technology) {
        const facilities = ['advanced_laboratory', 'computational_facility'];

        switch (technology.category) {
            case 'airbreathing':
                facilities.push('hypersonic_wind_tunnel', 'shock_tunnel', 'high_temperature_test_facility');
                break;
            case 'electric':
                facilities.push('battery_test_lab', 'electromagnetic_test_chamber');
                break;
            case 'nuclear':
                facilities.push('nuclear_reactor', 'radiation_test_facility', 'hot_cell_laboratory');
                break;
            case 'exotic':
                facilities.push('plasma_laboratory', 'superconducting_magnet_facility');
                break;
        }

        return facilities;
    }

    /**
     * Get skill requirements
     */
    getSkillRequirements(technology) {
        const skills = ['aerospace_engineering', 'propulsion_engineering', 'systems_engineering'];

        switch (technology.category) {
            case 'airbreathing':
                skills.push('hypersonics', 'combustion_engineering', 'thermal_management');
                break;
            case 'electric':
                skills.push('electrical_engineering', 'battery_technology', 'power_electronics');
                break;
            case 'nuclear':
                skills.push('nuclear_engineering', 'radiation_physics', 'nuclear_safety');
                break;
            case 'exotic':
                skills.push('plasma_physics', 'electromagnetic_theory', 'quantum_mechanics');
                break;
        }

        return skills;
    }

    /**
     * Export technology analysis
     */
    exportTechnologyAnalysis(techLevel) {
        const availableTech = this.getAvailableTechnologies(techLevel);

        return {
            timestamp: Date.now(),
            technologyLevel: techLevel,
            availableTechnologies: availableTech,
            technologyCategories: this.getCategoryAnalysis(availableTech),
            developmentRecommendations: this.generateDevelopmentRecommendations(availableTech),
            researchPriorities: this.determineResearchPriorities(availableTech, techLevel)
        };
    }

    /**
     * Get category analysis
     */
    getCategoryAnalysis(availableTech) {
        const categories = {};

        availableTech.forEach(tech => {
            if (!categories[tech.category]) {
                categories[tech.category] = {
                    count: 0,
                    avgComplexity: 0,
                    avgCost: 0,
                    avgTRL: 0,
                    technologies: []
                };
            }

            const cat = categories[tech.category];
            cat.count++;
            cat.avgComplexity += tech.implementationComplexity;
            cat.avgCost += tech.developmentCost;
            cat.avgTRL += tech.trl;
            cat.technologies.push(tech.name);
        });

        // Calculate averages
        Object.values(categories).forEach(cat => {
            cat.avgComplexity = Math.round(cat.avgComplexity / cat.count);
            cat.avgCost = Math.round(cat.avgCost / cat.count);
            cat.avgTRL = Math.round(cat.avgTRL / cat.count);
        });

        return categories;
    }

    /**
     * Generate development recommendations
     */
    generateDevelopmentRecommendations(availableTech) {
        const recommendations = [];

        // Find high-value, low-risk technologies
        const lowRisk = availableTech.filter(tech =>
            tech.trl >= 7 && tech.implementationComplexity <= 6
        );

        if (lowRisk.length > 0) {
            recommendations.push({
                priority: 'high',
                type: 'immediate_development',
                technologies: lowRisk.map(t => t.name),
                rationale: 'High TRL and manageable complexity for quick deployment'
            });
        }

        // Find breakthrough technologies
        const breakthrough = availableTech.filter(tech =>
            tech.category === 'exotic' || tech.implementationComplexity >= 9
        );

        if (breakthrough.length > 0) {
            recommendations.push({
                priority: 'long_term',
                type: 'fundamental_research',
                technologies: breakthrough.map(t => t.name),
                rationale: 'Potential for revolutionary capabilities but requires long-term investment'
            });
        }

        return recommendations;
    }

    /**
     * Determine research priorities
     */
    determineResearchPriorities(availableTech, techLevel) {
        const priorities = [];

        // Prioritize based on current tech level and technology gaps
        if (techLevel >= 85) {
            priorities.push('hypersonic_propulsion', 'electric_aviation', 'adaptive_engines');
        } else if (techLevel >= 75) {
            priorities.push('hybrid_systems', 'advanced_turbojets', 'propulsion_efficiency');
        } else {
            priorities.push('basic_jet_engines', 'propeller_optimization', 'fuel_systems');
        }

        return priorities;
    }
}

// Create global instance
export const advancedPropulsionTech = new AdvancedPropulsionTech();

// Make it available globally
window.advancedPropulsionTech = advancedPropulsionTech;

console.log('🚀 AdvancedPropulsionTech module loaded');