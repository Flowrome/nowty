import { defineConfig, loadEnv,  } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from 'vite-tsconfig-paths'

export default ({ mode }) => {
  const env = loadEnv(mode, `${process.cwd()}/envs`, '')

  return defineConfig({
    envPrefix: "FE",
    envDir: "envs",
    plugins: [react(), tsconfigPaths()],
    server: {
      host: env.FE_HOST,
      port: Number(env.FE_PORT),
    },
    preview: {
      host: env.FE_HOST,
      port: Number(env.FE_PORT),
    },
  });
};
