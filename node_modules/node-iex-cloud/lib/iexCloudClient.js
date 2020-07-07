"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("./crypto");
var stock_1 = require("./stock");
var stocks_1 = require("./stocks");
var market_1 = require("./market");
var reference_1 = require("./reference");
var dataPoints_1 = require("./dataPoints");
var timeSeries_1 = require("./timeSeries");
var stats_1 = require("./stats");
var request_1 = require("./request");
var forex_1 = require("./forex");
var IEXCloudClient = /** @class */ (function () {
    function IEXCloudClient(f, config) {
        var _this = this;
        /**  Takes in a stock symbol, a unique series of letters assigned to a security   */
        this.symbol = function (symbol) {
            _this.req.stockSymbol = symbol;
            return new stock_1.default(_this.req);
        };
        /** Takes in multiple stock symbols, and batches them to a single request  */
        this.batchSymbols = function () {
            var symbols = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                symbols[_i] = arguments[_i];
            }
            _this.req.datatype = "stock/market/batch";
            _this.req.stockSymbols = symbols;
            return new stocks_1.default(_this.req);
        };
        /** Takes in multiple stock symbols, and batches them to a single request  */
        this.symbols = function () {
            var symbols = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                symbols[_i] = arguments[_i];
            }
            _this.req.datatype = "stock/market/batch";
            console.warn("This method will be deprecated please use batchSymbols to batch multiple stock symbols together");
            _this.req.stockSymbols = symbols;
            return new stocks_1.default(_this.req);
        };
        this.tops = function () {
            _this.req.datatype = "tops";
            return _this.req.request("");
        };
        /**  Takes in a crypto currency   */
        this.crypto = function (crypto) {
            _this.req.datatype = "crypto";
            _this.req.cryptoCurrency = crypto;
            return new crypto_1.default(_this.req);
        };
        this.market = function () {
            _this.req.datatype = "stock/market";
            return new market_1.default(_this.req);
        };
        this.forex = function () {
            _this.req.datatype = "fx";
            return new forex_1.default(_this.req);
        };
        this.refData = function () {
            _this.req.datatype = "ref-data";
            return new reference_1.default(_this.req);
        };
        this.dataPoints = function () {
            _this.req.datatype = "data-points";
            return new dataPoints_1.default(_this.req);
        };
        this.stats = function () {
            _this.req.datatype = "stats";
            return new stats_1.default(_this.req);
        };
        this.timeSeries = function () {
            _this.req.datatype = "time-series";
            return new timeSeries_1.default(_this.req);
        };
        /**  Returns an array of symbols up to the top 10 matches.
         * Results will be sorted for relevancy. Search currently defaults to equities only, where the symbol returned is supported by endpoints listed under the Stocks category.
         * @params search by symbol or security name.
         */
        this.search = function (symbol) {
            _this.req.datatype = "search";
            return _this.req.request(symbol);
        };
        this.req = new request_1.default(f.bind(this), config);
    }
    return IEXCloudClient;
}());
exports.default = IEXCloudClient;
