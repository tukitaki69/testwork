const http = require('http');
const url = require('url');
const request = require('request');

let port = 3000;

function coinCapCurrency(req, res) {

    let url_parts = url.parse(req.url, true);

    if (url_parts.pathname === '/rates') {
        let currency = url_parts.query['currency'];
        if (currency == null || currency === '') {
            res.writeHead(404, {'Content-type': 'application/json'});
            res.write(JSON.stringify({
                error: 'required parameter'
            }))
        } else {
            request({
                followAllRedirect: true,
                url: 'https://api.coincap.io/v2/rates' + '/' + currency
            }, function (error, responce, body) {
                if (!error) {
                    try {
                        let parsedJSON = JSON.parse(body)
                        res.writeHead(200, {'Content-type': 'application/json'});
                        res.write(JSON.stringify({
                            usd: parsedJSON['data']['rateUsd']
                        }))
                    } catch (err) {
                        console.error(err);
                        returnError(res);
                    } finally {
                        res.end()
                    }
                } else {
                    console.log(error);
                    returnError(res);
                    res.end()
                }

            })
        }
    }
}

function returnError(response) {
    response.writeHead(404, {'Content-type': 'application/json'});
    response.write(JSON.stringify({
        error: 'invalid request'
    }))
}

let server = http.createServer(coinCapCurrency);
server.listen(port, 'localhost')
