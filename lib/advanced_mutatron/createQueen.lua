local getMutatrons = require("lib.peripherals.mutatron")
local beeUtils = require("lib.bees.bee_utils")
local breedingUtils = require("lib.utils.breeding")
local wanted_bees = require("lib._config.wanted_bees")
local yield = require("lib.utils.yield")
-- Prepare to create a queen bee with a desired species
local function createPoorQualityQueen()
    local mutatrons = getMutatrons()
    if #mutatrons == 0 then
        print("No advanced mutatron found")
        return false
    end

    local mutatron = mutatrons[1]
    local slot1 = mutatron.getItemMeta(1)
    local slot2 = mutatron.getItemMeta(2)

    if slot1 or slot2 then
        return false -- wait for mutatron to be empty
    end

    local inventory = beeUtils.buildBeeInventory()

    for _, targetSpecies in ipairs(wanted_bees) do
        if not inventory.existingSpecies[targetSpecies] then
            print("Need: " .. targetSpecies)
            for _, path in ipairs(breedingUtils.getBreedingPaths()) do
                yield()
                local assignedPath = breedingUtils.assignBreedingRoles(path, inventory)
                if assignedPath then
                    for _, step in ipairs(assignedPath) do
                        if not inventory.existingSpecies[step.target] then
                            local pair = breedingUtils.findBestBreedingPair(inventory, step.princess, step.drone)
                            if pair then
                                print("  Creating " .. step.target)
                                print("    Princess: " .. step.princess)
                                print("    Drone: " .. step.drone)

                                pair.princess.storage.pushItems(peripheral.getName(mutatron), pair.princess.slot, 1, 1)
                                pair.drone.storage.pushItems(peripheral.getName(mutatron), pair.drone.slot, 1, 2)
                                return true
                            end
                        end
                    end
                end
            end
        end
    end
    return false
end

return createPoorQualityQueen
