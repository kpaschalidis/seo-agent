import os
from typing import List

from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
import nltk

from .tools import SEOAnalysisTools

from dotenv import load_dotenv

load_dotenv()

# Configuration from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4o")
MODEL_TEMPERATURE = float(os.getenv("MODEL_TEMPERATURE", "0.2"))


llm = ChatOpenAI(model=MODEL_NAME, temperature=MODEL_TEMPERATURE)

# Download NLTK data
nltk_data_dir = os.path.expanduser("~/nltk_data")
nltk.data.path.append(nltk_data_dir)

nltk.download("punkt_tab", download_dir=nltk_data_dir)
nltk.download("stopwords", download_dir=nltk_data_dir)


# ====== AGENTS ======
visual_content_analyst = Agent(
    role="Visual & Content SEO Analyst",
    goal="Analyze webpage visual elements, headings, and content to identify SEO optimization opportunities",
    backstory="""You are an experienced visual and content SEO analyst with expertise in analyzing webpage
    structure, content quality, headings, and visual elements. You specialize in identifying issues that
    affect both search engine rankings and user experience. Your recommendations balance SEO best practices
    with usability and conversion optimization.""",
    verbose=True,
    llm=llm,
    tools=[
        SEOAnalysisTools.analyze_page_structure,
        SEOAnalysisTools.analyze_visual_elements,
    ],
)

landing_page_specialist = Agent(
    role="Landing Page SEO Specialist",
    goal="Optimize landing pages for long-term SEO performance and conversion",
    backstory="""You are a landing page optimization expert who specializes in creating high-performing
    pages that rank well for years. You understand both the technical SEO aspects of landing pages and
    the conversion elements that make them effective. You excel at balancing immediate conversion needs
    with long-term SEO value, and you know how to create evergreen content that continues to perform.""",
    verbose=True,
    llm=llm,
    tools=[SEOAnalysisTools.analyze_landing_page],
)


# ====== TASKS ======
def create_analysis_tasks(url: str) -> List[Task]:
    """Create tasks for analyzing a webpage and optimizing landing pages."""

    task_analyze_content = Task(
        description=f"""
        Perform a comprehensive analysis of the webpage at {url}.
        
        Analyze the following elements in detail:
        1. Heading structure (H1-H6) - ensure proper hierarchy and keyword usage
        2. Content quality, length, and relevance
        3. Keyword usage and distribution throughout content
        4. Meta title and description effectiveness
        5. Image usage including alt text and optimization
        
        Provide specific recommendations for:
        - Improving heading structure
        - Enhancing content quality and completeness
        - Optimizing keyword usage without keyword stuffing
        - Fixing any content-related SEO issues
        
        Your analysis should be detailed and actionable, with specific examples from the page.
        """,
        agent=visual_content_analyst,
        expected_output="A comprehensive content analysis with specific recommendations for improvement",
    )

    task_analyze_visual = Task(
        description=f"""
        Perform a detailed visual analysis of the webpage at {url}.
        
        Analyze the following visual elements:
        1. Image sizes, formats, and loading impact
        2. Visual hierarchy and its SEO implications
        3. Mobile-friendliness of visual elements
        4. Layout structure and its impact on content visibility
        5. Use of visual elements to enhance key content
        
        Provide specific recommendations for:
        - Improving image optimization for both SEO and user experience
        - Enhancing visual hierarchy to highlight important content
        - Making visual elements more effective for both users and search engines
        - Balancing visual appeal with page performance
        
        Your analysis should include specific examples and actionable recommendations.
        """,
        agent=visual_content_analyst,
        expected_output="A detailed visual element analysis with specific optimization recommendations",
    )

    task_optimize_landing_page = Task(
        description=f"""
        Create a comprehensive long-term SEO strategy for the landing page at {url}.
        
        Your strategy should include:
        1. Content recommendations for evergreen performance
        2. Structural improvements for long-term SEO value
        3. Optimization strategies that will remain effective over time
        4. Balance between conversion elements and long-term SEO
        5. Maintenance and update recommendations to keep the page relevant
        
        Consider both immediate improvements and long-term strategies:
        - How to make the landing page rank well initially
        - How to ensure it continues to perform well for years
        - What ongoing updates or changes should be implemented
        - How to balance immediate conversion needs with long-term SEO value
        
        Provide a detailed implementation plan with specific recommendations.
        """,
        agent=landing_page_specialist,
        context=[task_analyze_content, task_analyze_visual],
        expected_output="A comprehensive long-term SEO strategy for the landing page with implementation plan",
    )

    return [task_analyze_content, task_analyze_visual, task_optimize_landing_page]


# ====== CREW SETUP ======
def create_seo_analysis_crew(url: str) -> Crew:
    """Create and configure the SEO analysis crew with visual and landing page optimization focus."""

    tasks = create_analysis_tasks(url)

    seo_crew = Crew(
        agents=[visual_content_analyst, landing_page_specialist],
        tasks=tasks,
        verbose=True,
        process=Process.sequential,
    )

    return seo_crew
