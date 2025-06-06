// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteItem.tsx
import React from 'react';

import { deleteNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteItemProps {
  note: Note;
  onEdit?: (note: Note) => void;
}
// TODO (DONE): delete eslint-disable-next-line when you implement the onEdit handler
const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit }) => {
  // TODO (DONE): manage state for deleting status and error message
  // TODO (DONE): create a function to handle the delete action, which will display a confirmation (window.confirm) and call the deleteNote function from noteService,
  // and update the deleting status and error message accordingly

  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setIsDeleting(true);
      setError(null);
      try {
        await deleteNote(note.id);
        setTimeout(() => {
          setIsDeleting(false);
        }, 100);
      } catch (err) {
        setIsDeleting(false);
        setError(err instanceof Error ? err.message : 'Failed to delete note');
        console.error(err);
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(note);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);

    // Format: "Jan 1, 2023, 3:45 PM"
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  // Calculate time ago for display
  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    let interval = Math.floor(seconds / 31536000); // years
    if (interval >= 1) {
      return `${interval} year${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 2592000); // months
    if (interval >= 1) {
      return `${interval} month${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 86400); // days
    if (interval >= 1) {
      return `${interval} day${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 3600); // hours
    if (interval >= 1) {
      return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 60); // minutes
    if (interval >= 1) {
      return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    }

    return 'just now';
  };
  // TODO (DONE): handle edit noteEdit action by calling the onEdit prop with the note object
  // TODO (DONE): handle delete note action by calling a deleteNote function from noteService
  // TODO (DONE): disable the delete button and edit button while deleting
  // TODO (DONE): show error message if there is an error deleting the note
  // TODO (DONE): only show the edit button when the onEdit prop is provided

  return (
    <div className="note-item">
      <div className="note-header">
        <h3>{note.title}</h3>
        <div className="note-actions">
          {onEdit && (
            <button className="edit-button" disabled={isDeleting} onClick={handleEdit}>
              Edit
            </button>
          )}
          <button className="delete-button" disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      <div className="note-content">{note.content}</div>
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      <div className="note-footer">
        <span title={formatDate(note.lastUpdated)}>
          Last updated: {getTimeAgo(note.lastUpdated)}
        </span>
      </div>
    </div>
  );
};

export default NoteItem;
