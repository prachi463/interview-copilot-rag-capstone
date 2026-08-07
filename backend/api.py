"""
Flask API for the RAG Interview Copilot.
Endpoints: POST /api/query, GET /api/health
"""
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from retriever import HybridRetriever
from rag_chain import answer_query

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend (any origin)

# Load RAG components at startup
try:
    retriever = HybridRetriever()
    KB_READY = True
except Exception as e:
    KB_READY = False
    KB_ERROR = str(e)

history = []  # in-memory conversation history per session


@app.route("/api/health", methods=["GET"])
def health():
    """Simple health check."""
    return jsonify({
        "status": "ok",
        "kb_ready": KB_READY,
        "kb_error": KB_ERROR if not KB_READY else None,
    })


@app.route("/api/query", methods=["POST"])
def query():
    """
    POST /api/query
    Body: {"query": "your question here"}
    Response: {"answer": "...", "route": "...", "sources": [...], "backend": "..."}
    """
    if not KB_READY:
        return jsonify({"error": f"Knowledge base not ready: {KB_ERROR}"}), 503

    try:
        data = request.json
        user_query = data.get("query", "").strip()

        if not user_query:
            return jsonify({"error": "query field is required and non-empty"}), 400

        result = answer_query(user_query, retriever, history)

        # Add to session history
        history.append({"q": user_query, "a": result["answer"]})

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/history", methods=["GET"])
def get_history():
    """Retrieve conversation history."""
    return jsonify({"history": history})


@app.route("/api/history", methods=["DELETE"])
def clear_history():
    """Clear conversation history."""
    global history
    history = []
    return jsonify({"status": "cleared"})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
