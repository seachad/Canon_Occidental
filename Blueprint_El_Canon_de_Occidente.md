# EL CANÓN DE OCCIDENTE
# Blueprint profesional para la plataforma

## 1. Visión del producto

El Canon de Occidente es una plataforma de conocimiento construida como un Knowledge Operating System para la civilización occidental. No funciona como enciclopedia, blog ni LMS, sino como un grafo semántico multidimensional que conecta entidades reales y conceptuales: personas, obras, ideas, lugares, acontecimientos, instituciones, obras de arte, tecnologías, teorías, religiones, movimientos y documentos.

### Propósito central
- Permitir comprender la historia de Occidente como una red viva de influencias, causas y consecuencias.
- Hacer visible cómo las ideas, los artefactos y los acontecimientos están conectados entre sí.
- Ofrecer navegación por múltiples ejes: cronológico, geográfico, disciplinar, causal, temático y afectivo.

### Valor diferencial
- El conocimiento no se presenta como páginas aisladas, sino como un ecosistema navegable.
- Cada nodo tiene contexto, fuentes, relevancia, evolución y conexiones.
- La plataforma combina narrativa, investigación profunda, visualización semántica y IA contextual.

### Principios de producto
1. El grafo es la unidad fundamental del sistema.
2. Los one-pagers son puertas de entrada, no sustitutos del contenido profundo.
3. Toda experiencia deriva de un mismo modelo de conocimiento.
4. La confianza en las fuentes es un producto, no una capa secundaria.
5. La plataforma debe escalar sin perder rigor histórico.

---

## 2. Benchmark

### Competidores y referentes

#### A. Britannica / Encyclopedia Britannica
- Fortalezas: autoridad, rigor editorial y estructura disciplinar.
- Limitaciones: enfoque estático, poco orientado a grafo semántico y débil en conexiones transversales.
- Aprendizaje: la autoridad editorial es crucial, pero la navegación debe ser más relacional.

#### B. Google Arts & Culture
- Fortalezas: experiencia visual, museografía, exploración cultural y excelente UX.
- Limitaciones: no ofrece un sistema de conocimiento causal ni un modelo semántico rico.
- Aprendizaje: el storytelling visual es imprescindible.

#### C. IMDb
- Fortalezas: abundancia de metadatos, relaciones entre obras y personas, y excelentes vistas de exploración.
- Limitaciones: enfoque demasiado especializado y poco profundo en contexto histórico y filosófico.
- Aprendizaje: las entidades y relaciones deben ser muy ricas y muy bien indexadas.

#### D. Our World in Data
- Fortalezas: claridad, visualización, contexto y diseño de interpretación.
- Limitaciones: menos adecuado para conocimiento narrativo y humanístico.
- Aprendizaje: la visualización debe ayudar a comprender, no solo a mostrar datos.

#### E. TheBrain / Heptabase / Obsidian
- Fortalezas: organización de conocimiento por conexiones y pensamiento estructural.
- Limitaciones: no están diseñados para publicaciones masivas ni para un público amplio.
- Aprendizaje: el grafo puede ser el corazón de la experiencia, pero debe ser acompañado de jerarquías y narrativas.

### Posicionamiento competitivo
El Canon de Occidente no compite solo por contenido, sino por una forma nueva de comprender el pasado y el presente. Su propuesta es combinar autoridad, visualización, semántica, IA y narrativa en una sola plataforma de conocimiento.

### Diferenciadores clave
- Modelo de conocimiento basado en entidades y relaciones verificables.
- Vistas múltiples sobre la misma base de datos semántica.
- IA contextual que amplía, no sustituye, el trabajo editorial.
- Enfoque internacional y multilingüe desde el inicio.

---

## 3. Arquitectura

### Visión arquitectónica
La arquitectura debe estar diseñada para sostener tres capas:
1. La capa de conocimiento: ontología, entidades, relaciones, fuentes y metadatos.
2. La capa de experiencia: interfaz, visualización, navegación, búsquedas y rutas guiadas.
3. La capa de inteligencia: ingestión, extracción semántica, validación, RAG, recomendaciones y enriquecimiento.

### Arquitectura recomendada

