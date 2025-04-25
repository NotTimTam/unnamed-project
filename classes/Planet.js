import Entity from "./Entity.js";

export default class Planet extends Entity {
	/**
	 * Create a new `Planet` instance.
	 * @param {String} name The name of the planet.
	 * @param {Object} items The items configuration for this planet.
	 */
	constructor(name, items) {
		super(name);

		this.items = items;
	}
}
