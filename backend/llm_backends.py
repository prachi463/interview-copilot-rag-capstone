"""
Pluggable LLM backends for the generation step.

Priority order (first available wins):
  1. Groq API   (GROQ_API_KEY set)   - fast, free tier, Llama models
  2. OpenAI API (OPENAI_API_KEY set) - paid, widely used
  3. Extractive fallback (no key needed) - composes an answer directly from retrieved
     chunks using simple templating. Guarantees the app is demo-able even with zero setup,
     which matters for grading/interview settings where an API key might not be configured.
"""
import os


class GroqLLM:
    def __init__(self, model="llama-3.1-8b-instant"):
        from groq import Groq
        self.client = Groq(api_key=os.environ["GROQ_API_KEY"])
        self.model = model

    def generate(self, system_prompt, user_prompt):
        resp = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=500,
        )
        return resp.choices[0].message.content


class OpenAILLM:
    def __init__(self, model="gpt-4o-mini"):
        from openai import OpenAI
        self.client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        self.model = model

    def generate(self, system_prompt, user_prompt):
        resp = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=500,
        )
        return resp.choices[0].message.content


class ExtractiveLLM:
    """
    No API key required. Doesn't 'generate' in the LLM sense — it composes a direct answer
    from the highest-confidence retrieved chunks. Ensures the app is always runnable.
    """
    name = "extractive-fallback"

    def generate(self, system_prompt, user_prompt):
        # user_prompt is expected to embed the retrieved context; we just surface it directly.
        return None  # signal to caller: use rag_chain's own extractive composer


def get_llm():
    if os.getenv("GROQ_API_KEY"):
        try:
            return GroqLLM()
        except Exception as e:
            print(f"[warn] Groq init failed, falling back: {e}")
    if os.getenv("OPENAI_API_KEY"):
        try:
            return OpenAILLM()
        except Exception as e:
            print(f"[warn] OpenAI init failed, falling back: {e}")
    return ExtractiveLLM()
