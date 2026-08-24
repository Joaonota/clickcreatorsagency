import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { ServicesPage } from "./pages/Services";
import { ServiceDetails } from "./pages/ServiceDetails";
import { PortfolioPage } from "./pages/Portfolio";
import { ProjectDetails } from "./pages/ProjectDetails";
import { CreatorsPage } from "./pages/Creators";
import { CreatorDetails } from "./pages/CreatorDetails";
import { PartnersPage } from "./pages/Partners";
import { BlogPage } from "./pages/Blog";
import { BlogDetails } from "./pages/BlogDetails";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="sobre" element={<About />} />
            <Route path="servicos" element={<ServicesPage />} />
            <Route path="servicos/:slug" element={<ServiceDetails />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="portfolio/:slug" element={<ProjectDetails />} />
            <Route path="creators" element={<CreatorsPage />} />
            <Route path="creators/:slug" element={<CreatorDetails />} />
            <Route path="partners" element={<PartnersPage />} />
            <Route path="parceiros" element={<PartnersPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogDetails />} />
            <Route path="contactos" element={<Contact />} />
            <Route path="contato" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
