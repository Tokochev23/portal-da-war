/**
 * World Map Component - Mapa interativo do mundo com províncias clicáveis
 * Permite narradores pintarem províncias para controlar territórios
 */

import { provinceService } from '../services/provinceService.js';

export class WorldMap {
    constructor(containerId) {
        this.containerId = containerId;
        this.map = null;
        this.geoJsonLayer = null;
        this.provinceColors = new Map(); // Armazena cores das províncias
        this.selectedColor = '#FF0000'; // Cor padrão selecionada
        this.isNarrator = false;
        this.provinces = new Map(); // Cache de províncias
    }

    /**
     * Inicializa o mapa
     */
    async initialize(isNarrator = false) {
        this.isNarrator = isNarrator;

        // Criar container do mapa
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container do mapa não encontrado:', this.containerId);
            return;
        }

        // Inicializar Leaflet
        this.map = L.map(this.containerId, {
            center: [20, 0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 8,
            worldCopyJump: true
        });

        // Adicionar camada base (sem labels para deixar limpo)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(this.map);

        // Carregar cores salvas do Firebase
        await this.loadProvinceColors();

        // Carregar GeoJSON do mundo
        await this.loadWorldGeoJSON();

        // Setup listeners de atualização em tempo real
        this.setupRealtimeUpdates();

        console.log('Mapa inicializado com sucesso');
    }

    /**
     * Carrega o GeoJSON das províncias do mundo
     */
    async loadWorldGeoJSON() {
        try {
            // Usando dados do Natural Earth (domínio público)
            const response = await fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson');
            const geoJsonData = await response.json();

            // Criar camada GeoJSON
            this.geoJsonLayer = L.geoJSON(geoJsonData, {
                style: (feature) => this.getProvinceStyle(feature),
                onEachFeature: (feature, layer) => this.onEachProvince(feature, layer)
            }).addTo(this.map);

            console.log('GeoJSON carregado:', geoJsonData.features.length, 'províncias');

            // Inicializar documento do mapa no Firebase se necessário
            if (this.isNarrator) {
                await provinceService.initializeMap();
            }

        } catch (error) {
            console.error('Erro ao carregar GeoJSON:', error);
            // Fallback: carregar países simples
            await this.loadSimpleCountries();
        }
    }

    /**
     * Fallback: Carrega apenas países (sem províncias)
     */
    async loadSimpleCountries() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
            const geoJsonData = await response.json();

            this.geoJsonLayer = L.geoJSON(geoJsonData, {
                style: (feature) => this.getProvinceStyle(feature),
                onEachFeature: (feature, layer) => this.onEachProvince(feature, layer)
            }).addTo(this.map);

