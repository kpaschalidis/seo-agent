import os
import requests
from typing import Dict, Any
from urllib.parse import urljoin, urlparse
import io
import re

from bs4 import BeautifulSoup
from nltk.tokenize import sent_tokenize, word_tokenize
from PIL import Image

from nltk.corpus import stopwords
from crewai.tools import tool
from dotenv import load_dotenv

load_dotenv()

USER_AGENT = os.getenv(
    "USER_AGENT",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
)


class SEOAnalysisTools:
    """Tools for visual, heading, and content analysis of web pages."""

    @staticmethod
    def fetch_page_content(url: str) -> tuple:
        """Fetch a webpage's HTML content and return BS4 object and raw HTML."""
        headers = {"User-Agent": USER_AGENT}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        return soup, response.text

    @staticmethod
    @tool("Analyze the page structure of a given URL")
    def analyze_page_structure(url: str) -> Dict[str, Any]:
        """Analyze the page structure including headings, content, and metadata."""
        soup, html = SEOAnalysisTools.fetch_page_content(url)

        # Extract metadata
        title = soup.title.text.strip() if soup.title else ""
        meta_description = ""
        meta_description_tag = soup.find("meta", {"name": "description"})
        if meta_description_tag and "content" in meta_description_tag.attrs:
            meta_description = meta_description_tag["content"]

        # Extract all headings
        headings = {
            "h1": [h.text.strip() for h in soup.find_all("h1")],
            "h2": [h.text.strip() for h in soup.find_all("h2")],
            "h3": [h.text.strip() for h in soup.find_all("h3")],
            "h4": [h.text.strip() for h in soup.find_all("h4")],
            "h5": [h.text.strip() for h in soup.find_all("h5")],
            "h6": [h.text.strip() for h in soup.find_all("h6")],
        }

        # Extract main content (simplified approach)
        # Remove script, style, header, footer, and nav elements
        for element in soup(["script", "style", "header", "footer", "nav"]):
            element.decompose()

        # Get page text and split into paragraphs
        page_text = soup.get_text(separator=" ", strip=True)
        paragraphs = [p for p in page_text.split("\n") if p.strip()]

        # Analyze content
        word_count = len(word_tokenize(page_text))
        sentence_count = len(sent_tokenize(page_text))
        stop_words = set(stopwords.words("english"))
        words = [w.lower() for w in word_tokenize(page_text) if w.isalnum()]
        filtered_words = [w for w in words if w not in stop_words]

        # Calculate keyword density
        word_freq = {}
        for word in filtered_words:
            if len(word) > 3:  # Only count words with more than 3 characters
                word_freq[word] = word_freq.get(word, 0) + 1

        # Sort by frequency
        sorted_keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        top_keywords = sorted_keywords[:20]

        # Extract images and their attributes
        images = []
        for img in soup.find_all("img"):
            if img.get("src"):
                image_data = {
                    "src": img.get("src"),
                    "alt": img.get("alt", ""),
                    "width": img.get("width", ""),
                    "height": img.get("height", ""),
                    "has_alt_text": bool(img.get("alt")),
                }
                images.append(image_data)

        # Create structured analysis object
        analysis = {
            "url": url,
            "title": title,
            "title_length": len(title),
            "meta_description": meta_description,
            "meta_description_length": len(meta_description),
            "headings": headings,
            "h1_count": len(headings["h1"]),
            "content_stats": {
                "word_count": word_count,
                "sentence_count": sentence_count,
                "paragraphs": len(paragraphs),
                "avg_words_per_sentence": word_count / max(sentence_count, 1),
            },
            "top_keywords": top_keywords,
            "images": {
                "total_count": len(images),
                "with_alt_text": sum(1 for img in images if img["has_alt_text"]),
                "without_alt_text": sum(1 for img in images if not img["has_alt_text"]),
                "image_data": images[:10],  # Limit to first 10 images
            },
        }

        return analysis

    @staticmethod
    @tool("Analyze visual elements of a webpage")
    def analyze_visual_elements(url: str) -> Dict[str, Any]:
        """Analyze visual elements of the page including images and layout."""
        soup, html = SEOAnalysisTools.fetch_page_content(url)
        base_url = "{0.scheme}://{0.netloc}".format(urlparse(url))

        # Extract images for visual analysis
        images_data = []
        for img in soup.find_all("img"):
            if img.get("src"):
                # Construct absolute URL if relative
                img_url = img["src"]
                if not img_url.startswith(("http://", "https://")):
                    img_url = urljoin(base_url, img_url)

                try:
                    # Get image dimensions and size
                    img_response = requests.get(img_url, stream=True)
                    if img_response.status_code == 200:
                        img_size = len(img_response.content)
                        img_file = io.BytesIO(img_response.content)
                        img_obj = Image.open(img_file)
                        width, height = img_obj.size

                        img_data = {
                            "url": img_url,
                            "alt": img.get("alt", ""),
                            "width": width,
                            "height": height,
                            "size_kb": img_size / 1024,
                            "format": img_obj.format,
                            "has_alt_text": bool(img.get("alt")),
                        }
                        images_data.append(img_data)
                except Exception as e:
                    # If we can't analyze the image, add basic info
                    images_data.append(
                        {
                            "url": img_url,
                            "alt": img.get("alt", ""),
                            "error": str(e),
                            "has_alt_text": bool(img.get("alt")),
                        }
                    )

        # Analyze page layout
        layout_analysis = {
            "viewport_meta": bool(soup.find("meta", {"name": "viewport"})),
            "css_count": len(soup.find_all("link", {"rel": "stylesheet"})),
            "javascript_count": len(soup.find_all("script")),
            "iframe_count": len(soup.find_all("iframe")),
            "table_count": len(soup.find_all("table")),
            "div_count": len(soup.find_all("div")),
            "responsive_elements": bool(
                soup.find_all(class_=re.compile(r"responsive|mobile|flex|grid"))
            ),
        }

        return {
            "url": url,
            "images_analysis": {
                "count": len(images_data),
                "data": images_data[:5],  # Limit to first 5 for brevity
            },
            "layout_analysis": layout_analysis,
        }

    @staticmethod
    @tool("Comprehensive SEO and UX landing page analysis")
    def analyze_landing_page(url: str) -> Dict[str, Any]:
        """Comprehensive analysis of a landing page for long-term SEO optimization."""
        # Combine both analyses
        structure_analysis = SEOAnalysisTools.analyze_page_structure.run(url)
        visual_analysis = SEOAnalysisTools.analyze_visual_elements.run(url)

        # Get additional landing page specific elements
        soup, html = SEOAnalysisTools.fetch_page_content(url)

        # Check for important landing page elements
        call_to_action = bool(
            soup.find_all(
                string=re.compile(
                    r"sign up|get started|try|buy|subscribe|download", re.I
                )
            )
        )
        form_elements = len(soup.find_all("form"))
        testimonials = bool(
            soup.find_all(
                string=re.compile(r"testimonial|review|customer|client", re.I)
            )
        )
        benefits_section = bool(
            soup.find_all(string=re.compile(r"benefit|feature|why|advantage", re.I))
        )

        # Check for schema markup
        schema_markup = bool(soup.find_all("script", {"type": "application/ld+json"}))

        # Check for Social Sharing elements
        social_elements = bool(
            soup.find_all(
                class_=re.compile(r"social|share|facebook|twitter|linkedin", re.I)
            )
        )

        # Check for canonical URL
        canonical = soup.find("link", {"rel": "canonical"})
        canonical_url = canonical["href"] if canonical else None

        # Additional landing page analysis
        landing_page_elements = {
            "has_clear_value_proposition": bool(soup.find_all(["h1", "h2"], limit=2)),
            "has_call_to_action": call_to_action,
            "form_count": form_elements,
            "has_testimonials": testimonials,
            "has_benefits_section": benefits_section,
            "has_schema_markup": schema_markup,
            "has_social_sharing": social_elements,
            "canonical_url": canonical_url,
            "mobile_friendly_indicators": visual_analysis["layout_analysis"][
                "viewport_meta"
            ],
        }

        # Combine analyses into comprehensive report
        return {
            "url": url,
            "landing_page_elements": landing_page_elements,
            "structure_analysis": structure_analysis,
            "visual_analysis": visual_analysis["images_analysis"],
            "layout_analysis": visual_analysis["layout_analysis"],
        }
