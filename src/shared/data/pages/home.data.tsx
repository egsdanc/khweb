import {
  IconArrowDown,
  IconArrowsRightLeft,
  IconBrandLinkedin,
  IconBrandTailwind,
  IconBrandTwitter,
  IconBulb,
  IconCheck,
  IconClock,
  IconComponents,
  IconDownload,
  IconListCheck,
  IconMail,
  IconMapPin,
  IconPhoneCall,
  IconRocket,
} from '@tabler/icons-react';
import {
  CallToActionProps,
  ContactProps,
  ContentProps,
  FAQsProps,
  FeaturesProps,
  HeroProps,
  PricingProps,
  SocialProofProps,
  StepsProps,
  TeamProps,
  TestimonialsProps,
} from '../../types';
import heroImg from '~/assets/images/hero.jpg';
import nextJsLogo from '~/assets/images/nextjs-logo.png';
import reactLogo from '~/assets/images/react-logo.png';
import tailwindCssLogo from '~/assets/images/tailwind-css-logo.png';
import typescriptLogo from '~/assets/images/typescript-logo.png';
import kmImage from '~/assets/images/km.jpg';
import carInsideImage from '~/assets/images/carInside.jpg';
import gasImg from '~/assets/images/gas.jpg';
import kilometrehackerImg from '~/assets/images/kilometrehacker.png';
import yolImg from '~/assets/images/yol.png';

// Hero data on Home page *******************
export const heroHome: HeroProps = {
  // title: (
  //   <>
  //     Aracınızın gerçek <span className="hidden md:inline"></span> <span>kilometresiyle yüzleşmenin</span>{' '}
  //     <span className="sm:whitespace-nowrap">vakti geldi</span>
  //   </>
  // ),
  title:"Aracınızın gerçek kilometresiyle yüzleşmenin vakti geldi",
  // subtitle: (
  //   <>
  //     <span className="hidden md:inline">
  //       <span className="font-semibold underline decoration-primary-600 decoration-wavy decoration-1 underline-offset-2">
  //         {/* TailNext */}
  //       </span>{' '}
  //       {/* is a production ready template to start your new website using <em>Next.js</em> + <em>Tailwind CSS</em>. */}
  //     </span>{' '}
  //     Kilometre Hacker, Araç sahipleri ve alıcılar için şeffaflık sağlayarak, ikinci el araç piyasasında olası manipülasyonları tespit etmeye yardımcı olur.

  //   </>
  // ),
  subtitle: "Kilometre Hacker, Araç sahipleri ve alıcılar için şeffaflık sağlayarak, ikinci el araç piyasasında olası manipülasyonları tespit etmeye yardımcı olur.",
  callToAction: {
    text: 'Şimdi Satın Al',
    href: '/pricing',
    icon: IconClock,
 //   targetBlank: true,
  },
  callToAction2: {
    text: 'Daha Fazla',
    href: '/about',
  },
  image: {
    src: kilometrehackerImg,
    alt: 'Hero TailNext',
  },
};

// SocialProof data on Home page *******************
export const socialProofHome: SocialProofProps = {
  id: 'socialProof-on-home',
  hasBackground: false,
  images: [
    {
      link: 'https://nextjs.org/',
      src: nextJsLogo,
      alt: 'NextJs Logo',
    },
    {
      link: 'https://react.dev/',
      src: reactLogo,
      alt: 'React Logo',
    },
    {
      link: 'https://tailwindcss.com/',
      src: tailwindCssLogo,
      alt: 'Tailwind CSS Logo',
    },
    {
      link: 'https://www.typescriptlang.org/',
      src: typescriptLogo,
      alt: 'Typescript Logo',
    },
  ],
};

