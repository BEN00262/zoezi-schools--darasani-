// responsible for taking a file and a yup object and verifying the data then returning it

const excelToJson = require("convert-excel-to-json");

// should pass that as configuration
const convertToJson = async (fileBuffer, columnToKey, yupSchema) => {
    let fileData = excelToJson({
        source: fileBuffer,
        header: { rows: 1 }, // on the first row
        columnToKey
    })

    let availableTabs = Object.keys(fileData);

    if (availableTabs.length < 1) {
        throw new Error("Can't work with an empty excel file");
    }

    // get the first tab only
    let isValidData = await yupSchema.validate(
        fileData[availableTabs[0]]
    )

    return isValidData
}

module.exports = convertToJson