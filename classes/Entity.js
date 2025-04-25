import Creature from "./Creature.js";
import Prefab from "./Prefab.js";

export default class Entity extends Prefab {
	/**
	 * Create a new `Entity` instance.
	 * @param {String} name The name of the entity.
	 */
	constructor(name) {
		super();

		this._tools = {};
		this._goods = {};
		this.name = name;
	}

	get goods() {
		return this._goods || {};
	}

	set goods(v) {
		this._goods = v;

		if (this.onGoodsChange) this.onGoodsChange(v);
	}

	get tools() {
		return this._tools || {};
	}

	set tools(v) {
		this._tools = v;

		if (this.onToolsChange) this.onToolsChange(v);
	}

	/**
	 * Change the amount of a good an entity should have.
	 * @param {String} good The name of the good to change.
	 * @param {Number} n The amount by which to change good count.
	 */
	addGood(good, n) {
		const newGoods = { ...this.goods };
		newGoods[good] = (this.goods[good] || 0) + n;

		this.goods = newGoods;
	}

	/**
	 * Change the amount of a tool an entity should have.
	 * @param {String} tool The name of the tool to change.
	 * @param {Number} n The amount by which to change tool count.
	 */
	addTool(tool, n) {
		const newTools = { ...this.tools };
		newTools[tool] = (this.tools[tool] || 0) + n;

		if (newTools[tool] === 0) delete newTools[tool];

		this.tools = newTools;
	}

	/**
	 * Give another entity some of this entity's good.
	 * @param {String} good The name of the good to give.
	 * @param {Number} n The amount to give.
	 * @param {Entity} entity The entity to give the good to.
	 */
	giveGood(good, n, entity) {
		if (!entity || !(entity instanceof Entity))
			throw new Error("Provided object is not an entity.");

		if (!this.goods[good] || this.goods[good] < n)
			throw new Error(`Entity does not have ${n} "${good}."`);

		this.addGood(good, -n);
		entity.addGood(good, n);
	}
}
