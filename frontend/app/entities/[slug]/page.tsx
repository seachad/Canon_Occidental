import Link from 'next/link';

const entityData: Record<string, any> = {
  socrates: {
    name: 'Sócrates',
    type: 'Filósofo',
    summary: 'Figura central del pensamiento griego y punto de partida de la tradición filosófica occidental.',
    dates: '470 a. C. – 399 a. C.',
    place: 'Atenas',
    context: 'Su método de indagación cuestionó las certezas del conocimiento y dio forma a la ética y la política occidentales.',
    connections: ['Platón', 'Aristóteles', 'Democracia', 'Juicio'],
    sources: ['Platón – Apología', 'Jenofonte – Recuerdos de Sócrates'],
  },
  platon: {
    name: 'Platón',
    type: 'Filósofo',
    summary: 'Fundador de la escuela filosófica platónica y autor de diálogos fundamentales.',
    dates: '427 a. C. – 347 a. C.',
    place: 'Atenas',
    context: 'Su pensamiento influyó en la metafísica, la política, la educación y la teoría del conocimiento.',
    connections: ['Sócrates', 'Aristóteles', 'República', 'Idea'],
    sources: ['La República', 'Fedón', 'Fedro'],
  },
  aristoteles: {
    name: 'Aristóteles',
    type: 'Filósofo',
    summary: 'Sistema de lógica, ciencia, ética y política que marcó la cultura europea.',
    dates: '384 a. C. – 322 a. C.',
    place: 'Estagira / Atenas',
    context: 'Su obra consolidó métodos de análisis que perduraron en la tradición académica.',
    connections: ['Platón', 'Política', 'Lógica', 'Metafísica'],
    sources: ['Ética a Nicómaco', 'Política', 'Metafísica'],
  },
};

export default function EntityPage({ params }: { params: { slug: string } }) {
  const entity = entityData[params.slug];

  if (!entity) {
    return <main className="container"><h1>Entidad no encontrada</h1></main>;
  }

  return (
    <main className="container">
      <section className="hero">
        <div className="badge">{entity.type}</div>
        <h1>{entity.name}</h1>
        <p>{entity.summary}</p>
      </section>

      <section className="grid grid-2">
        <article className="card">
          <h3>Resumen</h3>
          <p><strong>Fechas:</strong> {entity.dates}</p>
          <p><strong>Lugar:</strong> {entity.place}</p>
          <p>{entity.context}</p>
        </article>

        <article className="card">
          <h3>Conexiones</h3>
          <ul>
            {entity.connections.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h3>Fuentes</h3>
        <ul>
          {entity.sources.map((source) => <li key={source}>{source}</li>)}
        </ul>
      </section>

      <div style={{ marginTop: 16 }}>
        <Link href="/">Volver al inicio</Link>
      </div>
    </main>
  );
}
