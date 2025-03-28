import { Metadata } from 'next';
import { Inter as CustomFont } from 'next/font/google';
import React from 'react';

import { SITE } from '~/config.js';

import Providers from '~/components/atoms/Providers';
import Header from '~/components/widgets/Header';
import Footer2 from '~/components/widgets/Footer2';
import Announcement from '~/components/widgets/Announcement';

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

// Extend the types for your components to accept className
interface WithClassName {
  className?: string;
}

// Update component imports or types
const ProvidersWithType: React.FC<{ children: React.ReactNode }> = Providers;
const HeaderWithType: React.FC<WithClassName> = Header;
const Footer2WithType: React.FC<WithClassName> = Footer2;

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
        <div className="2xl:flex-grow">
          <ProvidersWithType>
            <HeaderWithType />
            <main className="2xl:flex-grow">{children}</main>
            <Footer2WithType className="2xl:flex-shrink-0" />
          </ProvidersWithType>
        </div>
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