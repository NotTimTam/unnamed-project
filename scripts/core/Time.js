/**
 * Manages dealing with units of time.
 *
 * All in-game time management is handled in real-world units (usually milliseconds)
 * but is displayed in in-game units (60:1 scale).
 */
export default class Time {
	/** Time scale constant (60:1) */
	static timeScale = 60;

	/** Days per standard year */
	static daysPerYear = 360;

	/** Months per year */
	static monthsPerYear = 12;

	/** Days per month */
	static daysPerMonth = 30;

	/** Week length */
	static daysPerWeek = 7;

	/** Years per decade. */
	static yearsPerDecade = 10;

	/** Years per century. */
	static yearsPerCentury = 100;

	/** Month names */
	static monthNames = [
		["January", "Jan"],
		["February", "Feb"],
		["March", "Mar"],
		["April", "Apr"],
		["May", "May"],
		["June", "Jun"],
		["July", "Jul"],
		["August", "Aug"],
		["September", "Sep"],
		["October", "Oct"],
		["November", "Nov"],
		["December", "Dec"],
	];

	/**
	 * Convert real-world time in milliseconds to in-game time.
	 * @param {number} timestamp - The real-world timestamp (in milliseconds).
	 * @returns {number} The in-game timestamp (in in-game milliseconds).
	 */
	static timestampToGame = (timestamp) => timestamp * Time.timeScale;

	/**
	 * Converts a real-world timestamp into an object with various in-game time units.
	 * @param {number} timestamp - The real-world timestamp (in milliseconds).
	 * @returns {object} An object containing raw, inGame, inGameSeconds, inGameMinutes, and inGameHours.
	 */
	static timestampAsObject = (timestamp) => {
		const returnable = {
			raw: timestamp,
			inGame: timestamp * Time.timeScale,
		};

		// Calculate in-game time in seconds, minutes, and hours.
		returnable.inGameSeconds = returnable.inGame / 1000;
		returnable.inGameMinutes = returnable.inGameSeconds / 60;
		returnable.inGameHours = returnable.inGameMinutes / 60;

		return returnable;
	};

	/**
	 * Create a new Time instance.
	 * @param {Runtime} runtime The runtime instance.
	 * @param {number} timestamp A timestamp override to use instead of the one in the save file.
	 */
	constructor(runtime, timestamp) {
		this.runtime = runtime;
		this.timestamp = timestamp;
	}

	/**
	 * Get the total real-world time played in milliseconds for this save.
	 * @returns {number} The raw time in milliseconds.
	 */
	get rawTime() {
		if (this.timestamp && typeof this.timestamp === "number")
			return this.timestamp;
		else if (this.runtime && this.runtime.save)
			return +this.runtime.save.time;
		else return 0;
	}

	/**
	 * Get the total in-game time played in milliseconds.
	 * @returns {number} The in-game time in milliseconds.
	 */
	get time() {
		return this.rawTime * Time.timeScale;
	}

	/**
	 * Returns the number of in-game milliseconds.
	 * @returns {number} In-game milliseconds (0-999).
	 */
	getMilliseconds = () => this.time % 1000;

	/**
	 * Returns the current in-game seconds (0-59).
	 * Math.floor is used to ensure seconds only advance when a full second passes.
	 * @returns {number} In-game seconds.
	 */
	getSeconds = () => Math.floor((this.time / 1000) % 60);

	/**
	 * Returns the current in-game minutes (0-59).
	 * Math.floor is used to ensure minutes only advance when a full minute passes.
	 * @returns {number} In-game minutes.
	 */
	getMinutes = () => Math.floor((this.time / 1000 / 60) % 60);

	/**
	 * Returns the current in-game hours (0-23).
	 * Math.floor is used to ensure hours only advance when a full hour passes.
	 * @returns {number} In-game hours.
	 */
	getHours = () => Math.floor((this.time / 1000 / 60 / 60) % 24);

	/**
	 * Returns the total in-game days elapsed.
	 * @returns {number} In-game days elapsed.
	 */
	getTotalDays = () => Math.floor(this.time / 1000 / 60 / 60 / 24);

	/**
	 * Returns the current in-game day of the week (0=Sunday, 6=Saturday).
	 * @returns {number} In-game day of the week.
	 */
	getDayOfWeek = () => this.getTotalDays() % Time.daysPerWeek;

	/**
	 * Returns the current in-game day of the month (1-30).
	 * @returns {number} In-game day of the month.
	 */
	getDate = () => (this.getTotalDays() % Time.daysPerMonth) + 1;

	/**
	 * Returns the current in-game month (1-12).
	 * Unlike the JS Date object, this starts at 1.
	 * @returns {number} In-game month.
	 */
	getMonth = () =>
		(Math.floor(this.getTotalDays() / Time.daysPerMonth) %
			Time.monthsPerYear) +
		1;

	/**
	 * Returns the full name of the current in-game month.
	 * @returns {string} Full month name.
	 */
	getMonthName = () => Time.monthNames[this.getMonth() - 1][0];

