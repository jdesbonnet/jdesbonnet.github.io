hwpapp.controller('hwpCalcCtrl',['$scope', '$interval', function($scope, $interval) {
    $scope.power = 3.0;
    $scope.volume = 1000;
    $scope.start_temperature = 20;
    $scope.target_temperature = 80;

    //$scope.time = ($scope.volume/1000) * 4200 * ($scope.target_temperature - $scope.start_temperature) / ($scope.power*1000);


    $scope.startCountdownTimer = function () {


        var time = ($scope.volume/1000) * 4200 * ($scope.target_temperature - $scope.start_temperature) / ($scope.power*1000);
        $scope.countdown_timer = Math.ceil(time);

        var start_time = new Date().getTime();

        var interval = $interval(function() {
            $scope.countdown_timer--;
            var now = new Date().getTime();
            var temperature = $scope.start_temperature + $scope.power * 1000 * (now - start_time) / (4200 * $scope.volume);
            $scope.current_temperature = temperature.toFixed(1);
            if ($scope.countdown_timer == 0) {
                $interval.cancel(interval);
		beep();
            }
        }, 1000);

    };
}]);
