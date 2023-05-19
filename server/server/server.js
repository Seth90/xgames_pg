const fs = require('fs');
const pool = require('../sql/database_actions.js');

const express = require('express');
const app = express();
const PORT = 3000;

const update_time = 10800000; //3 hours between database request

var requestTime_getGames2 = 0;
var requestData_getGames2 = {};
var requestTime_getPrice2 = 0;
var requestData_getPrice2 = {};
var requestTime_getPosters2 = 0;
var requestData_getPosters2 = {};
var requestTime_getDescriptions2 = 0;
var requestData_getDescriptions2 = {};

var requestData_getGamedata = {};

// Returns {id: {url:, type:, multiplayer:, coop:, goldandsilversale:, eaaccessgame:, gamepassgame:},}
app.get('/getGames', async (req, res) => {

    if ((new Date().getTime() - requestTime_getGames2) > update_time) {
        console.log('GET DATA FROM DATABASE _ GAMES');
        /*client.connect((err) => {
            if (err) {
                console.error('connection error', err.stack)
            } else {
                console.log('connected');
            }
        })*/

        let text = "SELECT game_id, game_type, multiplayer, coop, eaaccessgame, gamepassgame, golddiscount, goldandsilversale, xbox_url, silversaleperc, enddate FROM general_info WHERE game_id in (SELECT game_id FROM actual_ids);"

        let values = [];
        let tmp_dict = {};

        try {
            await pool.query(text, values).then((db_data) => {
                requestTime_getGames2 = new Date().getTime();
                db_data.rows.forEach((e) => {
                    tmp_dict[e.game_id] = {
                        id: e.game_id,
                        url: e.xbox_url,
                        type: e.game_type,
                        multiplayer: e.multiplayer,
                        coop: e.coop,
                        goldandsilversale: e.goldandsilversale,
                        eaaccessgame: e.eaaccessgame,
                        golddiscount: e.golddiscount,
                        gamepassgame: e.gamepassgame,
                        silversaleperc: e.silversaleperc,
                        enddate: e.enddate
                    }
                })
            });
        } catch (err) {
            console.log(err.stack)
        } finally {
            //client.end();

        }
        requestData_getGames2 = tmp_dict;
    }
    else {
        console.log('GET DATA FROM CACHE _ GAMES');
    }

    console.log(`Data: ОК`);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type", "application/json");
    res.end(JSON.stringify(requestData_getGames2));
    console.log('SENDED');
})
// Returns {ID: [{country:, msrp:, lprice:, currency:}],}
app.get('/getPrices', async (req, res) => {

    if ((new Date().getTime() - requestTime_getPrice2) > update_time) {
        console.log('GET DATA FROM DATABASE _ PRICES');
        /*client.connect((err) => {
            if (err) {
                console.error('connection error', err.stack)
            } else {
                console.log('connected');
            }
        })*/

        let text = "SELECT prices.game_id, country, listprice, msrpprice, currency FROM prices LEFT JOIN (SELECT game_id, MIN(listprice) as Minimum FROM prices GROUP BY game_id) q1 ON q1.game_id = prices.game_id WHERE listprice = minimum AND prices.game_id in (SELECT game_id FROM actual_ids);"

        let values = [];
        let tmp_dict = {};

        try {
            await pool.query(text, values).then((db_data) => {
                requestTime_getPrice2 = new Date().getTime();
                db_data.rows.forEach((e) => {
                    tmp_dict[e.game_id] = {
                        country: e.country,
                        msrp: e.msrpprice,
                        lprice: e.listprice,
                        currency: "USD"
                    }
                })
            });
        } catch (err) {
            console.log(err.stack)
        } finally {
            //client.end();

        }
        requestData_getPrice2 = tmp_dict;
    }
    else {
        console.log('GET DATA FROM CACHE');
    }

    console.log(`Data: ОК`);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type", "application/json");
    res.end(JSON.stringify(requestData_getPrice2));
    console.log('SENDED');
})
// Returns {ID: poster_url,}
app.get('/getPosters', async (req, res) => {

    if ((new Date().getTime() - requestTime_getPosters2) > update_time) {
        console.log('GET DATA FROM DATABASE _ POSTERS');
        // client.connect((err) => {
        //     if (err) {
        //         console.error('connection error', err.stack)
        //     } else {
        //         console.log('connected');
        //     }
        // })

        let text = "SELECT game_id, poster_url FROM posters WHERE game_id in (SELECT game_id FROM actual_ids);"

        let values = [];
        let tmp_dict = {};

        try {
            await pool.query(text, values).then((db_data) => {
                requestTime_getPosters2 = new Date().getTime();
                db_data.rows.forEach((e) => {
                    tmp_dict[e.game_id] = e.poster_url;
                })
            })
        } catch (err) {
            console.log(err.stack)
        } finally {
            //client.end();
        }
        requestData_getPosters2 = tmp_dict;
    }
    else {
        console.log('GET DATA FROM CACHE _ POSTERS');
    }

    console.log(`Data: ОК`);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type", "application/json");
    res.end(JSON.stringify(requestData_getPosters2));
    console.log('SENDED');
})
// Returns {ID: {lang:, title:, description:}, }
app.get('/getDescriptions', async (req, res) => {

    if ((new Date().getTime() - requestTime_getDescriptions2) > update_time) {
        console.log('GET DATA FROM DATABASE _ DESCRIPTIONS');
        // client.connect((err) => {
        //     if (err) {
        //         console.error('connection error', err.stack)
        //     } else {
        //         console.log('connected');
        //     }
        // })

        let text = "SELECT game_id, title, description FROM titles_en WHERE game_id in (SELECT game_id FROM actual_ids);"

        let values = [];
        let tmp_dict = {};

        try {
            await pool.query(text, values).then((db_data) => {
                requestTime_getDescriptions2 = new Date().getTime();
                db_data.rows.forEach((e) => {
                    tmp_dict[e.game_id] = {
                        lang: "EN",
                        title: e.title,
                        description: e.description
                    };
                })
            })
        } catch (err) {
            console.log(err.stack)
        } finally {
            //client.end();
        }
        requestData_getDescriptions2 = tmp_dict;
    }
    else {
        console.log('GET DATA FROM CACHE _ DESCRIPTIONS');
    }

    console.log(`Data: ОК`);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type", "application/json");
    res.end(JSON.stringify(requestData_getDescriptions2));
    console.log('SENDED');
})
app.get('/product/:tagId', async (req, res) => {

    let text = 'SELECT game_id, game_type, multiplayer, coop, eaaccessgame, gamepassgame, goldandsilversale, xbox_url, silversaleperc, enddate, listprice, msrpprice, country, currency, title, description, poster_url FROM titles_en INNER JOIN general_info USING(game_id) INNER JOIN posters USING(game_id) INNER JOIN prices USING(game_id) WHERE game_id = $1';

    let values = [req.params.tagId];
    let tmp_dict = {};

    try {
        await pool.query(text, values).then((db_data) => {
            //requestTime_getPosters2 = new Date().getTime();
            let priceArr = [];
            db_data.rows.forEach((e) => {
                tmp_dict = {
                    game_id: e.game_id,
                    game_type: e.game_type,
                    multiplayer: e.multiplayer,
                    coop: e.coop,
                    eaaccessgame: e.eaaccessgame,
                    gamepassgame: e.gamepassgame,
                    goldandsilversale: e.goldandsilversale,
                    xbox_url: e.xbox_url,
                    silversaleperc: e.silversaleperc,
                    enddate: e.enddate,
                    title: e.title,
                    description: e.description,
                    poster_url: e.poster_url
                }
                priceArr.push({
                    listprice: e.listprice,
                    msrpprice: e.msrpprice,
                    country: e.country,
                    currency: e.currency
                })
            })
            tmp_dict['prices'] = priceArr;
        })
    } catch (err) {
        console.log(err.stack)
    } finally {
        //client.end();
    }
    requestData_getGamedata = tmp_dict;


    console.log(`Data: ОК`);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type", "application/json");
    res.end(JSON.stringify(requestData_getGamedata));
    console.log('SENDED');
})
app.get('/getExchanges', (req, res) => {
    console.log(req.url);
    if (fs.existsSync('./data/currency_DO-NOT-DELETE.json')) {
        let data = fs.readFileSync('./data/currency_DO-NOT-DELETE.json', (err) => {
            err ? console.log(err) : null
        });
        console.log(`Data: ОК`);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Content-Type", "application/json");
        res.end(data);
        console.log('OK')
    }
    else {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.send('Not extsts');
        console.log('Not exist')
    }
})
app.get('/getComingSoonGames', (req, res) => {
    console.log(req.url);
    if (fs.existsSync('./data/comingSoonGames.json')) {
        let data = fs.readFileSync('./data/comingSoonGames.json', (err) => {
            err ? console.log(err) : null
        });
        console.log(`Data: ОК`);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Content-Type", "application/json");
        res.end(data);
        console.log('OK')
    }
    else {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.send('Not extsts');
        console.log('Not exist')
    }
})

app.listen(PORT, () => {
    console.log(`Starting listening on port ${PORT}`)
})