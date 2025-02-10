local function transferItemFromAE2(itemId, targetPeripheralType, minCount, maxCount, targetSlot)
    local interface = peripheral.find("appliedenergistics2:interface")

    if not interface then
        print("Could not find AE2 interface")
        return false
    end

    -- Find available item
    local item = interface.findItem(itemId)
    if not item then
        print("No " .. itemId .. " in AE2 system")
        return false
    end

    -- Get all peripherals
    local names = peripheral.getNames()

    -- Find all matching peripherals
    for _, destination in ipairs(names) do
        local pType = peripheral.getType(destination)
        if pType == targetPeripheralType then
            local device = peripheral.wrap(destination)

            local slot = device.getItemMeta(targetSlot)
            local currentCount = slot and slot.count or 0

            if currentCount < minCount then
                local count = maxCount - currentCount
                local metadata = item.getMetadata()
                local itemCount = metadata.count

                if itemCount >= count then
                    item.export(destination, count)
                else
                    return false
                end
            end
        end
    end
end

local function findOrCraftItem(itemId, count)
    local interface = peripheral.find("appliedenergistics2:interface")

    if not interface then
        print("Could not find AE2 interface")
        return false
    end

    -- First try to find the item
    local item = interface.findItem(itemId)
    if item then
        local metadata = item.getMetadata()
        if metadata.count >= count then
            return item
        end
    end

    -- If item not found or not enough, try to craft it
    print("Attempting to craft " .. itemId)
    item.craft(count)

    return false
end

return {
    transferItemFromAE2 = transferItemFromAE2,
    findOrCraftItem = findOrCraftItem
}
