from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv
import io
from docx import Document
import pdfplumber

load_dotenv()

PROVIDER = os.getenv("PROVIDER", "openai")  # "openai" or "yandex"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
YANDEX_API_KEY = os.getenv("YANDEX_API_KEY")
YANDEX_FOLDER_ID = os.getenv("YANDEX_FOLDER_ID")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # в проде ограничьте
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    text: str = None
    submissionId: int = None

def extract_text_from_docx_bytes(b: bytes) -> str:
    f = io.BytesIO(b)
    doc = Document(f)
    paragraphs = [p.text for p in doc.paragraphs]
    return "\n".join(paragraphs)

def extract_text_from_pdf_bytes(b: bytes) -> str:
    f = io.BytesIO(b)
    text_chunks = []
    with pdfplumber.open(f) as pdf:
        for page in pdf.pages:
            text_chunks.append(page.extract_text() or "")
    return "\n".join(text_chunks)

@app.post("/api/submissions")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    text = ""
    if file.filename.lower().endswith(".txt"):
        text = content.decode(errors="ignore")
    elif file.filename.lower().endswith(".docx"):
        text = extract_text_from_docx_bytes(content)
    elif file.filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf_bytes(content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # В реальном приложении сохраним файл и создадим submission в БД.
    # Здесь просто вернём текст и заглушечный id
    return {"submissionId": 1, "textPreview": text[:1000], "status": "uploaded"}

def make_system_prompt():
    return (
        "Ты — опытный ментор. Проанализируй предоставленный текст по критериям: structure, content, grammar, style. "
        "Верни строго JSON с полями: overall (structure,content,grammar,style), details (grammar,structure,content,style) "
        "каждый раздел — объект { score: number, issues: [ { text: string, recommendation: string } ] }, "
        "и overall_comment. Return only valid JSON. No extra text."
    )

def call_openai_completion(text: str):
    url = "https://api.openai.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    prompt_system = make_system_prompt()
    data = {
        "model": "gpt-4o-mini",  # замените на вашу модель
        "messages": [
            {"role": "system", "content": prompt_system},
            {"role": "user", "content": text}
        ],
        "temperature": 0.0,
        "max_tokens": 800
    }
    r = requests.post(url, headers=headers, json=data, timeout=120)
    r.raise_for_status()
    j = r.json()
    # попытка извлечь текст
    out = None
    try:
        out = j["choices"][0]["message"]["content"]
    except:
        out = j
    return out

def call_yandex_completion(text: str):
    url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
    headers = {
        "Authorization": f"Api-Key {YANDEX_API_KEY}",
        "x-folder-id": YANDEX_FOLDER_ID,
        "Content-Type": "application/json"
    }
    body = {
        "modelUri": "yandex/gpt-4o-mini",  # пример — у вас может быть другой modelUri
        "messages": [
            {"role": "system", "text": make_system_prompt()},
            {"role": "user", "text": text}
        ],
        "completionOptions": {
            "temperature": 0.0,
            "maxTokens": "800",
            "stream": False
        }
    }
    r = requests.post(url, headers=headers, json=body, timeout=120)
    r.raise_for_status()
    j = r.json()
    # найти текст в ответе
    out = None
    try:
        out = j["result"]["alternatives"][0]["message"]["text"]
    except:
        out = j
    return out

@app.post("/api/analyze")
async def analyze(req: AnalyzeRequest):
    text = req.text
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    try:
        # Вызываем выбранного провайдера
        if PROVIDER == "openai":
            if not OPENAI_API_KEY:
                raise HTTPException(status_code=500, detail="OpenAI key not configured")
            raw = call_openai_completion(text)
        else:
            if not YANDEX_API_KEY or not YANDEX_FOLDER_ID:
                raise HTTPException(status_code=500, detail="Yandex keys not configured")
            raw = call_yandex_completion(text)

        # Попытка распарсить JSON — если модель вернула JSON
        import json
        try:
            parsed = json.loads(raw)
            return {"analysis": parsed}
        except Exception:
            # Если не JSON — возвращаем raw для фронтенда (с флагом)
            return {"raw": raw}
    except requests.HTTPError as e:
        detail = str(e)
        raise HTTPException(status_code=500, detail=f"LLM request failed: {detail}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
