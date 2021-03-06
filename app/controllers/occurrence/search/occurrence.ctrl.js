var express = require('express'),
    router = express.Router();

module.exports = function (app) {
    app.use('/occurrence', router);
};

function renderSearch(req, res) {
    res.render('pages/occurrence/ocurrence', {
        title: 'Ocurrences',
        _meta: {
            hideSearchAction: true,
            hasTools: true,
            hideFooter: true,
            title: res.__('stdTerms.search')
        }
    });
}

router.get('/', function (req, res) {
    res.redirect(302, './occurrence/search');
});

router.get('/search', function (req, res) {
    renderSearch(req, res);
});

router.get('/gallery', function (req, res) {
    renderSearch(req, res);
});

router.get('/map', function (req, res) {
    renderSearch(req, res);
});

router.get('/download', function (req, res) {
    renderSearch(req, res);
});

router.get('/species', function (req, res) {
    renderSearch(req, res);
});

router.get('/datasets', function (req, res) {
    renderSearch(req, res);
});
