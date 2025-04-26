# SEO Analysis API

import os
import time
from threading import Thread
from queue import Queue
import uuid
from flask import Flask, request, jsonify
from .seo_analysis import SEOAnalysisTools, create_seo_analysis_crew
from dotenv import load_dotenv

load_dotenv()

# Configuration from environment variables
PORT = os.getenv("PORT")

app = Flask(__name__)

# In-memory store for analysis results
analysis_results = {}
analysis_queue = Queue()


def process_analysis_queue():
    while True:
        if not analysis_queue.empty():
            analysis_id, url = analysis_queue.get()
            try:
                analysis_results[analysis_id]["status"] = "running"

                seo_crew = create_seo_analysis_crew(url)
                crew_result = seo_crew.kickoff()

                result = {
                    "analysis_text": str(crew_result),
                    "summary": (
                        str(crew_result).split("\n\n")[0] if str(crew_result) else ""
                    ),
                    "timestamp": time.time(),
                }

                # Collect all task outputs
                task_outputs = []
                for idx, task in enumerate(seo_crew.tasks, start=1):
                    task_outputs.append(
                        {
                            "task_number": idx,
                            "task_name": task.description.strip().splitlines()[0],
                            "task_output": (str(task.output)),
                        }
                    )

                result = {
                    "tasks": task_outputs,
                    "result_summary": result["summary"],
                    "analysis_text": result["analysis_text"],
                    "url": url,
                    "timestamp": time.time(),
                }

                analysis_results[analysis_id]["status"] = "completed"
                analysis_results[analysis_id]["result"] = result
                analysis_results[analysis_id]["completed_at"] = time.time()

            except Exception as e:
                import traceback

                analysis_results[analysis_id]["status"] = "failed"
                analysis_results[analysis_id]["error"] = str(e)
                analysis_results[analysis_id][
                    "error_traceback"
                ] = traceback.format_exc()
                print(f"Error processing analysis {analysis_id}: {str(e)}")
                print(traceback.format_exc())
            finally:
                analysis_queue.task_done()
        else:
            time.sleep(1)


# Background worker
worker_thread = Thread(target=process_analysis_queue, daemon=True)
worker_thread.start()


@app.route("/api/seo/analyze", methods=["POST"])
def request_analysis():
    """
    Endpoint to request a new SEO analysis

    Expects JSON body: {"url": "https://example.com/landing-page"}
    Returns analysis_id that can be used to check status and retrieve results
    """
    data = request.get_json()

    if not data or "url" not in data:
        return jsonify({"error": "Missing required field 'url'"}), 400

    url = data["url"]

    if not url.startswith(("http://", "https://")):
        return jsonify({"error": "URL must start with http:// or https://"}), 400

    analysis_id = str(uuid.uuid4())

    analysis_results[analysis_id] = {
        "url": url,
        "status": "queued",
        "created_at": time.time(),
        "result": None,
        "error": None,
        "completed_at": None,
    }

    analysis_queue.put((analysis_id, url))

    return jsonify(
        {
            "analysis_id": analysis_id,
            "status": "queued",
            "message": "Analysis request has been queued",
            "check_status_url": f"/api/seo/status/{analysis_id}",
        }
    )


@app.route("/api/seo/status/<analysis_id>", methods=["GET"])
def check_status(analysis_id):
    """
    Endpoint to check the status of an analysis
    """
    if analysis_id not in analysis_results:
        return jsonify({"error": "Analysis ID not found"}), 404

    analysis = analysis_results[analysis_id]

    response = {
        "analysis_id": analysis_id,
        "url": analysis["url"],
        "status": analysis["status"],
        "created_at": analysis["created_at"],
    }

    if analysis["completed_at"]:
        response["completed_at"] = analysis["completed_at"]

    if analysis["status"] == "failed" and analysis["error"]:
        response["error"] = analysis["error"]

    if analysis["status"] == "completed":
        response["result_url"] = f"/api/seo/result/{analysis_id}"

    return jsonify(response)


@app.route("/api/seo/result/<analysis_id>", methods=["GET"])
def get_results(analysis_id):
    """
    Endpoint to retrieve the results of a completed analysis
    """
    if analysis_id not in analysis_results:
        return jsonify({"error": "Analysis ID not found"}), 404

    analysis = analysis_results[analysis_id]

    if analysis["status"] != "completed":
        return (
            jsonify(
                {"error": "Analysis not completed yet", "status": analysis["status"]}
            ),
            400,
        )

    return jsonify(
        {
            "analysis_id": analysis_id,
            "url": analysis["url"],
            "status": "completed",
            "created_at": analysis["created_at"],
            "completed_at": analysis["completed_at"],
            "result": analysis["result"],
        }
    )


@app.route("/api/seo/analyze-quick", methods=["POST"])
def quick_analysis():
    """
    Endpoint for a quicker, simpler analysis without using CrewAI
    This is useful for initial checks or when full analysis would be too time-consuming

    Expects JSON body: {"url": "https://example.com/landing-page"}
    Returns basic structure and visual analysis directly
    """
    data = request.get_json()

    if not data or "url" not in data:
        return jsonify({"error": "Missing required field 'url'"}), 400

    url = data["url"]

    if not url.startswith(("http://", "https://")):
        return jsonify({"error": "URL must start with http:// or https://"}), 400

    try:
        # Run the direct analysis
        structure_analysis = SEOAnalysisTools.analyze_page_structure.run(url)

        return jsonify(
            {
                "url": url,
                "analysis_type": "quick",
                "structure_analysis": structure_analysis,
                "message": "For complete analysis with recommendations, use the /api/seo/analyze endpoint",
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/seo/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify(
        {
            "status": "healthy",
            "queue_size": analysis_queue.qsize(),
            "active_analyses": len(analysis_results),
        }
    )


# Clean up old analyses periodically
@app.route("/api/seo/maintenance", methods=["POST"])
def cleanup_old_analyses():
    """
    Administrative endpoint to clean up old analyses
    Expects JSON body: {"api_key": "your-admin-key", "max_age_hours": 24}
    """
    data = request.get_json()

    # TODO: proper authentication
    if not data or data.get("api_key") != os.environ.get("ADMIN_API_KEY", "admin-key"):
        return jsonify({"error": "Unauthorized"}), 401

    max_age_hours = data.get("max_age_hours", 24)
    max_age_seconds = max_age_hours * 3600
    current_time = time.time()

    keys_to_remove = []
    for analysis_id, analysis in analysis_results.items():
        if current_time - analysis["created_at"] > max_age_seconds:
            keys_to_remove.append(analysis_id)

    for key in keys_to_remove:
        del analysis_results[key]

    return jsonify(
        {
            "status": "success",
            "removed_count": len(keys_to_remove),
            "remaining_count": len(analysis_results),
        }
    )


if __name__ == "__main__":
    # For development only - use gunicorn or similar for production
    port = int(os.environ.get("PORT", PORT))
    print(f"Server running on port ${PORT}... ")
    app.run(host="0.0.0.0", port=port, debug=True)
