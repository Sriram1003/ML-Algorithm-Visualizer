
export interface Metrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1?: number;
  mse?: number;
  rmse?: number;
  r2?: number;
}

export function trainTestSplit(X: any[][], y: any[], testSize: number = 0.2) {
  const n = X.length;
  const indices = Array.from({ length: n }, (_, i) => i).sort(() => Math.random() - 0.5);
  const testCount = Math.floor(n * testSize);
  const testIndices = indices.slice(0, testCount);
  const trainIndices = indices.slice(testCount);

  return {
    X_train: trainIndices.map(i => X[i]),
    y_train: trainIndices.map(i => y[i]),
    X_test: testIndices.map(i => X[i]),
    y_test: testIndices.map(i => y[i])
  };
}

export function calculateClassificationMetrics(actual: any[], predicted: any[]): Metrics {
  const classes = Array.from(new Set(actual));
  const accuracy = actual.filter((a, i) => String(a) === String(predicted[i])).length / actual.length;

  let totalPrecision = 0;
  let totalRecall = 0;

  classes.forEach(cls => {
    const tp = actual.filter((a, i) => String(a) === String(cls) && String(predicted[i]) === String(cls)).length;
    const fp = actual.filter((a, i) => String(a) !== String(cls) && String(predicted[i]) === String(cls)).length;
    const fn = actual.filter((a, i) => String(a) === String(cls) && String(predicted[i]) !== String(cls)).length;

    totalPrecision += (tp + fp) === 0 ? 0 : tp / (tp + fp);
    totalRecall += (tp + fn) === 0 ? 0 : tp / (tp + fn);
  });

  const precision = totalPrecision / classes.length;
  const recall = totalRecall / classes.length;
  const f1 = (precision + recall) === 0 ? 0 : 2 * (precision * recall) / (precision + recall);

  return { accuracy, precision, recall, f1 };
}

export function calculateConfusionMatrix(actual: any[], predicted: any[]) {
    const classes = Array.from(new Set([...actual, ...predicted])).sort();
    const matrix = classes.map((actualCls) => {
        return classes.map((predCls) => {
            return actual.filter((a, i) => String(a) === String(actualCls) && String(predicted[i]) === String(predCls)).length;
        });
    });
    return { classes, matrix };
}

export function calculateRegressionMetrics(actual: number[], predicted: number[]): Metrics {
  const n = actual.length;
  const mse = actual.reduce((sum, a, i) => sum + Math.pow(a - predicted[i], 2), 0) / n;
  const rmse = Math.sqrt(mse);
  
  const meanActual = actual.reduce((sum, a) => sum + a, 0) / n;
  const ssTotal = actual.reduce((sum, a) => sum + Math.pow(a - meanActual, 2), 0) || 0.0001;
  const ssRes = actual.reduce((sum, a, i) => sum + Math.pow(a - predicted[i], 2), 0);
  const r2 = 1 - (ssRes / ssTotal);

  return { mse, rmse, r2 };
}

export function normalize(X: number[][]) {
    const nFeatures = X[0].length;
    const means = Array(nFeatures).fill(0).map((_, j) => X.reduce((sum, row) => sum + row[j], 0) / X.length);
    const stds = Array(nFeatures).fill(0).map((_, j) => Math.sqrt(X.reduce((sum, row) => sum + Math.pow(row[j] - means[j], 2), 0) / X.length) || 0.0001);
    
    return X.map(row => row.map((val, j) => (val - means[j]) / stds[j]));
}

export class LinearRegression {
  public weights: number[] = [];
  public bias: number = 0;
  public losses: number[] = [];

