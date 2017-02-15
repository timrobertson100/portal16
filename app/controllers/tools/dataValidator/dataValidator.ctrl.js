let express = require('express'),
    router = express.Router(),
    Q = require('q'),
    translationsHelper = rootRequire('app/helpers/translations');

module.exports = function (app) {
    app.use('/', router);
};

router.get('/tools/data-validator', (req, res, next) => {

    getIntro(res.locals.gb.locales.current)
        .then(text => {
            res.render('pages/tools/dataValidator/dataValidator', {
                intro: text[0],
                _meta: {
                    title: 'Data validator'
                }
            });
        })
        .catch(e => {
            next(e);
        });

});

router.get('/tools/data-validator/:jobid',  (req, res) => {
    res.render('pages/tools/dataValidator/dataValidatorResults', {
        _meta: {
            title: 'Data validator'
        },
        jobId: req.params.jobid
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
