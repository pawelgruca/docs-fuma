import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { pdfFileName, printRoute } from '@/lib/shared';

export const dynamic = 'force-dynamic';

const GENERATED_PDF_PATH = path.join(process.cwd(), 'generated', 'podrecznik.pdf');

async function readGeneratedPdf() {
  try {
    return await fs.readFile(GENERATED_PDF_PATH);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const pdf = await readGeneratedPdf();

  if (!pdf) {
    return NextResponse.redirect(new URL(printRoute, request.url));
  }

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${pdfFileName}"`,
      'Cache-Control': 'no-cache',
    },
  });
}
