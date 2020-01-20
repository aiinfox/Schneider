// var gatewayApp = angular.module('conext_gateway',[]);

// Define the `networkController` controller on the `conext_gateway` module


angular.module('conext_gateway')
.controller("networkController", [ 
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
function(
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
    // Network Mode

    var vm = this;

    $scope.forms = {};
    $scope.selectNetwrkFormData = {};
    
    $scope.status = {
        isWifiOpen: true,
        isCustomHeaderOpen: false,
        isFirstDisabled: false
    };

    $scope.netwrkData = [];

    /* GET API
        $scope.netwrkData.availableOptions
    */
    $scope.netwrkData.availableOptions = [
        { "id": "1", "name": "LAN" },
        { "id": "2", "name": "WiFi" },
        { "id": "3", "name": "Auto"}
    ]
    // $scope.netwrkData.selectedOption = $scope.netwrkData.availableOptions[1].id; //Default

    


    $scope.getNetworkSettingsData = [
        { "values" : [{"name" : "/SCB/WIFI_STATION/SCAN_RESULTS_JSON","value" : "[{\"ssid\":\"ConextGateway_fe8708\",\"signal\":-17},{\"ssid\":\"ConextGateway_fe8756\",\"signal\":-36},{\"ssid\":\"ConextGateway_b07181\",\"signal\":-38},{\"ssid\":\"ConextGateway_b16f11\",\"signal\":-41},{\"ssid\":\"ConextGateway_b071b1\",\"signal\":-41},{\"ssid\":\"ConnectPeterA\",\"signal\":-47},{\"ssid\":\"ConextGateway_b0ff35\",\"signal\":-47},{\"ssid\":\"ConextGateway_b178b5\",\"signal\":-55},{\"ssid\":\"P5PT56HT93\",\"signal\":-58},{\"ssid\":\"P5PT56HT94\",\"signal\":-58},{\"ssid\":\"DeskPoT_9B9C02\",\"signal\":-64},{\"ssid\":\"P5PT56HT94\",\"signal\":-64},{\"ssid\":\"iPhone\",\"signal\":-66},{\"ssid\":\"P5PT56HT93\",\"signal\":-70},{\"ssid\":\"P5PT56HT94\",\"signal\":-70},{\"ssid\":\"P5PT56HT93\",\"signal\":-70},{\"ssid\":\"P5PT56HT94\",\"signal\":-71},{\"ssid\":\"P5PT56HT93\",\"signal\":-80}]","quality" : "G"}],"count" : 1,"OTK" : "405952f7aa735f6c7d148943113788b1502cb8218fab0e5d6132fc6d49556c65","responseTime" : 87}
    ]

    $scope.networkJsonData = [
        { "values" : [{"name" : "/SCB/NETWORK/FEC0DHCP","value" : 1,"quality" : "G"},
        {"name" : "/SCB/NETWORK/FEC0IPSHOW","value" : "10.167.90.101","quality" : "G"},
        {"name" : "/SCB/NETWORK/FEC0NETMASK","value" : "0","quality" : "G"},
        {"name" : "/SCB/NETWORK/DEFAULTGW","value" : "0","quality" : "G"},
        {"name" : "/SCB/NETWORK/DNSSERVER","value" : "0","quality" : "G"},
        {"name" : "HOSTNAME","value" : "cb-SESA126462","quality" : "G"},
        {"name" : "MAILER/ENABLE","value" : 0,"quality" : "G"},
        {"name" : "MAILER/SERVER_NAME","value" : "","quality" : "G"},
        {"name" : "MAILER/SERVERPORT","value" : 25,"quality" : "G"},
        {"name" : "MAILER/USERID","value" : "","quality" : "G"},
        {"name" : "AUTHMAIL/RECIPIENT","value" : "","quality" : "G"},
        {"name" : "FTPLOG/ENABLE","value" : 0,"quality" : "G"},
        {"name" : "FTPLOG/DEST_ADDR","value" : "","quality" : "G"},
        {"name" : "FTPLOG/USERNAME","value" : "","quality" : "G"},
        {"name" : "FTPLOG/PASSWORD","value" : "","quality" : "G"},
        {"name" : "FTPLOG/DEST_DIR","value" : "","quality" : "G"},
        {"name" : "WEBPORTAL/SYNC_ENABLE","value" : 0,"quality" : "G"},
        {"name" : "WEBPORTAL/SYNC_STRING","value" : "","quality" : "G"},
        {"name" : "WEBPORTAL/ENABLE","value" : 1,"quality" : "G"},
        {"name" : "WEBPORTAL/LAST_TRANSFER_TIME","value" : "","quality" : "G"},
        {"name" : "WEBPORTAL/STATUS","value" : 0,"quality" : "G"},
        {"name" : "WEBPORTAL/UNSENT_PACKET_COUNT","value" : "0","quality" : "G"},
        {"name" : "ADMIN/DISCLCHECK","value" : 1,"quality" : "G"},
        {"name" : "/SCB/IOT/ENABLE","value" : 1,"quality" : "G"},
        {"name" : "/SCB/IOT/ISCONNECTED","value" : 1,"quality" : "G"},
        {"name" : "/SCB/IOT/LAST_TRANSFER_TIME","value" : "2017-12-15T17:14:11-0800","quality" : "G"},
        {"name" : "/SCB/FTP/ENABLE","value" : 0,"quality" : "G"}],"count" : 27,"responseTime" : 271}

    ]

    /* GET API
        $scope.getConnections
    */

    /* GET API
        $scope.netwrkData.availableNetworks
    */

$scope.netwrkData.availableNetworks = [
        { "item": "Network 1" },
        { "item": "Network 2" },
        { "item": "Network 3" },
        { "item": "Network 4" },
        { "item": "Network 5" },
        { "item": "Network 6" }
    ]

    $scope.getWifiSettings = function(){
        gatewayNetworkService.getNetworkSettings().then(function(response){
            // console.log(response);
            $scope.netwrkData.DHCPForm.ipaddress =  response.SCB_NETWORK_TIW_STA0IP;
            $scope.netwrkData.DHCPForm.subnetmask =  response.SCB_NETWORK_TIW_STA0NETMASK;
            $scope.netwrkData.DHCPForm.networkdhcp =  response.SCB_NETWORK_TIW_STA0DHCP;
            $scope.netwrkData.DHCPForm.gateway =  response.SCB_NETWORK_TIW_STA0IPSHOW;
            $scope.netwrkData.DHCPForm.dnserver =  response.SCB_NETWORK_TIW_STA0MACADDRESS;
            $scope.netwrkData.DHCPForm.hostname =  response.SCB_NETWORK_TIW_STA0NETMASKSHOW;
        });
    }
    $scope.connCount = 0;
    $scope.getConnections = function(){
        console.log('getConnections')
        gatewayNetworkService.getConnections().then(function(response){
            var res = JSON.parse(response.SCB_WIFI_STATION_SCAN_RESULTS_JSON);
            /* Check the response data */
            if (angular.isObject(res)) {
                /* Return data */
                if(angular.isDefined($scope.netwrkData.netConnected) && angular.isDefined($scope.netwrkData.connectedIndex) && $scope.netwrkData.connectedIndex != null) {
                    var connectedSSID = $filter('filter')(res, {ssid: $scope.netwrkData.availableConnections[$scope.netwrkData.connectedIndex].ssid}, true)[0];
                    if(angular.isUndefined(connectedSSID)){
                        console.log('!!Disconnected!')
                        $scope.onDisconnect($scope.netwrkData.connectedIndex);
                        $scope.netwrkData.showDisconnectErr = true;
                    }


                    // "Replace and Insert" Logic
                    var index = res.findIndex(item => item.ssid === $scope.netwrkData.availableConnections[$scope.netwrkData.connectedIndex].ssid)
                    if(index != '0') {
                        // Replace the item by index
                        delete res[index];
                        res.unshift(connectedSSID)
                        $scope.netwrkData.connectedIndex = 0;
                    }

                }

                $scope.netwrkData.availableConnections = res;
                angular.forEach($scope.netwrkData.availableConnections, function(value, key) {
                    if(value.signal <= -80) {
                        value.signal = 1;
                    } else 
                    if(value.signal > -80 && value.signal <=-70) {
                        value.signal = 2;
                    } else {
                        value.signal = 3;
                    }
                });

                $scope.connCount++;
                if($scope.connCount < 2){
                    //check if connection is active
                    if(angular.isDefined(gatewayNetworkService.getSharedVariables('selectNetwrkFormConnected'))){
                        //var index = gatewayNetworkService.getSharedVariables('selectNetwrkFormConnected');
                        //$scope.netwrkData.connectedIndex = index;
                        //$scope.netwrkData.netConnected = true;
                    }
                }
                return res;
            }
        });
    }

    //$scope.getConnections();
    //clearGetConnInter = $interval(function() { $scope.getConnections(); },2000);
    var clearGetConnInter;
    if(angular.isDefined($scope.status.isWifiOpen)) {
        $scope.$watch('status.isWifiOpen', function (newval, oldval) {
            if(newval != oldval && newval == true){
                $scope.getWifiSettings();
                $scope.netwrkData.DHCPFormObj = {};
                $scope.netwrkData.DHCPFormObj = angular.copy($scope.forms.DHCPForm);
                $scope.watchnetworkdhcp();
                // clearGetConnInter = $interval(function() { $scope.getConnections(); },1000);
            } else if( newval == false) {
                $interval.cancel(clearGetConnInter);
                $scope.clearGetConnInter = null;
            }
        });
    }
    
    $scope.onConnect = function($index){
        $scope.toggleNetworkScreen = [];
        $scope.netwrkData.readOnlyMode = [];
        $scope.active = $scope.active == $index ? '': $index;
        $scope.toggleNetworkScreen[$index] = true;
        $scope.toggleManualScreen = false;
        $scope.currentlyOpened = $index;
        
        $timeout(function(){ // Due to Animation
            $scope.netwrkData.selectNetwrkForm = [];
            $scope.netwrkData.selectNetwrkForm.push($scope.forms.selectNetwrkForm[$index])
            $scope.netwrkData.selectNetwrkForm.ssid = $scope.netwrkData.availableConnections[$index].ssid;
        });

        if($scope.netwrkData.connectedIndex === $index && $scope.netwrkData.netConnected) {
            $scope.netwrkData.readOnlyMode[$index] = true;
        } else {
            $scope.netwrkData.readOnlyMode[$index] = false;
        }
    };

    $scope.onDisconnectOrig = function($index){
        $scope.selectNetwrkFormReset($index);
        $scope.netwrkData.netConnected = false;
        $scope.active = null;
        $scope.toggleNetworkScreen[$index] = false;
        // $scope.toggleNetworkScreen[$index] = false;
        $scope.currentlyOpened = null;
    };

    $scope.onClose = function($index){
        $scope.active = null;
        $scope.active = $scope.active == $scope.netwrkData.connectedIndex ? '': $scope.netwrkData.connectedIndex;
        $scope.selectNetwrkFormReset($index);
        $scope.toggleNetworkScreen[$index] = false;
        // $scope.toggleNetworkScreen[$index] = false;
        $scope.currentlyOpened = null;
    };

    $scope.onDisconnect = function($index){
        $scope.netwrkData.readOnlyMode[$index] = false;
        // $scope.netwrkData.selectNetwrkForm.ssid = null;
        $scope.netwrkData.netConnected = false;
        $scope.toggleNetworkScreen[$index] = false;
        gatewayNetworkService.setVariable('selectNetwrkFormConnected', null); //setting value in service variable
    }

    $scope.addManully = function($index, anchrCard) {
        $scope.toggleManualScreen = true;
        // $scope.selectNetwrkFormReset($index);
        if($scope.currentlyOpened != null) {
            $scope.onClose($index);
        }
        $timeout(function(){ $scope.gotoAnchor(anchrCard) }) // Because of Animation
    }

    $scope.selectNetwrkFormReset = function(i) {
        if(angular.isDefined($scope.forms.selectNetwrkForm[i])) {
            $scope.forms.selectNetwrkForm[i].$setPristine();
            $scope.forms.selectNetwrkForm[i].$setUntouched();
            $scope.netwrkData.selectNetwrkForm = angular.copy({});
        }
    }

    $scope.submitManualNetwrk = function(manualForm){
    if(manualForm.$valid){
        var networkOpt = manualForm.networkOpt.$viewValue;
        var networkpassword = manualForm.networkpassword.$viewValue;
        var manualFormData= { 
            'networkOpt': networkOpt, 
            'networkpassword': networkpassword
        }

        /* 
            POST Request
            data: $scope.netwrkData.DHCPFormData
        */
        //  POST Request
        gatewayNetworkService.saveManualSSIDSettings(manualFormData).then(function() {
            $scope.forms.DHCPForm.$setPristine();
            // formSuccessMessageService.show($scope, "lan_settings");
            $scope.onDisconnect($scope.netwrkData.connectedIndex);
        },
        function() {
            $scope.errorMessage.lan_settings = $filter('translate')('setup.network.save_failed');
        });


        var promise = $q(function(resolve, reject){
            console.log(manualFormData)
            $scope.netwrkData.beingManual = true;
            resolve(manualFormData);
        });
            
        promise.then(function(res){
            $timeout(function(){ // Simulate the API experience
                // $scope.onReconnect($scope.netwrkData.connectedIndex);
                $scope.netwrkData.beingManual = false;
                $scope.netwrkData.manualConnected = true;
                $scope.reset();
                $timeout(function(){
                    $scope.netwrkData.manualConnected = false;
                    $scope.toggleManualScreen = false;
                },500)
            },500);     
        });

        // Reset Form
        $scope.reset = function() {
            $scope.netwrkData.selectManualForm = angular.copy({});
            $scope.forms.selectManualForm.$setPristine();
            $scope.forms.selectManualForm.$setUntouched();
        };
    }

    }

    $scope.submitSelectNetwrk = function(i){

        // Test
        
        $scope.netwrkData.connectedIndex = i;
        $scope.netwrkData.netConnected = true;
        $interval.cancel(clearGetConnInter);
        $scope.clearGetConnInter = null;

        // Test

        var selectNetwrkForm = $scope.forms.selectNetwrkForm[i];
        var ssid, networkpassword;
        $scope.master = {};
        $scope.netwrkData.beingEval = [];
        if(selectNetwrkForm.$valid){

            if(selectNetwrkForm.ssid != undefined && selectNetwrkForm.ssid != null ){
                ssid = selectNetwrkForm.ssid.$viewValue;
                networkpassword = selectNetwrkForm.networkpassword.$viewValue;
                $scope.master = { 'ssid': ssid, 'networkpassword': networkpassword }
            }

            /* 
                POST Request
                data: $scope.netwrkData.selectNetwrkFormData
            */
            //  POST Request
            gatewayNetworkService.saveManualSSIDSettings($scope.master).then(function() {
                $scope.forms.DHCPForm.$setPristine();
                // formSuccessMessageService.show($scope, "lan_settings");
                gatewayNetworkService.setVariable('selectNetwrkFormConnected', i); //setting value in service variable
            },
            function() {
                $scope.errorMessage.lan_settings = $filter('translate')('setup.network.save_failed');
            });

            var promise = $q(function(resolve, reject){
                resolve($scope.master);
                $scope.netwrkData.beingEval[i] = true;                
                $scope.netwrkData.showDisconnectErr = false;
            });
                
            promise.then(function(res){
                $timeout(function(){ // Simulate the API experience
                    $scope.netwrkData.beingEval[i] = false;
                    $scope.netwrkData.connectedIndex = i;
                    $scope.netwrkData.netConnected = true;
                    $scope.reset();
                },1000);     
            });

            $scope.reset = function() {
                $scope.selectNetwrkFormData = angular.copy($scope.master);
                $scope.netwrkData.selectNetwrkForm.ssid = null;
                $scope.netwrkData.selectNetwrkForm.networkpassword = null;
                $scope.forms.selectNetwrkForm[i].$setPristine();
                $scope.forms.selectNetwrkForm[i].$setUntouched();
                $timeout(function(){$scope.toggleNetworkScreen[i] = false;
                    clearGetConnInter = $interval(function() { $scope.getConnections(); },2000);   
                },1000) // Simulate the API experience
            };
        }
    } 

    $scope.submitDHCPNetwrk = function(DHCPForm){
        if(DHCPForm.$valid){
            var ipaddress = DHCPForm.ipaddress.$viewValue;
            var networkdhcp = DHCPForm.networkdhcp.$viewValue;
            var subnetmask = DHCPForm.subnetmask.$viewValue;
            var gateway = DHCPForm.gateway.$viewValue;
            var dnserver = DHCPForm.dnserver.$viewValue;
            var hostname = DHCPForm.hostname.$viewValue;
            var DHCPFormData = { 
                'ipaddress': ipaddress, 
                'networkdhcp': networkdhcp ,
                'subnetmask': subnetmask ,
                'gateway': gateway ,
                'dnserver': dnserver ,
                'hostname': hostname ,
            }

            
            //  POST Request
            gatewayNetworkService.saveNetworkSettings(DHCPFormData).then(function() {
                $scope.reset();
                console.log(DHCPFormData)
                // formSuccessMessageService.show($scope, "lan_settings");
            },
            function() {
                $scope.errorMessage.lan_settings = $filter('translate')('setup.network.save_failed');
            });
            

            /* var promise = $q(function(resolve, reject){
                console.log(DHCPFormData)
                resolve(DHCPFormData);
            });
                
            promise.then(function(res){
                $scope.reset();      
            }); */

            // Reset Form
            $scope.reset = function() {
                $scope.netwrkData.DHCPFormObj = angular.copy({});
                $scope.forms.DHCPForm.$setPristine();
                $scope.forms.DHCPForm.$setUntouched();
                // $scope.toggleNetworkScreen = false;
            };
        }
    }

    $scope.watchnetworkdhcp = function(){
        if(angular.isDefined($scope.netwrkData.DHCPFormObj)){
            $scope.$watch('netwrkData.DHCP.networkdhcp', function (newval, oldval) {
                if(newval != oldval && newval == true){
                    $scope.netwrkData.DHCP.ipaddress = null;
                    $scope.netwrkData.DHCP.subnetmask = null;
                    $scope.netwrkData.DHCP.gateway = null;
                    $scope.netwrkData.DHCP.dnserver = null;
                    $scope.forms.DHCPForm.$setPristine();
                    $scope.forms.DHCPForm.$setUntouched();
                }
            });
        }
    }

    $scope.gotoAnchor = function(x) {
        var newHash = x;
        if ($location.hash() !== newHash) {
        // set the $location.hash to `newHash` and
        // $anchorScroll will automatically scroll to it
        $location.hash(x);
        } else {
        // call $anchorScroll() explicitly,
        // since $location.hash hasn't changed
        $anchorScroll();
        }
    }

}
])
.directive('input', ["$sanitize", function($sanitize) {
    return {
      restrict: 'E',
      require: '?ngModel',
      link: function (scope, element, attributes, ngModel) {
          if ((attributes.type !== "button" && attributes.name) || (attributes.type !== "submit"  && attributes.name)) {
              if(ngModel !== undefined){
  
                  ngModel.$$setOptions({
                    //   '*': '$inherit',
                      // allowInvalid: true,
                      updateOn: 'default blur keyup',
                    //   debounce: { 'default': 100, 'blur': 0, '*': 100 }
                  });
  
                  ngModel.$parsers.push(function(value){
                      var unSaniValue = value;
                      var saniValue = $sanitize(value);
                      console.log(saniValue)
                      if(unSaniValue == saniValue) {
                          ngModel.$setViewValue(unSaniValue); ngModel.$render();
                          ngModel.$formatters.push(function(value) { return unSaniValue || ''; });
                          return unSaniValue;
                      } else {
                          ngModel.$setViewValue(null); ngModel.$render()
                          return null;
                      }
                  });
  
  
  
  
  
                  /* ngModel.$$setOptions({
                      '*': '$inherit',
                      debounce: 100,
                      allowInvalid: true,
                  });
                  ngModel.$parsers.push(function(value){
                      ngModel.$setViewValue($sanitize(value));
                      ngModel.$render();
                      return $sanitize(value);
                  }); */
              }
          }
      }
    };
  }])
.config(function($mdThemingProvider) { 
$mdThemingProvider.theme('default')
    .primaryPalette('green', {
        'default': '400', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('green', {
        'default': '400' // use shade 200 for default, and keep all other shades the same
    });

});