import { describe, it, expect } from 'vitest';
import { KNN, normalize } from './ml';

describe('ML Library Logic', () => {
    it('should correctly normalize values', () => {
        const data = [[1, 10], [2, 20], [3, 30]];
        const normalized = normalize(data);
        
        // Means for [1,2,3] is 2. Std is ~0.816. 
        // 1 should become (1-2)/0.816 = -1.22
        expect(normalized[0][0]).toBeLessThan(0);
        expect(normalized[2][0]).toBeGreaterThan(0);
    });

    it('should predict correct class with KNN', () => {
        const X_train = [[1, 1], [1, 2], [5, 5], [5, 6]];
        const y_train = [0, 0, 1, 1];
        const X_test = [[1.5, 1.5], [4.5, 4.5]];
        
        const knn = new KNN(3);
        const predictions = knn.predict(X_train, y_train, X_test);
        
        expect(predictions[0]).toBe("0");
        expect(predictions[1]).toBe("1");
    });
});
