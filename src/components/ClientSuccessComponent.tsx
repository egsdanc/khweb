"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UserData {
  ad?: string;
  soyad?: string;
  email?: string;
  telefon?: string;
  adres?: string;
  ilce?: string;
  sehir?: string;
  ulke?: string;
  buyer_id?: string;
  fiyat?: string;
}

export default function ClientSuccessComponent({ initialData }: { initialData: Record<string, string> }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orderDetails, setOrderDetails] = useState<{ tarih: string; fiyat?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialData || Object.keys(initialData).length === 0) return;

    const userData: UserData = {
      ad: initialData.ad,
      soyad: initialData.soyad,
      email: initialData.email,
      telefon: initialData.telefon,
      adres: initialData.adres,
      ilce: initialData.ilce,
      sehir: initialData.sehir,
      ulke: initialData.ulke,
      buyer_id: initialData.buyer_id,
      fiyat: initialData.fiyat,
    };

    setUserData(userData);
    setOrderDetails({
      tarih: new Date().toISOString(),
      fiyat: userData.fiyat,
    });

    setLoading(false);
  }, [initialData]);

  return (
    <div className="max-w-4xl mx-auto p-8 dark:bg-slate-900">
      <div className="bg-white rounded-lg shadow-md p-8 dark:bg-slate-900">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Ödeme Başarılı!</h1>
          <p className="text-gray-600 mt-2">Siparişiniz başarıyla oluşturuldu.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : orderDetails ? (
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Sipariş Detayları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">buyer_id:</p>
                <p className="font-medium">{userData?.buyer_id}</p>
              </div>
              <div>
                <p className="text-gray-600">Tarih:</p>
                <p className="font-medium">{new Date(orderDetails.tarih).toLocaleString("tr-TR")}</p>
              </div>
              <div>
                <p className="text-gray-600">Ad Soyad:</p>
                <p className="font-medium">{userData?.ad} {userData?.soyad}</p>
              </div>
              <div>
                <p className="text-gray-600">E-posta:</p>
                <p className="font-medium">{userData?.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Telefon:</p>
                <p className="font-medium">{userData?.telefon}</p>
              </div>
              <div>
                <p className="text-gray-600">Adres:</p>
                <p className="font-medium">
                  {userData?.adres}, {userData?.ilce}, {userData?.sehir}, {userData?.ulke}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600">Toplam Tutar:</p>
                <p className="font-bold text-lg">
                  {parseFloat(orderDetails.fiyat || "0").toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 mb-6">
            <p className="text-gray-600">Sipariş detayları bulunamadı.</p>
          </div>
        )}

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Önemli Bilgiler:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Siparişiniz 1-3 iş günü içinde kargoya verilecektir.</li>
            <li>Sipariş onayınız kayıtlı e-posta adresinize gönderilmiştir.</li>
            <li>Sorularınız için destek ekibimizle iletişime geçebilirsiniz.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium text-center hover:bg-blue-700 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/iletisim"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium text-center hover:bg-gray-50 transition-colors"
          >
            Destek Al
          </Link>
        </div>
      </div>
    </div>
  );
}
