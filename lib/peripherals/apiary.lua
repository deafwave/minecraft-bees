-- Industrial Apiary Methods:
-- getQueen
-- getDrone
-- getErrors
-- getTemperature
-- getHumidity
-- getRFStored
-- getRFCapacity
-- getEnergyStored
-- getEnergyCapacity
-- getMetadata
-- getItemMeta
-- list
-- size
-- drop
-- suck
-- pullItems
-- getTransferLocations
-- getItem
-- pushItems
local function getApiaries()
    local apiaries = {}
    
    for _, name in pairs(peripheral.getNames()) do
        local peripheralType = peripheral.getType(name)
        if peripheralType == "gendustry:industrial_apiary" then
            table.insert(apiaries, peripheral.wrap(name))
        end
    end
    
    return apiaries
end

return getApiaries 