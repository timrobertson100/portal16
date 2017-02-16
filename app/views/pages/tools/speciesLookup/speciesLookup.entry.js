'use strict';

require('../../../components/droppable/droppable.directive');

var async = require('async');
var Converter = require("csvtojson").Converter;

angular
    .module('portal')
    .controller('speciesLookupCtrl', speciesLookupCtrl);

/** @ngInject */
function speciesLookupCtrl($http, $scope, hotkeys, SpeciesMatch, Species, speciesConstants) {
    var vm = this;
    vm.species = undefined;
    vm.state = {};
    vm.pagination = {
        currentPage: 1,
        pageSize: 20
    };
    vm.itemToEdit = undefined;
    vm.error;

    window.onbeforeunload = function(e) {
        if (vm.species && vm.species.length > 0) {
            var dialogText = 'By leaving the page you loose your data.';
            e.returnValue = dialogText;
            return dialogText;
        }
    };

    vm.handleDrop = function (e) {
        var file = e.dataTransfer.files[0];
        parseFile(file);
    };

    $scope.handleFiles = function (files) {
        parseFile(files[0]);
    };

    var isValidFile = function (file) {
        return !!file && (file.type == '' || file.type == 'text/csv' || file.type == 'text/plain' || file.name.indexOf('.csv') > 1);
    };

    function getLowerKeysObj(obj) {
        var key, keys = Object.keys(obj);
        var n = keys.length;
        var newobj={};
        while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = obj[key];
        }
        return newobj;
    }

    var parseFile = function (file) {
        vm.invalidFileFormat = false;
        if (!isValidFile(file)) {
            vm.invalidFileFormat = true;
            vm.error = 'Invalid file format - the file must be a csv file and all rows must have a scientificName column';
            return;
        }
        var reader = new FileReader();
        reader.onload = function () {
            var converter = new Converter({
                delimiter:  [',', ';', '$', '|', '\t']
            });
            var csvString = reader.result;
            vm.error = undefined;
            converter.fromString(csvString, function (err, result) {
                if (err) {
                    vm.error = err;
                } else if(result.length == 0) {
                    vm.error = 'There are no rows in the data.';
                } else {
                //make all keys lower to avoid casing issues
                    result = result.map(function (e) {
                        return getLowerKeysObj(e);
                    });
                    if (result.every(function(e){return e.scientificname})) {
                        result.forEach(function (e) {
                            e.originalId = e.id;
                            e.originalName = e.scientificname;
                            e.preferedKingdom = e.kingdom;
                            e.scientificName = undefined;
                            e.kingdom = undefined;
                        });
                        vm.species = result;
                    } else {
                        vm.error = 'all rows must have a scientificName - see example file for the required format';
                    }
                }
                $scope.$apply();
            });
        };
        reader.readAsText(file);
    };

    vm.defaultKingdom = undefined;
    vm.setDefaultKingdom = function (kingdom) {
        if (vm.defaultKingdom == kingdom) {
            vm.defaultKingdom = undefined
        }
        else {
            vm.defaultKingdom = kingdom;
        }
    };

    vm.normalizeAll = function () {
        vm.pagination.currentPage = 1;
        vm.processing = true;
        lookupNames();
    };

    function lookupName(item, callback) {
        var query = {
            verbose: true,
            name: item.originalName,
            kingdom: item.preferedKingdom || vm.defaultKingdom
        };
        SpeciesMatch.query(query, function (data) {
            item.match = data;
            vm.setItem(item, data);
            callback();
        }, function () {
            callback('match went wrong');
        });
    }

    function lookupNames() {
        async.eachLimit(vm.species, 10, lookupName, function (err) {
            if (err) {
                //TODO inform the user that not everything could be matched
            }
        });
    }

    vm.setItem = function (item, selected) {
        var fields = ['scientificName', 'key', 'matchType', 'confidence', 'status', 'rank', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'kingdomKey', 'phylumKey', 'classKey', 'orderKey', 'familyKey', 'genusKey', 'speciesKey', 'accepted', 'acceptedKey'];
        fields.forEach(function (field) {
            item[field] = selected[field];
        });
        if (selected.taxonomicStatus) {
            item.status = selected.taxonomicStatus;
        }
        if (selected.usageKey) {
            item.key = selected.usageKey;
        }
        if (item.userEdited) {
            item.matchType = 'EDITED';
        }
    };

    //vm.itemToEdit = undefined;

    vm.selectAlternative = function (item, selected) {
        item.userEdited = true;
        vm.setItem(item, selected);
        vm.itemToEdit = undefined;
    };

    vm.discard = function (item) {
        item.userEdited = true;
        vm.setItem(item, {});
        vm.itemToEdit = undefined;
    };

    vm.getSuggestions = function (val) {
        return $http.get('//api.gbif.org/v1/species/suggest', {
            params: {
                q: val,
                datasetKey: speciesConstants.backboneKey,
                limit: 10
            }
        }).then(function (response) {
            return response.data;
        });
    };


    vm.typeaheadSelect = function (item) { //  model, label, event
        vm.itemToEdit.userEdited = true;
        Species.get({id: item.key}, function (data) {
            vm.setItem(vm.itemToEdit, data);
            vm.itemToEdit = undefined;
            vm.selectedSuggestion = undefined
        });
    };

    vm.generateCsv = function () {
        var fields = ['originalId', 'originalName', 'scientificName', 'key', 'matchType', 'confidence', 'status', 'rank', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
        var csvContent = '';

        //write column names
        fields.forEach(function (field, index) {
            csvContent += field;
            if (index < fields.length - 1) {
                csvContent += ',';
            }
        });
        csvContent += '\n';

        //write rows
        vm.species.forEach(function (e) {
            //write row
            if (!e.key && vm.exclude) {
                return;
            }
            fields.forEach(function (field, index) {
                csvContent += e[field] ? '"' + e[field] + '"' : '';
                if (index < fields.length - 1) {
                    csvContent += ',';
                }
            });
            csvContent += '\n';
        });
        //add string to href as data uri making it downloadable
        document.getElementById('speciesLookup_generatedCsv').href = 'data:application/octet-stream,' + encodeURI(csvContent);
        vm.download = true;
    };

    vm.getMatchTypeClass = function (matchType) {
        if (matchType == 'FUZZY') {
            return 'badge badge--warning';
        }
        if (matchType == 'NONE') {
            return 'badge badge--error';
        }
        if (matchType == 'HIGHERRANK') {
            return 'badge badge--warning';
        }
        if (matchType == 'EXACT') {
            return 'badge badge--approved';
        }
        if (matchType == 'EDITED') {
            return 'badge badge--info';
        }
    };

    vm.getStatusClass = function (status) {
        if (status == ['ACCEPTED']) {
            return '';
        }
        return 'badge badge--warning';
    };

    hotkeys.add({
        combo: 'alt+right',
        description: 'Next',
        callback: function () {
            if (vm.pagination.currentPage * vm.pagination.pageSize < vm.species.length) {
                vm.pagination.currentPage += 1;
            }
        }
    });
    hotkeys.add({
        combo: 'alt+left',
        description: 'Previous',
        callback: function () {
            if (vm.pagination.currentPage > 1) {
                vm.pagination.currentPage -= 1;
            }
        }
    });

    hotkeys.add({
        combo: 'esc',
        description: 'close',
        allowIn: ['INPUT'],
        callback: function () {
            vm.itemToEdit = undefined;
        }
    });

    vm.countSpecies = function () {
        var keysOnly = vm.species.filter(function (e) {
            return !!e.key
        }).map(function (e) {
            return e.key;
        });
        var namesOnly = vm.species.filter(function (e) {
            return !!e.key
        }).map(function (e) {
            return e.scientificName;
        });
        $http.post('/api/tools/species-count/count', {
            taxonKeys: keysOnly,
            names: namesOnly,
            countryCode: 'DK'
        }, {}).then(function (response) {
            vm.referenceId = response.data.referenceId;
        }, function () {
        });
    };

    // vm.normalizeAll();
}

module.exports = speciesLookupCtrl;
