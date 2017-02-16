var angular = require('angular');
//require('./errorLogging'); //TODO temporarily disabled as it isn't tested for DOS and stability
require('angular-ui-router');
require('angular-translate');
require('angular-moment');
require('angular-leaflet-directive');
window.L = L;
require('angular-hotkeys');
require('angular-resource');
require('angular-aria');
require('angular-ui-bootstrap');
require('ng-infinite-scroll');
require('angular-scroll');
require('angular-sanitize');
require('../../../components/clickoutside/clickoutside.directive');
require('nouislider-angular');
window.Chartist = require('chartist');
require('angular-chartist.js');
require('chartist-plugin-axistitle');
require('angular-local-storage');
require('angular-toastr');


require('checklist-model');//TODO remove as we hardly use it now that there is continous update on occurrenece search?

require('angular-svg-round-progressbar');

(function () {
    'use strict';
    angular
        .module('portal', ['LocalStorageModule', 'ngAria', 'ui.router', 'pascalprecht.translate', 'leaflet-directive', 'angularMoment', 'cfp.hotkeys', 'ngResource', 'ui.bootstrap', 'infinite-scroll', 'gb-click-outside', 'duScroll', 'ngSanitize', 'checklist-model', 'ya.nouislider', 'angular-chartist', 'angular-svg-round-progressbar', 'toastr']);
})();

(function () {
    'use strict';
    angular
        .module('portal')
        .run(runBlock)
        .config(configBlock);

    /** @ngInject */
    function runBlock(amMoment, $translate, $http) { //$log
        //$log.debug('runBlock end');
        if (location.pathname.substr(0, 4) == '/da/') {
            $translate.use('da');
            amMoment.changeLocale('da');
        } else {
            amMoment.changeLocale('en');
        }

        $http({
            method: 'GET',
            url: '//timrobertson100.carto.com/api/v1/map?stat_tag=API&config=%7B%22version%22%3A%221.3.0%22%2C%22stat_tag%22%3A%22API%22%2C%22layers%22%3A%5B%7B%22type%22%3A%22cartodb%22%2C%22options%22%3A%7B%22sql%22%3A%22SELECT%20ST_SCALE(the_geom%2C%20111319.44444444444444%2C%20111319.44444444444444)%20AS%20the_geom_webmercator%20FROM%20world_borders_hd_copy%22%2C%22cartocss%22%3A%22%23layer%20%7B%20polygon-fill%3A%20%234D5258%3B%20polygon-opacity%3A%201%3B%20line-width%3A0%7D%22%2C%22cartocss_version%22%3A%222.1.0%22%7D%7D%5D%7D'
        });
    }

    /** @ngInject */
    function configBlock(localStorageServiceProvider, toastrConfig) {
        localStorageServiceProvider
            .setPrefix('gbif')
            .setStorageType('localStorage')
            .setDefaultToCookie(false);

        angular.extend(toastrConfig, {
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 3,
            progressBar: true,
            newestOnTop: true,
            positionClass: 'toast-bottom-right',
            preventDuplicates: false,
            preventOpenDuplicates: true,
            tapToDismiss: true,
            target: 'body',
            timeOut: "10000",
            extendedTimeOut: "3000"
        });
    }
})();

require('./angular/env.constants');
require('./angular/routerConfig');

require('./angular/index.filters');
require('./angular/occurrence.resource');
require('./angular/dataset.resource');
require('./angular/cms.resource');
require('./angular/dbpedia.resource');
require('./angular/redlist.resource');
require('./angular/cites.resource');
require('./angular/directory.resource');
require('./angular/species.resource');
require('./angular/taxonomy.resource');
require('./angular/map.resource');
require('./angular/similarOccurrence.service');
require('./angular/occurrenceFilter.service');
require('./angular/datasetFilter.service');
require('./angular/speciesFilter.service');
require('./angular/toast.service');
require('./angular/map.constants');
require('./angular/enums.constants');
require('./angular/country.resource');

require('./angular/directives/onload.directive');

require('../partials/feedback/feedback.directive');
require('../partials/notifications/notifications.directive');

require('./angular/nav.constants');
require('../partials/navigation/nav.ctrl');
require('../partials/popups/terms/terms.ctrl');


require('../../../pages/search/search.ctrl');

