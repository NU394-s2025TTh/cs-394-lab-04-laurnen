// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteEditor.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// TODO (DONE): Import the saveNote function from your noteService call this to save the note to firebase
import { saveNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteEditorProps {
  initialNote?: Note;
  onSave?: (note: Note) => void;
}
// remove the eslint disable when you implement on save
const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave }) => {
  // State for the current note being edited
  // remove the eslint disable when you implement the state
  const [note, setNote] = useState<Note>(() => {
    return (
      initialNote || {
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      }
    );
  });

  // TODO (DONE): create state for saving status
  const [isSaving, setIsSaving] = useState(false);
  // TODO (DONE): createState for error handling
  const [error, setError] = useState<string | null>(null);

  // TODO: Update local state when initialNote changes in a useEffect (if editing an existing note)
  // This effect runs when the component mounts or when initialNote changes
  // It sets the note state to the initialNote if provided, or resets to a new empty note, with a unique ID
  React.useEffect(() => {
    if (initialNote) {
      setNote(initialNote);
    } else {
      setNote({
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      });
    }
  }, [initialNote]);

  //TODO (DONE): on form submit create a "handleSubmit" function that saves the note to Firebase and calls the onSave callback if provided
  // This function should also handle any errors that occur during saving and update the error state accordingly
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!note.title || !note.content) {
      setError('Title and content are required.');
      setIsSaving(false);
      return;
    }

    try {
      // call the saveNote function to save the note
      await saveNote(note);

      if (onSave) {
        onSave(note);
      }

      // reset note state after saving
      setNote({
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      });
    } catch (err) {
      // Handle any errors
      setError(`${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // TODO: for each form field; add a change handler that updates the note state with the new value from the form
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
      lastUpdated: Date.now(), // Update lastUpdated timestamp on change
    }));
  };
  // TODO (DONE): disable fields and the save button while saving is happening
  // TODO (DONE): for the save button, show "Saving..." while saving is happening and "Save Note" when not saving

  // TODO (DONE): show an error message if there is an error saving the note
  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <form className="note-editor">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={note.title}
          required
          placeholder="Enter note title"
          onChange={handleChange}
          disabled={isSaving}
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={note.content}
          rows={5}
          required
          placeholder="Enter note content"
          onChange={handleChange}
          disabled={isSaving}
        />
      </div>
      <div className="form-actions">
        {isSaving ? (
          <button type="button" disabled>
            Saving...
          </button>
        ) : (
          <button type="submit" onClick={handleSubmit}>
            {initialNote ? 'Update Note' : 'Save Note'}
          </button>
        )}
      </div>
    </form>
  );
};

export default NoteEditor;
