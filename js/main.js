// Main JS file for Homestay Booking System

document.addEventListener('DOMContentLoaded', function() {
  // Sticky navbar effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
  }

  // Initialize any tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function(tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Handle filter items on index page
  const filterItems = document.querySelectorAll('.filter-item');
  if (filterItems.length > 0) {
    filterItems.forEach(item => {
      item.addEventListener('click', function() {
        document.querySelectorAll('.filter-item').forEach(i => {
          i.classList.remove('active');
        });
        this.classList.add('active');

        // Add animation to room cards when filter changes
        document.querySelectorAll('.room-card').forEach(card => {
          card.classList.add('filter-animation');
          setTimeout(() => {
            card.classList.remove('filter-animation');
          }, 500);
        });
      });
    });
  }

  // Set dates for booking form
  const checkInInput = document.getElementById('checkIn');
  const checkOutInput = document.getElementById('checkOut');

  if (checkInInput && checkOutInput) {
    // Set minimum date to today
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    checkInInput.min = formatDate(today);
    checkOutInput.min = formatDate(tomorrow);

    // Default values
    if (!checkInInput.value) {
      checkInInput.value = formatDate(today);
    }

    if (!checkOutInput.value) {
      checkOutInput.value = formatDate(tomorrow);
    }

    // Update checkout min date when checkin changes
    checkInInput.addEventListener('change', function() {
      const newMinDate = new Date(this.value);
      newMinDate.setDate(newMinDate.getDate() + 1);
      checkOutInput.min = formatDate(newMinDate);

      // If checkout date is now invalid, update it
      if (new Date(checkOutInput.value) <= new Date(this.value)) {
        checkOutInput.value = formatDate(newMinDate);
      }
    });
  }

  // Room image gallery - enable clicking thumbnails to show as main image
  const thumbnails = document.querySelectorAll('.thumbnail-image');
  if (thumbnails.length > 0) {
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function() {
        const mainImage = document.querySelector('.main-image');
        if (mainImage) {
          const currentMainSrc = mainImage.src;
          mainImage.src = this.src;
          this.src = currentMainSrc;
        }
      });
    });
  }

  // Mobile menu enhancements
  const navbarToggler = document.querySelector('.navbar-toggler');
  if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
      document.body.classList.toggle('menu-open');
    });
  }

  // Fade in animation for page elements
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(element => {
    element.classList.add('fade-in-visible');
  });

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});

// Add animation to price on hover
const animatePriceHover = () => {
  const priceElements = document.querySelectorAll('.room-price');
  priceElements.forEach(price => {
    price.addEventListener('mouseenter', function() {
      this.classList.add('price-hover');
    });
    price.addEventListener('mouseleave', function() {
      this.classList.remove('price-hover');
    });
  });
};

// Call the function
animatePriceHover();

// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));

  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Fallback for browsers without intersection observer
    let active = false;

    const lazyLoad = function() {
      if (active === false) {
        active = true;

        setTimeout(function() {
          lazyImages.forEach(function(lazyImage) {
            if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== 'none') {
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.classList.remove('lazy');

              lazyImages = lazyImages.filter(function(image) {
                return image !== lazyImage;
              });

              if (lazyImages.length === 0) {
                document.removeEventListener('scroll', lazyLoad);
                window.removeEventListener('resize', lazyLoad);
                window.removeEventListener('orientationchange', lazyLoad);
              }
            }
          });

          active = false;
        }, 200);
      }
    };

    document.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    window.addEventListener('orientationchange', lazyLoad);
  }
});
