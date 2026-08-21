# El Canon de Occidente

Plataforma semántica que conecta personas, obras, ideas, eventos y lugares de la tradición occidental en un grafo navegable.

## Sitio publicado (GitHub Pages)

La raíz del repositorio es el sitio estático. Se sirve directamente desde `main`:

- `index.html` — la aplicación: pantalla completa, solo el globo y su HUD
- `graph-data.js` — el dataset (nodos y aristas). **Este es el archivo que se edita para ampliar el canon.**
- `graph.js` — motor del grafo: layout esférico, render, controles, ficha, filtros y cronología
- `.nojekyll` — evita que Jekyll procese el repo (necesario por `frontend/app/entities/[slug]/`)

Para activarlo: Settings → Pages → Deploy from branch → `main` / `/ (root)`.

### El globo semántico

Three.js r128 desde CDN, sin build step. Estado actual: **51 entidades y 94 relaciones** del foco Grecia y Roma.

La página es únicamente el grafo. Los nodos no flotan en el vacío: viven sobre la superficie
de una esfera con meridianos, ecuador, atmósfera y campo de estrellas, y las relaciones son
arcos que se elevan sobre ella. La cámara siempre orbita el globo mirando al centro, así que
girar es navegar y nunca se pierde la referencia de dónde se está (brújula con latitud y
longitud abajo a la derecha).

- Arrastrar para girar, rueda o pellizco para acercarse, flechas y `+`/`-` desde el teclado
- Pulsar un nodo (o su etiqueta) lo pone en el centro: el globo gira hasta él y se abre su ficha
- Desde la ficha se viaja a cualquier nodo conectado
- Chips por grupo, buscador, tres modos de etiquetas y pantalla completa

### Ventana temporal

Siempre hay un elemento seleccionado, y el grafo solo muestra lo que cae a ±X años de sus
fechas (los lugares sin fecha permanecen siempre, como tejido conectivo). El control de la
izquierda ajusta X con un deslizador logarítmico de 50 a 100.000 años y una casilla para
escribir cualquier cifra. Por defecto, 50 años alrededor de Sócrates.

### Cronología

La franja inferior es la cronología de lo que hay en el grafo, ordenada por fecha y con
tarjetas que llevan a su nodo. Por defecto muestra el mismo tipo del elemento seleccionado
—una cronología de personas si se selecciona una persona— y los chips de tipo añaden o
quitan obras, ideas, eventos y lugares.

Las fechas se leen del campo `d` del dataset (`470–399 a. C.`, `s. VIII a. C.`,
`63 a. C. – 14 d. C.`, `476`, `—`), así que basta escribirlas bien para que ordenen y filtren.

Todo lo que elige el usuario —selección, años, grupos, tipos de la cronología, etiquetas—
se guarda en `localStorage` y se recupera en la siguiente visita.

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
- Fechas estructuradas en el dataset (`y0`/`y1`) en vez de deducirlas del texto de `d`
- Mapa sincronizado con la selección, como ya lo está la cronología
- Servir el dataset desde el backend en vez de un archivo estático
