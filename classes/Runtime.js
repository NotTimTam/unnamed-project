export default class Runtime {
	/**
	 * Create a `Runtime` instance.
	 */
	constructor() {
		requestAnimationFrame(this.tick.bind(this));

		this.prefabs = [];
	}

	tick(time) {
		if (!this.ldt) this.ldt = 0;
		this.dt = (time - this.ldt) / 1000;
		this.ldt = time;

		for (const prefab of this.prefabs) prefab.tick && prefab.tick(this.dt);

		requestAnimationFrame(this.tick.bind(this));
	}
}
