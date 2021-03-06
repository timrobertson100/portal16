'use strict';

var angular = require('angular');

(function () {
    'use strict';

    angular
        .module('portal')
        .factory('CitesApi', function ($resource, token) {
            return $resource('/api/cites/:kingdom/:name', null, {}
            );
        });

})();
