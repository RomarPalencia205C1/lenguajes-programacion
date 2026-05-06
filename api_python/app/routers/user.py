from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db
from app.security import get_password_hash
from app.security import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# --- LISTAR TODOS ---
@router.get("/", response_model=List[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

# --- CREAR ---
@router.post("/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    # ENCRIPTACION: Transformamos la contraseña antes de crear el modelo
    hashed_pass = get_password_hash(user.password)
    
    # Mapeamos los campos del schema al modelo
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_pass, 
        nombre=user.nombre,     
        apellido=user.apellido, 
        edad=user.edad,
        pais=user.pais,
        sexo=user.sexo
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# --- MODIFICAR (UPDATE) ---
@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user_data: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Convertimos los datos a un diccionario y actualizamos solo lo que venga informado
    update_data = user_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "password":
            setattr(db_user, "hashed_password", value) # Actualiza password
        else:
            setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

# --- ELIMINAR ---
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db.delete(db_user)
    db.commit()
    return None # 204 No Content no devuelve cuerpo

# --- NUEVO ENDPOINT PROTEGIDO ---
@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """
    Obtiene los datos del usuario que esta actualmente logueado.
    """
    return current_user