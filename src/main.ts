import { maintainMutatron } from "./lib/advanced-mutatron"
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

while(true) {
    maintainMutatron()
    // maintainMutagen()
    // maintainApiary()

    // createPoorQualityQueen()
    // finishQueen() // TODO: Add a config setting to turn this off for players who don't want to dupe bees
    // killQueen()

    sleep(1)
}