#### Frontend
- Framework: Next.js con React y TypeScript.
- Motivos: rendimiento, SEO, SSR/SSG, experiencia moderna y escalabilidad.
- Componentes clave: motor de grafo, timeline interactiva, mapa geográfico, buscador, vistas de contenido profundo, panel editorial.

#### Backend
- API principal: Python con FastAPI.
- Motivos: excelente ecosistema para IA, NLP, procesamiento de fuentes y pipelines de ingestión.
- Servicios complementarios: Node.js o Go para servicios de alta concurrencia si se requiere.

#### Base de datos
- PostgreSQL como sistema relacional principal para entidades, usuarios, contenido, permisos, versiones y relaciones estructurales.
- Neo4j para el grafo semántico principal.
- PostgreSQL + pgvector o Qdrant para búsqueda semántica y recuperación vectorial.
- Object storage: S3-compatible para multimedia, PDFs, archivos y copias de fuentes.

#### Motor de búsqueda
- OpenSearch o Elasticsearch para búsqueda textual, filtrado y agregación.
- Vector search para similitud semántica y recomendaciones.

#### CMS y gestión editorial
- Decoupled CMS como Strapi, Sanity o Contentful, o un CMS propio para flujos de revisión editorial.
- Recomendación: un CMS propio o un stack híbrido para dar soporte a workflow editorial complejo.

#### IA y pipelines
- Modelos de lenguaje para extracción estructurada de relaciones, resumen, generación de one-pagers, clasificación, traducción y extracción de metadatos.
- Procesamiento de documentos con OCR y parsing especializado para PDFs, manuscritos y archivos históricos.

#### Infraestructura
- Cloud: Azure o AWS.
- Contenedores: Docker + Kubernetes o un modelo más simple en fase MVP si el volumen lo permite.
- Observabilidad: OpenTelemetry, Prometheus, Grafana, logs centralizados.
- Seguridad: OAuth2, RBAC, cifrado en tránsito y en reposo, auditoría y control de accesos.

### Decisiones de arquitectura justificadas
- PostgreSQL + Neo4j: porque el contenido necesita estructura relacional y relaciones complejas simultáneamente.
- Next.js: por SEO y rendimiento en una plataforma que necesita ser legible por buscadores y usuarios.
- FastAPI: por la capacidad de integrar IA, procesamiento y APIs con velocidad.
- OpenSearch + vector DB: para combinar búsqueda tradicional y semántica.
- Storage distribuido: para manejar multimedia y fuentes de alto volumen.

---

## 4. Ontología

La ontología debe ser el contrato conceptual del producto. Define qué tipos de entidades existen, qué relaciones pueden sostener y qué metadatos las acompañan.

### Tipos de nodos
- Persona
- Obra
- Personaje
- Idea
- Concepto
- Acontecimiento
- Lugar
- Ciudad
- País
- Imperio
- Civilización
- Museo
- Universidad
- Manuscrito
- Película
- Serie
- Documental
- Videojuego
- Edificio
- Ley
- Religión
- Movimiento
- Invención
- Descubrimiento
- Fuente
- Institución
- Técnica
- Disciplina

### Atributos comunes de todos los nodos
- Identificador único
- Nombre principal
- Nombres alternativos
- Resumen corto
- Descripción larga
- Fecha de inicio y fin si aplica
- Ubicación geográfica si aplica
- Tipo de entidad
- Estado de validación
- Nivel de confianza
- Lista de fuentes primarias y secundarias
- Fecha de última revisión
- Etiquetas temáticas
- Nivel de profundidad editorial

### Relaciones tipadas
- Escribió
- Inspiró
- Adaptó
- Criticó
- Respondió a
- Desarrolló
- Contradijo
- Pertenece a
- Ocurre en
- Ocurre durante
- Nació en
- Murió en
- Influencia
- Consecuencia de
- Causa de
- Representa
- Conserva
- Traduce
- Comenta
- Contemporáneo de

### Metadatos de relación
Cada relación debe guardar:
- Fecha o rango de fechas
- Fuente principal
- Explicación breve
- Nivel de confianza
- Tipo de evidencia
- Estado de revisión
- Autor de la relación
- Última verificación

