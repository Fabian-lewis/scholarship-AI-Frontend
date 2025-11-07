# transform.py
from sentence_transformers import SentenceTransformer
from transformers import pipeline
from fastapi import HTTPException

# ✅ Load models once (not every time)
embedding_model = SentenceTransformer("intfloat/e5-base-v2")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def safe_summarize(text: str) -> str:
    """Summarize long text safely by chunking."""
    try:
        if not text or len(text.strip()) < 100:
            return text.strip()

        # BART can only handle up to 1024 tokens (~1000–1500 chars)
        chunk_size = 1500
        chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

        summaries = []
        for chunk in chunks:
            try:
                result = summarizer(
                    chunk,
                    max_length=300,
                    min_length=100,
                    do_sample=False
                )
                summaries.append(result[0]["summary_text"])
            except Exception as inner_e:
                print(f"⚠️ Skipping problematic chunk: {inner_e}")

        return " ".join(summaries) if summaries else text.strip()

    except Exception as e:
        print("🔥 Summarization error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


def transform(text: str):
    """Summarize text and generate embedding."""
    try:
        summary = safe_summarize(text)
        embedding = embedding_model.encode(summary, convert_to_tensor=False).tolist()
        return summary, embedding
    except Exception as e:
        print("🔥 Unexpected error during transforming:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
