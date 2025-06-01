// REFERENCE SOLUTION - Do not distribute to students
// src/services/noteService.ts
// TODO (DONE): Import functions like setDoc, deleteDoc, onSnapshot from Firebase Firestore to interact with the database
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { DocumentData, QuerySnapshot, Unsubscribe } from 'firebase/firestore';

// TODO (DONE): Import the Firestore instance from your Firebase configuration file
import { db } from '../firebase-config';
import { Note, Notes } from '../types/Note';
// remove when you use the collection in the code
const NOTES_COLLECTION = 'notes';

/**
 * Creates or updates a note in Firestore
 * @param note Note object to save
 * @returns Promise that resolves when the note is saved
 */
// remove when you implement the function
export async function saveNote(note: Note): Promise<void> {
  // TODO (DONE): save the note to Firestore in the NOTES_COLLECTION collection
  // Use setDoc to create or update the note document; throw an error if it fails
  const noteId = note.id;

  const noteRef = doc(collection(db, NOTES_COLLECTION), noteId);

  try {
    await setDoc(noteRef, note);
    console.log(`Note with ID ${noteId} saved successfully.`);
  } catch (error) {
    throw new Error(`${error}`);
  }

  return Promise.resolve();
}

/**
 * Deletes a note from Firestore
 * @param noteId ID of the note to delete
 * @returns Promise that resolves when the note is deleted
 */
// remove when you implement the function
export async function deleteNote(noteId: string): Promise<void> {
  // TODO (DONE): delete the note from Firestore in the NOTES_COLLECTION collection
  // Use deleteDoc to remove the note document; throw an error if it fails

  const noteRef = doc(collection(db, NOTES_COLLECTION), noteId);
  try {
    await deleteDoc(noteRef);
    console.log(`Note with ID ${noteId} deleted successfully.`);
  } catch (error) {
    throw new Error(`${error}`);
  }
}

/**
 * Transforms a Firestore snapshot into a Notes object
 * @param snapshot Firestore query snapshot
 * @returns Notes object with note ID as keys
 */
export function transformSnapshot(snapshot: QuerySnapshot<DocumentData>): Notes {
  const notes: Notes = {};

  snapshot.docs.forEach((doc) => {
    const noteData = doc.data() as Note;
    notes[doc.id] = noteData;
  });

  return notes;
}

/**
 * Subscribes to changes in the notes collection
 * @param onNotesChange Callback function to be called when notes change
 * @param onError Optional error handler for testing
 * @returns Unsubscribe function to stop listening for changes
 */

export function subscribeToNotes(
  onNotesChange: (notes: Notes) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  // TODO (DONE): subscribe to the notes collection in Firestore
  // Use onSnapshot to listen for changes; call onNotesChange with the transformed notes
  // Handle errors by calling onError if provided
  // Return s proper (not empty) unsubscribe function to stop listening for changes
  const notesCollectionRef = collection(db, NOTES_COLLECTION);
  const unsubscribe = onSnapshot(
    notesCollectionRef,
    (snapshot) => {
      const notes = transformSnapshot(snapshot);
      onNotesChange(notes);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error('Error fetching notes:', error);
      }
    },
  );
  return () => {
    unsubscribe();
  };
}
