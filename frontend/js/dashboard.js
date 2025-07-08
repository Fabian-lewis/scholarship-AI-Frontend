// frontend/js/dashboard.js
document.addEventListener("DOMContentLoaded", async () => {
  const email = 'fabian@example.com' //localStorage.getItem("userEmail");

  const url = `http://localhost:5000/scholarships?email=${email}`;

//   if (!email) {
//     alert("Please register first.");
//     window.location.href = "index.html";
//     return;
//   }

  try {
    const response = await fetch(url);
    const scholarships = await response.json();

    const list = document.getElementById("scholarship-list");
    if (scholarships.length === 0) {
      list.innerHTML = "<li>No scholarships found for your profile yet 😕</li>";
      return;
    }

    scholarships.forEach(s => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${s.link}" target="_blank">${s.name}</a> - ${s.description}`;
      list.appendChild(li);
    });

  } catch (error) {
    alert("Failed to fetch scholarships: " + error.message);
  }
});