	/**
	 * Returns the shortened name of the current in-game month (e.g., "Jan").
	 * @returns {string} Shortened month name.
	 */
	getShortMonthName = () => Time.monthNames[this.getMonth() - 1][1];

	/**
	 * Returns the current in-game year.
	 * The epoch (timestamp 0) starts at **year 0**.
	 * @returns {number} In-game full year.
	 */
	getTotalYears = () =>
		Math.floor(this.getTotalDays() / Time.daysPerYear) + 1;

	/**
	 * Returns the total number of in-game decades elapsed.
	 * @returns {number} Total in-game decades.
	 */
	getTotalDecades = () =>
		Math.floor(this.getTotalYears() / Time.yearsPerDecade) + 1;

	/**
	 * Returns the total number of in-game centuries elapsed.
	 * @returns {number} Total in-game centuries.
	 */
	getTotalCenturies = () =>
		Math.floor(this.getTotalYears() / Time.yearsPerCentury) + 1;

	/**
	 * Returns the total number of in-game eras elapsed.
	 * @returns {number} Total in-game eras.
	 */
	getTotalEras = () => Math.floor(this.getTotalYears() / 1000) + 1;

	/**
	 * Returns the total number of in-game ages elapsed.
	 * @returns {number} Total in-game ages.
	 */
	getTotalAges = () => Math.floor(this.getTotalYears() / 10000) + 1;

	/**
	 * Returns the current in-game year within the decade (1-10).
	 * @returns {number} In-game year in the current decade.
	 */
	getYearInDecade = () => (this.getTotalYears() % Time.yearsPerDecade) + 1;

	/**
	 * Returns the current in-game decade within the century (1-10).
	 * @returns {number} In-game decade in the current century.
	 */
	getDecadeInCentury = () =>
		(this.getTotalDecades() %
			(Time.yearsPerCentury / Time.yearsPerDecade)) +
		1;

	/**
	 * Returns the current in-game century within the era (1-10).
	 * @returns {number} In-game century in the current era.
	 */
	getCenturyInEra = () =>
		(this.getTotalCenturies() % (1000 / Time.yearsPerCentury)) + 1;

	/**
	 * Returns the current in-game era within the age (1-10).
	 * @returns {number} In-game era in the current age.
	 */
	getEraInAge = () => this.getTotalEras() % (10000 / 1000);

	/**
	 * Converts a number into its ordinal format (e.g., 1st, 2nd, 3rd, etc.).
	 * @param {number} num - The number to convert.
	 * @returns {string} The number with its ordinal suffix.
	 */
	getOrdinalSuffix = (num) => {
		const lastDigit = num % 10;
		const lastTwoDigits = num % 100;

		if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
			return `${num}th`;
		}

		switch (lastDigit) {
			case 1:
				return `${num}st`;
			case 2:
				return `${num}nd`;
			case 3:
				return `${num}rd`;
			default:
				return `${num}th`;
		}
	};

	/**
	 * @returns {number} The current hour in 12-hour format.
	 */
	getHours12 = () => {
		return this.getHours() % 12 || 12;
	};

	/**
	 * @returns {string} The correct AM/PM display for the current hour.
	 */
	getMeridiem = () => (this.getHours() < 12 ? "AM" : "PM");

	/**
	 * Get the current time in a pretty display.
	 * @param {boolean} twelveHourFormat Whether to display in a 12-hour format.
	 * @param {boolean} withSeconds Whether to display seconds.
	 * @returns {string} The display string.
	 */
	getTimeDisplay = (twelveHourFormat = false, withSeconds = false) => {
		const displaySeconds = withSeconds
			? `:${String(this.getSeconds()).padStart(2, "0")}`
			: "";

		if (twelveHourFormat)
			return `${String(this.getHours12()).padStart(2, "0")}:${String(
				this.getMinutes()
			).padStart(2, "0")}${displaySeconds} ${this.getMeridiem()}`;
		else
			return `${String(this.getHours()).padStart(2, "0")}:${String(
				this.getMinutes()
			).padStart(2, "0")}${displaySeconds}`;
	};

	/**
	 * @param {boolean} compact Whether to make the date display compact.
	 * @returns {string} Date display string.
	 */
	getDateDisplay = (compact = false) =>
		compact
			? `${String(this.getTotalYears()).padStart(4, "0")}-${String(
					this.getMonth()
			  ).padStart(2, "0")}-${String(this.getDate()).padStart(2, "0")}`
			: `${this.getMonthName()} ${this.getOrdinalSuffix(
					this.getDate()
			  )}, Year ${this.getTotalYears()}`;

	/**
	 * @param {boolean} compact Whether to make the date-time display compact.
	 * @returns {string} Date-time display string.
	 */
	getDateTimeDisplay = (compact) =>
		`${this.getDateDisplay(compact)}, ${this.getTimeDisplay(true, false)}`;

	getEpochDisplay = () =>
		`${this.getOrdinalSuffix(
			this.getTotalYears()
		)} Year of our Lord, in the ${this.getOrdinalSuffix(
			this.getEraInAge()
		)} Era of the ${this.getOrdinalSuffix(this.getTotalAges())} Age`;
}