// Features data on Home page *******************
export const featuresHome: FeaturesProps = {
  id: 'features-on-home',
  hasBackground: false,
  columns: 3,
  header: {
    title: (
      <>
       Hızlı ve Kolay Kullanım<span className="whitespace-nowrap"></span>
        {" "}<span className="whitespace-nowrap"></span>
        {" "}<span className="whitespace-nowrap"></span>
      </>
    ),
    subtitle:
      "Karmaşık kurulum gerektirmez, kullanıcı dostu arayüzü sayesinde herkes rahatlıkla kullanabilir.",
    tagline: 'Özellikler',
  },
  items: [

    {
      title: 'Kilometre Hacker ile Güvene Dayalı Çözümler',
      description:
      'Araç alım-satım işlemlerinizde en büyük endişelerden biri olan kilometre bilgisi, artık sorun olmaktan çıkıyor! Kilometre Hacker, en gelişmiş teknolojilerle araç geçmişini hızlı ve doğru bir şekilde analiz eder. Doğru bilgiye ulaşarak hem zaman kazanın hem de güvenli işlemler yapın.',
      icon: IconComponents,
      callToAction: {
        text: 'Şimdi keşfedin',
        href: '/blog',
      },
    },
    {
      title: 'Yeni Nesil Teknoloji, Güvenilir Hizmet',

      description:
      "Dünyanın en gelişmiş araç kilometre tespit sistemlerinden biriyle tanışın! Türk mühendisliğiyle geliştirilen ve 9 profesör tarafından onaylanan teknolojimiz sayesinde aracınızın geçmişi hakkında tam şeffaflık sağlıyoruz. Hedefimiz, size güvenilir ve profesyonel bir hizmet sunmak.",
      icon: IconListCheck,
      callToAction: {
        text: 'Şimdi keşfedin',
        href: '/blog',
      },
    },
    {
      title: 'Gerçek Kilometre Bilgisine Ulaşın',
      description:
        'Araç beyninden doğrudan kilometre verisini okuyarak manipülasyonları ortaya çıkarın.Kilometre Hacker, Motor Kontrol Ünitesi (ECU), ABS, Airbag, Şanzıman ve diğer elektronik sistemlerden gerçek kilometre bilgisini çekerek aracın gerçek kullanım geçmişini öğrenmenizi sağlar.',
      icon: IconBrandTailwind,
      callToAction: {
        text: 'Şimdi keşfedin',
        href: '/blog',
      },
    },
    {
      title: 'SÜREKLİ GÜNCEL YAZILIMLAR',
      description:
      "Sistemlerimiz, tüm araç modellerine uygun sağlayacak şekilde sürekli verilenmektedir. Üstelik güncellemeler tamamen ücretsizdir!",
      icon: IconArrowsRightLeft,
      callToAction: {
        text: 'Şimdi keşfedin',
        href: '/blog',
      },
    },
    {
      title: 'KULLANICI DOSTU TEKNOLOJİ',
      description:
      "Herkesin rahatça kullanabileceği basit ve etkili bir arayüze, kilometre bilgisi tespiti ve VIN tespiti için uzman olmanıza gerek yok. Tek tıkla kolayca çözüm alın!",
      icon: IconBulb,
      callToAction: {
        text: 'Şimdi keşfedin',
        href: '/blog',
      },
    },
    {
      title: 'HIZLI VE GÜVENİLİR ÇÖZÜM',
      description:
      "Araçlarınızın kilometre bilgilerini tespit etmek hiç bu kadar kolay olmamıştı! Gelişmiş teknolojimizde zamanın tasarruf edin ve doğru sonuçlara ulaşın.",
      icon: IconRocket,
      callToAction: {
        text: 'Şimdi keşfedin',
        href: '/blog',
      },
    },
  ],
};

