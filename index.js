import Anchor from "./classes/Anchor.js";
import Creature from "./classes/Creature.js";
import Runtime from "./classes/Runtime.js";
import Planet from "./classes/Planet.js";

import goods from "./data/goods.js";
import Inventory from "./classes/Inventory.js";
import Fabricator from "./classes/Fabricator.js";
import Stats from "./classes/Stats.js";

window.runtime = new Runtime();

runtime.earth = new Planet(
	"Earth",
	Object.fromEntries(
		Object.entries(goods)
			.filter(([_, { classification }]) => classification === "resource")
			.map(([name, { amount }]) => [name, amount])
	)
);

class Player extends Creature {
	constructor() {
		super("Player", "human");

		this.stats = new Stats(this);
		this.inventory = new Inventory(this);
		this.fabricator = new Fabricator(this);

		this.onGoodsChange = () => {
			this.inventory.updateDisplay();
			this.fabricator.updateDisplay();
		};

		this.onToolsChange = () => {
			this.inventory.updateDisplay();
			this.fabricator.updateDisplay();
		};

		this.onPartsChange = () => {
			this.inventory.updateDisplay();
			this.fabricator.updateDisplay();
			this.stats.updateDisplay();
		};

		this.onStaminaChange = () => {
			this.stats.updateDisplay();
		};
	}

	/**
	 * Check if this Entity can fabricate a specific schematic.
	 * @param {Object} schematic The schematic to fabricate.
	 * @returns {boolean} Whether this schematic can currently be fabricated.
	 */
	canFabricate(schematic) {
		if (schematic.goods)
			for (const good of schematic.goods)
				if ((this.goods[good.name] || 0) < good.amount) return false;

		if (schematic.tools)
			for (const tool of schematic.tools) {
				if (
					tool.type === "part" &&
					this.getHealthOfParts(tool.name) < tool.damage
				)
					return false;
				else if ((this.tools[tool.name] || 0) < tool.amount)
					return false;
			}

		if (schematic.stamina && schematic.stamina > this.stamina) return false;

		return true;
	}

	/**
	 * Fabricate a good via a schematic.
	 * @param {Object} schematic The schematic to fabricate.
	 */
	fabricate(schematic) {
		if (!this.canFabricate(schematic))
			throw new Error("Entity cannot fabricate that schematic.");

		const { goods, tools, outcomes, stamina } = schematic;

		if (stamina) this.stamina -= stamina;

		if (goods)
			for (const { name, amount } of goods.filter(
				({ consumed }) => consumed
			)) {
				this.addGood(name, -amount);
			}

		let partsDamaged = false;

		if (tools)
			for (const { name, type, amount, damage } of tools.filter(
				({ consumed, type }) => type === "part" || consumed
			)) {
				if (type === "part") {
					const parts = this.getParts(name);

					let damageLeft = damage;

					partLoop: for (const part of parts) {
						if (part.health < damageLeft) {
							damageLeft -= part.health;
							part.health = 0;
						} else {
							part.health -= damageLeft;
							break partLoop;
						}
					}

					partsDamaged = true;
				} else this.addTool(name, -amount);
			}

		for (const { name, type, amount } of outcomes) {
			if (type === "tool") this.addTool(name, amount);
			else if (type === "good") this.addGood(name, amount);
		}

		if (partsDamaged) this.stats.updateDisplay();
	}
}

runtime.player = new Player();
