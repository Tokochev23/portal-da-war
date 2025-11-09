// Entry point for Aircraft Creator to ensure all side-effect modules are loaded

// Core services and loaders
import './services/firebase.js';
import './utils/templateLoader.js';

// Performance systems used by the propulsion tab
import './utils/advancedPerformanceCalculator.js';

// Main UI/tab loaders and app
import './components/aircraftTabLoaders.js';
import './aircraftCreator.js';

