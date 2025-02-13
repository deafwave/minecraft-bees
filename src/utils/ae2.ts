interface IGrid {
    findItem(item: string): IAEItemStack
    findItems(item: string): IAEItemStack[]
    getCraftingCPUs(): unknown
    getNetworkEnergyStored(): number
    getNetworkEnergyUsage(): number
    listAvailableItems(): unknown
}

interface Item {
    getMetadata(): {
        count: number
    }
}
interface IAEItemStack extends Item {
    craft(quantity: number): unknown
    export(toName: string, limit?: number, toSlot?: number): number
}

export function transferItemFromAE2(itemId: string, targetPeripheralType: string, minCount: number, maxCount: number, targetSlot: number): void {
    const interfacePeripheral = peripheral.find("appliedenergistics2:interface")[0] as unknown as IGrid;

    if (!interfacePeripheral) {
        print("Could not find AE2 interface");
        return
    }

    const item = interfacePeripheral.findItem(itemId);
    if (!item) {
        print(`No ${itemId} in AE2 system`);
        return
    }

    const names = peripheral.getNames();
    for (const destination of names) {
        const pType = peripheral.getType(destination) as unknown as string;
        if (pType === targetPeripheralType) {
            const device = peripheral.wrap(destination) as {
                getItemMeta: (slot: number) => {
                    count: number
                }
            };

            const slot = device.getItemMeta(targetSlot);
            const currentCount = slot ? slot.count : 0;

            if (currentCount < minCount) {
                const count = maxCount - currentCount;
                const metadata = item.getMetadata();
                const itemCount = metadata.count;

                if (itemCount >= count) {
                    item.export(destination, count);
                } else {
                    return;
                }
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