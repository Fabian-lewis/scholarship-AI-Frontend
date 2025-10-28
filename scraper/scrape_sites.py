# Calls individual scrapers
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
from bs4 import BeautifulSoup
from backend.utils.supabase_client import supabase
from backend.utils.tagging import extract_countries, extract_levels, extract_fields
from backend.utils.date_utils import parse_deadline


def scrape_scholarships():
    url = "https://www.opportunitiesforafricans.com/category/scholarships/"
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to retrieve data from {url}")
        return []

    print(f"Successfully retrieved data from {url}")
    soup = BeautifulSoup(response.content, "html.parser")
    posts = soup.find_all("article")

    scholarships = []

    for post in posts:
        title_tag = post.find("h2", class_="entry-title")
        if not title_tag:
            continue

        name = title_tag.get_text(strip=True)
        link = title_tag.find("a")["href"]

        # Try to get the short description
        description_tag = post.find("div", class_="entry-summary")
        if description_tag:
            description = description_tag.get_text(strip=True)

            # Extract deadline from the description if available
            deadline = None
            for line in description.split("\n"):
                if "deadline" in line.lower():
                    deadline = parse_deadline(line.strip()) # Extract deadline from the line
                    break
        else:
            # If no short description, follow the link for full content
            detail_response = requests.get(link)
            if detail_response.status_code == 200:
                detail_soup = BeautifulSoup(detail_response.content, "html.parser")
                content_section = detail_soup.find("div", id="penci-post-entry-inner")
                
                deadline = None  # Initialize deadline variable
                
                if content_section:
                    # Clean up content (remove scripts, ads, etc.)
                    for junk in content_section.find_all(["script", "style", "ins", "iframe"]):
                        junk.decompose()

                    description = content_section.get_text(separator="\n").strip()

                    # Extract deadline from the p tags
                    for p in content_section.find_all("p"):
                        text = p.get_text(strip=True)
                        if "deadline" in text.lower():
                            deadline_raw = text
                            deadline = parse_deadline(deadline_raw)
                            break
                else:
                    description = "No description available"
            else:
                description = "No description available"

        # NLP-based tagging
        country_tags = extract_countries(description)
        level_tags = extract_levels(description)
        field_tags = extract_fields(description)

        try:
            scholarships.append({
                "name": name,
                "link": link,
                "description": description,
                "country_tags": country_tags,
                "level_tags": level_tags,
                "field_tags": field_tags,
                "deadline": deadline
            })

        except Exception as e:
            print(f"Error occurred while processing {name}: {e}")

    
    # Check if scholarships were found
    # If no scholarships found, return an empty list
    if not scholarships:
        print("No scholarships found.")
        return []
    # Scholarships found
    else:
        # Remove duplicates based on name and link
        unique_scholarships = {f"{scholarship['name']}_{scholarship['link']}": scholarship for scholarship in scholarships}
        scholarships = list(unique_scholarships.values())

        # Print the number of scholarships found
        print(f"Found {len(scholarships)} scholarships.")

        # Save to Supabase
        supabase.table("scholarships").insert(scholarships).execute()

    print(f"Added: {name} - {link}")

if __name__ == "__main__":
    scrape_scholarships()
    print("Scraping completed.")
