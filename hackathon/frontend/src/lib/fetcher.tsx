'use client';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { z } from 'zod';

export const client = new QueryClient();

export function ReactQueryClientProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

// Schemas
const UploadResponseSchema = z.object({ jobId: z.string() });
export type UploadResponse = z.infer<typeof UploadResponseSchema>;

const ReportResponseSchema = z.object({
  status: z.enum(['processing', 'done', 'error']),
  reportUrl: z.string().url().optional(),
  message: z.string().optional(),
});
export type ReportResponse = z.infer<typeof ReportResponseSchema>;

// Hooks
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// Armazena a imagem para exibição posterior
export function storeImageForJob(jobId: string, imageBase64: string) {
  try {
    localStorage.setItem(`diagram-image-${jobId}`, imageBase64);
  } catch (e) {
    console.error('Failed to store image in localStorage', e);
  }
}

// Recupera a imagem armazenada
export function getStoredImage(jobId: string): string | null {
  try {
    return localStorage.getItem(`diagram-image-${jobId}`);
  } catch (e) {
    console.error('Failed to retrieve image from localStorage', e);
    return null;
  }
}

export function useUpload() {
  return useMutation<UploadResponse, Error, File>({
    mutationFn: async (file: File) => {
      const imageBase64 = await toBase64(file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64 }),
      });
      if (!res.ok) throw new Error('Upload failed');
      const result = UploadResponseSchema.parse(await res.json());
      
      // Armazena a imagem para exibição na página de relatório
      storeImageForJob(result.jobId, imageBase64);
      
      return result;
    },
  });
}

export function useReport(jobId: string) {
  return useQuery<ReportResponse>({
    queryKey: ['report', jobId],
    queryFn: async () => {
      const res = await fetch(`/api/report?jobId=${jobId}`);
      if (!res.ok) throw new Error('fetch error');
      return ReportResponseSchema.parse(await res.json());
    },
    refetchInterval: (query) => {
      const data = query.state.data as ReportResponse | undefined;
      // Para de fazer polling se o status for 'done' ou 'error'
      if (data?.status === 'done' || data?.status === 'error') {
        return false;
      }
      return 3000; // Continua fazendo polling a cada 3 segundos
    },
    enabled: !!jobId,
  });
}
