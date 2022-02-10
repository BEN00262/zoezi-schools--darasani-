const africastalking = require('africastalking')({
    apiKey: process.env.AT_APIKEY,
    username: process.env.AT_USERNAME
})

const _PHONE_NUMBER_REGEX = /^(\+254)[17]\d{8}$/

const formatPhoneNumber = phoneNumber => _PHONE_NUMBER_REGEX.test(phoneNumber)
		? phoneNumber
		: `+254${phoneNumber.substring(1, phoneNumber.length)}`;

const payments = africastalking.PAYMENTS;

// by default this should be a school solution :)
module.exports = (schoolID, schoolPhoneNumber, price, days, gradeID, gradeName, is_special, sub_account_ids) => {
    const options = {
        productName: process.env.AT_PRODUCTNAME,
        phoneNumber: formatPhoneNumber(schoolPhoneNumber),
        currencyCode: 'KES',
        amount: price,

        metadata: {
            foo: schoolID,
            bar: gradeID,
            zoo: `${days}`,
            azuma: gradeName,
            tee: is_special ? "special" : "not_special",
            akacha: (sub_account_ids || []).join(","), // this will be an array of those stuffs :)
            zebra: 'school'
        }
    }

    return payments.mobileCheckout(options)
}