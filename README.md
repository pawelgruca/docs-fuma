# Podręcznik Administratora Systemu — eSklep (GCUW)

Dokumentacja oparta na [Fumadocs](https://fumadocs.dev) (Next.js), wygenerowana z pliku DOCX.

## Uruchomienie

```bash
pnpm install
pnpm dev
```

Aplikacja: http://localhost:3000

## Struktura

| Ścieżka | Opis |
| --- | --- |
| `content/docs/*.mdx` | Rozdziały podręcznika (jeden plik = jeden rozdział) |
| `content/docs/meta.json` | Kolejność rozdziałów w menu |
| `public/images/podrecznik/` | Zrzuty ekranu wyciągnięte z DOCX |
| `lib/document-info.json` | Tytuł i wersja dokumentu (z metryki DOCX) |
| `components/access.tsx` | Komponent `<Access roles="..." />` — oznaczenie „Dostęp: …” |
| `app/druk/` | Cały podręcznik na jednej stronie, przygotowany do druku / PDF |
| `app/podrecznik.pdf/` | Serwuje wygenerowany PDF (lub przekierowuje do `/druk`) |

## Eksport do PDF

Są trzy sposoby:

1. **Gotowy plik PDF** (z numeracją stron, zakładkami i klikalnym spisem treści):

   ```bash
   pnpm build
   pnpm pdf
   ```

   Plik trafia do `generated/podrecznik.pdf` i jest dostępny pod `/podrecznik.pdf`
   (przycisk „Pobierz PDF”). Skrypt używa lokalnego Chrome/Chromium — inną ścieżkę
   można wskazać zmienną `CHROME_PATH`. Aby wygenerować PDF z działającej instancji:
   `PDF_BASE_URL=http://localhost:3000 pnpm pdf`.

2. **Wersja do druku** — `/druk` → „Drukuj / zapisz jako PDF” (okno drukowania przeglądarki).

3. **Pojedynczy rozdział** — przycisk „Drukuj / PDF rozdziału” na każdej stronie.

Jeśli `generated/podrecznik.pdf` nie istnieje, `/podrecznik.pdf` przekierowuje do `/druk`.

## Aktualizacja treści z nowej wersji DOCX

```bash
pnpm convert "/ścieżka/do/Podręcznik Administratora Systemu GCUW wer. X.Y.Z.docx"
```

Uwaga: konwersja nadpisuje `content/docs/` i `public/images/podrecznik/`. Jeśli treść
jest już edytowana bezpośrednio w MDX, dalsze zmiany wprowadzaj w plikach MDX zamiast
ponownie konwertować DOCX.
