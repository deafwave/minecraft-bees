import { protectedBees, wantedBees } from '../config/meatballcraft'
import { getExistingBees } from '../lib/storage-bees'
import { getBreedingPaths } from '../utils/breeding'
import { yieldSmart } from '../utils/yield'

const preparedQueens = new Set<string>()
const prepareQueen = () => {
	const mutatrons = peripheral.find<InventoryPeripheral>(
		'gendustry:mutatron_advanced',
	)
	if (mutatrons.length === 0) {
		print('No advanced mutatron found')
		return false
	}

	const mutatron = mutatrons[0]
	const slot1 = mutatron.getItemMeta(1)
	const slot2 = mutatron.getItemMeta(2)

	if (slot1 || slot2) {
		return false // wait for mutatron to be empty
	}

	const inventory = getExistingBees(true, true)

	for (const targetSpecies of wantedBees) {
		if (!inventory.existingSpecies[targetSpecies]) {
			print('Need: ' + targetSpecies)
			const breedingPaths = getBreedingPaths()
			const allSpecies = Object.keys(breedingPaths)
			for (const species of allSpecies) {
				if (!inventory.existingSpecies[species]) {
					const allMethodsToCreateSpecies = breedingPaths[species]
					yieldSmart()
					for (const method of allMethodsToCreateSpecies) {
						const [parent1, parent2] = method
						if (
							inventory.princesses[parent1] &&
							inventory.drones[parent2]
						) {
							preparedQueens.add(species)
							print('  Creating ' + species)
							print('    Princess: ' + parent1)
							print('    Drone: ' + parent2)

							inventory.princesses[parent1].storage.pushItems(
								peripheral.getName(mutatron),
								inventory.princesses[parent1].slot,
								1,
								1,
							)
							inventory.drones[parent2].storage.pushItems(
								peripheral.getName(mutatron),
								inventory.drones[parent2].slot,
								1,
								2,
							)
							return true
						} else if (
							inventory.drones[parent1] &&
							inventory.princesses[parent2]
						) {
							preparedQueens.add(species)
							print('  Creating ' + species)
							print('    Princess: ' + parent2)
							print('    Drone: ' + parent1)

							inventory.princesses[parent2].storage.pushItems(
								peripheral.getName(mutatron),
								inventory.princesses[parent2].slot,
								1,
								1,
							)
							inventory.drones[parent1].storage.pushItems(
								peripheral.getName(mutatron),
								inventory.drones[parent1].slot,
								1,
								2,
							)
							return true
						}
					}
				}
			}
		}
	}
	return false
}

const craftQueen = () => {
	const mutatrons = peripheral.find<InventoryPeripheral>(
		'gendustry:mutatron_advanced',
		(_, mutatron) => {
			return (
				mutatron.getItemMeta(1) !== null &&
				mutatron.getItemMeta(2) !== null
			)
		},
	)
	if (mutatrons.length === 0) return

	const inventory = getExistingBees(false, true)
	const storage = peripheral.find<InventoryPeripheral>(
		'actuallyadditions:giantchestlarge',
	)[0]

	for (const mutatron of mutatrons) {
		const itemList = mutatron.list()
		Object.keys(itemList).forEach((key) => {
			const slot = key as unknown as number
			if (slot - 4 > 0) {
				const itemMeta = mutatron.getItemMeta(slot)
				const type = itemMeta.name
				if (type !== 'forestry:bee_queen_ge') {
					print('[ERROR]: Unknown Output Found in Mutatron: ' + type)
					return
				}
				const species = itemMeta.individual.id
				if (preparedQueens.has(species)) {
					if (!inventory.queens[species]) {
						mutatron.pushItems(peripheral.getName(storage), slot)
					}
					preparedQueens.delete(species)
					return
				}
			}
		})
		mutatron.pushItems(peripheral.getName(storage), 1)
		mutatron.pushItems(peripheral.getName(storage), 2)
	}
}

const processQueen = () => {
	const apiaries = peripheral.find<InventoryPeripheral>(
		'gendustry:industrial_apiary',
		(_, apiary) => {
			return apiary.getItemMeta(1) === null
		},
	)

	// print("Empty apiaries: " + apiaries.length);

	const inventory = getExistingBees(false, false)
	const queenSpecies = Object.keys(inventory.queens).filter(
		(species) => protectedBees.indexOf(species) === -1,
	)

	for (const apiary of apiaries) {
		if (queenSpecies.length === 0) {
			break
		}

		const queen = inventory.queens[queenSpecies.pop()]
		if (queen) {
			queen.storage.pushItems(
				peripheral.getName(apiary),
				queen.slot,
				1,
				1,
			)
		}
	}
}

export const createNewSpecies = () => {
	prepareQueen()
	craftQueen() // TODO: Add a config setting to turn this off for players who don't want to dupe bees
	processQueen()
}
