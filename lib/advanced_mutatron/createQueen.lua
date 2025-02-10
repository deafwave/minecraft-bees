local getMutatrons = require("lib.peripherals.mutatron")
local beeUtils = require("lib.bees.bee_utils")
local breedingUtils = require("lib.utils.breeding")
local base_bees = require("lib._config.base_bees")

-- Prepare to create a queen bee with a desired species
local function createPoorQualityQueen()
    local mutatrons = getMutatrons()
    local wanted_bees = require("lib._config.wanted_bees")

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

            local requiredSpecies = breedingUtils.findRequiredSpecies(targetSpecies)

            -- Find breeding paths for the target and all required intermediate species
            local allPaths = {}
            for species in pairs(requiredSpecies) do
                if not inventory.existingSpecies[species] and not base_bees[species] then
                    local paths = breedingUtils.findBreedingPaths(species)
                    for _, path in ipairs(paths) do
                        table.insert(allPaths, path)
                    end
                end
            end

            -- Sort paths by dependency (species needed by other paths come first)
            table.sort(allPaths, function(a, b)
                -- If species from path a is needed to breed species from path b, a should come first
                local aTarget = a[#a].target
                for _, step in ipairs(b) do
                    if step.parents[1] == aTarget or step.parents[2] == aTarget then
                        return true
                    end
                end
                return false
            end)

            for _, path in ipairs(allPaths) do
                local assignedPath = breedingUtils.assignBreedingRoles(path, inventory)
                if assignedPath then
                    for _, step in ipairs(assignedPath) do
                        if not inventory.existingSpecies[step.target] then
                            -- Try to find breeding pair
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
