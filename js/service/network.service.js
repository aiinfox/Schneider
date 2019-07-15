
"use strict";

/*============================================================================*/
//fn  conext_gatewayNetworkService
/*!
Collection of network service functions
This provides service functions to configure network settings.  Network settings
include LAN, Email, FTP and Cloud Webportal.
@param[in]
  csbQuery
    conext_gateway specific query service functions
@param[in]
  queryService
    General query services.
@param[in]
    queryFormatterService
      Query data formatting service functions.
@param[in]
  $q
    Angular service to handle asynchronous processing.
@param[in]
  $log
    Angular debug log services.
@retval object for all public methods.
*/
/*
REVISION HISTORY:
Version: 1.01  Date: 9-Jan-2018  By: Eddie Leung
  -Added "/SCB/NETWORK/DM0IP", to lan settings.
*/
/*============================================================================*/
// var conext_gateway = angular.module("conext_gateway", []);

angular.module('conext_gateway').factory('gatewayNetworkService', [ '$q', '$log', 'queryService','csbQuery',  function( $q, $log, queryService, csbQuery ) {

    var queryVars = {
      lan_settings: ['/SCB/NETWORK/DM0DHCP', 'ETH0/TCPIP/DHCP_IP',
        '/SCB/NETWORK/DM0IPSHOW', 'ETH0/TCPIP/DHCP_NMASK',
        'ETH0/TCPIP/DHCP_GWAY', 'ETH0/TCPIP/DHCP_DNS',
        'HOSTNAME'
      ],
      sftp_settings: ['FTPLOG/ENABLE', 'FTPLOG/DEST_ADDR', 'FTPLOG/USERNAME', 'FTPLOG/DEST_DIR'],
      conext_insight: ['WEBPORTAL/SYNC_ENABLE', 'WEBPORTAL/SYNC_STRING',
        'WEBPORTAL/ENABLE', 'WEBPORTAL/LAST_TRANSFER_TIME',
        'WEBPORTAL/STATUS', 'WEBPORTAL/UNSENT_PACKET_COUNT',
        'ADMIN/DISCLCHECK'
      ],
      remote_diagnostics: ['SESSION/DIAG_ACCESS_CODE', 'SESSION/DIAG_ID',
        'SESSION/DIAG_ACTIVE'
      ],
      ftp_server: ['/SCB/FTP/ENABLE'],
      cloud_settings: ['/SCB/CNM/ENABLED', '/SCB/CNM/PROXY_ENABLED',
        '/SCB/CNM/PROXY_URL', '/SCB/CNM/PROXY_PORT',
        '/SCB/CNM/PROXY_USER', '/SCB/CNM/ALLOW_UPGRADE',
        '/SCB/CNM/ISCONNECTED', '/SCB/CNM/TX_COUNT',
        '/SCB/CNM/RX_COUNT', '/SCB/CNM/TX_ERR_COUNT',
        '/SCB/CNM/LAST_TRANSFER_TIME', '/SCB/LPHD/URN',
        '/SCB/CNM/DISCONNECT_COUNT', 'ADMIN/DISCLCHECK'
      ],
      ap_settings: ['/SCB/AP/SSID',
        '/SCB/AP/ENABLE'
      ]
    };
    
    //private shared variable
    var sharedVariables = { };

    var service = {
      getNetworkData: getNetworkData,
      saveLanSettings: saveLanSettings,
      saveSFTPSettings: saveSFTPSettings,
      saveAPSettings: saveAPSettings,
      saveConextInsightSettings: saveConextInsightSettings,
      saveRemoteDiagnostics: saveRemoteDiagnostics,
      setSessionDiagCancel: setSessionDiagCancel,
      saveFTPServer: saveFTPServer,
      saveCloudSettings: saveCloudSettings,
      getStatusSysvars: getStatusSysvars,
      saveIEEESettings: saveIEEESettings,
      saveModbusSettings: saveModbusSettings,
      getConnections: getConnections,
      saveNetworkSettings: saveNetworkSettings,
      getNetworkSettings: getNetworkSettings,
      saveManualSSIDSettings: saveManualSSIDSettings,
      saveSelectSSIDSettings: saveSelectSSIDSettings,
      getNetworkMode: getNetworkMode,
      getWifiNetworkSettings: getWifiNetworkSettings,
      getLanNetworkSettings: getLanNetworkSettings,
      getIEEEStatus: getIEEEStatus,
      saveDHCPWifi: saveDHCPWifi,
      saveDHCPLan: saveDHCPLan,
      setScan: setScan
    };

    return service;

    function getIEEEStatus() {
      var avOptionssvars = [
        '/SCB/2030/STATUS'
      ];
      return queryService.getSysvars(avOptionssvars);
    }

    function getNetworkData() {
      return queryService.getSysvars(queryVars);
    }

    function getNetworkSettings(){
      var avOptionssvars = [
        '/SCB/NETWORK/TIW_STA0IP','/SCB/NETWORK/TIW_STA0NETMASK','/SCB/NETWORK/TIW_STA0DHCP','/SCB/NETWORK/TIW_STA0IPSHOW','/SCB/NETWORK/TIW_STA0MACADDRESS','/SCB/NETWORK/TIW_STA0NETMASKSHOW'
      ];
      return queryService.getSysvars(avOptionssvars);
    }

    function getStatusSysvars() {
      var stsSysvars = ['/SCB/CNM/ISCONNECTED', 'SESSION/DIAG_ID',
        'SESSION/DIAG_ACTIVE', '/SCB/CNM/TX_COUNT',
        '/SCB/CNM/RX_COUNT', '/SCB/CNM/TX_ERR_COUNT',
        '/SCB/CNM/LAST_TRANSFER_TIME'
      ];
      return queryService.getSysvars(stsSysvars);
    }

    function getConnections() {
      var avOptionssvars = [
        '/SCB/WIFI_STATION/SSID',
        '/SCB/WIFI_STATION/SCAN_RESULTS_JSON',
        '/SCB/WIFI_STATION/STATUS',
      ];
      return queryService.getSysvars(avOptionssvars);
    }

    function getNetworkMode(){
      var avOptionssvars = [
        '/SCB/NETWORK/ACTIVE'
      ];
      return queryService.getSysvars(avOptionssvars);
    }

    function getWifiNetworkSettings(){
      var avOptionssvars = [
        '/SCB/NETWORK/TIW_STA0IPSHOW','/SCB/NETWORK/TIW_STA0NETMASKSHOW','/SCB/NETWORK/TIW_STA0IP','/SCB/NETWORK/TIW_STA0NETMASK','/SCB/NETWORK/TIW_STA0DHCP', 'ETH0/TCPIP/DHCP_GWAY', '/SCB/NETWORK/DNSSERVER', 'HOSTNAME'
      ];
      return queryService.getSysvars(avOptionssvars);
    }

    function getLanNetworkSettings(){
      var avOptionssvars = [
        '/SCB/NETWORK/DM0IPSHOW','/SCB/NETWORK/DM0NETMASKSHOW','/SCB/NETWORK/DM0IP','/SCB/NETWORK/DM0NETMASK','/SCB/NETWORK/DM0DHCP', 'ETH0/TCPIP/DHCP_GWAY', '/SCB/NETWORK/DNSSERVER', 'HOSTNAME'
      ];
      return queryService.getSysvars(avOptionssvars);
    }

    /* SET Queries for saving to Sys vars */

    function saveRemoteDiagnostics(data) {
      var requestObject = {};
      requestObject['SESSION/DIAG_ACCESS_CODE'] = data.SESSION_DIAG_ACCESS_CODE;
      return csbQuery.setFromObject(requestObject, true);
    }

    function setSessionDiagCancel() {
      var requestObject = {};
      requestObject['SESSION/DIAG_CANCEL'] = 1;
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveLanSettings(data) {
      var requestObject = {};
     
     requestObject["/SCB/NETWORK/DM0DHCP"] = data.SCB_NETWORK_DM0DHCP;
      if (data.SCB_NETWORK_DM0DHCP === 0) {
        requestObject["/SCB/NETWORK/DM0IP"] = data.ETH0_TCPIP_DHCP_IP;
        requestObject["/SCB/NETWORK/DEFAULTGW"] = data.ETH0_TCPIP_DHCP_GWAY;
        requestObject["/SCB/NETWORK/DM0NETMASK"] = data.ETH0_TCPIP_DHCP_NMASK;
        requestObject["/SCB/NETWORK/DNSSERVER"] = data.ETH0_TCPIP_DHCP_DNS;
      }
      requestObject["HOSTNAME"] = data.HOSTNAME;

      requestObject["/SCB/NETWORK/SET"] = 1;
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveAPSettings(data) {
      var requestObject = {};
      requestObject["/SCB/AP/ENABLE"] = data.SCB_AP_ENABLE;
      if (data.SCB_AP_ENABLE !== 0) {
        requestObject["/SCB/AP/SSID"] = data.SCB_AP_SSID;
        if (data.SCB_AP_PASSWORD !== "*****") {
          requestObject["/SCB/AP/PASSWORD"] = data.SCB_AP_PASSWORD;
        }
      }
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveSFTPSettings(data) {
      var requestObject = {};
      requestObject["FTPLOG/ENABLE"] = data.FTPLOG_ENABLE;
      if (data.FTPLOG_ENABLE === 1) {
        requestObject["FTPLOG/DEST_ADDR"] = data.FTPLOG_DEST_ADDR;
        requestObject["FTPLOG/USERNAME"] = data.FTPLOG_USERNAME;
        if (data.FTPLOG_PASSWORD !== "*****") {
          requestObject["FTPLOG/PASSWORD"] = data.FTPLOG_PASSWORD;
        }
        requestObject["FTPLOG/DEST_DIR"] = data.FTPLOG_DEST_DIR;
      }
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveFTPServer(data) {
      var requestObject = {};
      requestObject["/SCB/FTP/ENABLE"] = data.SCB_FTP_ENABLE;
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveConextInsightSettings(data) {
      var requestObject = {};
      requestObject["WEBPORTAL/ENABLE"] = data.WEBPORTAL_ENABLE;
      if (data.WEBPORTAL_ENABLE === 1) {
        requestObject["WEBPORTAL/SYNC_ENABLE"] = data.WEBPORTAL_SYNC_ENABLE;
        if (data.WEBPORTAL_SYNC_ENABLE) {
          requestObject["WEBPORTAL/SYNC_STRING"] = data.WEBPORTAL_SYNC_STRING;
        }
      }
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveCloudSettings(data) {
      var requestObject = {};
      requestObject["/SCB/CNM/ENABLED"] = data.SCB_CNM_ENABLED;
      requestObject["/SCB/CNM/PROXY_ENABLED"] = data.SCB_CNM_PROXY_ENABLED;
      if (data.SCB_CNM_PROXY_ENABLED == 1) {
        requestObject["/SCB/CNM/PROXY_URL"] = data.SCB_CNM_PROXY_URL;
        requestObject["/SCB/CNM/PROXY_PORT"] = data.SCB_CNM_PROXY_PORT;
        requestObject["/SCB/CNM/PROXY_USER"] = data.SCB_CNM_PROXY_USER;
        if (data.SCB_CNM_PROXY_PASSWORD !== "*****") {
          requestObject["/SCB/CNM/PROXY_PASSWORD"] = data.SCB_CNM_PROXY_PASSWORD;
        }
      }
      requestObject["/SCB/CNM/ALLOW_UPGRADE"] = data.SCB_CNM_ALLOW_UPGRADE;
      return csbQuery.setFromObject(requestObject, true);
    }

    function saveIEEESettings(data) {
      var requestObject = {};
      requestObject["/SCB/2030/ENABLE"] = data.SCB_2030_ENABLE;
      requestObject["/SCB/2030/SERVER_ADDR"] = data.SCB_2030_SERVER_ADDR;
      requestObject["/SCB/2030/SERVER_PORT"] = data.SCB_2030_SERVER_PORT;
      return csbQuery.setFromObject(requestObject, true);
    }
    
    function saveModbusSettings(data) {
        var requestObject = {};
        requestObject["/SCB/MBSERVER/DISABLE"] = data.SCB_MBSERVER_DISABLE;
        return csbQuery.setFromObject(requestObject, true);
    }
      
    function saveNetworkSettings(data) {
        var requestObject = {};
        requestObject["/SCB/NETWORK/TIW_STA0IP"] = data.ipaddress;
        requestObject["/SCB/NETWORK/TIW_STA0NETMASK"] = data.subnetmask;
        requestObject["/SCB/NETWORK/TIW_STA0DHCP"] = data.networkdhcp;
        requestObject["/SCB/NETWORK/TIW_STA0IPSHOW"] = data.gateway;
        requestObject["/SCB/NETWORK/TIW_STA0MACADDRESS"] = data.dnserver;
        requestObject["/SCB/NETWORK/TIW_STA0NETMASKSHOW"] = data.hostname;
      
        requestObject["/SCB/NETWORK/SET"] = 1;
        return csbQuery.setFromObject(requestObject, true);
    }

    function saveManualSSIDSettings(data) {
        var requestObject = {};
        requestObject["/SCB/WIFI_STATION/SSID"] = data.networkOpt;
        requestObject["/SCB/WIFI_STATION/PASSWORD"] = data.networkpassword;
    
        requestObject["/SCB/WIFI_STATION/APPLY_SETTINGS"] = 1;
        return csbQuery.setFromObject(requestObject, true);
    }

    function saveSelectSSIDSettings(data) {
        var requestObject = {};
        requestObject["/SCB/WIFI_STATION/SSID"] = data.ssid;
        requestObject["/SCB/WIFI_STATION/PASSWORD"] = data.networkpassword;
    
        requestObject["/SCB/WIFI_STATION/APPLY_SETTINGS"] = 1;
        return csbQuery.setFromObject(requestObject, true);
    }

    function saveDHCPWifi(data) {
        var requestObject = {};
        if(data.networkdhcp) {
          requestObject["/SCB/NETWORK/TIW_STA0DHCP"] = 1;
        }
        else {
          requestObject["/SCB/NETWORK/TIW_STA0DHCP"] = 0;
          requestObject["/SCB/NETWORK/TIW_STA0IP"] = data.ipaddress;
          requestObject["/SCB/NETWORK/TIW_STA0NETMASK"] = data.subnetmask;
          requestObject["/SCB/NETWORK/DEFAULTGW"] = data.gateway;
          requestObject["/SCB/NETWORK/DNSSERVER"] = data.dnserver;
        }

        requestObject["HOSTNAME"] = data.hostname;
        requestObject["/SCB/NETWORK/SET"] = 1;
        return csbQuery.setFromObject(requestObject, true);
    }

    function saveDHCPLan(data) {
      var requestObject = {};
      var requestObject = {};
      if(data.networkdhcp) {
        requestObject["/SCB/NETWORK/DM0DHCP"] = 1;
      }
      else {
        requestObject["/SCB/NETWORK/DM0DHCP"] = 0;
        requestObject["/SCB/NETWORK/DM0IP"] = data.ipaddress;
        requestObject["/SCB/NETWORK/DM0NETMASK"] = data.subnetmask;
        requestObject["/SCB/NETWORK/DEFAULTGW"] = data.gateway;
        requestObject["/SCB/NETWORK/DNSSERVER"] = data.dnserver;
      }

      requestObject["HOSTNAME"] = data.hostname;
      requestObject["/SCB/NETWORK/SET"] = 1;
    return csbQuery.setFromObject(requestObject, true);
    }

    function setScan() {
      //GET for OTK 412 Issue
      var avOptionssvars = ["/SCB/WIFI_STATION/SCAN"];
      queryService.getSysvars(avOptionssvars);
      //SET
      var requestObject = {};
      requestObject["/SCB/WIFI_STATION/SCAN"] = 1;
      return csbQuery.setFromObject(requestObject, true);
    }
  }
]);