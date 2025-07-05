'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUpload } from '@/lib/fetcher';
import { useDropzone } from 'react-dropzone';
import Loading from './Loading';
import clsx from 'clsx';

export default function Dropzone() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const { mutateAsync, isPending } = useUpload();

  const onDrop = (accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      alert('Arquivo maior que 5 MB.');
      return;
    }
    setFile(f);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': [], 'image/jpeg': [] },
    maxFiles: 1,
  });

  async function handleAnalyze() {
    if (!file) return;
    const { jobId } = await mutateAsync(file);
    const history: string[] = JSON.parse(localStorage.getItem('diagram-guard-history') || '[]');
    localStorage.setItem('diagram-guard-history', JSON.stringify([jobId, ...history]));
    router.push(`/r/${jobId}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col items-center gap-6 w-full"
    >
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
        <div
          {...getRootProps()}
          className={clsx(
            'w-full h-64 rounded-2xl border border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors bg-white shadow-sm',
            isDragActive ? 'border-primary/60 bg-primary/5' : 'border-gray-300 hover:border-primary/40'
          )}
        >
          <input {...getInputProps()} />
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <p>Arraste sua imagem ou clique para selecionar</p>
          </motion.div>
          {file && (
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-2 text-sm text-green-600"
            >
              {file.name}
            </motion.p>
          )}
        </div>
      </motion.div>
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <Button onClick={handleAnalyze} disabled={!file || isPending} className="shadow-lg">
          {isPending ? 'Enviando…' : 'Analisar'}
        </Button>
      </motion.div>
      {isPending && <Loading />}
    </motion.div>
  );
}
