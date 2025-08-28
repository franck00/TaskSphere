import pytest
from httpx import AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app, get_db
from app.models import Base, User

# Setup the test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def anyio_backend():
    return "asyncio"

@pytest.fixture(scope="module")
async def client():
    async with AsyncClient(app=app, base_url="http://test") as c:
        yield c

@pytest.fixture(scope="function", autouse=True)
def clear_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

@pytest.mark.anyio
async def test_register_user(client: AsyncClient):
    response = await client.post("/register/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert "id" in data

@pytest.mark.anyio
async def test_register_existing_user(client: AsyncClient):
    await client.post("/register/", json={"username": "testuser2", "password": "testpassword"})
    response = await client.post("/register/", json={"username": "testuser2", "password": "testpassword"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Username already registered"}

@pytest.mark.anyio
async def test_login_for_access_token(client: AsyncClient):
    await client.post("/register/", json={"username": "testlogin", "password": "testpassword"})
    response = await client.post("/token/", data={"username": "testlogin", "password": "testpassword"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.anyio
async def test_login_with_wrong_password(client: AsyncClient):
    await client.post("/register/", json={"username": "wrongpass", "password": "testpassword"})
    response = await client.post("/token/", data={"username": "wrongpass", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect username or password"}

@pytest.mark.anyio
async def test_login_with_wrong_username(client: AsyncClient):
    response = await client.post("/token/", data={"username": "nonexistent", "password": "testpassword"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect username or password"}

@pytest.mark.anyio
async def test_access_protected_route_without_token(client: AsyncClient):
    response = await client.get("/tasks/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

@pytest.mark.anyio
async def test_access_protected_route_with_token(client: AsyncClient):
    await client.post("/register/", json={"username": "authtest", "password": "testpassword"})
    login_response = await client.post("/token/", data={"username": "authtest", "password": "testpassword"})
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = await client.get("/tasks/", headers=headers)
    assert response.status_code == 200
