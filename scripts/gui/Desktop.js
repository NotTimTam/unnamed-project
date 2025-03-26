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
		 * @param {boolean} minimizable Whether this window can be minimized.
		 */
		this.Window = (minimizable) => {
			const window = new Window(this, minimizable);

			this.windows.push(window);
			window.move(
				16 + this.windows.length * 32,
				16 + this.windows.length * 32
			);

			document.body.appendChild(window.element);

			return window;
		};

		/**
		 * Create a new `Window.Dialogue` instance.
		 * @param {string} title The title of the window.
		 * @param {string} message The message of the window.
		 * @param {boolean} confirmation Whether to show a "ok/cancel" dialogue instead of an "ok" dialogue.
		 * @param {function} onClose A method to run when the app closes, is passed a true/false based on input.
		 * @param {Window} origin An optional origin window. If provided, the window will be disabled until the alert is closed.
		 */
		this.Dialogue = (title, message, confirmation, onClose, origin) => {
			const window = new Window.Dialogue(
				this,
				title,
				message,
				confirmation,
				onClose,
				origin
			);

			origin.dialogues.push(window);
			if (origin) window.move(origin.rect.x + 16, origin.rect.y + 16);
			else
				window.move(
					16 + this.windows.length * 32,
					16 + this.windows.length * 32
				);

			document.body.appendChild(window.element);

			window.bringToTop();

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
		minimizable,
	}) => {
		const isOpen = this.windows.find(({ id: fid }) => fid === id);
		if (isOpen) {
			isOpen.bringToTop();

			return;
		}

		const window = this.Window(minimizable);

		window.id = id;
		window.title = title;

		onInit && onInit(this.runtime, window);

		if (onTick)
			window.onTick = () => {
				onTick(window.runtime, window);
			};
		if (onBeforeTick) window.onBeforeTick = onBeforeTick;
		if (onAfterTick) window.onAfterTick = onAfterTick;

		window.bringToTop();
	};

	/**
	 * **Internal method.** Initializes the desktop's elements.
	 */
	__initializeElements() {
		this.element.className = "desktop";
		this.element.innerHTML = null;
		this.element.onclick = ({ target }) => {
			if (target !== this.element) return;

			this.windows[0] && this.windows[0].blur();
		};

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
