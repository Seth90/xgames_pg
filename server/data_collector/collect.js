const pool = require('../sql/database_actions.js');
const fs = require('fs');
const fetch = require('node-fetch');

/*const obj = JSON.parse(fs.readFileSync('./data/gamesDataDescriptions.json', 'utf8'));*/
const headers = new Headers({
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36"
});

/* ======== SETTINGS ======== */
const mode = 'debug';
var getExchangesOnline = false;

if (mode === 'dev') {
    getExchangesOnline = true;
}
else if (mode === 'debug') {
    getExchangesOnline = false;
}
// Массив со списком всех языков-регионов
var urlRegionArrayFull_o = ["AR-EG", "AR-AE", "AR-SA", "CS-CZ", "DA-DK", "DE-AT", "DE-CH", "DE-DE", "EL-GR", "EN-AE", "EN-GB", "EN-IE", "EN-ZA", "ES-CO", "ES-ES", "FI-FI", "FR-BE", "FR-CH", "FR-FR", "HE-IL", "HU-HU", "IT-IT", "NB-NO", "NL-BE", "NL-NL", "PL-PL", "PT-PT", "RU-RU", "SK-SK", "SV-SE", "TR-TR", "EN-AU", "EN-CA", "EN-HK", "EN-IN", "EN-NZ", "EN-SG", "EN-US", "ES-AR", "ES-CL", "ES-CO", "ES-MX", "JA-JP", "KO-KR", "PT-BR", "ZH-HK", "ZH-TW"];

var urlRegionArrayFull = urlRegionArrayFull_o;//.slice(0,2);

// Регион убран, так как там почти не бывает ссылок и зачастую используется только китайскя локализация
var excludeRegionArrayFull = ["ZH-CN"];

// Отсеивание повторяющихся элементов в массиве регионов
const urlRegionArray = urlRegionArrayFull.filter((e, i, a) => a.indexOf(e) === i);

var allGames = {};              // AllGames general info
var allGamesPrices = {};        // AllGames price info
var allGamesPosters = {};       // AllGames poster-url info
var allGamesDescriptions = {};  // AllGames description info
var currencyDict = {};          // Dictionary of currencies

var currencyChUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';
// MAIN //
console.time('CollectAllData');
//console.log(obj)

//AddData();

// MAIN // Выполнение основных функций
console.time('CollectAllData');
GetAllData()
    .then(async () => {
        //console.log("Getting description for EN language..");
        await GetDescriptions("en-us")
    })
    .then(async () => await AddDataToDatabase())
    .then(() => {
        WriteData();
        console.log("FINISHED");
        console.timeEnd('CollectAllData');
    });
// END MAIN //

