"""
Ingestion pipeline: load documents from knowledge_base/ -> chunk -> embed -> build
a FAISS dense index + a BM25 sparse index, saved to vector_store/.

Run: python ingest.py
"""
import os
import re
import pickle
import glob

import numpy as np
import faiss
from rank_bm25 import BM25Okapi

from embeddings import get_embedder

KB_DIR = "knowledge_base"
STORE_DIR = "vector_store"
CHUNK_SIZE = 700
CHUNK_OVERLAP = 120


# ----------------------------------------------------------------------------
# Loaders
# ----------------------------------------------------------------------------
def load_text_file(path):
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


def load_pdf_file(path):
    from pypdf import PdfReader
    reader = PdfReader(path)
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def load_docx_file(path):
    import docx
    doc = docx.Document(path)
    return "\n".join(p.text for p in doc.paragraphs)


def load_documents(kb_dir=KB_DIR):
    """Returns list of {"source": filename, "text": full_text}."""
    docs = []
    for path in sorted(glob.glob(os.path.join(kb_dir, "*"))):
        ext = os.path.splitext(path)[1].lower()
        fname = os.path.basename(path)
        try:
            if ext in (".md", ".txt"):
                text = load_text_file(path)
            elif ext == ".pdf":
                text = load_pdf_file(path)
            elif ext == ".docx":
                text = load_docx_file(path)
            else:
                continue
            if text.strip():
                docs.append({"source": fname, "text": text})
        except Exception as e:
            print(f"  [warn] failed to load {fname}: {e}")
    return docs


# ----------------------------------------------------------------------------
# Chunking — recursive character splitter (paragraph -> sentence -> char fallback)
# ----------------------------------------------------------------------------
def recursive_split(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    separators = ["\n## ", "\n### ", "\n\n", "\n", ". ", " "]

    def _split(text, seps):
        if len(text) <= chunk_size:
            return [text] if text.strip() else []
        if not seps:
            # hard character split as last resort
            return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size - overlap)]

        sep = seps[0]
        parts = text.split(sep)
        chunks, current = [], ""
        for part in parts:
            candidate = (current + sep + part) if current else part
            if len(candidate) <= chunk_size:
                current = candidate
            else:
                if current:
                    chunks.extend(_split(current, seps[1:]))
                current = part
        if current:
            chunks.extend(_split(current, seps[1:]))
        return chunks

    raw_chunks = _split(text, separators)

    # add character overlap between consecutive chunks for retrieval continuity
    overlapped = []
    for i, c in enumerate(raw_chunks):
        if i > 0 and overlap > 0:
            prev_tail = raw_chunks[i - 1][-overlap:]
            c = prev_tail + " " + c
        overlapped.append(c.strip())
    return [c for c in overlapped if len(c) > 20]


def chunk_documents(docs):
    """Returns list of {"source", "chunk_id", "text"}."""
    chunks = []
    for doc in docs:
        pieces = recursive_split(doc["text"])
        for i, piece in enumerate(pieces):
            chunks.append({
                "source": doc["source"],
                "chunk_id": f"{doc['source']}::{i}",
                "text": piece,
            })
    return chunks


def tokenize_for_bm25(text):
    return re.findall(r"[a-z0-9]+", text.lower())


# ----------------------------------------------------------------------------
# Build & save index
# ----------------------------------------------------------------------------
def build_index(kb_dir=KB_DIR, store_dir=STORE_DIR):
    os.makedirs(store_dir, exist_ok=True)

    print("Loading documents...")
    docs = load_documents(kb_dir)
    print(f"  Loaded {len(docs)} document(s): {[d['source'] for d in docs]}")

    print("Chunking...")
    chunks = chunk_documents(docs)
    print(f"  Produced {len(chunks)} chunks")

    texts = [c["text"] for c in chunks]

    print("Embedding (dense)...")
    embedder = get_embedder()
    embedder.fit(texts)
    vectors = embedder.encode(texts)

    print("Building FAISS index...")
    dim = vectors.shape[1]
    index = faiss.IndexFlatIP(dim)  # cosine similarity via inner product on normalized vecs
    index.add(vectors)
    faiss.write_index(index, os.path.join(store_dir, "faiss.index"))
    embedder.save(os.path.join(store_dir, "embedder.pkl"))

    print("Building BM25 (sparse) index...")
    tokenized = [tokenize_for_bm25(t) for t in texts]
    bm25 = BM25Okapi(tokenized)
    with open(os.path.join(store_dir, "bm25.pkl"), "wb") as f:
        pickle.dump({"bm25": bm25, "tokenized": tokenized}, f)

    with open(os.path.join(store_dir, "chunks.pkl"), "wb") as f:
        pickle.dump(chunks, f)

    print(f"Done. Index stored in '{store_dir}/'.")
    return len(chunks)


if __name__ == "__main__":
    build_index()
