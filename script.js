// Admin credentials (in a real application, this would be server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Global variables
let isAdminLoggedIn = false;
let isEditMode = false;

// DOM elements
const adminModal = document.getElementById('adminModal');
const adminPanel = document.getElementById('adminPanel');
const adminBtn = document.getElementById('adminBtn');
const logoutBtn = document.getElementById('logoutBtn');
const adminLoginForm = document.getElementById('adminLoginForm');
const contactForm = document.getElementById('contactForm');
const closeModal = document.querySelector('.close');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeAnimations();
    checkAdminStatus();
});

// Event Listeners
function initializeEventListeners() {
    // Admin modal events
    adminBtn.addEventListener('click', openAdminModal);
    closeModal.addEventListener('click', closeAdminModal);
    window.addEventListener('click', function(event) {
        if (event.target === adminModal) {
            closeAdminModal();
        }
    });

    // Admin login form
    adminLoginForm.addEventListener('submit', handleAdminLogin);

    // Logout button
    logoutBtn.addEventListener('click', handleLogout);

    // Contact form
    contactForm.addEventListener('submit', handleContactForm);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle (if needed)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

// Admin Functions
function openAdminModal() {
    adminModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAdminModal() {
    adminModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    adminLoginForm.reset();
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        isAdminLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        closeAdminModal();
        showAdminPanel();
        showMessage('Login successful!', 'success');
    } else {
        showMessage('Invalid credentials. Please try again.', 'error');
    }
}

function handleLogout() {
    isAdminLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    hideAdminPanel();
    if (isEditMode) {
        toggleEditMode();
    }
    showMessage('Logged out successfully.', 'success');
}

function showAdminPanel() {
    adminPanel.style.display = 'block';
    adminPanel.classList.add('active');
    adminBtn.textContent = 'Admin ✓';
    adminBtn.style.background = 'rgba(34, 197, 94, 0.3)';
}

function hideAdminPanel() {
    adminPanel.style.display = 'none';
    adminPanel.classList.remove('active');
    adminBtn.textContent = 'Admin';
    adminBtn.style.background = 'rgba(255,255,255,0.2)';
}

function checkAdminStatus() {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
        isAdminLoggedIn = true;
        showAdminPanel();
    }
}

// Edit Mode Functions
function toggleEditMode() {
    if (!isAdminLoggedIn) {
        showMessage('Please login as admin first.', 'error');
        return;
    }
    
    isEditMode = !isEditMode;
    
    if (isEditMode) {
        enableEditMode();
    } else {
        disableEditMode();
    }
}

function enableEditMode() {
    // Add edit mode class to editable elements
    const editableElements = document.querySelectorAll('h1, h2, h3, p, .service-card, .client-card');
    editableElements.forEach(element => {
        element.classList.add('edit-mode');
        element.setAttribute('contenteditable', 'true');
        element.addEventListener('blur', saveContent);
    });
    
    showMessage('Edit mode enabled. Click on any text to edit.', 'success');
}

function disableEditMode() {
    // Remove edit mode class and contenteditable
    const editableElements = document.querySelectorAll('.edit-mode');
    editableElements.forEach(element => {
        element.classList.remove('edit-mode');
        element.removeAttribute('contenteditable');
        element.removeEventListener('blur', saveContent);
    });
    
    showMessage('Edit mode disabled.', 'success');
}

function saveContent(e) {
    const element = e.target;
    const content = element.innerHTML;
    const elementId = element.id || element.className;
    
    // Save to localStorage (in a real app, this would be sent to server)
    localStorage.setItem(`content_${elementId}`, content);
    showMessage('Content saved!', 'success');
}

// Contact Form Functions
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    const formMessage = document.getElementById('contactFormMessage');
    
    // Validate form
    if (!validateForm(data)) {
        if (formMessage) {
            formMessage.style.display = 'block';
            formMessage.className = 'message error';
            formMessage.textContent = 'Please fill the required fields correctly and accept consent.';
        }
        return;
    }
    
    // Simulate form submission with loading animation
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Simulate successful submission
        if (formMessage) {
            formMessage.style.display = 'block';
            formMessage.className = 'message success';
            formMessage.textContent = 'Thank you for your message. It has been sent successfully!';
        } else {
            showMessage('Thank you for your message. It has been sent successfully!', 'success');
        }
        contactForm.reset();
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Log the form data (in a real app, this would be sent to server)
        console.log('Form submitted:', data);
    }, 2000);
}

function validateForm(data) {
    const requiredFields = ['name', 'phone', 'email', 'service'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showMessage(`Please fill in the ${field} field.`, 'error');
            return false;
        }
    }
    
    // Consent checkbox must be checked
    const consentChecked = document.getElementById('consent')?.checked;
    if (!consentChecked) {
        showMessage('Please accept the consent to be contacted.', 'error');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
        showMessage('Please enter a valid phone number.', 'error');
        return false;
    }
    
    return true;
}

// Animation Functions
function initializeAnimations() {
    // Add fade-in class to elements
    const elementsToAnimate = document.querySelectorAll('section, .service-card, .client-card, .contact-item');
    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// Utility Functions
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the body
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('mobile-active');
}

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + E to toggle edit mode (admin only)
    if (e.ctrlKey && e.key === 'e' && isAdminLoggedIn) {
        e.preventDefault();
        toggleEditMode();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        closeAdminModal();
    }
});

// Load saved content on page load
function loadSavedContent() {
    const savedContent = localStorage.getItem('savedContent');
    if (savedContent) {
        try {
            const content = JSON.parse(savedContent);
            Object.keys(content).forEach(key => {
                const element = document.getElementById(key) || document.querySelector(`.${key}`);
                if (element) {
                    element.innerHTML = content[key];
                }
            });
        } catch (error) {
            console.error('Error loading saved content:', error);
        }
    }
}

// Save all content
function saveAllContent() {
    const content = {};
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    
    editableElements.forEach(element => {
        const key = element.id || element.className;
        if (key) {
            content[key] = element.innerHTML;
        }
    });
    
    localStorage.setItem('savedContent', JSON.stringify(content));
    showMessage('All content saved!', 'success');
}

// Auto-save functionality
setInterval(() => {
    if (isEditMode && isAdminLoggedIn) {
        saveAllContent();
    }
}, 30000); // Auto-save every 30 seconds

// Initialize saved content
loadSavedContent();

// Export functions for global access
window.toggleEditMode = toggleEditMode;
window.saveAllContent = saveAllContent;
