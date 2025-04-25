import creatures from "../data/creatures.js";

import Entity from "./Entity.js";
import Prefab from "./Prefab.js";
export default class Creature extends Entity {
	static BodyPart = class extends Prefab {
		static types = [
			"arm",
			"leg",
			"tail",
			"neck",
			"torso",
			"head",
			"wing",
			"antenna",
			"abdomen",
			"thorax",
			"brain",
			"heart",
			"lungs",
			"liver",
			"stomach",
		];

		/**
		 * Create a new `BodyPart` instance.
		 * @param {String} type The type of the limb.
		 * @param {Number} health The max health of the limb.
		 * @param {String} label The label for this limb.
		 */
		constructor(type, health, label) {
			super();

			if (!Creature.BodyPart.types.includes(type))
				throw new Error(`Invalid BodyPart type "${type}" provided.`);

			this.type = type;
			this.health = health;
			this.maxHealth = health;

			this.label = label;
		}
	};

	/**
	 * Create a new `Creature` instance.
	 * @param {String} name The name of the creature.
	 * @param {Object} type The name of the creature configuration to use.
	 */
	constructor(name, type) {
		super(name);

		this.type = type;
		if (!this.configuration)
			throw new Error(
				`No creature configuration named "${type}" exists.`
			);

		this._parts = [];
		this.createdAt = performance.now();
		this.stamina = this.configuration.maxStamina;

		for (const { type, health, label } of this.configuration.parts) {
			this.parts.push(new Creature.BodyPart(type, health, label));
		}
	}

	tick(dt) {
		if (this.stamina < this.maxStamina)
			this.stamina = Math.min(
				this.maxStamina,
				this.stamina + dt * this.staminaRegen
			);
	}

	get staminaRegen() {
		return 1;
	}

	get stamina() {
		return this._stamina;
	}

	set stamina(n) {
		this._stamina = n;

		if (this.onStaminaChange) this.onStaminaChange(n);
	}

	get parts() {
		return this._parts || {};
	}

	set parts(v) {
		this._parts = v;

		if (this.onPartsChange) this.onPartsChange(v);
	}

	get configuration() {
		return creatures[this.type];
	}

	/**
	 * Get the age in milliseconds.
	 */
	get age() {
		return performance.now() - this.createdAt;
	}

	get maxStamina() {
		return this.configuration.maxStamina;
	}

	get maxAge() {
		return this.configuration.maxAge;
	}

	get maxHealth() {
		return this.parts.reduce((prevVal, currentVal) => {
			return prevVal + currentVal.maxHealth;
		}, 0);
	}

	get health() {
		return this.parts.reduce((prevVal, currentVal) => {
			return prevVal + currentVal.health;
		}, 0);
	}

	/**
	 * Get parts by type.
	 * @param {String} type The type of part.
	 * @returns {Array<Creature.BodyPart>} An array of the parts found.
	 */
	getParts(type) {
		return this.parts.filter(({ type: f }) => f === type);
	}

	/**
	 * Get the total health of all parts of a specific type for this `Creature`.
	 * @param {String} type The type of part.
	 * @returns {Number} The health of the parts of that type on this `Creature`.
	 */
	getHealthOfParts(type) {
		return this.getParts(type).reduce((p, c) => p + c.health, 0);
	}
}