### Capas ontológicas
- Capa factual: hechos históricos, fechas y eventos.
- Capa conceptual: ideas, corrientes, doctrinas y categorías.
- Capa cultural: obras, formatos, instituciones y producciones.
- Capa espacial: lugares, mapas, coordenadas y movilidad.
- Capa temporal: cronologías, secuencias y causalidad.

---

## 5. Modelo de datos

### Diseño conceptual
El modelo debe separar claramente:
- Entidades
- Relaciones
- Metadatos de relación
- Contenidos narrativos
- Multimedia
- Fuentes
- Versionado
- Permisos

### Entidades principales

#### Entity
- id
- type
- canonical_name
- aliases
- summary
- description
- created_at
- updated_at
- status
- confidence_score
- review_state

#### Relationship
- id
- source_entity_id
- target_entity_id
- relationship_type
- explanation
- start_date
- end_date
- evidence_source_id
- confidence_score
- created_by
- review_state

#### ContentBlock
- id
- entity_id
- content_type
- locale
- title
- body
- version
- status
- author_id
- created_at
- updated_at

#### MediaAsset
- id
- entity_id
- media_type
- url
- caption
- source
- license
- attribution
- alt_text

#### Source
- id
- citation
- source_type
- url
- publisher
- publication_date
- access_date
- trust_level
- notes

#### ProvenanceRecord
- id
- content_id
- source_id
- extraction_method
- confidence
- created_at

### Diseño de versionado
- Cada bloque de contenido debe mantener versiones.
- Cada relación debe poder volver a una revisión anterior.
- Cada cambio editorial debe registrar autor, fecha y motivo.

### Requisitos de licencia y derechos
- Cada media asset debe tener licencia explícita.
- La plataforma debe registrar derechos de uso, restricciones y atribuciones.
- Se debe evitar duplicar contenido sin contexto o sin fuente verificable.

---

## 6. UX/UI

### Filosofía de diseño
La experiencia debe sentirse a la vez académica, elegante y accesible. No debe parecer un sistema administrativo ni una wiki antigua. Debe combinar rigidez intelectual con fluidez visual.

### Principios UX
- La navegación debe ser intuitiva, incluso cuando el contenido es complejo.
- El usuario debe poder pasar de una pregunta simple a una exploración profunda sin perder contexto.
- Todos los paneles deben comunicar: qué está viendo, por qué importa y cómo avanzar.

### Experiencia recomendada por pantalla

#### A. Home / Landing
- Hero visual con una pregunta central: “¿Cómo se construyó Occidente?”
- Bloques temáticos por civilización, disciplina y época.
- Ruta guiada inicial.
- Búsqueda semántica destacada.

#### B. One-pager de entidad
- Resumen visual
- Importancia cultural/histórica
- Línea temporal
- Mapa
- Personajes relacionados
- Conexiones del grafo
- Recursos oficiales
- Bibliografía comentada

#### C. Vista de grafo
- Zoom continuo
- Filtros por disciplina, época, civilización y tipo de relación
- Visualización de nodos por importancia
- Capas de detalle
- Ruta causal y ruta mínima

#### D. Vista de cronología
- Línea temporal interactiva
- Alineación de eventos, personas, ideas y obras
- Filtros por tema o civilización

#### E. Vista geográfica
- Mapa interactivo con coordenadas
- Enlaces a Google Maps y Google Earth
- Exploración espacial por migraciones, viajes e influencias

#### F. Biblioteca y contenido profundo
- Organización por disciplina, civilización y formato
- Acceso rápido a artículos extensos, audios, imágenes y documentos

### Visual language
- Tipografía serif para contenido de alto valor intelectual, sans para navegación y metadatos.
- Paleta sobria, con acentos cromáticos por disciplina y época.
- Diseño modular, modularidad editorial y modularidad visual.

---

## 7. Wireframes

### 1. Pantalla de inicio
- Header con menú principal y búsqueda.
- Hero con preguntas iniciales y ruta guiada.
- Secciones: “Explorar por civilización”, “Descubrir por disciplina”, “Rutas recomendadas”, “Novedades”.

### 2. Pantalla de entidad
- Panel izquierdo: resumen, enlaces, metadatos.
- Panel central: contenido profundo y contexto.
- Panel derecho: grafo de conexiones, cronología y recursos.

