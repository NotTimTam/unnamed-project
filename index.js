import { Text } from "./engine/core/GUIAnchor.js";
import Runtime from "./engine/core/Runtime.js";

const save = Runtime.createInitialSaveFile();

window.runtime = new Runtime(save);

window.runtime.start();

const text = new Text("Hello, world!");
document.body.appendChild(text.element);

text.updateText("HEHEHE");

/**
 * Build the buisiness of an economy.
 * Such as "how to make a pencil", every
 * component and everything that leads to that component must be done
 * maybe work is done by hand initially.
 * Start at "the dawn of man"
 *
 * Timescale:
 * Second, Minute, Hour, Day
 * Week, Year, Decade (10 years), Century (10 decades),
 * Era (1000 years), Age (10000 years)
 */
