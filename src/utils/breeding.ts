/** @noSelfInFile */
import { baseBees, breedingChart, wantedBees } from '../config/meatballcraft'
import { yieldSmart } from './yield'

/** @noSelf */
interface Inventory {
	princesses: Record<string, BeeInfo>
	drones: Record<string, BeeInfo>
}
/** @noSelf */
interface BeeInfo {
	// Add relevant bee information properties here
	species: string
	// Add other properties as needed
}

/** @noSelf */
interface BreedingStep {
	target: string
	parents: [string, string]
}

/** @noSelf */
interface BreedingAssignment {
	target: string
	princess: string
	drone: string
}

/** @noSelf */
interface BreedingPair {
	princess: BeeInfo
	drone: BeeInfo
}

// Find all species required to breed a target species
function findRequiredSpecies(
	targetSpecies: string,
	visited: Record<string, boolean> = {},
): Record<string, boolean> {
	if (visited[targetSpecies]) {
		return {}
	}
	visited[targetSpecies] = true

	const required: Record<string, boolean> = { [targetSpecies]: true }

	if (baseBees[targetSpecies]) {
		return required
	}

	if (!breedingChart[targetSpecies]) {
		return required
	}

	for (const parents of breedingChart[targetSpecies]) {
		// Recursively find required species for each parent
		for (const parent of parents) {
			const parentRequired = findRequiredSpecies(parent, visited)
			for (const species in parentRequired) {
				required[species] = true
			}
		}
	}

	return required
}

function findBreedingPaths(
	targetSpecies: string, // something is happening which is causing this to be nil in LUA

	currentPath: BreedingStep[] = [],
	allPaths: BreedingStep[][] = [],
	visited: Record<string, boolean> = {},
): BreedingStep[][] {
	if (visited[targetSpecies]) {
		return allPaths
	}
	visited[targetSpecies] = true

	if (baseBees[targetSpecies]) {
		return allPaths
	}

	if (!breedingChart[targetSpecies]) {
		return allPaths
	}

	for (const parents of breedingChart[targetSpecies]) {
		const [firstParent, secondParent] = parents
		const newPath: BreedingStep = {
			target: targetSpecies,
			parents: [firstParent, secondParent],
		}

		currentPath.push(newPath)

		// Recursively find paths for parents if they're not base bees
		if (!baseBees[parents[0]]) {
			findBreedingPaths(firstParent, currentPath, allPaths, visited)
		}
		if (!baseBees[parents[1]]) {
			findBreedingPaths(secondParent, currentPath, allPaths, visited)
		}

		const pathCopy = [...currentPath]
		allPaths.push(pathCopy)

		currentPath.pop()
	}

	visited[targetSpecies] = false
	return allPaths
}

function assignBreedingRoles(
	path: BreedingStep[],
	inventory: Inventory,
): BreedingAssignment[] | null {
	const result: BreedingAssignment[] = []

	for (const step of path) {
		const parent1 = step.parents[0]
		const parent2 = step.parents[1]

		if (inventory.princesses[parent1] && inventory.drones[parent2]) {
			result.push({
				target: step.target,
				princess: parent1,
				drone: parent2,
			})
		} else if (inventory.princesses[parent2] && inventory.drones[parent1]) {
			result.push({
				target: step.target,
				princess: parent2,
				drone: parent1,
			})
		} else {
			return null
		}
	}
	return result
}

function findBestBreedingPair(
	inventory: Inventory,
	princessSpecies: string,
	droneSpecies: string,
): BreedingPair | null {
	const princessInfo = inventory.princesses[princessSpecies]
	const droneInfo = inventory.drones[droneSpecies]

	if (princessInfo && droneInfo) {
		return {
			princess: princessInfo,
			drone: droneInfo,
		}
	}

	return null
}

export function findUnknownBees(): string[] {
	const allMentionedBees: Record<string, boolean> = {}

	for (const result in breedingChart) {
		allMentionedBees[result] = true
		for (const parents of breedingChart[result]) {
			allMentionedBees[parents[0]] = true
			allMentionedBees[parents[1]] = true
		}
	}

	for (const bee in baseBees) {
		allMentionedBees[bee] = true
	}

	const unknownBees: string[] = []
	for (const bee in allMentionedBees) {
		if (!baseBees[bee] && !breedingChart[bee]) {
			unknownBees.push(bee)
		}
	}

	return unknownBees.sort()
}

/** @noSelf */
interface BreedingPaths {
	[species: string]: [string, string][]
}
let cachedBreedingPaths: BreedingPaths
export function getBreedingPaths(): BreedingPaths {
	// if (cachedBreedingPaths) {
	//     return cachedBreedingPaths;
	// }

	print('Calculating all breeding paths...')
	const allPaths: { [species: string]: Set<string> } = {}

	for (const targetSpecies of wantedBees) {
		yieldSmart()
		const requiredSpecies = findRequiredSpecies(targetSpecies)

		for (const species in requiredSpecies) {
			yieldSmart()
			if (!baseBees[species]) {
				const paths = findBreedingPaths(species)
				for (const path of paths) {
					yieldSmart()
					for (const step of path) {
						if (!allPaths[step.target]) {
							allPaths[step.target] = new Set()
						}
						const joinedSortedParents = step.parents
							.sort()
							.join('_')
						allPaths[step.target].add(joinedSortedParents)
					}
				}
			}
		}
	}

	const result: BreedingPaths = {}
	for (const [species, speciesSet] of Object.entries(allPaths)) {
		result[species] = Array.from(speciesSet).map(
			(item) => item.split('_') as [string, string],
		)
	}

	cachedBreedingPaths = result
	print('Cached breeding paths!')
	return result
}
