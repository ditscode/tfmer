const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
const delay = require('delay');
const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('async-file');
const uuidv4 = require('uuid/v4');
var uuid = uuidv4();


// const phoneNumber = readlineSync.question('Masukan No Hp: ');

const genUniqueId = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible =
            "abcdefghijklmnopqrstuvwxyz1234567890";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });

const functionGenName = () => new Promise((resolve, reject) => {
	fetch('https://fakenametool.net/random-name-generator/random/id_ID/indonesia/1', {
		method: 'GET'
	})
	.then(res => res.text())
	.then(result => {
		const $ = cheerio.load(result);
		const resText = $('div[class=col-lg-10] span').text();
		resolve(resText);
	})
	.catch(err => {
		reject(err)
	})
});



const functionGojekSendOtp = (uuid, uniqid) => new Promise((resolve, reject) => {
    const url = 'https://api.gojekapi.com/v4/customers/login_with_phone'

    boday = {"phone":`+${phoneNumber}`}

    fetch(url, {
        method: 'POST',
        headers: {
            'X-Session-ID': uuid,
            'X-UniqueId': uniqid,
            'X-AppVersion': '3.34.1',
            Authorization: 'Bearer',
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(boday)
    })
    .then(res => res.json())
    .then(result => {
        resolve(result)
    })
    .catch(err => {
        resolve(err)
    })
});



const functionGojekVerify = (otpToken, otpLogin, uuid, uniqid) => new Promise((resolve, reject) => {
    const url = 'https://api.gojekapi.com/v4/customers/login/verify'

    boday = {
        "client_name":"gojek:cons:android",
        "client_secret":"83415d06-ec4e-11e6-a41b-6c40088ab51e",
        "data": {
            "otp": otpLogin,
            "otp_token": otpToken
        },
        "grant_type":"otp",
        "scopes":"gojek:customer:transaction gojek:customer:readonly"
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'X-Session-ID': uuid,
            'X-UniqueId': uniqid,
            'X-AppVersion': '3.34.1',
            Authorization: 'Bearer',
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(boday)
    })
    .then(res => res.json())
    .then(result => {
        resolve(result)
    })
    .catch(err => {
        reject(err)
    })
});

const functionSaldoAkun = (accessToken, uuid, uniqid) => new Promise((resolve, reject) => {
    fetch(`https://api.gojekapi.com/wallet/profile/detailed`, {
        method: 'GET',
        headers: {
            'X-AppVersion': '3.30.2',
            'X-UniqueId': uniqid,
            'X-Session-ID': uuid,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8'
        },
    })
        .then(res => res.json())
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            resolve(err)
        })

});

const functionQr = (accessToken, uuid, uniqid) => new Promise((resolve, reject) => {
    const url = 'https://api.gojekapi.com/v1/explore';

    const boday = {"data":"{\"activity\":\"GP:MT\",\"data\":{\"receiverid\":\"5bfb061c-656b-4811-91f1-3cb225c0c6fc\"}}","type":"QR_CODE"};

    fetch(url, {
        method: 'POST',
        headers: {
            'X-AppVersion': '3.30.2',
            'X-UniqueId': uniqid,
            'X-Session-ID': uuid,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(boday)
    })
        .then(res => res.json())
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            resolve(err)
        })

});

const functionIsi = (accessToken, uuid, uniqid) => new Promise((resolve, reject) => {
    const url = 'https://api.gojekapi.com/v1/payment';

    const boday = {"amount":20000,"metadata":{"tags":"{ \"service_type\": \"GOPAY_OFFLINE\" }","channel_type":"STATIC_QR","merchant_cross_reference_id":"5bfb061c-656b-4811-91f1-3cb225c0c6fc","external_merchant_name":"Daily Shoes"},"payment_request_type":"STATIC_QR","receiver_payment_handle":"5bfb061c-656b-4811-91f1-3cb225c0c6fc"};
    fetch(url, {
        method: 'POST',
        headers: {
            'pin':'',
            'X-AppVersion': '3.30.2',
            'X-UniqueId': uniqid,
            'X-Session-ID': uuid,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(boday)
    })
        .then(res => res.json())
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            resolve(err)
        })
});

const functionSukses = (reffId, accessToken, uuid, uniqid) => new Promise((resolve, reject) => {
    const url = 'https://api.gojekapi.com/v1/payment?action=fulfill';

    const boday = {
        "promotion_ids":[],
        "reference_id":reffId,
        "token":"eyJ0eXBlIjoiR09QQVlfV0FMTEVUIiwiaWQiOiIifQ=="
    };
    fetch(url, {
        method: 'PATCH',
        headers: {
            'pin': '425368',
            'X-AppVersion': '3.30.2',
            'X-UniqueId': uniqid,
            'X-Session-ID': uuid,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(boday)
    })
        .then(res => res.json())
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            resolve(err)
        })

});

(async () => { 
	try {
		const uniqueid = await genUniqueId(16);
        const sendOtp = await functionGojekSendOtp(uuid, uniqueid);
        if (sendOtp.success === false) {
            console.log(sendOtp)
        }
        const loginToken = sendOtp.data.login_token;
        const otpLogin = await readlineSync.question('Masukan Otp: ');
        const gojekVerify = await functionGojekVerify(loginToken, otpLogin, uuid, uniqueid);
        const accessToken = gojekVerify.data.access_token;
        console.log(`[ ${moment().format('HH:mm:ss')} ] Login Akun Sukses`);
        const saldoAkun = await functionSaldoAkun(accessToken, uuid, uniqueid);
        if (!saldoAkun.data.balance) {
            console.log(saldoAkun)
        }
        const akun = await saldoAkun.data.balance;
        console.log(`[ ${moment().format('HH:mm:ss')} ] Sisa Saldo Akun: `+akun);
        if(readlineSync.keyInYN('Lanjut Tf Saldo?')) {
            const qr = await functionQr(accessToken, uuid, uniqueid);
            const isi = await functionIsi(accessToken, uuid, uniqueid);
            if (!isi.data.reference_id) {
                console.log(isi)
            }
            const reffId = await isi.data.reference_id;
            const tf = await functionSukses(reffId, accessToken, uuid, uniqueid);
            if (!tf.data.transaction_ref) {
                console.log(tf)
            }
            const id = await tf.data.transaction_ref;
            console.log(`[ ${moment().format('HH:mm:ss')} ] Transaksi Ke Merchant Daily Shoes - Transaction ID: `+id);
        } else {
            console.log('Okelah Stop mls w!')
        }
	} catch (e) {
		console.log(e)
	}
})();