  fit(X: number[][], y: number[], learningRate: number = 0.01, iterations: number = 1000) {
    const nSamples = X.length;
    const nFeatures = X[0].length;
    this.weights = new Array(nFeatures).fill(0);
    this.bias = 0;
    this.losses = [];

    for (let i = 0; i < iterations; i++) {
      let epochLoss = 0;
      let dw = new Array(nFeatures).fill(0);
      let db = 0;

      for (let j = 0; j < nSamples; j++) {
        const prediction = X[j].reduce((sum, val, k) => sum + val * this.weights[k], this.bias);
        const error = prediction - y[j];
        epochLoss += error * error;
        
        for (let k = 0; k < nFeatures; k++) {
          dw[k] += (2 / nSamples) * error * X[j][k];
        }
        db += (2 / nSamples) * error;
      }

      for (let k = 0; k < nFeatures; k++) {
        this.weights[k] -= learningRate * dw[k];
      }
      this.bias -= learningRate * db;
      
      if (i % 10 === 0) this.losses.push(epochLoss / nSamples);
    }
  }

  predict(X: number[][]) {
    return X.map(sample => sample.reduce((sum, val, k) => sum + val * this.weights[k], this.bias));
  }
}

// KNN
export class KNN {
  constructor(private k: number) {}

  predict(X_train: number[][], y_train: any[], X_test: number[][]) {
    return X_test.map(testPoint => {
      const distances = X_train.map((trainPoint, i) => ({
        dist: Math.sqrt(testPoint.reduce((sum, val, j) => sum + Math.pow(val - trainPoint[j], 2), 0)),
        label: y_train[i]
      }));
      distances.sort((a, b) => a.dist - b.dist);
      const kNearest = distances.slice(0, this.k);
      const votes: Record<any, number> = {};
      kNearest.forEach(n => votes[n.label] = (votes[n.label] || 0) + 1);
      return Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
    });
  }
}

// Logistic Regression
export class LogisticRegression {
    private weights: number[] = [];
    private bias: number = 0;
    public losses: number[] = [];

    sigmoid(z: number) {
        return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));
    }

    fit(X: number[][], y: number[], learningRate: number = 0.01, iterations: number = 1000) {
        const nFeatures = X[0].length;
        const nSamples = X.length;
        this.weights = new Array(nFeatures).fill(0);
        this.bias = 0;
        this.losses = [];

        for (let i = 0; i < iterations; i++) {
            let epochLoss = 0;
            X.forEach((sample, idx) => {
                const linearModel = sample.reduce((sum, val, j) => sum + val * this.weights[j], this.bias);
                const prediction = this.sigmoid(linearModel);
                const error = prediction - y[idx];

                // Log Loss: - (y * log(p) + (1-y) * log(1-p))
                const p = Math.max(0.0001, Math.min(0.9999, prediction));
                epochLoss += -(y[idx] * Math.log(p) + (1 - y[idx]) * Math.log(1 - p));

                this.weights = this.weights.map((w, j) => w - learningRate * error * sample[j]);
                this.bias -= learningRate * error;
            });
            if (i % 10 === 0) this.losses.push(epochLoss / nSamples);
        }
    }

    predict(X: number[][]) {
        return X.map(sample => {
            const linearModel = sample.reduce((sum, val, j) => sum + val * this.weights[j], this.bias);
            return this.sigmoid(linearModel) >= 0.5 ? 1 : 0;
        });
    }
}

// K-Means Clustering
export class KMeans {
    public centroids: number[][] = [];
    public clusters: number[] = [];

