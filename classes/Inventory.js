import items from "../data/items.js";
import Anchor from "./Anchor.js";
import Creature from "./Creature.js";

export default class Inventory extends Anchor {
	/**
	 * Create a new `Inventory` instance.
	 * @param {Creature} player The player creature.
	 */
	constructor(player) {
		super(document.createElement("div"), document.body);

		this.element.className = "inventory";

		this.player = player;

		this.updateDisplay();
	}

	/**
	 * Update the inventory display.
	 */
	updateDisplay() {
		if (!this.player.items || Object.keys(this.player.items).length === 0)
			this.element.innerHTML = `<h2>Inventory</h2><p>Inventory empty.</p>`;
		else {
			this.element.innerHTML = `<h2>Inventory</h2><ul class="items"></ul>`;

			for (const [item, count] of Object.entries(this.player.items)) {
				const itemDisplay = document.createElement("li");

				itemDisplay.innerHTML = `${items[item].label} &mdash; ${count}`;

				this.element.querySelector("ul.items").appendChild(itemDisplay);
			}
		}
	}
}
