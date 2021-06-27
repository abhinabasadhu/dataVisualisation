async function btcDataFormat() {
    let btcdData = await fetch("https://api.nomics.com/v1/exchange-rates/history?key=69e8c37edac818d2c3baccbd9b4bf003&currency=BTC&start=2018-01-01T00:00:00Z");
    let data1 = await btcdData.json();
    let training = { start: data1[0].timestamp, target: data1.map(item => item.rate) };
    return training;
}

async function ethDataFormat() {
    let ethData = await fetch("https://api.nomics.com/v1/exchange-rates/history?key=69e8c37edac818d2c3baccbd9b4bf003&currency=ETH&start=2018-01-01T00:00:00Z");
    let data1 = await ethData.json();
    let training = { start: data1[0].timestamp, target: data1.map(item => item.rate) }
    return training;
}

async function usdtDataFormat() {
    let usdtData = await fetch("https://api.nomics.com/v1/exchange-rates/history?key=69e8c37edac818d2c3baccbd9b4bf003&currency=USDT&start=2018-01-01T00:00:00Z");
    let data1 = await usdtData.json();
    let training = { start: data1[0].timestamp, target: data1.map(item => item.rate) }
    return training;
}

async function trxDataFormat() {
    let trxData = await fetch("https://api.nomics.com/v1/exchange-rates/history?key=69e8c37edac818d2c3baccbd9b4bf003&currency=TRX&start=2018-01-01T00:00:00Z");
    let data1 = await trxData.json();
    let training = { start: data1[0].timestamp, target: data1.map(item => item.rate) }
    return training;
}

async function bnbnDataFormat() {
    let bnbData = await fetch("https://api.nomics.com/v1/exchange-rates/history?key=69e8c37edac818d2c3baccbd9b4bf003&currency=BNB&start=2018-01-01T00:00:00Z");
    let data1 = await bnbData.json();
    let training = { start: data1[0].timestamp, target: data1.map(item => item.rate) }
    return training;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function delay() {
    btcDataFormat();
    await sleep(2000);
    usdtDataFormat();
    await sleep(2000);

}