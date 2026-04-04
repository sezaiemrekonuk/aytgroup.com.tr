/**
 * Project Service — Firestore CRUD for the `projects` collection.
 * Returns empty arrays / null when Firebase is unavailable or queries fail
 * (no bundled demo data).
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS, SEED_PROJECTS } from '../constants';

const projectsRef = () => collection(db, COLLECTIONS.PROJECTS);

// ─── Helpers ───────────────────────────────────────────────────────────────────
function isFirebaseConfigured() {
  return Boolean(process.env.REACT_APP_FIREBASE_PROJECT_ID);
}

/** Normalize a Firestore document snapshot to a plain JS object */
function fromDoc(snap) {
  return { id: snap.id, ...snap.data() };
}

// ─── Read Operations ───────────────────────────────────────────────────────────

/**
 * Get all projects, optionally filtered by status/category.
 * @param {{ status?: string, category?: string }} filters
 * @returns {Promise<Array>}
 */
export async function getProjects({ status, category } = {}) {
  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    let q = query(projectsRef(), orderBy('order', 'asc'));

    if (status && status !== 'all') {
      q = query(projectsRef(), where('status', '==', status), orderBy('order', 'asc'));
    }
    if (category && category !== 'all') {
      q = query(projectsRef(), where('category', '==', category), orderBy('order', 'asc'));
    }
    if (status && status !== 'all' && category && category !== 'all') {
      q = query(
        projectsRef(),
        where('status', '==', status),
        where('category', '==', category),
        orderBy('order', 'asc'),
      );
    }

    const snap = await getDocs(q);
    return snap.docs.map(fromDoc);
  } catch (err) {
    console.warn('[projectService] Firestore error:', err.message);
    return [];
  }
}

/**
 * Get featured projects for the home page.
 * @param {number} [count=3]
 * @returns {Promise<Array>}
 */
export async function getFeaturedProjects(count = 3) {
  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const q = query(
      projectsRef(),
      where('featured', '==', true),
      orderBy('order', 'asc'),
      limit(count),
    );
    const snap = await getDocs(q);
    return snap.docs.map(fromDoc);
  } catch (err) {
    console.warn('[projectService] Firestore error:', err.message);
    return [];
  }
}

/**
 * Get a single project by slug or document ID.
 * @param {string} slugOrId
 * @returns {Promise<Object|null>}
 */
export async function getProject(slugOrId) {
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    // Try by slug first
    const q = query(projectsRef(), where('slug', '==', slugOrId), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) return fromDoc(snap.docs[0]);

    // Fall back to document ID
    const docSnap = await getDoc(doc(db, COLLECTIONS.PROJECTS, slugOrId));
    return docSnap.exists() ? fromDoc(docSnap) : null;
  } catch (err) {
    console.warn('[projectService] Firestore error:', err.message);
    return null;
  }
}

// ─── Write Operations (admin / seed) ──────────────────────────────────────────

/**
 * Add a new project document.
 * @param {Object} data
 * @returns {Promise<string>} new document ID
 */
export async function addProject(data) {
  const ref = await addDoc(projectsRef(), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Update an existing project document.
 * @param {string} id
 * @param {Object} data
 */
export async function updateProject(id, data) {
  await updateDoc(doc(db, COLLECTIONS.PROJECTS, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a project document.
 * @param {string} id
 */
export async function deleteProject(id) {
  await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
}

/**
 * Seed Firestore with SEED_PROJECTS when that array is populated (dev/demo only).
 */
export async function seedProjects() {
  if (!SEED_PROJECTS.length) {
    console.info('[projectService] SEED_PROJECTS is empty — nothing to seed.');
    return;
  }
  for (const project of SEED_PROJECTS) {
    await addDoc(projectsRef(), {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.info('[projectService] ✅ Seed complete.');
}
