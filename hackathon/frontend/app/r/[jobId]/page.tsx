'use client';
import ShieldIcon from '@/components/icons/ShieldIcon';
import { useParams } from 'next/navigation';
import { useReport } from '@/lib/fetcher';
import { motion } from 'framer-motion';
import Loading from '@/components/Loading';
import ReportViewer from '@/components/ReportViewer';
import { useQuery } from '@tanstack/react-query';

// Hook para buscar o conteúdo do relatório a partir da URL do S3
function useReportContent(reportUrl: string | undefined) {
  return useQuery<string>({
    queryKey: ['reportContent', reportUrl],
    queryFn: async () => {
      if (!reportUrl) throw new Error('No report URL');
      const res = await fetch(reportUrl);
      if (!res.ok) throw new Error('Failed to fetch report content');
      return res.text();
    },
    enabled: !!reportUrl, // Só executa a query se a URL existir
  });
}

export default function ReportPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { data: reportStatus, isPending: isStatusPending, isError: isStatusError } = useReport(jobId);

  // O segundo query, para buscar o conteúdo do relatório
  const { data: reportContent, isPending: isContentPending, isError: isContentError } = useReportContent(reportStatus?.reportUrl);

  if (isStatusPending || (reportStatus?.status === 'processing' && !reportContent)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-surface to-secondary/20 py-20 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <ShieldIcon className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-primary">DiagSafe</h2>
          </div>
          <Loading />
        </div>
      </div>
    );
  }

  if (isStatusError || isContentError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-surface to-secondary/20 py-20 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <ShieldIcon className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-primary">DiagSafe</h2>
          </div>
          <div className="bg-white/80 backdrop-blur shadow-xl rounded-xl p-8 text-red-500 text-center">
            Erro ao buscar relatório.
          </div>
        </div>
      </div>
    );
  }

  if (reportStatus?.status === 'done' && reportContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-surface to-secondary/20 py-20">
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <ShieldIcon className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-primary">DiagSafe</h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur shadow-xl rounded-xl overflow-hidden"
          >
            <ReportViewer reportContent={reportContent} jobId={jobId} />
          </motion.div>
        </div>
      </div>
    );
  }

  // Fallback para outros estados ou se algo der errado
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-surface to-secondary/20 py-20 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <ShieldIcon className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-primary">DiagSafe</h2>
        </div>
        <Loading />
      </div>
    </div>
  );
}
