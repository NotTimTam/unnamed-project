import { Text } from "./engine/core/GUIAnchor.js";
import Runtime from "./engine/core/Runtime.js";

const save = Runtime.createInitialSaveData();

window.runtime = new Runtime(save);

window.runtime.start();

const text = new Text("Hello, world!");
document.body.appendChild(text.element);
text.element.style.fontSize = "32px";

text.onTick = () =>
	text.updateText(
		window.runtime.time.getDateTimeDisplay(false) +
			"\n" +
			window.runtime.time.getEpochDisplay()
	);

/**
 * Build the buisiness of an economy.
 * Such as "how to make a pencil", every
 * component and everything that leads to that component must be done
 * maybe work is done by hand initially.
 * Start at "the dawn of man"
 */
