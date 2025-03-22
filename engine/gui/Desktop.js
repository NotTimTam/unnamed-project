import Anchor from "./Anchor.js";
import Window from "./Window.js";
import applications from "../data/applications.js";

/**
 * A desktop that displays content and manages windows.
 */
export default class Desktop extends Anchor {
	/**
	 * Create a new `Desktop` instance.
	 * @param {GUI} gui The gui to use.
	 */
	constructor(gui) {
		super(document.createElement("main"), gui.runtime);
		this.gui = gui;

		document.body.appendChild(this.element);

		this.windows = [];

		this.__initializeElements();

		/**
		 * Create a new `Window` instance.
		 * @returns {Window} The new `Window` instance.
		 */
		this.Window = () => {
			const window = new Window(this);

			this.windows.push(window);

			return window;
		};
	}

	/**
	 * Reset the desktop display to defaults.
	 */
	reset() {
		for (const window of this.windows) window.close();
	}

	/**
	 * Open a window for a specific application.
	 * @param {Object} application The config of the application to open.
	 */
	openApplication = ({
		id,
		title,
		onInit,
		onTick,
		onBeforeTick,
		onAfterTick,
	}) => {
		const isOpen = this.windows.find(({ id: fid }) => fid === id);
		if (isOpen) {
			isOpen.bringToTop();

			return;
		}

		const window = this.Window();

		window.id = id;
		window.title = title;

		onInit && onInit(this.runtime, window);

		if (onTick)
			window.onTick = () => {
				onTick(window.runtime, window);
			};
		if (onBeforeTick) window.onBeforeTick = onBeforeTick;
		if (onAfterTick) window.onAfterTick = onAfterTick;

		document.body.appendChild(window.element);

		window.bringToTop();
	};

	/**
	 * **Internal method.** Initializes the desktop's elements.
	 */
	__initializeElements() {
		this.element.className = "desktop";
		this.element.innerHTML = null;

		for (const application of applications) {
			const applicationButton = document.createElement("button");
			applicationButton.className = "application-button";

			applicationButton.innerHTML = `
				<span class="desktop-icon">${application.icon}</span>
				<span class="button-pretty">${application.title}</span>
			`;

			applicationButton.ondblclick = () =>
				this.openApplication(application);

			applicationButton.onkeydown = ({ key }) =>
				key === "Enter" && this.openApplication(application);

			this.element.appendChild(applicationButton);
		}
	}
}
