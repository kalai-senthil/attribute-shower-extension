import { defineConfig } from "wxt";
import Solid from "vite-plugin-solid";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["activeTab"],
    commands: {
      turnOn: {
        suggested_key: {
          default: "Ctrl+Shift+X",
          mac: "Command+Shift+X",
        },
        description: "Turn on Extension",
      },
    },
  },
  vite: () => ({
    build: {
      target: "esnext",
    },
    plugins: [Solid()],
  }),
});
