import { getBreedingPaths } from "../src/utils/breeding";
import { writeFileSync } from "node:fs";

const xxx = getBreedingPaths()

console.log(xxx);
// write xxx to file
// writeFileSync("breedingPaths.json", JSON.stringify(xxx, null, 2))