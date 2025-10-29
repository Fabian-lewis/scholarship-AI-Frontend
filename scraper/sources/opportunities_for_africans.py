# scraper/sources/opportunities_for_africans.py

# Import libraries
import time
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from utils.cleaner import clean_text, parse_date_flex
from utils.save_data import save_to_json
import logging
import dateparser

logger = logging.getLogger(__name__)

# Base category URL for scholarships
BASE_CATEGORY = "https://www.opportunitiesforafricans.com/category/scholarships/"

# Custom header to identify our scrapper
HEADERS = {
    "User-Agent": "ScholarshipScraper/1.0 (+https://yourdomain.example) Python/requests"
}


def scrape_list_page(page_url):
    """
    Scrape one listing page and return a list of posts with minimal info (title + link).
    """
    resp = requests.get(page_url, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "lxml")

    posts = []
    # Try typical Wordpress article containers
    for article in soup.select("article, .post, .blog-post, .entry"):
        # find link and title
        a = article.select_one("h2 a, h1 a, .entry-title a, .post-title a, a")
        if not a:
            continue
        title = clean_text(a.get_text())
        link = urljoin(page_url, a.get("href"))
        posts.append({"title": title, "link": link})

    # Fallback: posts in .post-list li a
    if not posts:
        for a in soup.select(".post-list a"):
            title = clean_text(a.get_text())
            link = urljoin(page_url, a.get("href"))
            posts.append({"title": title, "link": link})

    return posts