### 3. Pantalla de grafo
- Barra lateral de filtros.
- Área central del grafo interactivo.
- Panel inferior de detalle y recomendaciones.

### 4. Pantalla de mapa
- Mapa principal con marcadores y capas.
- Ajustes de tiempo y disciplina.
- Panel lateral con entidades y rutas.

### 5. Panel editorial
- Gestión de entradas, validación de fuentes, revisión, publicación y versionado.
- Estado de cada pieza: borrador, revisión, aprobado, publicado.

---

## 8. MVP

### Meta del MVP
Construir una versión inicial fuerte, elegante y usable, capaz de demostrar el modelo de conocimiento sin esperar a resolver todo el ecosistema.

### Alcance inicial del MVP
- 1 idioma principal: español.
- 1 civilización o foco inicial: Grecia, Roma, Judeocristianismo, Renacimiento o Ilustración.
- 100 a 300 entidades principales.
- 50 a 100 relaciones críticas.
- 20 a 30 one-pagers.
- 10 a 15 rutas guiadas.
- 3 vistas principales: grafo, cronología y mapa.
- Búsqueda básica y contenido profundo para las entidades iniciales.

### Requisitos funcionales MVP
- Registro y publicación de entidades.
- Relación entre entidades con metadatos.
- One-pager de entidad.
- Vista de grafo básica.
- Vista cronológica.
- Vista geográfica básica.
- Búsqueda semántica inicial.
- Sistema de validación de fuentes con estado visible.

### Objetivos del MVP
- Demostrar que el modelo semántico funciona.
- Probar la calidad editorial y la experiencia visual.
- Validar la curva de adopción de usuarios interesados en cultura, historia y pensamiento.

---

## 9. Roadmap

### Fase 0: Fundamentos (0-3 meses)
- Definir ontología base.
- Diseñar modelo de datos.
- Crear prototipo UX/UI.
- Implementar infraestructura básica.

### Fase 1: MVP (3-9 meses)
- Publicar primer conjunto de entidades y relaciones.
- Desarrollar grafo, cronología y mapas.
- Lanzar contenido profundo inicial.
- Implementar sistema básico de fuentes y validación.

### Fase 2: Expansión (9-18 meses)
- Añadir más disciplinas y civilizaciones.
- Mejorar IA y búsqueda semántica.
- Integrar recomendaciones y rutas guiadas más complejas.
- Mejorar herramientas editoriales.

### Fase 3: Escalado (18-36 meses)
- Internacionalización amplia.
- Mayor cobertura editorial.
- Integración de audio, vídeo, documentos y reconstrucciones.
- Expansión a contenido premium y licencias educativas.

---

## 10. Estrategia editorial

### Modelo editorial
El proyecto debe funcionar como una editorial digital de alto rigor, no como un depósito de contenido generado automáticamente. La autoridad editorial debe ser visible.

### Tipos de contenido
- One-pager
- Artículo profundo
- Cronología
- Ruta guiada
- Comparador de ideas
- Perfil de entidad
- Mapa temático
- Biblioteca comentada

### Producción editorial
- Cada entidad debe pasar por: investigación, redacción, validación de fuentes, revisión editorial, publicación y actualización.
- El contenido debe estar firmado por autores, editores o equipos disciplinares.
- Cada pieza debe incluir una nota de edición y una lista de fuentes.

### Normas editoriales
- Citar fuentes primarias siempre que sea posible.
- Separar hechos, interpretación y conjetura.
- Indicar límites de conocimiento y controversias históricas.
- Evitar simplificaciones excesivas.

### Gobierno editorial
- Comité editorial multidisciplinar.
- Revisión por disciplina y por método histórico.
- Protocolo de corrección y actualización.
- Sistema de “estado editorial” visible para el usuario.

---

## 11. Estrategia IA

### Objetivo de la IA
La IA debe aumentar el poder de la plataforma, no reemplazar la autoridad editorial. Su papel es acelerar la ingestión, el enriquecimiento y la navegación, mientras se mantiene la validación humana.

