import swc from '@rollup/plugin-swc';

export default {
  input: 'lib/index.ts',
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs'
  },
  plugins: [swc()]
};