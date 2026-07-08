import requests
import xml.etree.ElementTree as ET
import re

# CONFIG
WP_URL = "https://ubfsf.org/wp-json/wp/v2"
WP_USER = "agiri"
WP_APP_PASSWORD = "UnitedFamily2026!" # From your screenshot
INPUT_XML = "ubfsf_export.xml" # Your exported XML file

def nuclear_cleaner(text):
    if not text: return ""
    # Strip ALL bracketed shortcodes [et_pb_section], etc.
    return re.sub(r'\[[\s\S]*?\]', '', text).strip()

tree = ET.parse(INPUT_XML)
root = tree.getroot()
ns = {'content': 'http://purl.org/rss/1.0/modules/content/', 'wp': 'http://wordpress.org/export/1.2/'}

for item in root.find('channel').findall('item'):
    title = item.find('title').text
    content = nuclear_cleaner(item.find('content:encoded', ns).text)
    post_type = item.find('wp:post_type', ns).text
    
    if post_type in ['post', 'page']:
        endpoint = f"{WP_URL}/{post_type}s"
        requests.post(endpoint, json={"title": title, "content": content, "status": "draft"}, auth=(WP_USER, WP_APP_PASSWORD))
        print(f"✅ Refactored: {title}")