    fit(X: number[][], k: number = 3, maxIterations: number = 100) {
        if (X.length === 0) return;
        const nFeatures = X[0].length;
        
        // Initialize centroids randomly
        this.centroids = Array.from({ length: k }, () => X[Math.floor(Math.random() * X.length)].slice());
        this.clusters = new Array(X.length).fill(-1);

        let hasChanged = true;
        let iter = 0;

        while (hasChanged && iter < maxIterations) {
            hasChanged = false;
            
            // Assign points to nearest centroid
            for (let i = 0; i < X.length; i++) {
                let minDist = Infinity;
                let clusterIndex = -1;
                
                for (let j = 0; j < k; j++) {
                    const dist = Math.sqrt(X[i].reduce((sum, val, d) => sum + Math.pow(val - this.centroids[j][d], 2), 0));
                    if (dist < minDist) {
                        minDist = dist;
                        clusterIndex = j;
                    }
                }
                
                if (this.clusters[i] !== clusterIndex) {
                    this.clusters[i] = clusterIndex;
                    hasChanged = true;
                }
            }

            // Update centroids
            const newCentroids = Array.from({ length: k }, () => new Array(nFeatures).fill(0));
            const counts = new Array(k).fill(0);

            for (let i = 0; i < X.length; i++) {
                const clusterId = this.clusters[i];
                if (clusterId !== -1) {
                    counts[clusterId]++;
                    for (let d = 0; d < nFeatures; d++) {
                        newCentroids[clusterId][d] += X[i][d];
                    }
                }
            }

            for (let j = 0; j < k; j++) {
                if (counts[j] > 0) {
                    for (let d = 0; d < nFeatures; d++) {
                        this.centroids[j][d] = newCentroids[j][d] / counts[j];
                    }
                }
            }
            
            iter++;
        }
        return { iterations: iter };
    }
}

// Naive Bayes (Gaussian)
export class NaiveBayes {
  private classes: any[] = [];
  private stats: Record<any, { mean: number[], std: number[], prior: number }> = {};

  fit(X: number[][], y: any[]) {
    this.classes = Array.from(new Set(y));
    const nSamples = X.length;

    this.classes.forEach(cls => {
        const classSamples = X.filter((_, i) => String(y[i]) === String(cls));
        const prior = classSamples.length / nSamples;
        const nFeatures = X[0].length;
        
        const mean = Array(nFeatures).fill(0).map((_, j) => 
            classSamples.reduce((sum, sample) => sum + sample[j], 0) / classSamples.length
        );
        
        const std = Array(nFeatures).fill(0).map((_, j) => 
            Math.sqrt(classSamples.reduce((sum, sample) => sum + Math.pow(sample[j] - mean[j], 2), 0) / classSamples.length) || 0.0001
        );

        this.stats[cls] = { mean, std, prior };
    });
  }

  predict(X: number[][]) {
    return X.map(sample => {
        const posteriors = this.classes.map(cls => {
            const { mean, std, prior } = this.stats[cls];
            const logLikelihood = sample.reduce((sum, val, j) => {
                const exponent = -Math.pow(val - mean[j], 2) / (2 * Math.pow(std[j], 2));
                return sum + Math.log(1 / (Math.sqrt(2 * Math.PI) * std[j]) || 0.0001) + exponent;
            }, 0);
            return Math.log(prior || 0.0001) + logLikelihood;
        });
        return this.classes[posteriors.indexOf(Math.max(...posteriors))];
    });
  }
}

interface TreeNode {
    leaf: boolean;
    value?: any;
    featureIndex?: number;
    threshold?: number;
    left?: TreeNode;
    right?: TreeNode;
}

// Decision Tree
export class DecisionTree {
    private root: TreeNode | null = null;
    constructor(private maxDepth: number = 5) {}

    fit(X: number[][], y: any[]) {
        this.root = this.buildTree(X, y, 0);
    }

    private buildTree(X: number[][], y: any[], depth: number): TreeNode {
        const nSamples = X.length;
        const nLabels = new Set(y).size;

        if (depth >= this.maxDepth || nLabels === 1 || nSamples < 2) {
            return { leaf: true, value: this.mostCommon(y) };
        }

        const bestSplit = this.getBestSplit(X, y);
        if (!bestSplit) return { leaf: true, value: this.mostCommon(y) };

        const leftX: number[][] = [];
        const leftY: any[] = [];
        const rightX: number[][] = [];
        const rightY: any[] = [];

        X.forEach((sample, i) => {
            if (sample[bestSplit.featureIndex] < bestSplit.threshold) {
                leftX.push(sample);
                leftY.push(y[i]);
            } else {
                rightX.push(sample);
                rightY.push(y[i]);
            }
        });

        return {
            leaf: false,
            featureIndex: bestSplit.featureIndex,
            threshold: bestSplit.threshold,
            left: this.buildTree(leftX, leftY, depth + 1),
            right: this.buildTree(rightX, rightY, depth + 1)
        };
    }

