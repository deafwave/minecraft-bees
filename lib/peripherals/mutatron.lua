local function getMutatrons()
    local mutatrons = {}

    for _, name in pairs(peripheral.getNames()) do
        local peripheralType = peripheral.getType(name)
        if peripheralType == "gendustry:mutatron_advanced" then
            table.insert(mutatrons, peripheral.wrap(name))
        end
    end

    return mutatrons
end

return getMutatrons