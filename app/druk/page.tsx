import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getMDXComponents } from '@/components/mdx';
import { PrintButton } from '@/components/print-button';
import { getOrderedPages } from '@/lib/ordered-pages';
import { documentInfo, docsRoute } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'Wersja do druku',
};

const DOCS_LINK_PATTERN = new RegExp(`^${docsRoute}/([^#]+)(?:#(.+))?$`);

function chapterAnchor(slug: string) {
  return `rozdzial-${slug}`;
}

function toDocumentAnchor(href: string | undefined) {
  const match = href?.match(DOCS_LINK_PATTERN);

  if (!match) {
    return href;
  }

  const [, slug, headingId] = match;

  return `#${headingId ?? chapterAnchor(slug)}`;
}

function PrintLink({ href, ...props }: ComponentProps<'a'>) {
  return <a href={toDocumentAnchor(href)} {...props} />;
}

function resolveImageUrl(src: unknown) {
  if (typeof src === 'string') {
    return src;
  }

  return (src as { src?: string } | undefined)?.src;
}

function PrintImage({ src, alt, ...props }: ComponentProps<'img'>) {
  const url = resolveImageUrl(src);

  return <img {...props} src={url} alt={alt ?? ''} loading="eager" decoding="sync" />;
}

const printComponents = getMDXComponents({
  a: PrintLink,
  img: PrintImage,
});

export default function PrintPage() {
  const [frontPage, ...chapters] = getOrderedPages();
  const FrontPageContent = frontPage.data.body;

  return (
    <div className="print-document mx-auto w-full max-w-[210mm] px-6 py-10 print:max-w-none print:p-0">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-fd-card p-4 print:hidden">
        <Link href={docsRoute} className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground">
          <ArrowLeft className="size-4" />
          Wróć do podręcznika
        </Link>
        <p className="text-sm text-fd-muted-foreground">
          Wybierz „Zapisz jako PDF” w oknie drukowania, aby wyeksportować cały podręcznik.
        </p>
        <PrintButton>Drukuj / zapisz jako PDF</PrintButton>
      </div>

      <section className="print-cover flex min-h-[60vh] flex-col justify-center gap-4 print:min-h-[240mm]">
        <p className="text-sm font-medium uppercase tracking-widest text-fd-muted-foreground">Platforma eSklep · GCUW</p>
        <h1 className="text-4xl font-bold tracking-tight">{documentInfo.title}</h1>
        <p className="text-xl text-fd-muted-foreground">{documentInfo.subtitle}</p>
        <p className="mt-6 text-sm">Wersja dokumentu: {documentInfo.version}</p>
      </section>

      <article className="prose print-chapter max-w-none">
        <FrontPageContent components={printComponents} />
      </article>

      <nav className="print-chapter print-toc">
        <h2 className="mb-6 text-2xl font-bold">Spis treści</h2>
        <ol className="flex flex-col gap-1.5">
          {chapters.map((page) => (
            <li key={page.url}>
              <a href={`#${chapterAnchor(page.slugs[0])}`} className="hover:underline">
                {page.data.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {chapters.map((page) => {
        const Content = page.data.body;

        return (
          <article key={page.url} id={chapterAnchor(page.slugs[0])} className="prose print-chapter max-w-none">
            <h1>{page.data.title}</h1>
            <Content components={printComponents} />
          </article>
        );
      })}
    </div>
  );
}
