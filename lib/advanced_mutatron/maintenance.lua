local ae2 = require("lib.utils.ae2")
local getMutatrons = require("lib.peripherals.mutatron")

local function transferLabware()
    return ae2.transferItemFromAE2("gendustry:labware", "gendustry:mutatron_advanced", 2, 2, 4)
end

local function emptyOutputSlot()
    local mutatrons = getMutatrons()

    if #mutatrons == 0 then
        print("No advanced mutatron found")
        return false
    end

    local storage = peripheral.find("actuallyadditions:giantchestlarge")
    if not storage then
        print("No ActuallyAdditions giant chest found!")
        return false
    end

    for _, mutatron in pairs(mutatrons) do
        local item = mutatron.getItemMeta(3)
        if item then
            -- print("Found item in slot 3: " .. textutils.serialize(item))
            mutatron.pushItems(peripheral.getName(storage), 3)
        end
    end
end


local function maintenance()
    transferLabware()
    emptyOutputSlot() -- Only used when finishQueen() is disabled
end

return maintenance
