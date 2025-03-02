import React from 'react';
import { motion } from 'framer-motion';

interface SafeSequenceDisplayProps {
  safeSequence: number[];
  isSafe: boolean;
  isComplete: boolean;
}

const SafeSequenceDisplay: React.FC<SafeSequenceDisplayProps> = ({
  safeSequence,
  isSafe,
  isComplete
}) => {
  return (
    <div className="card mb-6">
      <h3 className="text-xl font-semibold mb-4">Execution Sequence</h3>
      
      {isComplete ? (
        isSafe ? (
          <div>
            <p className="text-green-400 mb-4">
              System is in a safe state! Safe sequence found:
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {safeSequence.map((processId, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-green-900/30 border border-green-500 rounded-md px-3 py-2 text-white"
                >
                  P{processId}
                  {index < safeSequence.length - 1 && (
                    <span className="ml-2">→</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-red-400 mb-4">
              System is in an unsafe state! No safe sequence found.
            </p>
            <p className="text-gray-300">
              The current allocation of resources could lead to a deadlock.
            </p>
          </div>
        )
      ) : (
        <div>
          <p className="text-gray-300 mb-4">
            Current partial sequence:
          </p>
          <div className="flex flex-wrap gap-2">
            {safeSequence.length > 0 ? (
              safeSequence.map((processId, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-primary/30 border border-primary rounded-md px-3 py-2 text-white"
                >
                  P{processId}
                  {index < safeSequence.length - 1 && (
                    <span className="ml-2">→</span>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">No processes executed yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SafeSequenceDisplay;