// src/components/ui/NoteCard.tsx
import { FilePenLine, Trash2 } from 'lucide-react';

type NoteCardProps = {
  title: string;
  content: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function NoteCard({ title, content, onEdit, onDelete }: NoteCardProps) {
  return (
    <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 flex-grow text-sm text-gray-600 line-clamp-3">
        {content}
      </p>
      <div className="mt-4 flex justify-end space-x-3 border-t pt-4">
        <button onClick={onEdit} className="text-gray-400 hover:text-indigo-600">
          <FilePenLine size={20} />
        </button>
        <button onClick={onDelete} className="text-gray-400 hover:text-red-600">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}