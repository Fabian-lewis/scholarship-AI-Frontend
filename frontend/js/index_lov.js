
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
e.preventDefault();

const submitBtn = document.getElementById('submitBtn');
const formData = new FormData(this);

// Define the API endpoint
const url = "https://scholarship-ai-backend-ny79.onrender.com";

// Show loading state
submitBtn.disabled = true;
submitBtn.innerHTML = `
    <div class="loading-spinner"></div>
    Processing...
`;

// Simulate form submission
await new Promise(resolve => setTimeout(resolve, 5500)); // 

// Get form data
const data = {
    name: formData.get("fullName"),
    email: formData.get("email"),
    country: formData.get("country"),
    level: formData.get("educationLevel"),
    interests: formData.get("interests").split(",").map(item => item.trim())
};

console.log('Registration submitted:', data);

 try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert("🎉 Registration successful! Redirecting to your dashboard...");
      localStorage.setItem("userEmail", data.email);
      window.location.href = "dashboard_lov.html";
    } else {
      alert("❌ Registration failed: " + result.error);
    }

  } catch (error) {
    alert("❌ Network error: " + error.message);
  }




// Navigate to dashboard after delay
// setTimeout(() => {
//     window.location.href = 'dashboard_lov.html';
// }, 2000);
});