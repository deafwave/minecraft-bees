interface ExistingBees {
    existingSpecies: { [species: string]: boolean };
    princesses: { [species: string]: { storage: InventoryPeripheral; slot: number } };
    drones: { [species: string]: { storage: InventoryPeripheral; slot: number } };
    queens: { [species: string]: { storage: InventoryPeripheral; slot: number } };
}

function getBeeStorages(includeMutatrons: boolean = true, includeApiaries: boolean = true): InventoryPeripheral[] {
    const crates = peripheral.find<InventoryPeripheral>("actuallyadditions:giantchestlarge");
    let apiaries = includeApiaries ? peripheral.find<InventoryPeripheral>("gendustry:industrial_apiary") : [];
    let mutatrons = includeMutatrons ? peripheral.find<InventoryPeripheral>("gendustry:mutatron") : [];

    return [...crates, ...apiaries, ...mutatrons];
}

export function getExistingBees(includeMutatrons: boolean, includeApiaries: boolean): ExistingBees {
    const storages = getBeeStorages(includeMutatrons, includeApiaries);
    const inventory: ExistingBees = {
        existingSpecies: {},
        princesses: {},
        drones: {},
        queens: {}
    };
    storages.forEach((storage, i) => {
        if (storage.size() > 0) {
        const listResult = storage.list();
            if (listResult) {
                Object.entries(listResult).forEach(([slot, item]) => {
                    if (item.name === "forestry:bee_princess_ge" || 
                        item.name === "forestry:bee_drone_ge" || 
                        item.name === "forestry:bee_queen_ge") {
                        
                        const itemMeta = storage.getItemMeta(Number(slot));
                        if (itemMeta && itemMeta.individual) {
                            const species = itemMeta.individual.id;
                            
                            if (species) {
                                inventory.existingSpecies[species] = true;
                                
                                if (item.name === "forestry:bee_princess_ge") {
                                    if (!inventory.princesses[species]) {
                                        inventory.princesses[species] = { storage, slot: Number(slot) };
                                    }
                                } else if (item.name === "forestry:bee_drone_ge") {
                                    if (!inventory.drones[species]) {
                                        inventory.drones[species] = { storage, slot: Number(slot) };
                                    }
                                } else if (item.name === "forestry:bee_queen_ge") {
                                    if (!inventory.queens[species]) {
                                        inventory.queens[species] = { storage, slot: Number(slot) };
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    });

    return inventory;
}