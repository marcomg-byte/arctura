import { Button, Typography } from '@arctura/atomics';

const packageLinks = [
  {
    href: 'https://github.com/marcomg-byte/arctura/tree/main/packages/atomics',
    label: '@arctura/atomics',
    text: 'Reusable React primitives for product surfaces.',
  },
  {
    href: 'https://github.com/marcomg-byte/arctura/tree/main/packages/theme',
    label: '@arctura/theme',
    text: 'Theme utilities and token parsing for Arctura interfaces.',
  },
];

export default function Home() {
  return (
    <main className="shell">
      <section className="hero" aria-labelledby="home-title">
        <Typography id="home-title" variant="h1" className="heroTitle" removePadding>
          Arctura App
        </Typography>
        <Typography variant="large" className="heroText">
          A Next.js application workspace wired into the local Arctura packages.
        </Typography>
        <Button
          href="https://github.com/marcomg-byte/arctura"
          variant="outline"
          classes={{ button: 'heroAction' }}
        >
          View repository
        </Button>
      </section>

      <section className="packageGrid" aria-label="Workspace packages">
        {packageLinks.map((item) => (
          <a className="packageCard" href={item.href} key={item.label}>
            <span>{item.label}</span>
            <p>{item.text}</p>
          </a>
        ))}
      </section>
    </main>
  );
}
