local getApiaries = require("lib.peripherals.apiary")
local ae2 = require("lib.utils.ae2")

local UPGRADE_TYPES = {
    LIFESPAN = 1,
    HUMIDIFIER = 4,
    DRYER = 5,
    HEATER = 6,
    COOLER = 7,
}
local function obtainUpgrades(upgradeType, count)
    local interface = peripheral.find("appliedenergistics2:interface")
    if not interface then
        print("No ME interface found")
        return nil
    end

    local upgradeItem = ae2.findOrCraftItem("gendustry:apiary.upgrade@" .. upgradeType, count)
    if not upgradeItem then
        print("Unable to get upgrades with metadata " .. upgradeType)
        return nil
    end

    local metadata = upgradeItem.getMetadata()
    return {
        interface = interface,
        count = metadata.count,
        type = upgradeType
    }
end

-- FIXME: Exporting items from AE2 isn't doing anything
local function distributeUpgrades(upgradeInfo)
    if not upgradeInfo or upgradeInfo.count == 0 then
        return
    end

    local neededUpgrades = 4
    local targetSlot = 3
    ae2.transferItemFromAE2("gendustry:apiary.upgrade@1", "gendustry:industrial_apiary", neededUpgrades,
        neededUpgrades, targetSlot)
end

local function addApiaryUpgrades()
    local apiaries = getApiaries()
    if #apiaries == 0 then
        return
    end

    local upgradeInfo = obtainUpgrades(UPGRADE_TYPES.LIFESPAN, 4)
    if upgradeInfo then
        distributeUpgrades(upgradeInfo)
    end
end

local function collectApiaryOutputs()
    local apiaries = getApiaries()
    if #apiaries == 0 then
        print("No apiary peripherals found")
        return false
    end

    local interface = peripheral.find("appliedenergistics2:interface")
    local crate = peripheral.find("actuallyadditions:giantchestlarge")

    if not interface then
        print("No ME interface found")
        return false
    end

    if not crate then
        print("No ActuallyAdditions crate found")
        return false
    end

    for _, apiary in ipairs(apiaries) do
        for slot = 7, 15 do -- Output Slots
            local item = apiary.getItemMeta(slot)
            if item then
                local targetPeripheral
                local targetName

                if item.name == "forestry:bee_princess_ge" or
                    item.name == "forestry:bee_drone_ge" then
                    targetPeripheral = crate
                    targetName = peripheral.getName(crate)
                else
                    targetPeripheral = interface
                    targetName = peripheral.getName(interface)
                end

                apiary.pushItems(targetName, slot)
            end
        end
    end
end

local function maintenance()
    collectApiaryOutputs()
    addApiaryUpgrades() -- FIXME: This is not working as intended
end

return maintenance
