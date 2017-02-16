'use strict';

// Require the directive here as this has its own build task.
// This also avoid the directive being built into the main javascript.
require('../../../components/droppable/droppable.directive');

var _ = require('lodash'),
    devApiUrl = '//localhost:8080'; // //api.gbif-dev.org/v1/validator/

angular
    .module('portal')
    .controller('dataValidatorCtrl', dataValidatorCtrl);

/** @ngInject */
function dataValidatorCtrl($http, $window) {
    var vm = this;

    vm.resourceToValidate = {};

    vm.issueSampleExpanded = {};
    vm.issuesMap = {};

    vm.handleUploadFile = function(params) {
        var formData = new FormData();
        formData.append('file', params.files[0]);

        $http({
            url: devApiUrl + '/jobserver/submit',
            method: "POST",
            data: formData,
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function (data, status) {
            handleValidationSubmitResponse(data, status);
        }).error(function (data) {
            handleWSError(data);
        });
    };

    vm.handleDrop = function (e) {
        var formData = new FormData();
        formData.append('file', e.dataTransfer.files[0]);
        $http({
            url: devApiUrl + '/jobserver/submit',
            method: "POST",
            data: formData,
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function (data, status) {
            handleValidationSubmitResponse(data, status);
        }).error(function (data) {
            handleWSError(data);
        });
    };

    vm.handleFileUrl = function(params) {
        var postParams = {params: {}};
        _.merge(postParams.params, params);

        var url = devApiUrl + '/jobserver/submiturl';
        $http.post(url, null, postParams)
            .success(function (data, status) {
                handleValidationSubmitResponse(data, status);
            })
            .error(function (data) {
                handleWSError(data);
            });
    };

    vm.getValidationResults = function(jobId) {

        loadEvaluationCategory();

        $http({
            url: devApiUrl + '/jobserver/status/' + jobId
        }).success(function (data) {
            handleValidationResult(data);
        }).error(function () { //data, status, headers, config
            // TODO handle error things
        });
    };

    function loadEvaluationCategory() {
        $http({
            url: devApiUrl + '/enumeration/simple/EvaluationCategory'
        }).success(function (data) {
            vm.evaluationCategory = data;
        }).error(function () { //data, status, headers, config
            // TODO handle error things
        });
    }

    function handleValidationSubmitResponse(data) {
        //TODO validate that there is a jobId and if not display error message
        $window.location.href = '/tools/data-validator/' + data.jobId;
    }

    function handleValidationResult(responseData) {

        vm.jobId = responseData.jobId;
        vm.jobStatus = responseData.status;

        var data = responseData.result;

        vm.validationResults = {
            summary: _.omit(data, 'results'),
            results: []
        };

        angular.forEach(data.results, function(resourceResult) {
            var vmResourceResult = _.omit(resourceResult, 'issues');
            //the order of the evaluationCategory is important
            vmResourceResult.issues = _.orderBy(resourceResult.issues, function (value) {return _.indexOf(vm.evaluationCategory, value.issueCategory)});

            //prepare terms frequency
            vmResourceResult.termsFrequency = {};
            angular.forEach(resourceResult.termsFrequency, function(value, key) {
                var termFreqData = {};
                termFreqData.count = value;
                termFreqData.percentage = Math.round((value/ resourceResult.numberOfLines)*100);
                this[key] = termFreqData;
            }, vmResourceResult.termsFrequency);

            vmResourceResult.issuesMap = {};
            var issueBlock, issueSample;
            angular.forEach(resourceResult.issues, function(value) {
                this[value.issueCategory] = this[value.issueCategory] || [];

                //rewrite sample to exclude redundant information (e.g. evaluationType)
                //TODO to the same thing for issues with non sample
                issueBlock = _.omit(value, 'sample');
                angular.forEach(value.sample, function(sample) {
                    this.sample = this.sample || [];
                    issueSample = {};
                    issueSample.issueData = _.omit(sample, ['evaluationType', 'relatedData']);
                    issueSample.relatedData = sample.relatedData;
                    this.sample.push(issueSample);
                }, issueBlock);

                this[value.issueCategory].push(issueBlock);
            }, vmResourceResult.issuesMap);

            this.push(vmResourceResult);
        }, vm.validationResults.results);
    }

    function handleWSError(data) {
        vm.validationResults = data;
    }
}

module.exports = dataValidatorCtrl;
