'use client';
import jsPDF from 'jspdf';
import { getStoredImage } from '@/lib/fetcher';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DiagramAnnotationView from './DiagramAnnotationView';

export default function ReportViewer({ reportContent, jobId }: { reportContent: string; jobId: string }) {
  const [viewMode, setViewMode] = useState<'report' | 'annotation'>('report');
  // Recupera a imagem original do localStorage
  const originalImage = getStoredImage(jobId);
  
  function downloadPdf() {
    const pdf = new jsPDF();
    pdf.setFontSize(10);
    // Usa o conteúdo do markdown para o PDF
    const lines = pdf.splitTextToSize(reportContent, 180);
    pdf.text(lines, 10, 10);
    pdf.save(`stride-${jobId}.pdf`);
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-2 py-6 space-y-4 bg-white shadow-2xl rounded-2xl max-w-[95vw] min-h-[90vh]"
      data-component-name="MotionComponent"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-semibold text-center"
        data-component-name="MotionComponent"
      >
        Relatório STRIDE
      </motion.h2>
      
      <div className="flex justify-center mb-4 space-x-2">
        <Button 
          variant={viewMode === 'report' ? 'default' : 'outline'}
          onClick={() => setViewMode('report')}
        >
          Visualizar Relatório
        </Button>
        <Button 
          variant={viewMode === 'annotation' ? 'default' : 'outline'}
          onClick={() => setViewMode('annotation')}
        >
          Anotação de Diagrama
        </Button>
      </div>

      {viewMode === 'report' ? (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Diagrama original */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 p-4 rounded-xl border flex flex-col items-center"
              style={{ opacity: 1, transform: 'none' }}
            >
              <h3 className="text-lg font-medium mb-3 text-primary">Diagrama Original</h3>
              {originalImage ? (
                <img 
                  src={originalImage} 
                  alt="Diagrama de arquitetura original" 
                  className="max-w-full object-contain rounded border border-gray-200 max-h-[600px]" 
                />
              ) : (
                <div className="h-64 w-full flex items-center justify-center text-gray-400 border border-dashed rounded-lg">
                  Imagem original não disponível
                </div>
              )}
            </motion.div>
            
            {/* Relatório STRIDE */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="prose prose-blue max-w-none bg-gray-50 p-6 rounded-xl border overflow-auto max-h-[700px]"
            >
              <h3 className="text-lg font-medium mb-3 text-primary">Análise STRIDE</h3>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{reportContent}</ReactMarkdown>
            </motion.div>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4"
          >
            <Button 
              onClick={downloadPdf}
              className="shadow-md"
              size="lg"
            >
              Baixar PDF
            </Button>
            <a href="/">
              <Button
                variant="outline"
                size="lg"
                className="shadow-sm"
              >
                Nova análise
              </Button>
            </a>
          </motion.div>
        </>
      ) : (
        <div className="h-[80vh]">
          {originalImage ? (
            <DiagramAnnotationView imageUrl={originalImage} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 border border-dashed rounded-lg">
              Imagem original não disponível para anotação
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
}
