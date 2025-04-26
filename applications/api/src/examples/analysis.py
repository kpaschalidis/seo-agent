from ..seo_analysis.crew import create_seo_analysis_crew

if __name__ == "__main__":
    landing_page_url = "https://www.eon.xyz/"

    # Create and run the SEO analysis crew
    seo_crew = create_seo_analysis_crew(landing_page_url)
    result = seo_crew.kickoff()

    print("\n==== SEO ANALYSIS RESULTS ====")

    for idx, task in enumerate(seo_crew.tasks, start=1):
        print(f"\n--- Task {idx}: {task.description.strip().splitlines()[0]} ---")
        print(task.output)

    print("\n=== FINAL RESULT ===")
    print(result)
