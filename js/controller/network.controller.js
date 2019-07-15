// var gatewayApp = angular.module('conext_gateway',[]);

// Define the `networkController` controller on the `conext_gateway` module


angular.module('conext_gateway').controller("networkController", [ 
    '$scope', 
    '$log', 
    '$interval', 
    "$http", 
    "$q", 
    "$timeout", 
    "$anchorScroll", 
    "$location", 
    "gatewayNetworkService",
    '$filter'
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
    $filter
) {

    /////////////////////////////////////////////////////////////////////////////
    //
    // Network Mode

    $scope.forms = { };
    $scope.netwrkData = [];
    $scope.currentlyOpened = null;
    $scope.selectNetwrkFormData = {};
    $scope.netwrkData.DHCPForm = [];
    $scope.netwrkData.DHCPFormLan = [];
    
    $scope.status = {
        isFirstOpen: true,
        isCustomHeaderOpen: false,
        isFirstDisabled: false
    };

    $scope.queryWifiSettings = function() {
      var deferred = $q.defer();
          gatewayNetworkService.getConnections().then(function(response){
              console.log(response)
            var res = JSON.parse(response.SCB_WIFI_STATION_SCAN_RESULTS_JSON);
            $scope.netwrkData.connectedSSID = response.SCB_WIFI_STATION_SSID;
            $scope.netwrkData.ssidStatus = response.SCB_WIFI_STATION_STATUS;
            /* Check the response data */
            if (angular.isObject(res)) {
              $scope.netwrkData.availableConnections = res;
              angular.forEach($scope.netwrkData.availableConnections, function(value, key) {
                if(value.signal <= -80) 
                  value.signal = 1;
                else if(value.signal > -80 && value.signal <= -70)
                  value.signal = 2;
                else
                  value.signal = 3;
              });
              deferred.resolve();
            }
          });
          return deferred.promise;
    }

    $scope.getNetworkMode = function() {
      gatewayNetworkService.getNetworkMode().then(function(response){
          $scope.netwrkData.connectedMode = response.SCB_NETWORK_ACTIVE;
          if( $scope.netwrkData.connectedMode == "WIFI") {
            $scope.netwrkData.isLanConnected = false;
            $scope.netwrkData.isLanMode = false;
          }
          else {
            $scope.netwrkData.isLanConnected = true;
            $scope.netwrkData.isLanMode = true;
          }
      });
    }

    $scope.showTick = function() {
      var defered = $q.defer();
      gatewayNetworkService.getNetworkMode().then(function(response){
          console.log(response)
        $scope.netwrkData.connectedMode = response.SCB_NETWORK_ACTIVE;
        if( $scope.netwrkData.connectedMode == "WIFI") {
          $scope.netwrkData.isLanConnected = false;
          $scope.netwrkData.isLanMode = false;

        $scope.queryWifiSettings().then(function(res){
            $scope.indexOfSSID();
            $scope.netwrkData.isLanMode = false;
            $scope.netwrkData.isLanConnected = false;
            $scope.netwrkData.readOnlyLanMode = false;
            defered.resolve();
          });
        }
        else {
          $scope.queryWifiSettings().then(function(res){
            defered.resolve();
          });
          $scope.netwrkData.isLanConnected = true;
          $scope.netwrkData.isLanMode = true;
          $scope.netwrkData.readOnlyLanMode = true;
          $scope.netwrkData.netConnected = true;
        }
      });
      return defered.promise;

  }

    $scope.indexOfSSID = function() {
      var indx=0;
      angular.forEach($scope.netwrkData.availableConnections, function(value, key) {
        if(value.ssid === $scope.netwrkData.connectedSSID && $scope.netwrkData.ssidStatus == "COMPLETED"){
          $scope.netwrkData.connectedIndex = key;
          $scope.netwrkData.netConnected = true;
          return;
        }
        indx++;
      });
    }

    $scope.setNetworkMode = function(req) {
      var deferred = $q.defer();
      $scope.showTick().then(function(){
            deferred.resolve();
      });
      return deferred.promise;
    }

    $scope.getWifiDHCP = function() {
      gatewayNetworkService.getWifiNetworkSettings().then(function(response){
        if(response.SCB_NETWORK_TIW_STA0DHCP == 1){
          $scope.netwrkData.DHCPForm.ipaddress =  response.SCB_NETWORK_TIW_STA0IPSHOW;
          $scope.netwrkData.DHCPForm.subnetmask =  response.SCB_NETWORK_TIW_STA0NETMASKSHOW;
          $scope.netwrkData.DHCPForm.networkdhcp = true;
        }
        else{
          $scope.netwrkData.DHCPForm.ipaddress =  response.SCB_NETWORK_TIW_STA0IP;
          $scope.netwrkData.DHCPForm.subnetmask =  response.SCB_NETWORK_TIW_STA0NETMASK;
          $scope.netwrkData.DHCPForm.networkdhcp = false;
        }
        
        $scope.netwrkData.DHCPForm.gateway =  response.ETH0_TCPIP_DHCP_GWAY;
        $scope.netwrkData.DHCPForm.dnserver =  response.SCB_NETWORK_DNSSERVER;
        $scope.netwrkData.DHCPForm.hostname =  response.HOSTNAME;
      });
    }

    $scope.getLanDHCP = function() {
      gatewayNetworkService.getLanNetworkSettings().then(function(response){
        if(response.SCB_NETWORK_DM0DHCP == 1){
            $scope.netwrkData.DHCPFormLan.ipaddress =  response.SCB_NETWORK_DM0IPSHOW;
            $scope.netwrkData.DHCPFormLan.subnetmask =  response.SCB_NETWORK_DM0NETMASKSHOW;
            $scope.netwrkData.DHCPFormLan.networkdhcp = true;
        }
        else {
          $scope.netwrkData.DHCPFormLan.ipaddress =  response.SCB_NETWORK_DM0IP;
          $scope.netwrkData.DHCPFormLan.subnetmask =  response.SCB_NETWORK_DM0NETMASK;
          $scope.netwrkData.DHCPFormLan.networkdhcp = false;
        }
        
        $scope.netwrkData.DHCPFormLan.gateway =  response.ETH0_TCPIP_DHCP_GWAY;
        $scope.netwrkData.DHCPFormLan.dnserver =  response.SCB_NETWORK_DNSSERVER;
        $scope.netwrkData.DHCPFormLan.hostname =  response.HOSTNAME;
      });
    }

    $scope.checkIEEE = function(){
      gatewayNetworkService.getIEEEStatus().then(function(res){
        $scope.ieee_settings.SCB_2030_STATUS = res.SCB_2030_STATUS;
      })
    };

    /* Start scanning the available connections every minute*/
    $scope.setNetworkScan = function() {
      gatewayNetworkService.setScan().then(function(){

        $scope.showTick().then(function(){
          $interval(function(){
              $scope.showTick();
          }, 60000);
       
        });
      });
    }

    $scope.toggleDHCP = function(data){
      switch(data){
        case 'LAN':
          {
            $scope.netwrkData.isLanConnected = true;
            break;
          }
        case 'WIFI': 
        {
          $scope.netwrkData.isLanConnected = false;
          break;
        }
      }
    }

    $scope.checkIEEEStatus = function(){ 
        $interval(function() {
          $scope.checkIEEE();
        },60000);
    }

    $scope.onConnect = function($index){
        $scope.toggleNetworkScreen = [];
        $scope.netwrkData.readOnlyMode = [];
        $scope.active = $scope.active == $index ? '': $index;
        $scope.toggleNetworkScreen[$index] = true;
        $scope.toggleManualScreen = false;
        $scope.currentlyOpened = $index;
        $scope.netwrkData.isLanConnected = false;
        
        $timeout(function(){ // Due to Animation
            $scope.netwrkData.selectNetwrkForm = [];
            $scope.netwrkData.selectNetwrkForm.push($scope.forms.selectNetwrkForm[$index])
            $scope.netwrkData.selectNetwrkForm.ssid = $scope.netwrkData.availableConnections[$index].ssid;
        });

        if($scope.netwrkData.connectedIndex === $index && $scope.netwrkData.selectNetwrkForm && $scope.netwrkData.netConnected) {
            $scope.netwrkData.readOnlyMode[$index] = true;
        } else {
            $scope.netwrkData.readOnlyMode[$index] = false;
        }
    };

    $scope.onLanConnect = function() {
      $scope.netwrkData.toggleLanScreen = true;
      $scope.netwrkData.isLanConnected = true;
      $scope.active = '';
      
      $timeout(function(){ // Due to Animation
          $scope.netwrkData.selectLanNetwrkForm = [];
          $scope.netwrkData.selectLanNetwrkForm.push($scope.forms.selectLanNetwrkForm);
      });
    }

    $scope.onDisconnect = function($index){
      $scope.selectNetwrkFormReset($index);
      $scope.netwrkData.netConnected = false;
      $scope.active = null;
      $scope.toggleNetworkScreen[$index] = true;
      $scope.toggleNetworkScreen[$index] = false;
      $scope.currentlyOpened = null;
  };

  $scope.onClose = function($index){
      $scope.active = null;
      $scope.active = $scope.active == $scope.netwrkData.connectedIndex ? '': $scope.netwrkData.connectedIndex;
      $scope.selectNetwrkFormReset($index);
      $scope.toggleNetworkScreen[$index] = true;
      $scope.toggleNetworkScreen[$index] = false;
      $scope.currentlyOpened = null;
  };

  $scope.onLanClose = function() {
    $scope.active = null;
    $scope.active = $scope.active == $scope.netwrkData.connectedIndex ? '': $scope.netwrkData.connectedIndex;
    $scope.currentlyOpened = null;
    $scope.netwrkData.toggleLanScreen = false;
  }

  $scope.onReconnect = function($index){
      $scope.netwrkData.readOnlyMode[$index] = false;
      $scope.netwrkData.netConnected = false;
  }

  $scope.onLanReconnect = function() {
    $scope.netwrkData.netConnected = false;
  }

  $scope.addManully = function($index, anchrCard) {
      $scope.toggleManualScreen = true;
      if($scope.currentlyOpened!=null) {
        $scope.onClose($index);
      }
      $timeout(function(){ $scope.gotoAnchor(anchrCard) }) // Due to Animation
  }

  $scope.selectNetwrkFormReset = function(i) {
    $scope.forms.selectNetwrkForm[i].$setPristine();
    $scope.forms.selectNetwrkForm[i].$setUntouched();
    $scope.netwrkData.selectNetwrkForm = angular.copy({});
}

$scope.submitManualNetwrk = function(manualForm){
  if(manualForm.$valid){
      var networkOpt = manualForm.networkOpt.$viewValue;
      var networkpassword = manualForm.networkpassword.$viewValue;
      var manualFormData= { 
          'networkOpt': networkOpt, 
          'networkpassword': networkpassword
      }

      var defered = $q.defer();
      $scope.netwrkData.beingManual = true;
      defered.resolve(manualFormData);
      
          $timeout(function(){ // Simulate the API experience
              gatewayNetworkService.saveManualSSIDSettings(manualFormData).then(function() {

                $scope.setNetworkMode("WiFi").then(function(){
                  $scope.netwrkData.beingManual = false;
                  $scope.netwrkData.manualConnected = true;

                  $scope.reset();
                  $timeout(function(){
                      $scope.netwrkData.manualConnected = false;
                      $scope.toggleManualScreen = false;
                  },500)

                });
            });
          },500);

      // Reset Form
      $scope.reset = function() {
          $scope.netwrkData.selectManualForm = angular.copy({});
          $scope.forms.selectManualForm.$setPristine();
          $scope.forms.selectManualForm.$setUntouched();
      };
  }

} 

$scope.submitLanNetwork = function(data) {
  var selectNetwrkForm = $scope.forms.selectLanNetwrkForm;
  var ssid, networkpassword;
  $scope.master = {};
  $scope.netwrkData.beingEvalLan = {};
  if(selectNetwrkForm.$valid){

    var defered = $q.defer();
    defered.resolve($scope.master);
    $scope.netwrkData.beingEvalLan = true;

    $timeout(function(){ // Simulate the API experience
              if(data == 'Disconnect'){
                  $scope.setNetworkMode("WiFi").then(function(){
                    $scope.netwrkData.beingEvalLan = false;
                    $scope.netwrkData.netConnected = true;
                  });
              }
              else {
                $scope.setNetworkMode("LAN").then(function(){
                      $scope.netwrkData.beingEvalLan = false;
                      $scope.netwrkData.connectedIndex = {};
                      $scope.netwrkData.netConnected = true;
                 });
              }
          
            $scope.reset();
      },1000);     


      $scope.reset = function() {
          $scope.selectLanNetwrkFormData = angular.copy($scope.master);
          $scope.forms.selectLanNetwrkForm.$setPristine();
          $scope.forms.selectLanNetwrkForm.$setUntouched();
          $timeout(function(){$scope.toggleNetworkScreen = false},1000) // Simulate the API experience
      };
  }
}

$scope.submitSelectNetwrk = function(i){

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

        var defered = $q.defer();
        defered.resolve($scope.master);
        $scope.netwrkData.beingEval[i] = true;

            $timeout(function(){ 
              gatewayNetworkService.saveSelectSSIDSettings($scope.master).then(function() {
                $scope.setNetworkMode("WIFI").then(function(){
                  $scope.netwrkData.beingEval[i] = false;
                  $scope.reset();
                });
              });
            },1000);     


        $scope.reset = function() {
            $scope.selectNetwrkFormData = angular.copy($scope.master);
            $scope.netwrkData.selectNetwrkForm.ssid = null;
            $scope.netwrkData.selectNetwrkForm.networkpassword = null;
            $scope.forms.selectNetwrkForm[i].$setPristine();
            $scope.forms.selectNetwrkForm[i].$setUntouched();
            $timeout(function(){$scope.toggleNetworkScreen = false},1000) // Simulate the API experience
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
      gatewayNetworkService.saveDHCPWifi(DHCPFormData).then(function() {
        $scope.forms.DHCPForm.$setPristine();
      },
      function() {
       // TODO: $scope.errorMessage.lan_settings = $filter('translate')('setup.network.save_failed');
      });

      var defered = $q.defer();
      defered.resolve(DHCPFormData);
      $scope.reset();      

      // Reset Form
      $scope.reset = function() {
          $scope.netwrkData.DHCPForm = angular.copy({});
          $scope.forms.DHCPForm.$setPristine();
          $scope.forms.DHCPForm.$setUntouched();
      };
  }
}

$scope.submitLanDHCPNetwrk = function(DHCPFormLan){
  if(DHCPFormLan.$valid){
      var ipaddress = DHCPFormLan.ipaddress.$viewValue;
      var networkdhcp = DHCPFormLan.networkdhcp.$viewValue;
      var subnetmask = DHCPFormLan.subnetmask.$viewValue;
      var gateway = DHCPFormLan.gateway.$viewValue;
      var dnserver = DHCPFormLan.dnserver.$viewValue;
      var hostname = DHCPFormLan.hostname.$viewValue;
      var DHCPFormData = { 
          'ipaddress': ipaddress, 
          'networkdhcp': networkdhcp ,
          'subnetmask': subnetmask ,
          'gateway': gateway ,
          'dnserver': dnserver ,
          'hostname': hostname ,
      }

       
     //  POST Request
      gatewayNetworkService.saveDHCPLan(DHCPFormData).then(function() {
        $scope.forms.DHCPFormLan.$setPristine();
      },
      function() {
       //TODO: $scope.errorMessage.lan_settings = $filter('translate')('setup.network.save_failed');
      });
      
      var deferred = $q.defer();
      deferred.resolve(DHCPFormData);
      $scope.reset();      

      // Reset Form
      $scope.reset = function() {
          $scope.netwrkData.DHCPFormLan = angular.copy({});
          $scope.forms.DHCPFormLan.$setPristine();
          $scope.forms.DHCPFormLan.$setUntouched();
      };
  }
}

/* Found an issue with this watch during page load */

$scope.$watch('netwrkData.DHCPForm.networkdhcp', function(newval, oldval){
  if(newval != oldval && newval ==true){
    $scope.netwrkData.DHCPForm.ipaddress = null;
    $scope.netwrkData.DHCPForm.subnetmask = null;
    $scope.netwrkData.DHCPForm.gateway = null;
    $scope.netwrkData.DHCPForm.dnserver = null;
    $scope.forms.DHCPForm.$setPristine();
    $scope.forms.DHCPForm.$setUntouched();
  }
});

$scope.$watch('netwrkData.DHCPFormLan.networkdhcp', function(newval, oldval){
  if(newval != oldval && newval ==true){
    $scope.netwrkData.DHCPFormLan.ipaddress = null;
    $scope.netwrkData.DHCPFormLan.subnetmask = null;
    $scope.netwrkData.DHCPFormLan.gateway = null;
    $scope.netwrkData.DHCPFormLan.dnserver = null;
    $scope.forms.DHCPFormLan.$setPristine();
    $scope.forms.DHCPFormLan.$setUntouched();
  }
});

/* Starting function calls */
$scope.getWifiDHCP();
$scope.getLanDHCP();
$scope.setNetworkScan();
$scope.gotoAnchor = function(x) {
    var newHash = x;
    if ($location.hash() !== newHash) {
      $location.hash(x);
    } else {
      $anchorScroll();
    }
  }
}
]);