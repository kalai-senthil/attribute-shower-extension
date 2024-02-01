import { render } from "solid-js/web";
import Overlay from "./Overlay";
import "./style.css";
export function renderOverlay(ele: HTMLElement) {
  return render(Overlay, ele);
}
