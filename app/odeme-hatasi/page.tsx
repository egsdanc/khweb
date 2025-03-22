"use client";
import Link from 'next/link';

export default function OdemeBasarili() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 dark:bg-slate-900">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center dark:bg-slate-900">
        <div className="flex justify-center mb-6">
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Ödeme Başarılı!</h1>
        <p className="text-gray-600 mb-6">
          Siparişiniz başarıyla tamamlandı. En kısa sürede sizinle iletişime geçeceğiz.
        </p>
        <div className="border-t border-gray-200 pt-6 mt-6">
          <Link href="/" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors">
            Anasayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}