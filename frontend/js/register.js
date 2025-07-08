// frontend/js/register.js
document.getElementById("register-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const url = "http://localhost:5000/register";
  const formData = new FormData(this);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    country: formData.get("country"),
    level: formData.get("level"),
    interests: formData.get("interests").split(",").map(item => item.trim())
  };

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
      window.location.href = "dashboard.html";
    } else {
      alert("❌ Registration failed: " + result.error);
    }

  } catch (error) {
    alert("❌ Network error: " + error.message);
  }
});
