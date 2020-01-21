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
                { name: 'SYS' },
                { name: 'AGS1' },
                // { name: 'AGS2' },
                { name: 'SMTP' },
                { name: 'AWX' }
            ];

            var sysVarsReceivedFromBknd = [
                { name: 'System AC Generator Power1', value: '/SYS/AC/GN/SYS' },
                { name: 'System AC Generator Power2', value: '/SYS/AC/GN/SYS1' },
                { name: 'System AC Generator Power3', value: '/SYS/AC/GN/SYS2' },
                { name: 'System AC Generator Power4', value: '/SYS/AC/GN/SYS3' },
                { name: 'System AC Generator Power5', value: '/SYS/AC/GN/SYS4' },
                { name: 'System AC Generator Power6', value: '/SYS/AC/GN/SYS5' },
                { name: 'System AC Generator Power7', value: '/SYS/AC/GN/SYS6' },
                { name: 'System AC Generator Power8', value: '/SYS/AC/GN/SYS7' },
            ];
            var varsAGS1ReceivedFromBknd = [
                { name: 'AC Generator Power', value: '/AC/GN/PWR' },
                { name: 'Battery Bank 1 Current', value: '/BAT/BANK/CUR1' },
                { name: 'Battery Bank 2 Current', value: '/BAT/BANK/CUR2' },
                { name: 'Battery Bank 3 Current', value: '/BAT/BANK/CUR3' },
                { name: 'Battery Bank 4 Current', value: '/BAT/BANK/CUR4' },
            ]
            var varsSMTPReceivedFromBknd = [
                { name: 'AC Generator SMTP', value: '/AC/GN/SMTP' },
                { name: 'Battery Bank 1 SMTP', value: '/BAT/BANK/SMTP' },
                { name: 'Battery Bank 2 SMTP', value: '/BAT/BANK/SMTP' },
            ]
            var varsAWXReceivedFromBknd = [
                { name: 'AC Generator AWX', value: '/AC/GN/PWR' },
                { name: 'Battery Bank 1 AWX', value: '/BAT/BANK/AWX' },
                { name: 'Battery Bank 2 AWX', value: '/BAT/BANK/AWX' },
                { name: 'Battery Bank 3 AWX', value: '/BAT/BANK/AWX' },
                { name: 'Battery Bank 4 AWX', value: '/BAT/BANK/AWX' },
                { name: 'Battery Bank 5 AWX', value: '/BAT/BANK/AWX' },
                { name: 'Battery Bank 6 AWX', value: '/BAT/BANK/AWX' },
                { name: 'Battery Bank 7 AWX', value: '/BAT/BANK/AWX' },
                { name: 'Battery Bank 8 AWX', value: '/BAT/BANK/AWX' },
                { name: 'Battery Bank 9 AWX', value: '/BAT/BANK/AWX' },
                { name: 'Battery Bank 10 AWX', value: '/BAT/BANK/AWX' },
                { name: 'Battery Bank 11 AWX', value: '/BAT/BANK/AWX' },
            ]
            
            $scope.allDevices = [];
            for (var _a = 0; _a < $scope.devicesConnected.length; _a++) {
                if($scope.devicesConnected[_a].name === 'SYS') {
                    var sysvarz = [];
                    for (var _v = 0; _v < sysVarsReceivedFromBknd.length; _v++) {
                        sysvarz.push(sysVarsReceivedFromBknd[_v]);
                    }
                    $scope.allDevices.push({device: { name: 'SysVars' }, devars: sysvarz, header: true, _dIndex: null});
                }
                if($scope.devicesConnected[_a].name === 'AGS1') {
                    var devars = [];
                    for (var _v = 0; _v < varsAGS1ReceivedFromBknd.length; _v++) {
                        devars.push(varsAGS1ReceivedFromBknd[_v]);
                    }
                    $scope.allDevices.push({device: $scope.devicesConnected[_a], devars, header: true, _dIndex: _a});
                }
                /* if($scope.devicesConnected[_a].name === 'AGS2') {
                    var devars = [];
                    for (var _v = 0; _v < varsAGS1ReceivedFromBknd.length; _v++) {
                        devars.push(varsAGS1ReceivedFromBknd[_v]);
                    }
                    $scope.allDevices.push({device: $scope.devicesConnected[_a], devars, header: true, _dIndex: _a});
                } */
                if($scope.devicesConnected[_a].name === 'SMTP') {
                    var devars = [];
                    for (var _v = 0; _v < varsSMTPReceivedFromBknd.length; _v++) {
                        devars.push(varsSMTPReceivedFromBknd[_v]);
                    }
                    $scope.allDevices.push({device: $scope.devicesConnected[_a], devars, header: true, _dIndex: _a});
                }
                if($scope.devicesConnected[_a].name === 'AWX') {
                    var devars = [];
                    for (var _v = 0; _v < varsAWXReceivedFromBknd.length; _v++) {
                        devars.push(varsAWXReceivedFromBknd[_v]);
                    }
                    $scope.allDevices.push({device: $scope.devicesConnected[_a], devars, header: true, _dIndex: _a});
                }
            }

            // console.log($scope.allDevices);

            // Flatten Array
            $scope.items = [];
            for (var _d = 0; _d < $scope.allDevices.length; _d++) {
                $scope.items.push({
                    name: $scope.allDevices[_d].device.name,
                    header: $scope.allDevices[_d].header,
                    _dIndex: $scope.allDevices[_d]._dIndex
                });
                for (var _vr = 0; _vr < $scope.allDevices[_d].devars.length; _vr++) {
                    $scope.items.push(
                        $scope.allDevices[_d].devars[_vr]
                    );
                }
            }

            
            // Whenever a different Device is selected, scroll to that Device
            $scope.$watch('selectedDevice', angular.bind($scope, function($index) {
                var eleDex = 0;
                $scope.items.forEach(function(ele, i) {
                    if(ele.header) {
                        if($index === ele._dIndex) {
                            eleDex = $scope.items.indexOf(ele);
                        }
                    }
                });
                var deviceScroll = $index;
                if(deviceScroll !== $scope.topIndex) {
                    $scope.topIndex = eleDex;
                }
            }));

            // The selected Device should follow the Device that is at the top of the scroll container
            $scope.$watch('topIndex', angular.bind($scope, function(topIndex) {
                if(angular.isDefined($scope.items[topIndex].header)) {
                    var scrollDevice = $scope.items[topIndex]._dIndex;
                    $scope.selectedDevice = scrollDevice;
                }
            }));

            $scope.selectedItems = [];
            $scope.allConnectedDevices = [];
            $scope.itemClicked = function(ele, item, i) {
                if(!$scope.items[i].hasOwnProperty('selected') || $scope.items[i]['selected'] === false) {
                    $scope.items[i]['selected'] = true;
                    $scope.selectedItems.push(item);


                    $scope.allDevices.forEach(function(ele, _indx){
                        var dvars = [];
                        ele.devars.forEach(function(ele1){
                            if(ele1.name === $scope.items[i].name) {
                                dvars.push($scope.items[i].name);
                                var filtrdArray = filteredArray($scope.allConnectedDevices, ele.device);
                                if(filtrdArray.length === 0) {
                                    $scope.allConnectedDevices.push({name: ele.device.name, dvars: []});
                                }
                                $scope.allConnectedDevices.forEach(function(elem){
                                    if(elem.name === ele.device.name) {
                                        elem.dvars.push(dvars);
                                    }
                                });
                                console.log($scope.allConnectedDevices)
                            }
                        });
                    });


                } else {
                    $scope.items[i]['selected'] = false;
                    $scope.allConnectedDevices.forEach(function(elem, _i){
                        elem.dvars.forEach(function(ele1){
                            if(ele1[0] === $scope.items[i].name) {
                                $scope.allConnectedDevices[_i].dvars.indexOf(ele1) !== -1 && 
                                $scope.allConnectedDevices[_i].dvars.splice($scope.allConnectedDevices[_i].dvars.indexOf(ele1), 1);
                            }
                        });
                    });
                    // console.log($scope.allConnectedDevices);

                    var filtrdArray = filteredArray($scope.selectedItems, $scope.items[i]);
                    $scope.selectedItems.indexOf(filtrdArray[0]) !== -1 && $scope.selectedItems.splice($scope.selectedItems.indexOf(filtrdArray[0]), 1);

                }
                // console.log($scope.selectedItems);
            }

            
             function filteredArray(arr, itmToFltr) { 
                return arr.filter(function(value, index, arr){
                    return value.name === itmToFltr.name;
                });
            }

        }
    ]);