### Casos de uso IA
- Extracción automática de relaciones a partir de textos.
- Generación de resúmenes y extractos para one-pagers.
- Clasificación temática y recomendación de contenidos.
- Traducción y localización editorial.
- Chat contextual sobre entidades y rutas del grafo.
- Búsqueda semántica basada en embeddings.

### RAG
- El sistema de búsqueda debe recuperar contexto desde documentos, artículos y bases de conocimiento estructurado.
- Se recomienda combinar retrieval de texto, metaetiquetas y relaciones explícitas del grafo.

### Validación IA
- Todo resultado generado por IA debe ser trazable a una fuente o a una cadena de procesamiento.
- La plataforma debe incluir un “estado de confianza” para contenidos asistidos por IA.
- La IA no debe publicar sin revisión editorial.

### Recomendación técnica
- Uso de modelos LLM para extracción y síntesis.
- Uso de embeddings para búsqueda semántica.
- Uso de un pipeline de revisión humana con señales de confianza.

---

## 12. Estrategia SEO

### Objetivos SEO
- Asegurar que la plataforma sea descubierta por usuarios, investigadores y educadores.
- Convertir el contenido en una fuente de autoridad digital.
- Hacer visible la semántica del producto a motores de búsqueda.

### Implementación recomendada
- Schema.org para entidades, artículos, eventos, personas y obras.
- JSON-LD para cada página principal.
- OpenGraph para compartir en redes sociales.
- URLs limpias y jerárquicas.
- Estructura semántica H1/H2/H3 correcta.
- Enlazado interno fuerte entre entidades, rutas, articles y vistas.

### SEO técnico
- Core Web Vitals optimizados.
- Rendimiento de imágenes y de renderizado.
- Sitemaps XML y robots.txt bien definidos.
- Internacionalización con hreflang.
- SEO para entidades y no solo para palabras clave.

### Estrategia internacional
- La plataforma debe diseñarse para múltiples idiomas desde el inicio.
- Cada idioma debe tener su propia cadena editorial y su propio pipeline de validación.
- El modelo semántico debe ser independiente del idioma.

---

## 13. Estrategia de contenidos

### Pilar de contenido
El contenido debe servir a tres modos de consumo:
1. Exploración rápida.
2. Comprensión profunda.
3. Descubrimiento de conexiones.

### Tipos de contenido recomendados
- One-pagers para entrada rápida.
- Artículos profundos para investigación y estudio.
- Mapas temáticos para comparar conceptos.
- Rutas guiadas para narrativa pedagógica.
- Bibliografías comentadas para construir autoridad.

### Estrategia de publicación
- Publicar en ciclos temáticos y geográficos.
- Crear paquetes de contenido por época, civilización o disciplina.
- Priorizar contenido que genere conexiones dense y valiosas.

### Métricas de contenido
- Tiempo de lectura
- Profundidad de exploración
- Número de consultas por entidad
- Conversión a contenido profundo
- Repetición de visitas
- Ratio de fuentes vinculadas

---

## 14. Riesgos

### Riesgos técnicos
- Complejidad del modelo de datos y del grafo semántico.
- Coste de mantenimiento de la ontología.
- Dificultad de integrar IA con fiabilidad editorial.

### Riesgos editoriales
- Controversias históricas y diferencias interpretativas.
- Riesgo de sobre-simplificar el contenido.
- Falta de consenso sobre el peso de las distintas fuentes.

### Riesgos de producto
- Que la interfaz sea demasiado compleja para el usuario general.
- Que el sistema se vuelva una herramienta solo para expertos.
- Que la calidad del contenido no sea suficiente para sostener la autoridad del proyecto.

### Riesgos de negocio
- Coste de adquisición de contenido y validación.
- Dificultad de monetizar sin perder rigor y acceso público.
- Dependencia de infraestructuras tecnológicas costosas.

### Mitigaciones
- Construir el MVP con un ámbito acotado.
- Mantener una revisión editorial visible y disciplinada.
- Diseñar la UX para usuarios de distintos niveles de conocimiento.
- Separar claramente contenido abierto, premium y educativo.

---

## 15. Escalabilidad

### Escalabilidad técnica
- Arquitectura modular y desacoplada.
- Servicios independientes para ingestión, búsqueda, visualización y contenido.
- Capacidad de añadir nuevas disciplinas y nuevas fuentes sin reescribir el modelo.

