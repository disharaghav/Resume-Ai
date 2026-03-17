from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "https://resume-ai-pe89.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # 🔥 IMPORTANT (not "*")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from mangum import Mangum

from api.database import *
from api.models import *

app = FastAPI(title="Resume AI Backend")

@app.get("/")
def home():
    return {"message": "Resume AI backend running 🚀"}

# REQUIRED for Vercel
handler = Mangum(app)