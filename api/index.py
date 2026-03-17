from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

# ✅ Initialize app FIRST
app = FastAPI()

# ✅ CORS configuration
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

# ✅ In-memory database (temporary)
users_db = {}

# ✅ Models
class UserSignup(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ✅ Home route
@app.get("/")
def home():
    return {"message": "Resume AI backend running 🚀"}

# ✅ Signup route
@app.post("/signup")
def signup(user: UserSignup):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")

    users_db[user.email] = user.password
    return {"message": "Signup successful"}

# ✅ Login route
@app.post("/login")
def login(user: UserLogin):
    if user.email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")

    if users_db[user.email] != user.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    return {"message": "Login successful"}