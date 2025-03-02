import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { Process, InputMode } from "../types";
import {
  defaultProcesses,
  defaultAvailable,
  //calculateNeed,
  validateInput,
} from "../utils/bankersAlgorithm";
import Papa from "papaparse";

interface InputFormProps {
  onSubmit: (
    processes: Process[],
    resources: number[],
    allocationMatrix: number[][],
    maxMatrix: number[][]
  ) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [inputMode, setInputMode] = useState<InputMode>("default");
  const [processCount, setProcessCount] = useState(5);
  const [resourceCount, setResourceCount] = useState(3);
  const [processes, setProcesses] = useState<Process[]>(defaultProcesses);
  const [available, setAvailable] = useState<number[]>(defaultAvailable);
  const [error, setError] = useState<string | null>(null);

  // Reset form when input mode changes
  useEffect(() => {
    if (inputMode === "default") {
      setProcesses(defaultProcesses);
      setAvailable(defaultAvailable);
      setProcessCount(defaultProcesses.length);
      setResourceCount(defaultAvailable.length);
    } else {
      // Initialize custom input with empty processes
      const newProcesses: Process[] = Array.from({ length: processCount }).map(
        (_, i) => ({
          id: i,
          name: `P${i}`,
          allocation: Array(resourceCount).fill(0),
          max: Array(resourceCount).fill(0),
          need: Array(resourceCount).fill(0),
          finished: false,
        })
      );
      setProcesses(newProcesses);
      setAvailable(Array(resourceCount).fill(0));
    }
  }, [inputMode, processCount, resourceCount]);

  // Update process allocation
  const handleAllocationChange = (
    processIndex: number,
    resourceIndex: number,
    value: number
  ) => {
    const newProcesses = [...processes];
    newProcesses[processIndex] = {
      ...newProcesses[processIndex],
      allocation: [
        ...newProcesses[processIndex].allocation.slice(0, resourceIndex),
        value,
        ...newProcesses[processIndex].allocation.slice(resourceIndex + 1),
      ],
    };

    // Recalculate need
    newProcesses[processIndex].need = newProcesses[processIndex].max.map(
      (max, i) => max - newProcesses[processIndex].allocation[i]
    );

    setProcesses(newProcesses);
  };

  // Update process max
  const handleMaxChange = (
    processIndex: number,
    resourceIndex: number,
    value: number
  ) => {
    const newProcesses = [...processes];
    newProcesses[processIndex] = {
      ...newProcesses[processIndex],
      max: [
        ...newProcesses[processIndex].max.slice(0, resourceIndex),
        value,
        ...newProcesses[processIndex].max.slice(resourceIndex + 1),
      ],
    };

    // Recalculate need
    newProcesses[processIndex].need = newProcesses[processIndex].max.map(
      (max, i) => max - newProcesses[processIndex].allocation[i]
    );

    setProcesses(newProcesses);
  };

  // Update resource
  const handleAvailableChange = (availableIndex: number, value: number) => {
    const newAvailable = [
      ...available.slice(0, availableIndex),
      value,
      ...available.slice(availableIndex + 1),
    ];
    setAvailable(newAvailable);
  };

  const validateDynamicFileFormat = (headers: string[]): boolean => {
    // Extract resource labels dynamically (e.g., A, B, C, ...)
    const resourceLabels = new Set<string>();

    const allocationPattern = /^Allocation_(.+)$/;

    headers.forEach((col) => {
      const match = col.match(allocationPattern);
      if (match) {
        resourceLabels.add(match[1]); // Extract resource name (A, B, C, ...)
      }
    });

    // Check if all required columns exist for each detected resource
    for (const res of resourceLabels) {
      const requiredColumns = new Set([
        `Allocation_${res}`,
        `Max_${res}`,
        `Available_${res}`,
        `Need_${res}`,
      ]);

      // If any required column is missing, return false
      if (![...requiredColumns].every((col) => headers.includes(col))) {
        return false;
      }
    }
    return true; // All necessary columns are present
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        const data = result.data as string[][];
        const headers = data[0];

        // Validate file format
        const isValidFormat = validateDynamicFileFormat(headers);
        if (!isValidFormat) {
          toast.error("Invalid file format. Please upload a valid CSV file.");
          setError("Invalid file format. Please upload a valid CSV file.");
          return;
        }

        // Dynamically calculate resource count
        const resourceCount = (headers.length - 1) / 4;
        setResourceCount(resourceCount);

        // Extract resources (work vector) from first process's available columns
        const workVector = data[1]
          .slice(1 + resourceCount * 2, 1 + resourceCount * 3)
          .map((val) => (val === "-" ? 0 : Number(val)));

        setAvailable(workVector);

        // Extract process data
        const processList: Process[] = data
          .slice(1)
          .map((row, i) => {
            const allocation = row
              .slice(1, 1 + resourceCount)
              .map((val) => Number(val));
            const max = row
              .slice(1 + resourceCount, 1 + resourceCount * 2)
              .map((val) => Number(val));
            const need = row
              .slice(1 + resourceCount * 3, 1 + resourceCount * 4)
              .map((val) => (val === "-" ? 0 : Number(val)));

            return {
              id: i,
              name: `P${i}`,
              allocation,
              max,
              need,
              finished: false,
            };
          })
          .filter(
            (process) =>
              // Remove processes where allocation, max, and need are all zeros
              !process.allocation.every((val) => val === 0) ||
              !process.max.every((val) => val === 0) ||
              !process.need.every((val) => val === 0)
          );

        setProcesses(processList);
        setInputMode("file"); // Set input mode to file after successful upload
      },
      header: false, // Treat first row as data, not header
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const { valid, message } = validateInput(processes, available);
    if (!valid) {
      setError(message);
      return;
    }

