"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import kilometrehackerImg from '~/assets/images/kilometrehacker.png';
import { useRouter } from "next/navigation"; // <-- Next.js yönlendirme için

const KilometreHackerBuy = () => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter(); // <-- Router'ı kullan

  // Ürün görselleri (gerçek uygulamada farklı resimler ekleyebilirsiniz)
  const productImages = [
    { src: kilometrehackerImg, alt: "Kilometre Hacker OBD Cihazı" },
    { src: kilometrehackerImg, alt: "Kilometre Hacker Wifi Dongle" },
  ];

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  useEffect(() => {
    const sendPaymentRequest = async () => {
      try {
        const response = await fetch("/api/post-price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cihaz_id: 1 }), // Sadece cihaz_id gönderiyoruz
        });

        if (!response.ok) {
          throw new Error("Ödeme isteği başarısız oldu!");
        }

        const data = await response.json();
        console.log("Ödeme Yanıtı:", data);
        setPrice(data.fiyat)
      } catch (error) {
        console.error("Hata:", error);
      }
    };

    sendPaymentRequest();
  }, []);

  const handleImageSelect = (index: any) => {
    setSelectedImage(index);
  };
  const handleBuyNow = () => {
    const queryString = new URLSearchParams({ adet: String(quantity) }).toString();
  //  window.location.href = `/odeme?${queryString}`;

    router.push(`/odeme?${queryString}`);
  };
  return (
    <section className="">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6">
            Kilometre Hacker
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Image Section */}
            <div className="lg:w-1/2">
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
                <Image
                  src={productImages[selectedImage].src}
                  alt={productImages[selectedImage].alt}
                  width={500}
                  height={500}
                  className="mx-auto"
                />
              </div>

              <div className="flex gap-2 mt-4 justify-center">
                <div
                  className={`w-12 h-12 ${selectedImage === 0 ? 'bg-gray-300' : 'bg-gray-100'} rounded flex items-center justify-center cursor-pointer`}
                  onClick={() => handleImageSelect(0)}
                >
                  <span className="text-yellow-500 text-xl">📊</span>
                </div>
                <div
                  className={`w-12 h-12 ${selectedImage === 1 ? 'bg-gray-300' : 'bg-gray-100'} rounded flex items-center justify-center cursor-pointer`}
                  onClick={() => handleImageSelect(1)}
                >
                  <span className="text-green-500 text-xl">🔌</span>
                </div>

              </div>
            </div>

            {/* Product Details Section */}
            <div className="lg:w-1/2">
              <h1 className="text-3xl font-bold mb-2">Kilometre Hacker</h1>
              <h2 className="text-xl mb-4">Araç kilometre bilgilerini tespit eden profesyonel cihaz</h2>

              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {'★★★★★'}
                </div>
                <span className="text-blue-600 ml-2 underline">(128 Değerlendirme)</span>
              </div>

              {price ? (
                <p className="text-xl font-semibold mb-6">
{price && (
  <>
   {price.toString()}₺{" "}
    <span className="text-sm font-normal">KDV Dahil</span>
  </>
)}
                </p>
              ) : (
                <p className="text-xl font-semibold mb-6">Yükleniyor...</p>
              )}

              <div className="border p-4 rounded-md mb-6">
                <h3 className="font-semibold mb-2">Kutu İçeriği</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Kilometre Hacker OBD Cihazı</li>
                  <li>WiFi Dongle</li>
                </ul>
              </div>

              {/* Adet Seçimi */}
              <div className="flex items-center mb-6">
                <span className="mr-4 font-medium">Adet:</span>
                <div className="flex border rounded-md">
                  <button
                    className="w-10 h-10 flex items-center justify-center border-r hover:bg-gray-100"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center">
                    {quantity}
                  </div>
                  <button
                    className="w-10 h-10 flex items-center justify-center border-l hover:bg-gray-100"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <button

                className="w-full bg-black text-white py-3 rounded-md font-medium mb-4"
                onClick={handleBuyNow} // <-- Butona tıklanınca yönlendir
              >
                Hemen Satın Al
              </button>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">🚚</div>
                  <p className="text-sm">Ücretsiz Kargo</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🔒</div>
                  <p className="text-sm">1 Yıl Garanti</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💬</div>
                  <p className="text-sm">7/24 Destek</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">✓</div>
                  <p className="text-sm">Tüm Araçlarla Uyumlu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Neden Kilometre Hacker?</h2>
            <p className="mb-4">İkinci el araç piyasasında güvenilir alım-satım için profesyonel çözüm! Kilometre Hacker, araç kilometre bilgilerini hassas şekilde tespit ederek size güvenli bir alım-satım deneyimi sunar.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div className="border p-4 rounded-md text-center">
                <div className="text-3xl mb-2">🔍</div>
                <h3 className="font-semibold mb-2">Hassas Tespit</h3>
                <p className="text-sm">Motor, ABS, şanzıman ve diğer sistemlerden doğrudan veri okuma</p>
              </div>
              <div className="border p-4 rounded-md text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Hızlı Sonuç</h3>
                <p className="text-sm">Saniyeler içinde detaylı kilometre raporu</p>
              </div>
              <div className="border p-4 rounded-md text-center">
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="font-semibold mb-2">Güvenli Analiz</h3>
                <p className="text-sm">Gelişmiş güvenlik sistemi ile manipülasyon tespiti</p>
              </div>
              <div className="border p-4 rounded-md text-center">
                <div className="text-3xl mb-2">📱</div>
                <h3 className="font-semibold mb-2">7/24 Destek</h3>
                <p className="text-sm">WhatsApp üzerinden anlık teknik destek</p>
              </div>
            </div>
          </div>

          {/* Target Users Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Kimler İçin Uygun?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border p-4 rounded-md">
                <h3 className="font-semibold mb-2">Bireysel Kullanıcılar</h3>
                <p>İkinci el araç alımında güvenli tercih</p>
              </div>
              <div className="border p-4 rounded-md">
                <h3 className="font-semibold mb-2">Oto Ekspertiz Firmaları</h3>
                <p>Profesyonel ekspertiz hizmetleri için</p>
              </div>
              <div className="border p-4 rounded-md">
                <h3 className="font-semibold mb-2">Galeriler</h3>
                <p>Güvenilir alım-satım süreçleri için</p>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-12 bg-gray-50 dark:bg-gray-900 p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4">Garanti ve Teknik Destek</h2>
            <ul className="space-y-2">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 1 yıl tam garanti</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 7/24 WhatsApp teknik destek</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Her sorgulama için %10 + KDV ücretlendirme</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Ücretsiz kargo ve kurulum desteği</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KilometreHackerBuy;