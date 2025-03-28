import Image from 'next/image';
import { HeroProps } from '~/shared/types';
import CTA from '../common/CTA';

const Hero2 = ({ title, subtitle, tagline, callToAction, callToAction2, image }: HeroProps) => {
  return (
    <section className="mt-[-72px] bg-primary-50 dark:bg-slate-800" id="heroTwo">
      <div className="mx-auto max-w-7xl px-4 pt-[72px] sm:px-6 md:flex md:h-screen 2xl:h-auto">
        <div className="block py-12 text-center md:flex md:py-12 md:text-left lg:py-16">
          <div className="mx-auto flex max-w-5xl basis-[56%] items-center">
            <div className="max-w-3xl pb-12 pr-0 md:py-0 md:pr-8 md:pb-0 lg:pr-16">
              {tagline && (
                <p className="text-base font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-200">
                  {tagline}
                </p>
              )}
              {title && (
                <h1 className="leading-tighter font-heading mb-4 px-4 text-5xl font-bold tracking-tighter md:px-0 md:text-[3.48rem]">
                  {title}
                </h1>
              )}
              <div className="mx-auto max-w-3xl">
                {subtitle && typeof subtitle === "string" && (
                  <p className="mb-8 text-xl font-normal text-gray-600 dark:text-slate-400">
                    {subtitle.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                )}
                <div className="flex max-w-none flex-col flex-nowrap justify-center gap-4 sm:flex-row md:m-0 md:justify-start">
                  {callToAction && <CTA callToAction={callToAction} linkClass="btn btn-primary" />}
                  {callToAction2 && <CTA callToAction={callToAction2} linkClass="btn" />}
                </div>
              </div>
            </div>
          </div>
          <div className="block flex-1 items-center md:flex">
            <div className="relative m-auto h-full max-w-4xl object-cover">
              {image && (
          <div className="relative max-w-5xl">
                       <Image
                         className="mx-auto"
                         src={image.src}
                         alt={image.alt}
                         width={1024}
                         height={607}
                         loading="eager"
                         priority
                       />
                     </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
