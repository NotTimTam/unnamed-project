export default [
	{
		label: "Collect Rock",
		stamina: 1,
		outcomes: [
			{
				name: "rock",
				amount: 1,
			},
		],
	},
	{
		label: "Sharpen Stone",
		stamina: 5,
		items: [
			{
				name: "rock",
				amount: 2,
				consumed: true,
			},
		],
		parts: [
			{
				name: "arm",
				damage: 1,
			},
		],
		outcomes: [
			{
				name: "sharpened_stone",
				amount: 1,
			},
		],
	},
	{
		label: "Delimb Tree",
		stamina: 15,
		items: [
			{
				name: "sharpened_stone",
				amount: 1,
				consumed: true,
			},
		],
		outcomes: [
			{
				name: "wood",
				amount: 1,
			},
		],
	},
	{
		label: "Extract Fiber",
		items: [
			{
				name: "wood",
				amount: 1,
				consumed: true,
			},
		],

		outcomes: [
			{
				name: "fiber",
				amount: 5,
			},
		],
	},
];
