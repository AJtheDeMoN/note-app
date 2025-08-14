// src/components/notes/NoteForm.tsx
'use client';

import { useState } from 'react';
import type { Note } from '@/types';
import Button from '@/components/ui/Button';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the RichTextEditor with SSR turned off
const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="p-3">Loading Editor...</div>,
});

interface NoteFormProps {
  note: Note | null;
  isLoading: boolean;
  onSave: (data: { note_title: string; note_content: string }) => void;
  onClose: () => void;
  onDelete: () => void;
}

export default function NoteForm({
  note,
  isLoading,
  onSave,
  onClose,
  onDelete,
}: NoteFormProps) {
  const isEditMode = !!note;

  const [title, setTitle] = useState(isEditMode ? '' : '');
  const [content, setContent] = useState(note?.note_content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const titleToSave = isEditMode ? note.note_title : title;

    if (!titleToSave.trim()) {
      alert('Title cannot be empty.');
      return;
    }
    onSave({ note_title: titleToSave, note_content: content });
  };

  return (
    // --- RESPONSIVE CHANGES HERE ---
    // On mobile (default): max-width is smaller (sm).
    // On small screens and up (sm:): max-width is larger (lg).
    <div className="relative w-full max-w-sm rounded-lg border border-[#d4b28c] bg-[#f8f5e4] shadow-xl sm:max-w-lg">
      {/* Header Section */}
      <div className="flex items-center justify-between rounded-t-lg bg-[#f4c198] px-4 py-3">
        {isEditMode ? (
          <h2 className="text-lg font-semibold text-gray-800">{note.note_title}</h2>
        ) : (
          <input
            id="note_title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            disabled={isLoading}
          />
        )}
        <button
          onClick={onClose}
          className="ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
        >
          <X size={14} />
        </button>
      </div>

      <hr className="m-0 border-t-2 border-red-400" />

      {/* Form for content and buttons */}
      <form onSubmit={handleSubmit} className="relative p-4">
        <RichTextEditor
          content={content}
          onChange={(newContent) => setContent(newContent)}
          disabled={isLoading}
        />

        {/* Fixed button at bottom right */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button
            type="submit"
            className="h-10 w-24 bg-green-500 text-sm font-medium text-white hover:bg-green-600"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
          {isEditMode && (
            <Button
              type="button"
              onClick={onDelete}
              className="h-10 w-24 bg-red-500 text-sm font-medium text-white hover:bg-red-600"
              disabled={isLoading}
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}