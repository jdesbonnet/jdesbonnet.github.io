var hwpapp = angular.module('hwpapp', [
    'ui.bootstrap'
]);

hwpapp.directive('navbar', function() {
    return {
        restrict: 'E', // match only element names
        templateUrl: 'ng-templates/navbar.html'
    };
});

hwpapp.directive('footer', function() {
    return {
        restrict: 'E', // match only element names
        templateUrl: 'ng-templates/footer.html'
    };
});
