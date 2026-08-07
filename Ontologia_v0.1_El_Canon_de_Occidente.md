# El Canon de Occidente

# Ontología v0.1 (Primera versión)

## 1. Objetivo

Esta ontología define el modelo semántico sobre el que se construirá la
plataforma **El Canon de Occidente**. No modela páginas web; modela
entidades del mundo real y sus relaciones.

Principios:

-   Una única fuente de verdad.
-   Todo es un nodo o una relación.
-   Las vistas (grafo, cronología, mapas, artículos, IA) son
    proyecciones del mismo modelo.
-   Toda afirmación debe poder rastrearse hasta una fuente.

------------------------------------------------------------------------

# 2. Entidades principales

## Personas

Subtipos: - Filósofo - Escritor - Poeta - Científico - Matemático -
Artista - Arquitecto - Compositor - Político - Militar - Explorador -
Santo - Papa - Monarca

Propiedades comunes: - Identificador global - Nombre - Nombre original -
Fechas de nacimiento y muerte - Lugares - Idiomas - Biografía resumida -
Imagen - Coordenadas (cuando proceda)

------------------------------------------------------------------------

## Obras

Subtipos:

-   Libro
-   Poema
-   Tragedia
-   Ensayo
-   Tratado
-   Pintura
-   Escultura
-   Edificio
-   Sinfonía
-   Ópera
-   Película
-   Serie
-   Documental
-   Videojuego

------------------------------------------------------------------------

## Conceptos

Ejemplos:

-   Democracia
-   Justicia
-   Belleza
-   Libertad
-   Razón
-   Ciencia
-   Individuo
-   Estado

------------------------------------------------------------------------

## Eventos

-   Guerra
-   Batalla
-   Revolución
-   Descubrimiento
-   Fundación
-   Concilio
-   Coronación
-   Tratado

------------------------------------------------------------------------

## Lugares

-   Continente
-   País
-   Región
-   Ciudad
-   Sitio arqueológico
-   Museo
-   Universidad
-   Biblioteca
-   Monumento
-   Ruta histórica

------------------------------------------------------------------------

## Civilizaciones

-   Mesopotamia
-   Egipto
-   Grecia
-   Roma
-   Bizancio
-   Europa Medieval
-   Renacimiento
-   Ilustración

------------------------------------------------------------------------

# 3. Relaciones

## Intelectuales

-   escribió
-   influyó en
-   fue influido por
-   desarrolló
-   criticó
-   refutó
-   respondió a
-   comentó
-   tradujo
-   adaptó

## Históricas

-   ocurrió en
-   ocurrió durante
-   causó
-   fue consecuencia de
-   precede a
-   sucede a

## Geográficas

-   nació en
-   murió en
-   se desarrolla en
-   conserva
-   se encuentra en

## Artísticas

-   representa
-   está inspirado en
-   adapta
-   versiona
-   homenajea

## Educativas

-   requiere conocer
-   recomendado antes de
-   recomendado después de

------------------------------------------------------------------------

# 4. Propiedades de las relaciones

Cada relación debe almacenar:

-   Identificador
-   Tipo
-   Fecha
-   Fuente
-   Nivel de confianza
-   Explicación
-   Evidencias
-   Última revisión

------------------------------------------------------------------------

# 5. Calidad de la evidencia

★★★★★ Fuente primaria

★★★★ Institución oficial

★★★ Universidad

★★ Revista científica

★ Divulgación

------------------------------------------------------------------------

# 6. Recursos oficiales

## Cine

Referencia principal: - IMDb

## Geografía

-   Google Maps
-   Google Earth

## Arte

-   Museo propietario
-   Google Arts & Culture

## Libros

-   Project Gutenberg
-   Perseus
-   Internet Archive
-   Biblioteca Nacional

## Música

-   MusicBrainz
-   Spotify
-   Digital Concert Hall

## Ciencia

-   DOI
-   Revista científica
-   Universidad

------------------------------------------------------------------------

# 7. Vistas derivadas

La ontología debe alimentar:

-   Grafo
-   One-pager
-   Artículo profundo
-   Cronología
-   Mapa
-   Biblioteca
-   Comparador
-   Buscador semántico
-   Chat IA

------------------------------------------------------------------------

# 8. Preguntas canónicas

Cada nodo deberá responder, cuando sea aplicable:

-   ¿Qué es?
-   ¿Por qué importa?
-   ¿Quién lo creó?
-   ¿Cuándo ocurrió?
-   ¿Dónde ocurrió?
-   ¿Qué lo inspiró?
-   ¿En qué influyó?
-   ¿Qué películas lo representan?
-   ¿Qué obras están relacionadas?
-   ¿Qué museos conservan material?
-   ¿Qué fuentes primarias existen?
-   ¿Qué bibliografía se recomienda?

------------------------------------------------------------------------

# 9. Evolución prevista

La versión 1.0 deberá incorporar:

-   \~120 tipos de entidad
-   \~300 tipos de relación
-   reglas de inferencia
-   alineación parcial con Schema.org, CIDOC CRM y Wikidata
-   soporte multilingüe
-   persistencia de procedencia (provenance)
-   ontología de incertidumbre histórica
-   ontología de adaptaciones audiovisuales
-   ontología de rutas de aprendizaje
-   ontología de preguntas

Esta versión 0.1 sirve como base estable para comenzar el diseño e
implementación de la plataforma.
