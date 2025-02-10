local getApiaries = require("lib.peripherals.apiary")
local beeUtils = require("lib.bees.bee_utils")
local protectedBees = require("lib._config.protected_bees")

-- Helper function to check if a value is in a list
local function isInList(list, value)
    for _, v in ipairs(list) do
        if v == value then
            return true
        end
    end
    return false
end

local function killPoorQualityQueen()
    local apiaries = getApiaries()

    if #apiaries == 0 then
        print("No apiary peripherals found")
        return false
    end

    -- Find empty apiaries first
    local emptyApiaries = {}
    for i, apiary in ipairs(apiaries) do
        local errors = apiary.getErrors()
        if #errors > 0 then
            for _, error in ipairs(errors) do
                if error == "forestry:no_queen" then
                    table.insert(emptyApiaries, { index = i, apiary = apiary })
                elseif error ~= "forestry:not_day" and
                    error ~= "forestry:not_lucid" then
                    print("Apiary " .. i .. ": " .. error)
                end
            end
        end
    end
    if #emptyApiaries == 0 then
        -- print("No empty apiaries found")
        return false
    end

    local inventory = beeUtils.buildBeeInventory(false, false)
    local currentApiaryIndex = 1
    -- Process queens from inventory
    for _, queenData in pairs(inventory.queens) do
        local itemMeta = queenData.storage.getItemMeta(queenData.slot)
        -- Skip protected bees
        if not (itemMeta and itemMeta.individual and isInList(protectedBees, itemMeta.individual.id)) then
            if currentApiaryIndex <= #emptyApiaries then
                local targetApiary = emptyApiaries[currentApiaryIndex].apiary
                local apiaryName = peripheral.getName(targetApiary)

                -- Move queen to apiary
                queenData.storage.pushItems(apiaryName, queenData.slot, 1)
                -- print("Moved queen from storage to apiary " .. emptyApiaries[currentApiaryIndex].index)
                if itemMeta and itemMeta.individual then
                    print("Killing queen " .. itemMeta.individual.id)
                end

                currentApiaryIndex = currentApiaryIndex + 1
            else
                break
            end
            if currentApiaryIndex > #emptyApiaries then
                break
            end
        end
    end
    return
end

return killPoorQualityQueen
