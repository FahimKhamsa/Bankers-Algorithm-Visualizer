import React from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle,
} from "lucide-react";

interface SimulationControlsProps {
  isRunning: boolean;
  onToggleRun: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onShowResult: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isComplete: boolean;
  currentStep: number;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  onToggleRun,
  onStepForward,
  onStepBackward,
  onShowResult,
  onReset,
  speed,
  onSpeedChange,
  isComplete,
  currentStep,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-dark-card rounded-lg">
      <button
        onClick={onToggleRun}
        disabled={isComplete}
        className={`btn ${
          isRunning ? "btn-danger" : "btn-primary"
        } flex items-center ${
          isComplete ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isRunning ? (
          <>
            <Pause className="mr-2 h-5 w-5" />
            Pause
          </>
        ) : (
          <>
            <Play className="mr-2 h-5 w-5" />
            Auto Run
          </>
        )}
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={onStepBackward}
          disabled={(isRunning && !isComplete) || currentStep === 0}
          className={`btn btn-secondary flex items-center ${
            (isRunning && !isComplete) || currentStep === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <SkipBack className="mr-2 h-5 w-5" />
          Step Back
        </button>

        <button
          onClick={onStepForward}
          disabled={isRunning || isComplete}
          className={`btn btn-secondary flex items-center ${
            isRunning || isComplete ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <SkipForward className="mr-2 h-5 w-5" />
          Step Forward
        </button>
      </div>

      <button
        onClick={onShowResult}
        className="btn btn-accent flex items-center"
      >
        <CheckCircle className="mr-2 h-5 w-5" />
        Show Result
      </button>

      <button
        onClick={onReset}
        className="btn bg-gray-600 hover:bg-gray-700 text-white flex items-center"
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        Reset
      </button>

      <div className="flex items-center ml-auto">
        <span className="text-sm text-gray-300 mr-2">Speed:</span>
        <input
          type="range"
          min="1"
          max="10"
          value={speed}
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="w-32 accent-blue-500 cursor-pointer"
        />
        <span className="text-sm text-gray-300 ml-2">{speed}x</span>
      </div>
    </div>
  );
};

export default SimulationControls;
