local function getBeeStorages(includeMutatrons, includeApiaries)
    if includeMutatrons == nil then
        includeMutatrons = true
    end
    if includeApiaries == nil then
        includeApiaries = true
    end

    local beeStorages = {}
    
    for _, name in pairs(peripheral.getNames()) do
        local peripheralType = peripheral.getType(name)
        local isApiary = includeApiaries and peripheralType == "gendustry:industrial_apiary"
        local isStorage = peripheralType == "actuallyadditions:giantchestlarge"
        local isMutatron = includeMutatrons and peripheralType == "gendustry:mutatron_advanced"
        
        if isApiary or isStorage or isMutatron then
            table.insert(beeStorages, peripheral.wrap(name))
        end
    end
    
    return beeStorages
end

return getBeeStorages