// Content data on Home page *******************
export const contentHomeOne: ContentProps = {
  id: 'contentOne-on-home-one',
  hasBackground: true,
  header: {
    title: 'Kilometre Hacker ile Sunulan Gelişmiş Özellikler',
    subtitle: 'Sizi Bir Adım Öteye Taşıyacak Teknoloji',
    tagline: 'Teknoloji',
  },
  content:""   ,   // 'Yeni Nesil Teknoloji, Güvenilir Hizmet.'"   
  items: [
    {
      title: 'Change tespiti (VIN numarası değişikliği)',
      description:
        '',
    },
    {
      title: 'Motor Beyni (ECU) Kilometre Bilgisi Okuma',
      description:
        '',
    },
    {
      title: 'ABS Beyni Kilometre Bilgisi Okuma',
      description:
        '',
    },
    {
      title: 'Airbag Beyni Kilometre Bilgisi Okuma',
      description:
        '',
    },
    {
      title: 'Şanzıman Beyni Kilometre Bilgisi Okuma',
      description:
        '',
    },
    {
      title: 'Direksiyon Sistemi Kilometre Bilgisi Okuma',
      description:
        '',
    },    {
      title: 'Gösterge Panelinden Kilometre Bilgisi Okuma',
      description:
        '',
    },
    {
      title: 'Klima Sistemi Beyninden Kilometre Bilgisi Okuma',
      description:
        '',
    },
    {
      title: 'Radyo ve Multimedya Ünitelerinden Kilometre Bilgisi Okuma',
      description:
        '',
    },    {
      title: 'Anahtar Sistemi Üzerinden Kilometre Bilgisi Çekme',
      description:
        '',
    },
    {
      title: 'Tüm Elektronik Aksamdan Kilometre Bilgisi Okuma',
      description:
        '',
    },
    {
      title: 'Hata Kodlarından Kilometre Bilgisi Çözümleme',
      description:
        '',
    },    {
      title: 'Lastik Basınç Sensöründen Kilometre Bilgisi Çekme',
      description:
        '',
    },
    {
      title: 'Araç Beyinlerinden VIN Numarası Çekme',
        description:
          '',
    },
    {
      title: 'Gösterge Paneli Kalibrasyonu ve Kilometre Eşleşmesi',
      description:
      '',
    },
    {
      title: 'Araç Tarihçesi Analizi (Kilometre Değişikliklerini İzleme)',
      description:
      '',
    },
    {
      title: 'Araç Marka ve Modeline Göre Özel Kilometre Çözümleme',
      description:
      '',
    },
    {
      title: 'Elektronik Kontrol Ünitelerinden (ECU) Veri Çekme',
      description:
      '',
    },
    {
      title: 'Can-Bus Hattı Üzerinden Kilometre Bilgisi Toplama',
      description:
      '',
    },
    {
      title: 'Otomatik Kilometre Raporlama Sistemi',
      description:
      '',
    },
    {
      title: 'Araç Beyinlerinden Gerçek Zamanlı Veri Çekme',
      description:
      '',
    },
    {
      title: 'Çift Katmanlı Güvenlik Protokolleriyle Veri Koruma',
      description:
      '',
    },
    {
      title: 'Farklı Marka ve Modellerle Tam Uyumlu Sistemler',
      description:
      '',
    },
    {
      title: 'Eski ve Yeni Nesil Araçlar için Gelişmiş Algoritmalar',
      description:
      '',
    },
    {
      title: 'Hata Kodlarının Analizi ve Kilometre Verisiyle Karşılaştırma',
      description:
      '',
    },    {
      title: 'DPF (Dizel Partikül Filtresi) Kayıtlarından Kilometre Bilgisi Çekme',
      description:
      '',
    },
    {
      title: 'Fren ve Hızlandırma Sensörlerinden Anlık Veri Okuma',
      description:
      '',
    },

  ],
  // image: {
  //   src: kmImage,
  //   alt: 'Colorful Image',
  // },
  isReversed: false,
  isAfterContent: false,
};

