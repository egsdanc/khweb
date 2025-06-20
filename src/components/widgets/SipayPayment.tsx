import { useState, ChangeEvent, useEffect, useRef } from "react";
import Image from "next/image";
import kilometrehackerImg from "~/assets/images/kilometrehacker.png";
import { IconLoader2 } from '@tabler/icons-react';

interface SipayPaymentProps {
  adet?: number;
}

interface FormData {
  // Kişisel Bilgiler
  name: string;
  surname: string;
  email: string;
  phone: string;
  
  // Kredi Kartı Bilgileri
  card_number: string;
  card_holder: string;
  expire_month: string;
  expire_year: string;
  cvv: string;
  
  // Fatura Bilgileri
  address: string;
  city: string;
  country: string;
  zip_code: string;
  
  // Ödeme Bilgileri
  amount: number;
  currency_code: string;
  invoice_id: string;

  // 3D Secure
  is_3d: boolean;
}

interface InstallmentItem {
  installments_number: number;
  amount_to_be_paid: string;
  title: string;
  card_program: string;
  card_scheme: string;
  card_bank: string;
}

const SipayPayment: React.FC<SipayPaymentProps> = ({ adet }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    email: "",
    phone: "",
    card_number: "",
    card_holder: "",
    expire_month: "",
    expire_year: "",
    cvv: "",
    address: "",
    city: "",
    country: "Türkiye",
    zip_code: "",
    amount: 0,
    currency_code: "TRY",
    invoice_id: `INV-${Date.now()}`,
    is_3d: false
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [installments, setInstallments] = useState<any[]>([]);
  const [selectedInstallment, setSelectedInstallment] = useState<string>('1');
  const [show3dWarning, setShow3dWarning] = useState<boolean>(false);
  const [isLoadingPrice, setIsLoadingPrice] = useState<boolean>(true);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [isLoadingInstallments, setIsLoadingInstallments] = useState<boolean>(false);
  const errorRef = useRef<HTMLDivElement | null>(null);

  const logToStorage = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      message,
      data
    };
    
    // Mevcut logları al
    const existingLogs = localStorage.getItem('paymentLogs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    
    // Yeni logu ekle
    logs.push(logEntry);
    
    // Son 50 logu tut
    const recentLogs = logs.slice(-50);
    
    // Logları kaydet
    localStorage.setItem('paymentLogs', JSON.stringify(recentLogs));
    
    // Console'a da yazdır
//    console.log(`[${timestamp}] ${message}`, data || '');
  };

  const getToken = async () => {
    try {
      logToStorage("Token alınıyor...");
      const response = await fetch("/api/sipay-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });

      logToStorage("Token servisi yanıtı:", response.status);
      const data = await response.json();
      logToStorage("Token yanıtı:", data);

      if (data.status_code === 100 && data.data?.token) {
        const token = data.data.token;
        logToStorage("Alınan token:", token);
        setToken(token);
        return token;
      } else {
        logToStorage("Token bulunamadı:", data);
        throw new Error(data.status_description || "Token alınamadı.");
      }
    } catch (err: any) {
      logToStorage("Token alma hatası:", err);
      setError(err.message || "Token alınırken bir hata oluştu.");
      return null;
    }
  };

  // Kredi kartı numarası değiştiğinde taksit seçeneklerini getir
  const handleCardNumberChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    setFormData(prev => ({
      ...prev,
      card_number: value
    }));

    // İlk 6 hane girildiğinde taksit seçeneklerini getir
    if (value.length >= 6) {
      setIsLoadingInstallments(true);
      try {
        // Token yoksa yeni token al
        const tokenToUse = token || await getToken();
        if (!tokenToUse) {
          throw new Error("Token alınamadı.");
        }

        const totalAmount = unitPrice * (adet || 1);
        const requestBody = {
          credit_card: value,
          amount: totalAmount,
          currency_code: "TRY",
          is_recurring: 0,
          is_2d: 0
        };
        
        // console.log("Taksit seçenekleri için gönderilen istek:", {
        //   url: '/api/sipay-post',
        //   headers: {
        //     'Authorization': `Bearer ${tokenToUse}`,
        //     'Content-Type': 'application/json',
        //   },
        //   body: requestBody
        // });

        const res = await fetch('/api/sipay-post', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenToUse}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        const data = await res.json();
        // console.log("Taksit seçenekleri yanıtı:", {
        //   status: res.status,
        //   data: data
        // });

        if (data && data.status_code === 100 && Array.isArray(data.data) && data.data.length > 0) {
          // Tüm taksit seçeneklerini al
          const installmentOptions = data.data.map((item: InstallmentItem) => ({
            installments_number: item.installments_number,
            amount_to_be_paid: item.amount_to_be_paid,
            title: item.title,
            card_program: item.card_program,
            card_scheme: item.card_scheme,
            card_bank: item.card_bank
          }));
          
          // console.log("İşlenmiş taksit verileri:", installmentOptions);
          
          if (installmentOptions.length > 0) {
            installmentOptions[0].amount_to_be_paid = (unitPrice * (adet || 1)).toString();
          }
          
          setInstallments(installmentOptions);
          
          // İlk taksit seçeneğini varsayılan olarak seç
          setSelectedInstallment(String(installmentOptions[0].installments_number));
          setFormData(prev => ({
            ...prev,
            amount: parseFloat(installmentOptions[0].amount_to_be_paid)
          }));
        } else {
          // console.log("Taksit seçenekleri bulunamadı veya hata:", data);
          setInstallments([]);
          // Taksit seçenekleri gelmezse toplam tutarı hesapla
          const totalAmount = unitPrice * (adet || 1);
          setFormData(prev => ({
            ...prev,
            amount: totalAmount
          }));
        }
      } catch (err) {
        // console.error("Taksit bilgileri alınamadı:", err);
        setInstallments([]);
        // Hata durumunda toplam tutarı hesapla
        const totalAmount = unitPrice * (adet || 1);
        setFormData(prev => ({
          ...prev,
          amount: totalAmount
        }));
      } finally {
        setIsLoadingInstallments(false);
      }
    }
  };

  // Taksit seçimi değiştiğinde
  const handleInstallmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedCount = e.target.value;
    setSelectedInstallment(selectedCount);
    
    // Seçilen taksite göre ödeme tutarını güncelle
    const selectedInstallmentData = installments.find(item => item.installments_number === parseInt(selectedCount));
    if (selectedInstallmentData) {
      setFormData(prev => ({
        ...prev,
        amount: parseFloat(selectedInstallmentData.amount_to_be_paid)
      }));
    }
  };

  // Fiyat bilgisini API'den al
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch("/api/post-price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cihaz_id: 1 }),
        });

        if (!response.ok) {
          throw new Error("Fiyat bilgisi alınamadı");
        }

        const data = await response.json();
        const price = parseFloat(data.fiyat);
        setUnitPrice(price);
        
        // Toplam tutarı hesapla
        const totalAmount = price * (adet || 1);
        setFormData(prev => ({
          ...prev,
          amount: totalAmount
        }));
      } catch (error) {
        // console.error("Hata:", error);
        setError("Fiyat bilgisi alınamadı. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setIsLoadingPrice(false);
      }
    };

    fetchPrice();
  }, [adet]);

  // Sayfa açılır açılmaz token al
  useEffect(() => {
    (async () => {
      setLoading(true);
      await getToken();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  // Telefon inputu için formatlayıcı
  const formatPhone = (value: string) => {
    // Sadece rakamları al
    let digits = value.replace(/\D/g, '');
    // Başında 0 varsa kaldır
    if (digits.startsWith('0')) digits = digits.slice(1);
    // +90 ekle
    if (!digits.startsWith('90')) digits = '90' + digits;
    // Sadece 12 hane (90 + 10 hane numara)
    digits = digits.slice(0, 12);
    // Format: +90 5xx xxx xx xx
    let formatted = '+90';
    if (digits.length > 2) formatted += ' ' + digits.slice(2, 5);
    if (digits.length > 5) formatted += ' ' + digits.slice(5, 8);
    if (digits.length > 8) formatted += ' ' + digits.slice(8, 10);
    if (digits.length > 10) formatted += ' ' + digits.slice(10, 12);
    return formatted;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (name === 'phone') {
      setFormData(prev => ({
        ...prev,
        phone: formatPhone(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    logToStorage("Form validasyonu başlıyor...");
    
    // Kişisel Bilgiler Validasyonu
    if (!formData.name || !formData.surname || !formData.email || !formData.phone) {
      logToStorage("Kişisel bilgiler eksik:", formData);
      setError("Lütfen tüm kişisel bilgileri doldurun.");
      return false;
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      logToStorage("Geçersiz email formatı:", formData.email);
      setError("Geçerli bir email adresi girin.");
      return false;
    }

    // Telefon format kontrolü
    // +90 5xx xxx xx xx
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!/^90[5][0-9]{9}$/.test(phoneDigits)) {
      logToStorage("Geçersiz telefon formatı:", formData.phone);
      setError("Geçerli bir telefon numarası girin. (Örn: +90 5xx xxx xx xx)");
      return false;
    }

    // Kredi Kartı Validasyonu
    if (!formData.card_number || !formData.card_holder || !formData.expire_month || 
        !formData.expire_year || !formData.cvv) {
      logToStorage("Kart bilgileri eksik:", formData);
      setError("Lütfen tüm kredi kartı bilgilerini doldurun.");
      return false;
    }

    // Kart numarası format kontrolü
    const cardNumberRegex = /^[0-9]{16}$/;
    if (!cardNumberRegex.test(formData.card_number.replace(/\s/g, ''))) {
      logToStorage("Geçersiz kart numarası:", formData.card_number);
      setError("Geçerli bir kart numarası girin.");
      return false;
    }

    // CVV format kontrolü
    const cvvRegex = /^[0-9]{3,4}$/;
    if (!cvvRegex.test(formData.cvv)) {
      logToStorage("Geçersiz CVV:", formData.cvv);
      setError("Geçerli bir CVV girin.");
      return false;
    }

    // Fatura Bilgileri Validasyonu
    if (!formData.address || !formData.city || !formData.zip_code) {
      logToStorage("Fatura bilgileri eksik:", formData);
      setError("Lütfen tüm fatura bilgilerini doldurun.");
      return false;
    }

    logToStorage("Form validasyonu başarılı");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logToStorage("Form submit edildi");
    setError(null);
    setShow3dWarning(false);

    // 3D Secure zorunlu kontrolü
    if (!formData.is_3d) {
      setShow3dWarning(true);
      setError("Lütfen 3D Secure ile ödeme seçeneğini işaretleyin.");
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return;
    }

    if (!validateForm()) {
      logToStorage("Form validasyonu başarısız");
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return;
    }

    logToStorage("Form validasyonu başarılı, ödeme işlemi başlatılıyor");
    // setLoading(true);

    try {
      // Token zaten useEffect ile alınacak
      const tokenToUse = token;
      if (!tokenToUse) {
        logToStorage("Token alınamadı");
        throw new Error("Token alınamadı.");
      }
      logToStorage("Token başarıyla alındı:", tokenToUse);

      // 3D ödeme için HTML form oluştur
      if (formData.is_3d) {
        logToStorage("3D ödeme başlatılıyor...");
        const requestBody = {
          cc_holder_name: formData.card_holder,
          cc_no: formData.card_number,
          expiry_month: formData.expire_month,
          expiry_year: formData.expire_year,
          cvv: formData.cvv,
          currency_code: formData.currency_code,
          installments_number: selectedInstallment,
          invoice_id: formData.invoice_id,
          invoice_description: `${formData.invoice_id} nolu sipariş ödemesi`,
          name: formData.name,
          surname: formData.surname,
          total: formData.amount,
          unit_price: unitPrice,
          quantity: adet || 1,
          items: [{
            name: "Kilometre Tespit Cihazı",
            quantity: 1,
            price: formData.amount
          }],
          cancel_url: '/odeme-hatasi',
          return_url: '/success',
          bill_email: formData.email,
          bill_phone: formData.phone,
          bill_address1: formData.address,
          bill_city: formData.city,
          bill_postcode: formData.zip_code,
          bill_country: formData.country,
          payment_completed_by: 'app',
          response_method: 'POST',
          card_program: 'VISA',
          ip: window.location.hostname
        };

        logToStorage("3D ödeme isteği hazırlanıyor...");
        logToStorage("Request Headers:", {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenToUse}`
        });
        logToStorage("Request Body:", requestBody);

        logToStorage("API isteği gönderiliyor...");
        const response = await fetch('/api/sipay-paySmart3D', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenToUse}`
          },
          body: JSON.stringify(requestBody)
        });

        logToStorage("API yanıtı alındı:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          logToStorage("API hata yanıtı:", errorData);
          throw new Error(errorData.error || "Ödeme işlemi başlatılamadı.");
        }

        const contentType = response.headers.get('content-type');
        logToStorage("API yanıt content-type:", contentType);

        const html = await response.text();
        logToStorage("API yanıtı (ilk 100 karakter):", html.substring(0, 100));
        
        // HTML yanıtını kontrol et
        if (html.includes('<!doctype html>') || html.includes('<html')) {
          logToStorage("HTML form başarıyla alındı");
          
          // Loading ekranı oluştur
          const loadingDiv = document.createElement('div');
          loadingDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          `;
          loadingDiv.innerHTML = `
            <div style="text-align: center;">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-4 text-gray-600">Ödeme sayfası yükleniyor...</p>
            </div>
          `;
          document.body.appendChild(loadingDiv);

          // Form içeriğini hazırla
          const tempDiv = document.createElement('div');
          tempDiv.style.display = 'none';
          tempDiv.innerHTML = html;
          document.body.appendChild(tempDiv);

          // Formu bul ve submit et
          const form = tempDiv.querySelector('form');
          if (form) {
            // Form submit edildikten sonra loading ekranını kaldır
            form.addEventListener('submit', () => {
              setTimeout(() => {
                loadingDiv.remove();
                tempDiv.remove();
              }, 100);
            });
            
            // Formu submit et
            (form as HTMLFormElement).submit();
          } else {
            loadingDiv.remove();
            tempDiv.remove();
            throw new Error("Form bulunamadı.");
          }
        } else {
          // HTML yanıtı değilse, muhtemelen hata mesajı
          logToStorage("Beklenmeyen yanıt:", html);
          try {
            const errorData = JSON.parse(html);
            throw new Error(errorData.error || errorData.message || "Ödeme işlemi başlatılamadı.");
          } catch (e) {
            throw new Error(`Ödeme işlemi başlatılamadı. API yanıtı: ${html.substring(0, 100)}`);
          }
        }
        return;
      }

      // 2D ödeme için normal API çağrısı
      logToStorage("2D ödeme başlatılıyor...");
      const response = await fetch("/api/purchase/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenToUse}`,
          "Accept": "application/json"
        },
        body: JSON.stringify([{
          invoice: formData.invoice_id,
          currency_code: formData.currency_code,
          amount: formData.amount,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          zip_code: formData.zip_code,
          card_number: formData.card_number,
          card_holder: formData.card_holder,
          expire_month: formData.expire_month,
          expire_year: formData.expire_year,
          cvv: formData.cvv
        }])
      });

      logToStorage("2D ödeme yanıtı:", response.status);
      const data = await response.json();
      logToStorage("2D ödeme yanıt verisi:", data);

      if (!response.ok) {
        throw new Error(data.message || "Ödeme işlemi başarısız oldu.");
      }

      setSuccess(true);
      window.location.href = "/success";
    } catch (err: any) {
      logToStorage("Ödeme hatası:", err);
      setError(err.message || "Bir hata oluştu.");
      setLoading(false);
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      // Hata durumunda yönlendirme yapma, kullanıcı hatayı görebilsin
      return;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 max-w-6xl mx-auto">
      {/* Sol taraf - Ürün bilgileri */}
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
        <p className="text-gray-700 mb-6 dark:text-gray-300">
          Araçlarınızın Kilometre Verilerini Güvenle Tespit Edin! İkinci el araç alım-satım
          süreçlerinde kilometre tespitini hızlı, güvenilir ve doğru bir şekilde yapmanızı sağlayan
          yenilikçi bir teknolojik çözümdür.
        </p>

        {/* Fiyat Bilgisi */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2">Fiyat Bilgisi</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Birim Fiyat:</p>
              {isLoadingPrice ? (
                <IconLoader2 className="animate-spin text-primary-600 w-6 h-6" />
              ) : (
                <p className="text-xl font-bold">{unitPrice.toLocaleString('tr-TR')} TL</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Adet:</p>
              <p className="text-xl font-bold">{adet || 1}</p>
            </div>
          </div>
        </div>

        {/* Kişisel Bilgiler */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Kişisel Bilgiler</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ad</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Soyad</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              required
              maxLength={17}
              placeholder="+90 5xx xxx xx xx"
            />
          </div>
        </div>
      </div>

      {/* Sağ taraf - Ödeme formu */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-1/2 dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-6">Ödeme Bilgileri</h2>
        
        {error && (
          <div ref={errorRef} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {/* {show3dWarning && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded mb-4">
            3D Secure ile ödeme seçilmelidir. Lütfen kutucuğu işaretleyin.
          </div>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kredi Kartı Bilgileri */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kredi Kartı Bilgileri</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Kart Numarası</label>
              <input
                type="text"
                name="card_number"
                value={formData.card_number}
                onChange={handleCardNumberChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                maxLength={19}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kart Üzerindeki İsim</label>
              <input
                type="text"
                name="card_holder"
                value={formData.card_holder}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Son Kullanma Ay</label>
                <input
                  type="text"
                  name="expire_month"
                  value={formData.expire_month}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  maxLength={2}
                  placeholder="MM"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Son Kullanma Yıl</label>
                <input
                  type="text"
                  name="expire_year"
                  value={formData.expire_year}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  maxLength={2}
                  placeholder="YY"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 min-h-[40px] lg:min-h-0">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* Fatura Bilgileri */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fatura Bilgileri</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Adres</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Şehir</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Posta Kodu</label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
            </div>
          </div>

          {/* 3D Secure Seçeneği */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_3d"
                checked={formData.is_3d}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium">3D Secure ile Öde</label>
            </div>
            {formData.is_3d && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                3D Secure ile ödeme yaparak işleminizi daha güvenli hale getirebilirsiniz. 
                Bankanız tarafından gönderilen SMS kodunu kullanarak ödemenizi onaylayabilirsiniz.
              </p>
            )}
          </div>

          {/* Taksit Seçenekleri */}
          {isLoadingInstallments ? (
            <div className="flex items-center justify-center p-4">
              <IconLoader2 className="animate-spin text-primary-600 w-6 h-6" />
              <span className="ml-2">Taksit seçenekleri yükleniyor...</span>
            </div>
          ) : installments.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Taksit Seçenekleri</h3>
              <div className="flex flex-col gap-2">
                {installments.map((item: any) => {
                  const count = item.installments_number;
                  const total = parseFloat(item.amount_to_be_paid);
                  const label = count === 1 ? 'Tek Çekim' : `${count} Taksit`;
                  const isSelected = selectedInstallment === String(count);
                  // Format helpers
                  const formatTL = (val: number) => val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
                  return (
                    <label
                      key={count}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="installment"
                          value={count}
                          checked={isSelected}
                          onChange={handleInstallmentChange}
                          className="accent-blue-600 w-5 h-5"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{label}</span>
                          {item.card_program && (
                            <span className="text-xs text-gray-500">{item.card_program} - {item.card_scheme?.toUpperCase()}</span>
                          )}
                          {item.card_bank && (
                            <span className="text-xs text-gray-500">{item.card_bank}</span>
                          )}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-900 text-base min-w-[120px] text-right">
                        {formatTL(total)}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Toplam Tutar */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Toplam Tutar:</span>
              <span>
                {isLoadingPrice || isLoadingInstallments ? (
                  <div className="flex items-center gap-2">
                    <IconLoader2 className="animate-spin text-primary-600 w-5 h-5" />
                    <span>Hesaplanıyor...</span>
                  </div>
                ) : (
                  `${formData.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`
                )}
              </span>
            </div>
            {selectedInstallment !== '1' && !isLoadingPrice && !isLoadingInstallments && (
              <div className="text-sm text-gray-600 mt-1">
                {selectedInstallment} taksit x {(formData.amount / parseInt(selectedInstallment)).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            onClick={() => logToStorage("Ödeme butonu tıklandı")}
            className={`w-full py-2 px-4 rounded text-white font-medium ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SipayPayment; 