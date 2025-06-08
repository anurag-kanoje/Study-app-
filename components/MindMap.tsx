import React, { useState, useEffect } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection
} from 'reactflow';
import 'reactflow/dist/style.css';

interface MindMapProps {
  content: any;
  onUpdate?: (content: any) => void;
  readOnly?: boolean;
}

const MindMap: React.FC<MindMapProps> = ({ content, onUpdate, readOnly = false }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (content) {
      // Convert content to nodes and edges
      const { nodes: contentNodes, edges: contentEdges } = convertContentToFlow(content);
      setNodes(contentNodes);
      setEdges(contentEdges);
    }
  }, [content]);

  const onConnect = (connection: Connection) => {
    if (!readOnly) {
      setEdges((eds) => addEdge(connection, eds));
      if (onUpdate) {
        const newContent = convertFlowToContent(nodes, [...edges, connection]);
        onUpdate(newContent);
      }
    }
  };

  const onNodeDragStop = () => {
    if (onUpdate) {
      const newContent = convertFlowToContent(nodes, edges);
      onUpdate(newContent);
    }
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

// Helper functions to convert between content and flow format
const convertContentToFlow = (content: any) => {
  // Implementation depends on your content structure
  // This is a basic example
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (content.nodes) {
    content.nodes.forEach((node: any) => {
      nodes.push({
        id: node.id,
        position: node.position,
        data: { label: node.label },
        type: 'default',
      });
    });
  }

  if (content.edges) {
    content.edges.forEach((edge: any) => {
      edges.push({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      });
    });
  }

  return { nodes, edges };
};

const convertFlowToContent = (nodes: Node[], edges: Edge[]) => {
  return {
    nodes: nodes.map(node => ({
      id: node.id,
      position: node.position,
      label: node.data.label,
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    })),
  };
};

export default MindMap; 