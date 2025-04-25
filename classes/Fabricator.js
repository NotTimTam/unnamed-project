import goods from "../data/goods.js";
import schematics from "../data/schematics.js";
import tools from "../data/tools.js";
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

	goodDisplay(good) {
		const { name, amount, consumed } = good;

		const display = document.createElement("li");

		display.innerHTML = `${
			consumed ? "" : `<b class="nc"></b> `
		}${amount} ${goods[name].label}${amount === 1 ? "" : "s"}`;

		return display;
	}

	toolDisplay(tool) {
		const { name, type, damage, consumed } = tool;

		const display = document.createElement("li");

		if (type === "part")
			display.innerHTML = `<b class="dmg">+${damage}PT DMG</b> to ${name}`;
		else
			display.innerHTML = `${
				consumed ? "" : `<b class="nc"></b> `
			} ${name}`;

		return display;
	}

	outcomeDisplay(outcome) {
		const { name, type, amount } = outcome;

		const display = document.createElement("li");

		display.innerHTML = `${amount} <b>${
			type === "good" ? goods[name].label : tools[name].label
		}${amount === 1 ? "" : "s"}</b>`;

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
				const { label, goods, tools, outcomes, stamina } = schematic;

				const schematicDisplay = document.createElement("li");

				schematicDisplay.className = "schematic";
				schematicDisplay.innerHTML = `
					<button type="button">
						<p><b>${label}</b></p>
						${
							goods
								? `<p>Using:</p>
						<ul class="goods"></ul>`
								: ""
						}
						${
							tools || (stamina && stamina > 0)
								? `<p>Via:</p>
						<ul class="tools">
							${stamina && stamina > 0 ? `<li><b class="st">-${stamina} ST</b></li>` : ""}
						</ul>`
								: ""
						}
						${goods || tools || (stamina && stamina > 0) ? `<p>Outcome:</p>` : ""}
						<ul class="outcome"></ul>
					</button>
				`;

				if (goods)
					for (const good of goods)
						schematicDisplay
							.querySelector("ul.goods")
							.appendChild(this.goodDisplay(good));

				if (tools)
					for (const tool of tools)
						schematicDisplay
							.querySelector("ul.tools")
							.appendChild(this.toolDisplay(tool));

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
