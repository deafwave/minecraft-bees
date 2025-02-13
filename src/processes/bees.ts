import { wantedBees } from "../config/meatballcraft";
import { getExistingBees } from "../lib/storage-bees";
import { getBreedingPaths } from "../utils/breeding";
import { yieldSmart } from "../utils/yield";

const createQueen = () => {
    const mutatrons = peripheral.find<InventoryPeripheral>("gendustry:mutatron_advanced");
    if (mutatrons.length === 0) {
        print("No advanced mutatron found");
        return false;
    }

    const mutatron = mutatrons[0];
    const slot1 = mutatron.getItemMeta(1);
    const slot2 = mutatron.getItemMeta(2);

    if (slot1 || slot2) {
        return false; // wait for mutatron to be empty
    }

    const inventory = getExistingBees(true, true);

    for (const targetSpecies of wantedBees) {
        if (!inventory.existingSpecies[targetSpecies]) {
            print("Need: " + targetSpecies);
            const breedingPaths = getBreedingPaths();
            const allSpecies = Object.keys(breedingPaths);
            for (const species of allSpecies) {
                const allMethodsToCreateSpecies = breedingPaths[species];
                yieldSmart();
                for (const method of allMethodsToCreateSpecies) {
                    const [parent1, parent2] = method;
                    if (inventory.princesses[parent1] && inventory.drones[parent2]) {
                        print("  Creating " + species);
                        print("    Princess: " + parent1);
                        print("    Drone: " + parent2);

                        inventory.princesses[parent1].storage.pushItems(peripheral.getName(mutatron), inventory.princesses[parent1].slot, 1, 1);
                        inventory.drones[parent2].storage.pushItems(peripheral.getName(mutatron), inventory.drones[parent2].slot, 1, 2);
                        return true;
                    } else if (inventory.drones[parent1] && inventory.princesses[parent2]) {
                        print("  Creating " + species);
                        print("    Princess: " + parent2);
                        print("    Drone: " + parent1);

                        inventory.princesses[parent2].storage.pushItems(peripheral.getName(mutatron), inventory.princesses[parent2].slot, 1, 1);
                        inventory.drones[parent1].storage.pushItems(peripheral.getName(mutatron), inventory.drones[parent1].slot, 1, 2);
                        return true;
                    }
                }
            }

        }
    }
    return false;
};

const finishQueen = () => {

}

const killQueen = () => {

}

export const createNewSpecies = () => {
    createQueen()
    finishQueen() // TODO: Add a config setting to turn this off for players who don't want to dupe bees
    killQueen()
}