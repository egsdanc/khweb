import { Metadata } from 'next';

import { SITE } from '~/config.js';

import Providers from '~/components/atoms/Providers';
import Header from '~/components/widgets/Header';
import Announcement from '~/components/widgets/Announcement';
import Footer2 from '~/components/widgets/Footer2';

import { Inter as CustomFont } from 'next/font/google';
import '~/assets/styles/base.css';

const customFont = CustomFont({ subsets: ['latin'], variable: '--font-custom' });

export interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    template: `%s — ${SITE.name}`,
    default: SITE.title,
  },
  description: SITE.description,
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={`motion-safe:scroll-smooth ${customFont.variable} font-sans`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body 
        className="
          tracking-tight 
          antialiased 
          text-gray-900 
          dark:text-slate-300 
          dark:bg-slate-900
             2xl:scale-[0.95] 
          2xl:origin-top-left 
          2xl:w-[105.3%] 
          2xl:h-screen
          2xl:overflow-x-hidden
          2xl:flex 
          2xl:flex-col
        "
      >
        <Providers className="2xl:flex-grow">
          {/* <Announcement /> */}
          <Header />
          <main className="2xl:flex-grow">{children}</main>
          <Footer2 className="2xl:flex-shrink-0" />
        </Providers>
      </body>
    </html>
  );
}

// tracking-tight 
// antialiased 
// text-gray-900 
// dark:text-slate-300 
// dark:bg-slate-900
// max-md:max-w-full
// min-[1024px]:scale-[0.95] 
// min-[1024px]:origin-top-left 
// min-[1024px]:w-[105.3%] 
// min-[1024px]:h-screen
// min-[1024px]:overflow-x-hidden
// min-[1024px]:flex 
// min-[1024px]:flex-col