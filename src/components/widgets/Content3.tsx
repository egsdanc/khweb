import Image from 'next/image';

import { ContentProps } from '~/shared/types';
import Headline from '../common/Headline';
import WidgetWrapper from '../common/WidgetWrapper';
import GridCarousel from '../common/GridCarousel';

const Conten3 = ({
  header,
  content,
  items = [],
  image,
  isReversed,
  isAfterContent,
  id,
  hasBackground = false,
}: ContentProps) => (
  <WidgetWrapper
    id={id ? id : ''}
    hasBackground={hasBackground}
    containerClass={`${isAfterContent ? 'py-0 md:py-0 lg:py-0 pb-12 md:pb-16 lg:pb-20' : ''}`}
  >
    {header && <Headline header={header} titleClass="text-3xl sm:text-5xl" />}
    <div className="mx-auto w-full">
      <div className={`${isReversed ? 'md:flex-row-reverse' : ''} `}>
        <div className="self-center md:basis-1/2 w-full">
          {content && <div className="mb-8 lg:mb-12 text-lg text-gray-600 dark:text-slate-400">{content}</div>}
          <div className="w-full lg:pl-10">
            <GridCarousel
         items={items.map(item => ({
          ...item,
          icon: 'check',
          title: String(item.title ?? ''), // undefined, number, boolean -> string'e çevir
          description: Array.isArray(item.description)
            ? item.description.join(' ') // Eğer dizi ise birleştir
            : String(item.description ?? '') // undefined, number, boolean -> string'e çevir
        }))}
              defaultIcon="check"
              containerClass="gap-4 md:gap-y-6 w-full"
              panelClass="flex w-full max-w-none"
              titleClass="text-lg font-medium leading-6 text-gray-900 dark:text-white mt-1 mb-2"
              descriptionClass="mt-1 text-gray-600 dark:text-slate-400"
              iconClass="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-primary-900 text-gray-50 mr-4 rtl:mr-0 rtl:ml-4 mt-1 p-1"
            />
          </div>
        </div>
        <div aria-hidden="true" className="mt-10 md:mt-0 md:basis-1/2">
          {image && (
            <div className="relative m-auto max-w-4xl">
              <Image
                className="mx-auto w-full rounded-lg shadow-lg bg-gray-400 dark:bg-slate-700"
                src={image.src}
                width={828}
                height={828}
                alt={image.alt}
                sizes="(max-width: 768px) 100vw, 432px"
                placeholder="blur"
                quality={50}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  </WidgetWrapper>
);

export default Conten3;
