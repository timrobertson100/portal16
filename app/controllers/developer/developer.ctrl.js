var express = require('express'),
    _ = require('lodash'),
    cfg = require('../../../config/config'),
    apiCfg = require('../../models/gbifdata/apiConfig'),
    router = express.Router();

module.exports = function (app) {
    app.use('/developer', router);
};

router.get('/', function (req, res) {
    res.redirect('/developer/summary');
});

router.get('/:page', function (req, res, next) {
    renderPage(req, res, next, _.lowerCase(req.params.page));
});

function renderPage(req, res, next, page) {
    try {
        res.render('pages/developer/' + page, {
            page: page,
            apiBase: apiCfg.base.url,
            apidocs: cfg.apidocs,
            _meta: {
                title: 'GBIF ' + _.camelCase(page) + ' API'
            }
        });
    } catch (e) {
        next(e);
    }
}
