// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import NoteCard from '@/components/ui/NoteCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { Plus } from 'lucide-react';

// Type definition for a single note
type Note = {
  note_id: string;
  note_title: string;
  note_content: string;
};

// Main Page Component
export default function HomePage() {
  // --- State and Hooks ---
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  // --- Route Protection ---
  useEffect(() => {
    // A timeout helps prevent a flicker effect on page load while auth state is hydrating
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/signin');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  // --- Data Fetching (React Query) ---
  const {
    data: notes,
    isLoading,
    isError,
  } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await axiosInstance.get('/notes/');
      return response.data;
    },
    enabled: isAuthenticated, // Only fetch data if the user is logged in
  });

  // --- Data Mutations (React Query) with Error Handling ---
  const createMutation = useMutation({
    mutationFn: (newNote: { note_title: string; note_content: string }) =>
      axiosInstance.post('/notes/', newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
      alert('Error: Could not create the note. Please check the console for details.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedNote: { note_id: string; note_title: string; note_content: string }) =>
      axiosInstance.put(`/notes/${updatedNote.note_id}`, {
        note_title: updatedNote.note_title,
        note_content: updatedNote.note_content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error('Failed to update note:', error);
      alert('Error: Could not update the note. Please check the console for details.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (noteId: string) => axiosInstance.delete(`/notes/${noteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Failed to delete note:', error);
      alert('Error: Could not delete the note. Please check the console for details.');
    },
  });

  // --- Event Handlers ---
  const handleOpenCreateModal = () => {
    setCurrentNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const handleDelete = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate(noteId);
    }
  };

  // --- Render Logic ---
  // Show a loading indicator while checking auth state to prevent UI flicker

  if (!_hasHydrated) {
    return <div className="text-center pt-16">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <div className="text-center pt-16">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Button onClick={handleOpenCreateModal} className="w-auto">
          <Plus size={20} className="mr-2 inline" />
          Create a new note
        </Button>
      </div>

      {isLoading && <p className="mt-8 text-center">Loading notes...</p>}
      {isError && <p className="mt-8 text-center text-red-500">Failed to load notes.</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes?.map((note) => (
          <NoteCard
            key={note.note_id}
            title={note.note_title}
            content={note.note_content}
            onEdit={() => handleOpenEditModal(note)}
            onDelete={() => handleDelete(note.note_id)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentNote ? 'Edit Note' : 'Create Note'}
      >
        <NoteForm
          note={currentNote}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSave={(data) => {
            if (currentNote) {
              updateMutation.mutate({ ...data, note_id: currentNote.note_id });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

// --- Sub-component for the form inside the modal ---
function NoteForm({
  note,
  onSave,
  onCancel,
  isLoading,
}: {
  note: Note | null;
  onSave: (data: { note_title: string; note_content: string }) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState(note?.note_title || '');
  const [content, setContent] = useState(note?.note_content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title cannot be empty.');
      return;
    }
    onSave({ note_title: title, note_content: content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        id="note_title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={isLoading}
      />
      <div>
        <label htmlFor="note_content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="note_content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          className="w-auto bg-gray-200 text-gray-800 hover:bg-gray-300"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" className="w-auto" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}