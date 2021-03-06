'use strict';

var angular = require('angular'),
    d3 = require('d3'),
    moment = require('moment'),
    topojson = require('topojson');

angular
    .module('portal')
    .directive('theGbifNetworkMap', theGbifNetworkMap);

/** @ngInject */
function theGbifNetworkMap(ParticipantHeads, CountryDataDigest, PublisherEndorsedBy, $q, hotkeys) {
    return {
        restrict: 'A',
        replace: 'false',
        scope: {
            region: '=',
            membershipType: '='
        },
        templateUrl: '/templates/pages/theGbifNetwork/mapContainer/mapContainer.html',
        controller: svgMap,
        controllerAs: 'vm'
    };

    function svgMap($scope) {
        var vm = this;

        // default status of the mapContainer pane, using defined laptop width.
        vm.expanded = document.getElementById('map').offsetWidth > 992;

        // membership type toggle
        vm.vpChecked = false;
        vm.acpChecked = false;

        vm.toggleParticipant = function () {
            if (!vm.vpChecked && !vm.acpChecked) {
                $scope.membershipType = 'none';
            }
            else if (vm.vpChecked && !vm.acpChecked) {
                $scope.membershipType = 'voting_participant';
            }
            else if (!vm.vpChecked && vm.acpChecked) {
                $scope.membershipType = 'associate_country_participant';
            }
            else {
                $scope.membershipType = 'active';
            }
        };

        $scope.infoPaneStatus = false;
        $scope.$watch('region', function(){
            zoomToRegion($scope.region);
        });

        $scope.$watch('membershipType', function(){
            if (centered) {
                zoomToPolygon(centered);
            }
            else {
                zoomToRegion($scope.region);
            }
        });

        hotkeys.add({
            combo: 'esc',
            description: 'Zoom out',
            callback: function (event) {
                zoomToRegion($scope.region);
                event.preventDefault();
            }
        });

        function updateCountryDigest(d) {
            $scope.infoPaneStatus = true;
            $scope.digestLoaded = false;
            // clean up all variables so un-updated values won't show
            var propertiesToDelete = ['selectedHeaderClass','heads', 'digest', 'endorsedPublisher', 'endorsedPublisherForm'];
            propertiesToDelete.forEach(function(p){
                if (vm.hasOwnProperty(p) === true) {
                    delete vm[p];
                }
            });

            var tasks = {};
            if ($scope.participantId) {
                tasks.heads = ParticipantHeads.get({participantId: $scope.participantId}).$promise;
                tasks.endorsement = PublisherEndorsedBy.get({participantId: $scope.participantId}).$promise;
            }
            if ($scope.ISO2) {
                tasks.digest = CountryDataDigest.get({iso2: $scope.ISO2}).$promise;
            }

            $q.all(tasks).then(function(results){
                if (results.hasOwnProperty('heads')) {
                    var mStart = results.heads.participantInfo.membershipStart;
                    results.heads.participantInfo.membershipStart = moment(mStart, 'MMMM YYYY').format('YYYY');
                    vm.heads = results.heads;
                }
                if (results.hasOwnProperty('endorsement') && results.endorsement.hasOwnProperty('count')) {
                    vm.endorsedPublisher = results.endorsement.count;
                }
                if (results.hasOwnProperty('digest') && results.digest.length > 0) {
                    vm.digest = results.digest[0];
                }
                $scope.digestLoaded = true;
            });

            // determine header class
            if (d.properties.hasOwnProperty('membershipType')) {
                switch (d.properties.membershipType) {
                    case 'voting_participant':
                        vm.headerClass = 'vp-background';
                        break;
                    case 'associate_country_participant':
                        vm.headerClass = 'acp-background';
                        break;
                }
            }
            else {
                vm.headerClass = 'p-background';
            }
        }

        // Draw map
        var color = {
            'voting_participant': '#4E9F37',
            'associate_country_participant': '#58BAE9'
        };

        var margin = {top: 40, right: 20, bottom: 50, left: 40},
            width = 960 - margin.left - margin.right,
            height = 480 - margin.top - margin.bottom,
            svgWidth = width + margin.left + margin.right,
            svgHeight = height + margin.top + margin.bottom,
            vpHeight = height + 10,
            vpWidth = svgWidth,
            centered,
            activePolygon = d3.select(null);

        var svg = d3.select('#map').append("svg")
            .attr('id', 'theGbifNetworkMap')
            //.attr('width', svgWidth)
            //.attr('height', svgHeight)
            .attr('viewBox', '0 0 ' + vpWidth + ' ' + vpHeight)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .classed('svg-content', true);

        var path = d3.geoPath();

        var filter = svg.append('defs')
            .append('filter')
            .attr('id', 'dropShadow')
            .attr('height', '130%');
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 3);
        filter.append("feOffset")
            .attr("dx", 2)
            .attr("dy", 2)
            .attr("result","offsetblur");
        filter.append('feComponentTransfer')
            .append('feFuncA')
            .attr('type', 'linear')
            .attr('slope', 0.2);

        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        var background = svg.append('rect');
        background.attr('class', 'map-background')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .on('click', clicked);

        var shadow = svg.append('path');

        var g = svg.append('g');

        var regionBoxes = {
            'GLOBAL': [[0,0],[width,height]],
            'ASIA': [[540,95],[870,295]],
            'AFRICA': [[420,130],[640,340]],
            'EUROPE': [[380,70],[750,90]],
            'LATIN_AMERICA': [[155,150],[395,390]],
            'NORTH_AMERICA': [[100,30],[350,150]],
            'OCEANIA': [[760,220],[1000,390]]
        };

        d3.json("/api/topojson/world-robinson", function(error, topology) {
            if (error) throw error;

            shadow.datum(topojson.merge(topology, topology.objects.tracts.geometries))
                .attr('d', path)
                .attr('class', 'map-shadow')
                .style('filter', 'url(#dropShadow)');

            g.selectAll("path")
                .data(topojson.feature(topology, topology.objects.tracts).features)
                .enter().append("path")
                .attr("d", path)
                .attr('class', 'boundary')
                .on('click', clicked);

            zoomToRegion($scope.region);
        });

        function zoomToRegion(region) {
            centered = null;
            $scope.infoPaneStatus = false;

            var bounds = regionBoxes[region],
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = 1 / Math.max(dx / width, dy / height),
                translate = [width / 2 - scale * x, height / 2 - scale * y];

            g.selectAll('path')
                .attr("fill", colorParticipant);

            g.transition()
                .duration(750)
                .style("stroke-width", 1.5 / scale + "px")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

            shadow.transition()
                .duration(750)
                .style("stroke-width", 1.5 / scale + "px")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

        }

        function zoomToPolygon(d) {
            centered = d;
            var area = Math.round(path.area(d) * 100) / 100;

            var bounds = path.bounds(d),
                dx = area > 30 ? bounds[1][0] - bounds[0][0] : bounds[1][0] - bounds[0][0] + 50,
                dy = area > 30 ? bounds[1][1] - bounds[0][1] : bounds[1][1] - bounds[0][1] + 50,
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = 0.9 / Math.max(dx / width, dy / height),
                translate = [width / 3 - scale * x, height / 1.6 - scale * y];

            g.selectAll('path')
                .attr("fill", colorParticipant);

            g.transition()
                .duration(750)
                .style("stroke-width", 1.5 / scale + "px")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

            shadow.transition()
                .duration(750)
                .style("stroke-width", 1.5 / scale + "px")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

            $scope.participantId = d.properties.id;
            $scope.ISO2 = d.properties.ISO2;
            updateCountryDigest(d);
        }

        function colorParticipant(d) {
            var p = d.properties;
            if (p.hasOwnProperty('membershipType') && p.hasOwnProperty('gbifRegion')) {
                if ($scope.region == 'GLOBAL') {
                    if ($scope.membershipType !== 'none') {
                        if ($scope.membershipType === 'active' || $scope.membershipType === p.membershipType) {
                            return color[d.properties.membershipType];
                        }
                    }
                }
                else if (p.gbifRegion == $scope.region) {
                    if ($scope.membershipType !== 'none') {
                        if ($scope.membershipType === 'active' || $scope.membershipType === p.membershipType) {
                            return color[d.properties.membershipType];
                        }
                    }
                }
            }
            return '#DFDDCF';
        }

        function clicked(d) {
            $scope.infoPaneStatus = false;

            if (typeof d === 'undefined') {
                zoomToRegion($scope.region);
                reset();
            }
            else {
                if (d && centered !== d) {
                    zoomToPolygon(d);
                    reset();
                    activePolygon = d3.select(this).classed("active-polygon", true);
                } else {
                    centered = null;
                    zoomToRegion($scope.region);
                    reset();
                }
            }
            $scope.$apply();
        }

        function reset() {
            activePolygon.classed('active-polygon', false);
            activePolygon = d3.select(null);
        }
    }
}

module.exports = theGbifNetworkMap;
