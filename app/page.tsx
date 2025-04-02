import type { Metadata } from 'next';

import { SITE } from '~/config.js';

import Hero from '~/components/widgets/Hero';
import SocialProof from '../src/components/widgets/SocialProof';
import Features from '~/components/widgets/Features';
import Content from '~/components/widgets/Content';
import Steps from '~/components/widgets/Steps';
import Testimonials from '~/components/widgets/Testimonials';
import FAQs2 from '~/components/widgets/FAQs2';
import Pricing from '~/components/widgets/Pricing';
import Team from '~/components/widgets/Team';
import CallToAction2 from '~/components/widgets/CallToAction2';
import Contact from '~/components/widgets/Contact';
import Hero2 from '~/components/widgets/Hero2';
import kilometrehackerImg from '~/assets/images/kilometrehacker.png';
import Image from 'next/image';

import {
  callToAction2Home,
  contactHome,
  contentHomeOne,
  contentHomeTwo,
  faqs2Home,
  featuresHome,
  heroHome,
  pricingHome,
  socialProofHome,
  stepsHome,
  teamHome,
  testimonialsHome,
} from '~/shared/data/pages/home.data';
import Content3 from '~/components/widgets/Content3';
export const metadata: Metadata = {
  title: SITE.title,
};

export default function Page() {
  return (
    <>
<div className="flex flex-col sm:flex-row  items-center justify-center  w-full">
  <Hero {...heroHome} />
  
  <div className="relative max-w-5xl">
    <Image
      className="mx-auto"
      src={kilometrehackerImg}
      alt="kilometrehacker"
      width={600}
      height={300}
      loading="eager"
      priority
    />
  </div>
</div>


      {/* <SocialProof {...socialProofHome} /> */}
      <Steps {...stepsHome} />
      <Features {...featuresHome} />
      <Content3 {...contentHomeOne} />
      {/* <Content {...contentHomeOne} /> */}
      {/* <Content {...contentHomeTwo} /> */}
      <Testimonials {...testimonialsHome} />
      {/* <FAQs2 {...faqs2Home} /> */}
      <Pricing {...pricingHome} />
      {/* <Team {...teamHome} />
      <Contact {...contactHome} /> */}
      <CallToAction2 {...callToAction2Home} />
    </>
  );
}
