# Implementación propuesta a partir de la ontología v0.1

## 1. Modelo conceptual base

La ontología define una plataforma de conocimiento centrada en entidades del mundo real, no en páginas. Por tanto, la arquitectura debe construirse alrededor de tres capas:

1. Entidades
2. Relaciones
3. Vistas derivadas

Cada vista (grafo, cronología, mapa, artículo, comparación, chat) debe ser una proyección del mismo modelo semántico.

---

## 2. Tipos de entidad que deben existir en la base

### Entidades principales
- Persona
- Obra
- Concepto
- Evento
- Lugar
- Civilización

### Subtipos recomendados para el MVP
- Persona: filósofo, escritor, poeta, científico, matemático, artista, arquitecto, compositor, político, militar, explorador, santo, papa, monarca
- Obra: libro, poema, tragedia, ensayo, tratado, pintura, escultura, edificio, sinfonía, ópera, película, serie, documental, videojuego
- Evento: guerra, batalla, revolución, descubrimiento, fundación, concilio, coronación, tratado
- Lugar: continente, país, región, ciudad, sitio arqueológico, museo, universidad, biblioteca, monumento, ruta histórica

### Campos obligatorios por entidad
- id
- tipo
- nombre principal
- nombre original
- aliases
- resumen corto
- descripción larga
- fecha inicial / fecha final
- lugar(s) asociado(s)
- imagen principal
- estado editorial
- nivel de confianza
- fuente(s) principal(es)
- fecha de creación / actualización

### Campos recomendados adicionales
- idioma(s)
- disciplina(s)
- civilización(es)
- coordenadas geográficas
- etiquetas temáticas
- enlaces oficiales
- bibliografía recomendada
- preguntas canónicas

---

## 3. Tipos de relación que deben soportarse

### Relaciones intelectuales
- escribió
- influyó en
- fue influido por
- desarrolló
- criticó
- refutó
- respondió a
- comentó
- tradujo
- adaptó

### Relaciones históricas
- ocurrió en
- ocurrió durante
- causó
- fue consecuencia de
- precede a
- sucede a

### Relaciones geográficas
- nació en
- murió en
- se desarrolla en
- conserva
- se encuentra en

### Relaciones artísticas
- representa
- está inspirado en
- adapta
- versiona
- homenajea

### Relaciones educativas
- requiere conocer
- recomendado antes de
- recomendado después de

### Campos obligatorios en toda relación
- id
- tipo de relación
- entidad origen
- entidad destino
- fecha o rango de fechas
- explicación breve
- fuente principal
- nivel de confianza
- evidencias asociadas
- última revisión
- estado editorial

---

## 4. Modelo de fuentes y confianza

La ontología ya establece la lógica de confianza. Esto debe traducirse a una estructura explícita.

### Nivel de confianza
- 5 estrellas: fuente primaria
- 4 estrellas: institución oficial
- 3 estrellas: universidad
- 2 estrellas: revista científica
- 1 estrella: divulgación

### Campos de fuente
- id
- tipo de fuente
- título
- autor / institución
- URL
- fecha de publicación
- fecha de acceso
- nivel de confianza
- notas editoriales
- licencia / derechos

### Reglas recomendadas
- Toda afirmación debe poder rastrearse hasta una fuente.
- Si una relación no tiene fuente válida, no debe publicarse.
- El usuario debe poder ver el grado de confianza de cada relación y de cada pieza de contenido.

---

## 5. Estructura de contenido editorial

Cada entidad debe poder generar, al menos, estas vistas:

### One-pager
- hero visual
- resumen breve
- por qué importa
- cronología
- contexto
- mapa
- ideas clave
- entidades relacionadas
- recursos oficiales
- bibliografía recomendada

### Artículo profundo
- contexto histórico
- contexto intelectual
- biografía
- análisis
- grandes escenas / ideas clave
- símbolos y temas
- historia vs mito
- influencias y adaptaciones
- bibliografía comentada

### Vistas derivadas
- grafo
- cronología
- mapa
- biblioteca
- comparador
- buscador semántico
- chat IA

---

## 6. Diseño de la experiencia de usuario

### Layout general recomendado
- Header con navegación principal, búsqueda y acceso rápido a rutas guiadas
- Home con exploración temática y acceso a entidades destacadas
- Vista de entidad con tres zonas:
  - panel izquierdo: resumen, metadatos, fuentes
  - panel central: contenido profundo y contexto
  - panel derecho: grafo, cronología, mapa, recursos
- Vista de grafo como experiencia central
- Vista de cronología con filtros por época y disciplina
- Vista de mapa con capas geográficas

