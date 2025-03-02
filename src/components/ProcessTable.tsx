import React from 'react';
import { Process } from '../types';

interface ProcessTableProps {
  processes: Process[];
  available: number[];
  resourceCount: number;
}

const ProcessTable: React.FC<ProcessTableProps> = ({ 
  processes, 
  available,
  resourceCount
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Process
            </th>
            {Array.from({ length: resourceCount }).map((_, i) => (
              <th key={`allocation-${i}`} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Allocation R{i}
              </th>
            ))}
            {Array.from({ length: resourceCount }).map((_, i) => (
              <th key={`max-${i}`} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Max R{i}
              </th>
            ))}
            {Array.from({ length: resourceCount }).map((_, i) => (
              <th key={`need-${i}`} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Need R{i}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-dark-card divide-y divide-gray-700">
          {processes.map((process) => (
            <tr key={process.id} className={process.finished ? 'bg-green-900/20' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {process.name}
              </td>
              {process.allocation.map((value, i) => (
                <td key={`allocation-${process.id}-${i}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {value}
                </td>
              ))}
              {process.max.map((value, i) => (
                <td key={`max-${process.id}-${i}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {value}
                </td>
              ))}
              {process.need.map((value, i) => (
                <td key={`need-${process.id}-${i}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {value}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {process.finished ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Finished
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Waiting
                  </span>
                )}
              </td>
            </tr>
          ))}
          <tr className="bg-dark-card-hover">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
              Available
            </td>
            {available.map((value, i) => (
              <td key={`available-${i}`} className="px-6 py-4 whitespace-nowrap text-sm text-primary font-bold">
                {value}
              </td>
            ))}
            <td colSpan={resourceCount * 2 + 1}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProcessTable;