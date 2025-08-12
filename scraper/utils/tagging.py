## Helper functions for tagging text with educational levels
def extract_levels(text):
    levels = ['undergraduate', 'bachelor', 'masters', 'phd', 'doctorate', 'postgraduate', 'graduate']
    return [level for level in levels if level in text.lower()]

## Helper functions for tagging text with fields of study
def extract_fields(text):
    fields = ['engineering', 'science', 'arts', 'business', 'law', 'medicine', 'social sciences', 'humanities', 'computer science', 'technology', 'education', 'environmental studies', 'agriculture', 'ai', 'data science', 'information technology']
    found = [field for field in fields if field in text.lower()]
    return found if found else ['general']

## Helper functions for tagging text with countries
def extract_countries(text):
    countries = ['africa', 'nigeria', 'kenya', 'south africa', 'ghana', 'uganda', 'tanzania', 'zambia', 'rwanda', 'ethiopia']
    found = [country for country in countries if country in text.lower()]
    return found if found else ['general']