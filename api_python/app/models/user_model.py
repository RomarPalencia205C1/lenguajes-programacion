from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    nombre = Column(String(100), nullable=True)
    apellido = Column(String(100), nullable=True)
    edad = Column(Integer, nullable=True)
    pais = Column(String(100), nullable=True)
    sexo = Column(String(20), nullable=True) 