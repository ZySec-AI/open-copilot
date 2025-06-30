import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
import dotenv from 'dotenv';

// Resolve and print the path to .env in the web directory
const envPath = resolve(__dirname, '../.env');
console.log(`Loading environment variables from: ${envPath}`);

// Load environment variables from .env if it exists
dotenv.config({ path: envPath });

// Determine the API URL based on the mode
const apiURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : process.env.REACT_APP_API_URL;
console.log(`REACT_APP_API_URL set to: ${apiURL}`);

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5471,
    host: '0.0.0.0'
  },
  define: {
    'process.env.REACT_APP_API_URL': JSON.stringify(apiURL)
  }
});
