angular.module('ServerMonitorDashboard')
.controller('HomeController', function($scope, $http, $interval) {

  var cpu = 0;
  var memory = 0;
  var netInPacket = 0;
  var netOutPacket = 0;
  var netThroughIn = 0;
  var netThroughOut = 0;

  var d = new Date();
  d.setDate(d.getDate()-14);
  $scope.fromDate = d;
  $scope.toDate = new Date();
  $scope.NetInOutData = [];

  $scope.getDateWiseData = function() {
    var dur = 1 * 24 * 60 * 60 * 1000;
    $http.get("stats/"+$scope.fromDate.getTime()+"/"+$scope.toDate.getTime()+"/"+dur)
      .then(function(response) {
          var data = response.data.data;
          var prepData = [];
          for(var i = 0; i < data.length; i++){
            prepData.push({"date":data[i].timestamp, "in":data[i].network_packet.in, "out":data[i].network_packet.in});
          }
          $scope.NetInOutData = prepData;
      });
  }

  $interval(function(){
    var ts = new Date().getTime();
    var ts2 = ts+1000;
    var duration = 1000;
    $http.get("stats/"+ts+"/"+ts2+"/"+duration)
      .then(function(response) {
          var data = response.data.data[0];
          cpu = data.cpu_usage;
          memory = (data.memory_usage / (data.memory_available + data.memory_usage)) * 100;
          netThroughIn = data.network_throughput.in;
          netThroughOut = data.network_throughput.out;
          netInPacket = data.network_packet.in;
          netOutPacket = data.network_packet.out;
      });
  }, 1000);

    $scope.liveCpuData = function(){
      return cpu;
    };

    $scope.liveMemoryData = function(){
      return memory;
    };

    $scope.liveNetThroughInData = function(){
      return netThroughIn;
    };

    $scope.liveNetThroughOutData = function(){
      return netThroughOut;
    };

    $scope.liveNetInPacketData = function(){
      return netInPacket;
    };

    $scope.liveNetOutPacketData = function(){
      return netOutPacket;
    };


});
