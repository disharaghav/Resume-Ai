from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

# ✅ ALWAYS define app FIRST
app = FastAPI()

# ✅ CORS
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

# ✅ Fake DB
users_db = {}

# ✅ Models
class UserSignup(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ✅ Routes
@app.get("/")
def home():
    return {"message": "Resume AI backend running 🚀"}

@app.post("/signup")
def signup(user: UserSignup):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")

    users_db[user.email] = {
        "password": user.password,
        "role": "job_seeker"
    }

    return {
        "message": "Signup successful",
        "token": "dummy-token",
        "user": {
            "email": user.email,
            "role": "job_seeker"
        }
    }

@app.post("/login")
def login(user: UserLogin):
    if user.email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")

    if users_db[user.email]["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    return {
        "message": "Login successful",
        "token": "dummy-token",
        "user": {
            "email": user.email,
            "role": users_db[user.email]["role"]
        }
    }

@app.get("/me")
def get_me():
    return {"email": "test@example.com"}