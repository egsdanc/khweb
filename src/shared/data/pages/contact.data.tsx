import { IconClock, IconHeadset, IconHelp, IconMapPin, IconMessages, IconPhoneCall,IconMail
} from '@tabler/icons-react';
import { ContactProps, FeaturesProps } from '~/shared/types';
import { HeroProps } from '~/shared/types';

// Hero data on Contact page *******************
export const heroContact: HeroProps = {
  title: 'Bize Ulaşın',
  subtitle: (
    <>
      <span className="hidden md:inline">{`Size yardımcı olmaktan mutluluk duyarız`}</span>{' '}
      {``}
    </>
  ),
  tagline: 'İletişim',
};

// Contact data on Contact page *******************
export const contact2Contact: ContactProps = {
  id: 'contactTwo-on-contact',
  hasBackground: true,
  header: {
    title: 'Contact us',
    subtitle: (
      <>
        Please take a moment to fill out this form.{' '}
        <span className="hidden md:inline">{`So we can better understand your needs and get the process started smoothly.`}</span>
      </>
    ),
  },
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
        label: 'First name',
        name: 'name',
        autocomplete: 'off',
        placeholder: 'First name',
      },
      {
        type: 'text',
        label: 'Last name',
        name: 'lastName',
        autocomplete: 'off',
        placeholder: 'Last name',
      },
      {
        type: 'email',
        label: 'Email address',
        name: 'email',
        autocomplete: 'on',
        placeholder: 'Email address',
      },
    ],
    radioBtns: {
      label: 'What is the reason for your contact?',
      radios: [
        {
          label: 'General inquiries',
        },
        {
          label: 'Technical help',
        },
        {
          label: 'Claims',
        },
        {
          label: 'Others',
        },
      ],
    },
    textarea: {
      cols: 30,
      rows: 5,
      label: 'How can we help you?',
      name: 'textarea',
      placeholder: 'Write your message...',
    },
    checkboxes: [
      {
        label: 'Have you read our privacy policy?',
        value: '',
      },
      {
        label: 'Do you want to receive monthly updates by email?',
        value: '',
      },
    ],
    btn: {
      title: 'Send Message',
      type: 'submit',
    },
  },
};

// Feature2 data on Contact page *******************
export const features2Contact: FeaturesProps = {
  columns: 3,
  header: {
    title: 'Kilometre Hacker Satış Ofisi',
    subtitle: 'İletişime Geç',
  },
  items: [
    {
      title: 'Destek?',
      description: 'Sıkça sorulan sorularımıza bakın',
      icon: IconHelp,
      callToAction: {
        text: 'Tıklayınız',
        href: '/faqs',
      },
    },
    {
      title: 'Adres',
      description: 'İvedik OSB Mah. Melih Gökçek Blv. No: 10/B Yenimahalle / Ankara',
      icon: IconMessages,
      callToAction: {
        text: 'Bizimle iletişime geçin',
        href: '/contact',
      },
    },
    {
      title: 'E-Posta',
      description: 'kilometrehacker@gmail.com',
      icon: IconMail,
      callToAction: {
        text: 'Bize mail gönderin',
        href: '/contact',
      },
    },
    {
      title: 'GSM',
      description: '0501 032 10 01',
      icon: IconHeadset,
      callToAction: {
        text: 'Bizi Arayın',
        href: '/contact',
      },
    },
    {
      title: 'Çağrı Merkezi',
      description: '0850 302 01 07',
      icon: IconHeadset,
      callToAction: {
        text: 'Bizi Arayın',
        href: '/contact',
      },
    },
  ],
};
