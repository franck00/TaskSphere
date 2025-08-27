# TaskSphere
TaskSphere est une application web open source de gestion de projets et tâches, inspirée de Circle (par @ln_dev7) mais avec un backend dynamique et des fonctionnalités avancées. Construite avec Next.js, shadcn/ui, FastAPI et SQLite, elle offre une UI moderne et un CRUD complet pour surpasser les limites de Circle.

## Fonctionnalités
- Gestion des tâches et projets : CRUD via API et UI.
- Authentification JWT (inscription, connexion).
- Vues Liste, Grille et Kanban avec drag-and-drop.
- Filtres par statut, priorité, date.
- Thème clair/sombre avec animations fluides.
- Déployée sur Vercel (frontend) et Render (backend) : [liens après déploiement].

## Installation
### Frontend
1. Cloner le repo : `git clone https://github.com/votre-username/TaskSphere`
2. Aller dans `frontend/` : `cd frontend`
3. Installer : `pnpm install`
4. Lancer : `pnpm dev`

### Backend
1. Aller dans `backend/` : `cd backend`
2. Installer : `pip install -r requirements.txt`
3. Lancer : `uvicorn app.main:app --reload`

## Endpoints
- GET `/health` : Vérifie l’état de l’API.
- POST `/register`, `/login` : Authentification JWT.
- GET `/tasks`, POST `/tasks`, GET/PUT/DELETE `/tasks/{id}` : CRUD tâches.
- GET `/projects`, POST `/projects`, GET/PUT/DELETE `/projects/{id}` : CRUD projets.

## Contribuer
Ouvrez une issue ou une PR pour ajouter des features ou améliorer le design !

## Technologies
- Frontend : Next.js, shadcn/ui, Tailwind CSS, TypeScript, Framer Motion
- Backend : FastAPI, SQLAlchemy, Pydantic, PyJWT, SQLite (migrable vers PostgreSQL)
- Déploiement : Vercel (frontend), Render (backend)
