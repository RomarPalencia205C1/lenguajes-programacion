import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Carga las variables del archivo .env al entorno de Python
load_dotenv()

# Construye la URL de conexion usando el driver mysql+pymysql
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

# Crea el "motor" de SQLAlchemy, la interfaz principal hacia la base de datos
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Crea una clase fabrica para generar sesiones de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base de la que heredaran todos nuestros modelos ORM
Base = declarative_base()

# Dependencia de FastAPI para inyectar la sesión en las rutas
def get_db():
    db = SessionLocal()
    try:
        yield db # Entrega la sesion a la ruta
    finally:
        db.close() # Asegura que la conexion se cierre al terminar la peticion