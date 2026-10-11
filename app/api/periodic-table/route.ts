import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbolOrNum = searchParams.get('q');

    if (symbolOrNum) {
      const el = db.getElementBySymbolOrNumber(symbolOrNum);
      if (!el) return NextResponse.json({ error: 'Element not found' }, { status: 404 });
      return NextResponse.json({ element: el });
    }

    const elements = db.getElements();
    return NextResponse.json({ elements });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