### Principios UX
- navegación intuitiva incluso para usuarios no expertos
- transiciones suaves entre exploración y lectura
- contexto visible en todo momento
- contenido modular y escalable

### Responsive
- mobile-first
- paneles plegables en pantallas pequeñas
- jerarquía de lectura progresiva
- navegación por tabs o acordeones para vistas secundarias
- modo lectura cómodo con foco en el contenido

---

## 7. Visualización recomendada

### Grafo semántico
- nodo central + nodos relacionados
- filtros por tipo de entidad y relación
- zoom, panning y enfoque por entidad
- rutas causales y rutas de aprendizaje
- visualización de nivel de confianza por borde

### Cronología
- línea temporal interactiva
- agrupación por periodo, disciplina o civilización
- posibilidad de mostrar personas, obras y eventos simultáneamente

### Mapa
- marcadores geográficos con coordenadas
- enlaces a Google Maps y Google Earth
- filtros por época, entidad o tipo de lugar

### Comparador
- comparación entre dos o más entidades
- enfoque en influencias, coincidencias y diferencias

---

## 8. MVP recomendado

No conviene empezar con la plataforma completa. El MVP debe demostrar el modelo semántico y la experiencia de navegación sin intentar abarcarlo todo.

### Alcance inicial del MVP
- 1 idioma: español
- 1 foco inicial: Grecia y Roma, o bien una franja histórica concreta
- 50 a 100 entidades principales
- 100 a 200 relaciones clave
- 10 a 20 one-pagers
- 3 vistas principales:
  - grafo
  - cronología
  - mapa
- búsqueda básica y contenido profundo inicial

### Entidades MVP mínimas
- Persona
- Obra
- Concepto
- Evento
- Lugar
- Civilización

### Relaciones MVP mínimas
- escribió
- influyó en
- fue influido por
- ocurrió en
- causó
- nació en
- murió en
- representa
- adapta

### Funcionalidades MVP
- crear y editar entidades
- crear y editar relaciones con metadatos
- visualizar una entidad con one-pager
- ver su red de conexiones
- ver cronología asociada
- ver ubicaciones geográficas
- mostrar fuentes y confianza

---

## 9. Diseño de datos para el primer sprint

### Modelo de base recomendado

#### Entidad
- id
- tipo
- nombre
- nombre_original
- aliases
- resumen
- descripción
- fecha_inicio
- fecha_fin
- lugar_id
- imagen_url
- estado_editorial
- nivel_confianza
- created_at
- updated_at

#### Relación
- id
- tipo_relacion
- origen_id
- destino_id
- fecha_inicio
- fecha_fin
- explicación
- fuente_id
- nivel_confianza
- estado_editorial
- created_at
- updated_at

#### Fuente
- id
- tipo
- título
- autor_o_institucion
- url
- fecha_publicacion
- fecha_acceso
- nivel_confianza
- notas
- licencia

#### Contenido
- id
- entidad_id
- tipo_contenido
- titulo
- cuerpo
- version
- estado
- author_id

---

## 10. Recomendación técnica inicial

### Stack recomendado para empezar
- Frontend: Next.js + React + TypeScript
- Backend: FastAPI + Python
- Base de datos relacional: PostgreSQL
- Grafo: Neo4j
- Búsqueda: PostgreSQL + pgvector o OpenSearch
- Almacenamiento de multimedia: S3-compatible
- Infraestructura: Docker + Azure o AWS

### Justificación breve
- Next.js permite una experiencia pública sólida y SEO fuerte.
- FastAPI encaja bien con procesos de IA, ingestión y APIs.
- PostgreSQL y Neo4j juntos cubren tanto la estructura relacional como el grafo semántico.

---

## 11. Qué haría ahora mismo

Con esta ontología, el siguiente paso correcto es:

1. convertir la ontología en un esquema de datos concreto
2. definir el primer conjunto de entidades y relaciones del MVP
3. diseñar el layout base de la UI
4. implementar una primera versión del grafo y del one-pager
5. introducir el sistema de fuentes y confianza desde el inicio

### Prioridad de implementación
1. modelo de datos
2. creación / edición de entidades
3. creación / edición de relaciones
4. visualización de grafo simple
5. one-pager de entidad
6. cronología
7. mapa
8. buscador semántico

---

## 12. Conclusión

La ontología v0.1 ya es suficiente para construir una primera versión seria y coherente del producto. La clave es no empezar por “todo”, sino por una base mínima que demuestre que el sistema puede representar conocimiento real, vincularlo a fuentes y presentarlo de forma navegable.
