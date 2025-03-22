import Runtime from "./engine/core/Runtime.js";

const save = Runtime.createInitialSaveData();

const runtime = new Runtime(save);
// window.runtime = runtime;

runtime.start();

const window = runtime.gui.Window();

window.move(16, 16);
window.title = "Calendar";

document.body.appendChild(window.element);

const text = runtime.gui.Text("Hello, world!");
window.element.appendChild(text.element);

text.onTick = () =>
	text.updateText(
		runtime.time.getDateTimeDisplay(false) +
			"\n" +
			runtime.time.getEpochDisplay()
	);

/**
 * Build the buisness of an economy.
 * Such as "how to make a pencil", every
 * component and everything that leads to that component must be done
 * maybe work is done by hand initially.
 * Start at "the dawn of man"
 */
