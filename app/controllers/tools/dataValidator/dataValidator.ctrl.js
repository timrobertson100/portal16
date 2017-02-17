let express = require('express'),
    router = express.Router(),
    Q = require('q'),
    translationsHelper = rootRequire('app/helpers/translations');

module.exports = function (app) {
    app.use('/', router);
};

router.get('/tools/data-validator/:jobId?', (req, res, next) => {

    getIntro(res.locals.gb.locales.current)
        .then(text => {

            let title = res.__('dataValidator.title');

            res.render('pages/tools/dataValidator/dataValidator', {
                intro: text[0],
                title: title,
                jobId: req.params.jobId
            });
        })
        .catch(e => {
            next(e);
        });

});

function getIntro(language) {
    let deferred = Q.defer();
    // insert intro text
    let introFile = ['tools/dataValidator/intro/'];
    translationsHelper.getTranslationPromise(introFile, language)
        .then(function(translation){
            deferred.resolve(translation);
        })
        .catch(function(err){
            deferred.reject(err.message);
        });
    return deferred.promise;
}
