/**
 * Checks whether two arrays contain the exact same object references,
 * regardless of order. Each object in one array must have a unique match
 * in the other array (i.e., handles duplicates correctly).
 *
 * @param {Object[]} arr1 The first array of object references.
 * @param {Object[]} arr2 The second array of object references.
 * @returns {boolean} True if both arrays contain the same object references, false otherwise.
 */
export function arraysContainSameObjects(arr1, arr2) {
	if (arr1.length !== arr2.length) return false;

	const matched = new Array(arr2.length).fill(false);

	for (let obj1 of arr1) {
		let found = false;
		for (let i = 0; i < arr2.length; i++) {
			if (!matched[i] && obj1 === arr2[i]) {
				matched[i] = true;
				found = true;
				break;
			}
		}
		if (!found) return false;
	}

	return true;
}
