export interface Process {
  id: number;
  name: string;
  allocation: number[];
  max: number[];
  need: number[];
  finished: boolean;
}

export interface SimulationState {
  processes: Process[];
  resources: number[];
  available: number[];
  work: number[];
  safeSequence: number[];
  currentStep: number;
  isComplete: boolean;
  isSafe: boolean;
  stepExplanation: StepDetail[];
}

export interface StepDetail {
  processName?: string;
  need?: number[];
  work?: number[];
  canExecute?: boolean;
  releasedResources?: number[];
  updatedWork?: number[];
  finished?: boolean;
  message?: string;
}

export interface TreeNode {
  id: string;
  processId: number | null;
  available: number[];
  work: number[];
  children: TreeNode[];
  isLeaf: boolean;
  isSafe: boolean;
  depth: number;
  order: number;
}

export interface SimulationControls {
  isRunning: boolean;
  speed: number;
  showResult: boolean;
  isReset: boolean;
}

export type InputMode = "default" | "custom" | "file";

export type Matrix = number[][];
