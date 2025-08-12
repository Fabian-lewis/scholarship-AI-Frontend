import requests
from bs4 import BeautifulSoup
from scraper.utils.tagging import extract_countries, extract_levels, extract_fields
from scraper.utils.date_utils import parse_deadline

def scrape_opprtunities_for_africans():
    url = "https://www.opportunitiesforafricans.com/category/scholarships/"
    response = requests.get(url)

    # Confirm the website is reachable
    if response.status_code != 200:
        print(f"[ERROR] Failed to retrieve data from {url}")
        return []
    
    print(f"[INFO] Successfully retrieved data from {url}")

    # Parse the HTML content
    soup = BeautifulSoup(response.content, "html.parser")

    # Find all scholarship posts
    scholarship_posts = soup.find_all("article")
    
    scholarships = []
    for post in scholarship_posts:
        title_tag = post.find("h2", class_="entry-title")

        # If no title tag is found, skip this post
        if not title_tag:
            continue

        name = title_tag.get_text(strip=True)
        link = title_tag.find("a")["href"]

        description_tag = post.find("div", class_="entry-summary")
        deadline = None

        # Extract deadline from description
        if description_tag:
            description = description_tag.get_text(strip=True)
            for line in description.split("\n"):
                if "deadine" in line.lower():
                    deadline = parse_deadline(line.strip())
                    break
        else:
            detail_response = requests.get(link)
            if detail_response.status_code == 200:
                detail_soup = BeautifulSoup(detail_response.content, "html.parser")
                content_section = detail_soup.find("div", id="penci-post-entry-inner")
                if content_section:
                    for junk in content_section.find_all(["script", "style", "ins", "iframe"]):
                        junk.decompose() # Remove unwanted elements
                    description = content_section.get_text(separator="\n").strip()
                    for p in content_section.find_all("p"):
                        text = p.get_text(strip=True)
                        deadline = parse_deadline(text)
                        break
                else:
                    description = "No Description Found"
            else:
                description = "No Description Found"
        
        country_tags = extract_countries(description)
        level_tags = extract_levels(description)
        field_tags = extract_fields(description)


        scholarships.append({
            "name" : name,
            "link" : link,
            "description" : description,
            "deadline" : deadline,
            "countries" : country_tags,
            "levels" : level_tags,
            "fields" : field_tags
        })
    
    # Remove Duplicates
    unique_scholarships = {f"{s['name']}_{s['link']}": s for s in scholarships} # Create a unique key based on name and link
    scholarships = list(unique_scholarships.values())

    print(f"[INFO] Found {len(scholarships)} scholarships from Opportunities for Africans")

    return scholarships