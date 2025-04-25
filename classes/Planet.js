import Entity from "./Entity.js";

export default class Planet extends Entity {
	/**
	 * Create a new `Planet` instance.
	 * @param {String} name The name of the planet.
	 * @param {Object} goods The goods configuration for this planet.
	 */
	constructor(name, goods) {
		super(name);

		this.goods = goods;
	}
}
