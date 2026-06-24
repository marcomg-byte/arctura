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
    <main className="mg:grid mg:min-h-screen mg:content-center mg:gap-xl mg:bg-container mg:p-lg mg:sm:p-3xl mg:lg:p-5xl">
      <section className="mg:grid mg:max-w-[64rem] mg:gap-md" aria-labelledby="home-title">
        <Typography
          id="home-title"
          variant="h1"
          className="mg:max-w-[12ch] mg:text-primary"
          removePadding
        >
          Arctura App
        </Typography>
        <Typography variant="large" className="mg:max-w-[42rem] mg:text-primary-hover">
          A Next.js application workspace wired into the local Arctura packages.
        </Typography>
        <Button
          href="https://github.com/marcomg-byte/arctura"
          variant="outline"
          classes={{
            button:
              'mg:w-fit mg:border-accent mg:text-accent mg:hover:bg-accent mg:hover:text-inverse',
          }}
        >
          View repository
        </Button>
      </section>

      <section
        className="mg:grid mg:max-w-[64rem] mg:grid-cols-1 mg:gap-md mg:sm:grid-cols-2"
        aria-label="Workspace packages"
      >
        {packageLinks.map((item) => (
          <a
            className="mg:grid mg:min-h-[10rem] mg:content-start mg:gap-xs mg:rounded-lg mg:border-1 mg:border-solid mg:border-subtle mg:bg-primary mg:p-md mg:text-primary mg:no-underline mg:transition-colors mg:hover:border-hover mg:hover:bg-primary-hover"
            href={item.href}
            key={item.label}
          >
            <span className="mg:font-bold mg:text-accent">{item.label}</span>
            <p className="mg:m-0 mg:leading-[1.5]">{item.text}</p>
          </a>
        ))}
      </section>
    </main>
  );
}
