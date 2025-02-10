local function getTankInfo(peripheral)
    local tanks = peripheral.getTanks()
    if not tanks or #tanks == 0 then
        return nil
    end
    return tanks[1]
end

local function canAcceptFluid(tank, amount, maxCapacity)
    maxCapacity = maxCapacity or 8000 -- Default max capacity
    if not tank or not tank.amount then
        return true
    end
    return tank.amount < maxCapacity
end

local function hasEnoughFluid(tank, requiredAmount)
    return tank and tank.amount and tank.amount >= requiredAmount
end

local function findPeripheralsByType(targetType)
    local result = {}
    local names = peripheral.getNames()
    
    for _, name in ipairs(names) do
        if peripheral.getType(name) == targetType then
            table.insert(result, peripheral.wrap(name))
        end
    end
    
    return result
end

local function transferFluid(source, destination, amount, fluidType)
    if not source or not destination then
        return false
    end
    
    local sourceTank = getTankInfo(source)
    local destTank = getTankInfo(destination)
    
    if not hasEnoughFluid(sourceTank, amount) then
        return false
    end
    
    if not canAcceptFluid(destTank, amount) then
        return false
    end
    
    source.pushFluid(peripheral.getName(destination), amount, fluidType)
    return true
end

return {
    getTankInfo = getTankInfo,
    canAcceptFluid = canAcceptFluid,
    hasEnoughFluid = hasEnoughFluid,
    findPeripheralsByType = findPeripheralsByType,
    transferFluid = transferFluid
} 