    private getBestSplit(X: number[][], y: any[]) {
        let bestGain = -1;
        let split: { featureIndex: number, threshold: number } | null = null;
        const nFeatures = X[0].length;

        for (let i = 0; i < nFeatures; i++) {
            const thresholds = Array.from(new Set(X.map(s => s[i])));
            thresholds.forEach(t => {
                const gain = this.informationGain(X, y, i, t);
                if (gain > bestGain) {
                    bestGain = gain;
                    split = { featureIndex: i, threshold: t };
                }
            });
        }
        return split;
    }

    private entropy(y: any[]) {
        const counts: Record<any, number> = {};
        y.forEach(label => counts[label] = (counts[label] || 0) + 1);
        return Object.values(counts).reduce((acc, count) => {
            const p = count / y.length;
            return acc - p * Math.log2(p);
        }, 0);
    }

    private informationGain(X: number[][], y: any[], featureIndex: number, threshold: number) {
        const parentEntropy = this.entropy(y);
        const leftY = y.filter((_, i) => X[i][featureIndex] < threshold);
        const rightY = y.filter((_, i) => X[i][featureIndex] >= threshold);

        if (leftY.length === 0 || rightY.length === 0) return 0;

        const childEntropy = (leftY.length / y.length) * this.entropy(leftY) + (rightY.length / y.length) * this.entropy(rightY);
        return parentEntropy - childEntropy;
    }

    private mostCommon(y: any[]) {
        if (y.length === 0) return null;
        const counts: Record<any, number> = {};
        y.forEach(label => counts[label] = (counts[label] || 0) + 1);
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    }

    predict(X: number[][]) {
        if (!this.root) return new Array(X.length).fill(null);
        return X.map(sample => this.traverse(sample, this.root as TreeNode));
    }

    private traverse(sample: number[], node: TreeNode): any {
        if (node.leaf) return node.value;
        if (node.featureIndex !== undefined && node.threshold !== undefined && sample[node.featureIndex] < node.threshold) {
            return node.left ? this.traverse(sample, node.left) : node.value;
        }
        return node.right ? this.traverse(sample, node.right) : node.value;
    }
}

// Random Forest
export class RandomForest {
    private trees: DecisionTree[] = [];
    constructor(private nTrees: number = 10, private maxDepth: number = 5) {}

    fit(X: number[][], y: any[]) {
        this.trees = [];
        for (let i = 0; i < this.nTrees; i++) {
            const { X_boot, y_boot } = this.bootstrap(X, y);
            const tree = new DecisionTree(this.maxDepth);
            tree.fit(X_boot, y_boot);
            this.trees.push(tree);
        }
    }

    private bootstrap(X: number[][], y: any[]) {
        const n = X.length;
        const X_boot: number[][] = [];
        const y_boot: any[] = [];
        for (let i = 0; i < n; i++) {
            const idx = Math.floor(Math.random() * n);
            X_boot.push(X[idx]);
            y_boot.push(y[idx]);
        }
        return { X_boot, y_boot };
    }

    predict(X: number[][]) {
        const treePredictions = this.trees.map(tree => tree.predict(X));
        return X.map((_, i) => {
            const votes: Record<any, number> = {};
            treePredictions.forEach(pred => {
                const p = pred[i];
                votes[p] = (votes[p] || 0) + 1;
            });
            return Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
        });
    }
}

// Ridge Regression
export class RidgeRegression {
    private coefficients: number[] = [];
    private intercept: number = 0;

