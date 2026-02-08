interface HeroSectionProps {
  headline: string;
  subheadline: string;
}

export function HeroSection({ headline, subheadline }: HeroSectionProps) {
  return (
    <section 
      className="py-16 md:py-24 px-6 md:px-12"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 
          id="hero-heading"
          className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900"
        >
          {headline}
        </h1>
        <p className="mt-6 text-lg md:text-xl font-normal text-neutral-700">
          {subheadline}
        </p>
      </div>
    </section>
  );
}
