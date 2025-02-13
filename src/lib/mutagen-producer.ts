import { transferItemFromAE2 } from "../utils/ae2";

// local function transferMutagen()
//     local producers = fluid.findPeripheralsByType("gendustry:mutagen_producer")
//     local mutatrons = fluid.findPeripheralsByType("gendustry:mutatron_advanced")

//     for _, producer in ipairs(producers) do
//         local producerTank = fluid.getTankInfo(producer)

//         if fluid.hasEnoughFluid(producerTank, 1000) then
//             for _, mutatron in ipairs(mutatrons) do
//                 if fluid.canAcceptFluid(fluid.getTankInfo(mutatron), 1000, 8000) then
//                     fluid.transferFluid(producer, mutatron, 1000, "mutagen")
//                 end
//             end
//         end
//     end
// end

export const maintainMutagen = () => {
    transferItemFromAE2("minecraft:redstone_block", "gendustry:mutagen_producer", 2, 2, 1)
    // emptyOutputSlot(); // Only used when finishQueen() is disabled
}