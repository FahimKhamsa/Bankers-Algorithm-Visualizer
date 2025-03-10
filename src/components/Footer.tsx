import React from "react";
import { Github, Code } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-card py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Code className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm text-gray-400">
              Banker's Algorithm Visualizer © Fahim Rahman 2025 © assignment in{" "}
              <b>CSE 4501: Operating Systems</b>
            </span>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://github.com/FahimKhamsa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors duration-200"
            >
              <div className="flex items-center">
                <Github className="h-5 w-5" />
                <p className="ml-2">FahimKhamsa</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
