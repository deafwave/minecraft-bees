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
const handleApiaryErrors = () => {
	const apiaries = peripheral.find<ApiaryPeripheral>(
		'gendustry:industrial_apiary',
	)
	for (const apiary of apiaries) {
		const error = apiary.getErrors()

		// for every error, print it
		error.forEach((err) => {
			err.forEach((errorType) => {
				switch (errorType) {
					case 'forestry:too_humid':
						// ignore
						break
					case 'forestry:too_cold':
						transferUpgradeToApiaryJuggle(
							apiary,
							UPGRADE_TYPES.HEATER,
						)
						break
					case 'forestry:not_gloomy':
						// ignore
						break
					case 'forestry:too_arid':
						// ignore
						break
					case 'forestry:not_lucid':
						// ignore
						break
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
				print('slot: ' + slot) // should be above or equal to 7
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
	emptyOutputSlots()
}
