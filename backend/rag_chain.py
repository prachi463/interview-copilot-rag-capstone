"""
RAG chain: query router -> hybrid retrieval -> prompt construction -> generation.

The query router is a lightweight rule-based classifier (not a full agent) that adjusts
retrieval depth and prompt framing based on question type. This keeps the system fast and
debuggable while still demonstrating an "intent-aware" retrieval strategy rather than a single
fixed top_k / fixed prompt for every question.
"""
import re

from llm_backends import get_llm

SYSTEM_PROMPT = """You are an interview-prep assistant speaking on behalf of a candidate,
using ONLY the provided context (drawn from their resume, internship reports, and project
docs) to answer. Answer in first person, as if you are the candidate speaking about their own
experience. Be concise, concrete, and specific — cite real tools, numbers, and outcomes from
the context rather than vague generalities. If the context does not contain the answer, say so
honestly instead of making something up."""

ROUTE_PATTERNS = {
    "project_technical": [
        r"\bwalk me through\b", r"\barchitecture\b", r"\btech stack\b", r"\bhow did you build\b",
        r"\bwhat challenges\b", r"\bhardest\b", r"\bdesign\b", r"\bimplement",
    ],
    "resume_fact": [
        r"\bcgpa\b", r"\bgraduat", r"\bwhen did\b", r"\bwhere did\b", r"\bwhich college\b",
        r"\bskills\b", r"\bcontact\b", r"\blinkedin\b", r"\bgithub\b",
    ],
    "behavioral": [
        r"\btell me about a time\b", r"\bteam\b", r"\bconflict\b", r"\bweakness\b",
        r"\bstrength\b", r"\bwhy should we hire\b", r"\bfail",
    ],
}

ROUTE_CONFIG = {
    "project_technical": {"top_k": 5, "hint": "Focus on architecture, tools, and measurable results."},
    "resume_fact": {"top_k": 3, "hint": "Answer directly and briefly — this is a factual lookup."},
    "behavioral": {"top_k": 4, "hint": "Frame using Situation-Task-Action-Result where relevant."},
    "general": {"top_k": 4, "hint": "Answer clearly using the most relevant available context."},
}


def route_query(query):
    q = query.lower()
    for route, patterns in ROUTE_PATTERNS.items():
        if any(re.search(p, q) for p in patterns):
            return route
    return "general"


def build_prompt(query, chunks, history, hint):
    context_block = "\n\n".join(
        f"[Source: {c['source']}]\n{c['text']}" for c in chunks
    )
    history_block = ""
    if history:
        history_block = "\n\nRecent conversation:\n" + "\n".join(
            f"Q: {h['q']}\nA: {h['a']}" for h in history[-2:]
        )

    user_prompt = f"""Context from the candidate's documents:
{context_block}
{history_block}

Guidance: {hint}

Question: {query}

Answer as the candidate, in first person, using only the context above."""
    return user_prompt


def compose_extractive_answer(query, chunks):
    """Fallback used when no LLM API key is configured. Not a generative answer — a direct,
    clearly-labelled excerpt of the most relevant material so the app still returns something
    useful and honest about its own limitation."""
    if not chunks:
        return "I couldn't find anything relevant to that in the knowledge base."
    lines = [
        "*(No LLM API key configured — showing the most relevant excerpt(s) directly instead "
        "of a generated answer. Add GROQ_API_KEY or OPENAI_API_KEY for natural-language answers.)*",
        "",
    ]
    for c in chunks[:2]:
        lines.append(f"**From {c['source']}:**")
        lines.append(c["text"].strip())
        lines.append("")
    return "\n".join(lines)


def answer_query(query, retriever, history=None):
    history = history or []
    route = route_query(query)
    config = ROUTE_CONFIG[route]

    chunks = retriever.retrieve(query, top_k=config["top_k"])
    llm = get_llm()

    if isinstance(llm, type) or getattr(llm, "name", None) == "extractive-fallback":
        answer_text = compose_extractive_answer(query, chunks)
        backend_used = "extractive-fallback"
    else:
        user_prompt = build_prompt(query, chunks, history, config["hint"])
        try:
            answer_text = llm.generate(SYSTEM_PROMPT, user_prompt)
            backend_used = llm.__class__.__name__
        except Exception as e:
            answer_text = compose_extractive_answer(query, chunks)
            backend_used = f"extractive-fallback (LLM error: {e})"

    return {
        "answer": answer_text,
        "route": route,
        "sources": chunks,
        "backend": backend_used,
    }
