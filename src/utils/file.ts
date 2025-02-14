// computecraft create writefile/readfile utils

export const writeToFile = (path: string, data: string) => {
	const file = fs.open(path, 'w')[0]
	file.write(data)
	file.close()
}
