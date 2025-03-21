/**
 * Manages gameloop and houses subsystems.
 */
export default class Runtime {
	/**
	 * Create an empty save file.
	 */
	static createInitialSaveFile() {
		return {
			time: 0,

			player: {
				assets: [],
				journal: [],
			},
		};
	}

	/**
	 * Create a new `Runtime` instance.
	 * @param {Object} saveFile The loaded save to use.
	 */
	constructor(saveFile) {
		this.constructs = [];

		this.active = false;

		if (!saveFile)
			throw new Error("Runtime constructor not provided a save file.");

		this.saveFile = saveFile;

		console.log("Loaded save:", this.saveFile);
	}

	/**
	 * Get the current gameloop frame rate.
	 */
	get fps() {
		return 1000 / this.dt;
	}

	/**
	 * Start the gameloop.
	 */
	start = () => {
		if (!this.active) {
			this.time = 0;
			this.active = true;
			requestAnimationFrame(this.__onAnimationFrame);
		}
	};

	/**
	 * Stop the gameloop.
	 */
	stop = () => {
		this.active = false;
	};

	__onBeforeTick = (time) => {
		this.dt = time - (this.time || 0);
		this.time = time;
		this.saveFile.time += this.dt; // Record the current time.

		for (const construct of this.constructs)
			construct.onBeforeTick && construct.onBeforeTick(time);
	};
	__onTick = (time) => {
		for (const construct of this.constructs)
			construct.onTick && construct.onTick(time);
	};
	__onAfterTick = (time) => {
		for (const construct of this.constructs)
			construct.onAfterTick && construct.onAfterTick(time);
	};

	__onAnimationFrame = (time) => {
		if (!this.active) return;

		this.__onBeforeTick(time);
		this.__onTick(time);
		this.__onAfterTick(time);

		requestAnimationFrame(this.__onAnimationFrame);
	};
}
