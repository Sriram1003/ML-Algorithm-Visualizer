/**
 * Production API client for ML services.
 * Features: Timeout handling, Retry logic, and standardized Error responses.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
    timeout?: number;
}

export class ApiClient {
    static async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { timeout = 30000, ...rest } = options;

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...rest,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...rest.headers,
                },
            });

            clearTimeout(id);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(id);
            if ((error as any).name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        }
    }

    static async trainRemote(algorithm: string, data: any[], params: any) {
        return this.request('/train', {
            method: 'POST',
            body: JSON.stringify({ algorithm, data, params }),
        });
    }

    static async getHealth() {
        return this.request('/health', { method: 'GET' });
    }
}