### Escalabilidad editorial
- El sistema debe permitir incorporar nuevas áreas del conocimiento sin romper la ontología.
- Debe existir un proceso claro para introducir nuevos tipos de entidades y relaciones.

### Escalabilidad de contenido
- Diseño preparado para miles o millones de nodos y relaciones.
- Indexación jerárquica y semántica para garantizar rendimiento.
- Uso de cachés y materialización de vistas frecuentes.

### Escalabilidad de la comunidad
- Posibilidad de colaboración editorial, investigación y contribución con control de calidad.
- Roles diferenciados para autores, revisores, editores, administradores y curadores.

---

## 16. Sistema de validación de fuentes

### Objetivo
Garantizar que cada afirmación del sistema esté respaldada por una fuente verificable y que el usuario pueda ver el nivel de fiabilidad.

### Escala de confianza
- 5 estrellas: fuente primaria.
- 4 estrellas: institución oficial.
- 3 estrellas: universidad o publicación académica sólida.
- 2 estrellas: revista científica o publicación especializada.
- 1 estrella: divulgación general.

### Flujo de validación
1. Ingestión de fuente.
2. Clasificación de tipo y nivel de confianza.
3. Extracción de evidencia.
4. Vinculación a entidad o relación.
5. Revisión editorial y aprobación.
6. Publicación con etiqueta de confianza.

### Requisitos del sistema
- Cada afirmación debe poder rastrearse hasta una fuente.
- El usuario debe poder ver por qué una relación se considera válida.
- El sistema debe distinguir entre evidencia, interpretación y conjetura.

---

## 17. Sistema de ingestión

### Objetivos del sistema
- Incorporar contenido de forma disciplinada y escalable.
- Reducir el trabajo manual repetitivo.
- Mantener alta calidad y trazabilidad.

### Fuentes de ingestión
- Textos académicos
- Libros digitales
- Documentos históricos
- Museos y colecciones
- Bases de datos de cine, música y arte
- Archivos oficiales
- Publicaciones y artículos especializados
- Fuentes web autorizadas y con metadata rica

### Pipeline de ingestión
1. Descubrimiento y adquisición.
2. Parseo y normalización.
3. Extracción de entidades y relaciones.
4. Enriquecimiento con metadatos y multimedia.
5. Validación de fuentes.
6. Revisión editorial.
7. Publicación y monitoreo.

### Herramientas recomendadas
- OCR para documentos antiguos y escaneados.
- NLP para detección de entidades y relaciones.
- Integración con APIs como IMDb, Google Arts & Culture, MusicBrainz, DOI, Internet Archive y Project Gutenberg.

---

## 18. Gobierno editorial

### Estructura recomendada
- Dirección editorial
- Comité de historia y humanidades
- Comité de tecnología y datos
- Comité de fuentes y validación
- Curadores temáticos

### Roles
- Investigador/editor
- Revisor disciplinar
- Editor senior
- Curador de grafo
- Administrador de contenido
- Administrador de plataforma

### Procesos
- Propuesta de nueva entidad o contenido
- Revisión de fuentes
- Aprobación editorial
- Publicación
- Actualización y mantenimiento

### Principios de gobierno
- Transparencia
- Trazabilidad
- Rigor histórico
- Responsabilidad intelectual
- Consistencia semántica

---

## Propuesta final de implementación

El Canon de Occidente debe empezar como un proyecto de conocimiento de alto rigor, con un foco inicial acotado, una arquitectura modular y una ontología sólida. La clave de éxito no está solo en el contenido, sino en la capacidad de convertir el contenido en una red navegable, verificable y evolutiva.

### Recomendación inicial
- Lanzar una versión en español, con un foco claro y acotado.
- Priorizar una franja histórica concreta y un conjunto de disciplinas representativas.
- Diseñar el sistema desde el principio como un grafo semántico, no como una colección de páginas.
- Hacer de la fuente y la validación una ventaja estratégica.

### Resultado esperado
Una plataforma que no solo informe sobre Occidente, sino que permita pensar Occidente como una estructura viva de ideas, obras, instituciones, lugares y conflictos, navegable por personas, siglos y conexiones.
