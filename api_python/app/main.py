from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import user, auth

# Creamos las tablas (incluyendo las nuevas columnas)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mi API Escalable")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Incluimos el router de usuarios
app.include_router(user.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "API funcionando correctamente"}