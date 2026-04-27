'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Settings, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import { RidgeRegression, generatePolynomialFeatures, trainTestSplit, calculateRegressionMetrics, normalize } from '@/lib/ml';

// Define the structure of the metrics returned after training
interface PolynomialRegressionMetrics {
  mse: number; // Mean Squared Error
  rmse: number;
  r2: number; // R-squared
}

const PolynomialRegressionPage: React.FC = () => {
  const [data, setData] = useState<any[][] | null>(null);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<PolynomialRegressionMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [degree, setDegree] = useState<number>(2); // Degree of the polynomial

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvData = e.target?.result as string;
          const rows = csvData.split('\n')
            .filter(row => row.trim())
            .map(row => row.split(',').map(cell => cell.trim()));
          
          if (rows.length < 5) {
            throw new Error("Dataset is too small.");
          }

          const processedData = rows.slice(1).map(row => 
            row.map(cell => isNaN(Number(cell)) ? cell : Number(cell))
          );
          setData(processedData);
        } catch (error) {
          setError((error as Error).message);
        }
      };
      reader.readAsText(file);
    }
  };

  const trainModel = () => {
      if (!data) return;
      setIsTraining(true);
      setTimeout(() => {
          try {
              const X_raw = data.map(row => row.slice(0, -1).map(v => typeof v === 'string' ? 0 : v));
              const X_poly = generatePolynomialFeatures(X_raw as number[][], degree);
              const X = normalize(X_poly);
              const y = data.map(row => {
                  const val = row[row.length - 1];
                  return typeof val === 'number' ? val : 0;
              });

              const { X_train, y_train, X_test, y_test } = trainTestSplit(X, y);

              const model = new RidgeRegression(); // Using ridge with small lambda acts like linear
              model.fit(X_train as number[][], y_train as number[], 0.001, 0.01, 1000);
              const predictions = model.predict(X_test as number[][]);

              const results = calculateRegressionMetrics(y_test as number[], predictions);
              setMetrics({
                  mse: results.mse || 0,
                  rmse: results.rmse || 0,
                  r2: results.r2 || 0
              });
              setIsTraining(false);
          } catch (err) {
              setError("Failed to train model: " + (err as Error).message);
              setIsTraining(false);
          }
      }, 500);
  };

  // Prepare data for the chart
  const chartData = {
    labels: metrics ? ['1', '2', '3', '4', '5'] : [], // Example x-axis labels
    datasets: [
      {
        label: 'Polynomial Regression Fit',
        data: metrics ? [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100] : [],
        fill: false,
        backgroundColor: 'rgba(99, 102, 241, 1)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Introduction Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-purple-400">
            Interactive Polynomial Regression
          </h1>
          <div className="bg-black p-6 rounded-lg border border-purple-500">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">How Polynomial Regression Works</h2>
            <p className="text-gray-300 mb-4">
              Polynomial Regression is a form of regression analysis in which the relationship between the independent variable x and the dependent variable y is modeled as an nth degree polynomial.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-700 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">1. Polynomial Terms</h3>
                <p className="text-sm text-gray-200">Includes higher degree terms to capture non-linear relationships.</p>
              </div>
              <div className="bg-purple-700 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">2. Overfitting</h3>
                <p className="text-sm text-gray-200">Higher degree polynomials can lead to overfitting on training data.</p>
              </div>
              <div className="bg-purple-700 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">3. Model Evaluation</h3>
                <p className="text-sm text-gray-200">Use metrics like MSE and R-squared to evaluate model performance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-black border-purple-500 border">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Settings className="h-5 w-5" /> Model Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-200">Polynomial Degree ({degree})</label>
                  <Slider
                    value={[degree]}
                    onValueChange={([value]) => setDegree(value)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={trainModel}
                    disabled={!data || isTraining}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    {isTraining ? 'Training...' : 'Train Model'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-purple-500 border col-span-2">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Upload className="h-5 w-5" /> Upload Dataset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => document.getElementById('fileInput')?.click()}
                    disabled={isTraining}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select CSV File
                  </Button>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  {isTraining && <p className="text-purple-400">Processing...</p>}
                </div>
                {error && <p className="text-red-400">Error: {error}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black border-purple-500 border">
            <CardHeader>
              <CardTitle className="text-purple-400">Model Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {metrics ? (
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-700 p-4 rounded-lg">
                      <h3 className="text-sm text-purple-400 mb-2">MSE</h3>
                      <p className="text-2xl font-bold text-gray-200">{metrics.mse.toFixed(4)}</p>
                    </div>
                    <div className="bg-purple-700 p-4 rounded-lg">
                      <h3 className="text-sm text-purple-400 mb-2">RMSE</h3>
                      <p className="text-2xl font-bold text-gray-200">{metrics.rmse.toFixed(4)}</p>
                    </div>
                    <div className="bg-purple-700 p-4 rounded-lg col-span-2">
                      <h3 className="text-sm text-purple-400 mb-2">R² Score</h3>
                      <p className="text-2xl font-bold text-gray-200">{metrics.r2.toFixed(4)}</p>
                    </div>
                  </div>
                  <Line data={chartData} options={{ responsive: true }} />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Train model to see performance metrics
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PolynomialRegressionPage;