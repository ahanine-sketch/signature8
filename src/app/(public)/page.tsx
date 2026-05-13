import { Hero } from "@/components/hero";
import { Philosophy } from "@/components/philosophy";
import { ProjectGrid } from "@/components/project-grid";
import { Materials } from "@/components/materials";
import { Stats } from "@/components/stats";
import { Services } from "@/components/services";
import { Testimonials } from "@/components/testimonials";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Philosophy />
      <Services />
      <ProjectGrid />
      <Materials />
      <Testimonials />
      <Contact />
    </>
  );
}
