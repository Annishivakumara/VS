// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Initialize navigation
    initializeNavigation();
});

// Initialize navigation and content switching
function initializeNavigation() {
    const navLinks = document.querySelectorAll('[data-section]');
    const sections = document.querySelectorAll('.section');
    const currentPage = document.getElementById('current-page');

    // Add click event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            switchSection(targetSection);
        });
    });

    // Function to switch between sections
    function switchSection(sectionId) {
        // Update navigation active state
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Update breadcrumb
        currentPage.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Basic form validation
    if (!validateForm(formData)) {
        return;
    }

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            })
        });

        if (response.ok) {
            showAlert('Message sent successfully!', 'success');
            form.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        showAlert('Failed to send message. Please try again later.', 'danger');
        console.error('Error:', error);
    }
}

// Form validation
function validateForm(formData) {
    let isValid = true;
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Name validation
    if (!name || name.trim().length < 2) {
        showAlert('Please enter a valid name', 'danger');
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showAlert('Please enter a valid email address', 'danger');
        isValid = false;
    }

    // Message validation
    if (!message || message.trim().length < 10) {
        showAlert('Please enter a message (minimum 10 characters)', 'danger');
        isValid = false;
    }

    return isValid;
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);

    // Auto-dismiss alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Add animation to cards on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
}); 