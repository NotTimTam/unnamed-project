export default [
	{
		id: crypto.randomUUID(),
		title: "Calendar",
		icon: "________\n\n| M T W |\n| _ _ _ |\n| _ _ _ |\n| _ _ _ |\n|_______|",
		onInit: (runtime, window) => {
			const text = runtime.gui.Text("Hello, world!");
			window.element.appendChild(text.element);

			text.onTick = () =>
				text.updateText(
					runtime.time.getDateTimeDisplay(false) +
						"\n" +
						runtime.time.getEpochDisplay()
				);
		},
		onTick: (runtime, window) => {},
	},
];

// // ********************************************************
// const systemWindow = runtime.gui.desktop.Window();

// systemWindow.move(512, 128);
// systemWindow.title = "System";

// const saveButton = runtime.gui.Button("SAVE", runtime.saveGame);
// systemWindow.element.appendChild(saveButton.element);

// const loadButton = runtime.gui.Button("LOAD", runtime.loadSave);
// systemWindow.element.appendChild(loadButton.element);

// const eraseButton = runtime.gui.Button("RESET", runtime.eraseSave);
// systemWindow.element.appendChild(eraseButton.element);

// document.body.appendChild(systemWindow.element);

// // ********************************************************
// const journalWindow = runtime.gui.desktop.Window();

// journalWindow.move(16, 256);
// journalWindow.title = "Journal";

// document.body.appendChild(journalWindow.element);
