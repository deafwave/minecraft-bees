import { transferItemFromAE2 } from '../utils/ae2'

const emptyOutputSlots = () => {
	const beeCrate = peripheral.find<InventoryPeripheral>(
		'actuallyadditions:giantchestlarge',
	)[0]
	const ae2Interface = peripheral.find<InventoryPeripheral>(
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
	emptyOutputSlots()
}
