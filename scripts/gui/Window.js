import Anchor from "./Anchor.js";

/**
 * A desktop window that displays content.
 */
export default class Window extends Anchor {
	/**
	 * A dialogue window.
	 */
	static Dialogue = class extends Window {
		/**
		 * Create a new `Window.Dialogue` instance.
		 * @param {Desktop} desktop The desktop to use.
		 * @param {string} title The title of the window.
		 * @param {string} message The message of the window.
		 * @param {boolean} confirmation Whether to show a "ok/cancel" dialogue instead of an "ok" dialogue.
		 * @param {function} onClose A method to run when the app closes, is passed a true/false based on input.
		 * @param {Window} origin An optional origin window. If provided, the window will be disabled until the alert is closed.
		 */
		constructor(desktop, title, message, confirmation, onClose, origin) {
			super(desktop, false);

			this.origin = origin;
			if (this.origin) this.origin.disabled = true;

			this.onClose = onClose;

			const messageContainer = document.createElement("p");
			messageContainer.className = "message";
			messageContainer.innerHTML = message;

			this.element.appendChild(messageContainer);

			const buttonGroup = document.createElement("div");
			buttonGroup.className = "button-group";

			buttonGroup.appendChild(
				desktop.gui.Button("OK", () => {
					onClose(true);
					if (this.origin && this.origin.dialogues.length < 2)
						this.origin.disabled = false;
					this.close();
				}).element
			);

			if (confirmation) {
				buttonGroup.appendChild(
					desktop.gui.Button("CANCEL", () => {
						onClose(false);
						if (this.origin && this.origin.dialogues.length < 2)
							this.origin.disabled = false;
						this.close();
					}).element
				);
			}

			this.element.appendChild(buttonGroup);

			this.title = title;
		}
	};

	/**
	 * Create a new `Window` instance.
	 * @param {Desktop} desktop The desktop to use.
	 * @param {boolean} minimizable Whether this window can be minimized.
	 */
	constructor(desktop, minimizable = true) {
		super(document.createElement("div"), desktop.runtime);
		this.desktop = desktop;
		this.gui = desktop.gui;

		this.dialogues = [];

		this.minimizable = minimizable;

		this.initialized = desktop.runtime.lft;

		this.__initializeElements();
	}

	/**
	 * Get the current window title.
	 */
	get title() {
		return this.element.querySelector(
			"header.window-header h2.header-title"
		).innerText;
	}

	/**
	 * Set the window's title.
	 */
	set title(n) {
		this.element.querySelector(
			"header.window-header h2.header-title"
		).innerText = n;
	}

	/**
	 * Get whether the window is enabled.
	 */
	get disabled() {
		return this.element.classList.contains("disabled");
	}

	/**
	 * Set the window enabled/disabled.
	 */
	set disabled(n) {
		this.element.classList.toggle("disabled", n);
	}

	/**
	 * Whether this window is on top and in focus.
	 */
	get onTop() {
		return this.element.classList.contains("focused");
	}

	/**
	 * Blur the window so it is no longer "on top" of the context.
	 */
	blur = () => {
		this.element.blur();
		this.element.classList.toggle("focused", false);

		this.gui.taskbar.reloadTabs();
	};

	/**
	 * Minimize the window.
	 */
	minimize() {
		this.element.classList.toggle("minimized", true);

		this.blur();
	}

	/**
	 * Bring this window to the forefront of the z-order.
	 */
	bringToTop = () => {
		this.element.focus();
		this.element.classList.toggle("minimized", false);

		this.desktop.windows.splice(this.desktop.windows.indexOf(this), 1);
		this.desktop.windows.unshift(this);

		for (let i in this.desktop.windows) {
			const window = this.desktop.windows[i];

			window.element.classList.toggle("focused", window === this);
			window.element.style.zIndex = this.desktop.windows.length - +i + 1;
		}

		this.gui.taskbar.reloadTabs();
	};

	beginDrag = ({ clientX, clientY }) => {
		this.inDrag = true;

		this.element.classList.toggle("in-drag", true);

		const { x, y } = this.element.getBoundingClientRect();

		this.offset = [clientX - x, clientY - y];
	};

	endDrag = (e) => {
		this.inDrag = false;

		this.element.classList.toggle("in-drag", false);
	};

	mouseMove = ({ clientX, clientY }) => {
		if (!this.inDrag) return;

		const { width, height } = this.element.getBoundingClientRect();

		this.move(
			Math.min(clientX - this.offset[0], window.innerWidth - width),
			Math.min(clientY - this.offset[1], window.innerHeight - height)
		);
	};

	/**
	 * **Internal method.** Initializes a window's elements.
	 */
	__initializeElements() {
		this.element.className = `window${
			this instanceof Window.Dialogue ? " dialogue" : ""
		}`;

		const header = document.createElement("header");
		header.className = "window-header";

		const dragArea = document.createElement("div");
		dragArea.className = "drag-area";
		header.appendChild(dragArea);

		if (!(this instanceof Window.Dialogue)) {
			this.element.addEventListener("mousedown", this.bringToTop);
			window.addEventListener("mousemove", this.mouseMove);
			window.addEventListener("blur", this.mouseMove);
			window.addEventListener("mouseup", this.endDrag);
			dragArea.addEventListener("mousedown", this.beginDrag);

			dragArea.onmousedown = () => {
				this.inDrag = true;
			};
		}

		const title = document.createElement("h2");
		title.className = "header-title";
		header.appendChild(title);
		title.innerHTML = "Untitled Window";

		if (this.minimizable && !(this instanceof Window.Dialogue)) {
			const minimizeButton = document.createElement("button");
			minimizeButton.type = "button";
			minimizeButton.className = "minimize";
			minimizeButton.title = "Minimize window.";
			minimizeButton.innerText = "_";
			minimizeButton.onclick = () => this.minimize();
			header.appendChild(minimizeButton);
		}

		if (!(this instanceof Window.Dialogue)) {
			const closeButton = document.createElement("button");
			closeButton.type = "button";
			closeButton.className = "close";
			closeButton.title = "Close window.";
			closeButton.innerText = "X";
			closeButton.onclick = () => this.close();
			header.appendChild(closeButton);
		}

		this.element.prepend(header);
	}

	/**
	 * Close this window.
	 */
	close() {
		if (!(this instanceof Window.Dialogue)) {
			this.desktop.windows = this.desktop.windows.filter(
				(window) => window !== this
			);

			this.element.removeEventListener("mousedown", this.bringToTop);
			window.removeEventListener("mousemove", this.mouseMove);
			window.removeEventListener("blur", this.mouseMove);
			window.removeEventListener("mouseup", this.endDrag);

			this.gui.taskbar.reloadTabs();
		} else if (this.origin)
			this.origin.dialogues = this.origin.dialogues.filter(
				(dialogue) => dialogue !== this
			);

		this.destroy();
	}

	/**
	 * Move the window.
	 * @param {number} x The new x-coordinate for the window.
	 * @param {number} y The new y-coordinate for the window.
	 */
	move = (x, y) => {
		this.element.style.top =
			Math.max(
				Math.min(
					y,
					window.innerHeight -
						this.gui.taskbar.rect.height -
						this.rect.height
				),
				0
			) + "px";
		this.element.style.left =
			Math.max(Math.min(x, window.innerWidth - this.rect.width), 0) +
			"px";
	};
}
