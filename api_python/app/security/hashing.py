from passlib.context import CryptContext

# Configuracion del algoritmo de encriptacion
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Hasher:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Compara una contraseña plana con su hash en la BD."""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """Genera un hash seguro a partir de una contraseña."""
        return pwd_context.hash(password)