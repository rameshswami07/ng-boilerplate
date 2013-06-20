var charitiesModule = angular.module( "CharitiesDropDown", [] );
var _scope;

charitiesModule.controller(
    "CharitiesDropDownController",
    function( $scope ) {
        _scope = $scope;

        $scope.charitiesCallback = function(response) {
            $scope.charities = response.vo;

            var $dropdowns = $('.wts-dropdown');
            $dropdowns.on({
                mouseenter: function () {
                    $(this).find('.wts-dropdown-menu').show();
                },
                mouseleave: function () {
                    $(this).find('.wts-dropdown-menu').hide();
                }
            });

            $scope.$apply();
        };

        $scope.applicationConnectedReady = function() {
            getListOfActiveCharities(_scope.charitiesCallback);
        };
});
