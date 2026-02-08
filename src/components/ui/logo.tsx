import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
  xl: 'w-16 h-16',
};

export function Logo({ size = 'sm', className = '' }: LogoProps) {
  const sizeClass = sizeMap[size];
  
  return (
    <div className={`${sizeClass} rounded-xl overflow-hidden ${className}`}>
      <Image
        src="/homevest-logo.jpeg"
        alt="Homevest Logo"
        width={64}
        height={64}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  );
}
