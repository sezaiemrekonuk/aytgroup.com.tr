import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import { PageLoader } from './components/ui/LoadingSpinner';
import './i18n';

// ─── Public pages (lazy) ──────────────────────────────────────────────────────
const Home            = lazy(() => import('./pages/Home'));
const About           = lazy(() => import('./pages/Corporate/About'));
const Mission         = lazy(() => import('./pages/Corporate/Mission'));
const Certifications  = lazy(() => import('./pages/Corporate/Certifications'));
const Projects        = lazy(() => import('./pages/Projects'));
const ProjectDetail   = lazy(() => import('./pages/Projects/ProjectDetail'));
const Services        = lazy(() => import('./pages/Services'));
const Contact         = lazy(() => import('./pages/Contact'));
const NotFound        = lazy(() => import('./pages/NotFound'));

// ─── Admin pages (lazy) ───────────────────────────────────────────────────────
const AdminLogin      = lazy(() => import('./pages/Admin/Login'));
const AdminLayout     = lazy(() => import('./pages/Admin/layout/AdminLayout'));
const AdminDashboard  = lazy(() => import('./pages/Admin/Dashboard'));
const AdminProjects   = lazy(() => import('./pages/Admin/Projects'));
const ProjectForm     = lazy(() => import('./pages/Admin/Projects/ProjectForm'));
const AdminServices   = lazy(() => import('./pages/Admin/Services'));
const AdminContacts   = lazy(() => import('./pages/Admin/Contacts'));
const AdminReviews    = lazy(() => import('./pages/Admin/Reviews'));
const AdminSettings   = lazy(() => import('./pages/Admin/Settings'));

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ── Public site ── */}
                <Route element={<Layout />}>
                  <Route index element={<Home />} />

                  <Route path="kurumsal">
                    <Route path="hakkimizda"    element={<About />} />
                    <Route path="misyon-vizyon"  element={<Mission />} />
                    <Route path="belgelerimiz"   element={<Certifications />} />
                  </Route>

                  <Route path="projelerimiz">
                    <Route index        element={<Projects />} />
                    <Route path=":slug" element={<ProjectDetail />} />
                  </Route>

                  <Route path="hizmetler" element={<Services />} />
                  <Route path="iletisim"  element={<Contact />} />
                  <Route path="*"         element={<NotFound />} />
                </Route>

                {/* ── Admin ── */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index                element={<AdminDashboard />} />
                  <Route path="projects"      element={<AdminProjects />} />
                  <Route path="projects/new"  element={<ProjectForm />} />
                  <Route path="projects/:id"  element={<ProjectForm />} />
                  <Route path="services"      element={<AdminServices />} />
                  <Route path="contacts"      element={<AdminContacts />} />
                  <Route path="reviews"       element={<AdminReviews />} />
                  <Route path="settings"      element={<AdminSettings />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
