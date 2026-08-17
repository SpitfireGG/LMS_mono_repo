import AnnouncementBar from "./components/AnnouncementBar";
import FloatingWidgets from "./components/FloatingWidgets";
import NavigationBar from "./components/NavigationBar";
import Header from "./components/Header";
import Logotypes from "./components/Logotypes";
import HeadingSubheading from "./components/HeadingSubheading";
import Services from "./components/Services";
import CourseListing from "./components/CourseListing";
import CTA from "./components/CTA";
import CaseStudies from "./components/CaseStudies";
import Process from "./components/Process";
import Team from "./components/Team";
import Testimonials from "./components/Testimonials";
import BlogListing from "./components/BlogListing";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default async function Home() {
  return (
    <>
      <AnnouncementBar />
      <div className="relative pt-[26px] max-sm:pt-[20px]">
        <NavigationBar />
        <Header className="mt-[70px] max-sm:mt-[40px]" />
        <Logotypes className="mt-[70px] max-sm:mt-[40px]" />
        <HeadingSubheading
          className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]"
          heading="Courses"
          subheading="From NAATI CCL and English exams to coding, design and business — we offer a range of courses to help you reach your goals."
        />
        <Services className="mt-[80px] max-lg:mt-[60px] max-sm:mt-[40px]" />
        <HeadingSubheading
          className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]"
          heading="Popular Courses"
          subheading="Hand-picked, outcome-focused programs taught by certified tutors. Filter by what you're chasing."
        />
        <CourseListing className="mt-[80px] max-lg:mt-[60px] max-sm:mt-[40px]" />
        <CTA className="mt-[100px] max-sm:mt-[40px]" />
        <HeadingSubheading
          className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]"
          heading="Success Stories"
          subheading="Explore Real-Life Examples of How Our Students Achieved Their Goals with NAATI EXCELLENCE ACADEMY"
        />
        <CaseStudies className="mt-[80px] max-lg:mt-[60px] max-sm:mt-[40px]" />
        <HeadingSubheading
          className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px] max-md:flex-col"
          heading="How It Works"
          subheading="Four simple steps from curious to credentialed"
          subheadingClassName="max-w-[292px]"
        />
        <Process className="mt-[80px] max-lg:mt-[60px] max-sm:mt-[40px]" />
        <HeadingSubheading
          className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]"
          heading="Expert Tutors"
          subheading="Meet the skilled and experienced team behind our successful courses"
          subheadingClassName="max-w-[473px]"
        />
        <Team className="mt-[80px] max-lg:mt-[60px] max-sm:mt-[40px]" />
        <HeadingSubheading
          className="mt-[100px] max-lg:mt-[80px] max-sm:mt-[60px]"
          heading="Testimonials"
          subheading="Hear from Our Satisfied Students: Read Their Testimonials to Learn More about Our Services"
          subheadingClassName="max-w-[473px]"
        />
        <Testimonials className="mt-[80px] max-lg:mt-[60px] max-sm:mt-[40px]" />
        <HeadingSubheading
          className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]"
          heading="Latest Guides & Tips"
          subheading="Stay updated with the latest study strategies, exam tips, and learning resources"
        />
        <BlogListing className="mt-[80px] max-lg:mt-[60px] max-sm:mt-[40px]" />
        <FAQ className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]" />
        <HeadingSubheading
          className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]"
          heading="Contact Us"
          subheading="Connect with Us: Let's Discuss Your Learning Needs"
          subheadingClassName="max-w-[323px]"
        />
        <Contact className="mt-[80px] max-lg:mt-[60px] max-sm:mt-[40px]" />
        <Footer className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]" />
        <FloatingWidgets />
      </div>
    </>
  );
}
