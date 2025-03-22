import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { CallToActionType, LinkOrButton } from '~/shared/types';

// Update the LinkOrButton interface to include onClick
interface ExtendedLinkOrButton extends LinkOrButton {
  onClick?: () => void;
}

const CTA = ({ callToAction, containerClass, linkClass, iconClass, onClick }: ExtendedLinkOrButton) => {
  const { text, href, icon: Icon, targetBlank } = callToAction as CallToActionType;

  const handleClick = () => {
    // Execute the onClick function if provided, but don't prevent default navigation
    if (onClick) {
      onClick();
    }
    // Let the link navigation happen naturally without preventing it
  };

  return (
    <>
      {href && (text || Icon) && (
        <div className={twMerge('flex w-auto cursor-pointer', containerClass)}>
          {targetBlank ? (
            <Link
              className={twMerge('inline-flex items-center justify-center w-full sm:mb-0', linkClass)}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClick ? handleClick : undefined}
            >
              {Icon && <Icon className={twMerge(`w-5 h-5 ${text ? 'mr-1 rtl:mr-0 rtl:ml-1' : ''}`, iconClass)} />}
              {text}
            </Link>
          ) : (
            <Link 
              className={twMerge('inline-flex items-center justify-center w-full sm:mb-0 ', linkClass)} 
              href={href}
              onClick={onClick ? handleClick : undefined}
            >
              {Icon && <Icon className={twMerge(`w-5 h-5 ${text ? 'mr-1 rtl:mr-0 rtl:ml-1' : ''}`, iconClass)} />}
              {text}
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default CTA;