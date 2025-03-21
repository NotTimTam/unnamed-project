import GUIAnchor from "./GUIAnchor.js";

/**
 * A desktop window that displays content.
 */
export default class Window extends GUIAnchor {
	/**
	 * Create a new `Window` instance.
	 * @param {WindowManager} windowManager The window manager to add this window to.
	 */
	constructor(windowManager) {
		super(document.createElement("div"));
		this.windowManager = windowManager;
	}
}
