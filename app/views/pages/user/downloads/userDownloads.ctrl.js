'use strict';

var angular = require('angular');

angular
    .module('portal')
    .controller('userDownloadsCtrl', userDownloadsCtrl);


/** @ngInject */
function userDownloadsCtrl($state, $rootScope, $http, NAV_EVENTS, endpoints, $stateParams, User) {
    var vm = this;
    User.loadActiveUser();

    function updatePaginationCounts() {
        vm.offset = parseInt($stateParams.offset) || 0;
        vm.maxSize = 5;
        vm.limit = parseInt($stateParams.limit) || 20;
        vm.currentPage = Math.floor(vm.offset / vm.limit) + 1;
    }

    updatePaginationCounts();

    vm.getDownloads = function () {
        vm.loadingDownloads = true;
        vm.failedToLoadDownloads = false;
        var downloads = $http.get(endpoints.userDownloads, {params: {limit: vm.limit, offset: vm.offset, locale: $stateParams.locale}});
        downloads.then(function (response) {
            vm.loadingDownloads = false;
            vm.downloads = response.data;
        }, function (err) {
            vm.loadingDownloads = false;
            vm.failedToLoadDownloads = true;
        });
    };
    vm.getDownloads();

    vm.pageChanged = function () {
        vm.offset = (vm.currentPage - 1) * vm.limit;
        $state.go($state.current, {limit: vm.limit, offset: vm.offset}, {inherit: true, notify: true, reload: true});
    };

    vm.openHelpdesk = function () {
        $rootScope.$broadcast(NAV_EVENTS.toggleFeedback, {toggle: true, type: 'QUESTION'});
    }
}

module.exports = userDownloadsCtrl;
