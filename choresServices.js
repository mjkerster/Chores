(function(){

	'use strict';

	var choresApp = angular.module('chores');

	choresApp.factory('choresServices', function($http, dbConstants){

		var choresApis = {

			addChore : function(choreObject){
				return $http.post(dbConstants.apiRoot + 'collections/chores?apiKey=' + dbConstants.apiKey, choreObject);
			},
			updateChore : function(id, choreObject){
				$http.put(dbConstants.apiRoot + 'collections/chores/' + id.$oid + '?apiKey=' + dbConstants.apiKey, choreObject);
			},
			getChoreBacklog : function(){
				return $http.get(dbConstants.apiRoot + 'collections/chores?apiKey=' + dbConstants.apiKey);
			},
			getChoresBySprint : function(sprint){
				//TODO: add order to this
				return $http.get(dbConstants.apiRoot + 'collections/chores?q={sprint:"' + sprint + '"}&apiKey=' + dbConstants.apiKey);
			},
			getChoresByStatus : function(status){
				//TODO: add order to this
				$http.get(apiRoot + 'collections/chores?q={status:"' + status + '"&apiKey=' + dbConstants.apiKey);
			},
			getChoresByOwner : function(owner){
				//TODO: add order to this
				$http.get(dbConstants.apiRoot + 'collections/chores?q={owner:"'+ owner + '"&apiKey=' + dbConstants.apiKey);
			},
			deleteChore: function(id){
				return $http.delete(dbConstants.apiRoot + 'collections/chores/' + id + '?apiKey=' + dbConstants.apiKey);
			},
			getPriorities: function(){
				var priorities = ['High', 'Normal', 'Low'];

				return priorities;
			},
			getOwners: function(){
				var owners = ['Courtney', 'Matt'];

				return owners;
			},
			getSizes: function(){
				var sizes = ['2', '4', '8', '16'];

				return sizes;
			},
			getStatuses: function(){
				var statuses = ['Inactive', 'In Progress', 'Complete', 'Impeded'];

				return statuses;
			},
			getSprints: function(){
				var sizes = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19'];

				return sizes;
			}

		}

		return choresApis;
	});
})();

