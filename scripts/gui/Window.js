import Anchor from "./Anchor.js";

/**
 * A desktop window that displays content.
 */
export default class Window extends Anchor {
	/**
	 * Create a new `Window` instance.
	 * @param {Desktop} desktop The desktop to use.
	 * @param {boolean} minimizable Whether this window can be minimized.
	 * @param {boolean} maximizable Whether this window can be maximized.
	 */
	constructor(desktop, minimizable = true, maximizable = true) {
		super(document.createElement("div"), desktop.runtime);
		this.desktop = desktop;
		this.gui = desktop.gui;

		this.minimizable = minimizable;
		this.maximizable = maximizable;

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
		this.element.className = "window";

		const header = document.createElement("header");
		header.className = "window-header";

		const dragArea = document.createElement("div");
		dragArea.className = "drag-area";
		header.appendChild(dragArea);

		this.element.addEventListener("mousedown", this.bringToTop);
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

		if (this.minimizable) {
			const minimizeButton = document.createElement("button");
			minimizeButton.type = "button";
			minimizeButton.className = "minimize";
			minimizeButton.title = "Minimize window.";
			minimizeButton.innerText = "_";
			minimizeButton.onclick = () => this.minimize();
			header.appendChild(minimizeButton);
		}

		const closeButton = document.createElement("button");
		closeButton.type = "button";
		closeButton.className = "close";
		closeButton.title = "Close window.";
		closeButton.innerText = "X";
		closeButton.onclick = () => this.close();
		header.appendChild(closeButton);

		this.element.prepend(header);
	}

	/**
	 * Close this window.
	 */
	close() {
		this.desktop.windows = this.desktop.windows.filter(
			(window) => window !== this
		);

		this.element.removeEventListener("mousedown", this.bringToTop);
		window.removeEventListener("mousemove", this.mouseMove);
		window.removeEventListener("blur", this.mouseMove);
		window.removeEventListener("mouseup", this.endDrag);

		this.destroy();

		this.gui.taskbar.reloadTabs();
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
