// Contact form functionality for B2B inquiries

class ContactForm {
    constructor() {
        this.form = document.getElementById('b2bContactForm');
        this.planParam = this.getUrlParameter('plan');
        
        this.init();
    }
    
    init() {
        if (this.form) {
            this.setupForm();
            this.prefillFromURL();
            this.setupValidation();
            this.setupFormSubmission();
        }
        
        this.setupEmailLinks();
    }
    
    setupForm() {
        // Add dynamic behavior based on organization type
        const orgTypeSelect = document.getElementById('organizationType');
        if (orgTypeSelect) {
            orgTypeSelect.addEventListener('change', (e) => {
                this.updateFormForOrgType(e.target.value);
            });
        }
        
        // Add character counter for message field
        const messageField = document.getElementById('message');
        if (messageField) {
            this.setupCharacterCounter(messageField, 1000);
        }
        
        // Pre-fill interest level based on URL parameter
        if (this.planParam) {
            const interestSelect = document.getElementById('interestLevel');
            if (interestSelect) {
                const optionValue = this.getPlanOptionValue(this.planParam);
                if (optionValue) {
                    interestSelect.value = optionValue;
                }
            }
        }
    }
    
    prefillFromURL() {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const messageParam = urlParams.get('message');
        const reportParam = urlParams.get('report');
        
        // Pre-fill message if provided in URL
        if (messageParam) {
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = decodeURIComponent(messageParam);
            }
        }
        
