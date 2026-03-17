from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ FIRST create app
app = FastAPI()

# ✅ THEN add middleware
origins = [
    "http://localhost:3000",
    "https://resume-ai-pe89.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 your existing routes stay below
@app.get("/")
def home():
    return {"message": "Resume AI backend running 🚀"}