import { CallToActionProps, FAQsProps } from '~/shared/types';
import { HeroProps } from '~/shared/types';

// Hero data on FAQs page *******************
export const heroFaqs: HeroProps = {
  title: 'Desteğe mi ihtiyacınız var?',
  subtitle: (
    <>
      <span className="hidden md:inline">
        {`Kullanım sırasında bir sorunla karşılaştınız mı? Destek makalelerimize göz atabilir veya uzman ekibimizle iletişime geçebilirsiniz.`}
      </span>{' '}
      {/* Explore them to optimize your experience with our website and products. */}
    </>
  ),
  tagline: 'Destek',
};

// FAQS4 data on FAQs page *******************
export const faqs4Faqs: FAQsProps = {
  id: 'faqsFour-on-faqs',
  hasBackground: true,
  header: {
    title: 'Sık Sorulan Sorular',
    subtitle: 'Sorularınıza hızlı yanıtlar alın: İhtiyacınız olan her şey tek bir noktada.',
    position: 'center',
  },
  tabs: [
    {
      link: {
        label: 'Kilometre Hacker Hakkında',
        href: '/tab1',
      },
      items: [
        {
          title: 'Kilometre Hacker nedir ve nasıl çalışır?',
          description: `Kilometre Hacker, aracın elektronik kontrol ünitesinden (ECU) veri okuyarak gerçek kilometre bilgilerini tespit eden yenilikçi bir cihazdır. Manipülasyon yapılmış kilometre bilgilerini ortaya çıkararak güvenilir bir rapor sunar.`,
        },
        {
          title: 'Hangi marka ve modellerde çalışır?',
          description: `Kilometre Hacker, geniş yelpazede marka ve model araçlarla uyumlu olarak tasarlanmıştır. Aracın elektronik kontrol sistemine erişim sağlayan bu cihaz, çeşitli marka ve modellerden veri okuyabilir.`,
        },
        {
          title: "Kilometre Manipülasyonu nasıl tespit eder?",
          description: `Cihaz, aracın ECU'sundan kilometre verilerini çeker ve bu bilgileri diğer verilerle karşılaştırarak manipülasyon olup olmadığını tespit eder.`,
        },
        {
          title: "Raporlar nerelerde kullanılabilir?",
          description: `Cihaz, aracın ECU'sundan kilometre verilerini çeker ve bu bilgileri diğer verilerle karşılaştırarak manipülasyon olup olmadığını tespit eder.`,
        },
      ],
    },
    {
      link: {
        label: 'VIN Hacker Hakkında',
        href: '/tab2',
      },
      items: [
        {
          title: 'VIN Hacker nedir?',
          description: `VIN Hacker, aracın şasi numarası (VIN) aracılığıyla tüm beyinlerdeki VIN bilgilerini analiz eden ve change tespit eden bir cihazdır.`,
        },
        {
          title: 'VIN Hacker ne kadar hızlı sonuç verir?',
          description: `VIN Hacker, saniyeler içinde aracın tüm geçmiş bilgilerini analiz eder ve detaylı bir rapor sunar. Kullanım kolaylığı ve hızıyla zaman kazandırır.`,
        },
        {
          title: 'Manipüle edilmiş bir şasi numarası tespit edilebilir mi?',
          description: `Evet, VIN Hacker, şasi numarasında herhangi bir manipülasyon olup olmadığını tespit edebilir.`,
        },
      ],
    },
    {
      link: {
        label: 'Genel Sorular',
        href: '/tab3',
      },
      items: [
        {
          title: 'Cihazlar yasal mı?',
          description: `Evet, hem Kilometre Hacker hem de VIN Hacker tamamen yasaldır. Bu cihazlar, Emniyet Genel Müdürlüğü Kaçakçılık şube ve Kriminal şube tarafından da aktif olarak kullanılmaktadır.`,
        },
        {
          title: 'Cihazların garanti süresi nedir?',
          description: `Cihaz 1 yıl garanti kapsamındadır. Bu süre içerisinde cihazlarla ilgili herhangi bir sorun yaşanması durumunda teknik destek hizmeti sunulmaktadır.`,
        },
        {
          title: 'Cihazları nereden temin edebilirim?',
          description: `Cihazları kilometrehacker.com resmi web sitesinden veya yetkili bayilerden temin edebilirsiniz.`,
        },
        {
          title: 'Raporlar hangi formatta sunuluyor?',
          description: `Tüm raporlar PDF formatında hazırlanır ve kolayca yazdırılabilir veya dijital olarak paylaşılabilir.`,
        },
        {
          title: 'Nasıl Bakiye yüklerim',
          description: `İlgili panel bağlantı linkinden giriş yaparak bakiye yükleyebilirsiniz.`,
        },
      ],
    },
    {
      link: {
        label: 'İptal ve İade Koşulları',
        href: '/iptal-iade',
      },
      items: [
        {
          title: 'Sipariş İptali',
          description: `Alıcı, henüz kargoya verilmemiş siparişleri için sipariş onayından itibaren 24 saat içinde siparişi iptal etme hakkına sahiptir. Sipariş iptali için kilometrehacker@gmail.com adresine veya 0 850 302 01 07 numarasına başvurulması gerekmektedir. Siparişin iptali onaylandıktan sonra ödenen tutar, ödeme yapılan yöntemle 7 iş günü içinde iade edilir.`,
        },
        {
          title: 'İade Şartları',
          description: `Alıcı, ürün teslim alındıktan sonra 14 gün içinde cayma hakkını kullanarak ürünü iade edebilir. İade edilecek ürünlerin kullanılmamış, orijinal ambalajında ve yeniden satılabilir durumda olması gerekmektedir. Ürünle birlikte gönderilen faturanın bir kopyasının iade paketine eklenmesi zorunludur.`,
        },
        {
          title: 'İade İşlemleri',
          description: `İade talebi oluşturmak için kilometrehacker@gmail.com adresinden veya 0 850 302 01 07 numarasından bizimle iletişime geçebilirsiniz. Ürünler, GENERAL GRUP 1 OTOMOTİV YAZILIM ELEKTRONİK BİLİŞİM KALİBRASYON DANIŞMANLIK İMAL.SAN.VE TİC. LTD ŞTİ İVEDİKOSB MAH. MELİH GÖKÇEK BLV. NO: 10 B YENİMAHALLE/ ANKARA adresine gönderilmelidir. İade edilen ürünlerin kargo ücreti, aksi belirtilmediği sürece Alıcı tarafından karşılanır.`,
        },
        {
          title: 'İade Edilemeyecek Ürünler',
          description: `Aşağıdaki durumlarda iade talepleri kabul edilmemektedir: Alıcı'nın isteğine göre kişiselleştirilmiş ürünler. Hızlı bozulan veya son kullanma tarihi geçme ihtimali olan ürünler. Koruyucu bant, paket veya ambalajı açılmış hijyenik ürünler. Dijital ürünler ve yazılımlar (indirme veya kullanım başlamışsa).`,
        },
        {
          title: 'İade Süreci ve Ücret İadesi',
          description: `İade edilen ürünler tarafımıza ulaştıktan sonra kalite kontrol sürecine tabi tutulur. İade talebi onaylandıktan sonra, ödeme tutarı 10 iş günü içinde Alıcı'nın ödeme yaptığı yöntemle iade edilir. Ödeme iadelerinde, bankadan kaynaklı gecikmelerden firmamız sorumlu değildir.`,
        },
        {
          title: 'Ayıplı Ürünler',
          description: `Alıcı, teslim aldığı ürünün hasarlı veya ayıplı olduğunu fark ederse, teslim tarihinden itibaren 7 gün içinde bu durumu tarafımıza bildirmelidir. Ayıplı ürünler için kargo masrafları Satıcı tarafından karşılanır.`,
        },
        {
          title: 'Cayma Hakkı',
          description: `Cayma hakkına ilişkin detaylı bilgi için Mesafeli Satış Sözleşmesi sayfamızı ziyaret edebilirsiniz.`,
        },
        {
          title: 'İletişim Bilgileri',
          description: `E-posta: kilometrehacker@gmail.com, Telefon: 0 850 302 01 07, Kargo Adresi: İVEDİKOSB MAH. MELİH GÖKÇEK BLV. NO: 10 B YENİMAHALLE/ ANKARA`,
        },
      ],
    },
    {
      link: {
        label: 'Kullanım Koşulları',
        href: '/kullanim-kosullari',
      },
      items: [
        {
          title: 'Giriş ve Kabul',
          description: `Bu web sitesine erişerek ve/veya kullanarak, aşağıda belirtilen Kullanım Koşulları'nı kabul etmiş olursunuz. Bu koşulları kabul etmiyorsanız, lütfen web sitemizi kullanmayınız.`,
        },
        {
          title: 'Hizmetlerimiz',
          description: `kilometrehacker.com, kullanıcılarına araç kilometre bilgilerini analiz etme ve güvenilir sonuçlar sunma hizmeti sağlamaktadır. Sitede sunulan hizmetlerin içeriği ve kapsamı tamamen GENERAL GRUP 1 OTOMOTİV YAZILIM ELEKTRONİK BİLİŞİM KALİBRASYON DANIŞMANLIK İMAL.SAN.VE TİC LTD ŞTİ tarafından belirlenir ve önceden bildirim yapılmaksızın değiştirilebilir.`,
        },
        {
          title: 'Kullanıcı Yükümlülükleri',
          description: `Kullanıcılar: Web sitesini yasalara uygun bir şekilde kullanmayı kabul eder. Sitede verilen bilgileri yalnızca bireysel ihtiyaçları için kullanabilir, herhangi bir ticari amaçla çoğaltamaz, paylaşamaz veya kopyalayamaz. Web sitesine zarar verebilecek herhangi bir işlem yapamaz (virüs yayma, hack girişimi vb.).`,
        },
        {
          title: 'Hesap Oluşturma ve Güvenlik',
          description: `Kullanıcılar, web sitemiz üzerinden hesap oluşturduklarında verdikleri bilgilerin doğruluğundan sorumludur. Hesap bilgileri gizli tutulmalı ve üçüncü şahıslarla paylaşılmamalıdır. Kullanıcı hesabından kaynaklanan tüm işlemlerden kullanıcı sorumludur.`,
        },
        {
          title: 'Fikri Mülkiyet Hakları',
          description: `Web sitemizdeki tüm içerik (yazılımlar, metinler, görseller, videolar ve diğer materyaller), GENERAL GRUP 1 OTOMOTİV YAZILIM ELEKTRONİK BİLİŞİM KALİBRASYON DANIŞMANLIK İMAL.SAN.VE TİC LTD ŞTİ'nın mülkiyetindedir ve ulusal ve uluslararası fikri mülkiyet yasaları ile korunmaktadır. Kullanıcılar, bu içerikleri önceden yazılı izin almaksızın kopyalayamaz, dağıtamaz veya ticari amaçlarla kullanamaz.`,
        },
        {
          title: 'Ücretlendirme ve Ödeme',
          description: `Web sitemizde sunulan hizmetler için belirtilen ücretler, ödeme sırasında kullanıcıya bildirilir. Ödeme işlemleri, İyzico gibi güvenilir üçüncü taraf ödeme sağlayıcıları aracılığıyla yapılmaktadır. İptal ve iade politikalarımıza uygun olarak ücret iadeleri gerçekleştirilebilir.`,
        },
        {
          title: 'Veri Koruma ve Gizlilik',
          description: `Kullanıcı bilgileri, Gizlilik Politikamızda belirtilen esaslara uygun olarak işlenir ve saklanır. Kullanıcılar, kişisel verilerinin işlenmesiyle ilgili haklarına sahiptir ve bu haklarını kullanmak için bizimle iletişime geçebilir.`,
        },
        {
          title: 'Sorumluluğun Sınırlandırılması',
          description: `Web sitemizde yer alan bilgiler ve sunulan hizmetler mümkün olan en doğru şekilde sunulmaktadır; ancak bu bilgilerin doğruluğu, eksiksizliği veya güncelliği konusunda garanti verilmez. GENERAL GRUP 1 OTOMOTİV YAZILIM ELEKTRONİK BİLİŞİM KALİBRASYON DANIŞMANLIK İMAL.SAN.VE TİC LTD ŞTİ, web sitesinin kullanımından kaynaklanan doğrudan veya dolaylı zararlar için sorumluluk kabul etmez.`,
        },
        {
          title: 'Üçüncü Taraf Bağlantılar',
          description: `Web sitemizde üçüncü taraf web sitelerine yönlendiren bağlantılar bulunabilir. Bu bağlantıların içeriklerinden veya güvenilirliğinden GENERAL GRUP 1 OTOMOTİV YAZILIM ELEKTRONİK BİLİŞİM KALİBRASYON DANIŞMANLIK İMAL.SAN.VE TİC LTD ŞTİ sorumlu değildir.`,
        },
        {
          title: 'Kullanım Koşullarında Değişiklik',
          description: `GENERAL GRUP 1 OTOMOTİV YAZILIM ELEKTRONİK BİLİŞİM KALİBRASYON DANIŞMANLIK İMAL.SAN.VE TİC LTD ŞTİ, bu Kullanım Koşulları'nı önceden bildirimde bulunmaksızın değiştirme hakkını saklı tutar. Kullanıcıların, siteyi kullanmadan önce bu koşulları gözden geçirmeleri önerilir.`,
        },
        {
          title: 'Uygulanacak Hukuk ve Yetki',
          description: `Bu Kullanım Koşulları, Türkiye Cumhuriyeti kanunlarına tabidir. İşbu koşullardan doğacak ihtilafların çözümünde, GENERAL GRUP 1 OTOMOTİV YAZILIM ELEKTRONİK BİLİŞİM KALİBRASYON DANIŞMANLIK İMAL.SAN.VE TİC LTD ŞTİ'nın merkezinin bulunduğu yer mahkemeleri ve icra daireleri yetkilidir.`,
        },
        {
          title: 'İletişim Bilgileri',
          description: `Şirket Adı: GENERAL GRUP 1 OTOMOTİV YAZILIM ELEKTRONİK BİLİŞİM KALİBRASYON DANIŞMANLIK İMAL.SAN.VE TİC LTD ŞTİ, E-posta: kilometrehacker@gmail.com, Telefon: 0 850 302 01 07, Adres: İVEDİKOSB MAH. MELİH GÖKÇEK BLV. NO: 10 B YENİMAHALLE/ ANKARA, Son Güncelleme Tarihi: 08.03.2025`,
        },
      ],
    },
  ],
};

// CallToAction data on FAQs page *******************
export const callToActionFaqs: CallToActionProps = {
  id: 'callToAction-on-faqs',
  hasBackground: true,
  title: 'Aradığınızı bulamadınız mı?',
  subtitle:
    'Bizimle İletişime geçmekten çekinmeyin.',
  callToAction: {
    text: 'Bağlantı Kur',
    href: '/contact',
  },
};
