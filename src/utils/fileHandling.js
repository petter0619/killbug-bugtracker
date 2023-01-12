const fsPromises = require('fs/promises')

exports.fileExists = async (filePath) => !!(await fsPromises.stat(filePath).catch((e) => false))

exports.readJsonFile = async (filePath) => JSON.parse(await fsPromises.readFile(filePath, { encoding: 'utf-8' }))

exports.deleteFile = async (filePath) => await fsPromises.unlink(filePath)

exports.getDirectoryFileNames = async (directoryPath) => await fsPromises.readdir(directoryPath)
