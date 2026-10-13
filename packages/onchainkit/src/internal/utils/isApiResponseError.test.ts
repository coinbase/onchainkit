import { describe, expect, it } from 'vitest';
import { isApiError } from './isApiResponseError';

describe('isApiError', () => {
    describe('returns true for valid API error responses', () => {
        it('should return true for an object with an error property', () => {
            const response = { error: 'Something went wrong' };
            expect(isApiError(response)).toBe(true);
        });

        it('should return true for an object with an error object containing message and code', () => {
            const response = {
                error: {
                    message: 'Invalid request',
                    code: 400,
                },
            };
            expect(isApiError(response)).toBe(true);
        });

        it('should return true for an object with error set to null', () => {
            const response = { error: null };
            expect(isApiError(response)).toBe(true);
        });

        it('should return true for an object with error set to undefined', () => {
            const response = { error: undefined };
            expect(isApiError(response)).toBe(true);
        });

        it('should return true for an object with error set to empty string', () => {
            const response = { error: '' };
            expect(isApiError(response)).toBe(true);
        });

        it('should return true for an object with additional properties alongside error', () => {
            const response = {
                error: 'Error occurred',
                data: null,
                status: 500,
            };
            expect(isApiError(response)).toBe(true);
        });
    });

    describe('returns false for non-API error responses', () => {
        it('should return false for null', () => {
            expect(isApiError(null)).toBe(false);
        });

        it('should return false for undefined', () => {
            expect(isApiError(undefined)).toBe(false);
        });

        it('should return false for an empty object', () => {
            expect(isApiError({})).toBe(false);
        });

        it('should return false for an object without error property', () => {
            const response = { data: 'some data', status: 200 };
            expect(isApiError(response)).toBe(false);
        });

        it('should return false for a string', () => {
            expect(isApiError('error')).toBe(false);
        });

        it('should return false for a number', () => {
            expect(isApiError(500)).toBe(false);
        });

        it('should return false for a boolean', () => {
            expect(isApiError(true)).toBe(false);
        });

        it('should return false for an array', () => {
            expect(isApiError(['error'])).toBe(false);
        });

        it('should return false for an array with error-like objects', () => {
            expect(isApiError([{ error: 'test' }])).toBe(false);
        });

        it('should return false for a function', () => {
            expect(isApiError(() => { })).toBe(false);
        });
    });
});