require('../../../pages/occurrence/key/occurrenceKey.ctrl');
require('../../../pages/occurrence/occurrence.ctrl');
require('../../../pages/occurrence/table/occurrenceTable.ctrl');
require('../../../pages/occurrence/gallery/occurrenceGallery.ctrl');
require('../../../pages/occurrence/map/occurrenceMap.ctrl');
require('../../../pages/occurrence/species/occurrenceSpecies.ctrl');
require('../../../pages/occurrence/download/occurrenceDownload.ctrl');

require('../../../pages/occurrence/download/key/occurrenceDownload.ctrl');

require('../../../pages/species/key/speciesKey.ctrl');

require('../../../pages/dataset/search/dataset.ctrl');
require('../../../pages/dataset/search/table/datasetTable.ctrl');

require('../../../pages/tools/suggestDataset/suggestDataset.ctrl');

require('../../../pages/dataset/key/datasetKey.ctrl');
require('../../../pages/dataset/key/usage/datasetUsage.ctrl');

require('./angular/cmsFilter.service');
require('../../../pages/cms/search/cms.ctrl');
require('../../../pages/cms/search/table/cmsTable.ctrl');
require('../../../pages/about/programme/programme.ctrl');
require('../../../pages/about/project/project.ctrl');
require('../../../pages/about/directory/directory.ctrl');
require('../../../pages/theGbifNetwork/theGbifNetwork.ctrl');
require('../../../pages/theGbifNetwork/theGbifNetworkMap.directive');
require('../../../pages/theGbifNetwork/literatureBarChartYearly.directive');

require('../../../pages/country/key/countryKey.ctrl');

require('./angular/publisher.resource');
require('./angular/publisherFilter.service');
require('./angular/remarks.service');
require('../../../pages/publisher/search/publisher.ctrl');
require('../../../pages/publisher/search/table/publisherTable.ctrl');

require('../../../pages/species/search/species.ctrl');
require('../../../pages/species/search/table/speciesTable.ctrl');
require('../../../pages/species/search/list/speciesList.ctrl');

require('../../../components/map/basic/gbmap.directive');
require('../../../components/suggest/suggest.directive');
require('../../../components/expand/expand.directive');
require('../../../components/shorten/shorten.directive');
require('../../../components/fab/fab.directive');
require('../../../components/searchDrawer/searchDrawer.directive');
require('../../../components/enumFilter/enumFilter.directive');
require('../../../components/filterTaxon/filterTaxon.directive');
require('../../../components/filterSuggest/filterSuggest.directive');
require('../../../components/filterLocation/filterLocation.directive');
require('../../../components/filterLocation/filterLocationMap.directive');
require('../../../components/filterLocation/bboxFilter/bboxFilter.directive');
require('../../../components/filterInterval/filterInterval.directive');
require('../../../components/filterFacet/filterFacet.directive');
require('../../../components/count/count.directive');
require('../../../components/droppable/droppable.directive');

require('../../../components/filterEnum/filterEnum.directive');
require('../../../components/filterTernary/filterTernary.directive');
require('../../../components/filterDate/filterDate.directive');
require('../../../components/filterCms/filterCms.directive');

require('../../../components/focusMe/focusMe.directive');

require('./angular/translate');

var menu = require('../partials/navigation/navigation.js');

var isIE = require('./ieDetection.js')();
if (isIE) {
    document.body.className += 'IE IE' + isIE;
}

(function () {
    function appendScript(conditionalScript) {
        var el = document.createElement('script');
        el.setAttribute('src', conditionalScript);
        document.head.appendChild(el);
    }

    //We wan't classlist and this is not supported in ie9
    if (!document.body.classList) {
        appendScript('//cdnjs.cloudflare.com/ajax/libs/classlist/2014.01.31/classList.min.js');
    }
})();


//Matches there are vendor prefixes and no suport in ie9
this.Element && function (ElementPrototype) {
    ElementPrototype.matchesSelector = ElementPrototype.matchesSelector ||
        ElementPrototype.mozMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        ElementPrototype.oMatchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        function (selector) {
            var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
            while (nodes[++i] && nodes[i] != node);
            return !!nodes[i];
        }
}(Element.prototype);


function increaseNumber(num) {
    return num + menu.myvar;
}

module.exports = {
    increaseNumber: increaseNumber
};


