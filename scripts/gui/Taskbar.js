import Anchor from "./Anchor.js";

/**
 * A taskbar that displays some information and tabs for the current windows.
 */
export default class Taskbar extends Anchor {
	/**
	 * Create a new `Taskbar` instance.
	 * @param {GUI} gui The gui to use.
	 */
	constructor(gui) {
		super(document.createElement("footer"), gui.runtime);
		this.gui = gui;

		document.body.appendChild(this.element);

		this.__initializeElements();
	}

	/**
	 * Reload taskbar tabs to represent actual app states.
	 */
	reloadTabs() {
		const {
			gui: {
				desktop: { windows },
			},
			tabParent,
		} = this;

		tabParent.innerHTML = null;

		for (const window of windows.sort(
			(a, b) => a.initialized - b.initialized
		)) {
			const tabButton = document.createElement("button");
			tabButton.type = "button";
			tabButton.className = "tab";
			tabButton.classList.toggle("active", window.onTop);
			tabButton.innerHTML = `${window.title}`;
			tabButton.onclick = () =>
				window.onTop ? window.blur() : window.bringToTop();

			tabParent.appendChild(tabButton);
		}
	}

	/**
	 * **Internal method.** Initializes the desktop's elements.
	 */
	__initializeElements() {
		this.element.className = "taskbar";
		this.element.innerHTML = null;

		this.element.appendChild(this.gui.Button("Start", () => {}).element);

		this.tabParent = document.createElement("div");
		this.tabParent.className = "tabs";
		this.element.appendChild(this.tabParent);

		const infoDisplay = this.gui.Text("00:00 AM\n0000-00-00");
		infoDisplay.element.className = "info";
		infoDisplay.onTick = (runtime) => {
			infoDisplay.element.innerHTML = `${runtime.time.getTimeDisplay(
				true,
				false
			)}<br>${runtime.time.getDateDisplay(true)}`;
		};
		this.element.appendChild(infoDisplay.element);

		this.reloadTabs();
	}
}
