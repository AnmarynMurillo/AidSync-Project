// Configuración del entorno
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// Configuración del backend
const config = {
    development: {
        backendUrl: 'http://localhost:5000',
        apiPrefix: ''
    },
    production: {
        backendUrl: '', // Usará la misma URL del frontend
        apiPrefix: '/api'
    }
};

// Exportar configuración actual
export const currentConfig = isProduction ? config.production : config.development;
