  "use client"
import React, { useState, useEffect } from 'react';
import { CallToActionType, PricingProps } from '~/shared/types';
import CTA from '../common/CTA';
import Headline from '../common/Headline';
import WidgetWrapper from '../common/WidgetWrapper';
import ItemGrid from '../common/ItemGrid';
import { IconCheck, IconLoader2 } from '@tabler/icons-react';
import kilometrehackerImg from '~/assets/images/kilometrehacker.png';

const Pricing = ({ header, prices, id, hasBackground = false }: PricingProps) => {
  const [dynamicPrice, setDynamicPrice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        setDynamicPrice(data.fiyat);
      } catch (error) {
        console.error("Hata:", error);
        setDynamicPrice(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
  }, []);

  return (
    <WidgetWrapper id={id ? id : ''} hasBackground={hasBackground} containerClass="">
      {header && <Headline header={header} containerClass="max-w-5xl" titleClass="text-2xl sm:text-3xl" />}
      <div className="flex items-stretch justify-center">
        <div className="flex justify-center items-center w-full">
          {prices &&
            prices.map(
              ({ title, subtitle, price, period, items, callToAction, hasRibbon = false, ribbonTitle }, index) => (
                <div
                  className="flex justify-center mx-auto w-full sm:w-96"
                  key={`pricing-${index}`}
                >
                  {price && period && (
                    <div className="card max-w-sm flex flex-col justify-between text-center">
                      {hasRibbon && ribbonTitle && (
                        <div className="absolute right-[-5px] rtl:right-auto rtl:left-[-5px] top-[-5px] z-[1] h-[100px] w-[100px] overflow-hidden text-right">
                          <span className="absolute top-[19px] right-[-21px] rtl:right-auto rtl:left-[-21px] block w-full rotate-45 rtl:-rotate-45 bg-green-700 text-center text-[10px] font-bold uppercase leading-5 text-white shadow-[0_3px_10px_-5px_rgba(0,0,0,0.3)] before:absolute before:left-0 before:top-full before:z-[-1] before:border-[3px] before:border-r-transparent before:border-b-transparent before:border-l-green-800 before:border-t-green-800 before:content-[''] after:absolute after:right-0 after:top-full after:z-[-1] after:border-[3px] after:border-l-transparent after:border-b-transparent after:border-r-green-800 after:border-t-green-800 after:content-['']">
                            {ribbonTitle}
                          </span>
                        </div>
                      )}
                      <div className="px-2 py-0">
                        {title && (
                          <h3 className="text-center text-xl font-semibold uppercase leading-6 tracking-wider mb-2">
                            {title}
                          </h3>
                        )}
                        {subtitle && (
                          <p className="font-light sm:text-lg text-gray-600 dark:text-slate-400">{subtitle}</p>
                        )}
                        <div className="my-8">
                          <div className="flex items-center justify-center text-center mb-1">
                            {isLoading ? (
                              <IconLoader2 className="animate-spin text-primary-600 w-12 h-12" />
                            ) : (
                              <>
                                <span className="text-6xl font-extrabold">
                                  {dynamicPrice || price}
                                </span>
                                <span className="text-5xl">TL</span>
                              </>
                            )}
                          </div>
                          <span className="text-base leading-6 lowercase text-gray-600 dark:text-slate-400">
                            {period}
                          </span>
                        </div>
                        {items && (
                          <div className="my-8 md:my-10 space-y-2 text-left">
                            <ItemGrid
                              id={id}
                              items={items}
                              columns={1}
                              defaultIcon={IconCheck}
                              containerClass="gap-2 md:gap-y-2"
                              panelClass="flex items-start"
                              iconClass="w-4 h-4 mt-1.5 mr-3 rtl:mr-0 rtl:ml-3 flex items-center justify-center rounded-full border-2 border-primary-600 bg-primary-600 text-white dark:text-slate-200"
                            />
                          </div>
                        )}
                      </div>
                      {callToAction && (
                        <CTA
                          callToAction={callToAction as CallToActionType}
                          linkClass={`btn ${hasRibbon ? 'btn-primary' : ''}`}
                        />
                      )}
                    </div>
                  )}
                </div>
              ),
            )}
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default Pricing;