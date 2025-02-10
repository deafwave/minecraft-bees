local createPoorQualityQueen = require("lib.advanced_mutatron.createQueen")
local finishQueen = require("lib.advanced_mutatron.finishQueen")
local killQueen = require("lib.industrial_apiary.killQueen")
local maintainMutatron = require("lib.advanced_mutatron.maintenance")
local maintainMutagen = require("lib.mutagen_producer.maintenance")
local maintainApiary = require("lib.industrial_apiary.maintenance")
local breeding = require("lib.utils.breeding")

local unknownBees = breeding.findUnknownBees()
if #unknownBees > 0 then
    print("Unknown bees:")
    for _, bee in ipairs(unknownBees) do
        print(bee)
    end
end


-- DEBUGGING
-- local allBees = beeUtils.buildBeeInventory()
-- print("Current species in all storage:")
-- for species, _ in pairs(allBees.existingSpecies) do
--     print("  " .. species)
-- end

-- DEBUGGING
-- local permBees = beeUtils.buildBeeInventory(false)
-- print("Current species in permanent storage:")
-- for species, _ in pairs(permBees.existingSpecies) do
--     print("  " .. species)
-- end

while true do
    maintainMutatron()
    maintainMutagen()
    maintainApiary()

    createPoorQualityQueen()
    finishQueen() -- TODO: Add a config setting to turn this off for players who don't want to dupe bees
    killQueen()

    sleep(1)
end
