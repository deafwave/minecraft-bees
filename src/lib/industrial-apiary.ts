enum UPGRADE_TYPES {
	LIFESPAN = 1,
	HUMIDIFIER = 4,
	DRYER = 5,
	HEATER = 6,
	COOLER = 7,
}
/** Workaround to enable pushing upgrades into apiary */
const transferUpgradeToApiaryJuggle = (
	apiary: ApiaryPeripheral,
	upgradeType: UPGRADE_TYPES,
) => {
	const ae2Interface = peripheral.find<AE2GridPeripheral>(
		'appliedenergistics2:interface',
	)[0]
	const crate = peripheral.find<InventoryPeripheral>(
		'actuallyadditions:giantchestlarge',
	)[0]
	const upgrade = ae2Interface.findItem(
		'gendustry:apiary.upgrade@' + upgradeType,
	)
	if (upgrade && upgrade.getMetadata().count > 0) {
		/** BUG: Can't export upgrades directly to apiary, so we export to temp storage */
		upgrade.export(peripheral.getName(crate), 1)
		sleep(1) // lame way to do this, but it should work

		const itemList = crate.list()
		Object.keys(itemList).forEach((key) => {
			const itemData = itemList[key]
			if (
				itemData.name === 'gendustry:apiary.upgrade' &&
				itemData.damage === upgradeType
			) {
				const slot = key as unknown as number
				// BUG: Can't push upgrades into apiary, so we pull them
				apiary.pullItems(peripheral.getName(crate), slot, 1)
			}
		})
	}
}

const removeUpgradesFromApiary = (
	apiary: ApiaryPeripheral,
	upgradeType: UPGRADE_TYPES,
) => {
	const ae2Interface = peripheral.find<AE2GridPeripheral>(
		'appliedenergistics2:interface',
	)[0]
	const upgrade = apiary.list()
	Object.keys(upgrade).forEach((key) => {
		const slot = key as unknown as number
		const upgradeItem = upgrade[slot]
		if (
			upgradeItem.name === 'gendustry:apiary.upgrade' &&
			upgradeItem.damage === upgradeType
		) {
			apiary.pushItems(
				peripheral.getName(ae2Interface),
				slot,
				upgradeItem.count,
			)
		}
	})
}

const handleApiaryErrors = () => {
	const apiaries = peripheral.find<ApiaryPeripheral>(
		'gendustry:industrial_apiary',
	)
	for (const apiary of apiaries) {
		const error = apiary.getErrors()

		error.forEach((err) => {
			err.forEach((errorType) => {
				switch (errorType) {
					case 'forestry:too_humid':
						removeUpgradesFromApiary(
							apiary,
							UPGRADE_TYPES.HUMIDIFIER,
						)
						transferUpgradeToApiaryJuggle(
							apiary,
							UPGRADE_TYPES.DRYER,
						)
						break
					case 'forestry:too_arid':
						removeUpgradesFromApiary(apiary, UPGRADE_TYPES.DRYER)
						transferUpgradeToApiaryJuggle(
							apiary,
							UPGRADE_TYPES.HUMIDIFIER,
						)
						break

					case 'forestry:too_hot':
						removeUpgradesFromApiary(apiary, UPGRADE_TYPES.HEATER)
						transferUpgradeToApiaryJuggle(
							apiary,
							UPGRADE_TYPES.COOLER,
						)
						break
					case 'forestry:too_cold':
						removeUpgradesFromApiary(apiary, UPGRADE_TYPES.COOLER)
						transferUpgradeToApiaryJuggle(
							apiary,
							UPGRADE_TYPES.HEATER,
						)
						break

					case 'forestry:no_flower':
						print(
							'Potentially no flower -- could be a false positive',
						)
						break
					case 'forestry:no_queen':
					case 'forestry:not_lucid': // Sleeping?
					case 'forestry:not_gloomy': // Not dark enough?
					case 'forestry:not_night':
					case 'forestry:not_day':
						// ignore
						break
					default:
						// print error
						print(errorType)
						break
				}
			})
		})
	}
}

/** If below 4 lifespan upgrades, add them */
const addLifespanUpgrades = () => {
	const apiaries = peripheral.find<ApiaryPeripheral>(
		'gendustry:industrial_apiary',
	)
	for (const apiary of apiaries) {
		const upgrades = apiary.list()
		let lifespanCount = 0
		Object.keys(upgrades).forEach((key) => {
			const upgrade = upgrades[key]
			if (
				upgrade.name === 'gendustry:apiary.upgrade' &&
				upgrade.damage === UPGRADE_TYPES.LIFESPAN
			) {
				lifespanCount += upgrade.count
			}
		})
		if (lifespanCount < 4) {
			transferUpgradeToApiaryJuggle(apiary, UPGRADE_TYPES.LIFESPAN) // This is kinda inefficient, does 1 at a time
		}
	}
}

const emptyOutputSlots = () => {
	const beeCrate = peripheral.find<InventoryPeripheral>(
		'actuallyadditions:giantchestlarge',
	)[0]
	const ae2Interface = peripheral.find<AE2GridPeripheral>(
		'appliedenergistics2:interface',
	)[0]
	const apiaries = peripheral.find<ApiaryPeripheral>(
		'gendustry:industrial_apiary',
	)

	for (const apiary of apiaries) {
		const itemList = apiary.list()
		Object.keys(itemList).forEach((key) => {
			const slot = key as unknown as number
			if (slot - 6 > 0) {
				const itemMeta = apiary.getItemMeta(slot)
				if (!itemMeta) return
				if (
					[
						'forestry:bee_princess_ge',
						'forestry:bee_drone_ge',
					].includes(itemMeta.name)
				) {
					// push to crate
					apiary.pushItems(peripheral.getName(beeCrate), slot)
				} else {
					apiary.pushItems(peripheral.getName(ae2Interface), slot)
				}
				return
			}
		})
	}
}

export const maintainApiary = () => {
	handleApiaryErrors()
	addLifespanUpgrades()
	emptyOutputSlots()
}
