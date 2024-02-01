import { renderOverlay } from "./popup/renderOverlay";
export default defineContentScript({
  matches: ["https://*/*"],
  runAt: "document_start",
  main(ctx) {
    ctx.addEventListener(document, "DOMContentLoaded", (e) => {
      const container = document.createElement("div");
      container.id = "attribute-shower";
      document.body.append(container);
      const ui = createIntegratedUi(ctx, {
        position: "inline",
        anchor: "#attribute-shower",
        onMount(wrapper) {
          const unmount = renderOverlay(container);
        },
      });
      ui.mount();
    });
  },
});
