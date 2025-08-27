import Button from "../components/_all/Button.jsx";
import { details, features } from "../constants/index.jsx";

const Features = () => {
  return (
    <section id="features" className="py-24 px-6">
      <div className="container">
        <div className="relative flex md:flex-wrap flex-nowrap border border-border rounded-lg md:overflow-hidden max-md:flex-col feature-after bg-card shadow-soft max-md:border-none max-md:rounded-none max-md:gap-3">
          <div className="   items-center   m-2   ">
          {features.map(({ id, icon, caption, title, text, button }) => (
            <div
              key={id}
              className="relative bg-card shadow-soft border border-border rounded-lg z-2 md:px-10 px-5 md:pb-10 pb-5 flex-50 max-md:shadow-soft max-md:border max-md:border-border max-md:rounded-lg max-md:flex-320 animate-fade-in"
            >
              <div className="w-full flex justify-start items-start">
                <div className="-ml-3 mb-12 flex items-center justify-center flex-col">
                  <div className="w-0.5 h-16 bg-border" />
                  <img
                    src={"./images/img-2.png"}
                    className="size-28 object-contain"
                    alt={title}
                  />
                </div>
              </div>

              <p className="text-sm uppercase mb-5 max-md:mb-6 text-muted-foreground">
                {caption}
              </p>

              <h2 className="max-w-400 mb-7 text-2xl font-bold text-primary max-md:mb-6 max-md:text-xl">
                {title}
              </h2>

              <p className="mb-11 text-foreground max-md:mb-8 max-md:text-sm">
                {text}
              </p>

              <Button
                icon={button.icon}
                className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft"
              >
                {button.title}
              </Button>
            </div>
          ))}
          </div>

          <ul className="relative flex justify-around flex-grow px-[5%] border border-border rounded-lg max-md:hidden bg-card shadow-soft">
            <div className="absolute bg-border/20 top-[38%] left-0 right-0 w-full h-[1px] z-10" />

            {details.map(({ id, icon: Icon, title }) => (
              <li key={id} className="relative pt-16 px-4 pb-14">
                <div className="absolute top-8 bottom-0 left-1/2 bg-border/20 w-[1px] h-full z-10" />

                <div className="flex items-center justify-center mx-auto mb-3 border border-border rounded-full hover:border-primary transition-all duration-300 shadow-soft size-20">
                  {Icon && <Icon className="size-18 md:size-14 text-primary" />}
                </div>

                <h3 className="max-w-36 mx-auto my-0 text-sm uppercase text-center text-foreground">
                  {title}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Features;