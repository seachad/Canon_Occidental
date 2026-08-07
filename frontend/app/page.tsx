import Link from 'next/link';

const entities = [
  { slug: 'socrates', name: 'Sócrates', type: 'Filósofo', summary: 'Fundador de la tradición filosófica occidental.' },
  { slug: 'platon', name: 'Platón', type: 'Filósofo', summary: 'Autor de diálogos y constructor del pensamiento político.' },
  { slug: 'aristoteles', name: 'Aristóteles', type: 'Filósofo', summary: 'Sistema de conocimiento, lógica y ética.' },
];

export default function HomePage() {
  return (
    <main>
      <div className="container">
        <section className="hero">
          <div className="badge">Knowledge Operating System</div>
          <h1>El Canon de Occidente</h1>
          <p>Una plataforma semántica para navegar la historia, las ideas y las obras que formaron la civilización occidental.</p>
          <input className="search" placeholder="Buscar personas, obras, conceptos o eventos..." />
        </section>

        <section className="grid grid-3">
          {entities.map((entity) => (
            <article key={entity.slug} className="card">
              <h3>{entity.name}</h3>
              <p>{entity.type}</p>
              <p>{entity.summary}</p>
              <Link href={`/entities/${entity.slug}`}>
                Ver ficha
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
