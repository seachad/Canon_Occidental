# El Canon de Occidente

Este repositorio contiene una base inicial para construir la plataforma semántica El Canon de Occidente.

## Estructura
- frontend/: aplicación Next.js con la interfaz inicial
- backend/: API mínima en FastAPI

## Cómo arrancar

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Estado actual
- interfaz inicial de home y ficha de entidad
- API mínima con endpoints de salud y entidades
- estructura preparada para crecer hacia grafo, cronología y mapa