// Content data on Home page *******************
export const contentHomeTwo: ContentProps = {
  id: 'contentOne-on-home-two',
  hasBackground: true,
  content:
    'Kilometre Hacker ile Güvene Dayalı Çözümler.',
  items: [
    {
      title: 'Gösterge Paneli Kalibrasyonu ve Kilometre Eşleşmesi',
      description: 'Gösterge paneli kalibrasyonu ve kilometre eşleşmesi hizmeti',
    },
    {
      title: 'Hız Sensörlerinden Kilometre Bilgisi Okuma',
      description: 'Hız sensörlerinden kilometre bilgisi okuma hizmeti',
    },
    {
      title: 'Araç Tarihçesi Analizi (Kilometre Değişikliklerini İzleme)',
      description: 'Araç tarihçesi analizi ve kilometre değişikliklerini izleme hizmeti',
    },
    {
      title: 'Araç Marka ve Modeline Göre Özel Kilometre Çözümleme',
      description: 'Araç marka ve modeline göre özel kilometre çözümleme hizmeti',
    },
    {
      title: 'Elektronik Kontrol Ünitelerinden (ECU) Veri Çekme',
      description: 'Elektronik kontrol ünitelerinden veri çekme hizmeti',
    },
    {
      title: 'Can-Bus Hattı Üzerinden Kilometre Bilgisi Toplama',
      description: 'Can-Bus hattı üzerinden kilometre bilgisi toplama hizmeti',
    },
    {
      title: 'Otomatik Kilometre Raporlama Sistemi',
      description: 'Otomatik kilometre raporlama sistemi hizmeti',
    },
    {
      title: 'Araç Beyinlerinden Gerçek Zamanlı Veri Çekme',
      description: 'Araç beyinlerinden gerçek zamanlı veri çekme hizmeti',
    },
    {
      title: 'Çift Katmanlı Güvenlik Protokolleriyle Veri Koruma',
      description: 'Çift katmanlı güvenlik protokolleriyle veri koruma hizmeti',
    },
    {
      title: 'Farklı Marka ve Modellerle Tam Uyumlu Sistemler',
      description: 'Farklı marka ve modellerle tam uyumlu sistemler hizmeti',
    },
    {
      title: 'Eski ve Yeni Nesil Araçlar için Gelişmiş Algoritmalar',
      description: 'Eski ve yeni nesil araçlar için gelişmiş algoritmalar hizmeti',
    },
    {
      title: 'Hata Kodlarının Analizi ve Kilometre Verisiyle Karşılaştırma',
      description: 'Hata kodlarının analizi ve kilometre verisiyle karşılaştırma hizmeti',
    },
    {
      title: 'DPF (Dizel Partikül Filtresi) Kayıtlarından Kilometre Bilgisi Çekme',
      description: 'DPF kayıtlarından kilometre bilgisi çekme hizmeti',
    },
    {
      title: 'Fren ve Hızlandırma Sensörlerinden Anlık Veri Okuma',
      description: 'Fren ve hızlandırma sensörlerinden anlık veri okuma hizmeti',
    },
  ],
  // image: {
  //   src: carInsideImage,
  //   alt: 'Colorful Image',
  // },
  isReversed: true,
  isAfterContent: true,
};

