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
	},
	{
		id: crypto.randomUUID(),
		title: "System",
		icon: "\n########\n\n SYSTEM \n\n########\n##",
		onInit: (runtime, window) => {
			const saveButton = runtime.gui.Button("SAVE", runtime.saveGame);
			window.element.appendChild(saveButton.element);

			const loadButton = runtime.gui.Button("LOAD", runtime.loadSave);
			window.element.appendChild(loadButton.element);

			const eraseButton = runtime.gui.Button("RESET", runtime.eraseSave);
			window.element.appendChild(eraseButton.element);
		},
	},
	{
		id: crypto.randomUUID(),
		title: "Journal",
		icon: "\n|¯¯¯¯¯¯|\n| NOTE |\n|      |\n| BOOK |\n|      |\n|______|",
		onInit: (runtime, window) => {
			const content = document.createElement("div");
			content.innerHTML = "<p>Under construction.</p>";

			window.element.appendChild(content);
		},
	},
];
