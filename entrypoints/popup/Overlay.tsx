import { For, createEffect, createSignal } from "solid-js";
type Attributes = { name: string; value: any }[];
function Overlay() {
  const [attachedListeners, setAttachedListeners] = createSignal(false);
  const [listening, setListening] = createSignal(false);
  const [element, setElement] = createSignal<HTMLElement | undefined>(
    undefined
  );
  const [attributes, setAttributes] = createSignal<Attributes>([]);
  let hightLight: HTMLDivElement | undefined;
  function listenToPointerMove(e: PointerEvent) {
    setElement(
      e.target as HTMLElement
      // document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
    );
  }
  function startPopping() {
    if (!attachedListeners()) {
      document.body.addEventListener("pointermove", listenToPointerMove);
      // document.addEventListener("scroll", (e) => {
      //   if (hightLight) {
      //     setBoundaryBox(hightLight, ele());
      //   }
      // });
      setAttachedListeners(true);
    }
  }
  function stopPopping() {
    document.body.removeEventListener("pointermove", listenToPointerMove);
    setAttachedListeners(false);
  }
  function setBoundaryBox(from: HTMLElement, to: HTMLElement) {
    const { top, right, width, height, left, bottom, x, y } =
      to.getBoundingClientRect();

    from.style.top = `${top + window.scrollY}px`;
    from.style.right = `${right}px`;
    from.style.width = `${width}px`;
    from.style.left = `${left + window.scrollX}px`;
    from.style.height = `${height}px`;
    from.style.bottom = `${y}px`;
  }
  createEffect(() => {
    const ele = element();
    if (hightLight && ele) {
      setBoundaryBox(hightLight, ele);
      const d: Attributes = [];
      ele.getAttributeNames().map((attrName) => {
        d.push({ value: ele.getAttribute(attrName), name: attrName });
      });
      setAttributes(d);
    }
  });
  createEffect(() => {
    if (listening()) {
      startPopping();
    } else {
      stopPopping();
    }
  });
  const port = browser.runtime.connect({ name: "ext" });
  port.onMessage.addListener((message: { eventType: string; data: any }) => {
    const { eventType, data } = message;

    switch (eventType) {
      case "listen":
        setListening(true);

        break;
      case "stopListen":
        setListening(false);
        break;

      default:
        break;
    }
  });
  return (
    <section data-active={listening()}>
      {/* <div
        ref={clickListener}
        classList={{
          "w-full h-full top-0 fixed !z-[100000]": listening(),
        }}
      /> */}
      <div
        classList={{ hidden: !listening() }}
        class={`absolute overflow-visible pointer-events-none border-blue-300 rounded-md border bg-blue-400/50`}
        ref={hightLight}
      >
        <section classList={{ slideAniBack: attributes().length === 0 }}>
          <section class="relative right-1/2 p-2 slideAni bg-white min-w-[400px] max-w-[50vw] rounded-md shadow top-0">
            <ul class="flex flex-col gap-2">
              <For
                each={attributes()}
                children={(item) => {
                  return (
                    <li class="p-2 hover:bg-gray-50">
                      {item.name} = {item.value}
                    </li>
                  );
                }}
              />
            </ul>
          </section>
        </section>
      </div>
    </section>
  );
}

export default Overlay;
function ele(): HTMLElement {
  throw new Error("Function not implemented.");
}