// Steps data on Home page *******************
export const stepsHome: StepsProps = {
  id: 'steps-on-home',
  hasBackground: false,
  isReversed: false,
  isImageDisplayed: true,
  image: {
    src: yolImg,
    alt: 'khimage',
  },
  header: {
    title: 'Tüm Sistemlerden Kilometre ve VIN Bilgisi Okuma Teknolojisi',
  },
  items: [
    {
      title: 'Hızlı ve Güvenilir Çözüm',
      description:
        'Kilometre Hacker, teknolojimiz, uluslararası standartlara uygun olarak geliştirilmiş ve doğruluğu kanıtlanmıştır. Gerçek zamanlı ve hassas ölçümler sunarak araç analizinde güvenilirlik sağlar. Sürekli olarak güncellenen algoritmalarımız, sistemimizi her zaman en üst düzeyde tutar ve kullanıcılarımıza üstün bir deneyim sunar.',
      icon: IconArrowDown,
    },
    {
      title: 'Sürekli Güncel Yazılımlar',
      description:
        'Patentli sistemlerimiz, tüm araç modellerine uyum sağlayacak şekilde sürekli yenilenmektedir. Üstelik güncellemeler tamamen ücretsizdir!',
      icon: IconArrowDown,
    },
    {
      title: 'Kullanıcı Dostu Teknoloji',
      description:
        'Kilometre Hacker, kullanıcı dostu arayüzü sayesinde herkesin kolayca kullanabileceği bir çözüm sunar. Tek tıkla araç kilometre bilgilerine ve diğer verilere hızlıca ulaşmanızı sağlar. Masaüstü cihazlarla tam uyumlu olan sistemimiz, ERP yazılımız ile de her yerden erişim imkanı sunarak işlerinizi kolaylaştırır. Yazılımımız, düzenli olarak anlık güncellemeler alır ve her zaman en yeni teknolojilere entegre olarak çalışır. Ayrıca, gelişmiş çoklu dil desteği sayesinde dünyanın farklı bölgelerinden kullanıcılar için erişilebilirlik sağlar.',
      icon: IconArrowDown,
    },
    {
      title: 'Kilometre Hacker!',
    },
  ],
};

// Testimonials data on Home page *******************
export const testimonialsHome: TestimonialsProps = {
  id: 'testimonials-on-home',
  hasBackground: true,
  header: {
    title: 'Kilometre Hacker Cihazı Özellikleri',
    subtitle:
      'Aracınızın Orjinal Kilometresiyle Yüzleşmenin Vakti Geldi',
  },
  testimonials: [
   
    {
      name: 'Raporlama ve Veri Analizi',
      job: '',
      testimonial: `Otomatik Kilometre Raporlama Sistemi\n
Kilometre Bilgisi Değişikliklerini Karşılaştırma ve İzleme\n
Eksiksiz ve Detaylı Kilometre Analizi Sunma\n
Anlık Veri İşleme ve Hızlı Raporlama\n
Kilometre Bilgisi ile Servis Süreçlerinin Karşılaştırılması`,
      image: {
        src: 'https://emojigraph.org/media/openmoji/bar-chart_1f4ca.png',
        alt: 'Kelsey Arden',
      },
      href: '/',
    },
    {
      name: 'Entegrasyon ve Kullanım Kolaylığı',
      job: '',
      testimonial: `Kullanıcı Dostu Arayüz ile Tek Tıkla Veri Okuma\n
Mobil ve Masaüstü Cihazlarla Tam Uyum\n
Anlık Güncelleme ve Entegre Yazılım Destekleri\n
Gelişmiş Çoklu Dil Desteği`,
      image: {
        src: 'https://emojigraph.org/media/apple/globe-with-meridians_1f310.png',
        alt: 'Lisa Gordon',
      },
      href: '/',
    },
    {
      name: 'Diagnostik ve Test Süreçleri',
      job: '',
      testimonial: `Hata Kodlarının Analizi ve Kilometre Verisiyle Karşılaştırma\n
DPF (Dizel Partikül Filtresi) Kayıtlarından Kilometre Bilgisi Çekme\n
Fren ve Hızlandırma Sensörlerinden Anlık Veri Okuma\n
Yakıt Tüketim Verilerinden Kilometre Tahmini`,
      image: {
        src: 'https://symbl-world.akamaized.net/i/webp/10/bdb221f9124c16a871817dbd1607a4.webp',
        alt: 'Keith Young',
      },
      href: '/',
    },
    {
      name: 'Beyin ve Elektronik Sistemlerden Kilometre Okuma',
      job: '',
      testimonial: `Motor Beyni (ECU) Kilometre Okuma\n
ABS Beyni Kilometre Okuma\n
Airbag Beyni Kilometre Okuma\n
Şanzıman Beyni Kilometre Okuma\n
Direksiyon ve Gösterge Panelinden Kilometre Okuma\n
Klima Sistemi Beyninden Kilometre Okuma\n
Radyo ve Multimedya Ünitelerinden Kilometre Okuma\n
Anahtar Sistemi Üzerinden Kilometre Bilgisi Çekme\n
Hata Kodlarından Kilometre Bilgisi Çözümleme\n
Lastik Basınç Sensöründen Kilometre Bilgisi Çekme`,
      image: {
        src: 'https://emojigraph.org/media/apple/gear_2699-fe0f.png',
        alt: 'Tayla Kirsten',
      },
      href: '/',
    },
    {
      name: 'Ekstra Veri Okuma ve Tespit',
      job: '',
      testimonial: `Araç Beyinlerinden VIN Numarası Çekme\n
Change tespiti (VIN numarası değişikliği)\n
Hız Sensörlerinden Kilometre Bilgisi Okuma\n
Araç Tarihçesi Analizi (Kilometre Değişikliklerini İzleme)\n
Tüm Elektronik Aksamdan Toplu Kilometre Bilgisi Okuma\n
Araç Marka ve Modeline Göre Özel Kilometre Çözümleme\n
Elektronik Kontrol Ünitelerinden (ECU) Veri Çekme\n
Can-Bus Hattı Üzerinden Kilometre Bilgisi Toplama`,
      image: {
        src: 'https://emojigraph.org/media/apple/floppy-disk_1f4be.png',
        alt: 'Silver Jordan',
      },
      href: '/',
    },
    {
      name: 'Özelleştirilmiş Teknik Özellikler',
      job: '',
      testimonial: `Araç Beyinlerinden Gerçek Zamanlı Veri Çekme\n
Çift Katmanlı Güvenlik Protokolleriyle Veri Koruma\n
Farklı Marka ve Modellerle Tam Uyumlu Sistemler\n
Eski ve Yeni Nesil Araçlar için Gelişmiş Algoritmalar\n
Elektriksel ve Mekanik Sensörlerden Veri Çekme Yeteneği`,
      image: {
        src: 'https://emojigraph.org/media/apple/stopwatch_23f1-fe0f.png',
        alt: 'Sarah Johnson',
      },
      href: '/',
    },
  ],
};

