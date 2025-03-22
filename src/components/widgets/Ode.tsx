import { useState, ChangeEvent, useRef, useEffect } from "react";
import Image from "next/image";
import kilometrehackerImg from "~/assets/images/kilometrehacker.png";

declare global {
  interface Window {
    iyzico: any;
    iyziInit: any;
    iyziEventTriggered: boolean | undefined;
  }
}

interface OdeProps {
  adet?: number;
}

interface FormData {
  ad: string;
  soyad: string;
  telefon: string;
  email: string;
  adres: string;
  ilce: string;
  sehir: string;
  ulke: string;
  not_satici: string;
  adet: number;
  cihaz_id: number;
}

interface PaymentResult {
  status: string;
  errorMessage?: string;
  checkoutFormContent?: string;
  token?: string;
  conversationId?: string;
}

const Ode: React.FC<OdeProps> = ({ adet }) => {
  const [formData, setFormData] = useState<FormData>({
    ad: "",
    soyad: "",
    telefon: "",
    email: "",
    adres: "",
    ilce: "",
    sehir: "",
    ulke: "Türkiye",
    not_satici: "",
    adet: adet || 1,
    cihaz_id: 1
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [price, setPrice] = useState(0);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
  const [formKey, setFormKey] = useState<number>(0); // Add a key to force re-render
  const formRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Basit doğrulama
    if (!formData.ad || !formData.soyad || !formData.telefon || !formData.email || !formData.adres || !formData.sehir) {
      return false;
    }
    
    // Email format doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return false;
    }
    
    return true;
  };

  // Complete cleanup function for Iyzico elements
  const cleanupIyzicoElements = () => {
    // Clear the form container
    if (formRef.current) {
      formRef.current.innerHTML = '';
    }
    
    // Remove all iyzico scripts
    const scripts = document.querySelectorAll('script[src*="iyzico"], script[src*="iyzipay"]');
    scripts.forEach(script => script.remove());
    
    // Remove all potential iyzico divs and forms
    const iyzicoElements = document.querySelectorAll(
      'div[id*="iyzico"], div[id*="iyzi"], div[class*="iyzico"], div[class*="iyzi"],' +
      'form[id*="iyzico"], form[id*="iyzi"], form[class*="iyzico"], form[class*="iyzi"]'
    );
    iyzicoElements.forEach(el => {
      if (el.parentNode) {
        el.innerHTML = '';
      }
    });
    
    // Clean up global variables
    if (window.iyzico) window.iyzico = undefined;
    if (window.iyziInit) window.iyziInit = undefined;
    if (window.iyziEventTriggered) window.iyziEventTriggered = undefined;
  };

  const handlePayment = async () => {
    // Form doğrulama
    if (!validateForm()) {
      alert("Lütfen tüm zorunlu alanları doldurun ve geçerli bir e-posta adresi girin.");
      return;
    }
    
    // Clean up any existing iyzico elements before starting
    cleanupIyzicoElements();
    
    // Force a re-render of the form container
    setFormKey(prevKey => prevKey + 1);
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data1 = await response.json();
      const data = data1?.data;
      
      setPaymentResult(data);
      
      if (data.status === "success" && data.checkoutFormContent) {
        setShowPaymentForm(true);
        
        // Insert the form content with a slight delay to ensure DOM is ready
        setTimeout(() => {
          if (formRef.current) {
            // Create a temporary container to parse the HTML
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = data.checkoutFormContent;
            
            // Clear any existing content
            formRef.current.innerHTML = '';
            
            // Append all child nodes except scripts
            Array.from(tempContainer.childNodes).forEach(node => {
              if (node.nodeName !== 'SCRIPT') {
                formRef.current?.appendChild(node.cloneNode(true));
              }
            });
            
            // Handle scripts separately to ensure they execute
            const scripts = tempContainer.getElementsByTagName('script');
            Array.from(scripts).forEach(oldScript => {
              const newScript = document.createElement('script');
              
              // Copy all attributes
              Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
              });
              
              // Copy inline script content
              newScript.innerHTML = oldScript.innerHTML;
              
              // Append to document (not to formRef) to ensure proper execution
              document.body.appendChild(newScript);
            });
          }
        }, 100);
      } else {
        alert("Ödeme başlatılamadı: " + (data.errorMessage || "Bilinmeyen bir hata oluştu"));
      }
    } catch (error) {
      console.error("Ödeme hatası:", error);
      alert("Bir hata oluştu.");
    }
    
    setLoading(false);
  };

  // Bilgileri değiştir butonuna tıklandığında
  const handleBackToForm = () => {
    // Complete cleanup when going back to form
    cleanupIyzicoElements();
    setShowPaymentForm(false);
  };

  // Fetch price on component mount
  useEffect(() => {
    const sendPaymentRequest = async () => {
      try {
        const response = await fetch("/api/post-price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cihaz_id: 1 }),
        });

        if (!response.ok) {
          throw new Error("Ödeme isteği başarısız oldu!");
        }

        const data = await response.json();
        setPrice(data.fiyat);
      } catch (error) {
        console.error("Hata:", error);
      }
    };

    sendPaymentRequest();
    
    // Cleanup function for component unmount
    return () => {
      cleanupIyzicoElements();
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 max-w-6xl mx-auto">
      {/* Sol taraf - Ürün bilgileri */}
      {!showPaymentForm && (
        <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-1/2 dark:bg-gray-900">
          <div className="border border-red-500 p-2 mb-6">
            <div className="bg-red-600 text-white text-center py-1 font-bold mb-2">
              TÜRK KİLOMETRE HACKER
            </div>
            <div className="text-center font-bold mb-2">
              KİLOMETRE OBD CİHAZI<br />
              WİFİ | DONGLE
            </div>
            
            <div className="flex justify-center mb-2">
              <Image
                src={kilometrehackerImg}
                alt="Kilometre Test Cihazı"
                width={300}
                height={200}
                className="object-contain"
              />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Kilometre Tespit Cihazı</h2>
          <p className="text-gray-700 mb-6">
            Araçlarınızın Kilometre Verilerini Güvenle Tespit Edin! İkinci el araç alım-satım
            süreçlerinde kilometre tespitini hızlı, güvenilir ve doğru bir şekilde yapmanızı sağlayan
            yenilikçi bir teknolojik çözümdür.
          </p>
          
          <div className="text-3xl font-bold">
            {price && adet ? (
              <>
                {(adet * price)}
                <span className="text-xl font-normal">.00 TRY</span>
              </>
            ) : (
              "Yükleniyor..."
            )}
          </div>
        </div>
      )}
      
      {/* Sağ taraf - İki farklı görünüm (Form veya Ödeme) */}
      <div className={`dark:bg-gray-900 bg-white p-8 rounded-lg shadow-md w-full ${!showPaymentForm ? 'md:w-1/2' : 'md:w-full'}`}>
        {showPaymentForm ? (
          <div className="w-full">
            {/* Bilgileri Değiştir Butonu */}
            <div className="mb-6">
              <button 
                onClick={handleBackToForm}
                className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Bilgileri Değiştir
              </button>
            </div>
            
            {/* Alıcı Bilgilerinin Özeti */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg border dark:bg-slate-900">
              <h3 className="text-lg font-medium mb-4">Alıcı Bilgileri</h3>
              
              <div className="flex flex-wrap gap-4">
                <div className="w-full sm:w-1/2 md:w-1/2">
                  <p className="text-sm text-gray-500">Ad Soyad</p>
                  <p className="font-medium">{formData.ad} {formData.soyad}</p>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2">
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-medium">{formData.telefon}</p>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2">
                  <p className="text-sm text-gray-500">E-posta</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2">
                  <p className="text-sm text-gray-500">Adres</p>
                  <p className="font-medium">{formData.adres}</p>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2">
                  <p className="text-sm text-gray-500">Şehir / İlçe</p>
                  <p className="font-medium">{formData.sehir} / {formData.ilce}</p>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2">
                  <p className="text-sm text-gray-500">Ülke</p>
                  <p className="font-medium">{formData.ulke}</p>
                </div>
                {formData.not_satici && (
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Not</p>
                    <p className="font-medium">{formData.not_satici}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gray-200 p-2 rounded-full">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#666666"/>
                  </svg>
                </div>
                <h2 className="text-xl font-medium">Alıcı Bilgileri</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 mb-2">Ad <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="ad"
                    placeholder="Adınız" 
                    value={formData.ad} 
                    onChange={handleChange}
                    className="w-full border rounded-md p-3 outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Soyad <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="soyad"
                    placeholder="Soyadınız" 
                    value={formData.soyad} 
                    onChange={handleChange}
                    className="w-full border rounded-md p-3 outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Cep Telefonu Numarası <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  name="telefon"
                  placeholder="Telefon Numaranız" 
                  value={formData.telefon}
                  onChange={handleChange}
                  className="w-full border rounded-md p-3 outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">E-posta <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="mail@mail.com" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="w-full border rounded-md p-3 outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="mt-8 mb-4">
                <h3 className="text-lg font-medium mb-4">Adres Bilgileri</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Adres <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="adres"
                    placeholder="Adres Girin" 
                    value={formData.adres} 
                    onChange={handleChange}
                    className="w-full border rounded-md p-3 outline-none focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">İlçe</label>
                  <input 
                    type="text" 
                    name="ilce"
                    placeholder="İlçe Girin" 
                    value={formData.ilce} 
                    onChange={handleChange}
                    className="w-full border rounded-md p-3 outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Şehir <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="sehir"
                    placeholder="Şehir Girin" 
                    value={formData.sehir} 
                    onChange={handleChange}
                    className="w-full border rounded-md p-3 outline-none focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">Ülke</label>
                  <select 
                    name="ulke"
                    value={formData.ulke}
                    onChange={handleChange}
                    className="w-full border rounded-md p-3 outline-none focus:border-blue-500 appearance-none"
                  >
                    <option value="Türkiye">Türkiye</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-600 mb-2">Satıcı İçin Not</label>
                  <input 
                    type="text" 
                    name="not_satici"
                    placeholder="Not Girin" 
                    value={formData.not_satici} 
                    onChange={handleChange}
                    className="w-full border rounded-md p-3 outline-none focus:border-blue-500"
                  />
                </div>
                
                <button 
                  onClick={handlePayment}
                  className="bg-blue-600 text-white font-bold py-3 rounded-md w-full mt-6 hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? "İşleminiz Yapılıyor..." : "Ödemeye Geç"}
                </button>
                
                {paymentResult && paymentResult.status === "error" && (
                  <div className="mt-4 text-red-600 bg-red-50 p-3 rounded border border-red-200">
                    {paymentResult.errorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <div id="iyzipay-checkout-form" key={formKey} ref={formRef} />
      </div>
    </div>
  );
};

export default Ode;