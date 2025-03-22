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

// ********************************************************
const systemWindow = runtime.gui.Window();

systemWindow.move(512, 128);
systemWindow.title = "System";

const saveButton = runtime.gui.Button("SAVE", runtime.saveGame);
systemWindow.element.appendChild(saveButton.element);

const loadButton = runtime.gui.Button("LOAD", runtime.loadSave);
systemWindow.element.appendChild(loadButton.element);

const eraseButton = runtime.gui.Button("RESET", runtime.eraseSave);
systemWindow.element.appendChild(eraseButton.element);

document.body.appendChild(systemWindow.element);

/**
 * Build the buisness of an economy.
 * Such as "how to make a pencil", every
 * component and everything that leads to that component must be done
 * maybe work is done by hand initially.
 * Start at "the dawn of man"
 */
