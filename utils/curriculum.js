const curriculum = {
    "one": [
      "Mathematics Activities",
      "English Activities",
      "Kiswahili Activities",
      "Environmental Activities",
      "Hygiene and Nutrition Activities",
      "CRE Activities",
      "IRE Activities"
    ],

    "two": [
      "Mathematics Activities",
      "English Activities",
      "Kiswahili Activities",
      "Environmental Activities",
      "Hygiene and Nutrition Activities",
      "CRE Activities",
      "IRE Activities"
    ],
    
    "three": [
      "Mathematics Activities",
      "English Activities",
      "Kiswahili Activities",
      "Environmental Activities",
      "Hygiene and Nutrition Activities",
      "CRE Activities",
      "IRE Activities"
    ],

    "four": [
      "Mathematics",
      "English",
      "Kiswahili",
      "Science and Technology",
      "Social Studies",
      "CRE",
      "IRE"
    ],

    "five": [
      "Mathematics",
      "English",
      "Kiswahili",
      "Science and Technology",
      "Social Studies",
      "CRE",
      "IRE"
    ],

    "six": [
      "Mathematics",
      "English",
      "Kiswahili",
      "Science and Technology",
      "Social Studies",
      "CRE",
      "IRE"
    ],

    "seven": [
      "Mathematics",
      "English",
      "Kiswahili",
      "Science",
      "Social Studies",
      "CRE",
      "IRE"
    ],

    "eight": [
      "Mathematics",
      "English",
      "Kiswahili",
      "Science",
      "SST&CRE"
    ]
}

const gradesFind = () => {
    return Object.keys(curriculum);
}

const subjectFind = (grade) => {
    return curriculum[grade.toLowerCase()] || []
}

module.exports = {
    gradesFind, subjectFind
}