const entities = [
  {
    id: 'socrates',
    name: 'Sócrates',
    type: 'Filósofo',
    summary: 'Figura central del pensamiento griego y punto de partida de la tradición filosófica occidental.',
    dates: '470 a. C. – 399 a. C.',
    place: 'Atenas',
    connections: ['Platón', 'Aristóteles', 'Democracia', 'Juicio'],
    sources: ['Platón – Apología', 'Jenofonte – Recuerdos de Sócrates'],
  },
  {
    id: 'platon',
    name: 'Platón',
    type: 'Filósofo',
    summary: 'Autor de diálogos fundamentales y creador de una visión política y metafísica influyente.',
    dates: '427 a. C. – 347 a. C.',
    place: 'Atenas',
    connections: ['Sócrates', 'Aristóteles', 'República', 'Idea'],
    sources: ['La República', 'Fedón', 'Fedro'],
  },
  {
    id: 'aristoteles',
    name: 'Aristóteles',
    type: 'Filósofo',
    summary: 'Sistema de lógica, ética y política que marcó la cultura europea.',
    dates: '384 a. C. – 322 a. C.',
    place: 'Estagira / Atenas',
    connections: ['Platón', 'Política', 'Lógica', 'Metafísica'],
    sources: ['Ética a Nicómaco', 'Política', 'Metafísica'],
  },
];

const entityList = document.getElementById('entity-list');
const entityName = document.getElementById('entity-name');
const entityType = document.getElementById('entity-type');
const entitySummary = document.getElementById('entity-summary');
const entityDates = document.getElementById('entity-dates');
const entityPlace = document.getElementById('entity-place');
const entitySources = document.getElementById('entity-sources');
const entityConnections = document.getElementById('entity-connections');

function renderEntities() {
  entityList.innerHTML = '';
  entities.forEach((entity) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `<h3>${entity.name}</h3><p>${entity.type}</p><p>${entity.summary}</p>`;
    card.addEventListener('click', () => renderEntity(entity.id));
    entityList.appendChild(card);
  });
}

function renderEntity(id) {
  const entity = entities.find((item) => item.id === id) || entities[0];
  entityName.textContent = entity.name;
  entityType.textContent = entity.type;
  entitySummary.textContent = entity.summary;
  entityDates.textContent = entity.dates;
  entityPlace.textContent = entity.place;

  entitySources.innerHTML = '';
  entity.sources.forEach((source) => {
    const li = document.createElement('li');
    li.textContent = source;
    entitySources.appendChild(li);
  });

  entityConnections.innerHTML = '';
  entity.connections.forEach((connection) => {
    const li = document.createElement('li');
    li.textContent = connection;
    entityConnections.appendChild(li);
  });
}

renderEntities();
renderEntity('socrates');
