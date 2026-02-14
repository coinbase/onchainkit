import { describe, expect, it } from 'vitest';
import { prefixStringParts } from './prefixStringParts';

describe('prefixStringParts', () => {
    describe('basic prefixing', () => {
        it('should prefix a single word', () => {
            expect(prefixStringParts('hello', 'ock-')).toBe('ock-hello');
        });

        it('should prefix multiple words separated by spaces', () => {
            expect(prefixStringParts('hello world', 'ock-')).toBe('ock-hello ock-world');
        });

        it('should prefix words separated by multiple spaces', () => {
            expect(prefixStringParts('hello  world', 'ock-')).toBe('ock-hello  ock-world');
        });

        it('should prefix words with tabs', () => {
            expect(prefixStringParts('hello\tworld', 'ock-')).toBe('ock-hello\tock-world');
        });

        it('should prefix words with newlines', () => {
            expect(prefixStringParts('hello\nworld', 'ock-')).toBe('ock-hello\nock-world');
        });

        it('should prefix words with mixed whitespace', () => {
            expect(prefixStringParts('hello \t\n world', 'ock-')).toBe('ock-hello \t\n ock-world');
        });
    });

    describe('edge cases', () => {
        it('should return empty string for empty input', () => {
            expect(prefixStringParts('', 'ock-')).toBe('');
        });

        it('should return whitespace-only string unchanged', () => {
            expect(prefixStringParts('   ', 'ock-')).toBe('   ');
        });

        it('should handle empty prefix', () => {
            expect(prefixStringParts('hello world', '')).toBe('hello world');
        });

        it('should handle prefix with special regex characters', () => {
            expect(prefixStringParts('hello world', '.*-')).toBe('.*-hello .*-world');
        });
    });

    describe('already prefixed strings', () => {
        it('should not double-prefix already prefixed words', () => {
            expect(prefixStringParts('ock-hello world', 'ock-')).toBe('ock-hello ock-world');
        });

        it('should not double-prefix when all words are already prefixed', () => {
            expect(prefixStringParts('ock-hello ock-world', 'ock-')).toBe('ock-hello ock-world');
        });

        it('should handle partial prefix match correctly', () => {
            expect(prefixStringParts('ock hello', 'ock-')).toBe('ock-ock ock-hello');
        });
    });

    describe('complex strings', () => {
        it('should prefix CSS class names', () => {
            expect(prefixStringParts('bg-blue-500 text-white', 'ock-')).toBe(
                'ock-bg-blue-500 ock-text-white'
            );
        });

        it('should handle strings with numbers', () => {
            expect(prefixStringParts('class1 class2 class3', 'prefix-')).toBe(
                'prefix-class1 prefix-class2 prefix-class3'
            );
        });

        it('should handle strings with special characters in words', () => {
            expect(prefixStringParts('hello-world foo_bar', 'pre-')).toBe(
                'pre-hello-world pre-foo_bar'
            );
        });

        it('should handle leading whitespace', () => {
            expect(prefixStringParts('  hello', 'ock-')).toBe('  ock-hello');
        });

        it('should handle trailing whitespace', () => {
            expect(prefixStringParts('hello  ', 'ock-')).toBe('ock-hello  ');
        });
    });
});
