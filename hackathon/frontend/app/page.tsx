'use client';
import ShieldIcon from '@/components/icons/ShieldIcon';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Dropzone from '@/components/Dropzone';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-surface to-secondary/20 py-20">
      <div className="container mx-auto grid md:grid-cols-2 gap-14 px-4 items-center">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-extrabold text-primary">
              <ShieldIcon className="w-10 h-10" />
              DiagSafe
            </h1>
        <p className="text-lg text-gray-600 max-w-md">
              Transforme seu diagrama em segurança real. Receba um relatório STRIDE completo em minutos.
            </p>
      </motion.section>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-2xl"
      >
        <Dropzone />
      </motion.div>
          </div>
    </main>
  );
}
