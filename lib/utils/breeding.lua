local wanted_bees = require("lib._config.wanted_bees")
local breeding_chart = require("lib._config.breeding_chart")
local base_bees = require("lib._config.base_bees")

-- Helper function to find all species required to breed a target species
local function findRequiredSpecies(targetSpecies, visited)
    visited = visited or {}
    if visited[targetSpecies] then
        return {}
    end
    visited[targetSpecies] = true

    local required = { [targetSpecies] = true }

    -- If it's a base bee, we don't need to look further
    if base_bees[targetSpecies] then
        return required
    end

    -- If there's no breeding recipe, we can't breed it
    if not breeding_chart[targetSpecies] then
        return required
    end

    -- For each possible breeding combination
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

    -- If it's a base bee, we don't need to look further
    if base_bees[targetSpecies] then
        return allPaths
    end

    -- If there's no breeding recipe, we can't breed it
    if not breeding_chart[targetSpecies] then
        return allPaths
    end

    for _, parents in ipairs(breeding_chart[targetSpecies]) do
        -- Create a path object for this breeding step
        local newPath = {
            target = targetSpecies,
            parents = { parents[1], parents[2] }
        }

        -- Process this breeding step
        table.insert(currentPath, newPath)

        -- Recursively find paths for parents if they're not base bees
        if not base_bees[parents[1]] then
            findBreedingPaths(parents[1], currentPath, allPaths, visited)
        end
        if not base_bees[parents[2]] then
            findBreedingPaths(parents[2], currentPath, allPaths, visited)
        end

        -- Add this path to all paths
        local pathCopy = {}
        for _, step in ipairs(currentPath) do
            table.insert(pathCopy, step)
        end
        table.insert(allPaths, pathCopy)

        table.remove(currentPath)
    end

    visited[targetSpecies] = false -- Allow revisiting in other paths
    return allPaths
end

-- Helper function to convert parent pairs into specific princess/drone assignments
local function assignBreedingRoles(path, inventory)
    local result = {}
    for _, step in ipairs(path) do
        -- For each step, try both possible princess/drone assignments
        -- and pick the one that's available in inventory
        local parent1, parent2 = step.parents[1], step.parents[2]

        -- Try first combination
        if inventory.princesses[parent1] and inventory.drones[parent2] then
            table.insert(result, {
                target = step.target,
                princess = parent1,
                drone = parent2
            })
            -- Try second combination
        elseif inventory.princesses[parent2] and inventory.drones[parent1] then
            table.insert(result, {
                target = step.target,
                princess = parent2,
                drone = parent1
            })
        else
            -- Neither combination is possible with current inventory
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

local function findUnknownBees()
    -- Create a set of all bees that are mentioned anywhere
    local allMentionedBees = {}

    -- Add bees from breeding chart (both results and parents)
    for result, parentsList in pairs(breeding_chart) do
        allMentionedBees[result] = true
        for _, parents in ipairs(parentsList) do
            allMentionedBees[parents[1]] = true
            allMentionedBees[parents[2]] = true
        end
    end

    -- Add base bees
    for bee, _ in pairs(base_bees) do
        allMentionedBees[bee] = true
    end

    -- Find bees that have no source (not in base_bees and not a result in breeding_chart)
    local unknownBees = {}
    for bee, _ in pairs(allMentionedBees) do
        if not base_bees[bee] and not breeding_chart[bee] then
            table.insert(unknownBees, bee)
        end
    end

    -- Sort for consistent output
    table.sort(unknownBees)
    return unknownBees
end

return {
    findBreedingPaths = findBreedingPaths,
    findBestBreedingPair = findBestBreedingPair,
    assignBreedingRoles = assignBreedingRoles,
    findUnknownBees = findUnknownBees,
    findRequiredSpecies = findRequiredSpecies
}
