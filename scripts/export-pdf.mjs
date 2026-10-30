import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUTPUT_FILE = path.join(ROOT, 'generated', 'podrecznik.pdf');
const DOCUMENT_INFO = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/document-info.json'), 'utf8'));
const PRINT_ROUTE = '/druk';
const LOCAL_PORT = 4310;
const SERVER_START_TIMEOUT_MS = 60_000;
const PAGE_LOAD_TIMEOUT_MS = 180_000;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);

const FOOTER_STYLE = 'width:100%;font-size:8px;color:#666;padding:0 15mm;display:flex;justify-content:space-between;';

function findChrome() {
  const chromePath = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));

  if (!chromePath) {
    throw new Error('Nie znaleziono przeglądarki Chrome/Chromium. Ustaw zmienną CHROME_PATH.');
  }

  return chromePath;
}

async function waitForServer(url) {
  const deadline = Date.now() + SERVER_START_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const isReady = await fetch(url)
      .then((response) => response.ok)
      .catch(() => false);

    if (isReady) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Serwer nie odpowiedział pod adresem ${url}.`);
}

async function startLocalServer() {
  if (!fs.existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
    throw new Error('Brak builda produkcyjnego. Uruchom najpierw "pnpm build" albo podaj PDF_BASE_URL.');
  }

  const server = spawn('pnpm', ['exec', 'next', 'start', '-p', String(LOCAL_PORT)], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  const baseUrl = `http://localhost:${LOCAL_PORT}`;

  await waitForServer(`${baseUrl}${PRINT_ROUTE}`);

  return { baseUrl, stop: () => server.kill() };
}

async function waitForImages(page) {
  await page.evaluate(async () => {
    const images = [...document.images];
    await Promise.all(
      images.map((image) =>
        image.complete ? null : new Promise((resolve) => image.addEventListener('load', resolve, { once: true })),
      ),
    );
  });
}

async function renderPdf(baseUrl) {
  const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true });

  try {
    const page = await browser.newPage();
    await page.emulateMediaType('print');
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
    await page.goto(`${baseUrl}${PRINT_ROUTE}`, { waitUntil: 'networkidle0', timeout: PAGE_LOAD_TIMEOUT_MS });
    await waitForImages(page);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `<div style="${FOOTER_STYLE}"><span>${DOCUMENT_INFO.title} · wersja ${DOCUMENT_INFO.version}</span><span>Strona <span class="pageNumber"></span> z <span class="totalPages"></span></span></div>`,
      margin: { top: '18mm', bottom: '20mm', left: '15mm', right: '15mm' },
      outline: true,
      tagged: true,
      timeout: PAGE_LOAD_TIMEOUT_MS,
    });

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, pdf);
  } finally {
    await browser.close();
  }
}

async function main() {
  const externalBaseUrl = process.env.PDF_BASE_URL;
  const server = externalBaseUrl ? { baseUrl: externalBaseUrl, stop: () => {} } : await startLocalServer();

  try {
    await renderPdf(server.baseUrl);
    console.log(`Zapisano PDF: ${path.relative(ROOT, OUTPUT_FILE)}`);
  } finally {
    server.stop();
  }
}

await main();
