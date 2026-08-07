"""
Pluggable embedding backends.

Design rationale: sentence-transformer models need to download weights from the internet
on first use. That's fine on a normal dev machine, but it's a fragile dependency for a demo
(slow first run, fails offline). So the default backend is a local TF-IDF vectorizer — zero
downloads, deterministic, fast — and swapping to a transformer-based embedder is a one-line
config change (EMBEDDING_BACKEND=sentence-transformers) for better semantic recall.
"""
import numpy as np
import pickle
import os
from abc import ABC, abstractmethod


class BaseEmbedder(ABC):
    @abstractmethod
    def fit(self, texts):
        ...

    @abstractmethod
    def encode(self, texts):
        """Returns an (n, d) float32 numpy array, L2-normalized rows."""
        ...

    @abstractmethod
    def save(self, path):
        ...

    @abstractmethod
    def load(self, path):
        ...


class TfidfEmbedder(BaseEmbedder):
    """Default backend. No network calls, no model downloads."""

    def __init__(self, max_features=4000):
        from sklearn.feature_extraction.text import TfidfVectorizer
        self.vectorizer = TfidfVectorizer(
            max_features=max_features,
            ngram_range=(1, 2),
            stop_words="english",
            sublinear_tf=True,
        )
        self._fitted = False

    def fit(self, texts):
        self.vectorizer.fit(texts)
        self._fitted = True

    def encode(self, texts):
        if not self._fitted:
            raise RuntimeError("TfidfEmbedder must be fit() before encode().")
        mat = self.vectorizer.transform(texts).toarray().astype("float32")
        norms = np.linalg.norm(mat, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        return mat / norms

    def save(self, path):
        with open(path, "wb") as f:
            pickle.dump(self.vectorizer, f)

    def load(self, path):
        with open(path, "rb") as f:
            self.vectorizer = pickle.load(f)
        self._fitted = True


class SentenceTransformerEmbedder(BaseEmbedder):
    """
    Optional higher-quality backend. Requires internet access on first run to download
    model weights (e.g. 'all-MiniLM-L6-v2'), then caches locally.
    """

    def __init__(self, model_name="all-MiniLM-L6-v2"):
        from sentence_transformers import SentenceTransformer
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)

    def fit(self, texts):
        pass  # no fitting needed, pretrained model

    def encode(self, texts):
        vecs = self.model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
        return np.asarray(vecs, dtype="float32")

    def save(self, path):
        with open(path, "w") as f:
            f.write(self.model_name)

    def load(self, path):
        from sentence_transformers import SentenceTransformer
        with open(path, "r") as f:
            self.model_name = f.read().strip()
        self.model = SentenceTransformer(self.model_name)


def get_embedder(backend: str = None):
    backend = backend or os.getenv("EMBEDDING_BACKEND", "tfidf")
    if backend == "sentence-transformers":
        return SentenceTransformerEmbedder()
    return TfidfEmbedder()
