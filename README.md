# minecraft-lua

Enables learning Lua via the ComputerCraft or OpenComputers Minecraft mods.

## bees (MeatballCraft)

Automates bee breeding using the ComputerCraft mod. It integrates with multiple peripherals and systems to handle bee breeding, maintenance, and management. The script performs the following tasks:

- Maintains the advanced mutatron, mutagen producer, and industrial apiary.
- Finds unknown bees using the breeding chart and base bees configuration.
- Creates queens and finishes queens using the advanced mutatron.
- Processes queens in the industrial apiary.

The script runs in a continuous loop, ensuring that all tasks are performed regularly to keep the bee management system running smoothly.

### Known Bugs
`finishQueen()` duplicates bees due to gendustry not being in Plethora

### TODO
- Finish list of bees from callstones & other sources (if anyone has a list, I'd appreciate it)
- Add trashing to FinishQueen so this it doesn't dupe the princess/drone
- Bugfix maintain apiary to properly handle heater/dryer/humidifier/cooler as needed
- Compile the code in a way that can be paste-bin'd
- Add using assassin queen (decent bit of work, not much gain - mech user + CC Redstone + transposer + bee-bee gun?)
- Write a drone imprinter -> breeder -> sampler script
  - Princess+Drone -> proper Genetic Imprinter (Effect/No-Effect where applicable)
  - Send to Industrial Apiary
  - Export excess drones into a genetic sampler until we get species & effect (where applicable) samples
- Change function names from e.g. kill->process, etc. to be more socially acceptable

## Notes
- Nameless & Abandoned & Spectral & Phantasmal requires Dragon Egg flower; instead of getting the Dragon Egg, use the assassin bee to terminate the first one
- mad scientist is manual
  - Apiary -> engineer + science -> TNT & Lever -> Bee-Bee Gun & Assassin