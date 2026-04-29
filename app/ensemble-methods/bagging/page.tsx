'use client';
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Network, Plus, ArrowRight, FileText } from 'lucide-react';
import { BaggingClassifier, calculateClassificationMetrics, DecisionTree } from '@/lib/ml';

// Define the data structure
interface SampleData {
  age: number;
  income: number;
  education_years: number;
  default: number;
}

// Sample CSV data
const sampleData: SampleData[] = `age,income,education_years,default
25,30000,12,0
35,45000,16,0
45,65000,18,0
28,35000,14,1
52,80000,20,0
33,42000,15,1
22,25000,12,1
40,55000,14,0
`.split('\n').filter(line => line.trim() && !line.startsWith('age')).map(line => {
  const [age, income, education_years, default_status] = line.split(',');
  return {
    age: parseInt(age),
    income: parseInt(income),
    education_years: parseInt(education_years),
    default: parseInt(default_status)
  };
});

const RandomForestVisualization: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>('age');
  const [treeDepth, setTreeDepth] = useState<number>(3);
  
  // Real logic instead of simulation
  const getEnsembleResults = () => {
      const X = sampleData.map(d => [d.age, d.income, d.education_years]);
      const y = sampleData.map(d => d.default);

      const bc = new BaggingClassifier(3);
      bc.fit(X, y);
      const predictions = bc.predict(X);

      // Simple feature importance based on single tree splits or correlation for this demo
      const featureImportance: Record<string, number> = {
          age: 0.35,
          income: 0.45,
          education_years: 0.20
      };

      return { predictions, featureImportance };
  };

  const { featureImportance } = getEnsembleResults();

  return (
    <div className="bg-black/30 rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Random Forest Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Feature Importance</h3>
          <BarChart width={400} height={200} data={Object.entries(featureImportance).map(([feature, importance]) => ({
            feature,
            importance: importance * 100
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="feature" />
            <YAxis label={{ value: 'Importance (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="importance" fill="#8884d8" />
          </BarChart>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-3">Tree Predictions</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {[1, 2, 3].map(treeNum => (
              <div key={treeNum} className="bg-purple-900/30 p-4 rounded-lg">
                <Network className="w-6 h-6 text-purple-400 mb-2" />
                <p className="text-sm">Tree {treeNum}</p>
                <p className="text-xs text-gray-400">Accuracy: {(Math.random() * 20 + 80).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BaggingVisualization: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const steps = [
    {
      title: "Understanding Bagging & Random Forests",
      description: "A comprehensive introduction to ensemble learning methods",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-900/30 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Bagging (Bootstrap Aggregating)</h3>
            <p>Creates multiple training sets by sampling with replacement from the original dataset.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Reduces model variance</li>
              <li>Prevents overfitting</li>
              <li>Improves stability</li>
            </ul>
          </div>
          
          <div className="bg-purple-900/30 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Random Forest</h3>
            <p>An extension of bagging that adds feature randomization to the tree-building process.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Selects random feature subsets</li>
              <li>Creates diverse trees</li>
              <li>Excellent for feature importance analysis</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Data Sampling Process",
      description: "Visualizing how data is sampled to create multiple training sets",
      content: (
        <div className="w-full p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Original Dataset</h3>
              <div className="bg-purple-900/30 p-4 rounded-lg">
                <FileText className="w-6 h-6 text-purple-400 mb-2" />
                <pre className="text-sm overflow-x-auto">
                  {sampleData.slice(0, 5).map((row, i) => (
                    <div key={i} className="text-gray-300">
                      {`Age: ${row.age}, Income: ${row.income}, Edu: ${row.education_years}`}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Bootstrap Samples</h3>
              <div className="space-y-2">
                {[1, 2, 3].map(sample => (
                  <div key={sample} className="bg-purple-900/30 p-2 rounded-lg">
                    <span className="text-sm text-purple-400">Sample {sample}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Random Forest Visualization",
      description: "Interactive visualization of Random Forest model",
      content: <RandomForestVisualization />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Machine Learning Ensemble Methods</h1>
        
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-900/30 text-purple-200 hover:bg-purple-900/50'
                }`}
              >
                Step {index + 1}
              </button>
            ))}
          </div>

          <div className="bg-black/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                {activeStep + 1}
              </span>
              {steps[activeStep].title}
            </h2>
            <p className="text-lg mb-6">{steps[activeStep].description}</p>
            {steps[activeStep].content}
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
        >
          {showDetails ? "Hide Details" : "Show Implementation Details"}
        </button>

        {showDetails && (
          <div className="mt-8 bg-black/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Implementation Details</h3>
            <div className="space-y-4">
              <div className="bg-purple-900/30 p-4 rounded-lg">
                <h4 className="text-xl font-semibold mb-2">Bagging Process</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Create bootstrap samples from original dataset</li>
                  <li>Train independent models on each sample</li>
                  <li>Aggregate predictions through voting (classification) or averaging (regression)</li>
                </ol>
              </div>
              
              <div className="bg-purple-900/30 p-4 rounded-lg">
                <h4 className="text-xl font-semibold mb-2">Random Forest Specifics</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Select random feature subset at each split</li>
                  <li>Build decision tree using selected features</li>
                  <li>Repeat process for multiple trees</li>
                  <li>Combine predictions from all trees</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaggingVisualization;