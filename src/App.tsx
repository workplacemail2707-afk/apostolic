import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SiteLayout } from '@/src/components/layout/SiteLayout';
import { HomePage } from '@/src/pages/HomePage';
import { AboutPage } from '@/src/pages/AboutPage';
import { AcademicsPage } from '@/src/pages/AcademicsPage';
import { AdmissionsPage } from '@/src/pages/AdmissionsPage';
import { SchoolLifePage } from '@/src/pages/SchoolLifePage';
import { GalleryPage } from '@/src/pages/GalleryPage';
import { NewsPage } from '@/src/pages/NewsPage';
import { NewsPostPage } from '@/src/pages/NewsPostPage';
import { PublicationsPage } from '@/src/pages/PublicationsPage';
import { ContactPage } from '@/src/pages/ContactPage';
import { AdminPage } from '@/src/pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="*"
          element={
            <SiteLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/academics" element={<AcademicsPage />} />
                <Route path="/admissions" element={<AdmissionsPage />} />
                <Route path="/school-life" element={<SchoolLifePage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsPostPage />} />
                <Route path="/publications" element={<PublicationsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </SiteLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
