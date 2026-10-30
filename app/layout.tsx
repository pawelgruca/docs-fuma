import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import './global.css';
import { Inter } from 'next/font/google';
import { appName } from '@/lib/shared';
import { polishTranslations } from '@/lib/translations';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  title: {
    template: `%s · ${appName}`,
    default: appName,
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pl" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={{ locale: 'pl', translations: polishTranslations }}>{children}</RootProvider>
      </body>
    </html>
  );
}
