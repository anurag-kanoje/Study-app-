import React, { useState } from 'react';

interface VisualizationFormProps {
  onSubmit: (data: {
    title: string;
    type: 'mindmap' | 'bar' | 'line' | 'pie';
    noteId?: string;
    generateFromNote: boolean;
  }) => void;
  notes?: Array<{ id: string; title: string }>;
}

const VisualizationForm: React.FC<VisualizationFormProps> = ({ onSubmit, notes = [] }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'mindmap' | 'bar' | 'line' | 'pie'>('mindmap');
  const [noteId, setNoteId] = useState('');
  const [generateFromNote, setGenerateFromNote] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      type,
      noteId: generateFromNote ? noteId : undefined,
      generateFromNote,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="visualization-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Visualization Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="form-control"
        >
          <option value="mindmap">Mind Map</option>
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={generateFromNote}
            onChange={(e) => setGenerateFromNote(e.target.checked)}
          />
          Generate from Note
        </label>
      </div>

      {generateFromNote && (
        <div className="form-group">
          <label htmlFor="noteId">Select Note</label>
          <select
            id="noteId"
            value={noteId}
            onChange={(e) => setNoteId(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Select a note</option>
            {notes.map((note) => (
              <option key={note.id} value={note.id}>
                {note.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Generate Visualization
      </button>
    </form>
  );
};

export default VisualizationForm; 