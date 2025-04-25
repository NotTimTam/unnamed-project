export default [
	{
		label: "Collect Rock",
		stamina: 1,
		outcomes: [
			{
				name: "rock",
				type: "good",
				amount: 1,
			},
		],
	},
	{
		label: "Sharpen Stone",
		stamina: 5,
		goods: [
			{
				name: "rock",
				amount: 2,
				consumed: true,
			},
		],
		tools: [
			{
				name: "arm",
				type: "part",
				damage: 1,
			},
		],
		outcomes: [
			{
				name: "sharpened_stone",
				type: "tool",
				amount: 1,
			},
		],
	},
	{
		label: "Cut Down Tree",
		stamina: 15,
		tools: [
			{
				name: "sharpened_stone",
				amount: 1,
				consumed: true,
			},
		],
		outcomes: [
			{
				name: "wood",
				type: "good",
				amount: 3,
			},
		],
	},
	{
		label: "Extract Fiber",
		goods: [
			{
				name: "wood",
				amount: 1,
				consumed: true,
			},
		],
		tools: [
			{
				name: "sharpened_stone",
				amount: 1,
				consumed: false,
			},
		],
		outcomes: [
			{
				name: "fiber",
				type: "good",
				amount: 5,
			},
		],
	},
];
