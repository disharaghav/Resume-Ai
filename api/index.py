import os
import platform
from datetime import datetime, timedelta
from typing import List

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext

import api.models as models
import api.database as db

load_dotenv()

# =========================
# 🚀 INIT APP
# =========================
app = FastAPI(title="Resume AI Backend")

# =========================
# 🔐 SECURITY CONFIG
# =========================
SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkeychangeinprod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")
security = HTTPBearer()

# =========================
# 🌐 CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://resume-ai-pe89.vercel.app",
        "https://resume-ai-silk.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ⚙️ SYSTEM INFO
# =========================
OS_NAME = platform.system()
OS_VERSION = platform.release()
OS_PLATFORM = platform.platform()

# =========================
# 🔑 UTILS
# =========================
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        user = db.users.get(user_id)

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return user

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# =========================
# 🏠 BASIC ROUTES
# =========================
@app.get("/")
async def root():
    return {"message": "Resume AI Backend Running 🚀"}

@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.get("/api/os")
async def get_os():
    return {
        "os": OS_NAME,
        "version": OS_VERSION,
        "platform": OS_PLATFORM,
        "node": platform.node()
    }

# =========================
# 🔐 AUTH ROUTES
# =========================
class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/api/auth/signup")
async def signup(user: models.UserCreate):
    try:
        # check if user exists
        for u in db.users.values():
            if u["email"] == user.email:
                raise HTTPException(status_code=400, detail="Email already registered")

        user_id = str(len(db.users) + 1)

        user_dict = user.model_dump()
        user_dict["id"] = user_id
        user_dict["password"] = get_password_hash(user.password)

        db.users[user_id] = user_dict  # ✅ persistent storage

        token = create_access_token({"user_id": user_id})

        return {
            "token": token,
            "user": models.UserOut(**user_dict)
        }

    except Exception as e:
        print("SIGNUP ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login")
async def login(login_data: UserLogin):
    for user in db.users.values():
        if user["email"] == login_data.email:
            if verify_password(login_data.password, user["password"]):
                token = create_access_token({"user_id": user["id"]})
                return {
                    "token": token,
                    "user": models.UserOut(**user)
                }

    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/auth/me", response_model=models.UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    return models.UserOut(**current_user)

# =========================
# 💼 JOBS
# =========================
@app.post("/api/jobs", response_model=models.JobOut)
async def create_job(job: models.JobCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "employer":
        raise HTTPException(status_code=403, detail="Only employers can create jobs")

    job_id = db.db.create_job(job.model_dump(), current_user["id"])
    return models.JobOut(**db.jobs[job_id])

@app.get("/api/jobs", response_model=List[models.JobOut])
async def get_jobs(current_user: dict = Depends(get_current_user)):
    return [models.JobOut(**j) for j in db.db.get_jobs()]

@app.get("/api/jobs/{job_id}", response_model=models.JobOut)
async def get_job(job_id: str, current_user: dict = Depends(get_current_user)):
    job = db.db.get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return models.JobOut(**job)

@app.get("/api/jobs/employer/my-jobs", response_model=List[models.JobOut])
async def get_my_jobs(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "employer":
        raise HTTPException(status_code=403, detail="Only employers can view their jobs")

    return [models.JobOut(**j) for j in db.db.get_jobs(current_user["id"])]

# =========================
# 📄 RESUMES
# =========================
@app.get("/api/resumes", response_model=List[models.ResumeOut])
async def get_resumes(current_user: dict = Depends(get_current_user)):
    return [models.ResumeOut(**r) for r in db.db.get_resumes(current_user["id"])]

@app.post("/api/resumes", response_model=models.ResumeOut)
async def create_resume(resume: models.ResumeCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "job_seeker":
        raise HTTPException(status_code=403, detail="Only job seekers can upload resumes")

    resume_id = db.db.create_resume(resume.model_dump(), current_user["id"])
    return models.ResumeOut(**db.resumes[resume_id])

# =========================
# 📌 APPLICATIONS
# =========================
@app.get("/api/applications", response_model=List[models.ApplicationOut])
async def get_applications(current_user: dict = Depends(get_current_user)):
    apps = []

    for app_id, app in db.applications.items():
        if app["user_id"] == current_user["id"]:
            apps.append(models.ApplicationOut(**app))

    return apps

@app.post("/api/applications", response_model=models.ApplicationOut)
async def create_application(app: models.ApplicationCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "job_seeker":
        raise HTTPException(status_code=403, detail="Only job seekers can apply")

    if not db.db.get_job(app.job_id):
        raise HTTPException(status_code=404, detail="Job not found")

    if not any(r["user_id"] == current_user["id"] for r in db.resumes.values()):
        raise HTTPException(status_code=400, detail="Must have a resume to apply")

    app_id = db.db.create_application(app.model_dump(), current_user["id"])

    return models.ApplicationOut(**db.applications[app_id])