    const allocationMatrix = processes.map((p) => p.allocation);
    const maxMatrix = processes.map((p) => p.max);

    setError(null);
    onSubmit(processes, available, allocationMatrix, maxMatrix);
  };

  // Update process and resource counts
  const handleProcessCountChange = (count: number) => {
    if (count < 1) return;

    setProcessCount(count);

    if (inputMode === "custom") {
      // Adjust processes array
      if (count > processes.length) {
        // Add new processes
        const newProcesses = [...processes];
        for (let i = processes.length; i < count; i++) {
          newProcesses.push({
            id: i,
            name: `P${i}`,
            allocation: Array(resourceCount).fill(0),
            max: Array(resourceCount).fill(0),
            need: Array(resourceCount).fill(0),
            finished: false,
          });
        }
        setProcesses(newProcesses);
      } else {
        // Remove processes
        setProcesses(processes.slice(0, count));
      }
    }
  };

  const handleResourceCountChange = (count: number) => {
    if (count < 1) return;

    setResourceCount(count);

    if (inputMode === "custom") {
      // Adjust resources array
      if (count > available.length) {
        // Add new resources
        setAvailable([
          ...available,
          ...Array(count - available.length).fill(0),
        ]);
      } else {
        // Remove resources
        setAvailable(available.slice(0, count));
      }

      // Adjust process allocation and max arrays
      const newProcesses = processes.map((process) => {
        let allocation, max;

        if (count > process.allocation.length) {
          // Add new resources
          allocation = [
            ...process.allocation,
            ...Array(count - process.allocation.length).fill(0),
          ];
          max = [...process.max, ...Array(count - process.max.length).fill(0)];
        } else {
          // Remove resources
          allocation = process.allocation.slice(0, count);
          max = process.max.slice(0, count);
        }

        // Calculate need
        const need = max.map((m, i) => m - allocation[i]);

        return { ...process, allocation, max, need };
      });

      setProcesses(newProcesses);
    }
  };

  return (
    <div className="card mb-8">
      <h2 className="text-2xl font-bold mb-4">Simulation Input</h2>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            className={`btn ${
              inputMode === "default" ? "btn-primary" : "bg-gray-700"
            }`}
            onClick={() => setInputMode("default")}
          >
            Default Example
          </button>
          <button
            className={`btn ${
              inputMode === "custom" ? "btn-primary" : "bg-gray-700"
            }`}
            onClick={() => setInputMode("custom")}
          >
            Custom Input
          </button>
        </div>
      </div>

      {(inputMode === "default" ||
        inputMode === "custom" ||
        inputMode === "file") && (
        <div className="flex items-center space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setInputMode("file")}
            className={`btn ${
              inputMode === "file" ? "btn-primary" : "bg-gray-700"
            }`}
          >
            Upload CSV
          </button>
          {inputMode === "file" && (
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="ml-2"
            />
          )}
        </div>
      )}

      {inputMode === "custom" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Processes
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={processCount}
              onChange={(e) =>
                handleProcessCountChange(parseInt(e.target.value))
              }
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Resource Types
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={resourceCount}
              onChange={(e) =>
                handleResourceCountChange(parseInt(e.target.value))
              }
              className="input-field w-full"
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Available Resources</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {available.map((av, i) => (
              <div key={`resource-${i}`}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resource {i}
                </label>
                <input
                  type="number"
                  min="0"
                  value={av}
                  onChange={(e) =>
                    handleAvailableChange(i, parseInt(e.target.value))
                  }
                  disabled={inputMode === "default"}
                  className="input-field w-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">
            Process Allocation & Maximum
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Process
                  </th>
                  {Array.from({ length: resourceCount }).map((_, i) => (
                    <th
                      key={`allocation-header-${i}`}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Allocation R{i}
                    </th>
                  ))}
                  {Array.from({ length: resourceCount }).map((_, i) => (
                    <th
                      key={`max-header-${i}`}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Max R{i}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-dark-card divide-y divide-gray-700">
                {processes.map((process, processIndex) => (
                  <tr key={`process-${processIndex}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                      {process.name}
                    </td>
                    {Array.from({ length: resourceCount }).map(
                      (_, resourceIndex) => (
                        <td
                          key={`allocation-${processIndex}-${resourceIndex}`}
                          className="px-4 py-3 whitespace-nowrap"
                        >
                          <input
                            type="number"
                            min="0"
                            value={process.allocation[resourceIndex] || 0}
                            onChange={(e) =>
                              handleAllocationChange(
                                processIndex,
                                resourceIndex,
                                parseInt(e.target.value) || 0
                              )
                            }
                            disabled={inputMode === "default"}
                            className="input-field w-16"
                          />
                        </td>
                      )
                    )}
                    {Array.from({ length: resourceCount }).map(
                      (_, resourceIndex) => (
                        <td
                          key={`max-${processIndex}-${resourceIndex}`}
                          className="px-4 py-3 whitespace-nowrap"
                        >
                          <input
                            type="number"
                            min="0"
                            value={process.max[resourceIndex] || 0}
                            onChange={(e) =>
                              handleMaxChange(
                                processIndex,
                                resourceIndex,
                                parseInt(e.target.value) || 0
                              )
                            }
                            disabled={inputMode === "default"}
                            className="input-field w-16"
                          />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-md text-red-200">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className={`btn btn-primary transition-all duration-300 ${
              error
                ? "opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                : "hover:bg-blue-600"
            }`}
            disabled={error !== null}
          >
            Start Simulation
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
