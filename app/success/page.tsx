 "use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function OdemeBasariliContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userData, setUserData] = useState<any | null>(null);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
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

    const userData = {
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
    };

    console.log("Decoded user data:", userData);
    setUserData(userData);

    setOrderDetails({
      tarih: new Date().toISOString(),
      fiyat: userData.fiyat,
    });

    setLoading(false);
  }, [searchParams, router]); // searchParams veya router değiştiğinde çalıştır

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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold  ">Ödeme Başarılı!</h1>
          <p className="text-gray-600 mt-2">Siparişiniz başarıyla oluşturuldu.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : orderDetails ? (
          <div className="border-t border-b border-gray-200 py-4 mb-6 ">
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
                <p className="font-medium">
                  {userData?.ad} {userData?.soyad}
                </p>
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
              <div>
                <p className="text-gray-600">Adet:</p>
                <p className="font-medium">{userData?.adet}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600">Toplam Tutar:</p>
                <p className="font-bold text-lg">
                  {parseFloat(orderDetails.fiyat).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 mb-6">
            <p className="text-gray-600">Sipariş detayları bulunamadı.</p>
          </div>
        )}

        <div className="bg-gray-50 p-6 rounded-lg mb-6 dark:bg-slate-900">
          <h3 className="font-semibold mb-2">Önemli Bilgiler:</h3>
          <ul className="list-disc pl-5 space-y-1 ">
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

export default function OdemeBasarili() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <OdemeBasariliContent />
    </Suspense>
  );
}
