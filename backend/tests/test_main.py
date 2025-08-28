import pytest
from httpx import AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app, get_db
from app.models import Base

# Setup the test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_main.db"
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

@pytest.fixture(scope="function", autouse=True)
def clear_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="module")
def anyio_backend():
    return "asyncio"

@pytest.fixture(scope="module")
async def client():
    async with AsyncClient(app=app, base_url="http://test") as c:
        yield c

@pytest.fixture(scope="module")
async def authorized_client(client: AsyncClient):
    await client.post("/register/", json={"username": "testuser_main", "password": "testpassword"})
    response = await client.post("/token/", data={"username": "testuser_main", "password": "testpassword"})
    token = response.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"
    return client

@pytest.mark.anyio
async def test_read_root(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@pytest.mark.anyio
async def test_create_task_unauthorized(client: AsyncClient):
    # We need a fresh client without the auth header from authorized_client
    async with AsyncClient(app=app, base_url="http://test") as unauth_client:
        response = await unauth_client.post("/tasks/", json={"title": "Test Task", "description": "Test Description"})
    assert response.status_code == 401

@pytest.mark.anyio
async def test_create_task_authorized(authorized_client: AsyncClient):
    response = await authorized_client.post(
        "/tasks/",
        json={"title": "Test Task", "description": "Test Description", "status": "todo", "priority": "medium"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["description"] == "Test Description"
    assert "id" in data

@pytest.mark.anyio
async def test_access_protected_route_with_bad_token(client: AsyncClient):
    headers = {"Authorization": "Bearer badtoken"}
    response = await client.get("/tasks/", headers=headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid token"}

@pytest.mark.anyio
async def test_read_nonexistent_task(authorized_client: AsyncClient):
    response = await authorized_client.get("/tasks/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}
