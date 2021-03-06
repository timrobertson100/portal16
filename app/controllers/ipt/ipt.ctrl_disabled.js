//have previously mapped to a specific Drupal entry. should map tp contentful and probably from contentful be marked as having this url

//http://cms-api.gbif-uat.org/api/v1/generic/82906
"use strict";
var express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    Q = require('q'),
    helper = rootRequire('app/models/util/util'),
    cmsConfig = rootRequire('app/models/cmsData/apiConfig');

module.exports = function (app) {
    app.use('/', router);
};

router.get('/ipt\.:ext?', function (req, res, next) {
    getIptContent().then(function (data) {
        data.data = data.data[0];
        data._meta = {
            title: 'IPT'
        };
        render(req, res, next, data);
    }, function (err) {
        res.status(_.get(err, 'errorResponse.statusCode', 500));
        res.json({
            body: _.get(err, 'errorResponse.body', err)
        });
    });
});

function render(req, res, next, data) {
    try {
        if (req.params.ext == 'debug') {
            res.json(data);
        } else {
            res.render('pages/ipt/ipt', data);
        }
    } catch (e) {
        next(e);
    }
}

function getIptContent() {
    "use strict";
    var deferred = Q.defer();
    helper.getApiData(cmsConfig.base.url + 'generic/82906', function (err, data) {
        if (typeof data.errorType !== 'undefined') {
            deferred.reject(data);
        } else if (data) {
            deferred.resolve(data);
        }
        else {
            deferred.reject(err);
        }
    }, {retries: 2, timeoutMilliSeconds: 30000});
    return deferred.promise;
}