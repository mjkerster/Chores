(function(){
	'use strict';

	var choreApp = angular.module('chores');

	choreApp.service('utilitiesService', utilitiesService);

	function utilitiesService(){

		var utilService = {

			getCurrentDateTime : function(){
				var newDate = new Date();
				var month = newDate.getMonth() + 1;

				return month + '/' + newDate.getDate() + '/' + newDate.getFullYear() + ' ' + newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();
			},
			isObjectEmpty : function isEmpty(object) {
				for(var key in object) {
			    	if(object.hasOwnProperty(key)){
			      		return false;
			    	}
			  }
			  return true;
			}
		}

		return utilService;
	}

})();