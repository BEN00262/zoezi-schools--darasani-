const { Mpesa } = require("mpesa-api");
const PendingPaymentsModel = require('../models/pending_payment');

const _PHONE_NUMBER_REGEX = /^(\+254)[17]\d{8}$/

const formatPhoneNumber = phoneNumber => _PHONE_NUMBER_REGEX.test(phoneNumber)
		? phoneNumber
		: `+254${phoneNumber.substring(1, phoneNumber.length)}`;


const credentials = {
    clientKey: process.env.CONSUMER_KEY,
    clientSecret: process.env.CONSUMER_SECRET,
    initiatorPassword: process.env.INITIATOR_PASSWD,
    securityCredential: process.env.SECURITY_CRED
};

const mpesa = new Mpesa(credentials, process.env.MPESA_ENVIRONMENT);

// by default this should be a school solution :)
module.exports = async (schoolID, schoolPhoneNumber, price, days, gradeID, gradeName, is_special, sub_account_ids) => {
    schoolPhoneNumber = formatPhoneNumber(schoolPhoneNumber).slice(1);

    const result = await mpesa.lipaNaMpesaOnline({
        BusinessShortCode: +process.env.ZOEZI_MPESA_SHORTCODE,
        Amount: price,
        PartyA: schoolPhoneNumber,
        PartyB: process.env.ZOEZI_MPESA_SHORTCODE,
        PhoneNumber: schoolPhoneNumber,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: "Zoezi Education",
        passKey: process.env.PASS_KEY,
        TransactionType: "CustomerPayBillOnline" /* OPTIONAL */,
    });

    if (!result || result.ResponseCode !== "0") {
        throw new Error(`Payment Failed. ${result.ResultDesc}`);
    }

    await PendingPaymentsModel.create({
        transactionId: result.CheckoutRequestID,
        metadata: {
            foo: schoolID,
            bar: gradeID,
            zoo: `${days}`,
            azuma: gradeName,
            tee: is_special ? "special" : "not_special",
            akacha: (sub_account_ids || []).join(","), // this will be an array of those stuffs :)
            zebra: 'school'
        }
    })

    return result.CheckoutRequestID
}