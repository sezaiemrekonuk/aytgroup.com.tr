/**
 * Review Service — Firestore CRUD for the `reviews` collection.
 * Reviews are client testimonials managed by admin and displayed
 * on the public site's Testimonials section.
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS } from '../constants';

const reviewsRef = () => collection(db, COLLECTIONS.REVIEWS);

function fromDoc(snap) {
  return { id: snap.id, ...snap.data() };
}

/** Get all reviews (admin use). */
export async function getReviews() {
  const q = query(reviewsRef(), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(fromDoc);
}

/** Get only approved reviews (public use with fallback). */
export async function getApprovedReviews() {
  try {
    const q = query(
      reviewsRef(),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map(fromDoc);
  } catch {
    return [];
  }
}

/**
 * Add a new review.
 * @param {{ name: string, role: string, content: string, rating: number, status: string }} data
 */
export async function addReview(data) {
  const ref = await addDoc(reviewsRef(), {
    name:      data.name.trim(),
    role:      data.role?.trim() ?? '',
    content:   data.content.trim(),
    rating:    Number(data.rating) || 5,
    status:    data.status ?? 'approved',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update a review (e.g., change status or edit content). */
export async function updateReview(id, data) {
  await updateDoc(doc(db, COLLECTIONS.REVIEWS, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a review. */
export async function deleteReview(id) {
  await deleteDoc(doc(db, COLLECTIONS.REVIEWS, id));
}
