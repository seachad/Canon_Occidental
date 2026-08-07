# Arquitectura y estructura del MVP

## 1. Objetivo del MVP

Construir una primera versión usable del producto que demuestre:
- que el modelo semántico funciona
- que las entidades pueden relacionarse entre sí
- que el contenido puede presentarse con una experiencia visual clara
- que las fuentes y la confianza son parte del producto

El MVP no debe intentar cubrir toda la ontología. Debe cubrir una base mínima y sólida.

---

## 2. Alcance inicial del MVP

### Alcance funcional mínimo
- Crear y editar entidades
- Crear y editar relaciones
- Mostrar una entidad con one-pager
- Mostrar un grafo de conexiones simple
- Mostrar una cronología asociada
- Mostrar ubicaciones geográficas
- Mostrar fuentes y nivel de confianza
- Búsqueda básica por nombre, tipo y tema

### Alcance de contenido mínimo
- 1 idioma: español
- 1 foco histórico concreto: Grecia y Roma, o una etapa inicial del canon occidental
- 50 a 100 entidades principales
- 100 a 200 relaciones clave
- 10 a 20 one-pagers

---

## 3. Estructura de pantallas

### 3.1 Home / exploración
Objetivo: introducir al usuario, mostrar rutas de entrada y facilitar la exploración.

#### Bloques de la home
- Hero con pregunta central: “¿Cómo se construyó Occidente?”
- Buscador principal
- Rutas guiadas recomendadas
- Entidades destacadas
- Exploración por civilización / disciplina / época
- Últimas actualizaciones

#### Componentes visuales
- tarjetas de entidades
- bloques temáticos
- sección de “descubrir”
- CTA a rutas guiadas y grafo

---

### 3.2 Vista de entidad
Objetivo: presentar una entidad de forma clara, útil y visual.

#### Layout recomendado
- Panel izquierdo: resumen, metadatos, tipos, fechas, ubicación, fuentes
- Panel central: contenido profundo, contexto, ideas clave, biografía o explicación
- Panel derecho: conexiones, cronología, mapa, recursos oficiales

#### Secciones internas
- Resumen rápido
- Por qué importa
- Contexto histórico / intelectual
- Obra o concepto principal
- Conexiones relevantes
- Fuentes y confianza
- Bibliografía recomendada

#### Elementos interactivos
- abrir relaciones en detalle
- mostrar nodo en el grafo
- ver cronología vinculada
- abrir mapa asociado

---

### 3.3 Vista de grafo
Objetivo: mostrar la red semántica como el corazón del producto.

#### Funcionalidades mínimas
- nodo central visible
- nodos vecinos conectados
- filtros por tipo de entidad y relación
- zoom y pan
- selección de nodo para ver detalles
- mostrar nivel de confianza por relación

#### Componentes
- sidebar de filtros
- canvas o visualización interactiva central
- panel de detalle del nodo seleccionado

---

### 3.4 Vista de cronología
Objetivo: mostrar el desarrollo histórico de forma temporal y navegable.

#### Funcionalidades mínimas
- línea temporal simple
- agrupación por siglo o periodo
- filtros por civilización y disciplina
- click en evento para ver entidad relacionada

---

### 3.5 Vista de mapa
Objetivo: presentar ubicaciones, rutas y contexto geográfico.

#### Funcionalidades mínimas
- mapa interactivo con marcadores
- filtros por tipo de lugar o periodo
- click sobre marcador para ver entidad
- enlaces a Google Maps / Google Earth

---

### 3.6 Vista de comparación
Objetivo: comparar dos entidades o conceptos.

#### Funcionalidades mínimas
- comparar dos entidades seleccionadas
- mostrar similitudes, diferencias e influencias
- destacar relaciones entre ambas

---

## 4. Arquitectura técnica propuesta

### 4.1 Frontend
Tecnología recomendada: Next.js + React + TypeScript.

#### Motivos
- rendimiento y SEO
- buena experiencia de desarrollo para dashboards y vistas complejas
- facilidad para construir rutas dinámicas de entidad
- soporte amplio para componentes reutilizables

#### Estructura de carpetas sugerida
- app/
  - page.tsx
  - entities/[slug]/page.tsx
  - graph/page.tsx
  - timeline/page.tsx
  - map/page.tsx
  - compare/page.tsx
- components/
  - layout/
  - entities/
  - graph/
  - timeline/
  - map/
  - ui/
- lib/
- types/
- data/

---

### 4.2 Backend
Tecnología recomendada: FastAPI + Python.

#### Responsabilidades
- CRUD de entidades
- CRUD de relaciones
- gestión de fuentes
- validación editorial
- endpoints de búsqueda
- endpoints de grafo
- endpoints de cronología
- endpoints de contenido enriquecido

