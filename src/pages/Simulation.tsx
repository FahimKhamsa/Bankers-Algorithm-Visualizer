import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Process,
  SimulationState,
  // TreeNode,
  SimulationControls,
} from "../types";
import ProcessTable from "../components/ProcessTable";
import StepExplanationCard from "../components/StepExplanation";
import TreeVisualization from "../components/TreeVisualization";
import SimulationControlsComponent from "../components/SimulationControls";
import SafeSequenceDisplay from "../components/SafeSequenceDisplay";
import InputForm from "../components/InputForm";
import {
  initializeSimulation,
  executeStep,
  // findAllSafeSequences,
  runFullAlgorithm,
} from "../utils/bankersAlgorithm";

const Simulation: React.FC = () => {
  // Simulation state
  const [simulationState, setSimulationState] =
    useState<SimulationState | null>(null);
  // const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [allocationM, setAllocationM] = useState<number[][]>([[]]);
  const [maxM, setmaxM] = useState<number[][]>([[]]);

  // State history for undo functionality
  const [stateHistory, setStateHistory] = useState<SimulationState[]>([]);

  // Control state
  const [controls, setControls] = useState<SimulationControls>({
    isRunning: false,
    speed: 5,
    showResult: false,
    isReset: true,
  });

  // Initialize simulation with input data
  const handleInputSubmit = (
    processes: Process[],
    available: number[],
    allocationMatrix: number[][],
    maxMatrix: number[][]
  ) => {
    const initialState = initializeSimulation(processes, available);
    setSimulationState(initialState);
    setStateHistory([]); // Reset history

    setAllocationM(allocationMatrix);
    setmaxM(maxMatrix);

    // // Generate tree visualization data
    // const tree = findAllSafeSequences(initialState);
    // setTreeData(tree);

    setControls({
      isRunning: false,
      speed: 5,
      showResult: false,
      isReset: false,
    });
  };

  // Execute a single step
  const handleStepForward = useCallback(() => {
    if (!simulationState || simulationState.isComplete) return;

    // Save current state before updating
    const stateToSave = {
      ...simulationState,
      processes: simulationState.processes.map((p) => ({ ...p })),
      available: [...simulationState.available],
      work: [...simulationState.work],
      safeSequence: [...simulationState.safeSequence],
      stepExplanation: [...simulationState.stepExplanation],
    };
    setStateHistory((prev) => [...prev, stateToSave]);

    const newState = executeStep(simulationState);
    setSimulationState(newState);
  }, [simulationState]);

  // Step backward
  const handleStepBackward = useCallback(() => {
    if (!simulationState || stateHistory.length === 0) return;

    const previousState = {
      ...stateHistory[stateHistory.length - 1],
      processes: stateHistory[stateHistory.length - 1].processes.map((p) => ({
        ...p,
      })),
      available: [...stateHistory[stateHistory.length - 1].available],
      work: [...stateHistory[stateHistory.length - 1].work],
      safeSequence: [...stateHistory[stateHistory.length - 1].safeSequence],
      stepExplanation: [
        ...stateHistory[stateHistory.length - 1].stepExplanation,
      ],
    };

    const newHistory = stateHistory.slice(0, -1);
    setStateHistory(newHistory);
    setSimulationState(previousState);
  }, [simulationState, stateHistory]);

  // Toggle automatic execution
  const handleToggleRun = useCallback(() => {
    setControls((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  }, []);

  // Show final result
  const handleShowResult = useCallback(() => {
    if (!simulationState) return;

    // Save current state before showing result
    const stateToSave = {
      ...simulationState,
      processes: simulationState.processes.map((p) => ({ ...p })),
      available: [...simulationState.available],
      work: [...simulationState.work],
      safeSequence: [...simulationState.safeSequence],
      stepExplanation: [...simulationState.stepExplanation],
    };
    setStateHistory((prev) => [...prev, stateToSave]);

    const finalState = runFullAlgorithm(simulationState);
    setSimulationState(finalState);

    setControls((prev) => ({
      ...prev,
      isRunning: false,
      showResult: true,
    }));
  }, [simulationState]);

  // Reset simulation
  const handleReset = useCallback(() => {
    setSimulationState(null);
    setStateHistory([]); // Clear history
    // setTreeData(null);
    setControls({
      isRunning: false,
      speed: 5,
      showResult: false,
      isReset: true,
    });
  }, []);

  // Change animation speed
  const handleSpeedChange = useCallback((speed: number) => {
    setControls((prev) => ({
      ...prev,
      speed,
    }));
  }, []);

  // Run automatic execution
  useEffect(() => {
    if (!simulationState) return;

    if (controls.isRunning && simulationState.isComplete) {
      setControls((prev) => ({
        ...prev,
        isRunning: false,
      }));
    }

    if (!controls.isRunning || simulationState.isComplete) return;

    const interval = setInterval(() => {
      handleStepForward();
    }, 1000 / controls.speed);

    return () => clearInterval(interval);
  }, [controls.isRunning, controls.speed, simulationState, handleStepForward]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Banker's Algorithm Simulation
      </motion.h1>

      {controls.isReset ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <InputForm onSubmit={handleInputSubmit} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {simulationState && (
            <>
              <div className="mb-6">
                <SimulationControlsComponent
                  isRunning={controls.isRunning}
                  onToggleRun={handleToggleRun}
                  onStepForward={handleStepForward}
                  onStepBackward={handleStepBackward}
                  onShowResult={handleShowResult}
                  onReset={handleReset}
                  speed={controls.speed}
                  onSpeedChange={handleSpeedChange}
                  isComplete={simulationState.isComplete}
                  currentStep={stateHistory.length}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
                {/* Left Column: Current Status & Step-i */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  <div className="card h-full">
                    <h3 className="text-xl font-semibold mb-4">
                      Current Status
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-300">
                          Step
                        </h4>
                        <p className="text-2xl font-bold">
                          {simulationState.currentStep} /{" "}
                          {simulationState.processes.length}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-300">
                          State
                        </h4>
                        {simulationState.isComplete ? (
                          simulationState.isSafe ? (
                            <p className="text-green-400 font-bold">Safe</p>
                          ) : (
                            <p className="text-red-400 font-bold">Unsafe</p>
                          )
                        ) : (
                          <p className="text-yellow-400 font-bold">
                            In Progress
                          </p>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-300">
                          Available Resources
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {simulationState.available.map((value, i) => (
                            <div
                              key={`available-${i}`}
                              className="bg-dark-card-hover rounded-md px-3 py-2"
                            >
                              R{i}:{" "}
                              <span className="font-bold text-primary">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-300">
                          Work Vector
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {simulationState.work.map((value, i) => (
                            <div
                              key={`work-${i}`}
                              className="bg-dark-card-hover rounded-md px-3 py-2"
                            >
                              R{i}:{" "}
                              <span className="font-bold text-secondary">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {simulationState.currentStep > 0 && (
                        <StepExplanationCard
                          stepExplanation={simulationState.stepExplanation}
                          currentStep={simulationState.currentStep}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Process Table & Execution Sequence */}
                <div className="lg:col-span-2">
                  <div className="card mb-6">
                    <h3 className="text-xl font-semibold mb-4">
                      Process & Resource State
                    </h3>
                    <ProcessTable
                      processes={simulationState.processes}
                      available={simulationState.available}
                      resourceCount={simulationState.resources.length}
                    />
                  </div>

                  <SafeSequenceDisplay
                    safeSequence={simulationState.safeSequence}
                    isSafe={simulationState.isSafe}
                    isComplete={simulationState.isComplete}
                  />
                </div>
              </div>

              <div className="card mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Tree Visualization
                </h3>
                {/* {treeData && (
                )} */}
                <TreeVisualization
                  allocation={allocationM}
                  max={maxM}
                  available={simulationState.available}
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="btn bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Reset Simulation
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Simulation;
