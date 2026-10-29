import Link from 'next/link';
import styles from '@/styles/main.module.scss';

const sections = [
  { href: '/pacientes', title: 'Pacientes', description: 'Cadastre e consulte os dados dos pacientes.' },
  { href: '/medicos', title: 'Médicos', description: 'Mantenha a equipe médica e especialidades.' },
  { href: '/consultas', title: 'Consultas', description: 'Agende horários e acompanhe os status.' }
];

export default function HomePage() {
  return (
    <div className={styles.container}>
      <p className={styles.eyebrow}>Cuidado que acolhe. Saúde que floresce.</p>
      <h1>Bem-vindo à <span>Raiz &amp; Vida</span></h1>
      <p className={styles.intro}>
        Um espaço de cuidado integrado para acompanhar cada etapa da jornada de saúde.
      </p>
      <div className={styles.cards}>
        {sections.map(({ href, title, description }) => (
          <Link className={styles.card} href={href} key={href}>
            <h2>{title}</h2>
            <p>{description}</p>
            <span>Acessar →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}