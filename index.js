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

let currentFileHandle = null;

const saveButton = runtime.gui.Button("Save", async () => {
	// If we don't have a file handle yet, ask the user for one.
	if (!currentFileHandle) {
		currentFileHandle = await showSaveFilePicker({
			id: "unnamed-project-saves",
			startIn: "downloads",
			suggestedName: `my-save-${new Date().toISOString()}`,
			types: [
				{
					description: "A unnamed-project game save file.",
					accept: { "application/json": [".json"] },
				},
			],
		});
	}

	// Create a writable stream from the file handle and write our JSON data.
	const writable = await currentFileHandle.createWritable();
	await writable.write(JSON.stringify(runtime.save));
	await writable.close();
});

systemWindow.element.appendChild(saveButton.element);

const loadButton = runtime.gui.Button("Load", async () => {
	// If we don't have a file handle yet, ask the user to choose one.
	if (!currentFileHandle) {
		// Open the file picker for a single JSON file
		const [fileHandle] = await showOpenFilePicker({
			id: "unnamed-project-saves",
			startIn: "downloads",
			types: [
				{
					description: "A unnamed-project game save file.",
					accept: { "application/json": [".json"] },
				},
			],
			multiple: false,
		});
		currentFileHandle = fileHandle;
	}

	// Get the file from the handle
	const file = await currentFileHandle.getFile();
	// Read the file's text content
	const content = await file.text();
	// Parse the JSON data
	runtime.save = JSON.parse(content);
});

systemWindow.element.appendChild(loadButton.element);

document.body.appendChild(systemWindow.element);

/**
 * Build the buisness of an economy.
 * Such as "how to make a pencil", every
 * component and everything that leads to that component must be done
 * maybe work is done by hand initially.
 * Start at "the dawn of man"
 */
