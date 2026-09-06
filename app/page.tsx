import AnnouncementBar from "./components/AnnouncementBar";
import FloatingWidgets from "./components/FloatingWidgets";
import NavigationBar from "./components/NavigationBar";
import Header from "./components/Header";
import HeadingSubheading from "./components/HeadingSubheading";
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
import LanguageFlags from "./components/LanguageFlags";
import WhyChooseUs from "./components/WhyChooseUs";
import ExploreCTA from "./components/ExploreCTA";
import HomeClient from "./components/HomeClient";

export default async function Home() {
  return (
    <>
      <div className="relative">
        <div className="flex min-h-svh flex-col">
          <AnnouncementBar />
          <div className="pt-[26px] max-sm:pt-[20px]">
            <NavigationBar />
          </div>
          <Header className="flex-1" />
        </div>
        
        <LanguageFlags className="mt-[70px] max-lg:mt-[50px] max-sm:mt-[40px]" />
        
        <WhyChooseUs />
        
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
        
        <Process className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]" />
        
        <HeadingSubheading
          className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]"
          heading="Expert Tutors"
          subheading="Meet the skilled and experienced team behind our successful courses"
        />
        <Team className="mt-[80px] max-lg:mt-[60px] max-sm:mt-[40px]" />
        
        <Testimonials />
        
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
        />
        <Contact className="mt-[80px] max-lg:mt-[60px] max-sm:mt-[40px]" />
        
        <ExploreCTA className="mt-[140px] mb-[120px] max-lg:mt-[100px] max-lg:mb-[90px] max-sm:mt-[60px] max-sm:mb-[60px]" />
        
        <Footer className="mt-[0] max-lg:mt-[0] max-sm:mt-[0]" />
        <FloatingWidgets />
      </div>

      <HomeClient />
    </>
  );
}