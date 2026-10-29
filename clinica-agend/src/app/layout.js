import Link from 'next/link';
import './globals.scss';

export const metadata = {
  title: 'Raiz & Vida | Clínica Integrada',
  description: 'Cuidado integrado e gestão de consultas da Raiz & Vida Clínica Integrada.'
};

const links = [
  { href: '/', label: 'Início' },
  { href: '/pacientes', label: 'Pacientes' },
  { href: '/medicos', label: 'Médicos' },
  { href: '/consultas', label: 'Consultas' }
];

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="siteHeader">
          <Link className="brand" href="/" aria-label="Raiz & Vida Clínica Integrada, página inicial">
            <span className="brandMark" aria-hidden="true">
              <svg viewBox="0 0 40 40">
                <path d="M29 8C17 9 10 14 10 22a8 8 0 0 0 8 8c8 0 13-7 11-22Z" />
                <path d="M12 28c4-7 8-11 15-15" />
              </svg>
            </span>
            <span>
              <span className="brandName">Raiz &amp; Vida</span>
              <span className="brandCaption">Clínica Integrada</span>
            </span>
          </Link>
          <nav aria-label="Navegação principal">
            {links.map(({ href, label }) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
