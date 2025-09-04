// Configuration
const CONFIG = {
    defaultLocation: [19.4326, -99.1332], // Default to Mexico City
    defaultZoom: 12,
    maxZoom: 18,
    minZoom: 3,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Sample foundation data (will be replaced with real data)
const SAMPLE_FOUNDATIONS = [
    {
        id: 1,
        name: 'Community Health Center',
        category: 'red',
        position: [19.4326, -99.1332],
        address: '123 Main St, Mexico City',
        phone: '+52 55 1234 5678',
        email: 'info@healthcenter.org',
        website: 'https://healthcenter.org',
        description: 'Providing healthcare services to the local community.'
    },
    {
        id: 2,
        name: 'Green Earth Foundation',
        category: 'green',
        position: [19.4226, -99.1432],
        address: '456 Green Ave, Mexico City',
        phone: '+52 55 2345 6789',
        email: 'contact@greenearth.org',
        website: 'https://greenearth.org',
        description: 'Dedicated to environmental conservation and education.'
    },
    // Add more sample data as needed
];

class FoundationMap {
    constructor() {
        this.map = null;
        this.markers = {};
        this.userMarker = null;
        this.userLocation = null;
        this.markerCluster = null;
        this.selectedCategories = new Set(['all']);
        this.distanceFilter = 10; // km
        
        this.init();
    }
    
    init() {
        this.initMap();
        this.initEventListeners();
        this.loadFoundations();
    }
    
    initMap() {
        // Initialize the map
        this.map = L.map('map').setView(CONFIG.defaultLocation, CONFIG.defaultZoom);
        
        // Add the tile layer
        L.tileLayer(CONFIG.tileLayer, {
            maxZoom: CONFIG.maxZoom,
            minZoom: CONFIG.minZoom,
            attribution: CONFIG.tileAttribution
        }).addTo(this.map);
        
        // Initialize marker cluster group
        this.markerCluster = L.markerClusterGroup({
            maxClusterRadius: 60,
            iconCreateFunction: this.createClusterIcon
        });
        
        this.map.addLayer(this.markerCluster);
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
            checkbox.addEventListener('change', (e) => this.handleCategoryFilter(e));
        });
        
        // Distance filter
        document.getElementById('distance-range').addEventListener('change', (e) => {
            this.distanceFilter = parseInt(e.target.value);
            this.updateVisibleMarkers();
        });
        
        // Locate me button
        document.getElementById('locate-me').addEventListener('click', () => this.locateUser());
        
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
    
    handleCategoryFilter(event) {
        const category = event.target.closest('.category-filter').dataset.category;
        const isChecked = event.target.checked;
        
        if (category === 'all') {
            // Toggle all categories
            document.querySelectorAll('.category-filter input[type="checkbox"]').forEach(cb => {
                cb.checked = isChecked;
                if (cb !== event.target) {
                    this.toggleCategory(cb.closest('.category-filter').dataset.category, isChecked);
                }
            });
        } else {
            this.toggleCategory(category, isChecked);
            
            // Uncheck 'all' if any category is unchecked
            if (!isChecked) {
                document.querySelector('.category-filter[data-category="all"] input').checked = false;
            }
            
            // Check if all categories are checked
            const allChecked = Array.from(document.querySelectorAll('.category-filter:not([data-category="all"]) input[type="checkbox"]'))
                .every(checkbox => checkbox.checked);
                
            if (allChecked) {
                document.querySelector('.category-filter[data-category="all"] input').checked = true;
            }
        }
        
        this.updateVisibleMarkers();
    }
    
    toggleCategory(category, isChecked) {
        if (isChecked) {
            this.selectedCategories.add(category);
        } else {
            this.selectedCategories.delete(category);
        }
    }
    
    updateVisibleMarkers() {
        Object.values(this.markers).forEach(marker => {
            const foundation = marker.options.foundation;
            const isInCategory = this.selectedCategories.has('all') || 
                               this.selectedCategories.has(foundation.category);
            const isInRange = this.isInRange(foundation.position);
            
            if (isInCategory && isInRange) {
                this.markerCluster.addLayer(marker);
            } else {
                this.markerCluster.removeLayer(marker);
            }
        });
    }
    
    isInRange(position) {
        if (this.distanceFilter === 0 || !this.userLocation) return true;
        
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(position[0] - this.userLocation[0]);
        const dLon = this.deg2rad(position[1] - this.userLocation[1]);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(this.userLocation[0])) * Math.cos(this.deg2rad(position[0])) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in km
        
        return distance <= this.distanceFilter;
    }
    
    deg2rad(deg) {
        return deg * (Math.PI/180);
    }
    
    locateUser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => this.handleLocationFound(position),
                (error) => this.handleLocationError(error)
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    }
    
    handleLocationFound(position) {
        const { latitude, longitude } = position.coords;
        this.userLocation = [latitude, longitude];
        
        // Update or create user location marker
        if (this.userMarker) {
            this.userMarker.setLatLng(this.userLocation);
        } else {
            this.userMarker = L.marker(this.userLocation, {
                icon: L.divIcon({
                    className: 'user-location-marker',
                    html: '<i class="fas fa-map-marker-alt"></i>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -30]
                }),
                zIndexOffset: 1000
            }).addTo(this.map);
            
            this.userMarker.bindPopup('Your location').openPopup();
        }
        
        // Center map on user location
        this.map.setView(this.userLocation, 13);
        
        // Update visible markers based on distance filter
        this.updateVisibleMarkers();
    }
    
    handleLocationError(error) {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Using default location.');
        
        // Use default location if geolocation fails
        this.userLocation = CONFIG.defaultLocation;
        this.map.setView(this.userLocation, CONFIG.defaultZoom);
    }
    
    loadFoundations() {
        // In a real app, this would be an API call
        SAMPLE_FOUNDATIONS.forEach(foundation => this.addFoundationMarker(foundation));
    }
    
    addFoundationMarker(foundation) {
        const marker = L.marker(foundation.position, {
            icon: this.getMarkerIcon(foundation.category),
            foundation: foundation
        });
        
        marker.on('click', () => this.showFoundationDetails(foundation));
        
        this.markers[foundation.id] = marker;
        this.markerCluster.addLayer(marker);
    }
    
    getMarkerIcon(category) {
        const colors = {
            blue: '#3498db',
            green: '#2ecc71',
            red: '#e74c3c',
            yellow: '#f1c40f'
        };
        
        return L.divIcon({
            className: 'foundation-marker',
            html: `<div style="background-color: ${colors[category]}"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });
    }
    
    showFoundationDetails(foundation) {
        const modal = document.getElementById('foundation-modal');
        const details = document.getElementById('foundation-details');
        
        details.innerHTML = `
            <h2>${foundation.name}</h2>
            <p><i class="fas fa-map-marker-alt"></i> ${foundation.address}</p>
            <p><i class="fas fa-phone"></i> ${foundation.phone}</p>
            <p><i class="fas fa-envelope"></i> ${foundation.email}</p>
            <p><i class="fas fa-globe"></i> <a href="${foundation.website}" target="_blank">${foundation.website}</a></p>
            <div class="foundation-description">
                <h3>About</h3>
                <p>${foundation.description}</p>
            </div>
            <div class="foundation-actions">
                <button class="btn-primary"><i class="fas fa-heart"></i> Donate</button>
                <button class="btn-secondary"><i class="fas fa-hands-helping"></i> Volunteer</button>
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