    fit(X: number[][], y: number[], lambda: number = 1.0, learningRate: number = 0.01, iterations: number = 1000) {
        const nSamples = X.length;
        const nFeatures = X[0].length;
        this.coefficients = new Array(nFeatures).fill(0);
        this.intercept = 0;

        for (let k = 0; k < iterations; k++) {
            let dw = new Array(nFeatures).fill(0);
            let db = 0;

            for (let i = 0; i < nSamples; i++) {
                const prediction = X[i].reduce((sum, val, j) => sum + val * this.coefficients[j], this.intercept);
                const error = prediction - y[i];
                for (let j = 0; j < nFeatures; j++) {
                    dw[j] += error * X[i][j];
                }
                db += error;
            }

            this.coefficients = this.coefficients.map((w, j) => w - learningRate * (dw[j] + lambda * w) / nSamples);
            this.intercept -= learningRate * db / nSamples;
        }
    }

    predict(X: number[][]) {
        return X.map(sample => sample.reduce((sum, val, j) => sum + val * this.coefficients[j], this.intercept));
    }
}

// Polynomial Features
export function generatePolynomialFeatures(X: number[][], degree: number) {
    if (degree <= 1) return X;
    return X.map(row => {
        let newRow = [...row];
        for (let d = 2; d <= degree; d++) {
            row.forEach(val => newRow.push(Math.pow(val, d)));
        }
        return newRow;
    });
}

// Bagging Classifier
export class BaggingClassifier {
    private models: DecisionTree[] = [];
    constructor(private nEstimators: number = 10) {}

    fit(X: number[][], y: any[]) {
        this.models = [];
        for (let i = 0; i < this.nEstimators; i++) {
            const { X_boot, y_boot } = this.bootstrap(X, y);
            const model = new DecisionTree(10);
            model.fit(X_boot, y_boot);
            this.models.push(model);
        }
    }

    private bootstrap(X: number[][], y: any[]) {
        const n = X.length;
        const X_boot: number[][] = [];
        const y_boot: any[] = [];
        for (let i = 0; i < n; i++) {
            const idx = Math.floor(Math.random() * n);
            X_boot.push(X[idx]);
            y_boot.push(y[idx]);
        }
        return { X_boot, y_boot };
    }

    predict(X: number[][]) {
        const predictions = this.models.map(m => m.predict(X));
        return X.map((_, i) => {
            const votes: Record<any, number> = {};
            predictions.forEach(p => votes[p[i]] = (votes[p[i]] || 0) + 1);
            return Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
        });
    }
}

// Q-Learning
export class QLearning {
    public qTable: Record<string, number[]> = {};
    constructor(
        private nActions: number,
        private learningRate = 0.1,
        private discountFactor = 0.9,
        private epsilon = 0.1
    ) {}

    getQ(state: string): number[] {
        if (!this.qTable[state]) {
            this.qTable[state] = new Array(this.nActions).fill(0);
        }
        return this.qTable[state];
    }

    chooseAction(state: string): number {
        if (Math.random() < this.epsilon) {
            return Math.floor(Math.random() * this.nActions);
        }
        const qs = this.getQ(state);
        let maxVal = Math.max(...qs);
        const actions = qs.map((q, i) => q === maxVal ? i : -1).filter(i => i !== -1);
        return actions[Math.floor(Math.random() * actions.length)];
    }

    update(state: string, action: number, reward: number, nextState: string) {
        const currentQ = this.getQ(state)[action];
        const nextMaxQ = Math.max(...this.getQ(nextState));
        const newQ = currentQ + this.learningRate * (reward + this.discountFactor * nextMaxQ - currentQ);
        this.qTable[state][action] = newQ;
    }
}

export class SVM {
    private w: number[] = [];
    private b: number = 0;
    public losses: number[] = [];

