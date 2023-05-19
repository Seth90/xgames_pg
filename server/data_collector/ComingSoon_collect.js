const axios = require('axios');
const fs = require('fs');
const HTTP = axios.create();

let productUrl = 'https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=GAMEIDS&market=us&languages=en&MS-CV=DGU1mcuYo0WMMp+F.1';

exports.GetComingSoonGames = async function () {
    let cs_games = {};
    try {
        const response = await HTTP.get('https://reco-public.rec.mp.microsoft.com/channels/Reco/V8.0/Lists/Computed/ComingSoon?Market=us&Language=en&ItemTypes=Game&deviceFamily=Windows.Xbox&count=2000&skipitems=0');
        let idsArrFull = response.data.Items;
        let idsArr = [];
        idsArrFull.forEach((e) => {
            idsArr.push(e.Id);
        })
        //console.log(idsArr);
        let cs_gamePromiseArray = [];
        let originalReleaseDate = '';
        let preOrderReleaseDate = '';
        let chunk = 0;
        for (let i = 0; i < Math.ceil(idsArr.length / 10); i++) {
            let tmpArr = idsArr.slice(chunk, chunk + 10);
            chunk += 10;
            let tmpGameUrl = productUrl.replace('GAMEIDS', tmpArr.join(','));
            cs_gamePromiseArray[i] = new Promise((resolve, reject) =>
                axios(tmpGameUrl)
                    .then(json => resolve(json)))
                .catch((err) => { console.log(err); reject() });
        }
        await Promise.all(cs_gamePromiseArray).then(data => {
            data.forEach((json) => {
                //console.log(json.data)
                json.data.Products.forEach((e, i) => {
                    var phys = "false";
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
                    let title = e.LocalizedProperties[0].ProductTitle;
                    let shortdesc = e.LocalizedProperties[0].ShortDescription;
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
                                if (av.Actions.indexOf("Purchase") !== -1) {
                                    preOrderReleaseDate = av.Properties.PreOrderReleaseDate;
                                    originalReleaseDate = av.Properties.OriginalReleaseDate;
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
                    }
                    let s = title.replace(/[^a-zа-яё0-9\s]/gi, '').replace(/\s+/g, ' ').toLowerCase().split(' ').join('-');
                    let gameUrl = `https://www.xbox.com/en-us/games/store/${s}/${e.ProductId}`;

                    cs_games[e.ProductId] = {
                        id: e.ProductId,
                        url: gameUrl,
                        itemBoxshotSmall: itemBoxshotSmall,
                        type: type,
                        multiplayer: multiplayer,
                        coop: coop,
                        title: title,
                        preOrderReleaseDate: preOrderReleaseDate,
                        originalReleaseDate: originalReleaseDate,
                        golddiscount: golddiscount,
                        boxshot: itemBoxshot,
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
            })
        });

        fs.writeFile(`./data/comingSoonGames.json`, JSON.stringify(cs_games), (error) => {
            error ? console.log(error) : null;
        });

    }
    catch (e) {
        console.log(e);
    }
}