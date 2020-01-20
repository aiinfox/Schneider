angular.module('conext_gateway')
    .controller("setupController", [
        '$scope',
        '$log',
        '$interval',
        "$http",
        "$q",
        "$timeout",
        "$anchorScroll",
        "$location",
        "gatewayNetworkService",
        '$filter',
        '$sanitize'
        ,
        function (
            $scope,
            $log,
            $interval,
            $http,
            $q,
            $timeout,
            $anchorScroll,
            $location,
            gatewayNetworkService,
            $filter,
            $sanitize
        ) {

            /////////////////////////////////////////////////////////////////////////////
            //

            var vm = this;

            $scope.selectedDevice = 0;
            $scope.devicesConnected = [
                { name: 'AGS1' },
                { name: 'AGS2' },
                { name: 'SMTP' },
                { name: 'AWX' }
            ];

            $scope.items = [];
            $scope.sysvars = [];

            var varsAGS1ReceivedFromBknd = [
                { name: 'AC Generator Power', value: '/AC/GN/PWR' },
                { name: 'Battery Bank 1 Current', value: '/BAT/BANK/CUR1' },
                { name: 'Battery Bank 2 Current', value: '/BAT/BANK/CUR2' },
                { name: 'Battery Bank 3 Current', value: '/BAT/BANK/CUR3' },
                { name: 'Battery Bank 4 Current', value: '/BAT/BANK/CUR4' },
            ]
            var varsSMTPReceivedFromBknd = [
                { name: 'AC Generator Power', value: '/AC/GN/PWR' },
                { name: 'Battery Bank 1 Current', value: '/BAT/BANK/CUR1' },
                { name: 'Battery Bank 2 Current', value: '/BAT/BANK/SMTP' },
            ]
            var varsAWXReceivedFromBknd = [
                { name: 'AC Generator Power', value: '/AC/GN/PWR' },
                { name: 'Battery Bank 1 Current', value: '/BAT/BANK/CUR1' },
                { name: 'Battery Bank 2 Current', value: '/BAT/BANK/CUR2' },
                { name: 'Battery Bank 2 Current', value: '/BAT/BANK/CUR2' },
                { name: 'Battery Bank 3 Current', value: '/BAT/BANK/CUR3' },
                { name: 'Battery Bank 4 Current', value: '/BAT/BANK/CUR4' },
                { name: 'Battery Bank 2 Current', value: '/BAT/BANK/CUR2' },
                { name: 'Battery Bank 3 Current', value: '/BAT/BANK/CUR3' },
                { name: 'Battery Bank 4 Current', value: '/BAT/BANK/CUR4' },
                { name: 'Battery Bank 2 Current', value: '/BAT/BANK/CUR2' },
                { name: 'Battery Bank 3 Current', value: '/BAT/BANK/CUR3' },
                { name: 'Battery Bank 4 Current', value: '/BAT/BANK/CUR4' },
            ]
            
            $scope.allDevices = [];
            for (var _a = 0; _a < $scope.devicesConnected.length; _a++) {
                if($scope.devicesConnected[_a].name === 'AGS1') {
                    devars = [];
                    for (var _v = 0; _v < varsAGS1ReceivedFromBknd.length; _v++) {
                        devars.push(varsAGS1ReceivedFromBknd[_v]);
                    }
                    $scope.allDevices.push({device: $scope.devicesConnected[_a], devars, header: true, _dIndex: _a});
                }
                if($scope.devicesConnected[_a].name === 'AGS2') {
                    devars = [];
                    for (var _v = 0; _v < varsAGS1ReceivedFromBknd.length; _v++) {
                        devars.push(varsAGS1ReceivedFromBknd[_v]);
                    }
                    $scope.allDevices.push({device: $scope.devicesConnected[_a], devars, header: true, _dIndex: _a});
                }
                if($scope.devicesConnected[_a].name === 'SMTP') {
                    devars = [];
                    for (var _v = 0; _v < varsSMTPReceivedFromBknd.length; _v++) {
                        devars.push(varsSMTPReceivedFromBknd[_v]);
                    }
                    $scope.allDevices.push({device: $scope.devicesConnected[_a], devars, header: true, _dIndex: _a});
                }
            }
            console.log($scope.allDevices);


            $scope.allDevices.push()
            for (var _d = 0; _d < $scope.devicesConnected.length; _d++) {
                $scope.items.push({diviceInfo: $scope.devicesConnected[_d], text: $scope.devicesConnected[_d].name, header: true, _dIndex: _d});
                if($scope.devicesConnected[_d].name === 'AGS1') {
                    for (var _v = 0; _v < varsAGS1ReceivedFromBknd.length; _v++) {
                        // console.log(varsAGS1ReceivedFromBknd[_v]);
                        $scope.items.push({diviceInfo: $scope.devicesConnected[_d], text: varsAGS1ReceivedFromBknd[_v].name});
                    }
                }
                if($scope.devicesConnected[_d].name === 'AGS2') {
                    for (var _v = 0; _v < varsAGS1ReceivedFromBknd.length; _v++) {
                        // console.log(varsAGS1ReceivedFromBknd[_v]);
                        $scope.items.push({diviceInfo: $scope.devicesConnected[_d], text: varsAGS1ReceivedFromBknd[_v].name});
                    }
                }
                if($scope.devicesConnected[_d].name === 'SMTP') {
                    for (var _v = 0; _v < varsSMTPReceivedFromBknd.length; _v++) {
                        // console.log(varsSMTPReceivedFromBknd[_v]);
                        $scope.items.push({diviceInfo: $scope.devicesConnected[_d], text: varsSMTPReceivedFromBknd[_v].name});
                    }
                }
                if($scope.devicesConnected[_d].name === 'AWX') {
                    for (var _v = 0; _v < varsAWXReceivedFromBknd.length; _v++) {
                        // console.log(varsAWXReceivedFromBknd[_v]);
                        $scope.items.push({diviceInfo: $scope.devicesConnected[_d], text: varsAWXReceivedFromBknd[_v].name});
                    }
                }
            }
            console.log($scope.items);

            
            var totalEle = 0;
            // Whenever a different year is selected, scroll to that year
            $scope.$watch('selectedDevice', angular.bind($scope, function($index) {
                var currDevice = $scope.devicesConnected[$index];
                var len = 0;
                $scope.items.forEach(function(ele, i) {
                    if(ele.header) {
                        if($index === ele._dIndex) {
                            $scope.getClicked = ele;
                            $scope.getClickedPrev = $scope.items[ele];
                        }
                    }
                });

                var citrus = $scope.items.slice(0, $scope.getHeader + 1);
                console.log($scope.getClicked)
                console.log($scope.getClickedPrev)

            }));
            // The selected year should follow the year that is at the top of the scroll container
            $scope.$watch('topIndex', angular.bind($scope, function(topIndex) {
                //var scrollYear = Math.floor(topIndex / totalEle);
               // $scope.selectedDevice = scrollYear;
            }));

        }
    ]);