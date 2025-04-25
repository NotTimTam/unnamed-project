import goods from "../data/goods.js";
import schematics from "../data/schematics.js";
import tools from "../data/tools.js";
import Anchor from "./Anchor.js";
import Creature from "./Creature.js";

export default class Actions extends Anchor {
	/**
	 * Create a new `Fabricator` instance.
	 * @param {Creature} player The player creature.
	 */
	constructor(player) {
		super(document.createElement("div"), document.body);

		this.element.className = "actions";
		this.element.innerHTML = `<h2>Actions</h2><div id="action-display"></div>`;

		this.player = player;

		this.updateDisplay();
	}

	/**
	 * Update the fabricator display.
	 */
	updateDisplay() {
		this.actionsOnDisplay = this.player.availableActions;

		if (this.actionsOnDisplay.length === 0)
			this.element.querySelector(
				"div#action-display"
			).innerHTML = `<p>No available actions.</p>`;
		else {
			if (
				this.element.querySelector("div#action-display > p") ||
				this.element.querySelector("div#action-display").children
					.length === 0
			)
				this.element.querySelector(
					"div#action-display"
				).innerHTML = `<ul></ul>`;

			const existingActions = Array.from(
				this.element.querySelectorAll(`div#action-display > ul > li`)
			).map((item) => +item.getAttribute("id"));

			for (const { label, method, id } of this.actionsOnDisplay) {
				const existing = this.element.querySelector(
					`div#action-display > ul > li[id="${id}"]`
				);

				if (existing) continue;

				const actionDisplay = document.createElement("li");

				actionDisplay.setAttribute("id", id);

				actionDisplay.innerHTML = `<button type="button">${label}</button>`;

				actionDisplay.querySelector("button").onclick = method;

				this.element
					.querySelector("div#action-display > ul")
					.appendChild(actionDisplay);
			}

			for (const id of existingActions.filter(
				(id) => !this.actionsOnDisplay.map(({ id }) => id).includes(id)
			)) {
				const existing = this.element.querySelector(
					`div#action-display > ul > li[id="${id}"]`
				);

				if (existing) existing.parentNode.removeChild(existing);
			}
		}
	}
}
