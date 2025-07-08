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

      function renderScholarships() {
        const container = document.getElementById('scholarshipsList');
        
        scholarships.forEach(scholarship => {
          const scholarshipCard = document.createElement('div');
          scholarshipCard.className = 'scholarship-card';
          
          scholarshipCard.innerHTML = `
            <div>
              <a href="${scholarship.url}" target="_blank" rel="noopener noreferrer" class="scholarship-title">
                ${scholarship.name}
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                </svg>
              </a>
              <p class="scholarship-description">${scholarship.description}</p>
              <div class="scholarship-tags">
                <span class="tag recommended">Recommended</span>
                <span class="tag active">Active</span>
              </div>
            </div>
          `;
          
          container.appendChild(scholarshipCard);
        });
      }

      // Load scholarships when page loads
      document.addEventListener('DOMContentLoaded', renderScholarships);