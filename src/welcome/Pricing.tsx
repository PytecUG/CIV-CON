import { Element } from "react-scroll";
import { useState } from "react";
import clsx from "clsx";
import CountUp from "react-countup";
import { plans } from "../constants/index.jsx";
import Button from "../components/_all/Button.jsx";
import { FaCheckCircle } from "react-icons/fa";

const Pricing = () => {
  const [monthly, setMonthly] = useState(false);

  return (
    <section id="pricing" className="py-24 px-6">
      <Element name="pricing">
        <div className="container">
          {/* Heading + Toggle */}
          <div className="max-w-4xl relative mx-auto border-l border-r border-border bg-card pb-40 pt-28 max-lg:border-none max-md:pb-32 max-md:pt-16 animate-fade-in">
            <h3 className="text-3xl font-bold max-w-lg mx-auto mb-14 text-center text-primary max-lg:text-2xl max-md:mb-11 max-sm:max-w-sm">
              Flexible pricing for every role
            </h3>

            {/* Toggle Monthly/Annual */}
            <div className="relative mx-auto flex w-[375px] rounded-md border border-border bg-card p-2 backdrop-blur-sm shadow-soft max-md:w-[310px]">
              <button
                className={clsx(
                  "flex-1 py-2 rounded-sm transition-colors",
                  monthly ? "text-primary font-semibold" : "text-muted-foreground"
                )}
                onClick={() => setMonthly(true)}
              >
                Monthly
              </button>
              <button
                className={clsx(
                  "flex-1 py-2 rounded-sm transition-colors",
                  !monthly ? "text-primary font-semibold" : "text-muted-foreground"
                )}
                onClick={() => setMonthly(false)}
              >
                Annual
              </button>

              {/* Sliding highlight */}
              <div
                className={clsx(
                  "absolute top-2 left-2 h-[calc(100%-16px)] w-[calc(50%-8px)] rounded-sm bg-primary/10 shadow-soft transition-transform duration-500",
                  !monthly && "translate-x-full"
                )}
              />
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="scroll-hide relative -mt-12 flex items-start max-xl:gap-5 max-xl:overflow-auto max-xl:pt-6">
            {plans.map((plan, index) => {
              const Icon = plan.icon;

              return (
                <div
                  key={plan.id}
                  className="relative border border-border bg-card/60 p-7 shadow-soft rounded-md transition hover:shadow-strong max-xl:min-w-80 xl:w-[calc(33.33%+2px)]"
                >
                  {/* Highlight Background for Middle Plan */}
                  {index === 1 && (
                    <div className="absolute inset-x-0 top-0 h-80 bg-gradient-subtle rounded-t-md" />
                  )}

                  {/* Icon */}
                  <div
                    className={clsx(
                      "absolute left-0 right-0 z-2 flex items-center justify-center",
                      index === 1 ? "-top-6" : "-top-6 xl:-top-11"
                    )}
                  >
                    <Icon
                      className={clsx(
                        "drop-shadow-lg",
                        index === 1 ? "text-accent size-[120px]" : "text-primary size-[88px]"
                      )}
                    />
                  </div>

                  {/* Title */}
                  <div
                    className={clsx(
                      "relative flex flex-col items-center",
                      index === 1 ? "pt-24" : "pt-12"
                    )}
                  >
                    <div
                      className={clsx(
                        "text-sm rounded-md relative z-2 mx-auto mb-6 border px-4 py-1.5 uppercase",
                        index === 1
                          ? "border-accent text-accent-foreground"
                          : "border-primary text-primary"
                      )}
                    >
                      {plan.title}
                    </div>

                    {/* Price */}
                    <div className="relative z-2 flex items-center justify-center">
                      <div
                        className={clsx(
                          "text-4xl font-bold",
                          index === 1 ? "text-accent-foreground" : "text-primary"
                        )}
                      >
                        {plan.priceMonthly === 0 ? (
                          "Free"
                        ) : (
                          <>
                            $<CountUp
                              start={plan.priceMonthly}
                              end={monthly ? plan.priceMonthly : plan.priceYearly}
                              duration={0.4}
                              useEasing={false}
                              preserveValue
                            />
                          </>
                        )}
                      </div>
                      {plan.priceMonthly !== 0 && (
                        <div className="text-sm relative top-3 ml-1 uppercase text-muted-foreground">
                          / mo
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Caption */}
                  <div
                    className={clsx(
                      "relative z-2 mb-10 w-full border-b pb-9 text-center text-foreground",
                      index === 1 && "border-border"
                    )}
                  >
                    {plan.caption}
                  </div>

                  {/* Features */}
                  <ul className="mx-auto space-y-4 xl:px-7">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="relative flex items-center gap-4 text-foreground"
                      >
                        <FaCheckCircle className="text-primary size-6" />
                        <p className="flex-1">{feature}</p>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="mt-10 flex w-full justify-center">
                    <Button
                      icon={Icon}
                      className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft"
                    >
                      Get Started
                    </Button>
                  </div>

                  {/* Limited Offer */}
                  {index === 1 && (
                    <p className="text-sm mt-9 text-center text-accent-foreground before:mx-2.5 before:content-['-'] after:mx-2.5 after:content-['-']">
                      Limited time offer
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Pricing;