// File: frontend/js/dashboard_lov.js
// frontend/js/dashboard_lov.js
const scholarships = [
  {
    id: 1,
    name: "Global Excellence Scholarship",
    description: "Full tuition coverage for outstanding international students pursuing STEM degrees. Includes living allowance and research opportunities.",
    url: "https://example.com/global-excellence"
  },
  {
    id: 2,
    name: "AI Innovation Grant",
    description: "Supporting students passionate about artificial intelligence and machine learning. Perfect for computer science and data science majors.",
    url: "https://example.com/ai-innovation"
  },
  {
    id: 3,
    name: "Future Leaders Fellowship",
    description: "Comprehensive support for graduate students demonstrating leadership potential in their field of study.",
    url: "https://example.com/future-leaders"
  },
  {
    id: 4,
    name: "International Research Scholarship",
    description: "Funding for research-focused master's and PhD programs with emphasis on cross-cultural collaboration.",
    url: "https://example.com/international-research"
  },
  {
    id: 5,
    name: "STEM Diversity Award",
    description: "Promoting diversity in science, technology, engineering, and mathematics through targeted financial support.",
    url: "https://example.com/stem-diversity"
  }
];

async function renderScholarships()  {
  const email = localStorage.getItem("userEmail");
  const url = `https://scholarship-ai-backend-ny79.onrender.com/scholarships?email=${email}`;

  const container = document.getElementById('scholarshipsList');
  const loadingIndicator = document.getElementById('loadingIndicator');

  // Show loading indicator
  loadingIndicator.style.display = 'block';
  container.innerHTML = ''; // Clear previous content


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

      scholarships.forEach(scholarship => {
          const scholarshipCard = document.createElement('div');
          scholarshipCard.className = 'scholarship-card';
    
          scholarshipCard.innerHTML = `
              <div>
              <a href="${scholarship.link}" target="_blank" rel="noopener noreferrer" class="scholarship-title">
                  ${scholarship.name}
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                  </svg>
              </a>
              <p class="scholarship-description">${scholarship.description.substring(0,800)}...</p>
              <div class="scholarship-tags">
                  <span class="tag recommended">Recommended</span>
                  <span class="tag active">Active</span>
              </div>
              </div>
          `;
          
          container.appendChild(scholarshipCard);
      });

      // Update the stats
      const stats = document.getElementById('totalMatches');
      stats.innerHTML = `<p> ${scholarships.length}</p>`;

      const matchScore = document.getElementById('matchScore');
      // Random match score for demo between 90% and 100%
      matchScore.innerHTML = `<p>${Math.floor(Math.random() * 11) + 90}%</p>`;
      // Random new scholarships this week
      const newThisWeek = document.getElementById('newThisWeek');
      newThisWeek.innerHTML = `<p>${Math.floor(Math.random() * 5) + 1}</p>`;

  } catch (error) {
      console.error("Error fetching scholarships:", error);
      container.innerHTML = "<p class='error'>Failed to load scholarships. Please try again later.</p>";
  }
  finally {
      // Hide loading indicator
      loadingIndicator.style.display = 'none';
  }
  
  
}


// Check authentication and show user info
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userEmail = localStorage.getItem('userEmail');
  
  if (!isLoggedIn || !userEmail) {
    // Redirect to login if not authenticated
    window.location.href = 'login.html';
    return false;
  }
  
  // Show welcome message
  document.getElementById('welcomeMessage').textContent = `Welcome back, ${userEmail}`;
  return true;
}

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('authMethod');
  window.location.href = 'login.html';
});
// Load scholarships when page loads
// Load scholarships when page loads
document.addEventListener('DOMContentLoaded', function() {
  if (checkAuth()) {
    renderScholarships();
  }
});