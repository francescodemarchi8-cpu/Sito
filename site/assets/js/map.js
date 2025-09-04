// Google Maps Integration for Lumenis

// Configuration
const MAPS_CONFIG = {
    center: { lat: 46.1427, lng: 12.2169 }, // Via Mondin 7, Belluno coordinates
    address: "Via Mondin 7, 32100 Belluno BL, Italy",
    zoom: 16,
    businessName: "Lumenis Belluno"
};

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
});

/**
 * Initialize Google Maps
 */
function initializeMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Check if Google Maps API key is available
    const apiKey = getApiKey();
    
    if (!apiKey) {
        // Fallback to iframe embed
        loadMapIframe(mapContainer);
        return;
    }

    // Load Google Maps JavaScript API
    loadGoogleMapsAPI(apiKey).then(() => {
        createInteractiveMap(mapContainer);
    }).catch(error => {
        console.error('Failed to load Google Maps API:', error);
        // Fallback to iframe embed
        loadMapIframe(mapContainer);
    });
}

/**
 * Get API key (you can set this via environment or configuration)
 */
function getApiKey() {
    // For Ionos deployment, you can set this directly or via server-side configuration
    // Replace with your actual Google Maps API key
    return window.GOOGLE_MAPS_API_KEY || null;
}

/**
 * Load Google Maps JavaScript API
 */
function loadGoogleMapsAPI(apiKey) {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.google && window.google.maps) {
            resolve();
            return;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = resolve;
        script.onerror = reject;
        
        document.head.appendChild(script);
    });
}

/**
 * Create interactive Google Map
 */
function createInteractiveMap(container) {
    // Map options
    const mapOptions = {
        center: MAPS_CONFIG.center,
        zoom: MAPS_CONFIG.zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
            {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ color: "#f5f5f5" }]
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#c9d6d6" }]
            },
            {
                featureType: "administrative",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b7280" }]
            }
        ]
    };

    // Create map
    const map = new google.maps.Map(container, mapOptions);

    // Create marker
    const marker = new google.maps.Marker({
        position: MAPS_CONFIG.center,
        map: map,
        title: MAPS_CONFIG.businessName,
        animation: google.maps.Animation.DROP,
    });

    // Info window content
    const infoWindowContent = `
        <div style="padding: 15px; font-family: 'Inter', sans-serif; max-width: 250px;">
            <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 18px; font-weight: 600;">${MAPS_CONFIG.businessName}</h3>
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.4;">Via Mondin 7, 32100 Belluno</p>
            <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px;">Clicca il pin per aprire in Google Maps</p>
            <button onclick="openInGoogleMaps()" style="
                background: hsl(184, 100%, 29%);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: background 0.3s ease;
            " onmouseover="this.style.background='hsl(184, 85%, 35%)'" onmouseout="this.style.background='hsl(184, 100%, 29%)'">
                Apri in Google Maps
            </button>
        </div>
    `;

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
    });

    // Add click event to marker
    marker.addListener('click', () => {
        openInGoogleMaps();
    });

    // Show info window on marker hover
    marker.addListener('mouseover', () => {
        infoWindow.open(map, marker);
    });

    marker.addListener('mouseout', () => {
        infoWindow.close();
    });

    // Add resize listener to maintain center
    google.maps.event.addDomListener(window, 'resize', () => {
        map.setCenter(MAPS_CONFIG.center);
    });
}

/**
 * Load map as iframe (fallback)
 */
function loadMapIframe(container) {
    const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_CONFIG.address)}&output=embed`;
    
    container.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%;">
            <iframe
                title="Google Map - Via Mondin 7 Belluno"
                src="${embedUrl}"
                style="width: 100%; height: 100%; border: none; border-radius: 12px;"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
            <button
                onclick="openInGoogleMaps()"
                style="
                    position: absolute;
                    bottom: 15px;
                    right: 15px;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(8px);
                    border: none;
                    padding: 10px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    box-shadow: 0 4px 20px -8px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                "
                onmouseover="this.style.background='rgba(255, 255, 255, 1)'"
                onmouseout="this.style.background='rgba(255, 255, 255, 0.9)'"
                aria-label="Apri in Google Maps">
                Apri in Google Maps
            </button>
        </div>
    `;
}

/**
 * Open location in Google Maps
 */
function openInGoogleMaps() {
    const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_CONFIG.address)}&t=m`;
    window.open(googleMapsUrl, '_blank');
}

/**
 * Get directions to the location
 */
function getDirections() {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAPS_CONFIG.address)}`;
    window.open(directionsUrl, '_blank');
}

// Expose functions globally for onclick handlers
window.openInGoogleMaps = openInGoogleMaps;
window.getDirections = getDirections;