#### Estructura sugerida
- api/
  - entities/
  - relationships/
  - sources/
  - search/
  - graph/
  - content/

---

### 4.3 Base de datos
#### PostgreSQL
Usar PostgreSQL como base principal para:
- entidades
- relaciones
- fuentes
- contenido editorial
- usuarios y permisos
- versionado

#### Neo4j
Usar Neo4j para el grafo semántico.

#### Justificación
- PostgreSQL sirve para estructura y trazabilidad editorial.
- Neo4j sirve para recorridos, grafos, caminos y conexiones.

---

### 4.4 Búsqueda
Se recomienda combinar:
- búsqueda textual tradicional
- búsqueda semántica por embeddings

#### Opción inicial simple
- PostgreSQL + pgvector para un MVP ligero

#### Opción más escalable
- OpenSearch o Elasticsearch + vector search

---

### 4.5 Almacenamiento multimedia
- imágenes de entidades
- pósters, portadas, pinturas, fotos, documentos
- archivos PDF, audios o videos pequeños

Recomendación: almacenamiento compatible con S3.

---

## 5. Modelo de datos técnico propuesto

### Entidad
Campos mínimos:
- id
- type
- canonical_name
- original_name
- aliases
- summary
- description
- start_date
- end_date
- place_id
- image_url
- created_at
- updated_at
- status
- confidence_score
- source_ids

### Relación
Campos mínimos:
- id
- relation_type
- source_entity_id
- target_entity_id
- start_date
- end_date
- explanation
- source_id
- confidence_score
- status
- created_at
- updated_at

### Fuente
Campos mínimos:
- id
- title
- author_or_institution
- type
- url
- publication_date
- access_date
- confidence_level
- notes
- license

### Contenido
Campos mínimos:
- id
- entity_id
- content_type
- locale
- title
- body
- version
- status
- created_at
- updated_at

---

## 6. Flujo de datos recomendado

### Crear una entidad
1. el editor introduce los datos básicos
2. el sistema guarda la entidad en PostgreSQL
3. la entidad se sincroniza en Neo4j como nodo del grafo
4. se genera una ficha base y una vista preliminar

### Crear una relación
1. el editor selecciona origen y destino
2. define el tipo de relación
3. añade explicación, fecha y fuente
4. el sistema valida la relación
5. la relación se publica en el grafo y en la vista de entidad

### Mostrar una entidad
1. se recupera la entidad desde PostgreSQL
2. se cargan sus relaciones desde Neo4j o desde una vista materializada
3. se generan los componentes de one-pager, cronología y mapa

---

## 7. Requisitos de UX para el MVP

### Priorización UX
1. claridad sobre qué es la entidad
2. facilidad para navegar entre relaciones
3. visibilidad de fuentes y confianza
4. navegación fluida entre grafo, cronología y mapa

### Diseño visual recomendado
- interfaz sobria, académica pero accesible
- jerarquía clara de títulos, métricas y recursos
- tarjetas y paneles claros
- diseño modular y escalable

### Responsive
- mobile-first
- pantallas pequeñas: una columna principal, paneles plegables
- pantallas grandes: layout en tres columnas para entidad
- el grafo debe adaptarse a pantallas pequeñas con modo compacto

---

## 8. Priorización de desarrollo

### Fase 1: infraestructura base
- setup del proyecto
- base de datos PostgreSQL
- modelo de entidades y relaciones
- CRUD básico

### Fase 2: experiencia de entidad
- one-pager de entidad
- mostrar resumen, fechas, ubicación, fuentes
- mostrar relaciones básicas

### Fase 3: grafo y navegación
- visualización de grafo simple
- selección de nodos
- filtros básicos

### Fase 4: cronología y mapa
- lineas temporales
- marcadores geográficos

### Fase 5: búsqueda y IA
- búsqueda básica
- recomendaciones
- chat contextual opcional

---

## 9. Decisiones concretas para empezar hoy

### Qué construir primero
1. esquema de datos base en PostgreSQL
2. API mínima para entidades y relaciones
3. UI de una entidad con resumen y conexiones
4. visualización simple del grafo
5. sistema básico de fuentes y confianza

### Qué no hacer todavía
- IA avanzada
- búsqueda semántica compleja
- multilingüismo completo
- ontología amplia de inferencias
- módulos de monetización

---

## 10. Propuesta final

El MVP debe ser una plataforma de conocimiento visual y editorial, con una entidad como punto de entrada, un grafo como eje estructural y una capa de fuentes y confianza visible en todo momento. La arquitectura propuesta permite crecer desde una versión simple hacia una plataforma semántica completa sin reescribir el sistema desde cero.
