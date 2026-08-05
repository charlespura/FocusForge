import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pin, Trash2, Edit2, Search, X } from 'lucide-react';
import { useNoteStore, Note } from '../store/noteStore';
import ReactMarkdown from 'react-markdown';

export function Notes() {
  const { notes, addNote, updateNote, deleteNote, togglePin } = useNoteStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const filteredNotes = notes.filter((note: Note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter((n: Note) => n.pinned);
  const unpinnedNotes = filteredNotes.filter((n: Note) => !n.pinned);

  const handleAddNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;
    addNote(newNote.title || 'Untitled', newNote.content);
    setNewNote({ title: '', content: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notes</h1>
          <p className="text-gray-500 dark:text-gray-400">Capture and organize your thoughts</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25"
        >
          <Plus className="w-5 h-5" />
          New Note
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-2xl p-6"
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <textarea
                placeholder="Write your note..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddNote}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Save Note
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {pinnedNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">📌 Pinned Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note: Note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => setEditingId(note.id)}
                onDelete={() => deleteNote(note.id)}
                onTogglePin={() => togglePin(note.id)}
                isEditing={editingId === note.id}
                onUpdate={(title, content) => {
                  updateNote(note.id, { title, content });
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ))}
          </div>
        </div>
      )}

      {unpinnedNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unpinnedNotes.map((note: Note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => setEditingId(note.id)}
                onDelete={() => deleteNote(note.id)}
                onTogglePin={() => togglePin(note.id)}
                isEditing={editingId === note.id}
                onUpdate={(title, content) => {
                  updateNote(note.id, { title, content });
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ))}
          </div>
        </div>
      )}

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No notes found. Create your first note!</p>
        </div>
      )}
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  isEditing: boolean;
  onUpdate: (title: string, content: string) => void;
  onCancel: () => void;
}

function NoteCard({ note, onEdit, onDelete, onTogglePin, isEditing, onUpdate, onCancel }: NoteCardProps) {
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-2xl p-4"
      >
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
        />
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={4}
          className="w-full px-3 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-2"
        />
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate(editTitle, editContent)}
            className="flex-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-2xl p-4 hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{note.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onTogglePin}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Pin className={`w-4 h-4 ${note.pinned ? 'text-red-500' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none line-clamp-3">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {new Date(note.updatedAt).toLocaleDateString()}
      </p>
    </motion.div>
  );
}

// ... all the existing code ...

// Add this at the very end of the file
export default Notes;