local getMutatrons = require("lib.peripherals.mutatron")
local breedingUtils = require("lib.utils.breeding")
local beeUtils = require("lib.bees.bee_utils")
local wanted_bees = require("lib._config.wanted_bees")

-- Function to handle mutatron outputs
local function finishQueen()
    local mutatrons = getMutatrons()
    local storage = peripheral.find("actuallyadditions:giantchestlarge")
    if not storage then
        print("No ActuallyAdditions giant chest found!")
        return false
    end

    -- Build inventory excluding mutatrons
    local inventory = beeUtils.buildBeeInventory(false)
    -- print("Current species in permanent storage:")
    -- for species, _ in pairs(inventory.existingSpecies) do
    --     print("  " .. species)
    -- end

    local foundOutput = false
    -- Check each mutatron
    for _, mutatron in ipairs(mutatrons) do
        -- Check output slots
        for slot = 5, 10 do
            local output = mutatron.getItemMeta(slot)
            if output and output.individual then
                local species = output.individual.id
                if species then
                    -- For each wanted bee we don't have yet
                    for _, targetSpecies in ipairs(wanted_bees) do
                        if not inventory.existingSpecies[targetSpecies] then
                            -- Find all possible breeding paths for this species
                            local breedingPaths = breedingUtils.findBreedingPaths(targetSpecies)

                            -- Check if this species is a needed target in any breeding path
                            for _, path in ipairs(breedingPaths) do
                                for _, step in ipairs(path) do
                                    if step.target == species and not inventory.existingSpecies[step.target] then
                                        print("Store useful bee: " .. species)
                                        -- Move the successful breeding pair and result to storage
                                        mutatron.pushItems(peripheral.getName(storage), slot)
                                        mutatron.pushItems(peripheral.getName(storage), 1)
                                        mutatron.pushItems(peripheral.getName(storage), 2)
                                        foundOutput = true
                                        break
                                    end
                                end
                                if foundOutput then break end
                            end
                        end
                        if foundOutput then break end
                    end
                    if foundOutput then break end
                end
            end
        end
        if foundOutput then break end
    end
    return foundOutput
end

return finishQueen
