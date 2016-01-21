(function(){
	'use strict';

	var choresApp = angular.module('chores', ['ngAnimate','ngAria','ngMaterial', 'ngRoute'] );

	var dbConstantObj = {
		apiKey : '62Hbco6a2MTpXS68g9F-Jh8uAVR2XF-M',
		apiRoot : 'https://api.mongolab.com/api/1/databases/kerster_db/'
	};
	var sprintZero = {
		displayName : 'Sprint 0',
		sprintNumber : '0',
		status : 'Active'
	}

	choresApp.constant('dbConstants', dbConstantObj);

	choresApp.config(['$routeProvider',function($routeProvider) {
		$routeProvider.otherwise({
			templateUrl: 'partials/main.html',
			controller: 'ChoresController',
			controllerAs: 'cc',
			resolve:{
				currentSprint: function(sprintDataService){
					return sprintDataService.getCurrentSprint();
				},
				sprintList: function(sprintDataService){
					return sprintDataService.getAllSprints().then(
						function success(response){
							return response.data;
						});
				},
				choresList: function(choresServices){
					return choresServices.getChoreBacklog().then(
						function success(response){
							return response.data;
						});
				}
			}

		})
	}]);

	choresApp.run(function(initializeSprint){

		initializeSprint.initialize();
	});


})();