// FAQS data on Home page *******************
export const faqs2Home: FAQsProps = {
  id: 'faqsTwo-on-home',
  hasBackground: false,
  header: {
    title: 'Frequently Asked Questions',
    subtitle:
      'Duis turpis dui, fringilla mattis sem nec, fringilla euismod neque. Morbi tincidunt lacus nec tortor scelerisque pulvinar.',
    tagline: 'FAQS',
  },
  items: [
    {
      title: 'What do I need to start?',
      description: `Nunc mollis tempor quam, non fringilla elit sagittis in. Nullam vitae consectetur mi, a elementum arcu. Sed laoreet, ipsum et vehicula dignissim, leo orci pretium sem, ac condimentum tellus est quis ligula.`,
    },
    {
      title: 'How to install the NextJS + Tailwind CSS template?',
      description: `Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer eleifend vestibulum nisl in iaculis. Mauris dictum ac purus vestibulum auctor. Praesent imperdiet lectus et massa faucibus, quis viverra massa rhoncus.`,
    },
    {
      title: "What's something that you completely don't understand?",
      description: `Mauris vitae eros a dui varius luctus. Suspendisse rutrum, sapien nec blandit bibendum, justo sapien sollicitudin erat, id aliquam sapien purus quis leo. Aliquam vulputate vestibulum consectetur.`,
    },
    {
      title: "What's an example of when you changed your mind?",
      description: `Nunc dapibus lacinia ipsum ut elementum. Integer in pretium sapien. Ut pretium nisl mauris, ut rutrum justo condimentum id. Etiam aliquet, arcu at iaculis laoreet, est arcu egestas sapien, eget sollicitudin odio orci et nunc.`,
    },
    {
      title: 'What is something that you would really like to try again?',
      description: `Duis in maximus mauris, id eleifend mauris. Nam a fringilla arcu. Curabitur convallis, tellus non aliquet rhoncus, lacus massa auctor eros, in interdum lectus augue sed augue. Fusce tempor ex id faucibus efficitur.`,
    },
    {
      title: 'If you could only ask one question to each person you meet, what would that question be?',
      description: `Nullam imperdiet sapien tincidunt erat dapibus faucibus. Vestibulum a sem nec lorem imperdiet scelerisque non sed lacus. Ut pulvinar id diam vitae auctor. Nam tempus, neque et elementum consectetur, ex ipsum pulvinar risus, vel sodales ligula tortor eu eros.`,
    },
  ],
};

