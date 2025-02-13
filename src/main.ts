import { maintainMutatron } from './lib/advanced-mutatron'
import { maintainApiary } from './lib/industrial-apiary'
import { maintainMutagen } from './lib/mutagen-producer'
import { createNewSpecies } from './processes/bees'
import { writeToFile } from './utils/file'

// import { findUnknownBees } from "./utils/breeding"

// const unknownBees = findUnknownBees()
// if (unknownBees.length > 0) {
//     print("Unknown bees:")
//     for (const bee of unknownBees) {
//         print(bee)
//     }
// }

// -- DEBUGGING
// -- local allBees = beeUtils.buildBeeInventory()
// -- print("Current species in all storage:")
// -- for species, _ in pairs(allBees.existingSpecies) do
// --     print("  " .. species)
// -- end

// -- DEBUGGING
// -- local permBees = beeUtils.buildBeeInventory(false)
// -- print("Current species in permanent storage:")
// -- for species, _ in pairs(permBees.existingSpecies) do
// --     print("  " .. species)
// -- end

while (true) {
	maintainMutatron()
	maintainMutagen()
	maintainApiary()

	// createNewSpecies()

	sleep(1)
}
