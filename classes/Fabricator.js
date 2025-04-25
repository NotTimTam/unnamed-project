import items from "../data/items.js";
import schematics from "../data/schematics.js";
import Anchor from "./Anchor.js";
import Creature from "./Creature.js";

export default class Fabricator extends Anchor {
	/**
	 * Create a new `Fabricator` instance.
	 * @param {Creature} player The player creature.
	 */
	constructor(player) {
		super(document.createElement("div"), document.body);

		this.element.className = "fabricator";

		this.player = player;

		this.updateDisplay();
	}

	itemDisplay(item) {
		const { name, amount, consumed } = item;

		const display = document.createElement("li");

		display.innerHTML = `${
			consumed ? "" : `<b class="nc"></b> `
		}${amount} ${items[name].label}${amount === 1 ? "" : "s"}`;

		return display;
	}

	partDisplay(part) {
		const { name, damage } = part;

		const display = document.createElement("li");

		display.innerHTML = `<b class="dmg">+${damage}PT DMG</b> to ${name}`;

		return display;
	}

	outcomeDisplay(outcome) {
		const { name, amount } = outcome;

		const display = document.createElement("li");

		display.innerHTML = `${amount} <b>${items[name].label}${
			amount === 1 ? "" : "s"
		}</b>`;

		return display;
	}

	/**
	 * Update the fabricator display.
	 */
	updateDisplay() {
		const craftableSchematics = schematics.filter((schematic) =>
			this.player.canFabricate(schematic)
		);

		if (craftableSchematics.length === 0)
			this.element.innerHTML = `<h2>Fabrication</h2><p>No craftable schematics.</p>`;
		else {
			this.element.innerHTML = `<h2>Fabrication</h2><ul></ul>`;

			for (const schematic of craftableSchematics) {
				const { label, items, parts, outcomes, stamina } = schematic;

				const schematicDisplay = document.createElement("li");

				schematicDisplay.className = "schematic";
				schematicDisplay.innerHTML = `
					<button type="button">
						<p><b>${label}</b></p>
						${
							items
								? `<p>Using:</p>
						<ul class="items"></ul>`
								: ""
						}
						${
							parts || (stamina && stamina > 0)
								? `<p>Via:</p>
						<ul class="parts">
							${stamina && stamina > 0 ? `<li><b class="st">-${stamina} ST</b></li>` : ""}
						</ul>`
								: ""
						}
						${items || parts || (stamina && stamina > 0) ? `<p>Outcome:</p>` : ""}
						<ul class="outcome"></ul>
					</button>
				`;

				if (items)
					for (const item of items)
						schematicDisplay
							.querySelector("ul.items")
							.appendChild(this.itemDisplay(item));

				if (parts)
					for (const part of parts)
						schematicDisplay
							.querySelector("ul.parts")
							.appendChild(this.partDisplay(part));

				for (const outcome of outcomes)
					schematicDisplay
						.querySelector("ul.outcome")
						.appendChild(this.outcomeDisplay(outcome));

				schematicDisplay.querySelector("button").onclick = () => {
					this.player.fabricate(schematic);
				};

				this.element.querySelector("ul").appendChild(schematicDisplay);
			}
		}
	}
}