def scrape_post_detail(post_url):
    """
    Scrape a single post and extract all scholarship details.
    """
    resp = requests.get(post_url, headers=HEADERS, timeout=15)
    resp.raise_for_status() # handle network errors with raise_for_status()
    soup = BeautifulSoup(resp.text, "lxml")

    # Title
    title_el = soup.select_one("h1.entry-title, h1.post-title, h1")
    title = clean_text(title_el.get_text()) if title_el else None

    # Date
    date_el = soup.select_one("time, .entry-date, .post-date, .meta-date")
    date_text = clean_text(date_el.get_text()) if date_el else ""
    published = parse_date_flex(date_text)

    # Description / content: prefer entry-content
    content_el = soup.select_one(".entry-content, .post-content, .content, article")
    description = ""
    if content_el:
        # Gather paragraphs + bullet points
        paras = [clean_text(p.get_text()) for p in content_el.select("p, li") if clean_text(p.get_text())]
        if paras:
            description = "\n\n".join(paras)
        else:
            description = clean_text(content_el.get_text())

    # External "Apply" Link
    external_link = None
    # Look for obvious CTAs
    for a in content_el.select("a") if content_el else []:
        href = a.get("href")
        txt = a.get_text(strip=True).lower()
        # Prioritize links that clearly indicate application
        if href and any(k in txt for k in ["apply", "official", "website", "portal", "link", "visit"]):
            external_link = urljoin(post_url, href)
            break
    # fallback: first external href
    if not external_link and content_el:
        for a in content_el.select("a"):
            href = a.get("href")
            if href and href.startswith("http") and "opportunitiesforafricans.com" not in href:
                external_link = href
                break

    # Tags or categories
    tags = [clean_text(t.get_text()) for t in soup.select(
        ".tags a, .post-tags a, .category a, .meta-category a, .breadcrumb a"
    )]

    # Provider (Organization or institution)
    provider = None

    # Heuristic 1: from title (often starts with "The University of ..." or "DAAD ...")
    provider_match = re.search(
        r"(University of [A-Za-z\s]+|College of [A-Za-z\s]+|DAAD|UNESCO|World Bank|Commonwealth|Mastercard Foundation|Gates Foundation|Erasmus|Fulbright)",
        title or "",
        re.IGNORECASE,
    )

    if provider_match:
        provider = clean_text(provider_match.group(0))
    else:
        # Heuristic 2: from first few lines of description
        first_lines = description.split("\n")[:5]
        for line in first_lines:
            m = re.search(
                r"(University of [A-Za-z\s]+|College of [A-Za-z\s]+|DAAD|UNESCO|World Bank|Commonwealth|Mastercard Foundation|Gates Foundation|Erasmus|Fulbright)",
                line,
                re.IGNORECASE,
            )
            if m:
                provider = clean_text(m.group(0))
                break



    # Extract other structured info heuristically
    amount, country, level, field = None, None, None, None
    content_text = description.lower()
    
    # Amount heuristic
    money_match = re.search(
        r"(\$\s?\d[\d,]*|\b\d[\d,]*\s?(usd|dollars)\b|\bfull scholarship\b|\bfully funded\b)", 
        content_text
    )
    if money_match:
        amount = money_match.group(0)

    # Country heuristic - look for "in [Country]" or list of countries
    country_match = re.search(r"in\s+([A-Z][A-Za-z &\-]+)", description)
    if country_match:
        country = country_match.group(1)

    # Level heuristic
    if "undergraduate" in content_text or "bachelor" in content_text:
        level = "Undergraduate"
    elif "master" in content_text or "postgraduate" in content_text:
        level = "Postgraduate"
    elif "phd" in content_text or "doctoral" in content_text:
        level = "PhD"

    # Field heuristic
    for term in ["computer", "engineering", "medicine", "business", "arts", "law", "science", "agriculture"]:
        if term in content_text:
            field = term.capitalize()
            break

    # --- Deadline extraction ---
    deadline = None
    possible_lines = []

    # Search for phrases that include "deadline" or similar
    for s in (content_el.stripped_strings if content_el else []):
        if any(k in s.lower() for k in ["deadline", "apply by", "closing date", "last date", "application deadline"]):
            possible_lines.append(s)

    # Try parsing date from those lines
    for phrase in possible_lines:
        parsed = dateparser.parse(phrase, settings={"PREFER_DATES_FROM": "future"})
        if parsed:
            deadline = parsed.date().isoformat()
            break

    # --- Regex fallback ---
    if not deadline:
        # Handles both "31 January 2026" and "January 31, 2026"
        date_patterns = [
            r"\b(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b",
            r"\b([A-Za-z]{3,9}\s+\d{1,2},?\s*\d{4})\b",
        ]
        for pattern in date_patterns:
            match = re.search(pattern, all_text)
            if match:
                parsed = dateparser.parse(match.group(0), settings={"PREFER_DATES_FROM": "future"})
                if parsed:
                    deadline = parsed.date().isoformat()
                    break

    result = {
        "title": title,
        "provider": provider,        # Could be parsed from tags or content later
        "amount": amount,
        "deadline": deadline,        # extract using heuristics below
        "published": published,
        "country": country,
        "level": level,
        "field": field,
        "description": description,
        "link": external_link or post_url,
        "source": "opportunitiesforafricans.com",
        "origin_url": post_url,
        "tags": tags,
    }

    return result


def scrape_all(pages=10, delay=1.0):
    """
    Scrape multiple pages from the category.
    pages: max pages to try (loop will stop if no posts found)
    delay: seconds between requests to be polite
    """
    out = []
    seen_links = set()
    for page in range(1, pages + 1):
        page_url = BASE_CATEGORY if page == 1 else urljoin(BASE_CATEGORY, f"page/{page}/")
        logger.info("Scraping list page: %s", page_url)
        
        try:
            posts = scrape_list_page(page_url)
        except requests.HTTPError as e:
            logger.warning("Stopping pagination at page %s due to HTTP error: %s", page, e)
            break
        
        if not posts:
            logger.info("No posts found on page %s, stopping.", page)
            break
        
        for p in posts:
            link = p.get("link")
            if link in seen_links:
                continue
            try:
                detail = scrape_post_detail(link)
            except Exception as e:
                logger.exception("Failed to scrape post %s: %s", link, e)
                continue
            seen_links.add(link)
            out.append(detail)
            time.sleep(delay)
        # small delay between pages
        time.sleep(delay)
    return out


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    data = scrape_all(pages=5, delay=1.0)
    print(f"Scraped {len(data)} items")
    save_to_json(data, "opportunitiesforafricans_scholarships.json")
