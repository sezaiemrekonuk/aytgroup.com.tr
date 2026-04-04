import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SectionTitle from '../ui/SectionTitle';
import ProjectCard, { ProjectCardSkeleton } from '../ui/ProjectCard';
import { useFeaturedProjects } from '../../hooks/useProjects';

export default function FeaturedProjects() {
  const { t }                          = useTranslation();
  const { projects, loading, error }   = useFeaturedProjects(3);

  return (
    <section className="section-padding bg-neutral dark:bg-dark-bg">
      <div className="container-site">
        <SectionTitle
          eyebrow={t('projects.eyebrow')}
          title={t('featuredProjects.title')}
          subtitle={t('featuredProjects.subtitle')}
        />

        {error && (
          <p className="text-center text-sm text-red-500 mb-6">{t('common.error')}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
            : projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>

        <div className="mt-12 text-center">
          <Link to="/projelerimiz" className="btn-outline">
            {t('featuredProjects.viewAll')}
            <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
