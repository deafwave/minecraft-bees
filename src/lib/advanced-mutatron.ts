import { transferItemFromAE2 } from "../utils/ae2";

// function emptyOutputSlot(): boolean {
//     const mutatrons = getMutatrons();

//     if (mutatrons.length === 0) {
//         console.log("No advanced mutatron found");
//         return false;
//     }

//     const storage = peripheral.find("actuallyadditions:giantchestlarge");
//     if (!storage) {
//         console.log("No ActuallyAdditions giant chest found!");
//         return false;
//     }

//     for (const mutatron of mutatrons) {
//         const item = mutatron.getItemMeta(3);
//         if (item) {
//             // console.log("Found item in slot 3: " + JSON.stringify(item));
//             mutatron.pushItems(peripheral.getName(storage), 3);
//         }
//     }
//     return true;
// }

export const maintainMutatron = () => {
    transferItemFromAE2("gendustry:labware", "gendustry:mutatron_advanced", 2, 2, 4);
    // emptyOutputSlot(); // Only used when finishQueen() is disabled
}