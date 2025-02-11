local wanted_bees = require("lib._config.wanted_bees")
local breeding_chart = require("lib._config.breeding_chart")
local base_bees = require("lib._config.base_bees")
local yield = require("lib.utils.yield")

-- Find all species required to breed a target species
local function findRequiredSpecies(targetSpecies, visited)
    visited = visited or {}
    if visited[targetSpecies] then
        return {}
    end
    visited[targetSpecies] = true

    local required = { [targetSpecies] = true }

    if base_bees[targetSpecies] then
        return required
    end

    if not breeding_chart[targetSpecies] then
        return required
    end

    for _, parents in ipairs(breeding_chart[targetSpecies]) do
        -- Recursively find required species for each parent
        for _, parent in ipairs(parents) do
            local parentRequired = findRequiredSpecies(parent, visited)
            for species in pairs(parentRequired) do
                required[species] = true
            end
        end
    end

    return required
end

local function findBreedingPaths(targetSpecies, currentPath, allPaths, visited)
    currentPath = currentPath or {}
    allPaths = allPaths or {}
    visited = visited or {}

    -- Prevent infinite recursion
    if visited[targetSpecies] then
        return allPaths
    end
    visited[targetSpecies] = true

    if base_bees[targetSpecies] then
        return allPaths
    end

    if not breeding_chart[targetSpecies] then
        return allPaths
    end

    for _, parents in ipairs(breeding_chart[targetSpecies]) do
        local newPath = {
            target = targetSpecies,
            parents = { parents[1], parents[2] }
        }

        table.insert(currentPath, newPath)

        -- Recursively find paths for parents if they're not base bees
        if not base_bees[parents[1]] then
            findBreedingPaths(parents[1], currentPath, allPaths, visited)
        end
        if not base_bees[parents[2]] then
            findBreedingPaths(parents[2], currentPath, allPaths, visited)
        end

        local pathCopy = {}
        for _, step in ipairs(currentPath) do
            table.insert(pathCopy, step)
        end
        table.insert(allPaths, pathCopy)

        table.remove(currentPath)
    end

    visited[targetSpecies] = false
    return allPaths
end

-- Convert parent pairs into specific princess/drone assignments
-- try both possible princess/drone assignments
-- and pick the one that's available in inventory
local function assignBreedingRoles(path, inventory)
    local result = {}
    for _, step in ipairs(path) do
        local parent1, parent2 = step.parents[1], step.parents[2]

        if inventory.princesses[parent1] and inventory.drones[parent2] then
            table.insert(result, {
                target = step.target,
                princess = parent1,
                drone = parent2
            })
        elseif inventory.princesses[parent2] and inventory.drones[parent1] then
            table.insert(result, {
                target = step.target,
                princess = parent2,
                drone = parent1
            })
        else
            return nil
        end
    end
    return result
end

local function findBestBreedingPair(inventory, princessSpecies, droneSpecies)
    local princessInfo = inventory.princesses[princessSpecies]
    local droneInfo = inventory.drones[droneSpecies]

    if princessInfo and droneInfo then
        return {
            princess = princessInfo,
            drone = droneInfo
        }
    end

    return nil
end

-- Find bees that have no source (not in base_bees and not a result in breeding_chart)
local function findUnknownBees()
    local allMentionedBees = {}

    for result, parentsList in pairs(breeding_chart) do
        allMentionedBees[result] = true
        for _, parents in ipairs(parentsList) do
            allMentionedBees[parents[1]] = true
            allMentionedBees[parents[2]] = true
        end
    end

    for bee, _ in pairs(base_bees) do
        allMentionedBees[bee] = true
    end

    local unknownBees = {}
    for bee, _ in pairs(allMentionedBees) do
        if not base_bees[bee] and not breeding_chart[bee] then
            table.insert(unknownBees, bee)
        end
    end

    table.sort(unknownBees)
    return unknownBees
end

local cachedBreedingPaths = nil
local cachedTargetSpeciesLookup = nil
local function getBreedingPaths()
    if cachedBreedingPaths then
        return cachedBreedingPaths
    end

    print("Calculating all breeding paths...")
    local allPaths = {}
    local targetSpeciesLookup = {} -- Create lookup table while processing paths

    for _, targetSpecies in ipairs(wanted_bees) do
        yield()
        local requiredSpecies = findRequiredSpecies(targetSpecies)

        for species in pairs(requiredSpecies) do
            yield()
            if not base_bees[species] then
                local paths = findBreedingPaths(species)
                for _, path in ipairs(paths) do
                    yield()
                    table.insert(allPaths, path)
                    -- Add each breeding step's target to the lookup
                    for _, step in ipairs(path) do
                        targetSpeciesLookup[step.target] = true
                    end
                end
            end
        end
    end

    -- Sort paths by dependency
    table.sort(allPaths, function(a, b)
        local aTarget = a[#a].target
        for _, step in ipairs(b) do
            yield()
            if step.parents[1] == aTarget or step.parents[2] == aTarget then
                return true
            end
        end
        return false
    end)

    cachedBreedingPaths = allPaths
    cachedTargetSpeciesLookup = targetSpeciesLookup
    print("Cached breeding paths!")
    return allPaths
end

local function getTargetSpeciesLookup()
    if cachedTargetSpeciesLookup then
        return cachedTargetSpeciesLookup
    end
    -- Force calculation of both caches if they don't exist
    getBreedingPaths()
    return cachedTargetSpeciesLookup
end

return {
    findBreedingPaths = findBreedingPaths,
    findBestBreedingPair = findBestBreedingPair,
    assignBreedingRoles = assignBreedingRoles,
    findUnknownBees = findUnknownBees,
    findRequiredSpecies = findRequiredSpecies,
    getBreedingPaths = getBreedingPaths,
    getTargetSpeciesLookup = getTargetSpeciesLookup
}
