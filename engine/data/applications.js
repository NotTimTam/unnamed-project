import Time from "../core/Time.js";

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
			content.className = "journal-content";

			window.element.appendChild(content);

			window.resetDisplay = () => {
				const display = window.element.querySelector(
					"div.journal-content"
				);

				display.innerHTML = null;

				return display;
			};

			window.showEditor = () => {
				const display = window.resetDisplay();

				const input = document.createElement("textarea");
				input.placeholder = "Begin writing here...";

				display.appendChild(input);

				display.appendChild(
					runtime.gui.Button("SAVE", () => {
						runtime.save.player.journal.push({
							data: input.value.trim(),
							time: runtime.save.time,
						});

						window.showList();
					}).element
				);
			};

			window.showReader = (content) => {
				const display = window.resetDisplay();

				const contentDisplay = document.createElement("p");
				contentDisplay.innerHTML = content;
				contentDisplay.className = "journal-entry-content";

				display.appendChild(contentDisplay);

				display.appendChild(
					runtime.gui.Button("CLOSE", () => {
						window.showList();
					}).element
				);
			};

			window.showList = () => {
				const display = window.resetDisplay();

				display.innerHTML = `<p>Total journal entries: ${runtime.save.player.journal.length}</p>`;

				if (runtime.save.player.journal.length > 0) {
					const list = runtime.gui.Anchor(
						document.createElement("ul")
					);
					list.element.className = "journal-entry-list";

					for (let i in runtime.save.player.journal) {
						const entry = runtime.save.player.journal[i];

						const entryDisplay = document.createElement("li");

						const button = document.createElement("button");
						button.type = "button";

						const timeDisplay = new Time(
							undefined,
							entry.time
						).getDateTimeDisplay(true);

						button.innerHTML = `
                            <h3>Entry ${String(+i + 1).padStart(4, "0")}</h3>
                            <p id="date">${timeDisplay}</p>
                            <p id="start">${
								entry.data.trim().slice(0, 16).trim() + "..."
							}</p>
                        `;

						button.onclick = () =>
							window.showReader(
								timeDisplay + "<br><br>" + entry.data
							);

						entryDisplay.appendChild(button);

						list.element.prepend(entryDisplay);
					}

					display.prepend(list.element);
				}

				display.append(
					runtime.gui.Button("NEW ENTRY", () => {
						window.showEditor();
					}).element
				);
			};

			window.showList();
		},
	},
];
