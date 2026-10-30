import Link from 'next/link';
import { BookOpen, FileDown, Printer } from 'lucide-react';
import { documentInfo, docsRoute, pdfRoute, printRoute } from '@/lib/shared';
import { getOrderedPages } from '@/lib/ordered-pages';

const primaryButton =
  'inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90';
const secondaryButton =
  'inline-flex items-center gap-2 rounded-lg border bg-fd-secondary px-4 py-2 text-sm font-medium text-fd-secondary-foreground transition-colors hover:bg-fd-accent';

export default function HomePage() {
  const chapters = getOrderedPages().slice(1);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-16">
      <section className="flex flex-col gap-4">
        <p className="text-sm font-medium text-fd-muted-foreground">Wersja {documentInfo.version}</p>
        <h1 className="text-4xl font-bold tracking-tight">{documentInfo.title}</h1>
        <p className="text-lg text-fd-muted-foreground">{documentInfo.subtitle}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href={docsRoute} className={primaryButton}>
            <BookOpen className="size-4" />
            Czytaj podręcznik
          </Link>
          <a href={pdfRoute} className={secondaryButton}>
            <FileDown className="size-4" />
            Pobierz PDF
          </a>
          <Link href={printRoute} className={secondaryButton}>
            <Printer className="size-4" />
            Wersja do druku
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Rozdziały</h2>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((page) => (
            <li key={page.url}>
              <Link
                href={page.url}
                className="block h-full rounded-lg border bg-fd-card p-3 text-sm transition-colors hover:bg-fd-accent"
              >
                {page.data.title}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
