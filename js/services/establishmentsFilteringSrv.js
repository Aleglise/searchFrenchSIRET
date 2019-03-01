angular.module('api.establishmentsFiltering', [])
.factory('establishmentsFilteringSrv',[
    function()
    {
        'use strict';

        var exports = 
        {
            /**
             * Return a array containing all the object having the same value in their department field
             * 
             * Get an array of formatized establishment objects and filter all objects by comparing their department field's value with the department variable given 
             * Return an array containing only the objects having the same department value in their department field
             * 
             * @param {*} establishmentsArray An array of establishment objects
             * @param {*} department the department value used to filter the establishmentArray
             */
            establishmentsResultsFiltering : function(establishmentsArray, department)
            {
                if(!establishmentsArray || !department)
                {
                    return false;

                }

                var filteredEstablishmentsArray = establishmentsArray.filter(function(establishment)
                {  
                    // The filter() function add in its own array it just created 
                    // all the establishments of the the scope.view.establishments.resultsTable's array whose department is equal to establishmentsDepartment

                    return (establishment.department === department);
                });
                
                // Reset the establishmentDepartment variable's value
                return filteredEstablishmentsArray;          
            }
        };
        
        return exports;
    },
]);