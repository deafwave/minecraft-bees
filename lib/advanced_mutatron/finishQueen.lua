local getMutatrons = require("lib.peripherals.mutatron")
local breedingUtils = require("lib.utils.breeding")
local beeUtils = require("lib.bees.bee_utils")
local wanted_bees = require("lib._config.wanted_bees")
local yield = require("lib.utils.yield")

-- Finish creation of a queen bee with a desired species
local function finishQueen()
    local mutatrons = getMutatrons()
    local storage = peripheral.find("actuallyadditions:giantchestlarge")
    if not storage then
        print("No ActuallyAdditions giant chest found!")
        return false
    end

    local targetSpeciesLookup = breedingUtils.getTargetSpeciesLookup()
    local inventory = beeUtils.buildBeeInventory(false)
    local foundOutput = false
    for _, mutatron in ipairs(mutatrons) do
        -- Check output slots
        for slot = 5, 10 do
            local output = mutatron.getItemMeta(slot)
            if output and output.individual then
                local species = output.individual.id
                if species and targetSpeciesLookup[species] and not inventory.existingSpecies[species] then
                    print("Store useful bee: " .. species)
                    mutatron.pushItems(peripheral.getName(storage), slot)
                    mutatron.pushItems(peripheral.getName(storage), 1)
                    mutatron.pushItems(peripheral.getName(storage), 2)
                    foundOutput = true
                    break
                end
            end
        end
        if foundOutput then break end
    end
    return foundOutput
end

return finishQueen
