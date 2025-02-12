import { baseBees, breedingChart, wantedBees } from "../config/meatballcraft";
import { yieldSmart } from "./yield";

interface Inventory {
    princesses: Record<string, BeeInfo>;
    drones: Record<string, BeeInfo>;
}
interface BeeInfo {
    // Add relevant bee information properties here
    species: string;
    // Add other properties as needed
}

interface BreedingStep {
    target: string;
    parents: [string, string];
}

interface BreedingAssignment {
    target: string;
    princess: string;
    drone: string;
}

interface BreedingPair {
    princess: BeeInfo;
    drone: BeeInfo;
}

// Find all species required to breed a target species
function findRequiredSpecies(targetSpecies: string, visited: Record<string, boolean> = {}): Record<string, boolean> {
    if (visited[targetSpecies]) {
        return {};
    }
    visited[targetSpecies] = true;

    const required: Record<string, boolean> = { [targetSpecies]: true };

    if (baseBees[targetSpecies]) {
        return required;
    }

    if (!breedingChart[targetSpecies]) {
        return required;
    }

    for (const parents of breedingChart[targetSpecies]) {
        // Recursively find required species for each parent
        for (const parent of parents) {
            const parentRequired = findRequiredSpecies(parent, visited);
            for (const species in parentRequired) {
                required[species] = true;
            }
        }
    }

    return required;
}

function findBreedingPaths(
    targetSpecies: string,
    currentPath: BreedingStep[] = [],
    allPaths: BreedingStep[][] = [],
    visited: Record<string, boolean> = {}
): BreedingStep[][] {
    // Prevent infinite recursion
    if (visited[targetSpecies]) {
        return allPaths;
    }
    visited[targetSpecies] = true;

    if (baseBees[targetSpecies]) {
        return allPaths;
    }

    if (!breedingChart[targetSpecies]) {
        return allPaths;
    }

    for (const parents of breedingChart[targetSpecies]) {
        const newPath: BreedingStep = {
            target: targetSpecies,
            parents: [parents[0], parents[1]]
        };

        currentPath.push(newPath);

        // Recursively find paths for parents if they're not base bees
        if (!baseBees[parents[0]]) {
            findBreedingPaths(parents[0], currentPath, allPaths, visited);
        }
        if (!baseBees[parents[1]]) {
            findBreedingPaths(parents[1], currentPath, allPaths, visited);
        }

        const pathCopy = [...currentPath];
        allPaths.push(pathCopy);

        currentPath.pop();
    }

    visited[targetSpecies] = false;
    return allPaths;
}

function assignBreedingRoles(path: BreedingStep[], inventory: Inventory): BreedingAssignment[] | null {
    const result: BreedingAssignment[] = [];
    
    for (const step of path) {
        const parent1 = step.parents[0];
        const parent2 = step.parents[1];

        if (inventory.princesses[parent1] && inventory.drones[parent2]) {
            result.push({
                target: step.target,
                princess: parent1,
                drone: parent2
            });
        } else if (inventory.princesses[parent2] && inventory.drones[parent1]) {
            result.push({
                target: step.target,
                princess: parent2,
                drone: parent1
            });
        } else {
            return null;
        }
    }
    return result;
}

function findBestBreedingPair(
    inventory: Inventory,
    princessSpecies: string,
    droneSpecies: string
): BreedingPair | null {
    const princessInfo = inventory.princesses[princessSpecies];
    const droneInfo = inventory.drones[droneSpecies];

    if (princessInfo && droneInfo) {
        return {
            princess: princessInfo,
            drone: droneInfo
        };
    }

    return null;
}

function findUnknownBees(): string[] {
    const allMentionedBees: Record<string, boolean> = {};

    for (const result in breedingChart) {
        allMentionedBees[result] = true;
        for (const parents of breedingChart[result]) {
            allMentionedBees[parents[0]] = true;
            allMentionedBees[parents[1]] = true;
        }
    }

    for (const bee in baseBees) {
        allMentionedBees[bee] = true;
    }

    const unknownBees: string[] = [];
    for (const bee in allMentionedBees) {
        if (!baseBees[bee] && !breedingChart[bee]) {
            unknownBees.push(bee);
        }
    }

    return unknownBees.sort();
}

interface BreedingPaths {
    [species: string]: [string, string][];
}
let cachedBreedingPaths: BreedingPaths;
export function getBreedingPaths(): BreedingPaths {
    if (cachedBreedingPaths) {
        return cachedBreedingPaths;
    }

    console.log("Calculating all breeding paths...");
    const allPaths: { [species: string]: Set<string> } = {};

    for (const targetSpecies of wantedBees) {
        yieldSmart();
        const requiredSpecies = findRequiredSpecies(targetSpecies);

        for (const species in requiredSpecies) {
            yieldSmart();
            if (!baseBees[species]) {
                const paths = findBreedingPaths(species);
                for (const path of paths) {
                    yieldSmart();
                    for (const step of path) {
                        if (!allPaths[step.target]) {
                            allPaths[step.target] = new Set();
                        }
                        allPaths[step.target].add(JSON.stringify(step.parents.sort()));
                    }
                }
            }
        }
    }

    const result: BreedingPaths = {};
    for (const [species, speciesSet] of Object.entries(allPaths)) {
        result[species] = Array.from(speciesSet).map(item => JSON.parse(item))
    }

    cachedBreedingPaths = result;
    console.log("Cached breeding paths!");
    return result;
}