// Pricing data on Home page *******************
export const pricingHome: PricingProps = {
  id: 'pricing-on-home',
  hasBackground: true,
  header: {
    title: 'Kilometre Hacker ile Araç Verilerinizi Öğrenin!',
    subtitle:
      'Gelişmiş Teknolojilerle Tüm Elektronik Aksamdan Kilometre Bilgisi Çekme ve Anlık Veri Okuma!',
    // tagline: 'Pricing',
  },
  prices: [
    // {
    //   title: 'basic',
    //   price: 29,
    //   period: 'per month',
    //   items: [
    //     {
    //       description: 'Etiam in libero, et volutpat',
    //     },
    //     {
    //       description: 'Aenean ac nunc dolor tristique',
    //     },
    //     {
    //       description: 'Cras scelerisque accumsan lib',
    //     },
    //     {
    //       description: 'In hac habitasse',
    //     },
    //   ],
    //   callToAction: {
    //     targetBlank: true,
    //     text: 'Free 7-day trial',
    //     href: '/',
    //   },
    //   hasRibbon: false,
    // },
    {
      title: 'Kilometre Hacker',
      price: 60000,
      period: 'Karşılığında',
      items: [
        {
          description: 'Bu Fırsatı Kaçırma',
        },
        {
          description: 'Hemen Sahip Ol',
        },
        {
          description: 'İyzico ile güvenli ödeme',
        },
        {
          description: 'Taksitli ödeme imkanı',
        },
      ],
      callToAction: {
   //     targetBlank: true,
        text: 'Şimdi Satın Al',
        href: '/pricing',
      },
      hasRibbon: true,
      ribbonTitle: 'Popular',
    },
    // {
    //   title: 'premium',
    //   price: 199,
    //   period: 'per month',
    //   items: [
    //     {
    //       description: 'Curabitur suscipit risus',
    //     },
    //     {
    //       description: 'Aliquam blandit malesuada',
    //     },
    //     {
    //       description: 'Suspendisse sit amet',
    //     },
    //     {
    //       description: 'Suspendisse auctor dui',
    //     },
    //   ],
    //   callToAction: {
    //     targetBlank: true,
    //     text: 'Free 30-day trial',
    //     href: '/',
    //   },
    //   hasRibbon: false,
    // },
  ],
};

