import Prefab from "./Prefab.js";

export default class Entity extends Prefab {
	/**
	 * Create a new `Entity` instance.
	 * @param {String} name The name of the entity.
	 */
	constructor(name) {
		super();

		this._items = {};
		this.name = name;
	}

	get items() {
		return this._items || {};
	}

	set items(v) {
		this._items = v;

		if (this.onItemsChange) this.onItemsChange(v);
	}

	/**
	 * Change the amount of a item an entity should have.
	 * @param {String} item The name of the item to change.
	 * @param {Number} n The amount by which to change item count.
	 */
	addItem(item, n) {
		const newItems = { ...this.items };
		newItems[item] = (this.items[item] || 0) + n;

		if (newItems[item] === 0) delete newItems[item];

		this.items = newItems;
	}

	/**
	 * Give another entity some of this entity's item.
	 * @param {String} item The name of the item to give.
	 * @param {Number} n The amount to give.
	 * @param {Entity} entity The entity to give the item to.
	 */
	giveItem(item, n, entity) {
		if (!entity || !(entity instanceof Entity))
			throw new Error("Provided object is not an entity.");

		if (!this.items[item] || this.items[item] < n)
			throw new Error(`Entity does not have ${n} "${item}."`);

		this.addItem(item, -n);
		entity.addItem(item, n);
	}
}
