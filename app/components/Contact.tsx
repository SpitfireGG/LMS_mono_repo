"use client";

import { cn } from "@/app/lib/utils";
import Button from "./Button";
import InputRadio from "./InputRadio";
import InputText from "./InputText";

/* Quiet orbit/star composition in the brand motif — replaces the broken SVG. */
function ContactDecoration() {
  return (
    <div className="relative h-full w-full" aria-hidden>
      <svg
        viewBox="0 0 340 560"
        fill="none"
        className="absolute right-[-90px] top-1/2 h-[520px] w-auto -translate-y-1/2 overflow-visible"
      >
        <ellipse cx="230" cy="280" rx="190" ry="72" stroke="#0a4a29" strokeOpacity="0.3" strokeWidth="1.6" transform="rotate(-18 230 280)" />
        <ellipse cx="232" cy="284" rx="156" ry="56" stroke="#0a4a29" strokeOpacity="0.18" strokeWidth="1.4" transform="rotate(-18 232 284)" />
        <path
          d="M230 140c5 33 22 50 55 55-33 5-50 22-55 55-5-33-22-50-55-55 33-5 50-22 55-55Z"
          fill="#0a4a29"
        />
        <path
          d="M150 330c3 20 13.5 30.5 33.5 33.5-20 3-30.5 13.5-33.5 33.5-3-20-13.5-30.5-33.5-33.5 20-3 30.5-13.5 33.5-33.5Z"
          fill="#056839"
          stroke="#0a4a29"
          strokeWidth="1.6"
        />
      </svg>
      <span className="orb-brand absolute right-[40px] top-[16%] block h-12 w-12 rounded-full" />
      <span className="orb-ink absolute bottom-[18%] right-[130px] block h-7 w-7 rounded-full" />
    </div>
  );
}

type ContactProps = {
  className?: string;
};

export default function Contact({ className }: ContactProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Form submission logic can be added here
  };

  return (
    <div
      className={cn(
        "flex items-center px-[100px] max-xl:px-[60px] max-sm:px-[30px] py-0 relative w-full max-w-[1440px] mx-auto scroll-mt-[40px]",
        className
      )}
      id="contact"
    >
      <div className="bg-[#e8f6ee] flex gap-[28px] pb-[80px] pt-[60px] max-xl:py-[50px] max-sm:py-[30px] pl-[100px] max-xl:pl-[60px] max-lg:px-[40px] max-sm:px-[30px] relative rounded-[45px] shrink-0 w-full overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[39px] w-full relative flex-1 z-10"
          id="contact-form"
          method="POST"
        >
          {/* Radio Buttons */}
          <div
            className="flex flex-wrap gap-x-[36px] gap-y-[20px] items-start leading-0 relative"
            data-name="Radio buttons"
          >
            <InputRadio
              name="formType"
              value="say-hi"
              label="Say Hi"
              dataName="Say hi"
              defaultChecked={true}
            />
            <InputRadio
              name="formType"
              value="get-quote"
              label="Get a Quote"
              dataName="Get a quote"
            />
          </div>

          {/* Form Fields */}
          <div
            className="flex flex-col gap-[26px] pt-[2px] relative"
            data-name="Fields"
          >
            <InputText
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              label="Name"
              placeholder="Name"
            />
            <InputText
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              label="Email*"
              placeholder="Email"
              required
            />
            <InputText
              id="message"
              name="message"
              type="textarea"
              label="Message*"
              placeholder="Message"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center py-[19px]"
            data-name="Button"
          >
            Send Message
          </Button>
        </form>

        {/* Decoration */}
        <div className="relative flex-1 max-lg:hidden" data-name="Illustration">
          <ContactDecoration />
        </div>
      </div>
    </div>
  );
}