// Team data on Home page *******************
export const teamHome: TeamProps = {
  id: 'team-on-home',
  hasBackground: false,
  header: {
    title: 'Team Members',
    subtitle:
      'Suspendisse in dui nibh. Donec enim leo, sodales et egestas id, malesuada non diam. Sed dapibus velit et mauris condimentum, vel imperdiet erat egestas.',
    // tagline: 'Team',
  },
  teams: [
    {
      name: 'Cindy Belcher',
      occupation: 'SEO Consultant',
      image: {
        src: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
        alt: 'Cindy Belcher',
      },
      items: [
        {
          title: 'Know more on Twitter',
          icon: IconBrandTwitter,
          href: '#',
        },
        {
          title: 'Know more on Linkedin',
          icon: IconBrandLinkedin,
          href: '#',
        },
        {
          title: 'Contact by email',
          icon: IconMail,
          href: '#',
        },
      ],
    },
    {
      name: 'Toby Foster',
      occupation: 'Marketing Tech',
      image: {
        src: 'https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2172&q=80',
        alt: 'Toby Foster',
      },
      items: [
        {
          title: 'Know more on Twitter',
          icon: IconBrandTwitter,
          href: '#',
        },
        {
          title: 'Know more on Linkedin',
          icon: IconBrandLinkedin,
          href: '#',
        },
        {
          title: 'Contact by email',
          icon: IconMail,
          href: '#',
        },
      ],
    },
    {
      name: 'Clark Bourne',
      occupation: 'Content Manager',
      image: {
        src: 'https://images.unsplash.com/photo-1639628735078-ed2f038a193e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80',
        alt: 'Clark Bourne',
      },
      items: [
        {
          title: 'Know more on Twitter',
          icon: IconBrandTwitter,
          href: '#',
        },
        {
          title: 'Know more on Linkedin',
          icon: IconBrandLinkedin,
          href: '#',
        },
        {
          title: 'Contact by email',
          icon: IconMail,
          href: '#',
        },
      ],
    },
    {
      name: 'Bella Chase',
      occupation: 'UX Designer',
      image: {
        src: 'https://images.unsplash.com/photo-1628260412297-a3377e45006f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80',
        alt: 'Bella Chase',
      },
      items: [
        {
          title: 'Know more on Twitter',
          icon: IconBrandTwitter,
          href: '#',
        },
        {
          title: 'Know more on Linkedin',
          icon: IconBrandLinkedin,
          href: '#',
        },
        {
          title: 'Contact by email',
          icon: IconMail,
          href: '#',
        },
      ],
    },
  ],
};

// Contact data on Home page *******************
export const contactHome: ContactProps = {
  hasBackground: true,
  header: {
    title: 'Get in Touch',
    subtitle: 'In hac habitasse platea dictumst',
    tagline: 'Contact',
  },
  content:
    'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis nec ipsum orci. Ut scelerisque sagittis ante, ac tincidunt sem venenatis ut.',
  items: [
    {
      title: 'Our Address',
      description: ['1230 Maecenas Street Donec Road', 'New York, EEUU'],
      icon: IconMapPin,
    },
    {
      title: 'Contact',
      description: ['Mobile: +1 (123) 456-7890', 'Mail: tailnext@gmail.com'],
      icon: IconPhoneCall,
    },
    {
      title: 'Working hours',
      description: ['Monday - Friday: 08:00 - 17:00', 'Saturday & Sunday: 08:00 - 12:00'],
      icon: IconClock,
    },
  ],
  form: {
    title: 'Ready to Get Started?',
    inputs: [
      {
        type: 'text',
        name: 'name',
        autocomplete: 'off',
        placeholder: 'Your name',
      },
      {
        type: 'email',
        name: 'email',
        autocomplete: 'on',
        placeholder: 'Your email address',
      },
    ],
    textarea: {
      cols: 30,
      rows: 5,
      name: 'textarea',
      placeholder: 'Write your message...',
    },
    btn: {
      title: 'Send Message',
      type: 'submit',
    },
  },
};

// CallToAction data *******************
export const callToAction2Home: CallToActionProps = {
  title: 'Kilometre Hacker',
  subtitle:
    'Daha Fazla Bilgi İçin',
  callToAction: {
    text: 'Get template',
    href: 'https://github.com/onwidget/tailnext',
    icon: IconDownload,
  },
  items: [
    {
      title: 'Hakkımızda',
      description: 'Ayrıntılı bilgi için tıklayınız',
      href: '/about',
    },
    {
      title: 'Yardım',
      description: 'Çok sorulan sorular ve merak ettikleriniz',
      href: '/faqs',
    },
    {
      title: 'Subscribe',
      description: 'Morbi orci nunc, euismod ac dui id, convallis.',
      form: {
        icon: IconMail,
        input: {
          type: 'email',
          name: 'email',
          autocomplete: 'email',
          placeholder: 'Enter your email address',
        },
        btn: {
          title: 'Subscribe',
          type: 'submit',
        },
      },
    },
  ],
};
