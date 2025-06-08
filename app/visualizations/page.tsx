import React from 'react';
import MindMap from '@/components/MindMap';
import Chart from '@/components/Chart';
import VisualizationForm from '@/components/VisualizationForm';

interface Visualization {
  id: string;
  title: string;
  type: string;
  content: any;
}

export default function VisualizationsPage() {
  const [visualizations, setVisualizations] = React.useState<Visualization[]>([]);
  const [notes, setNotes] = React.useState<Array<{ id: string; title: string }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchVisualizations();
    fetchNotes();
  }, []);

  const fetchVisualizations = async () => {
    try {
      const response = await fetch('/api/mindmaps');
      const mindmaps = await response.json();
      const chartsResponse = await fetch('/api/charts');
      const charts = await chartsResponse.json();
      setVisualizations([...mindmaps, ...charts]);
    } catch (err) {
      setError('Failed to fetch visualizations');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError('Failed to fetch notes');
    }
  };

  const handleCreateVisualization = async (data: {
    title: string;
    type: string;
    noteId?: string;
    generateFromNote: boolean;
  }) => {
    try {
      const endpoint = data.type === 'mindmap' ? '/api/mindmaps' : '/api/charts';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          type: data.type,
          noteId: data.noteId,
          generateFromNote: data.generateFromNote,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create visualization');
      }

      const newVisualization = await response.json();
      setVisualizations([...visualizations, newVisualization]);
    } catch (err) {
      setError('Failed to create visualization');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Visualizations</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Visualization</h2>
        <VisualizationForm onSubmit={handleCreateVisualization} notes={notes} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visualizations.map((viz) => (
          <div key={viz.id} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">{viz.title}</h3>
            {viz.type === 'mindmap' ? (
              <MindMap content={viz.content} readOnly />
            ) : (
              <Chart type={viz.type as any} data={viz.content} title={viz.title} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 