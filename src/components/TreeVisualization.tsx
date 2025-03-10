import { useMemo } from "react";

interface Node {
  id: string;
  available: number[];
  processes: number[];
  children: Node[];
  processId?: number;
  x: number;
  y: number;
  isSafe: boolean;
}

interface TreeVisualizationProps {
  allocation: number[][];
  max: number[][];
  available: number[];
}

function buildTree(
  allocation: number[][],
  max: number[][],
  available: number[],
  remainingProcesses: number[],
  sequence: number[] = [] // Track execution sequence
): Node {
  const isSafe = remainingProcesses.length === 0;

  const node: Node = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    available,
    processes: sequence, // Store sequence instead
    children: [],
    x: 0,
    y: 0,
    isSafe,
  };

  if (isSafe) {
    // console.log("Safe sequence found:", sequence); // Debugging log
    return node;
  }

  for (const processId of remainingProcesses) {
    const canAllocate = allocation[processId].every(
      (allocated, i) => max[processId][i] - allocated <= available[i]
    );

    if (canAllocate) {
      const newAvailable = available.map(
        (a, i) => a + allocation[processId][i]
      );
      const newRemaining = remainingProcesses.filter((p) => p !== processId);
      const newSequence = [...sequence, processId]; // Track execution order

      const child = buildTree(
        allocation,
        max,
        newAvailable,
        newRemaining,
        newSequence
      );
      child.processId = processId;
      node.children.push(child);
    }
  }

  return node;
}

function layoutTree(
  node: Node,
  x: number,
  y: number,
  level: number,
  spacing: number
): void {
  node.x = x;
  node.y = y;

  const childSpacing = spacing / Math.pow(2, level);
  const totalWidth = childSpacing * (node.children.length - 1);
  const startX = x - totalWidth / 2;

  node.children.forEach((child, i) => {
    const childX = startX + i * childSpacing;
    const childY = y + 20; // Reduce vertical spacing further
    layoutTree(child, childX, childY, level + 1, spacing);
  });
}

const TreeNode: React.FC<{ node: Node; isRoot?: boolean }> = ({
  node,
  isRoot = false,
}) => (
  <g>
    {node.children.map((child) => (
      <g key={child.id}>
        <line
          x1={node.x}
          y1={node.y}
          x2={child.x}
          y2={child.y}
          stroke={child.isSafe ? "white" : "black"} // White edges for safe sequences
          strokeWidth="0.4"
        />
        <TreeNode node={child} />
      </g>
    ))}

    <circle
      cx={node.x}
      cy={node.y}
      r="2.5" // Make node size even smaller
      fill={isRoot ? "blue" : node.isSafe ? "green" : "red"} // Root is blue, safe sequence green
    />

    {node.processId !== undefined && (
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        className="text-[2.5px] font-medium" // Reduce text size even more
      >
        P{node.processId}
      </text>
    )}
  </g>
);

export default function TreeVisualization({
  allocation,
  max,
  available,
}: TreeVisualizationProps) {
  const [width, height] = [200, 150]; // Reduce width and height further

  const tree = useMemo(() => {
    const initialProcesses = Array.from(
      { length: allocation.length },
      (_, i) => i
    );
    const newTree = buildTree(allocation, max, available, initialProcesses);
    layoutTree(newTree, width / 2, 10, 0, width * 0.3); // Reduce spacing
    return newTree;
  }, [allocation, max, available, width]);

  if (!tree) return null;

  return (
    <div className="w-full flex justify-center items-center">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="max-w-full max-h-full"
      >
        <TreeNode node={tree} isRoot={true} />
      </svg>
    </div>
  );
}
