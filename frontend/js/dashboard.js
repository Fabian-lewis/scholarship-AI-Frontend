// frontend/js/dashboard.js
document.addEventListener("DOMContentLoaded", async () => {
  const email = localStorage.getItem("userEmail");

  const url = `http://localhost:5000/scholarships?email=${email}`;

//   if (!email) {
//     alert("Please register first.");
//     window.location.href = "index.html";
//     return;
//   }

  try {
    const response = await fetch(url);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch scholarships");
    }

    const scholarships = result.scholarships || []; // Ensure scholarships is an array

    const list = document.getElementById("scholarship-list");

    if(!Array.isArray(scholarships) || scholarships.length === 0) {
      list.innerHTML = "<li>No Scholarships found for your profile.</li>";
      return;
    }
    // if (scholarships.length === 0) {
    //   list.innerHTML = "<li>No scholarships found for your profile yet 😕</li>";
    //   return;
    // }

    scholarships.forEach(s => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${s.link}" target="_blank">${s.name}</a> - ${s.description.substring(0, 200)}...`;
      list.appendChild(li);
    });

  } catch (error) {
    alert("Failed to fetch scholarships: " + error.message);
  }
});
