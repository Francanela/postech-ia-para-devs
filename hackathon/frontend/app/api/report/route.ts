import { NextRequest, NextResponse } from 'next/server';
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from '@/lib/aws';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
  }

  const reportKey = `${jobId}/report.md`;

  try {
    // Tenta obter os metadados do objeto. Se não existir, lança um erro.
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: reportKey,
    });
    await s3Client.send(command);

    // Se o comando acima for bem-sucedido, o arquivo existe.
    const reportUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${reportKey}`;
    return NextResponse.json({ status: 'done', reportUrl });

  } catch (error: any) {
    // O SDK da AWS v3 lança um erro com o nome 'NotFound' se o objeto não existir.
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      // Isso é esperado. Significa que o worker ainda está processando.
      return NextResponse.json({ status: 'processing' });
    } else {
      // Isso é um erro inesperado (ex: permissões, bucket não encontrado).
      console.error('Error checking S3 object:', error);
      return NextResponse.json({ status: 'error', message: 'Failed to check report status' }, { status: 500 });
    }
  }
}
