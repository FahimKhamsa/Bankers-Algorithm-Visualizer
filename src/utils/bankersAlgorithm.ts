import { toast } from "sonner";
import { Process, SimulationState, StepDetail, TreeNode } from "../types";

// Default example data
export const defaultProcesses: Process[] = [
  {
    id: 0,
    name: "P0",
    allocation: [0, 1, 0],
    max: [7, 5, 3],
    need: [7, 4, 3],
    finished: false,
  },
  {
    id: 1,
    name: "P1",
    allocation: [2, 0, 0],
    max: [3, 2, 2],
    need: [1, 2, 2],
    finished: false,
  },
  {
    id: 2,
    name: "P2",
    allocation: [3, 0, 2],
    max: [9, 0, 2],
    need: [6, 0, 0],
    finished: false,
  },
  {
    id: 3,
    name: "P3",
    allocation: [2, 1, 1],
    max: [2, 2, 2],
    need: [0, 1, 1],
    finished: false,
  },
  {
    id: 4,
    name: "P4",
    allocation: [0, 0, 2],
    max: [4, 3, 3],
    need: [4, 3, 1],
    finished: false,
  },
];

export const defaultAvailable = [3, 3, 2];

// Initialize simulation state
// Initialize simulation state
export const initializeSimulation = (
  processes: Process[],
  available: number[]
): SimulationState => {
  // Deep clone processes to avoid mutation
  const clonedProcesses = processes.map((p) => ({
    ...p,
    allocation: [...p.allocation],
    max: [...p.max],
    need: [...p.need],
    finished: false,
  }));

  // Calculate total resources
  const resources = clonedProcesses.reduce((total, process) => {
    return total.map((t, i) => t + process.allocation[i]);
  }, [...available]);

  return {
    processes: clonedProcesses,
    resources: resources,
    available: available,
    work: [...available],
    safeSequence: [],
    currentStep: 0,
    isComplete: false,
    isSafe: false,
    stepExplanation: [],
  };
};

// Check if a process can be executed with current work resources
export const canProcessExecute = (
  process: Process,
  work: number[]
): boolean => {
  if (process.finished) return false;

  for (let i = 0; i < process.need.length; i++) {
    if (process.need[i] > work[i]) {
      return false;
    }
  }
  return true;
};

// Run safety algorithm and return all possible execution paths
export const findAllSafeSequences = (state: SimulationState): TreeNode => {
  const { processes } = state;

  // Create root node
  const rootNode: TreeNode = {
    id: "root",
    processId: null,
    available: [...state.available],
    work: [...state.available],
    children: [],
    isLeaf: false,
    isSafe: false,
    depth: 0,
    order: 0,
  };

  // Helper function to build the tree recursively
  const buildTree = (
    node: TreeNode,
    remainingProcesses: Process[],
    currentWork: number[],
    path: number[],
    depth: number
  ) => {
    // If no processes left, this is a complete safe sequence
    if (remainingProcesses.length === 0) {
      node.isLeaf = true;
      node.isSafe = true;
      return;
    }

    let foundSafeProcess = false;
    let order = 0;

    // Try each remaining process
    remainingProcesses.forEach((process) => {
      if (canProcessExecute(process, currentWork)) {
        foundSafeProcess = true;

        // Calculate new work after this process completes
        const newWork = [...currentWork];
        process.allocation.forEach((allocated, i) => {
          newWork[i] += allocated;
        });

        // Create child node for this process
        const childNode: TreeNode = {
          id: `${node.id}-${process.id}`,
          processId: process.id,
          available: [...currentWork],
          work: [...newWork],
          children: [],
          isLeaf: false,
          isSafe: false,
          depth: depth + 1,
          order: order++,
        };

        // Add child to current node
        node.children.push(childNode);

        // Continue building tree with remaining processes
        const newRemainingProcesses = remainingProcesses.filter(
          (p) => p.id !== process.id
        );
        const newPath = [...path, process.id];

        buildTree(
          childNode,
          newRemainingProcesses,
          newWork,
          newPath,
          depth + 1
        );
      }
    });

    // If no safe process found, this is a leaf node but not safe
    if (!foundSafeProcess) {
      node.isLeaf = true;
      node.isSafe = false;
    } else {
      // If any child is safe, this node is part of a safe path
      node.isSafe = node.children.some((child) => child.isSafe);
    }
  };

  // Start building the tree
  buildTree(rootNode, [...processes], [...state.available], [], 0);

  return rootNode;
};

