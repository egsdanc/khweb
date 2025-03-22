"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

 function PartialSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchParams) {
      console.log("SearchParams henüz yüklenmedi, sayfa yenileniyor...");
      router.replace(window.location.href); // Sayfayı URL ile yenile
      return;
    }

    // URL parametreleri eksikse sayfayı tekrar yükle
    if (!searchParams.has("ad") || !searchParams.has("soyad")) {
      console.log("Gerekli parametreler eksik, sayfa 2 saniye içinde yenilenecek...");
      setTimeout(() => {
        router.replace(window.location.href);
      }, 2000); // 2 saniye sonra sayfayı yenile
      return;
    }

    // Eğer URL parametreleri boşsa sayfayı yenile
    if (searchParams.toString() === "") {
      console.log("URL parametreleri boş, sayfa yenileniyor...");
      router.replace(window.location.href);
      return;
    }

    const getParam = (name: string) => {
      const value = searchParams.get(name);
      return value ? decodeURIComponent(value) : null;
    };

    const data = {
      ad: getParam("ad"),
      soyad: getParam("soyad"),
      email: getParam("email"),
      telefon: getParam("telefon"),
      adres: getParam("adres"),
      ilce: getParam("ilce"),
      sehir: getParam("sehir"),
      adet: getParam("adet"),
      conversation_id: getParam("conversation_id"),
      ulke: getParam("ulke"),
      buyer_id: getParam("buyer_id"),
      fiyat: getParam("fiyat"),
      cihaz_id: getParam("cihaz_id"),
      error: getParam("error") || "database_error"
    };

    console.log("Decoded user data:", data);
    setUserData(data);
    setLoading(false);
  }, [searchParams, router]); // searchParams veya router değiştiğinde çalıştır

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <p className="text-lg text-gray-600">Yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <p className="text-lg text-red-600">Sipariş bilgileri yüklenemedi.</p>
              <div className="mt-6">
                <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Ana Sayfaya Dön
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">Yükleniyor...</div>}>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Ödemeniz Başarıyla Alındı
              </h2>

              <div className="mt-2 text-center text-sm text-gray-600">
                <p className="font-medium text-red-600">
                  Ancak bilgileriniz sistemimize kaydedilirken teknik bir sorun yaşandı.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Önemli Bilgi
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Ödemeniz başarıyla alındı ve işleminiz gerçekleştirildi, ancak siparişiniz teknik bir hata
                        nedeniyle sistemimize kaydedilemedi. Lütfen bu buyer_id bilginizi not alın ve bizimle iletişime geçin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900">Sipariş Bilgileri</h3>
                <dl className="mt-2 text-sm text-gray-500">
                  <div className="mt-1 flex justify-between">
                    <dt>buyer_id</dt>
                    <dd className="font-bold text-gray-900">{userData.buyer_id}</dd>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <dt>Ad Soyad:</dt>
                    <dd className="text-gray-900">{userData.ad} {userData.soyad}</dd>
                  </div>
                  {userData.email && (
                    <div className="mt-1 flex justify-between">
                      <dt>E-posta:</dt>
                      <dd className="text-gray-900">{userData.email}</dd>
                    </div>
                  )}
                  {userData.telefon && (
                    <div className="mt-1 flex justify-between">
                      <dt>Telefon:</dt>
                      <dd className="text-gray-900">{userData.telefon}</dd>
                    </div>
                  )}
                  {userData.fiyat && (
                    <div className="mt-1 flex justify-between">
                      <dt>Ödenen Tutar:</dt>
                      <dd className="text-gray-900">{userData.fiyat} TL</dd>
                    </div>
                  )}
                  {userData.adet && (
                    <div className="mt-1 flex justify-between">
                      <dt>Adet:</dt>
                      <dd className="text-gray-900">{userData.adet}</dd>
                    </div>
                  )}
                  {userData.cihaz_id && (
                    <div className="mt-1 flex justify-between">
                      <dt>Ürün Kodu:</dt>
                      <dd className="text-gray-900">{userData.cihaz_id}</dd>
                    </div>
                  )}
                  <div className="mt-1 flex justify-between">
                    <dt>Tarih:</dt>
                    <dd className="text-gray-900">{new Date().toLocaleDateString('tr-TR')}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-4">
                  Bu bilgilerin bir kopyasını kaydetmenizi öneririz. Müşteri hizmetlerimiz kısa süre içinde
                  sizinle iletişime geçecektir. Acil durumlarda aşağıdaki numaradan bize ulaşabilirsiniz.
                </p>
                <div className="text-center">
                  <p className="text-md font-bold">Müşteri Hizmetleri: <a href="tel:+905XXXXXXXXX" className="text-blue-600 hover:text-blue-800">0850 302 01 07</a></p>
                </div>

                <div className="mt-6 flex items-center justify-center">
                  <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Ana Sayfaya Dön
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default function PartialSuccessPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <PartialSuccess />
    </Suspense>
  );
}