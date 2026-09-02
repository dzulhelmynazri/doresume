import { defineAgent } from "eve";

export default defineAgent({
  build: { externalDependencies: ["fsevents", "playwright-core"] },
  model: "zai/glm-5.2",
});
