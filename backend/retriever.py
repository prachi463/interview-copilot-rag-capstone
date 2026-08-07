"""
Hybrid retrieval: dense (FAISS cosine similarity) + sparse (BM25 keyword) search,
merged with Reciprocal Rank Fusion (RRF).

Why hybrid? Dense embeddings are good at semantic/paraphrase matches ("what tech did you use"
-> matches "Flask, Socket.IO, MongoDB" even without word overlap). BM25 is good at exact-term
matches (specific numbers, proper nouns like "ESP32" or "AUC 0.9997") that dense embeddings can
blur together. RRF combines both rankings without needing to tune a fusion weight.
"""
import os
import pickle

import faiss
import numpy as np

from embeddings import get_embedder
from ingest import tokenize_for_bm25, STORE_DIR


class HybridRetriever:
    def __init__(self, store_dir=STORE_DIR):
        self.store_dir = store_dir
        self._load()

    def _load(self):
        self.index = faiss.read_index(os.path.join(self.store_dir, "faiss.index"))

        self.embedder = get_embedder()
        self.embedder.load(os.path.join(self.store_dir, "embedder.pkl"))

        with open(os.path.join(self.store_dir, "bm25.pkl"), "rb") as f:
            bm25_data = pickle.load(f)
            self.bm25 = bm25_data["bm25"]

        with open(os.path.join(self.store_dir, "chunks.pkl"), "rb") as f:
            self.chunks = pickle.load(f)

    def _dense_search(self, query, top_k):
        qvec = self.embedder.encode([query])
        scores, idxs = self.index.search(qvec, min(top_k, len(self.chunks)))
        return [(int(i), float(s)) for i, s in zip(idxs[0], scores[0]) if i != -1]

    def _sparse_search(self, query, top_k):
        tokens = tokenize_for_bm25(query)
        scores = self.bm25.get_scores(tokens)
        top_idx = np.argsort(scores)[::-1][:top_k]
        return [(int(i), float(scores[i])) for i in top_idx]

    def retrieve(self, query, top_k=5, dense_k=10, sparse_k=10, rrf_k=60):
        """
        Returns top_k chunks ranked by Reciprocal Rank Fusion of dense + sparse results.
        Each result: {"text", "source", "chunk_id", "score", "dense_rank", "sparse_rank"}
        """
        dense_results = self._dense_search(query, dense_k)
        sparse_results = self._sparse_search(query, sparse_k)

        rrf_scores = {}
        rank_info = {}

        for rank, (idx, _) in enumerate(dense_results):
            rrf_scores[idx] = rrf_scores.get(idx, 0) + 1.0 / (rrf_k + rank + 1)
            rank_info.setdefault(idx, {})["dense_rank"] = rank + 1

        for rank, (idx, _) in enumerate(sparse_results):
            rrf_scores[idx] = rrf_scores.get(idx, 0) + 1.0 / (rrf_k + rank + 1)
            rank_info.setdefault(idx, {})["sparse_rank"] = rank + 1

        ranked = sorted(rrf_scores.items(), key=lambda kv: kv[1], reverse=True)[:top_k]

        results = []
        max_score = ranked[0][1] if ranked else 1.0
        for idx, score in ranked:
            chunk = self.chunks[idx]
            results.append({
                "text": chunk["text"],
                "source": chunk["source"],
                "chunk_id": chunk["chunk_id"],
                "score": score,
                "confidence": round(min(score / max_score, 1.0) * 100, 1),
                "dense_rank": rank_info.get(idx, {}).get("dense_rank"),
                "sparse_rank": rank_info.get(idx, {}).get("sparse_rank"),
            })
        return results
