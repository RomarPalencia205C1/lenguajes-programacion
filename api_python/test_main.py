# test_main.py
import uuid
from fastapi.testclient import TestClient
from app.main import app

# Creamos el cliente de pruebas
client = TestClient(app)

# Función auxiliar para generar emails únicos y evitar errores de "Email ya registrado"
def get_unique_email():
    return f"test_{uuid.uuid4().hex[:8]}@ejemplo.com"

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API funcionando correctamente"}

def test_create_user():
    # 1. Preparamos los datos incluyendo nombre y apellido
    test_email = get_unique_email()
    payload = {
        "email": test_email,
        "password": "supersecreta",
        "nombre": "Ana",
        "apellido": "García",
        "edad": 28,
        "pais": "Argentina",
        "sexo": "Femenino"
    }
    
    # 2. Ejecutamos la petición POST
    response = client.post("/users/", json=payload)
    
    # 3. Verificamos que se haya creado exitosamente
    assert response.status_code == 201
    
    # 4. Verificamos que los datos devueltos coincidan con los enviados
    data = response.json()
    assert data["email"] == test_email
    assert data["nombre"] == "Ana"
    assert data["apellido"] == "García"
    assert "id" in data # Aseguramos que MySQL le asignó un ID

def test_update_user():
    # 1. Creamos un usuario primero para asegurarnos de que exista
    create_response = client.post(
        "/users/", 
        json={
            "email": get_unique_email(), 
            "password": "123", 
            "nombre": "Carlos"
        }
    )
    user_id = create_response.json()["id"]

    # 2. Modificamos su apellido y país usando PUT
    update_payload = {
        "apellido": "Pérez",
        "pais": "Chile"
    }
    update_response = client.put(f"/users/{user_id}", json=update_payload)
    
    # 3. Verificamos la actualización
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["apellido"] == "Pérez"
    assert data["pais"] == "Chile"
    # El nombre no se envió en el PUT, por lo que debe mantenerse intacto (o nulo según tu lógica, en Pydantic base se omite)

def test_delete_user():
    # 1. Creamos un usuario para borrarlo
    create_response = client.post(
        "/users/", 
        json={"email": get_unique_email(), "password": "123"}
    )
    user_id = create_response.json()["id"]

    # 2. Ejecutamos el DELETE
    delete_response = client.delete(f"/users/{user_id}")
    assert delete_response.status_code == 204 # 204 No Content

    # 3. (Opcional pero recomendado) Intentamos modificarlo para confirmar que ya no existe
    verify_response = client.put(f"/users/{user_id}", json={"nombre": "Fantasma"})
    assert verify_response.status_code == 404

def test_login_success():
    # 1. Creamos un usuario de prueba (usando el endpoint que ya hashea)
    email = f"test_{uuid.uuid4().hex[:5]}@test.com"
    client.post("/users/", json={"email": email, "password": "password123"})
    
    # 2. Intentamos hacer login (formato OAuth2 requiere 'username' y 'password')
    response = client.post(
        "/auth/login",
        data={"username": email, "password": "password123"}
    )
    
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"