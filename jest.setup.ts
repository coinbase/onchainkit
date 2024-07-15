// Jest is an amazing test runner and has some awesome assertion APIs
// built in by default. However, there are times when having more
// specific matchers (assertions) would be far more convenient.
// https://jest-extended.jestcommunity.dev/docs/matchers/
import 'jest-extended';
// Enable jest-dom functions
import '@testing-library/jest-dom';
// biome-ignore lint: Running linting with `unsafe` flag changes import to 'node:util' which breaks the CI. See https://nodejs.org/docs/latest-v18.x/api/util.html
import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
