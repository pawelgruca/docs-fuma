import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookOpen, FileDown } from 'lucide-react';
import { appName, pdfRoute } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <BookOpen className="size-5" />
          <span className="font-semibold">{appName}</span>
        </>
      ),
    },
    themeSwitch: {
      enabled: false,
    },
    links: [
      {
        type: 'button',
        text: 'Pobierz PDF',
        icon: <FileDown />,
        url: pdfRoute,
        external: true,
      },
    ],
  };
}
