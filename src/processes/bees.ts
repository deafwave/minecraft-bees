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
            const xxxx = getBreedingPaths();
            print(xxxx);
            // for (const path of getBreedingPaths()) {
            //     yieldSmart();
            //     const assignedPath = assignBreedingRoles(path, inventory);
            //     if (assignedPath) {
            //         for (const step of assignedPath) {
            //             if (!inventory.existingSpecies[step.target]) {
            //                 const pair = findBestBreedingPair(inventory, step.princess, step.drone);
            //                 if (pair) {
            //                     print("  Creating " + step.target);
            //                     print("    Princess: " + step.princess);
            //                     print("    Drone: " + step.drone);

            //                     pair.princess.storage.pushItems(peripheral.getName(mutatron), pair.princess.slot, 1, 1);
            //                     pair.drone.storage.pushItems(peripheral.getName(mutatron), pair.drone.slot, 1, 2);
            //                     return true;
            //                 }
            //             }
            //         }
            //     }
            // }
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