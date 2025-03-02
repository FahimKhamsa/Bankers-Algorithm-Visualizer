import { StepDetail } from "../types";

interface StepExplanationCardProps {
  stepExplanation: StepDetail[];
  currentStep: number;
}

const StepExplanationCard: React.FC<StepExplanationCardProps> = ({
  stepExplanation,
  currentStep,
}) => {
  return (
    <div className="p-4 text-white shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-primary">
        Step {currentStep} Execution Details
      </h3>
      <div className="space-y-4">
        {stepExplanation.map((step, index) => (
          <div key={index} className="p-3 bg-dark-card-hover rounded-md">
            {step.message && (
              <p className="text-red-400 font-semibold">{step.message}</p>
            )}

            {step.processName && (
              <h4 className="text-lg font-semibold text-yellow-400">
                Process {step.processName}
              </h4>
            )}

            {step.need && step.work && (
              <div className="text-sm text-gray-300 space-y-1">
                <p>
                  Need:{" "}
                  <span className="bg-gray-800 px-3 py-1 rounded-md font-mono text-white">
                    [ {step.need.join(" ")} ]
                  </span>
                </p>
                <p>
                  Work:{" "}
                  <span className="bg-gray-800 px-3 py-1 rounded-md font-mono text-white">
                    [ {step.work.join(" ")} ]
                  </span>
                </p>
                <p
                  className={`font-bold ${
                    step.canExecute ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {step.canExecute
                    ? "Need <= Work ✅ Can Execute"
                    : "Need > Work ❌ Cannot Execute"}
                </p>
              </div>
            )}

            {step.releasedResources && (
              <div className="text-sm text-gray-300 mt-2 space-y-1">
                <p className="text-green-400 font-semibold">Process Finished</p>
                <p>
                  Released:{" "}
                  <span className="bg-gray-800 px-3 py-1 rounded-md font-mono text-white">
                    [ {step.releasedResources.join(" ")} ]
                  </span>
                </p>
                <p>
                  Updated Work:{" "}
                  <span className="bg-gray-800 px-3 py-1 rounded-md font-mono text-white">
                    [ {step?.updatedWork?.join(" ")} ]
                  </span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepExplanationCard;