            console.log('GeoJSON de países carregado:', geoJsonData.features.length, 'países');
        } catch (error) {
            console.error('Erro ao carregar GeoJSON de países:', error);
        }
    }

    /**
     * Obtém ID único da província
     */
    getProvinceId(feature) {
        // Tenta usar diferentes propriedades como ID
        return feature.properties.iso_3166_2 ||
               feature.properties.adm1_code ||
               feature.properties.name ||
               feature.id ||
               `province_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Obtém nome da província
     */
    getProvinceName(feature) {
        return feature.properties.name ||
               feature.properties.NAME ||
               feature.properties.admin ||
               'Província sem nome';
    }

    /**
     * Define estilo de cada província
     */
    getProvinceStyle(feature) {
        const provinceId = this.getProvinceId(feature);
        const color = this.provinceColors.get(provinceId) || '#d1d5db'; // Cinza padrão

        return {
            fillColor: color,
            weight: 1,
            opacity: 1,
            color: '#1f2937', // Cor da borda
            fillOpacity: 0.7
        };
    }

    /**
     * Configura eventos para cada província
     */
    onEachProvince(feature, layer) {
        const provinceId = this.getProvinceId(feature);
        const provinceName = this.getProvinceName(feature);

        // Armazenar referência
        this.provinces.set(provinceId, { feature, layer });

        // Tooltip com nome
        layer.bindTooltip(provinceName, {
            sticky: true,
            className: 'province-tooltip'
        });

        // Popup com informações
        const currentColor = this.provinceColors.get(provinceId) || '#d1d5db';
        layer.bindPopup(this.createPopupContent(provinceId, provinceName, currentColor));

        // Eventos de interação
        layer.on({
            mouseover: (e) => this.highlightProvince(e),
            mouseout: (e) => this.resetHighlight(e),
            click: (e) => this.onProvinceClick(e, provinceId, provinceName)
        });
    }

    /**
     * Cria conteúdo do popup
     */
    createPopupContent(provinceId, provinceName, currentColor) {
        return `
            <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${provinceName}</h3>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="font-size: 12px; color: #64748b;">Cor atual:</span>
                    <div style="width: 30px; height: 20px; background: ${currentColor}; border: 1px solid #333; border-radius: 4px;"></div>
                </div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
                    ID: ${provinceId}
                </div>
            </div>
        `;
    }

    /**
     * Destaca província no hover
     */
    highlightProvince(e) {
        const layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#fbbf24',
            fillOpacity: 0.9
        });
        layer.bringToFront();
    }

    /**
     * Remove destaque da província
     */
    resetHighlight(e) {
        this.geoJsonLayer.resetStyle(e.target);
    }

    /**
     * Ação ao clicar na província
     */
    async onProvinceClick(e, provinceId, provinceName) {
        if (!this.isNarrator) {
            // Modo read-only: apenas mostrar informações
            console.log(`Província visualizada: ${provinceName}`);
            return;
        }

        // Pintar província com a cor selecionada
        const success = await this.paintProvince(provinceId, this.selectedColor);

        if (success) {
            console.log(`Província ${provinceName} pintada com ${this.selectedColor}`);

            // Atualizar visual imediatamente
            const layer = e.target;
            layer.setStyle({
                fillColor: this.selectedColor
            });

            // Atualizar popup
            layer.setPopupContent(this.createPopupContent(provinceId, provinceName, this.selectedColor));
        }
    }

    /**
     * Pinta uma província
     */
    async paintProvince(provinceId, color) {
        try {
            const narratorId = firebase.auth().currentUser?.uid;
            const success = await provinceService.updateProvinceColor(provinceId, color, narratorId);

            if (success) {
                this.provinceColors.set(provinceId, color);
            }

            return success;
        } catch (error) {
            console.error('Erro ao pintar província:', error);
            return false;
        }
    }

    /**
     * Define a cor selecionada
     */
    setSelectedColor(color) {
        this.selectedColor = color;
        console.log('Cor selecionada:', color);
    }

    /**
     * Carrega cores das províncias do Firebase
     * NOVO: provinces agora é um objeto { provinceId: color }
     */
    async loadProvinceColors() {
        try {
            const provinces = await provinceService.getAllProvinces();

            // provinces é um objeto, não array
            Object.entries(provinces).forEach(([provinceId, color]) => {
                this.provinceColors.set(provinceId, color);
            });

            console.log('Cores carregadas:', this.provinceColors.size, 'províncias');
        } catch (error) {
            console.error('Erro ao carregar cores:', error);
        }
    }

    /**
     * Setup de atualizações em tempo real
     * NOVO: Recebe objeto completo { provinceId: color }
     */
    setupRealtimeUpdates() {
        provinceService.onProvincesChange((provincesObject) => {
            // provincesObject = { "province-1": "#FF0000", "province-2": "#00FF00" }

            Object.entries(provincesObject).forEach(([provinceId, color]) => {
                // Atualizar cache local
                this.provinceColors.set(provinceId, color);

                // Atualizar visual da província no mapa
                const provinceData = this.provinces.get(provinceId);
                if (provinceData && provinceData.layer) {
                    provinceData.layer.setStyle({
                        fillColor: color
                    });
                }
            });

            console.log('Mapa atualizado em tempo real:', Object.keys(provincesObject).length, 'províncias');
        });
    }

    /**
     * Reseta todas as províncias para cor padrão
     */
    async resetAllProvinces(defaultColor = '#d1d5db') {
        if (!this.isNarrator) {
            console.log('Apenas narradores podem resetar o mapa');
            return false;
        }

        if (!confirm('Tem certeza que deseja resetar TODAS as províncias do mapa?')) {
            return false;
        }

        try {
            const narratorId = firebase.auth().currentUser?.uid;
            const success = await provinceService.resetAllProvinces(defaultColor, narratorId);

            if (success) {
                console.log('Todas as províncias resetadas');
                // Atualização visual será feita pelo listener em tempo real
            }

            return success;
        } catch (error) {
            console.error('Erro ao resetar províncias:', error);
            return false;
        }
    }

    /**
     * Exporta o mapa atual como imagem
     */
    async exportAsImage() {
        // Implementar export para PNG
        console.log('Export de imagem será implementado');
    }
}
