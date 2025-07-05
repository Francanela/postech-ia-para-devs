import { S3Client } from "@aws-sdk/client-s3";

// Valida se as variáveis de ambiente essenciais estão definidas
if (!process.env.AWS_REGION || !process.env.NEXT_PUBLIC_S3_REPORTS_BUCKET_NAME) {
  throw new Error("Variáveis de ambiente da AWS não configuradas corretamente.");
}

// As credenciais (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) serão carregadas
// automaticamente pelo SDK a partir das variáveis de ambiente do ambiente Vercel/local.
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

export const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_REPORTS_BUCKET_NAME;
