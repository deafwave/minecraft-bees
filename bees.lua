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

while true do
    maintainMutatron()
    maintainMutagen()
    maintainApiary()

    -- TODO: Disable finishQueen() for players who don't want to duplicate bees
    -- Or can add a trashcan system
    createPoorQualityQueen()
    finishQueen()
    killQueen()

    sleep(1)
end

-- Known Bugs
-- finishQueen() is duping out of the mutatron
