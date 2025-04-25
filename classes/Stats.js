import goods from "../data/goods.js";
import tools from "../data/tools.js";
import Anchor from "./Anchor.js";
import Creature from "./Creature.js";

export default class Stats extends Anchor {
	/**
	 * Create a new `Stats` instance.
	 * @param {Creature} player The player creature.
	 */
	constructor(player) {
		super(document.createElement("div"), document.body);

		this.element.className = "stats";

		this.player = player;

		this.updateDisplay();
	}

	/**
	 * Update the stats display.
	 */
	updateDisplay() {
		this.element.innerHTML = `<h2>Stats</h2><p><b class="dmg">HP: ${Math.floor(
			this.player.health
		)}/${this.player.maxHealth}</b></p><p><b class="st">ST: ${Math.floor(
			this.player.stamina
		)}/${this.player.maxStamina}</b></p><ul></ul>`;

		for (const { health, maxHealth, label } of this.player.parts) {
			const partDisplay = document.createElement("li");

			partDisplay.innerHTML = `${label} &mdash; ${health}/${maxHealth}HP`;

			this.element.querySelector("ul").appendChild(partDisplay);
		}
	}
}
