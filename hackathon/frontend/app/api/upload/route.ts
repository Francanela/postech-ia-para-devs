import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const imageBase64 = body.image;
  if (!imageBase64) {
    return NextResponse.json({ error: 'Imagem ausente' }, { status: 400 });
  }

  const lambdaBase = process.env.NEXT_PUBLIC_LAMBDA_BASE;
  console.log('LAMBDA_BASE:', lambdaBase);
  if (!lambdaBase) {
    return NextResponse.json({ error: 'Backend não configurado' }, { status: 500 });
  }

  const res = await fetch(lambdaBase, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageBase64 }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    try {
      const errorJson = JSON.parse(errorText);
      return NextResponse.json(
        { error: errorJson.error || 'Erro desconhecido no backend.' },
        { status: res.status },
      );
    } catch (e) {
      return NextResponse.json(
        { error: 'Falha de comunicação com o backend.', details: errorText },
        { status: res.status },
      );
    }
  }

  const json = await res.json();
  return NextResponse.json(json);
}
