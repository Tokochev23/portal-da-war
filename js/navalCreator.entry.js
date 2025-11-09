// Entry point for Naval Creator to ensure all side-effect modules are loaded

// Core services and utilities
import './services/firebase.js';
import './utils/templateLoader.js';

// Naval systems and calculators (expose globals on window)
import './utils/navalCostSystem.js';
import './utils/navalPerformanceCalculator.js';

// UI/tab loaders for naval creator
import './components/navalTabLoaders.js';

// Main naval creator logic (defines NAVAL_COMPONENTS, window.navalCreator, helpers)
import './navalCreator.js';

