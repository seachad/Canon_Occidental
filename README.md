# El Canon de Occidente

Plataforma semántica que conecta personas, obras, ideas, eventos y lugares de la tradición occidental en un grafo navegable.

## Sitio publicado (GitHub Pages)

La raíz del repositorio es el sitio estático. Se sirve directamente desde `main`:

- `index.html` — landing responsive + grafo 3D
- `graph-data.js` — el dataset (nodos y aristas). **Este es el archivo que se edita para ampliar el canon.**
- `graph.js` — motor del grafo: layout, render, controles, panel y filtros
- `.nojekyll` — evita que Jekyll procese el repo (necesario por `frontend/app/entities/[slug]/`)

Para activarlo: Settings → Pages → Deploy from branch → `main` / `/ (root)`.

### El grafo 3D

Three.js r128 desde CDN, sin build step. Estado actual: **51 entidades y 94 relaciones** del foco Grecia y Roma.

- Arrastrar para girar, rueda o pellizco para acercarse
- Pulsar un nodo (o su etiqueta) abre una ficha flotante con fechas, resumen, enlace a Wikipedia y, si existe, al texto completo en Wikisource
- Desde la ficha se viaja a cualquier nodo conectado, con la cámara volando hasta él
- Chips por grupo para activar y desactivar familias enteras de nodos
- Buscador, tres modos de etiquetas y modo pantalla completa

#### Añadir entidades

Editar `graph-data.js`. Cada nodo:

```js
{ id:'identificador', n:'Nombre', g:'persona|obra|idea|evento|lugar',
  d:'fechas', s:'resumen breve',
  w:'Título exacto en es.wikipedia.org',
  t:'Título en es.wikisource.org'   // opcional, solo obras con texto libre
}
```

Cada arista: `['id_origen', 'id_destino', 'relación']`. El layout se recalcula solo.

Verificar siempre que `w` es el título exacto del artículo: un título inventado produce un enlace roto.

## Prototipos

- `frontend/` — aplicación Next.js (interfaz inicial, sin desplegar)
- `backend/` — API mínima en FastAPI
- `site/` — primera maqueta estática, sustituida por la raíz

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Documentos de diseño

`Blueprint_El_Canon_de_Occidente.md`, `Ontologia_v0.1_El_Canon_de_Occidente.md`,
`Implementacion_ontologia_v0.1.md`, `Arquitectura_y_estructura_MVP.md`.

## Siguientes pasos

- Ampliar el canon hacia el cristianismo, la escolástica y el Renacimiento
- Tipar las relaciones en la ontología en lugar de como texto libre
- Cronología y mapa sincronizados con la selección del grafo
- Servir el dataset desde el backend en vez de un archivo estático
