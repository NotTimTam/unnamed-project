export default [
	{
		label: "Gather Rock",
		stamina: 1,
		// requires: {
		// 	tools: {
		// 		sharpened_stone: 1,
		// 	},
		// },
		method: (runtime) => {
			runtime.earth.giveGood("rock", 1, runtime.player);
		},
	},
	{
		label: "Chop Down Tree",
		stamina: 25,
		requires: {
			tools: {
				sharpened_stone: 1,
			},
		},
		method: (runtime) => {
			runtime.earth.giveGood("wood", 3, runtime.player);
		},
	},
];
