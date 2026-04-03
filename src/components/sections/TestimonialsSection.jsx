import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { TESTIMONIALS } from '../../constants';
import { getApprovedReviews } from '../../services/reviewService';
import SectionTitle from '../ui/SectionTitle';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Card for Firestore reviews (plain strings)
function FirestoreCard({ review }) {
  return (
    <div className="bg-white dark:bg-dark-card rounded p-8 shadow-card border border-neutral-100 dark:border-dark-border h-full flex flex-col">
      <StarRating rating={review.rating} />
      <blockquote className="flex-1 text-neutral-600 dark:text-dark-muted text-sm leading-relaxed italic mb-6">
        "{review.content}"
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/20 dark:bg-accent/30 flex items-center justify-center font-heading font-bold text-accent text-sm">
          {review.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-heading font-semibold text-sm text-primary dark:text-neutral-100">
            {review.name}
          </p>
          {review.role && <p className="text-xs text-neutral-400">{review.role}</p>}
        </div>
      </div>
    </div>
  );
}

// Card for static TESTIMONIALS (i18n keys)
function StaticCard({ testimonial }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-dark-card rounded p-8 shadow-card border border-neutral-100 dark:border-dark-border h-full flex flex-col">
      <StarRating rating={testimonial.rating} />
      <blockquote className="flex-1 text-neutral-600 dark:text-dark-muted text-sm leading-relaxed italic mb-6">
        "{t(testimonial.contentKey)}"
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/20 dark:bg-accent/30 flex items-center justify-center font-heading font-bold text-accent text-sm">
          {t(testimonial.nameKey).charAt(0)}
        </div>
        <div>
          <p className="font-heading font-semibold text-sm text-primary dark:text-neutral-100">
            {t(testimonial.nameKey)}
          </p>
          <p className="text-xs text-neutral-400">{t(testimonial.roleKey)}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const [firestoreReviews, setFirestoreReviews] = useState([]);

  useEffect(() => {
    getApprovedReviews().then(setFirestoreReviews).catch(() => {});
  }, []);

  // Use Firestore reviews if available, otherwise fall back to static constants
  const useFirestore = firestoreReviews.length > 0;

  return (
    <section className="section-padding bg-neutral dark:bg-dark-bg">
      <div className="container-site">
        <SectionTitle
          eyebrow="Referanslar"
          title={t('testimonials.title')}
          subtitle={t('testimonials.subtitle')}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640:  { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {useFirestore
              ? firestoreReviews.map((r) => (
                  <SwiperSlide key={r.id} className="h-auto">
                    <FirestoreCard review={r} />
                  </SwiperSlide>
                ))
              : TESTIMONIALS.map((testimonial) => (
                  <SwiperSlide key={testimonial.id} className="h-auto">
                    <StaticCard testimonial={testimonial} />
                  </SwiperSlide>
                ))
            }
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
