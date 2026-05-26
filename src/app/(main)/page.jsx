import CTASection from "@/components/pages/home/CTASection";
import ContactSection from "@/components/pages/home/ContactSection";
import CoursesSection from "@/components/pages/home/CoursesSection";
import FeaturesSection from "@/components/pages/home/FeaturesSection";
import GalleryPreview from "@/components/pages/home/GalleryPreview";
import HeroSection from "@/components/pages/home/HeroSection";
import NoticeBoard from "@/components/pages/home/NoticeBoard";
import StatsSection from "@/components/pages/home/StatsSection";
import TeachersSection from "@/components/pages/home/TeachersSection";
import TestimonialsSection from "@/components/pages/home/TestimonialsSection";

const MainHomePage = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CoursesSection />
      <TeachersSection />
      <NoticeBoard />
      <TestimonialsSection />
      <GalleryPreview />
      <CTASection />
      <ContactSection />
    </div>
  );
};

export default MainHomePage;
