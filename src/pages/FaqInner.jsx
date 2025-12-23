// FAQ page with CMS integration
import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";
import FaqInnerhero from "../components/FaqInner_page_componets/FaqInnerhero";
import FaqInnersec2 from "../components/FaqInner_page_componets/FaqInnersec2";
import { usePublicCmsPage } from "../hooks/useCms";

const FaqInner = () => {
  const { data: cmsData } = usePublicCmsPage("faq");
  const content = cmsData?.content;

  return (
    <>
      <Header />
      <FaqInnerhero content={content?.hero} />
      <FaqInnersec2 content={content} />
      <Footer />
    </>
  );
};

export default FaqInner;
