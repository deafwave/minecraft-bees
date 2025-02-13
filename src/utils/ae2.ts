/** @noSelf **/
interface IGrid {
    findItem(item: string): IAEItemStack
    findItems(item: string): IAEItemStack[]
    getCraftingCPUs(): unknown
    getNetworkEnergyStored(): number
    getNetworkEnergyUsage(): number
    listAvailableItems(): unknown
}

/** @noSelf **/
interface Item {
    getMetadata(): {
        count: number
    }
}
/** @noSelf **/
interface IAEItemStack extends Item {
    craft(quantity: number): unknown
    export(toName: string, limit?: number, toSlot?: number): number
}

export function transferItemFromAE2(itemId: string, targetPeripheralType: string, minCount: number, maxCount: number, targetSlot: number): void {
    const interfacePeripheral = peripheral.find<IGrid>("appliedenergistics2:interface");

    if (!interfacePeripheral) {
        print("Could not find AE2 interface");
        return
    }
    const ae2Interface = interfacePeripheral[0];

    const item = ae2Interface.findItem(itemId);
    if (!item) {
        print(`No ${itemId} in AE2 system`);
        return
    }

    const unknownPeripheral = peripheral.find<InventoryPeripheral>(targetPeripheralType);
    for (const destination of unknownPeripheral) {
        const slot = destination.getItemMeta(targetSlot); // I think this needs to be getItemMeta on 1.89.2
        const currentCount = slot ? slot.count : 0;

        // print all known info about the slot
        if (currentCount < minCount) {
            const count = maxCount - currentCount;
            const metadata = item.getMetadata();
            const itemCount = metadata.count;

            if (itemCount >= count) {
                item.export(peripheral.getName(destination), count);
            } else {
                return;
            }
        }
    }
    return;
}

export function findOrCraftItem(itemId: string, count: number): IAEItemStack | undefined {
    const interfacePeripheral = peripheral.find("appliedenergistics2:interface") as unknown as IGrid;

    if (!interfacePeripheral) {
        print("Could not find AE2 interface");
        return;
    }

    const item = interfacePeripheral.findItem(itemId);
    if (item) {
        const metadata = item.getMetadata();
        if (metadata.count >= count) {
            return item;
        }
    }

    print(`Attempting to craft ${itemId}`);
    item.craft(count);

    return;
}