
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
e.preventDefault();

const submitBtn = document.getElementById('submitBtn');
const formData = new FormData(this);

// Show loading state
submitBtn.disabled = true;
submitBtn.innerHTML = `
    <div class="loading-spinner"></div>
    Processing...
`;

// Simulate form submission
await new Promise(resolve => setTimeout(resolve, 1500));

// Get form data
const data = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    country: formData.get('country'),
    educationLevel: formData.get('educationLevel'),
    interests: formData.get('interests')
};

console.log('Registration submitted:', data);

// Show success message
alert('Registration successful! Finding your scholarship matches...');

// Navigate to dashboard after delay
setTimeout(() => {
    window.location.href = 'dashboard_lov.html';
}, 2000);
});