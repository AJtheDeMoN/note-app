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
import { Plus } from 'lucide-react';
import NoteForm from '@/components/notes/NoteForm'; // Import the new component
import type { Note } from '@/types'; // Import the new type

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
    if (_hasHydrated && !isAuthenticated) {
      router.push('/signin');
    }
  }, [_hasHydrated, isAuthenticated, router]);

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
    enabled: _hasHydrated && isAuthenticated,
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
  if (!_hasHydrated) {
    return <div className="text-center pt-16">Loading session...</div>;
  }

  return (
  <div className='bg-[#FFFDD0]'>
    {/* --- Header --- */}
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-[#414a25]">My Notes</h1>
      {/* The old "Create a new note" button has been removed from here */}
    </div>

    {/* --- Loading and Error States --- */}
    {isLoading && <p className="mt-8 text-center">Loading notes...</p>}
    {isError && <p className="mt-8 text-center text-red-500">Failed to load notes.</p>}

    {/* --- Notes Grid --- */}
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {notes?.map((note) => (
        <NoteCard
          key={note.note_id}
          title={note.note_title}
          content={note.note_content}
          onEdit={() => handleOpenEditModal(note)}
          lastModified={note.last_update}  // <-- was note.last_modified
        />
      ))}
    </div>

    {/* --- Modal for Creating/Editing Notes --- */}
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
        onClose={() => setIsModalOpen(false)}
        // Pass the delete handler to the form
        onDelete={() => {
          if (currentNote) {
            handleDelete(currentNote.note_id);
            setIsModalOpen(false); // Close modal after initiating delete
          }
        }}
      />
    </Modal>

    {/* --- ADD THIS NEW CIRCULAR BUTTON --- */}
    <button
      onClick={handleOpenCreateModal}
      className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#414a25] text-white shadow-lg transition-colors hover:bg-[#5a6b3f] focus:outline-none focus:ring-2 focus:ring-[#5a6b3f] focus:ring-offset-2"
      aria-label="Create a new note"
    >
      <Plus size={28} />
    </button>
  </div>
);
}