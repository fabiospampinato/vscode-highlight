'use strict';

// Test flag, setting to false writed to another file in same dir for comparison
const doUpdateOriginalPackage = true;

const fs = require('fs');

const basePath = __dirname + '/../',
      packagePath = basePath + 'package.json',
      testPackagePath = 'package.updated.json',
      configurationPath = __dirname + '/configuration.js';

// Load new schema
const configuration = require(configurationPath).default
if(!configuration)
  throw new Error("Failed to load configuration script");

// Load package json data
const packageData = require(packagePath);
if(!packageData.contributes.configuration)
  throw new Error("Failed to load package.json");

// Update imported package object
packageData.contributes.configuration = configuration.toJSON();

// Update to package.json or write to test file
const writePath = doUpdateOriginalPackage ? packagePath : testPackagePath;
console.log(`Writing to path '${writePath}'`)
fs.writeFile(
  writePath,
  JSON.stringify(packageData, null, 2),
  (err) => {
    if (err)
      throw err;
    else
      console.log(`Wrote to path '${writePath}' successfully.`);
  },
)
