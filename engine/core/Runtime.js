import GUI from "./GUI.js";
import Time from "./Time.js";

/**
 * Manages gameloop and houses subsystems.
 */
export default class Runtime {
	/**
	 * Create an empty save file.
	 */
	static createInitialSaveData() {
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
	 * @param {Object} save The loaded save to use.
	 */
	constructor(save) {
		this.constructs = [];

		this.active = false;
		this.currentFileHandler = null;

		this.gui = new GUI(this);

		if (!save)
			throw new Error("Runtime constructor not provided a save file.");

		this.save = save;

		this.time = new Time(this);

		console.log("Loaded save:", this.save);
	}

	/**
	 * Reset game state to "unload"/"delete" current save. Does not delete actual file.
	 */
	eraseSave = async () => {
		this.currentFileHandler = null;
		this.save = Runtime.createInitialSaveData();
	};

	/**
	 * Save a copy of the save file to the user's filesystem.
	 */
	saveGame = async () => {
		// If we don't have a file handle yet, ask the user for one.
		if (!this.currentFileHandler) {
			this.currentFileHandler = await showSaveFilePicker({
				id: "unnamed-project-saves",
				startIn: "downloads",
				suggestedName: `my-save-${new Date().toISOString()}`,
				types: [
					{
						description: "A unnamed-project game save file.",
						accept: { "application/json": [".json"] },
					},
				],
			});
		}

		// Create a writable stream from the file handle and write our JSON data.
		const writable = await this.currentFileHandler.createWritable();
		await writable.write(JSON.stringify(this.save));
		await writable.close();
	};

	/**
	 * Load a save file from the file system.
	 */
	loadSave = async () => {
		// Open the file picker for a single JSON file
		const [fileHandle] = await showOpenFilePicker({
			id: "unnamed-project-saves",
			startIn: "downloads",
			types: [
				{
					description: "A unnamed-project game save file.",
					accept: { "application/json": [".json"] },
				},
			],
			multiple: false,
		});
		this.currentFileHandler = fileHandle;

		// Get the file from the handle
		const file = await this.currentFileHandler.getFile();
		// Read the file's text content
		const content = await file.text();
		// Parse the JSON data
		this.save = JSON.parse(content);
	};

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
			this.lft = 0;
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
		this.dt = time - (this.lft || 0);
		this.lft = time;
		this.save.time += this.dt; // Record the current time.

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
