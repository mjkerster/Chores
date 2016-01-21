(function(){
	'use strict';

	var choresApp = angular.module('chores');

	choresApp.factory('sprintDataService', function sprintDataService($q, $http, dbConstants, utilitiesService){
		var currentSprintSingleton = {sprintNumber: 0};
		var sprintApis = {
			getAllSprints : function getAllSprints(){
				return $http.get(dbConstants.apiRoot + 'collections/sprints?apiKey=' + dbConstants.apiKey);
			},
			getCurrentSprint : function getCurrentSprint(){
				var deferred = $q.defer();
				if(currentSprintSingleton.sprintNumber != '0'){
					console.log('Recycled sprintNumber');
					deferred.resolve(currentSprintSingleton);
				}
				else{
					$http.get(dbConstants.apiRoot + 'collections/sprints?q={status:"Active"}&apiKey=' + dbConstants.apiKey).then(
						function success(response){
							currentSprintSingleton = response.data[0];
							deferred.resolve(currentSprintSingleton);
						}
					);
				}
				return deferred.promise;
			},
			addSprint : function addSprint(sprintObj){
				return $http.post(dbConstants.apiRoot + 'collections/sprints?apiKey=' + dbConstants.apiKey, sprintObj);
			},
			activateSprint : function activateSprint(id, sprintObj){
				return $http.put(dbConstants.apiRoot + 'collections/sprints/'+ id + '?apiKey=' + dbConstants.apiKey, sprintObj);
			}
		};


		return sprintApis;
	});

	choresApp.factory('initializeSprint', function sprintInitializer(sprintDataService, utilitiesService){


		function createFirstSprint(){
			var firstSprint = {
				displayName : 'Sprint 1',
				sprintNumber : '1',
				status : 'Active'
			}
			// TODO: Handle Failure
			sprintDataService.addSprint(firstSprint).then(
				function success(){
					console.log('First sprint created');
				});
		}

		var initialize = {
			initialize : function(){
				// TODO: Handle Failure
				sprintDataService.getAllSprints().then(function success(response){
					if(utilitiesService.isObjectEmpty(response.data)){
						createFirstSprint();
					}
				});
			}
		};

		return initialize;
	});

	choresApp.factory('switchSprint', function switchSprint($mdDialog, sprintDataService, $q){

		var switchIt = function switchIt(sprints, sprintHolder, currentSprint, direction){
			var updatedSprint = {};
			var newNumber;

			function findSprintIdToUpdate(sprintz, sprintToId){
				for(var i=0; i < sprintz.length; i++){
					if(sprintz[i].displayName === sprintToId.displayName){
						return sprintz[i]._id.$oid;
					}
				}
			}

			function activateSprintDialog(){
				var confirm = $mdDialog.confirm()
	          		.title('Would you like to activate this sprint?')
	          		.textContent('This will close out the current sprint.')
		          	.ok('Yes')
		          	.cancel('No');
			    
			    $mdDialog.show(confirm).then(function confirm() {
			    	var idActive = findSprintIdToUpdate(sprints, updatedSprint);
			    	var idInactive = findSprintIdToUpdate(sprints, currentSprint);
			    	updatedSprint.status = 'Active';
			    	delete currentSprint._id;
			    	//TODO: currentSprint isn't updated everywhere
			    	currentSprint.status = 'Inactive';

			    	$q.all([sprintDataService.activateSprint(idActive, updatedSprint),sprintDataService.activateSprint(idInactive, currentSprint)]).then(
			    		function success(arrRes){
			    			//TODO: Create indicators for successful calls
			    		});
			    });
			}

			function sprintZeroAlert(){
				var sz = $mdDialog.alert()
					.title('You cannot go back any further!')
					.textContent('Sprint 1 is the first in the list.')
					.ok('OK')
					.clickOutsideToClose(true);

				$mdDialog.show(sz);
			}

			if(direction === 'increase'){
				newNumber = Number(sprintHolder.sprintNumber) + 1;

				if(newNumber === (Number(currentSprint.sprintNumber)+1)){
					activateSprintDialog();
				}
				updatedSprint.sprintNumber = newNumber;
				updatedSprint.displayName = 'Sprint ' + updatedSprint.sprintNumber;			
			}
			else if(direction === 'decrease'){
				newNumber = Number(sprintHolder.sprintNumber) - 1;

				if(newNumber === 0){
					sprintZeroAlert();
					updatedSprint = sprintHolder;
				}
				else{
					updatedSprint.sprintNumber = newNumber;
					updatedSprint.displayName = 'Sprint ' + updatedSprint.sprintNumber;
					updatedSprint.status = 'Inactive';
				}

			}

			return updatedSprint
		}

		return switchIt;
	})
})();