        // Add report reference to message if provided
        if (reportParam) {
            const messageField = document.getElementById('message');
            if (messageField) {
                const reportMessage = `\n\nReference: Interested in report #${reportParam}`;
                messageField.value += messageField.value ? reportMessage : reportMessage.trim();
            }
        }
    }
    
    setupValidation() {
        // Real-time email validation
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('blur', () => {
                this.validateEmailField(emailField);
            });
        }
        
        // Organization validation
        const orgField = document.getElementById('organization');
        if (orgField) {
            orgField.addEventListener('blur', () => {
                this.validateOrganizationField(orgField);
            });
        }
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                await this.submitForm();
            }
        });
    }
    
    validateForm() {
        let isValid = true;
        
        // Validate required fields
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate email format
        const emailField = document.getElementById('email');
        if (emailField && !this.isValidEmail(emailField.value)) {
            this.showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate organization email match
        const orgField = document.getElementById('organization');
        const email = document.getElementById('email');
        if (orgField && email && orgField.value && email.value) {
            const orgDomain = this.extractDomain(email.value);
            const orgName = orgField.value.toLowerCase();
            
            // Check if email domain matches organization (basic check)
            if (!this.isLikelyProfessionalEmail(email.value)) {
                this.showFieldWarning(email, 
                    'Using a professional email address (not Gmail/Yahoo) may improve response time');
            }
        }
        
        return isValid;
    }
    
    async submitForm() {
        const formData = new FormData(this.form);
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        try {
            // In a real application, you would send this to your server
            // For now, we'll simulate API call
            await this.simulateAPICall(formData);
            
            // Show success
            this.showSuccessMessage();
            
            // Reset form after delay
            setTimeout(() => {
                this.form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
            
        } catch (error) {
            // Show error
            this.showErrorMessage();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async simulateAPICall(formData) {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                Math.random() > 0.1 ? resolve() : reject(new Error('Network error'));
            }, 1500);
        });
    }
    
    showSuccessMessage() {
        // Remove any existing messages
        this.removeExistingMessages();
        
        const successMessage = document.createElement('div');
        successMessage.className = 'form-message success';
        successMessage.innerHTML = `
            <div class="message-content">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>Inquiry Submitted Successfully</h4>
                    <p>Thank you for your interest. We'll respond within 24 business hours.</p>
                    <p><small>Check your email for a confirmation message.</small></p>
                </div>
            </div>
        `;
        
        this.form.parentNode.insertBefore(successMessage, this.form);
        
        // Scroll to message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showErrorMessage() {
        this.removeExistingMessages();
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-message error';
        errorMessage.innerHTML = `
            <div class="message-content">
                <i class="fas fa-exclamation-circle"></i>
                <div>
                    <h4>Submission Failed</h4>
                    <p>There was an error sending your inquiry. Please try again or email us directly.</p>
                </div>
            </div>
        `;
        
        this.form.parentNode.insertBefore(errorMessage, this.form);
    }
    
    removeExistingMessages() {
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
    }
    
    // Helper methods
    validateField(field) {
        const value = field.value.trim();
        
        if (!value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Field-specific validations
        switch (field.id) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    this.showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    validateEmailField(field) {
        const value = field.value.trim();
        
        if (value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        if (value && !this.isLikelyProfessionalEmail(value)) {
            this.showFieldWarning(field, 
                'Using a professional email address may improve response time');
        } else {
            this.clearFieldWarning(field);
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    validateOrganizationField(field) {
        const value = field.value.trim();
        
        if (value && value.length < 2) {
            this.showFieldError(field, 'Organization name is too short');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
        field.classList.add('error');
    }
    
    showFieldWarning(field, message) {
        this.clearFieldWarning(field);
        
        const warningElement = document.createElement('div');
        warningElement.className = 'field-warning';
        warningElement.textContent = message;
        
        field.parentNode.appendChild(warningElement);
        field.classList.add('warning');
    }
    
    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    }
    
    clearFieldWarning(field) {
        const warningElement = field.parentNode.querySelector('.field-warning');
        if (warningElement) {
            warningElement.remove();
        }
        field.classList.remove('warning');
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        // Basic phone validation - accepts various formats
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    isLikelyProfessionalEmail(email) {
        const personalDomains = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
            'aol.com', 'icloud.com', 'protonmail.com', 'mail.com'
        ];
        
        const domain = this.extractDomain(email);
        return !personalDomains.includes(domain.toLowerCase());
    }
    
    extractDomain(email) {
        return email.split('@')[1] || '';
    }
    
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    
    getPlanOptionValue(plan) {
        const planMap = {
            'weekly': 'Interested in Weekly plan ($99/month)',
            'professional': 'Interested in Professional plan ($199/month)',
            'enterprise': 'Interested in Enterprise/custom solution'
        };
        
        return planMap[plan] || null;
    }
    
    updateFormForOrgType(orgType) {
        const messageField = document.getElementById('message');
        if (!messageField) return;
        
        const currentValue = messageField.value.trim();
        const placeholder = this.getOrgTypePlaceholder(orgType);
        
        // Only update placeholder if field is empty
        if (!currentValue) {
            messageField.placeholder = placeholder;
        }
    }
    
    getOrgTypePlaceholder(orgType) {
        const placeholders = {
            'ngo': 'What specific Afghanistan operational intelligence does your NGO need for humanitarian work? (e.g., security assessments for specific regions, movement restrictions)',
            'logistics': 'What supply chain or logistics intelligence do you need? (e.g., border crossing status, road conditions, transportation restrictions)',
            'research': 'What type of field data are you researching? (e.g., specific provinces, infrastructure status, social indicators)',
            'media': 'What information do you need for your reporting? (e.g., ground situation verification, local source access)',
            'risk': 'What risk assessment data do you require? (e.g., security trends, operational constraints, predictive analysis)'
        };
        
        return placeholders[orgType] || 
               'What specific Afghanistan operational intelligence do you need? (e.g., particular regions, types of data, frequency)';
    }
    
    setupCharacterCounter(textarea, maxLength) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.textContent = `0/${maxLength}`;
        
        textarea.parentNode.appendChild(counter);
        
        textarea.addEventListener('input', () => {
            const length = textarea.value.length;
            counter.textContent = `${length}/${maxLength}`;
            
            if (length > maxLength * 0.9) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
            
            if (length > maxLength) {
                counter.classList.add('error');
            } else {
                counter.classList.remove('error');
            }
        });
    }
    
    setupEmailLinks() {
        // Add click tracking for email links (in a real app, this would send to analytics)
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', () => {
                console.log('Email link clicked:', link.href);
                // You would send this to Google Analytics here
            });
        });
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = new ContactForm();
    
    // Make form available globally for debugging
    window.contactForm = contactForm;
    
    // Add additional styles for form messages
    const style = document.createElement('style');
    style.textContent = `
        .form-message {
            padding: 1.5rem;
            border-radius: var(--radius-md);
            margin-bottom: 2rem;
            animation: slideIn 0.3s ease;
        }
        
        .form-message.success {
            background-color: rgba(56, 161, 105, 0.1);
            border: 1px solid rgba(56, 161, 105, 0.2);
        }
        
        .form-message.error {
            background-color: rgba(229, 62, 62, 0.1);
            border: 1px solid rgba(229, 62, 62, 0.2);
        }
        
        .message-content {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .message-content i {
            font-size: 1.5rem;
            margin-top: 2px;
        }
        
        .form-message.success i {
            color: var(--status-safe);
        }
        
        .form-message.error i {
            color: var(--status-danger);
        }
        
        .message-content h4 {
            margin: 0 0 0.5rem 0;
        }
        
        .message-content p {
            margin: 0;
            color: var(--neutral-medium);
        }
        
        .field-error, .field-warning {
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
        
        .field-error {
            color: var(--status-danger);
        }
        
        .field-warning {
            color: var(--status-warning);
        }
        
        .character-counter {
            font-size: 0.875rem;
            color: var(--neutral-medium);
            text-align: right;
            margin-top: 0.5rem;
        }
        
        .character-counter.warning {
            color: var(--status-warning);
        }
        
        .character-counter.error {
            color: var(--status-danger);
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
});

// Export for module usage
export { ContactForm };