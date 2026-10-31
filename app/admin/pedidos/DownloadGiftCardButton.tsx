'use client';

import { toPng } from 'html-to-image';

export default function DownloadGiftCardButton({ elementId, codigo }: { elementId: string; codigo: string }) {
  const handleDownload = async () => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `GiftCard-${codigo}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al descargar:', err);
      alert('No se pudo descargar la imagen');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-3 w-full bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
    >
      📥 Descargar Imagen PNG
    </button>
  );
}