// Find a single safe sequence (for basic algorithm)
export const findSafeSequence = (state: SimulationState): number[] | null => {
  const { processes } = state;
  const work = [...state.available];
  const finish = processes.map(() => false);
  const safeSequence: number[] = [];

  let count = 0;
  while (count < processes.length) {
    let found = false;

    for (let i = 0; i < processes.length; i++) {
      if (!finish[i] && canProcessExecute(processes[i], work)) {
        // Process can execute, add its resources back to work
        for (let j = 0; j < work.length; j++) {
          work[j] += processes[i].allocation[j];
        }

        safeSequence.push(i);
        finish[i] = true;
        found = true;
        count++;
        break;
      }
    }

    if (!found) {
      // No process can execute, system is not in safe state
      return null;
    }
  }

  return safeSequence;
};

// Execute a single step of the algorithm
export const executeStep = (state: SimulationState): SimulationState => {
  if (state.isComplete) return state;

  const newState = { ...state };
  const { processes, work } = newState;
  // eslint-disable-next-line prefer-const
  let stepDetails: StepDetail[] = [];

  for (let i = 0; i < processes.length; i++) {
    if (!processes[i].finished) {
      const canExecute = canProcessExecute(processes[i], work);
      stepDetails.push({
        processName: processes[i].name,
        need: [...processes[i].need],
        work: [...work],
        canExecute,
      });

      if (canExecute) {
        // Mark as finished
        processes[i] = { ...processes[i], finished: true };

        // Update work vector
        for (let j = 0; j < work.length; j++) {
          work[j] += processes[i].allocation[j];
        }

        stepDetails.push({
          processName: processes[i].name,
          releasedResources: [...processes[i].allocation],
          updatedWork: [...work],
          finished: true,
        });

        newState.safeSequence.push(i);
        newState.currentStep++;
        newState.stepExplanation = stepDetails; // Save structured data

        if (newState.safeSequence.length === processes.length) {
          newState.isComplete = true;
          newState.isSafe = true;
        }

        return newState;
      }
    }
  }

  newState.isComplete = true;
  newState.isSafe = false;
  newState.stepExplanation = [
    { message: "No process can execute. System is in an unsafe state." },
  ];

  return newState;
};

// Run the entire algorithm at once
export const runFullAlgorithm = (state: SimulationState): SimulationState => {
  let currentState = { ...state };

  while (!currentState.isComplete) {
    currentState = executeStep(currentState);
  }

  return currentState;
};

// Calculate need matrix from max and allocation
export const calculateNeed = (processes: Process[]): Process[] => {
  return processes.map((process) => {
    const need = process.max.map((max, i) => max - process.allocation[i]);
    return { ...process, need };
  });
};

// Validate input data
export const validateInput = (
  processes: Process[],
  available: number[]
): { valid: boolean; message: string } => {
  // Calculate total system resources (Allocated + Available)
  const totalResources = processes.reduce(
    (total, process) => total.map((t, i) => t + process.allocation[i]),
    [...available]
  );

  // Check if available resources are non-negative
  if (available.some((av) => av < 0)) {
    toast.error("Available resources cannot be negative.");
    return {
      valid: false,
      message: "Available resources cannot be negative.",
    };
  }

  // Check if total allocated resources exceed total system resources
  for (let i = 0; i < available.length; i++) {
    const totalAllocated = processes.reduce(
      (sum, process) => sum + process.allocation[i],
      0
    );

    if (totalAllocated > totalResources[i]) {
      toast.error(
        `Total allocated resources for resource ${i} exceed the total system resources.`
      );
      return {
        valid: false,
        message: `Total allocated resources for resource ${i} exceed the total system resources.`,
      };
    }
  }

  // Check if any process's maximum claim exceeds total system resources
  for (const process of processes) {
    for (let i = 0; i < available.length; i++) {
      if (process.max[i] > totalResources[i]) {
        toast.error(
          `Process ${process.name} requests more than the total system resources for resource ${i}.`
        );
        return {
          valid: false,
          message: `Process ${process.name} requests more than the total system resources for resource ${i}.`,
        };
      }
    }
  }

  // Check if Need is correctly calculated
  for (const process of processes) {
    for (let i = 0; i < process.need.length; i++) {
      if (process.need[i] !== process.max[i] - process.allocation[i]) {
        toast.error(
          `Need calculation is incorrect for process ${process.name}.`
        );
        return {
          valid: false,
          message: `Need calculation is incorrect for process ${process.name}.`,
        };
      }
    }
  }

  return { valid: true, message: "Validation passed!" };
};
