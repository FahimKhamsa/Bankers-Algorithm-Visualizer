import React from 'react';
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">About Banker's Algorithm</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="card col-span-2">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <BookOpen className="mr-2 text-primary" />
            What is Banker's Algorithm?
          </h2>
          <p className="text-gray-300 mb-4">
            The Banker's Algorithm is a resource allocation and deadlock avoidance algorithm developed by Edsger Dijkstra. It is named after the banking system where a bank never allocates available cash in such a way that it can no longer satisfy the needs of all its customers.
          </p>
          <p className="text-gray-300 mb-4">
            In operating systems, the Banker's Algorithm is used to allocate resources to processes in a way that avoids deadlock. It does this by ensuring that the system always remains in a safe state, where there exists at least one sequence in which all processes can complete their execution.
          </p>
          <p className="text-gray-300">
            The algorithm maintains information about:
          </p>
          <ul className="list-disc list-inside text-gray-300 mt-2 mb-4 space-y-1">
            <li>Available resources</li>
            <li>Maximum resource requirements of each process</li>
            <li>Currently allocated resources to each process</li>
            <li>Remaining resource needs of each process</li>
          </ul>
        </div>
        
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <AlertCircle className="mr-2 text-warning" />
            Why is it Important?
          </h2>
          <p className="text-gray-300 mb-4">
            Deadlocks can cause system hangs and resource wastage. The Banker's Algorithm provides a way to prevent deadlocks before they occur, rather than detecting and recovering from them after they happen.
          </p>
          <p className="text-gray-300">
            This proactive approach is crucial in systems where resources are limited and processes compete for them, such as:
          </p>
          <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
            <li>Operating systems</li>
            <li>Database management systems</li>
            <li>Distributed systems</li>
            <li>Real-time systems</li>
          </ul>
        </div>
      </div>
      
      <div className="card mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <CheckCircle className="mr-2 text-success" />
          How the Algorithm Works
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium text-primary mb-2">Data Structures</h3>
            <p className="text-gray-300">
              The algorithm uses several matrices and vectors to track resource allocation:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li><span className="font-mono text-accent">Available</span>: Vector of available resources</li>
              <li><span className="font-mono text-accent">Max</span>: Matrix defining maximum demand of each process</li>
              <li><span className="font-mono text-accent">Allocation</span>: Matrix defining resources currently allocated to each process</li>
              <li><span className="font-mono text-accent">Need</span>: Matrix indicating remaining resource needs (Max - Allocation)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium text-primary mb-2">Safety Algorithm</h3>
            <p className="text-gray-300">
              The safety algorithm determines if the system is in a safe state:
            </p>
            <ol className="list-decimal list-inside text-gray-300 mt-2 space-y-1">
              <li>Initialize <span className="font-mono text-accent">Work = Available</span> and <span className="font-mono text-accent">Finish[i] = false</span> for all processes</li>
              <li>Find a process that hasn't finished and whose needs can be satisfied</li>
              <li>If such a process exists, add its allocated resources to Work and mark it as finished</li>
              <li>Repeat steps 2-3 until either all processes are finished (safe state) or no eligible process is found (unsafe state)</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-xl font-medium text-primary mb-2">Resource Request Algorithm</h3>
            <p className="text-gray-300">
              When a process requests resources, the algorithm:
            </p>
            <ol className="list-decimal list-inside text-gray-300 mt-2 space-y-1">
              <li>Checks if the request exceeds the process's maximum needs</li>
              <li>Checks if the request exceeds available resources</li>
              <li>Tentatively allocates the resources and checks if the resulting state is safe</li>
              <li>If safe, the allocation is confirmed; if unsafe, the process must wait</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;