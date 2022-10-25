const http = require('http');
const url = require('url');
const request = require('request-promise');

let port = 3000;

function coinCapCurrency(req, res) {
    let url_parts = url.parse(req.url, true);
    if (url_parts.pathname === '/rates') {
        let currency = url_parts.query['currency'];
        if (currency == null || currency === '') {
            res.writeHead(404, {'Content-type': 'application/json'});
            res.write(JSON.stringify({
                error: 'missing required currency parameter'
            }))
            res.end()
        } else {
            request({
                method: 'GET',
                uri: 'https://api.coincap.io/v2/rates' + '/' + currency,
                json: true
            }).then(
                function (resolve) {
                    try {
                        res.writeHead(200, {'Content-type': 'application/json'});
                        res.write(JSON.stringify({
                            usd: resolve['data']['rateUsd']
                        }))
                    } catch (err) {
                        console.error(err);
                        onError(res);
                    } finally {
                        res.end()
                    }
                },
                function (error) {
                    console.log(error);
                    onError(res);
                    res.end()
                }
            )
        }

    } else {
        onError(res);
        res.end()
    }
}

function onError(response) {
    response.writeHead(404, {'Content-type': 'application/json'});
    response.write(JSON.stringify({
        error: 'invalid request'
    }))
}

let server = http.createServer(coinCapCurrency);
server.listen(port, 'localhost')