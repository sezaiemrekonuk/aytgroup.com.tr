/**
 * Contact Admin Service — read/manage the `contacts` collection.
 * (Write operations come from contactService.js on the public site.)
 */

import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS } from '../constants';

function fromDoc(snap) {
  return { id: snap.id, ...snap.data() };
}

/** Fetch all contact submissions, newest first. */
export async function getContacts() {
  const q = query(
    collection(db, COLLECTIONS.CONTACTS),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(fromDoc);
}

/**
 * Change the status of a contact submission.
 * @param {string} id
 * @param {'new'|'read'|'replied'} status
 */
export async function updateContactStatus(id, status) {
  await updateDoc(doc(db, COLLECTIONS.CONTACTS, id), { status });
}

/** Delete a contact submission. */
export async function deleteContact(id) {
  await deleteDoc(doc(db, COLLECTIONS.CONTACTS, id));
}
