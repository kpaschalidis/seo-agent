# SEO Analysis Crew
Prototype for the SEO Analysis Crew powered by CrewAI. Leverages GPT-4 to perform content analysis, visual analysis, and generate actionable long-term SEO strategies.

## Project Structure

```plaintext
root/
  applications/
    api/      # Flask + CrewAI SEO analysis API
```

## API
Analyzes landing pages for SEO optimization using CrewAI agents and provides structured recommendations.

## Getting Started

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

> Make sure you have Python 3.10+ installed. Recommended 3.12.3.

### 2. Set up environment variables

Create a `.env` file in `applications/api/` with the following content:

```bash
OPENAI_API_KEY=your-openai-key
PORT=5000
```

### 3. Run the API server

```bash
cd applications/api
python -m applications.api.src.api
```

By default, the server will start at `http://localhost:5000`.

## API Endpoints

### Request a full SEO analysis

```bash
curl -X POST http://localhost:5000/api/seo/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com/"}'
```

**Response:**

```json
{
  "analysis_id": "uuid-here",
  "status": "queued",
  "message": "Analysis request has been queued",
  "check_status_url": "/api/seo/status/uuid-here"
}
```

### Check analysis status

```bash
curl http://localhost:5000/api/seo/status/uuid-here
```

**Response example:**

```json
{
  "analysis_id": "uuid-here",
  "url": "https://www.example.com/",
  "status": "completed",
  "created_at": 1714151000.123456,
  "completed_at": 1714151300.654321,
  "result_url": "/api/seo/result/uuid-here"
}
```

### Retrieve analysis results

```bash
curl http://localhost:5000/api/seo/result/uuid-here
```

**Response example:**

```json
{
  "analysis_id": "uuid-here",
  "url": "https://www.example.com/",
  "status": "completed",
  "created_at": 1714151000.123456,
  "completed_at": 1714151300.654321,
  "result": {
    "tasks": [
      {
        "task_number": 1,
        "task_name": "Perform a comprehensive analysis of the webpage at https://www.example.com/",
        "task_output": "Detailed content analysis output..."
      },
      {
        "task_number": 2,
        "task_name": "Perform a detailed visual analysis of the webpage at https://www.example.com/",
        "task_output": "Detailed visual analysis output..."
      },
      {
        "task_number": 3,
        "task_name": "Create a comprehensive long-term SEO strategy for the landing page at https://www.example.com/",
        "task_output": "Landing page SEO strategy output..."
      }
    ],
    "result_summary": "Summary of the main recommendations...",
    "analysis_text": "Full analysis text...",
    "url": "https://www.example.com/",
    "timestamp": 1714151300.654321
  }
}
```

### Quick structure analysis (fast check without CrewAI)

```bash
curl -X POST http://localhost:5000/api/seo/analyze-quick \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com/"}'
```

**Response example:**

```json
{
  "url": "https://www.example.com/",
  "analysis_type": "quick",
  "structure_analysis": "Page structure findings here...",
  "message": "For complete analysis with recommendations, use the /api/seo/analyze endpoint"
}
```
 