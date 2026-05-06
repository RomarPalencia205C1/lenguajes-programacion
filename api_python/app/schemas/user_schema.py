from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    nombre: Optional[str] = None     
    apellido: Optional[str] = None   
    edad: Optional[int] = None
    pais: Optional[str] = None
    sexo: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    nombre: Optional[str] = None    
    apellido: Optional[str] = None   
    edad: Optional[int] = None
    pais: Optional[str] = None
    sexo: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)