//Create a global GBIF Object
(function (global) {
    var gb = global.gb || {},
        util = {VERSION: '0.0.1'};


    //event listeners
    util.addEventListenerAll = function (selector, eventName, handler) {
        util.forEachElement(selector, function (el) {
            el.addEventListener(eventName, handler);
        })
    };

    //misc
    util.forEachElement = function (selector, fn) {
        var elements = document.querySelectorAll(selector);
        for (var i = 0; i < elements.length; i++)
            fn(elements[i], i);
    };

    //consider moving into polyfill
    util.matches = function (el, selector) {
        var p = Element.prototype;
        var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function (s) {
                return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
            };
        return f.call(el, selector);
    };


    gb.util = util;
    global.gb = gb;
})(window);


var searchToggleSelector = '.site-header__search-toggle',
    navToggleSelector = '.site-header__menu-toggle';
var toggleMenu = function () {
    document.getElementById('site-header').classList.toggle('is-active');
    document.getElementById('site-canvas').classList.toggle('hasActiveMenu');

    gb.util.forEachElement(searchToggleSelector, function (el) {
        el.classList.remove('is-active');
    });

    var searchAreaEl = document.getElementById('site-search');
    searchAreaEl.classList.remove('is-active');
};
gb.util.addEventListenerAll(navToggleSelector, 'click', toggleMenu);


function getAncestors(el, stopEl) {
    var ancestors = [];
    while ((el = el.parentElement) && el != stopEl) ancestors.push(el);
    return ancestors;
}

//collapse and expand menu items
var siteNav = document.getElementById('nav');
if (siteNav) {
    var SiteNavCategoryItems = siteNav.querySelectorAll('.is-category');
    gb.util.addEventListenerAll('.is-category>a', 'click', function (event) {
        var ancestors = getAncestors(this, siteNav),
            child, i;

        //collpase all items that are not parents
        for (i = 0; i < SiteNavCategoryItems.length; i++) {
            child = SiteNavCategoryItems[i];
            if (ancestors.indexOf(child) == -1) {
                child.classList.remove('is-expanded');
            }
        }

        if (!siteNav.classList.contains('is-expanded')) {
            //for horizontal layout. When changing from laptop to mobile this means that the first menu click is ignored
            this.parentNode.classList.add('is-expanded');
        }
        else {
            this.parentNode.classList.toggle('is-expanded');
        }
        siteNav.classList.add('is-expanded');//use for horizontal layout
        event.preventDefault(); //do not scroll to top
    });

    //collapse expand service menu
    gb.util.addEventListenerAll('.service-menu__teaser>a', 'click', function () {
        this.parentNode.parentNode.classList.toggle('is-expanded');
    });
}

//Search toggling
function toggleSearchDrawer() {
    "use strict";
    gb.util.forEachElement(searchToggleSelector, function (el) {
        el.classList.toggle('is-active');
    });

    var searchAreaEl = document.getElementById('site-search');
    searchAreaEl.classList.toggle('is-active');
    if (searchAreaEl.classList.contains('is-active')) {
        //searchAreaEl.querySelector('input').focus();
        window.setTimeout(function () {
            searchAreaEl.querySelector('input').focus();
        }, 150);
    }
    closeMenus();
}
gb.util.addEventListenerAll(searchToggleSelector, 'click', function (event) {
    toggleSearchDrawer();
    event.preventDefault();
});


//close menu when clicking outside
function closeMenus() {
    siteNav.classList.remove('is-expanded');
    if (document.getElementById('site-canvas').classList.contains('hasActiveMenu')) {
        toggleMenu();
    }
}
function closeMenusOnClickOutside(event) {
    var clickOnContent = gb.util.matches(event.target, '#main *');
    if (clickOnContent) {
        closeMenus();
    }
}
document.addEventListener('click', closeMenusOnClickOutside);
document.addEventListener('touchend', closeMenusOnClickOutside);

//Small test to add a class if it is a touch device. Will not catch all devices, so only use as a supplement. See http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
window.gb = window.gb || {};
window.gb.supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
if (window.gb.supportsTouch) {
    document.body.classList.add('isTouch'); //could be useful to have in stylesheet. for example to make targets larger on touch devices
}

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-42057855-4', 'auto');
ga('send', 'pageview');


