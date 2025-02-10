local getBeeStorages = require("lib.peripherals.storage")

local function findSpeciesInStorages(storages, targetSpecies)
    for _, storage in ipairs(storages) do
        for slot = 1, storage.size() do
            local itemMeta = storage.getItemMeta(slot)
            if itemMeta and itemMeta.individual and
                string.match(itemMeta.individual.id, "extrabees%.species%.(.+)") == targetSpecies then
                return true
            end
        end
    end
    return false
end

local function findBreedingPair(storages, princessSpecies, droneSpecies)
    local princessSlot, princessStorage, droneSlot, droneStorage
    
    for _, storage in ipairs(storages) do
        for slot = 1, storage.size() do
            local itemMeta = storage.getItemMeta(slot)
            if itemMeta and itemMeta.individual then
                local species = itemMeta.individual.id
                
                if not princessSlot and 
                    itemMeta.name == "forestry:bee_princess_ge" and 
                    species == princessSpecies then
                    princessSlot = slot
                    princessStorage = storage
                elseif not droneSlot and 
                        itemMeta.name == "forestry:bee_drone_ge" and 
                        species == droneSpecies then
                    droneSlot = slot
                    droneStorage = storage
                end
                
                if princessSlot and droneSlot then
                    return princessStorage, princessSlot, droneStorage, droneSlot
                end
            end
        end
    end
    return nil
end

local function buildBeeInventory(includeMutatrons, includeApiaries)
    local storages = getBeeStorages(includeMutatrons, includeApiaries)
    local inventory = {
        existingSpecies = {},
        princesses = {},  -- species -> {storage, slot}
        drones = {},     -- species -> {storage, slot}
        queens = {}      -- species -> {storage, slot}
    }
    
    for i, storage in ipairs(storages) do
        -- print("Scanning storage " .. i .. " of " .. #storages)
        
        if storage.size() > 0 then
            local listResult = storage.list()
            if listResult then
                for slot, item in pairs(listResult) do
                    if item.name == "forestry:bee_princess_ge" or 
                       item.name == "forestry:bee_drone_ge" or 
                       item.name == "forestry:bee_queen_ge" then
                        
                        local itemMeta = storage.getItemMeta(slot)
                        if itemMeta and itemMeta.individual then
                            local species = itemMeta.individual.id
                            
                            if species then
                                inventory.existingSpecies[species] = true
                                
                                if item.name == "forestry:bee_princess_ge" then
                                    if not inventory.princesses[species] then
                                        inventory.princesses[species] = {storage = storage, slot = slot}
                                        -- print("Found princess: " .. species)
                                    end
                                elseif item.name == "forestry:bee_drone_ge" then
                                    if not inventory.drones[species] then
                                        inventory.drones[species] = {storage = storage, slot = slot}
                                        -- print("Found drone: " .. species)
                                    end
                                elseif item.name == "forestry:bee_queen_ge" then
                                    if not inventory.queens[species] then
                                        inventory.queens[species] = {storage = storage, slot = slot}
                                        -- print("Found queen: " .. species)
                                    end
                                end
                            end
                        end
                    end
                end
            end
        end
    end
    return inventory
end

return {
    findSpeciesInStorages = findSpeciesInStorages,
    findBreedingPair = findBreedingPair,
    buildBeeInventory = buildBeeInventory
}