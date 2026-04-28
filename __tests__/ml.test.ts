import { LinearRegression, KMeans } from '../lib/ml';

describe('Machine Learning Algorithms', () => {
  describe('Linear Regression', () => {
    it('should fit a simple line y = 2x', () => {
      const model = new LinearRegression();
      // y = 2x
      const X = [[1], [2], [3], [4]];
      const y = [2, 4, 6, 8];
      
      model.fit(X, y, 0.01, 1000);
      
      // Weight should be close to 2, bias close to 0
      expect(model.weights[0]).toBeCloseTo(2, 1);
      expect(model.bias).toBeCloseTo(0, 1);
      
      // Prediction for x=5 should be close to 10
      const pred = model.predict([[5]])[0];
      expect(pred).toBeCloseTo(10, 1);
    });
  });

  describe('K-Means Clustering', () => {
    it('should cluster distinct groups correctly', () => {
      const model = new KMeans();
      // Two clear groups: around (0,0) and around (10,10)
      const X = [
        [0, 0], [0, 1], [1, 0],
        [10, 10], [10, 11], [11, 10]
      ];
      
      const result = model.fit(X, 2, 10);
      
      expect(model.centroids).toHaveLength(2);
      expect(model.clusters).toHaveLength(6);
      
      // The first three points should be in the same cluster
      expect(model.clusters[0]).toBe(model.clusters[1]);
      expect(model.clusters[0]).toBe(model.clusters[2]);
      
      // The last three points should be in the same cluster
      expect(model.clusters[3]).toBe(model.clusters[4]);
      expect(model.clusters[3]).toBe(model.clusters[5]);
      
      // The two groups should be in different clusters
      expect(model.clusters[0]).not.toBe(model.clusters[3]);
    });
  });
});
