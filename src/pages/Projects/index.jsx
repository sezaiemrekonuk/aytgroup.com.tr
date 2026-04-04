import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import SEO from '../../components/SEO';
import ProjectCard, { ProjectCardSkeleton } from '../../components/ui/ProjectCard';
import { useProjects } from '../../hooks/useProjects';
import { PROJECT_CATEGORIES } from '../../constants';

const STATUS_OPTIONS = ['all', 'completed', 'ongoing'];

export default function Projects() {
  const { t }                             = useTranslation();
  const [searchParams, setSearchParams]   = useSearchParams();

  // Read initial filter values from URL query params
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [status,   setStatus]   = useState(searchParams.get('status')   || 'all');

  const filters               = useMemo(() => ({ category, status }), [category, status]);
  const { projects, loading, error } = useProjects(filters);

  const updateFilter = (type, value) => {
    if (type === 'category') setCategory(value);
    if (type === 'status')   setStatus(value);

    const params = {};
    if (type === 'category' && value !== 'all') params.category = value;
    else if (category !== 'all' && type !== 'category') params.category = category;
    if (type === 'status' && value !== 'all') params.status = value;
    else if (status !== 'all' && type !== 'status') params.status = status;
    setSearchParams(params, { replace: true });
  };

  return (
    <>
      <SEO
        titleKey="seo.projects.title"
        descriptionKey="seo.projects.description"
        canonicalPath="/projelerimiz"
        keywords="Ankara inşaat projeleri, Çankaya konut, Söğütözü plaza, Sincan sanayi"
      />

      {/* ── Page Header ── */}
      <section className="bg-primary dark:bg-dark-bg py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint-grid-dark bg-grid-md opacity-50" aria-hidden />
        <div className="container-site relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-heading text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4">{t('projects.eyebrow')}</p>
            <h1 className="font-heading font-black text-4xl md:text-5xl text-white mb-4">
              {t('projects.title')}
            </h1>
            <p className="text-neutral-300 text-lg">{t('projects.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <section className="sticky top-[var(--header-height)] z-20 bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border-b border-neutral-200 dark:border-dark-border shadow-sm">
        <div className="container-site py-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {PROJECT_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => updateFilter('category', cat.key)}
                  className={clsx('filter-pill', category === cat.key && 'active')}
                >
                  {t(`projects.filter.${cat.key}`)}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-neutral-200 dark:bg-dark-border" />

            {/* Status filter */}
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateFilter('status', s)}
                  className={clsx('filter-pill', status === s && 'active')}
                >
                  {s === 'all' ? t('projects.filter.all') : t(`projects.status.${s}`)}
                </button>
              ))}
            </div>

            {/* Result count */}
            <span className="ml-auto text-xs text-neutral-400 dark:text-dark-muted">
              {loading ? '…' : t('projects.resultCount', { count: projects.length })}
            </span>
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="section-padding bg-neutral dark:bg-dark-bg">
        <div className="container-site">
          {error && <p className="text-center text-red-500 text-sm mb-6">{t('common.error')}</p>}

          {!loading && projects.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-neutral-400 py-20 text-lg"
            >
              {t('projects.noResults')}
            </motion.p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)
              : projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        </div>
      </section>
    </>
  );
}
