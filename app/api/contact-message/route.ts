import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CSV_PATH = path.join(process.cwd(), 'contact-messages.csv');

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    const now = new Date().toISOString();
    const row = `"${now}","${(name || '').replace(/"/g, '""')}","${(email || '').replace(/"/g, '""')}","${(message || '').replace(/"/g, '""')}"\n`;

    // If file doesn't exist, add header
    let fileExists = false;
    try {
      await fs.access(CSV_PATH);
      fileExists = true;
    } catch {}

    if (!fileExists) {
      await fs.writeFile(CSV_PATH, '"timestamp","name","email","message"\n', { flag: 'a' });
    }
    await fs.writeFile(CSV_PATH, row, { flag: 'a' });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}