/**
 * HomieStay Application JavaScript
 * This file contains the main application logic for HomieStay
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('HomieStay application initialized');
    initApp();
});

// Sample property data (in a real app, this would come from a server/API)
const properties = [
    {
        id: 1,
        name: 'Cozy Garden Suite',
        price: 'RM 150 / night',
        location: 'Kuala Lumpur',
        description: 'A peaceful garden suite with private entrance and outdoor seating area.',
        image: 'https://placehold.co/300x200?text=Garden+Suite',
        features: ['1 Bedroom', 'Garden View', 'Private Bathroom', 'WiFi']
    },
    {
        id: 2,
        name: 'Modern City Apartment',
        price: 'RM 200 / night',
        location: 'Penang',
        description: 'Stylish apartment in the heart of the city with stunning views.',
        image: 'https://placehold.co/300x200?text=City+Apartment',
        features: ['2 Bedrooms', 'City View', 'Kitchen', 'WiFi', 'Pool']
    },
    {
        id: 3,
        name: 'Seaside Bungalow',
        price: 'RM 280 / night',
        location: 'Langkawi',
        description: 'Beautiful bungalow steps away from the beach with panoramic ocean views.',
        image: 'https://placehold.co/300x200?text=Seaside+Bungalow',
        features: ['2 Bedrooms', 'Ocean View', 'Kitchen', 'Private Beach Access']
    }
];

/**
 * Initialize the application
 */
function initApp() {
    const appContainer = document.getElementById('app');

    // If app container exists, render properties
    if (appContainer) {
        renderProperties(appContainer);
    }
}

/**
 * Render property listings
 * @param {HTMLElement} container - The container to render properties in
 */
function renderProperties(container) {
    // Clear loading message
    container.innerHTML = '';

    // Create property cards container
    const propertyGrid = document.createElement('div');
    propertyGrid.className = 'property-grid';
    propertyGrid.style.display = 'grid';
    propertyGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    propertyGrid.style.gap = '20px';

    // Add properties to the grid
    properties.forEach(property => {
        propertyGrid.appendChild(createPropertyCard(property));
    });

    // Add to container
    container.appendChild(propertyGrid);
}

/**
 * Create a property card element
 * @param {Object} property - Property data
 * @returns {HTMLElement} - Property card element
 */
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.style.border = '1px solid #ddd';
    card.style.borderRadius = '8px';
    card.style.overflow = 'hidden';
    card.style.backgroundColor = 'white';
    card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    });

    // Card content
    card.innerHTML = `
        <img src="${property.image}" alt="${property.name}" style="width: 100%; height: 200px; object-fit: cover;">
        <div style="padding: 15px;">
            <h3 style="margin-top: 0; margin-bottom: 10px; color: #4a89dc;">${property.name}</h3>
            <p style="font-weight: bold; color: #e67e22;">${property.price}</p>
            <p style="font-size: 0.9rem; color: #7f8c8d;"><i>${property.location}</i></p>
            <p>${property.description}</p>
            <div style="margin-top: 15px;">
                ${property.features.map(feature =>
                    `<span style="display: inline-block; background: #f1f1f1; padding: 5px 10px;
                    border-radius: 20px; font-size: 0.8rem; margin-right: 5px; margin-bottom: 5px;">${feature}</span>`
                ).join('')}
            </div>
            <a href="#" class="book-now-btn" data-id="${property.id}" style="display: inline-block; background-color: #4a89dc; color: white;
                padding: 8px 16px; border-radius: 5px; text-decoration: none; margin-top: 15px; font-weight: bold;">
                Book Now
            </a>
        </div>
    `;

    // Add event listener to Book Now button
    setTimeout(() => {
        const bookBtn = card.querySelector('.book-now-btn');
        if (bookBtn) {
            bookBtn.addEventListener('click', (e) => {
                e.preventDefault();
                bookProperty(property);
            });
        }
    }, 0);

    return card;
}

/**
 * Handle property booking
 * @param {Object} property - The property to book
 */
function bookProperty(property) {
    // Get current date and format for default selection
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const checkIn = formatDate(today);
    const checkOut = formatDate(tomorrow);

    // In a real application, you might show a modal for selecting dates
    // For this example, we'll use a simple confirmation and generate WhatsApp message

    if (confirm(`Would you like to book ${property.name} for ${checkIn} to ${checkOut}?`)) {
        // Format message for WhatsApp
        const message = `Hello, I would like to book ${property.name} in ${property.location} from ${checkIn} to ${checkOut}. Please confirm availability. Thank you!`;

        // Open WhatsApp with pre-filled message (using web WhatsApp for demo)
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    }
}

// Add CSS to document head for property styling
function addStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .property-grid {
            margin-top: 20px;
        }

        @media (max-width: 768px) {
            .property-grid {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            }
        }

        @media (max-width: 480px) {
            .property-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(styleEl);
}

// Add additional styles
addStyles();