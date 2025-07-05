export default function Loading() {
  return (
    <div className="flex flex-col items-center py-10 space-y-3">
      <span className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
      <p className="text-primary font-medium">🔍 Analisando… isso pode levar alguns segundos.</p>
    </div>
  );
}
