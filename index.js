import Anchor from "./classes/Anchor.js";
import Creature from "./classes/Creature.js";
import Runtime from "./classes/Runtime.js";
import Planet from "./classes/Planet.js";

import items from "./data/items.js";
import Inventory from "./classes/Inventory.js";
import Fabricator from "./classes/Fabricator.js";
import Stats from "./classes/Stats.js";

window.runtime = new Runtime();

runtime.earth = new Planet(
	"Earth",
	Object.fromEntries(
		Object.entries(items)
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

		this.onItemsChange = () => {
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
		if (schematic.items)
			for (const item of schematic.items)
				if ((this.items[item.name] || 0) < item.amount) return false;

		if (schematic.parts)
			for (const part of schematic.parts) {
				if (this.getHealthOfParts(part.name) < part.damage)
					return false;
			}

		if (schematic.stamina && schematic.stamina > this.stamina) return false;

		return true;
	}

	/**
	 * Fabricate a item via a schematic.
	 * @param {Object} schematic The schematic to fabricate.
	 */
	fabricate(schematic) {
		if (!this.canFabricate(schematic))
			throw new Error("Entity cannot fabricate that schematic.");

		const { items, parts, outcomes, stamina } = schematic;

		if (stamina) this.stamina -= stamina;

		if (items)
			for (const { name, amount } of items.filter(
				({ consumed }) => consumed
			)) {
				this.addItem(name, -amount);
			}

		let partsDamaged = false;

		if (parts)
			for (const { name, amount, damage } of parts) {
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
			}

		for (const { name, amount } of outcomes) {
			this.addItem(name, amount);
		}

		if (partsDamaged) this.stats.updateDisplay();
	}
}

runtime.player = new Player();
