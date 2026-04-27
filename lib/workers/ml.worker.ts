import * as Comlink from 'comlink';
import { 
  SVM, 
  DecisionTree, 
  RandomForest, 
  KNN, 
  LogisticRegression,
  calculateClassificationMetrics,
  trainTestSplit,
  normalize
} from '../ml';

const mlApi = {
  trainSVM: (X: number[][], y: number[], learningRate: number, lambda: number, iterations: number) => {
    const svm = new SVM();
    svm.fit(X, y, learningRate, lambda, iterations);
    return { weights: (svm as any).w, bias: (svm as any).b, losses: svm.losses };
  },
  
  trainLogisticRegression: (X: number[][], y: number[], lr: number, iter: number) => {
    const model = new LogisticRegression();
    model.fit(X, y, lr, iter);
    return { weights: (model as any).weights, bias: (model as any).bias, losses: model.losses };
  },

  runKNN: (X_train: number[][], y_train: any[], X_test: number[][], k: number) => {
    const knn = new KNN(k);
    return knn.predict(X_train, y_train, X_test);
  },

  performMetricsAnalysis: (actual: any[], predicted: any[]) => {
    return calculateClassificationMetrics(actual, predicted);
  },

  splitData: (X: any[][], y: any[], testSize: number) => {
    return trainTestSplit(X, y, testSize);
  },

  prepareData: (X: number[][]) => {
    return normalize(X);
  }
};

Comlink.expose(mlApi);
