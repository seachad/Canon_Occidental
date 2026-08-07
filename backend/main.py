from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title='Canon de Occidente API', version='0.1.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

entities = [
    {
        'id': 'socrates',
        'name': 'Sócrates',
        'type': 'Filósofo',
        'summary': 'Figura central del pensamiento griego.',
        'dates': '470 a. C. – 399 a. C.',
        'place': 'Atenas',
    },
    {
        'id': 'platon',
        'name': 'Platón',
        'type': 'Filósofo',
        'summary': 'Autor de diálogos y teoría política.',
        'dates': '427 a. C. – 347 a. C.',
        'place': 'Atenas',
    },
    {
        'id': 'aristoteles',
        'name': 'Aristóteles',
        'type': 'Filósofo',
        'summary': 'Sistema de lógica y ética.',
        'dates': '384 a. C. – 322 a. C.',
        'place': 'Estagira / Atenas',
    },
]

@app.get('/health')
def health():
    return {'status': 'ok'}

@app.get('/entities')
def get_entities():
    return entities

@app.get('/entities/{entity_id}')
def get_entity(entity_id: str):
    for entity in entities:
        if entity['id'] == entity_id:
            return entity
    return {'error': 'not found'}