// Запись в базу данных
async function AddDataToDatabase() {
    const now = new Date().toISOString().split('T')[0];
    // var allGames = {};              // AllGames general info
    // var allGamesPrices = {};        // AllGames price info
    // var allGamesPosters = {};       // AllGames poster-url info
    // var allGamesDescriptions = {};  // AllGames description info

    // client.connect((err) => {
    //     if (err) {
    //         console.error('connection error', err.stack)
    //     } else {
    //         console.log('connected');
    //     }
    // })
    let query_promises = [];
    // ACTUAL IDS AND GENERAL INFO
    for (const [key, value] of Object.entries(allGames)) {
        let text1 = 'INSERT INTO actual_ids (game_id, update_data, until_date) VALUES ($1, $2, $3) ON CONFLICT (game_id) DO UPDATE SET game_id = $1, update_data = $2, until_date = $3';
        
        let values1 = [key, now, value.endDate];
        
        try {
            query_promises.push(pool.query(text1, values1))
        } catch (err) {
            console.log(err.stack)
        }
        let text2 = 'INSERT INTO general_info (game_id, game_type, multiplayer, coop, eaaccessgame, gamepassgame, goldandsilversale, xbox_url, silversaleperc, enddate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (game_id) DO UPDATE SET game_id = $1, game_type = $2, multiplayer = $3, coop = $4, eaaccessgame = $5, gamepassgame = $6, goldandsilversale = $7, xbox_url = $8, silversaleperc = $9, enddate = $10';
        
        let values2 = [key, value.type, value.multiplayer, value.coop, value.eaaccessgame, value.gamepassgame, value.goldandsilversale, value.url, value.silversaleperc, value.endDate];

        try {
            query_promises.push(pool.query(text2, values2))
        } catch (err) {
            console.log(err.stack)
        }
    }
    //------------------------------------------------

    // POSTERS
    for (const [key, value] of Object.entries(allGamesPosters)) {
        let text = 'INSERT INTO posters (game_id, poster_url) VALUES ($1, $2) ON CONFLICT (game_id) DO UPDATE SET game_id = $1, poster_url = $2';
        let values = [key, value];
        try {
            query_promises.push(pool.query(text, values))
        } catch (err) {
            console.log(err.stack)
        }
    }
    //------------------------------------------------

    // TITLES AND DESCRIPTIONS
    for (const [key, value] of Object.entries(allGamesDescriptions)) {
        let text = 'INSERT INTO titles_en (game_id, title, description) VALUES ($1, $2, $3) ON CONFLICT (game_id) DO UPDATE SET game_id = $1, title = $2, description = $3';
        let values = [key, value.title, value.description];
        try {
            query_promises.push(pool.query(text, values))
        } catch (err) {
            console.log(err.stack)
        }
    }
    //------------------------------------------------

    // PRICES
    for (const [key, value] of Object.entries(allGamesPrices)) {
        let text = 'INSERT INTO prices (price_id, game_id, country, listprice, msrpprice, currency) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (price_id) DO UPDATE SET price_id = $1, game_id = $2, country = $3, listprice = $4, msrpprice = $5, currency = $6';
        value.forEach ((e) => {
            let values = [key + '_' + e.country, key, e.country, e.lprice, e.msrp, 'USD'];
            try {
                query_promises.push(pool.query(text, values))
            } catch (err) {
                console.log(err.stack)
            }
        })
    }
    //------------------------------------------------

    //DELETE ALL IRRELEVANT IDS
    let text = 'DELETE FROM actual_ids WHERE until_date < $1';
    let values = [now];
    try {
        query_promises.push(pool.query(text, values))
    } catch (err) {
        console.log(err.stack)
    }
    //------------------------------------------------
    await Promise.all(query_promises).then(() => pool.end())
    console.log('OK');
}
// Получение всех данных
async function GetAllData() {
    
    await GetExchangeData(); // Получение данных курсов обмена для того, чтобы привести всю валюту к USD
    for (let i = 0; i < urlRegionArray.length; i++) {
        console.log(`Progress: ${i + 1} / ${urlRegionArray.length}`);

        await sleep(1000); //Задержка между странами

        const urlRegion = urlRegionArray[i];
        console.log(urlRegion.toUpperCase());
        const languageCode = urlRegion.split("-")[0].toUpperCase();
        //const countryCode = urlRegion.split("-")[1].toUpperCase();
        console.time('CollectingItems');

        await GetDataFromCountry(urlRegion); // Получение данных по каждой стране

        console.timeEnd('CollectingItems');
        console.log('--------------');

        WriteData(languageCode); // Запись полученных данных файлов после каждой страны
    }
}
// Получение данных конкретного региона
async function GetDataFromCountry(urlRegion) {

    const countryCode = urlRegion.split("-")[1].toUpperCase();
    const regionLang = urlRegion.split("-")[0].toUpperCase();
    var skip = 0;
    var array_ids = [];

    // var recoUrl = "https://reco-public.rec.mp.microsoft.com/channels/Reco/V8.0/Lists/Computed/Deal?Market=US&Language=EN&ItemTypes=Game&deviceFamily=Windows.Xbox&count=2000&skipitems=";
    var recoUrl = "https://reco-public.rec.mp.microsoft.com/channels/Reco/V8.0/Lists/Computed/Deal?Market=US&Language=EN&count=2000&skipitems=";

    recoUrl = recoUrl.replace("US", countryCode).replace("EN", regionLang);

    const res = await fetch(recoUrl + skip, { headers: headers });
    const json = await res.json();
    totalItems = +json.PagingInfo.TotalItems;
    json.Items.forEach(e => {
        array_ids.push(e.Id);
    })
    skip = 200;
    console.log("Total: " + totalItems);
    var prom_arr = [];
    var index = 0;
    do {
        prom_arr[index++] = new Promise((resolve, reject) => {
            fetch(recoUrl + skip, { headers: headers }).then((res) => res.json()).then((json) => resolve(json)).catch((err) => console.log(err));
        });
        skip += 200;
    } while (skip < totalItems);
    var gamePromiseArray = [];
    await Promise.all(prom_arr).then((data) => {
        data.forEach((e, i) => {
            e.Items.forEach(el => {
                array_ids.push(el.Id);
            })
        })
    })



    var r = array_ids;
    var gamesUrl = 'https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=GAMEIDS&market=' + countryCode + '&languages=' + regionLang + '&MS-CV=DGU1mcuYo0WMMp+F.1';
    let chunk = 0;
    for (let i = 0; i < Math.ceil(r.length / 10); i++) {

        if (i === 40) {
            await sleep(1000);
            console.log("sleep" + i);
        }

        let tmpArr = r.slice(chunk, chunk + 10);
        chunk += 10;
        let tmpGameUrl = gamesUrl.replace('GAMEIDS', tmpArr.join(','));
        gamePromiseArray[i] = new Promise((resolve, reject) => {
            fetchRetry(tmpGameUrl, 500, 3, { headers: headers })
                .then(res => res.json())
                .then(json => resolve(json))
        });
    }
    await Promise.all(gamePromiseArray).then(data => {
        data.forEach((e) => {
            ParseData(e, urlRegion);
        })
    })
}
// Получение данных курсов валют (если исп. dbg то данные берутся из локального файла)
async function GetExchangeData() {
    if (getExchangesOnline) {
        /* ----- Получение данных обмена с сайта apilayer.com -----*/

        var myHeaders = new Headers();
        myHeaders.append("apikey", "CEAsqALWnEqO9mUFw6YQGd4SFfFmEFsA");

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };
        let changeUrl = 'https://api.apilayer.com/currency_data/live?base=USD';
        //let changeUrl = 'https://api.apilayer.com/currency_data/change?source=USD&start_date=2023-01-02&end_date=2023-01-02';
        await fetch(changeUrl, requestOptions)
            .then(response => response.json())
            .then(result => {
                currencyDict = result.quotes;
                console.log('Get currency_data - ok');
                fs.writeFile(`./data/currency_DO-NOT-DELETE.json`, JSON.stringify(result), (error) => {
                    error ? console.log(error) : null;
                });
            })
            .catch(error => console.log('error', error));
    }
    else {
        /* ----- Получение данных обмена из файла -----*/
        let data = fs.readFileSync('./data/currency_DO-NOT-DELETE.json', (err) => {
            err ? console.log(err) : null
        });
        currencyDict = JSON.parse(data).quotes;
        console.log('Get currency_data FROM FILE - ok');
    }



}
// Получние заголовков и описаний с учетом языка указанного региона
async function GetDescriptions(region) {
    var gamePromiseArray = [];
    let ids_array = [];
    Object.entries(allGames).forEach((entry) => {
        const [key, value] = entry;
        ids_array.push(key);
    });
    const languageCode = region.split("-")[0].toUpperCase();
    const countryCode = region.split("-")[1].toUpperCase();

    var r = ids_array;
    var gamesUrl = 'https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=GAMEIDS&market=' + countryCode + '&languages=' + languageCode + '&MS-CV=DGU1mcuYo0WMMp+F.1';
    let chunk = 0;
    for (let i = 0; i < Math.ceil(r.length / 10); i++) {
        let tmpArr = r.slice(chunk, chunk + 10);
        chunk += 10;
        let tmpGameUrl = gamesUrl.replace('GAMEIDS', tmpArr.join(','));
        gamePromiseArray[i] = new Promise((resolve, reject) =>
            fetch(tmpGameUrl)
                .then(res => res.json())
                .then(json => resolve(json)))
            .catch((err) => { console.log(err); reject() });
    }
    await Promise.all(gamePromiseArray).then(data => {
        data.forEach((json) => {
            json.Products.forEach((e, i) => {
                var title = e.LocalizedProperties[0].ProductTitle;
                var shortdesc = e.LocalizedProperties[0].ShortDescription;
                if (shortdesc === "") {
                    shortdesc = e.LocalizedProperties[0].ProductDescription;
                }
                if (shortdesc === undefined) {
                    shortdesc = "";
                }
                allGamesDescriptions[e.ProductId] = {
                    lang: languageCode,
                    title: title,
                    description: shortdesc
                }
            })
        })
    })
}
// Парсинг данных по каждому элементу
function ParseData(jsonData, urlRegion) {
    const languageCode = urlRegion.split("-")[0].toUpperCase();
    const countryCode = urlRegion.split("-")[1].toUpperCase();

    jsonData.Products.forEach((e, i) => {
        var phys = "false";
        var title = e.LocalizedProperties[0].ProductTitle;
        var type = e.ProductType;
        //get prices
        var listprice;
        var msrpprice;
        var currencycode = '';
        var onsale = "false";
        var gwg = "false";
        var golddiscount = "false"; // deals with gold ... and gold member sale prices?
        var goldandsilversale = "false";
        var goldandsilversalegoldprice = 100000000;
        var specialprice = 100000000;
        var eaaccessgame = "false";
        var gamepassgame = "false";
        var purchasable = "false";
        var tempea = "false"
        var tempgs = "false";
        var endDate = "";
        var goldaffids = [];
        var platxbox = "false";
        var platpc = "false";
        var platxo = "false";
        var platxsx = "false";
        var plat360 = "false";
        var silversaleperc = "0%";
        var goldandsilversalegoldperc = "0%";
        var multiplayer = "false";
        var coop = "false";
        var mptest = e.Properties;
        var shortdesc = e.LocalizedProperties[0].ShortDescription;
        if (shortdesc === "") {
            shortdesc = e.LocalizedProperties[0].ProductDescription;
        }
        if (shortdesc === undefined) {
            shortdesc = "";
        }
        // BOXSHOT
        if (phys === "false" && e.LocalizedProperties[0].Images !== undefined) {
            var imagesNum = e.LocalizedProperties[0].Images.length;
            var imageInd = 999;
            for (var j = 0; j < imagesNum; j++) {
                if (e.LocalizedProperties[0].Images[j].ImagePurpose === "Poster") { // boxshots BrandedKeyArt
                    imageInd = j;
                    break;
                }
            }
            if (imageInd === 999) {
                for (var j = 0; j < imagesNum; j++) {
                    if (e.LocalizedProperties[0].Images[j].Width < e.LocalizedProperties[0].Images[j].Height) {
                        imageInd = j;
                        break;
                    }
                }
            }
            if (imageInd === 999) {
                imageInd = 1
            }
            if (e.LocalizedProperties[0].Images[imageInd]) {
                var itemBoxshot = e.LocalizedProperties[0].Images[imageInd].Uri.replace("http:", "https:");
                var itemBoxshotSmall;
            } else {
                var itemBoxshot = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                var itemBoxshotSmall = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
            }
            if (itemBoxshot.indexOf("store-images") !== -1) {
                itemBoxshotSmall = itemBoxshot + "?w=140";
                // itemBoxshot = itemBoxshot + "&h=300&w=200&format=jpg";
                itemBoxshot = itemBoxshot + "?w=200";
            } else {
                itemBoxshotSmall = itemBoxshot;
            }
        } else if (phys === "true" && e.LocalizedProperties[0].Images !== undefined) {
            var imagesNum = e.LocalizedProperties[0].Images.length;
            var imageInd = 999;
            for (var j = 0; j < imagesNum; j++) {
                if (e.LocalizedProperties[0].Images[j].ImagePurpose === "Poster") {
                    imageInd = j;
                    break;
                }
            }
            if (e.LocalizedProperties[0].Images[imageInd]) {
                var itemBoxshot = e.LocalizedProperties[0].Images[imageInd].Uri.replace("http:", "https:");
                var itemBoxshotSmall;
            } else {
                if (e.LocalizedProperties[0].Images[0]) {
                    if (e.LocalizedProperties[0].Images[0].Uri.toLowerCase().indexOf("s-microsoft") === -1) {
                        var itemBoxshot = e.LocalizedProperties[0].Images[0].Uri.replace("http:", "https:") + "&w=231&h=197&q=90&m=6&b=%23FFFFFFFF&o=f";
                    } else {
                        var itemBoxshot = e.LocalizedProperties[0].Images[0].Uri.replace("http:", "https:")
                    }
                    var itemBoxshotSmall = itemBoxshot;
                } else {
                    var itemBoxshot = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                    var itemBoxshotSmall = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
                }
            }
        } else {
            var itemBoxshot = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
            var itemBoxshotSmall = "https://compass-ssl.xbox.com/assets/3b/7a/3b7a3497-fc6a-4cae-b37e-48c487b084c5.jpg?n=X1-Standard-digital-boxshot_584x800.jpg";
        }
        // END BOXSHOT

        // MP, COOP
        if (mptest.Attributes) {
            for (var n = 0; n < mptest.Attributes.length; n++) {
                if (mptest.Attributes[n].Name.toLowerCase().indexOf("multiplayer") !== -1) {
                    multiplayer = "true";
                }
                if (mptest.Attributes[n].Name.toLowerCase().indexOf("coop") !== -1) {
                    coop = "true";
                }
            }
        }
        //END MP, COOP

        //EACCESS, GAMEPASS, GOLD
        if (phys === "false") {
            if (e.LocalizedProperties[0].EligibilityProperties !== null && e.LocalizedProperties[0].EligibilityProperties !== undefined &&
                e.LocalizedProperties[0].EligibilityProperties !== "undefined") {
                if (e.LocalizedProperties[0].EligibilityProperties.Affirmations.length > 0) {
                    e.LocalizedProperties[0].EligibilityProperties.Affirmations.forEach(function (aff) {
                        if (aff.Description.toLowerCase().indexOf("ea access") !== -1) {
                            tempea = "true";
                        }
                        if (aff.Description.toLowerCase().indexOf("game pass") !== -1) {
                            gamepassgame = "true";
                        }
                        if (aff.Description.toLowerCase().indexOf("gold") !== -1) {
                            tempgs = "true";
                            goldaffids.push(aff.AffirmationProductId);
                        }
                    })
                }
            }
            e.DisplaySkuAvailabilities.forEach(function (sku) {
                var purchnum = 0;
                sku.Availabilities.forEach(function (av, ind) {
                    if (av.Actions.indexOf("Purchase") !== -1) {
                        purchasable = "true";
                        purchnum++;
                        if (purchnum > 1 && tempgs === "true" && av.RemediationRequired === true && goldaffids.indexOf(av.Remediations[0].BigId) !== -1) {
                            goldandsilversale = "true";
                        }
                        // get platform info
                        av.Conditions.ClientConditions.AllowedPlatforms.forEach(function (plat) {
                            if (plat.PlatformName === "Windows.Xbox") {
                                platxbox = "true";
                            }
                            if (plat.PlatformName === "Windows.Desktop") {
                                platpc = "true";
                            }
                        })
                    }
                    if (av.Actions.indexOf("Purchase") !== -1 && (av.OrderManagementData.Price.MSRP !== 0 || (av.OrderManagementData.Price.MSRP === 0 && av.OrderManagementData.Price.ListPrice === 0)) && sku.Sku.Properties.IsTrial === false) {
                        if ((av.OrderManagementData.Price.ListPrice !== av.OrderManagementData.Price.MSRP || (av.OrderManagementData.Price.MSRP === 0 && av.OrderManagementData.Price.ListPrice === 0)) && ind !== 0) {
                            specialprice = av.OrderManagementData.Price.ListPrice;
                        } else {
                            listprice = av.OrderManagementData.Price.ListPrice;
                        }
                        if (ind === 0) {
                            msrpprice = av.OrderManagementData.Price.MSRP;
                        }
                        currencycode = av.OrderManagementData.Price.CurrencyCode;
                        if (av.Properties.MerchandisingTags !== undefined) {
                            if (av.Properties.MerchandisingTags.indexOf("LegacyGamesWithGold") !== -1) {
                                gwg = "true";
                                specialprice = listprice;
                                listprice = msrpprice;
                            }
                            if (av.Properties.MerchandisingTags.indexOf("LegacyDiscountGold") !== -1) {
                                golddiscount = "true";

                            }
                        }
                        if (goldandsilversale === "true" && av.DisplayRank === 1) {
                            goldandsilversalegoldprice = av.OrderManagementData.Price.ListPrice;
                            var golddiff = msrpprice - goldandsilversalegoldprice;
                            goldandsilversalegoldperc = Math.round(golddiff / msrpprice * 100).toString() + "%";
                        }
                        if (tempea === "true" && av.Actions.length === 2) {
                            eaaccessgame = "true";
                        }
                        // if (gameIdArrays["onsale"].indexOf(itemId) !== -1) {
                        //     onsale = "true";
                        // }
                        if (listprice < msrpprice || specialprice < msrpprice) {
                            var listdiff = msrpprice - listprice;
                            silversaleperc = Math.round(listdiff / msrpprice * 100).toString() + "%";
                            endDate = av.Conditions.EndDate;
                        }
                    }

                })
            })
            // END EACCESS, GAMEPASS, GOLD

            // PLATFORM
            if (platxbox === "true") {
                if (e.Properties.XboxConsoleGenCompatible === null) {
                    platxo = "true";
                    platxsx = "true";
                } else if (e.Properties.XboxConsoleGenCompatible === undefined) {
                    platxo = "true";
                } else if (e.Properties.XboxConsoleGenCompatible.length === 2) {
                    platxo = "true";
                    platxsx = "true";
                } else if (e.Properties.XboxConsoleGenCompatible[0] === "ConsoleGen8") {
                    platxo = "true";
                } else if (e.Properties.XboxConsoleGenCompatible[0] === "ConsoleGen9") {
                    platxsx = "true";
                }
            }

        } /*else {
            e.DisplaySkuAvailabilities.forEach(function (sku) {
                sku.Availabilities.forEach(function (av) {
                    if (av.Actions.indexOf("Purchase") !== -1 && av.Actions.indexOf("Browse") !== -1 && (av.OrderManagementData.Price.MSRP !== 0 || (av.OrderManagementData.Price.MSRP === 0 && av.OrderManagementData.Price.ListPrice === 0)) && av.Actions.length > 2) {
                        listprice = av.OrderManagementData.Price.ListPrice;
                        msrpprice = av.OrderManagementData.Price.MSRP;
                        currencycode = av.OrderManagementData.Price.CurrencyCode;
                        // if (gameIdArrays["onsale"].indexOf(itemId) !== -1) {
                        //     onsale = "true";
                        // }
                    }
                })
            })
        }*/
        // END PLATFORM

        // MARKETS
        if (listprice === undefined) {
            console.log("NOTE: BigID " + e.ProductId + " has no price information.");
            listprice = 100000000;
            msrpprice = 100000000;
            currencycode = "USD";
        }
        var tmp_market = [];
        var tmp_dict = {};
        var tmp_desc = [];
        var tmp_lang_dict = {};
        var myCurrencyCode = '';

        // if (currencyDict[currencycode]) {
        //     msrpprice = Math.round(msrpprice * (currencyDict[currencycode].Value / currencyDict[currencycode].Nominal) * 100) / 100;
        //     listprice = Math.round(listprice * (currencyDict[currencycode].Value / currencyDict[currencycode].Nominal) * 100) / 100;
        //     currencycode = 'RUB';
        // }
        let changename = 'USD' + currencycode.toUpperCase();
        if (currencyDict[changename]) {
            msrpprice = Math.round(msrpprice / currencyDict[changename] * 100) / 100;
            listprice = Math.round(listprice / currencyDict[changename] * 100) / 100;
            myCurrencyCode = 'USD';
        }
        else {
            myCurrencyCode = currencycode;
        }

        if (typeof allGamesPrices[e.ProductId] === 'undefined') {
            tmp_dict = {
                country: countryCode,
                msrp: msrpprice,
                lprice: listprice,
                currency: myCurrencyCode
            }
            tmp_market.push(tmp_dict);
        }
        else {
            tmp_dict = {
                country: countryCode,
                msrp: msrpprice,
                lprice: listprice,
                currency: myCurrencyCode
            }
            tmp_market = allGamesPrices[e.ProductId];
            tmp_market.push(tmp_dict);
        }
        allGamesPrices[e.ProductId] = tmp_market;

        // END MARKETS
        //tmpLangDict[languageCode] = shortdesc;

        allGamesPosters[e.ProductId] = itemBoxshotSmall;

        let s = title.replace(/[^a-zа-яё0-9\s]/gi, '').replace(/\s+/g, ' ').toLowerCase().split(' ').join('-');
        let gameUrl = `https://www.xbox.com/en-us/games/store/${s}/${e.ProductId}`;


        // INSERT DATA INTO DATABASE -------------------------
        //In separate function after collecting all data
        // END INSERTION DATA INTO DATABASE

        allGames[e.ProductId] = {
            url: gameUrl,
            type: type,
            multiplayer: multiplayer,
            coop: coop,
            title: title,
            endDate: endDate,
            golddiscount: golddiscount,
            //description: shortdesc,
            boxshot: itemBoxshot,
            //boxshotsmall: itemBoxshotSmall,
            //market: tmp_market,
            // msrp_target: '',
            // lprice_target: '',
            // country_target: '',
            // currency_target: '',
            // msrp_origin: '',
            // lprice_origin: '',
            // country_origin: '',
            // currency_origin: '',
            tempgs: tempgs,
            goldandsilversale: goldandsilversale,
            onsale: onsale,
            eaaccessgame: eaaccessgame,
            gamepassgame: gamepassgame,
            purchasable: purchasable,
            platformxbox: platxbox,
            platformpc: platpc,
            platformxo: platxo,
            platformxsx: platxsx,
            platform360: plat360,
            silversaleperc: silversaleperc,
            goldandsilversalegoldperc: goldandsilversalegoldperc
        };
    })
}
// Запись данных в файлы
function WriteData(country) {
    fs.writeFile(`./data/gamesDataRU.json`, JSON.stringify(allGames), (error) => {
        error ? console.log(error) : null;
    });
    fs.writeFile(`./data/gamesDataPrices.json`, JSON.stringify(allGamesPrices), (error) => {
        error ? console.log(error) : null;
    });
    fs.writeFile(`./data/gamesDataDescriptions.json`, JSON.stringify(allGamesDescriptions), (error) => {
        error ? console.log(error) : null;
    });
    fs.writeFile(`./data/gamesDataPosters.json`, JSON.stringify(allGamesPosters), (error) => {
        error ? console.log(error) : null;
    });
}
// Имитация ожидания
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Fetch с переподключением в случае ошибки (ссылка, задержка, кол-во попыток, опции)
function fetchRetry(url, delay, tries, fetchOptions = {}) {
    function onError(err) {
        triesLeft = tries - 1;
        if (!triesLeft) {
            throw err;
        }
        console.log(`Recconnect. Delay ${delay} Tries left: ${triesLeft}`);
        return sleep(delay).then(() => fetchRetry(url, delay, triesLeft, fetchOptions));
    }
    return fetch(url, fetchOptions).catch(onError);
}




