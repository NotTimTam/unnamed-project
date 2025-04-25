import goods from "../data/goods.js";
import tools from "../data/tools.js";
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
		if (!this.player.goods || Object.keys(this.player.goods).length === 0)
			this.element.innerHTML = `<h2>Inventory</h2><p>Inventory empty.</p>`;
		else {
			this.element.innerHTML = `<h2>Inventory</h2><p>Goods:</p><ul class="goods"></ul><p>Tools:</p><ul class="tools"></ul>`;

			for (const [good, count] of Object.entries(this.player.goods)) {
				const goodDisplay = document.createElement("li");

				goodDisplay.innerHTML = `${goods[good].label} &mdash; ${count}`;

				this.element.querySelector("ul.goods").appendChild(goodDisplay);
			}

			for (const [tool, count] of Object.entries(this.player.tools)) {
				const toolDisplay = document.createElement("li");

				toolDisplay.innerHTML = `${tools[tool].label} &mdash; ${count}`;

				this.element.querySelector("ul.tools").appendChild(toolDisplay);
			}
		}
	}
}