    fit(X: number[][], y: number[], learningRate: number = 0.001, lambda: number = 0.01, iterations: number = 1000) {
        const nSamples = X.length;
        const nFeatures = X[0].length;
        this.w = new Array(nFeatures).fill(0);
        this.b = 0;
        this.losses = [];

        const y_svm = y.map(val => val === 0 ? -1 : val);

        for (let i = 0; i < iterations; i++) {
            let epochLoss = 0;
            for (let j = 0; j < nSamples; j++) {
                const linearModel = X[j].reduce((sum, val, k) => sum + val * this.w[k], this.b);
                const condition = y_svm[j] * linearModel >= 1;
                
                // Hinge Loss: max(0, 1 - y * (w*x + b))
                epochLoss += Math.max(0, 1 - y_svm[j] * linearModel);

                if (condition) {
                    this.w = this.w.map(val => val - learningRate * (2 * lambda * val));
                } else {
                    this.w = this.w.map((val, k) => val - learningRate * (2 * lambda * val - X[j][k] * y_svm[j]));
                    this.b -= learningRate * (-y_svm[j]);
                }
            }
            if (i % 10 === 0) this.losses.push(epochLoss / nSamples);
        }
    }

    predict(X: number[][]) {
        return X.map(sample => {
            const val = sample.reduce((sum, v, i) => sum + v * this.w[i], this.b);
            return val >= 0 ? 1 : 0;
        });
    }
}

export class XGBoost {
    private trees: DecisionTree[] = [];
    private learningRate: number = 0.1;

    constructor(private nEstimators: number = 10, learningRate: number = 0.1) {
        this.learningRate = learningRate;
    }

    fit(X: number[][], y: number[]) {
        this.trees = [];
        let currentPredictions = new Array(X.length).fill(0);

        for (let i = 0; i < this.nEstimators; i++) {
            const residuals = y.map((label, idx) => label - currentPredictions[idx]);
            const tree = new DecisionTree(3);
            tree.fit(X, residuals);
            this.trees.push(tree);

            const leafPredictions = tree.predict(X);
            currentPredictions = currentPredictions.map((p, idx) => p + this.learningRate * leafPredictions[idx]);
        }
    }

    predict(X: number[][]) {
        let predictions = new Array(X.length).fill(0);
        this.trees.forEach(tree => {
            const p = tree.predict(X);
            predictions = predictions.map((val, idx) => val + this.learningRate * p[idx]);
        });
        return predictions.map(p => p >= 0.5 ? 1 : 0);
    }
}

// Principal Component Analysis (PCA)
export class PCA {
    private components: number[][] = [];
    private mean: number[] = [];

    fit(X: number[][], nComponents: number = 2) {
        const nSamples = X.length;
        if (X.length === 0) return;
        const nFeatures = X[0].length;

        // 1. Mean centering
        this.mean = new Array(nFeatures).fill(0).map((_, j) => 
            X.reduce((sum, row) => sum + row[j], 0) / nSamples
        );
        const X_centered = X.map(row => row.map((val, j) => val - this.mean[j]));

        // 2. Power Iteration for Eigenvectors
        this.components = [];
        let X_remaining = [...X_centered];

        for (let i = 0; i < nComponents; i++) {
            let eigenvector = new Array(nFeatures).fill(0).map(() => Math.random());
            
            for (let iter = 0; iter < 100; iter++) {
                let next_v = new Array(nFeatures).fill(0);
                for (let r = 0; r < nSamples; r++) {
                    const dot = X_remaining[r].reduce((sum, val, j) => sum + val * eigenvector[j], 0);
                    for (let j = 0; j < nFeatures; j++) {
                        next_v[j] += dot * X_remaining[r][j];
                    }
                }
                const norm = Math.sqrt(next_v.reduce((sum, val) => sum + val * val, 0)) || 1;
                eigenvector = next_v.map(v => v / norm);
            }

            this.components.push(eigenvector);

            X_remaining = X_remaining.map(row => {
                const projection = row.reduce((sum, val, j) => sum + val * eigenvector[j], 0);
                return row.map((val, j) => val - projection * eigenvector[j]);
            });
        }
    }

    transform(X: number[][]) {
        const X_centered = X.map(row => row.map((val, j) => val - this.mean[j]));
        return X_centered.map(row => 
            this.components.map(comp => 
                row.reduce((sum, val, j) => sum + val * comp[j], 0)
            )
        );
    }
}
