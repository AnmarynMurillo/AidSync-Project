document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const contactForm = document.getElementById('contactForm');
    const formInputs = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };

    // Form validation patterns
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 100,
            pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            errorMessage: 'Please enter a valid name (letters and spaces only)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: 'Please enter a valid email address'
        },
        phone: {
            required: false,
            pattern: /^[0-9+\-\s()]*$/,
            errorMessage: 'Please enter a valid phone number'
        },
        subject: {
            required: true,
            minLength: 5,
            maxLength: 100,
            errorMessage: 'Subject must be between 5 and 100 characters'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            errorMessage: 'Message must be between 10 and 1000 characters'
        }
    };

    // Initialize the form
    function initForm() {
        // Add event listeners to form inputs
        Object.keys(formInputs).forEach(field => {
            const input = formInputs[field];
            if (input) {
                input.addEventListener('input', () => validateField(field));
                input.addEventListener('blur', () => validateField(field));
            }
        });

        // Add submit event listener
        if (contactForm) {
            contactForm.addEventListener('submit', handleSubmit);
        }
    }

    // Validate a single form field
    function validateField(fieldName) {
        const input = formInputs[fieldName];
        const rules = validationRules[fieldName];
        const value = input.value.trim();
        const formGroup = input.closest('.form-group');
        
        // Remove any existing error states
        formGroup.classList.remove('error', 'success');
        
        // Remove any existing error message
        let errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }

        // Skip validation for non-required empty fields
        if (!rules.required && !value) {
            return true;
        }

        // Check required field
        if (rules.required && !value) {
            showError(formGroup, 'This field is required');
            return false;
        }

        // Check minimum length
        if (rules.minLength && value.length < rules.minLength) {
            showError(formGroup, `Minimum ${rules.minLength} characters required`);
            return false;
        }

        // Check maximum length
        if (rules.maxLength && value.length > rules.maxLength) {
            showError(formGroup, `Maximum ${rules.maxLength} characters allowed`);
            return false;
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            showError(formGroup, rules.errorMessage);
            return false;
        }

        // If all validations pass
        formGroup.classList.add('success');
        return true;
    }

    // Show error message for a field
    function showError(formGroup, message) {
        formGroup.classList.add('error');
        
        const errorElement = document.createElement('p');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        
        formGroup.appendChild(errorElement);
    }

    // Validate the entire form
    function validateForm() {
        let isValid = true;
        
        Object.keys(validationRules).forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            // Focus on the first error
            const firstError = document.querySelector('.error');
            if (firstError) {
                const input = firstError.querySelector('input, textarea, select');
                if (input) input.focus();
            }
            return;
        }

        // Disable submit button and show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            // Prepare form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value.trim();
            });

            // Here you would typically send the data to your server
            // For now, we'll simulate a successful submission
            await simulateApiCall(formObject);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            contactForm.reset();
            
            // Remove success classes
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success');
            });
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showError(contactForm.querySelector('.form-group:first-child'), 
                     'There was an error sending your message. Please try again later.');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    }

    // Simulate API call (replace with actual fetch/axios call)
    function simulateApiCall(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve({ success: true });
            }, 1500);
        });
    }

    // Show success message
    function showSuccessMessage() {
        // Remove any existing success message
        const existingMessage = document.querySelector('.form-success');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.setAttribute('role', 'alert');
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Message sent successfully!</h3>
            <p>Thank you for contacting us. We'll get back to you soon.</p>
        `;

        // Insert success message at the top of the form
        contactForm.insertBefore(successMessage, contactForm.firstChild);
        
        // Scroll to the success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Focus on the success message for screen readers
        successMessage.focus();
        
        // Remove success message after 10 seconds
        setTimeout(() => {
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 300);
        }, 10000);
    }

    // Initialize the form when the DOM is fully loaded
    initForm();
});