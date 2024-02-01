import { createEffect, createSignal, onMount } from "solid-js";
import { Runtime, Tabs, browser } from "wxt/browser";
function App() {
  const [currentTab, setCurrentTab] = createSignal<string>("");
  const [turnedOn, setTurnedOn] = createSignal(false);
  const [port, setPort] = createSignal<Runtime.Port | undefined>(undefined);
  browser.runtime.onConnect.addListener(function (port) {
    setPort(port);
    port.onMessage.addListener(function (msg: {
      eventType: string;
      data: any;
    }) {
      console.log(msg);
    });
  });
  createEffect(() => {
    const _port = port();
    const _on = turnedOn();
    if (_port) {
      const eventType = _on ? "listen" : "stopListen";
      _port.postMessage({ eventType });
    }
  });
  createEffect(() => {
    const on = turnedOn();
    browser.tabs
      .query({
        active: true,
        lastFocusedWindow: true,
      })
      .then((tabs) => {
        const _tab = tabs.at(0);
        if (on) {
          if (_tab) {
            setCurrentTab(_tab.url ?? "");
          }
        }
      });
  });

  onMount(async () => {
    browser.commands.onCommand.addListener((command) => {
      switch (command) {
        case "turnOn":
          setTurnedOn((e) => !e);
          break;

        default:
          break;
      }
    });
  });
  return (
    <main class="h-32 flex justify-center gap-2 items-center flex-col w-32">
      <p>{currentTab()}</p>
      <h3 class="font-bold text-xl">
        {turnedOn() ? "Turned on" : "Turned Off"}
      </h3>
      <button
        class="bg-blue-300 shadow p-2 rounded-full"
        onClick={() => {
          setTurnedOn((e) => !e);
        }}
      >
        Toggle
      </button>
    </main>
  );
}

export default App;
