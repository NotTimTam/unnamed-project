import Anchor from "./Anchor.js";

/**
 * A desktop window that displays content.
 */
export default class Window extends Anchor {
	/**
	 * Create a new `Window` instance.
	 * @param {Desktop} desktop The desktop to use.
	 */
	constructor(desktop) {
		super(document.createElement("div"), desktop.runtime);
		this.desktop = desktop;
		this.gui = desktop.gui;

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

	beginDrag = ({ clientX, clientY }) => {
		this.inDrag = true;

		const { x, y } = this.element.getBoundingClientRect();

		this.offset = [clientX - x, clientY - y];
	};

	endDrag = (e) => {
		this.inDrag = false;
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
		this.element.className = "window";

		this.element.setAttribute("tabIndex", 0);

		const header = document.createElement("header");
		header.className = "window-header";

		const dragArea = document.createElement("div");
		dragArea.className = "drag-area";
		header.appendChild(dragArea);

		window.addEventListener("mousemove", this.mouseMove);
		window.addEventListener("blur", this.mouseMove);
		window.addEventListener("mouseup", this.endDrag);
		dragArea.addEventListener("mousedown", this.beginDrag);

		dragArea.onmousedown = () => {
			this.inDrag = true;
		};

		const title = document.createElement("h2");
		title.className = "header-title";
		header.appendChild(title);
		title.innerHTML = "Untitled Window";

		const button = document.createElement("button");
		button.type = "button";
		button.className = "close";
		button.title = "Close window.";
		button.innerText = "X";
		button.onclick = () => this.close();
		header.appendChild(button);

		this.element.prepend(header);
	}

	/**
	 * Close this window.
	 */
	close() {
		this.desktop.windows = this.desktop.windows.filter(
			(window) => window !== this
		);

		window.removeEventListener("mousemove", this.mouseMove);
		window.removeEventListener("blur", this.mouseMove);
		window.removeEventListener("mouseup", this.endDrag);

		this.destroy();
	}

	/**
	 * Move the window.
	 * @param {number} x The new x-coordinate for the window.
	 * @param {number} y The new y-coordinate for the window.
	 */
	move = (x, y) => {
		this.element.style.top =
			Math.max(Math.min(y, window.innerHeight - 16), 0) + "px";
		this.element.style.left =
			Math.max(Math.min(x, window.innerWidth - 16), 0) + "px";
	};
}
