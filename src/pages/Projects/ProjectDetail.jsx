import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import SEO from '../../components/SEO';
import { StatusBadge, CategoryBadge } from '../../components/ui/Badge';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import CTABanner from '../../components/sections/CTABanner';
import { useProject } from '../../hooks/useProjects';
import { PROGRESS_STAGES } from '../../constants';

export default function ProjectDetail() {
  const { slug }                    = useParams();
  const { t, i18n }                 = useTranslation();
  const lang                        = i18n.language;
  const { project, loading, notFound } = useProject(slug);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (loading) return <PageLoader />;

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-neutral dark:bg-dark-bg">
        <h1 className="font-heading font-black text-3xl text-primary dark:text-neutral-100">
          {t('notFound.title')}
        </h1>
        <p className="text-neutral-500">{t('notFound.subtitle')}</p>
        <Link to="/projelerimiz" className="btn-accent mt-4">{t('common.backToProjects')}</Link>
      </div>
    );
  }

  const title       = project.title?.[lang]    || project.title?.tr    || '';
  const description = project.description?.[lang] || project.description?.tr || '';
  const location    = project.location?.[lang] || project.location?.tr || '';
  const gallery     = project.gallery?.length ? project.gallery : [project.heroImage].filter(Boolean);

  const seoKeywords = `${location} ${project.category === 'residential' ? 'konut projesi' : project.category === 'commercial' ? 'ticari yapı' : 'endüstriyel tesis'}, AYT Group`;

  return (
    <>
      <SEO
        title={`${title} – AYT Group`}
        description={description.slice(0, 160)}
        canonicalPath={`/projelerimiz/${slug}`}
        keywords={seoKeywords}
      />

      {/* ── Hero Image ── */}
      <div className="relative h-72 md:h-96 bg-primary dark:bg-dark-bg overflow-hidden">
        <img
          src={project.heroImage}
          alt={title}
          className="w-full h-full object-cover opacity-60"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-site pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-wrap gap-2 mb-3">
              <StatusBadge status={project.status} />
              <CategoryBadge category={project.category} />
            </div>
            <h1 className="font-heading font-black text-3xl md:text-4xl text-white">{title}</h1>
            <p className="text-neutral-300 mt-1 flex items-center gap-1">
              <LocationIcon /> {location}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div className="bg-white dark:bg-dark-card border-b border-neutral-100 dark:border-dark-border">
        <div className="container-site py-3 text-xs text-neutral-400 flex items-center gap-2">
          <Link to="/" className="hover:text-accent">{t('nav.home')}</Link>
          <span>›</span>
          <Link to="/projelerimiz" className="hover:text-accent">{t('nav.projects')}</Link>
          <span>›</span>
          <span className="text-neutral-600 dark:text-neutral-300 truncate">{title}</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <section className="section-padding bg-neutral dark:bg-dark-bg">
        <div className="container-site">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Left: gallery + description */}
            <div className="lg:col-span-2 space-y-10">

              {/* Gallery */}
              {gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="font-heading font-bold text-xl text-primary dark:text-neutral-100 mb-4">
                    {t('projects.detail.gallery')}
                  </h2>
                  <Swiper
                    modules={[Navigation, Pagination, Thumbs]}
                    navigation
                    pagination={{ clickable: true }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    spaceBetween={0}
                    className="rounded overflow-hidden mb-3"
                  >
                    {gallery.map((img, i) => (
                      <SwiperSlide key={i}>
                        <div className="aspect-video bg-neutral-200 dark:bg-dark-card">
                          <img src={img} alt={`${title} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {gallery.length > 1 && (
                    <Swiper
                      modules={[Thumbs]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={8}
                      slidesPerView={Math.min(gallery.length, 4)}
                      watchSlidesProgress
                      className="thumbs-swiper"
                    >
                      {gallery.map((img, i) => (
                        <SwiperSlide key={i}>
                          <div className="aspect-video rounded overflow-hidden cursor-pointer opacity-60 [.swiper-slide-thumb-active_&]:opacity-100 border-2 border-transparent [.swiper-slide-thumb-active_&]:border-accent transition-all">
                            <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </motion.div>
              )}

              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="font-heading font-bold text-xl text-primary dark:text-neutral-100 mb-4">
                  {t('projects.detail.overview')}
                </h2>
                <p className="text-neutral-600 dark:text-dark-muted leading-relaxed">{description}</p>
              </motion.div>

              {/* Progress timeline (ongoing only) */}
              {project.status === 'ongoing' && project.progress && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="font-heading font-bold text-xl text-primary dark:text-neutral-100 mb-6">
                    {t('projects.detail.timeline')}
                  </h2>
                  <div className="space-y-5">
                    {PROGRESS_STAGES.map((stage) => {
                      const pct = project.progress?.[stage] ?? 0;
                      return (
                        <div key={stage}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-heading font-semibold text-primary dark:text-neutral-200">
                              {t(`projects.detail.progress.${stage}`)}
                            </span>
                            <span className="text-accent font-bold">{pct}%</span>
                          </div>
                          <div className="h-2 bg-neutral-200 dark:bg-dark-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                              className="h-full bg-accent rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right sidebar: At a Glance */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="space-y-6"
            >
              <div className="card-base p-6">
                <h3 className="font-heading font-bold text-lg text-primary dark:text-neutral-100 mb-6 pb-3 border-b border-neutral-100 dark:border-dark-border">
                  {t('projects.detail.atGlance')}
                </h3>
                <dl className="space-y-4">
                  <StatRow label={t('projects.detail.status')}>
                    <StatusBadge status={project.status} />
                  </StatRow>
                  <StatRow label={t('projects.detail.category')}>
                    <CategoryBadge category={project.category} />
                  </StatRow>
                  {project.sqm && (
                    <StatRow label={t('projects.detail.sqm')}>
                      <span className="font-semibold text-primary dark:text-neutral-100">
                        {project.sqm.toLocaleString()} m²
                      </span>
                    </StatRow>
                  )}
                  {project.units && (
                    <StatRow label={t('projects.detail.units')}>
                      <span className="font-semibold text-primary dark:text-neutral-100">{project.units}</span>
                    </StatRow>
                  )}
                  {project.completionDate && (
                    <StatRow label={t('projects.detail.completionDate')}>
                      <span className="font-semibold text-primary dark:text-neutral-100">{project.completionDate}</span>
                    </StatRow>
                  )}
                  {project.startDate && (
                    <StatRow label={t('projects.detail.startDate')}>
                      <span className="font-semibold text-primary dark:text-neutral-100">{project.startDate}</span>
                    </StatRow>
                  )}
                  <StatRow label={t('projects.detail.location')}>
                    <span className="font-semibold text-primary dark:text-neutral-100">{location}</span>
                  </StatRow>
                </dl>

                {/* Download brochure — link to a real PDF in Firebase Storage */}
                {project.brochureUrl && (
                  <a
                    href={project.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full justify-center mt-6 text-xs"
                  >
                    <DownloadIcon /> {t('projects.detail.downloadBrochure')}
                  </a>
                )}
              </div>

              {/* Back to projects */}
              <Link to="/projelerimiz" className="btn-ghost w-full justify-center text-sm">
                ← {t('common.backToProjects')}
              </Link>
            </motion.aside>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

function StatRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-xs text-neutral-400 dark:text-dark-muted uppercase tracking-wide font-heading font-semibold shrink-0">
        {label}
      </dt>
      <dd className="text-right text-sm">{children}</dd>
    </div>
  );
}

function LocationIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}
