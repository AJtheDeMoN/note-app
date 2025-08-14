// src/components/ui/NoteCard.tsx
import { Settings } from 'lucide-react';

type NoteCardProps = {
  title: string;
  content: string; // HTML string
  lastModified: string; // ISO string
  onEdit: () => void;
};

export default function NoteCard({
  title,
  content,
  lastModified,
  onEdit,
}: NoteCardProps) {
  const formattedDate = new Date(lastModified).toLocaleString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="max-w-sm rounded-lg border border-[#d4b28c] bg-white shadow-md overflow-hidden min-h-[250px]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#f4c198] px-3 py-2">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <button
          onClick={onEdit}
          className="rounded-full p-1 text-gray-600 hover:text-gray-900"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Content area */}
      <div className="border-t-2 border-red-300 m-0" />
      <div className="p-3 flex flex-col min-h-[205px]">
        <div
          className="rounded border border-white bg-white text-sm text-[#a3462c] py-2 px-3 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="mt-auto text-right">
          <p className="text-xs text-gray-500 italic">
            Last Modified : {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
}
