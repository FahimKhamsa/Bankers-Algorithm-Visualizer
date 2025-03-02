import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Cpu } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Banker's Algorithm Visualizer
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          An interactive visualization tool for understanding the Banker's Algorithm
          used in operating systems for deadlock prevention.
        </p>
        <Link
          to="/simulation"
          className="btn btn-primary inline-flex items-center"
        >
          Start Simulation
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="card hover:bg-dark-card-hover transition-colors duration-300">
          <Shield className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Deadlock Prevention</h2>
          <p className="text-gray-400">
            Learn how the Banker's Algorithm prevents deadlocks by ensuring that resource allocation is always in a safe state.
          </p>
        </div>
        
        <div className="card hover:bg-dark-card-hover transition-colors duration-300">
          <Clock className="h-12 w-12 text-secondary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Step-by-Step Details</h2>
          <p className="text-gray-400">
            Watch the algorithm in action with execution details that illustrate each step of the process.
          </p>
        </div>
        
        <div className="card hover:bg-dark-card-hover transition-colors duration-300">
          <Cpu className="h-12 w-12 text-accent mb-4" />
          <h2 className="text-xl font-semibold mb-2">Interactive Controls</h2>
          <p className="text-gray-400">
            Control the simulation with options to run automatically, step manually, or view the final result instantly.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="card">
          <p className="text-gray-300 mb-4">
            The Banker's Algorithm is a resource allocation and deadlock avoidance algorithm that tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources, and then checks if the system is still in a safe state.
          </p>
          <p className="text-gray-300 mb-4">
            Our visualizer demonstrates this process through an interactive tree-based visualization that shows:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li>Resource allocation states</li>
            <li>Safe sequences of process execution</li>
            <li>Detection of unsafe states</li>
            <li>Step-by-step execution of the algorithm</li>
          </ul>
          <div className="mt-6 text-center">
            <Link to="/simulation" className="btn btn-secondary">
              Try the Simulation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;