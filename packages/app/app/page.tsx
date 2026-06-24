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
    <main className="au:grid au:min-h-screen au:content-center au:gap-xl au:bg-container au:p-lg au:sm:p-3xl au:lg:p-5xl">
      <section className="au:grid au:max-w-128 au:gap-md" aria-labelledby="home-title">
        <Typography
          id="home-title"
          variant="h1"
          className="au:max-w-[12ch] au:text-primary"
          removePadding
        >
          Arctura App
        </Typography>
        <Typography variant="large" className="au:max-w-84 au:text-primary-hover">
          A Next.js application workspace wired into the local Arctura packages.
        </Typography>
        <Button
          href="https://github.com/marcomg-byte/arctura"
          variant="outline"
          classes={{
            button:
              'au:w-fit au:border-accent au:text-accent au:hover:bg-accent au:hover:text-inverse',
          }}
        >
          View repository
        </Button>
      </section>

      <section
        className="au:grid au:max-w-128 au:grid-cols-1 au:gap-md au:sm:grid-cols-2"
        aria-label="Workspace packages"
      >
        {packageLinks.map((item) => (
          <a
            className="au:grid au:min-h-20 au:content-start au:gap-xs au:rounded-lg au:border-1 au:border-solid au:border-subtle au:bg-primary au:p-md au:text-primary au:no-underline au:transition-colors au:hover:border-hover au:hover:bg-primary-hover"
            href={item.href}
            key={item.label}
          >
            <span className="au:font-bold au:text-accent">{item.label}</span>
            <p className="au:m-0 au:leading-normal">{item.text}</p>
          </a>
        ))}
      </section>
    </main>
  );
}
