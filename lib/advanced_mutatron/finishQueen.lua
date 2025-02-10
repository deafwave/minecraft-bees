local getMutatrons = require("lib.peripherals.mutatron")
local breedingUtils = require("lib.utils.breeding")
local beeUtils = require("lib.bees.bee_utils")
local wanted_bees = require("lib._config.wanted_bees")

-- Finish creation of a queen bee with a desired species
local function finishQueen()
    local mutatrons = getMutatrons()
    local storage = peripheral.find("actuallyadditions:giantchestlarge")
    if not storage then
        print("No ActuallyAdditions giant chest found!")
        return false
    end

    local inventory = beeUtils.buildBeeInventory(false)

    local foundOutput = false
    for _, mutatron in ipairs(mutatrons) do
        -- Check output slots
        for slot = 5, 10 do
            local output = mutatron.getItemMeta(slot)
            if output and output.individual then
                local species = output.individual.id
                if species then
                    for _, targetSpecies in ipairs(wanted_bees) do
                        if not inventory.existingSpecies[targetSpecies] then
                            local breedingPaths = breedingUtils.findBreedingPaths(targetSpecies)

                            for _, path in ipairs(breedingPaths) do
                                for _, step in ipairs(path) do
                                    if step.target == species and not inventory.existingSpecies[step.target] then
                                        print("Store useful bee: " .. species)
                                        mutatron.pushItems(peripheral.getName(storage), slot)
                                        mutatron.pushItems(peripheral.getName(storage), 1) -- TODO: delete the princess
                                        mutatron.pushItems(peripheral.getName(storage), 2) -- TODO: delete the drone
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
