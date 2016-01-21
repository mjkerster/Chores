(function(){
	'use strict'

	var choresApp = angular.module('chores');

	choresApp.controller('ChoresController', function choresController($scope, $mdDialog, $window, choresServices, utilitiesService, sprintDataService, currentSprint, choresList, switchSprint, sprintList){
		
		$scope.priorities = choresServices.getPriorities();
		$scope.sizes =  choresServices.getSizes();
		$scope.owners = choresServices.getOwners();
		$scope.statuses = choresServices.getStatuses();
		$scope.sprints = sprintList;
		$scope.saveOrUpdate = 'save';
		$scope.sprintHolder = currentSprint;
		$scope.choreList = choresList;
		$scope.mobile = false;
		
		if($window.innerWidth < 650){
			$scope.mobile = true;
		}
 		

		$scope.addChoreClick = function(ev){
			$scope.saveOrUpdate = 'save';
			$scope.newChoreObj = {
				status: 'Inactive',
				priority: 'Normal',
				sprint: '0'
			};

			$mdDialog.show({
			    scope: $scope.$new(),
			    templateUrl: 'partials/newChoreForm.html',
			    parent: angular.element(document.body),
			    targetEvent: ev,
			    clickOutsideToClose:true
			});
		};

		$scope.editChoreClick = function(choreObj, ev){
			$scope.saveOrUpdate = 'update';

			$scope.newChoreObj = choreObj;
			$mdDialog.show({
			    scope: $scope.$new(),
			    templateUrl: 'partials/newChoreForm.html',
			    parent: angular.element(document.body),
			    targetEvent: ev,
			    clickOutsideToClose:true
			});
		}

		$scope.cancel = function(){
			$mdDialog.cancel();
		};

		$scope.saveChore = function(choreObj){
			choreObj.currentDateTime = utilitiesService.getCurrentDateTime();
			choresServices.addChore(choreObj).then(
				function success(res){
					$scope.choreList.unshift(res.data);	
				},
				function failure(){
					//TODO: Make this alert a nice looking angular material alert
					alert('Unable to add chores. Please try again later');
				}
			);
			$mdDialog.hide();
		};

		$scope.updateChore = function(choreObj){
			choresServices.updateChore(choreObj._id, choreObj);
			$mdDialog.hide();
		};

		$scope.addToSprint = function(choreObj){
			sprintDataService.getCurrentSprint().then(
				function(data){
					choreObj.sprint = data.sprintNumber;
					choresServices.updateChore(choreObj._id, choreObj);
				}
			);			
		};

		$scope.changeSprint = function(direction){
			$scope.sprintHolder = switchSprint($scope.sprints, $scope.sprintHolder, currentSprint, direction);
		};

		$scope.deleteChore = function(choreObj){
			choresServices.deleteChore(choreObj._id.$oid).then(
				function success(res){
					for(var i=0; i < $scope.choreList.length; i++){
						if($scope.choreList[i]._id.$oid === choreObj._id.$oid){
							$scope.choreList.splice(i, 1);
						}
					}
				});
		}
	});
})();