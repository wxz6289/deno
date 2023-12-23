import { defineConfig } from "npm:vite@^4.3.9";
import react from "npm:@vitejs/plugin-react-swc@^3.3.2";

import "npm:react@^18.2.0";
import "npm:react-dom@^18.2.0/client";
import "npm:react-router-dom@^6.4";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
