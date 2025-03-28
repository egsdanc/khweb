import Link from 'next/link';
import { TestimonialsProps } from '~/shared/types';
import Headline from '../common/Headline';
import WidgetWrapper from '../common/WidgetWrapper';
import CTA from '../common/CTA';

// ItemTestimonial bileşenini kendi içimizde güncelliyoruz
interface ItemTestimonialProps {
  name: string;
  job?: string;
  testimonial: string;
  isTestimonialUp?: boolean;
  hasDividerLine?: boolean;
  image?: {
    src: string;
    alt?: string;
  };
  containerClass?: string;
  panelClass?: string;
  nameJobClass?: string;
  jobClass?: string;
  imageClass?: string;
}

const ItemTestimonial: React.FC<ItemTestimonialProps> = ({
  name,
  job,
  testimonial,
  isTestimonialUp,
  hasDividerLine,
  image,
  containerClass,
  panelClass,
  nameJobClass,
  jobClass,
  imageClass,
}) => {
  const formatTestimonial = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim() !== '');

    return (
      <div className="w-full">
        {lines.map((line, index) => (
          <div key={index}>
            {index > 0 && <hr className="my-2 border-gray-200" />}
            <p className="mb-2">{line.trim()}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${containerClass || ''}`}>
      <div className={`flex flex-col ${panelClass || ''}`}>
        {!isTestimonialUp && image && (
          <div className="flex items-center mb-4">
            {image && (
              <div className="flex-shrink-0">
                <img
                  src={image.src}
                  alt={image.alt || 'Testimonial'}
                  className={imageClass}
                />
              </div>
            )}
            <div className={nameJobClass}>
              <h3 className="text-base font-medium">{name}</h3>
              {job && <p className={`${jobClass || ''}`}>{job}</p>}
            </div>
          </div>
        )}

        <div className="flex-grow">{formatTestimonial(testimonial)}</div>

        {isTestimonialUp && image && (
          <div className="flex items-center mt-4">
            {image && (
              <div className="flex-shrink-0">
                <img
                  src={image.src}
                  alt={image.alt || 'Testimonial'}
                  className={imageClass}
                />
              </div>
            )}
            <div className={nameJobClass}>
              <h3 className="text-base font-medium">{name}</h3>
              {job && <p className={`${jobClass || ''}`}>{job}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const Testimonials = ({
  header,
  testimonials,
  callToAction,
  isTestimonialUp,
  id,
  hasBackground = false,
}: TestimonialsProps) => (
  <WidgetWrapper id={id ? id : ''} hasBackground={hasBackground} containerClass="">
    {header && <Headline header={header} titleClass="text-2xl sm:text-3xl" />}
    <div className="flex items-stretch justify-center">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {testimonials.map(
  ({ name = '', job, testimonial, image = {}, href }, index) =>
    testimonial && (
      <div
        key={`item-testimonial-${index}`}
        className={`card max-w-sm h-full ${
          !callToAction && href
            ? 'hover:border-primary-600 hover:shadow-lg hover:transition hover:duration-100'
            : ''
        }`}
      >
        {!callToAction && href ? (
          // <Link href={href} target="_blank" rel="noopener noreferrer">
            <ItemTestimonial
              name={name || 'Anonim Kullanıcı'}
              job={job}
              testimonial={testimonial}
              isTestimonialUp={isTestimonialUp}
              hasDividerLine={true}
              image={
                typeof image === 'string'
                  ? { src: image }
                  : image && 'src' in image
                  ? { src: String(image.src) } // Ensure src is a string
                  : undefined
              }              containerClass="h-full"
              panelClass="justify-between items-stretch w-full h-full"
              nameJobClass="text-left rtl:text-right"
              jobClass="text-sm"
              imageClass="mr-4 rtl:mr-0 rtl:ml-4 h-10 w-10 rounded-full"
            />
          //  </Link> 
        ) : (
          <ItemTestimonial
            name={name || 'Anonim Kullanıcı'}
            job={job}
            testimonial={testimonial}
            isTestimonialUp={isTestimonialUp}
            hasDividerLine={true}
            image={
              typeof image === 'string'
                ? { src: image }
                : image && 'src' in image
                ? { src: String(image.src) } // Ensure src is a string
                : undefined
            }            containerClass="h-full"
            panelClass="justify-between items-stretch w-full h-full"
            nameJobClass="text-left rtl:text-right"
            jobClass="text-sm"
            imageClass="mr-4 rtl:mr-0 rtl:ml-4 h-10 w-10 rounded-full"
          />
        )}
      </div>
    ),
)}




      </div>
    </div>
    {callToAction && (
      <CTA
        callToAction={callToAction}
        containerClass="flex justify-center mx-auto w-fit mt-8 md:mt-12"
        linkClass="btn"
      />
    )}
  </WidgetWrapper>
);

export default Testimonials;