import { testimonials } from "../constants/index.js";
import TestimonialItem from "../components/_all/TestimonialItem.jsx";

const Testimonials = () => {
  const halfLength = Math.floor(testimonials.length / 2);

  return (
    <section
      id="testimonials"
      className="relative z-2 py-24 md:py-28 lg:py-40 bg-muted/30 border-t border-border"
    >
      <div className="container block lg:flex">
        {/* Heading */}
        <div className="relative z-2 mr-20 flex-300 max-lg:mb-10 animate-fade-in">
          <p className="text-sm uppercase text-accent-foreground mb-3 tracking-wide">
            Wall of Love
          </p>
          <h3 className="text-3xl font-bold text-primary max-md:text-xl">
            Words from our community
          </h3>
        </div>

        {/* Testimonials Grid */}
        <div className="relative -my-12 -mr-3 flex items-start max-lg:static max-md:block">
          {/* Left Column */}
          <div className="flex-50 space-y-6">
            {testimonials.slice(0, halfLength).map((testimonial) => (
              <TestimonialItem
                key={testimonial.id}
                item={testimonial}
                containerClassName="rounded-md border border-border bg-card/60 p-6 shadow-soft hover:shadow-elegant transition last:after:hidden last:after:max-md:block   animate-scale-in"
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="flex-50 space-y-6 md:px-12">
            {testimonials.slice(halfLength).map((testimonial) => (
              <TestimonialItem
                key={testimonial.id}
                item={testimonial}
                containerClassName="rounded-md border border-border bg-card/60 p-6 shadow-soft hover:shadow-elegant transition last:after:hidden after:right-auto after:left-0 after:max-md:-left-4 animate-scale-in"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;