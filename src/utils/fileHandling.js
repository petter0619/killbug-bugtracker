const fsPromises = require('fs/promises')

exports.fileExists = async (filePath) => !!(await fsPromises.stat(filePath).catch((e) => false))
