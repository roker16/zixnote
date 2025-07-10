"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const rawData = [
  { id: "1", label: "Reactions of Alcohol" },
  { id: "2", label: "Oxidation", parentId: "1" },
  { id: "3", label: "Dehydration", parentId: "1" },
  { id: "4", label: "Esterification", parentId: "1" },
  { id: "5", label: "Lucas Test", parentId: "1" },
  { id: "6", label: "Substitution", parentId: "1" },
  { id: "7", label: "Forms Aldehyde / Acid", parentId: "2" },
  { id: "8", label: "Forms Alkene (Heat + Conc. H₂SO₄)", parentId: "3" },
  { id: "9", label: "Forms Ester + Water", parentId: "4" },
  { id: "10", label: "Forms Alkyl Halide", parentId: "5" },
  { id: "11", label: "Forms Haloalkane", parentId: "6" },
];

const layoutNodes = (data: typeof rawData) => {
  const levels: Record<string, number> = {};
  const spacingX = 230;
  const spacingY = 140;

  const assignLevels = (id: string, level = 0) => {
    levels[id] = level;
    data
      .filter((n) => n.parentId === id)
      .forEach((child) => assignLevels(child.id, level + 1));
  };

  assignLevels("1");

  let levelIndex: Record<number, number> = {};

  const nodes = data.map((item) => {
    const level = levels[item.id] || 0;
    const index = (levelIndex[level] = (levelIndex[level] || 0) + 1);

    return {
      id: item.id,
      data: { label: item.label },
      position: {
        x: level * spacingX,
        y: index * spacingY,
      },
      style: {
        backgroundColor: "#fff",
        border: "2px solid #3b82f6",
        borderRadius: 12,
        padding: 10,
        fontWeight: "bold",
        width: "fit-content",
      },
    };
  });

  const edges = data
    .filter((n) => n.parentId)
    .map((n) => ({
      id: `e${n.parentId}-${n.id}`,
      source: n.parentId!,
      target: n.id,
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: "#3b82f6", strokeWidth: 2 },
    }));

  return { nodes, edges };
};

export default function Flow() {
  const { nodes: initialNodes, edges: initialEdges } = layoutNodes(rawData);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: "#6366f1", strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  );

  return (
    <div className="h-screen w-full p-4 bg-gray-50">
      <div className="text-xl font-semibold mb-3">
        NCERT Mind Map: Reactions of Alcohol
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-white border rounded-md shadow-md"
      >
        <MiniMap />
        <Controls />
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
