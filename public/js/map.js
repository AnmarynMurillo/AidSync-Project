// Configuration
const CONFIG = {
    defaultLocation: [8.5380, -80.7821], // Centered on Panama
    defaultZoom: 7,
    maxZoom: 18,
    minZoom: 3,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Foundation data categorized by type
const SAMPLE_FOUNDATIONS = [
    // Health (red)
    {
        id: 1,
        name: 'Panama Food Bank',
        category: 'red',
        position: [9.0890, -79.3979],
        address: 'Panamá',
        phone: 'N/A',
        email: 'info@panamafoodbank.org',
        website: 'https://panamafoodbank.org',
        description: 'Collects food surpluses to deliver to those in need, supporting over 400 organizations nationwide.'
    },
    {
        id: 2,
        name: 'Fundacáncer',
        category: 'red',
        position: [9.0101, -79.4762],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@fundacancer.org.pa',
        website: 'https://fundacancer.org.pa',
        description: 'Provides assistance to low-income cancer patients in Panama.'
    },
    {
        id: 3,
        name: 'Dona Vida Foundation',
        category: 'red',
        position: [8.9907, -79.5214],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@donavida.org',
        website: 'https://donavida.org',
        description: 'Supplies blood banks of major hospitals in Panama.'
    },
    {
        id: 4,
        name: 'Fundación Luces',
        category: 'red',
        position: [8.9908, -79.5215],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@fundacionluces.org',
        website: 'https://fundacionluces.org',
        description: 'Dedicated to the fight against epilepsy and support for patients.'
    },
    {
        id: 5,
        name: 'Fundación Oír es Vivir',
        category: 'red',
        position: [8.9856, -79.5261],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@oiresvivir.org',
        website: 'https://oiresvivir.org',
        description: 'Provides hearing health services and solutions.'
    },
    {
        id: 6,
        name: 'Hospital del Niño',
        category: 'red',
        position: [8.9687, -79.5321],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@hnn.sld.pa',
        website: 'https://www.hospitalnino.org.pa',
        description: 'Children\'s hospital with various healthcare programs.'
    },
    {
        id: 7,
        name: 'Nutre Hogar',
        category: 'red',
        position: [8.9719, -79.5674],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@nutrehogar.org',
        website: 'https://nutrehogar.org',
        description: 'Fights child malnutrition in Panama.'
    },
    {
        id: 8,
        name: 'Operación Sonrisa',
        category: 'red',
        position: [8.9805, -79.5483],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@operacionsonrisa.org.pa',
        website: 'https://panama.operationsmile.org',
        description: 'Provides reconstructive surgeries for children with cleft lip and palate.'
    },
    {
        id: 9,
        name: 'Fundación Ayuda a Ayudar',
        category: 'red',
        position: [9.0126, -79.4773],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@fundaya.org',
        website: 'https://fundaya.org',
        description: 'Focuses on breast cancer awareness and early detection.'
    },
    {
        id: 10,
        name: 'OPS Panamá',
        category: 'red',
        position: [8.9611, -79.5466],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'pwrpan@paho.org',
        website: 'https://www.paho.org/pan',
        description: 'Pan American Health Organization in Panama.'
    },

    // Education (blue)
    {
        id: 11,
        name: 'Asociación Amigos del Orfanato San José de Malambo',
        category: 'blue',
        position: [8.9465, -79.6777],
        address: 'Panamá',
        phone: 'N/A',
        email: 'info@orfanatosanjose.org',
        website: 'https://orfanatosanjose.org',
        description: 'Orphanage dedicated to housing and educating children in vulnerable situations.'
    },
    {
        id: 12,
        name: 'Asociación Pro Niñez Panameña',
        category: 'blue',
        position: [8.9954, -79.5060],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@proninez.org.pa',
        website: 'https://proninez.org.pa',
        description: 'Works on improving students\' literacy and math skills through technology.'
    },
    {
        id: 13,
        name: 'Biblioteca Nacional',
        category: 'blue',
        position: [9.0003, -79.5080],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@binal.ac.pa',
        website: 'http://binal.ac.pa',
        description: 'National Library offering training workshops and information resources.'
    },
    {
        id: 14,
        name: 'Casa Esperanza',
        category: 'blue',
        position: [8.9636, -79.5394],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@casaesperanza.org.pa',
        website: 'https://casaesperanza.org.pa',
        description: 'Supports children and adolescents in Panama.'
    },
    {
        id: 15,
        name: 'Ciudad del Niño',
        category: 'blue',
        position: [8.8641, -79.7742],
        address: 'La Chorrera',
        phone: 'N/A',
        email: 'info@ciudaddelnino.org.pa',
        website: 'https://ciudaddelnino.org.pa',
        description: 'Promotes and defends the rights of vulnerable children and adolescents.'
    },
    {
        id: 16,
        name: 'Enseña por Panamá',
        category: 'blue',
        position: [8.8641, -79.7742],
        address: 'La Chorrera',
        phone: 'N/A',
        email: 'info@ensenaporpanama.org',
        website: 'https://ensenaporpanama.org',
        description: 'Works for quality education in Panama.'
    },
    {
        id: 17,
        name: 'Escuela Arturo Daniel Motta',
        category: 'blue',
        position: [8.2249, -81.8264],
        address: 'Chiriquí',
        phone: 'N/A',
        email: 'info@escuelamotta.edu.pa',
        website: '#',
        description: 'Educational institution focused on community development.'
    },
    {
        id: 18,
        name: 'Fundación Creo en Ti',
        category: 'blue',
        position: [8.9846, -79.7158],
        address: 'Panamá Oeste',
        phone: 'N/A',
        email: 'info@fundacioncreoenti.org',
        website: 'https://fundacioncreoenti.org',
        description: 'Home for children and adolescents in vulnerable situations.'
    },
    {
        id: 19,
        name: 'Fundación Fútbol con Corazón',
        category: 'blue',
        position: [9.0833, -79.5333],
        address: 'Panamá',
        phone: 'N/A',
        email: 'info@futbolconcorazon.org',
        website: 'https://futbolconcorazon.org',
        description: 'Teaches values and social skills through sports.'
    },
    {
        id: 20,
        name: 'Fundación PROED',
        category: 'blue',
        position: [8.9521, -79.5526],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@fundacionproed.org.pa',
        website: 'https://fundacionproed.org.pa',
        description: 'Promotes educational development in Panama.'
    },

    // Environment (green)
    {
        id: 21,
        name: 'Fundación Natura',
        category: 'green',
        position: [8.9700, -79.5200],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@fundenat.org',
        website: 'https://fundenat.org',
        description: 'Dedicated to the conservation of Panama\'s natural resources.'
    },
    {
        id: 22,
        name: 'ANCON',
        category: 'green',
        position: [8.9557, -79.5508],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@ancon.org.pa',
        website: 'https://ancon.org.pa',
        description: 'Dedicated to the conservation of biodiversity and natural resources in Panama.'
    },
    {
        id: 23,
        name: 'Arvita',
        category: 'green',
        position: [8.9650, -79.5350],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@arvita.org.pa',
        website: 'https://arvita.org.pa',
        description: 'Promotes ecological responsibility and sustainable practices.'
    },
    {
        id: 24,
        name: 'Fundación Naturaleza y Ciencia 507',
        category: 'green',
        position: [9.0219, -79.5012],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@naturalezayciencia507.org',
        website: 'https://naturalezayciencia507.org',
        description: 'Promotes safe coexistence with nature through specific initiatives.'
    },
    {
        id: 25,
        name: 'Fundación AES Panamá',
        category: 'green',
        position: [9.0111, -79.4735],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@aes-panama.com',
        website: 'https://aes-panama.com',
        description: 'Promotes sustainable development and community projects.'
    },
    {
        id: 26,
        name: 'CIAM Panamá',
        category: 'green',
        position: [8.9822, -79.5235],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@ciampanama.org',
        website: 'https://ciampanama.org',
        description: 'Ensures compliance with environmental laws and defends the right to a healthy environment.'
    },
    {
        id: 27,
        name: 'Autoridad Marítima de Panamá',
        category: 'green',
        position: [8.9674, -79.5668],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@amp.gob.pa',
        website: 'https://amp.gob.pa',
        description: 'Ensures quality maritime services with environmental responsibility.'
    },
    {
        id: 28,
        name: 'Ministerio de Ambiente',
        category: 'green',
        position: [8.9743, -79.5616],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@miambiente.gob.pa',
        website: 'https://www.miambiente.gob.pa',
        description: 'Manages natural resources and the environment in Panama.'
    },
    {
        id: 29,
        name: 'Fundación Limpia Panamá',
        category: 'green',
        position: [9.0121, -79.5215],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@limpiepanama.org',
        website: 'https://limpiepanama.org',
        description: 'Focuses on proper waste management and preventing waste from reaching the sea.'
    },
    {
        id: 30,
        name: 'Écocrocs Panamá',
        category: 'green',
        position: [8.8778, -79.7858],
        address: 'Panamá Oeste',
        phone: 'N/A',
        email: 'info@ecocrocspanama.org',
        website: 'https://ecocrocspanama.org',
        description: 'Strengthens conservation of tropical ecosystems in the Panama Canal Basin.'
    },

    // Social Welfare (yellow)
    {
        id: 31,
        name: 'Cruz Roja Panameña',
        category: 'yellow',
        position: [8.9763, -79.5611],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@cruzroja.org.pa',
        website: 'https://cruzroja.org.pa',
        description: 'Humanitarian organization providing emergency assistance and community services.'
    },
    {
        id: 32,
        name: 'Casa Esperanza',
        category: 'yellow',
        position: [8.9636, -79.5394],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@casaesperanza.org.pa',
        website: 'https://casaesperanza.org.pa',
        description: 'Supports children and adolescents in vulnerable situations.'
    },
    {
        id: 33,
        name: 'Fundación Micé',
        category: 'yellow',
        position: [8.9634, -79.5525],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@fundacionmice.org',
        website: 'https://fundacionmice.org',
        description: 'Supports programs related to education, culture, and Panamanian folklore.'
    },
    {
        id: 34,
        name: 'Fundación Yo Te Creo',
        category: 'yellow',
        position: [8.9846, -79.7157],
        address: 'Panamá Oeste',
        phone: 'N/A',
        email: 'info@yotecreo.org.pa',
        website: 'https://yotecreo.org.pa',
        description: 'Supports girls and adolescents who are victims of violence and abuse.'
    },
    {
        id: 35,
        name: 'Fundación CREEA',
        category: 'yellow',
        position: [9.0271, -79.6213],
        address: 'Panamá',
        phone: 'N/A',
        email: 'info@fundacioncreea.org',
        website: 'https://fundacioncreea.org',
        description: 'Promotes civic participation and entrepreneurship based on social innovation.'
    },
    {
        id: 36,
        name: 'Fundación Causa Nuestra',
        category: 'yellow',
        position: [9.0097, -79.5326],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@causanuestra.org',
        website: 'https://causanuestra.org',
        description: 'Dedicated to projects in health, education, elderly care, and childhood.'
    },
    {
        id: 37,
        name: 'Fundación Reiniciarte',
        category: 'yellow',
        position: [8.8747, -80.1529],
        address: 'Penonomé',
        phone: 'N/A',
        email: 'info@fundacionreiniciarte.org',
        website: 'https://fundacionreiniciarte.org',
        description: 'Promotes social and labor reintegration of people who have been incarcerated.'
    },
    {
        id: 38,
        name: 'Centro de Apoyo a la Mujer Maltratada',
        category: 'yellow',
        position: [9.0332, -79.5001],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@mujermaltratada.org.pa',
        website: 'https://mujermaltratada.org.pa',
        description: 'Ensures women\'s rights and access to health services and education.'
    },
    {
        id: 39,
        name: 'Capadeso',
        category: 'yellow',
        position: [9.0031, -79.5324],
        address: 'Ciudad de Panamá',
        phone: 'N/A',
        email: 'info@capadeso.org.pa',
        website: 'https://capadeso.org.pa',
        description: 'Network of NGOs promoting social development in Panama.'
    },
    {
        id: 40,
        name: 'Fundación Emprendamos',
        category: 'yellow',
        position: [8.9722, -79.7057],
        address: 'Panamá Oeste',
        phone: 'N/A',
        email: 'info@fundacionemprendamos.org',
        website: 'https://fundacionemprendamos.org',
        description: 'Promotes entrepreneurship among students in Panama.'
    }
];

class FoundationMap {
    constructor() {
        this.map = null;
        this.markers = {};
        this.userMarker = null;
        this.userLocation = null;
        this.markerCluster = null;
        this.rangeCircle = null; // For showing search radius
        this.selectedCategories = new Set(['all']);
        this.distanceFilter = 10; // Default to 10km radius to match HTML default
        this.foundations = []; // Store all foundations
        
        this.init();
    }
    
    init() {
        this.initMap();
        this.initEventListeners();
        this.loadFoundations();
        
        // Try to locate user automatically when the page loads
        this.locateUser();
    }
    
    initMap() {
        // Initialize the map
        this.map = L.map('map', {
            center: CONFIG.defaultLocation,
            zoom: CONFIG.defaultZoom,
            minZoom: CONFIG.minZoom,
            maxZoom: CONFIG.maxZoom
        });
        
        // Add the tile layer
        L.tileLayer(CONFIG.tileLayer, {
            attribution: CONFIG.tileAttribution,
            maxZoom: CONFIG.maxZoom
        }).addTo(this.map);
        
        // Initialize marker cluster group
        this.markerCluster = L.markerClusterGroup({
            iconCreateFunction: this.createClusterIcon
        });
        this.map.addLayer(this.markerCluster);
        
        // Fit bounds to show all markers after they are loaded
        this.map.on('load', () => {
            if (this.markerCluster.getLayers().length > 0) {
                this.map.fitBounds(this.markerCluster.getBounds(), { 
                    padding: [50, 50],
                    maxZoom: 12
                });
            }
        });
    }
    
    createClusterIcon(cluster) {
        const childCount = cluster.getChildCount();
        let size = 'small';
        
        if (childCount > 50) {
            size = 'large';
        } else if (childCount > 10) {
            size = 'medium';
        }
        
        return L.divIcon({
            html: `<div><span>${childCount}</span></div>`,
            className: `marker-cluster ${size}`,
            iconSize: new L.Point(40, 40)
        });
    }
    
    initEventListeners() {
        // Category filter checkboxes
        document.querySelectorAll('.category-filter input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const category = e.target.closest('.category-filter').dataset.category;
                this.toggleCategory(category, e.target.checked);
                this.updateVisibleMarkers();
            });
        });
        
        // Distance filter
        document.getElementById('distance-range').addEventListener('change', (e) => {
            this.distanceFilter = parseInt(e.target.value);
            
            // Update range circle if we have user location
            if (this.userLocation) {
                // Remove existing range circle if it exists
                if (this.rangeCircle) {
                    this.map.removeLayer(this.rangeCircle);
                }
                
                // Add new range circle if distance is not 0 (show all)
                if (this.distanceFilter > 0) {
                    this.rangeCircle = L.circle(this.userLocation, {
                        color: '#3498db',
                        fillColor: '#3498db',
                        fillOpacity: 0.2,
                        radius: this.distanceFilter * 1000 // Convert km to meters
                    }).addTo(this.map);
                }
                
                const nearbyCount = this.foundations.filter(f => this.isFoundationInRange(f)).length;
                const totalCount = this.foundations.length;
                const distanceText = this.distanceFilter === 0 ? 'any distance' : `${this.distanceFilter}km`;
                
                L.popup()
                    .setLatLng(this.userLocation)
                    .setContent(`Showing ${nearbyCount} of ${totalCount} foundations within ${distanceText}`)
                    .openOn(this.map);
            }
            
            this.updateVisibleMarkers();
        });
        
        // Locate me button
        document.getElementById('locate-me').addEventListener('click', () => {
            this.locateUser();
        });
        
        // Close modal button
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('foundation-modal').style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('foundation-modal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    toggleCategory(category, isChecked) {
        if (isChecked) {
            this.selectedCategories.add(category);
        } else {
            this.selectedCategories.delete(category);
        }
    }
    
    updateVisibleMarkers() {
        // Clear all markers from the cluster
        this.markerCluster.clearLayers();
        
        // Add back only the markers that match the current filters
        Object.values(this.markers).forEach(marker => {
            const foundation = marker.options.foundation;
            const matchesCategory = this.selectedCategories.has('all') || 
                                 this.selectedCategories.has(foundation.category);
            const inRange = this.isFoundationInRange(foundation);
            
            if (matchesCategory && inRange) {
                this.markerCluster.addLayer(marker);
                
                // Update distance in the marker's popup if we have user location
                if (this.userLocation) {
                    const distance = this.getDistanceToFoundation(foundation);
                    if (distance !== null) {
                        marker.setPopupContent(
                            `<b>${foundation.name}</b><br>` +
                            `${foundation.address}<br>` +
                            `Distance: ${distance.toFixed(1)} km`
                        );
                    }
                }
            }
        });
        
        // If we have a user location, fit bounds to show all visible markers and user location
        if (this.userLocation) {
            const bounds = this.markerCluster.getBounds();
            if (bounds.isValid()) {
                bounds.extend(this.userLocation);
                this.map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }
    
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in km
    }
    
    deg2rad(deg) {
        return deg * (Math.PI/180);
    }
    
    // Get distance from user's location to a foundation
    getDistanceToFoundation(foundation) {
        if (!this.userLocation) return null;
        return this.calculateDistance(
            this.userLocation[0],
            this.userLocation[1],
            foundation.position[0],
            foundation.position[1]
        );
    }
    
    // Check if a foundation is within the selected distance
    isFoundationInRange(foundation) {
        // If distance filter is 0, show all foundations
        if (this.distanceFilter === 0) return true;
        
        // If we don't have user location yet, show all foundations
        if (!this.userLocation) return true;
        
        const distance = this.getDistanceToFoundation(foundation);
        return distance <= this.distanceFilter;
    }
    
    locateUser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => this.handleLocationFound(position),
                (error) => this.handleLocationError(error)
            );
        } else {
            alert('Geolocation is not supported by your browser');
            // Use default location if geolocation is not supported
            this.userLocation = CONFIG.defaultLocation;
            this.map.setView(this.userLocation, CONFIG.defaultZoom);
        }
    }
    
    handleLocationFound(position) {
        const { latitude, longitude } = position.coords;
        this.userLocation = [latitude, longitude];
        
        // Remove existing range circle if it exists
        if (this.rangeCircle) {
            this.map.removeLayer(this.rangeCircle);
        }
        
        // Add range circle to show search radius
        if (this.distanceFilter > 0) {
            this.rangeCircle = L.circle(this.userLocation, {
                color: '#3498db',
                fillColor: '#3498db',
                fillOpacity: 0.2,
                radius: this.distanceFilter * 1000 // Convert km to meters
            }).addTo(this.map);
        }
        
        // Update or create user location marker
        if (this.userMarker) {
            this.userMarker.setLatLng(this.userLocation);
        } else {
            this.userMarker = L.marker(this.userLocation, {
                icon: L.divIcon({
                    className: 'user-location-marker',
                    html: '<i class="fas fa-location-dot"></i>',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                }),
                zIndexOffset: 1000
            }).addTo(this.map);
            
            // Add popup to user location
            this.userMarker.bindPopup("<b>Your Location</b>").openPopup();
        }
        
        // Calculate bounds to include all visible markers and user location
        const bounds = L.latLngBounds([this.userLocation]);
        
        // Add all visible markers to bounds
        Object.values(this.markers).forEach(marker => {
            if (this.markerCluster.hasLayer(marker)) {
                bounds.extend(marker.getLatLng());
            }
        });
        
        // Update visible markers based on distance filter
        this.updateVisibleMarkers();
        
        // Show nearby foundations count
        const nearbyCount = this.foundations.filter(f => this.isFoundationInRange(f)).length;
        const totalCount = this.foundations.length;
        
        // Fit map to show user location and visible markers with padding
        this.map.fitBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 15
        });
        
        // Show popup with nearby count
        L.popup({ closeButton: false, autoClose: 5000 })
            .setLatLng(this.userLocation)
            .setContent(`<b>Found ${nearbyCount} of ${totalCount} foundations within ${this.distanceFilter}km</b>`)
            .openOn(this.map);
    }
    
    handleLocationError(error) {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Using default location.');
        
        // Use default location if geolocation fails
        this.userLocation = CONFIG.defaultLocation;
        this.map.setView(this.userLocation, CONFIG.defaultZoom);
    }
    
    loadFoundations() {
        // Store all foundations for filtering
        this.foundations = [...SAMPLE_FOUNDATIONS];
        
        // Find one foundation of each color
        const colorOrder = ['red', 'blue', 'green', 'yellow'];
        const selectedFoundations = [];
        
        // Get one foundation per color
        colorOrder.forEach(color => {
            const foundation = this.foundations.find(f => f.category === color);
            if (foundation) {
                selectedFoundations.push(foundation);
            }
        });
        
        // Add the rest of the foundations
        const otherFoundations = this.foundations.filter(f => !selectedFoundations.includes(f));
        const foundationsToShow = [...selectedFoundations, ...otherFoundations];
        
        // Add markers for all foundations
        foundationsToShow.forEach(foundation => {
            this.addFoundationMarker(foundation);
        });
    }
    
    addFoundationMarker(foundation) {
        const marker = L.marker(foundation.position, {
            icon: this.getMarkerIcon(foundation.category),
            foundation: foundation
        });
        
        // Initial popup content (will be updated with distance when user location is available)
        marker.bindPopup(`<b>${foundation.name}</b><br>${foundation.address}`);
        
        marker.on('click', () => this.showFoundationDetails(foundation));
        
        this.markers[foundation.id] = marker;
        
        // Add to cluster if it matches current filters
        const matchesCategory = this.selectedCategories.has('all') || 
                             this.selectedCategories.has(foundation.category);
        const inRange = this.isFoundationInRange(foundation);
        
        if (matchesCategory && inRange) {
            this.markerCluster.addLayer(marker);
        }
    }
    
    getMarkerIcon(category) {
        const colors = {
            red: '#e74c3c',    // Salud
            blue: '#3498db',    // Educación
            green: '#2ecc71',   // Ambiente
            yellow: '#f1c40f'   // Bienestar Social
        };
        
        const icons = {
            red: 'fa-heartbeat',
            blue: 'fa-graduation-cap',
            green: 'fa-leaf',
            yellow: 'fa-hands-helping'
        };
        
        const color = colors[category] || '#3498db';
        const icon = icons[category] || 'fa-map-marker-alt';
        
        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div class="pulse"></div>
                <div class="pin" style="background-color: ${color}">
                    <i class="fas ${icon} pin-icon"></i>
                </div>
            `,
            iconSize: [30, 40],
            iconAnchor: [15, 40],
            popupAnchor: [0, -40]
        });
    }
    
    showFoundationDetails(foundation) {
        const modal = document.getElementById('foundation-modal');
        const details = document.getElementById('foundation-details');
        
        // Get category info for styling
        const categoryInfo = {
            red: { name: 'Health', icon: 'fa-heartbeat', color: '#e74c3c' },
            blue: { name: 'Education', icon: 'fa-graduation-cap', color: '#3498db' },
            green: { name: 'Environment', icon: 'fa-leaf', color: '#2ecc71' },
            yellow: { name: 'Social Welfare', icon: 'fa-hands-helping', color: '#f1c40f' }
        };
        
        const category = categoryInfo[foundation.category] || categoryInfo.blue;
        
        details.innerHTML = `
            <div class="modal-header" style="--category-color: ${category.color}">
                <i class="fas ${category.icon} modal-header-icon"></i>
                <div class="modal-header-text">
                    <h2>${foundation.name}</h2>
                    <span class="modal-category">${category.name}</span>
                </div>
            </div>
            
            <div class="modal-body">
                <div class="contact-info-grid">
                    <p><i class="fas fa-map-marker-alt"></i> ${foundation.address}</p>
                    <p><i class="fas fa-phone"></i> ${foundation.phone}</p>
                    <p><i class="fas fa-envelope"></i> <a href="mailto:${foundation.email}">${foundation.email}</a></p>
                    <p><i class="fas fa-globe"></i> <a href="${foundation.website}" target="_blank">Visit Website</a></p>
                </div>
                
                <div class="foundation-description">
                    <h3><i class="fas fa-info-circle"></i>About this Foundation</h3>
                    <p>${foundation.description}</p>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }
}

// Initialize the map when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the map page
    if (document.getElementById('map')) {
        new FoundationMap();
    }
});
