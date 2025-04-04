import Image from 'next/image';
import { HeroProps } from '~/shared/types';
import CTA from '../common/CTA';

const Hero = ({ title, subtitle, tagline, callToAction, callToAction2, image }: HeroProps) => {
  return (
    <section id="heroOne">
<div className="mt-4 sm:mt-20 mx-auto max-w-3xl px-4 sm:px-6">
          <div className="py-5 md:py-14">
          <div className="mx-auto max-w-4xl pb-10 text-center md:pb-16">
            {tagline && (
              <p className="text-base font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-200">
                {tagline}
              </p>
            )}
            {title && (
              <h1 className="leading-tighter font-heading mb-3 text-4xl font-bold tracking-tighter md:text-5xl lg:text-5xl">
                {title}
              </h1>
            )}
            <div className="mx-auto max-w-3xl">
              {subtitle && <p className="mb-6 text-xl font-normal text-gray-600 dark:text-slate-400">{subtitle}</p>}
              <div className="flex max-w-none flex-col flex-nowrap gap-4 px-4 sm:flex-row sm:justify-center">
                {callToAction && <CTA callToAction={callToAction} linkClass="btn btn-primary" />}
                {callToAction2 && <CTA callToAction={callToAction2} linkClass="btn" />}
              </div>
            </div>
          </div>
          {/* {image && (
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
          )} */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
