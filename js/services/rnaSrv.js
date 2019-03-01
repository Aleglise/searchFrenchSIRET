angular.module('api.rna', [])
.factory('RnaSrv', [ '$http', 'AsyncCallsSrv','stringSrv',
     function($http, AsyncCallsSrv, stringSrv,/*otherService*/)
    {
        'use strict';

        // The number of result per page wanted
        var PER_PAGE = 100;
        
        // The maximum number of result to comput (Do not exceed 5 pages of results in its current state)
        var MAX_RESULTS_TO_COMPUTE = 5 * PER_PAGE; // should be a multiple of PER_PAGE
        
        //Constant that contains all the words that shouldn't be in the association's name while requesting the apis
        var BANNEDWORDS = [   
            'ASSOCIATION'
        ];

        /**
         * Format the given company's data
         * 
         * @param {*} association The association choosen in the page
         * @return {};
         */
        var intiaFormatRna = function (association)
        {
            if(!association)
            {
                return {};
            }

            var data = {
                id:                 association.id,
                name1:              association.titre,
                name2:              association.titre_court,
                address:            association.adresse_gestion_libelle_voie,
                city:               association.adresse_libelle_commune,
                siret:              association.siret,
                legal_form:         association.libelle_nature_juridique_entreprise,
                naf:                association.activite_principale,
                department:         association.adresse_code_postal ? association.adresse_code_postal.substr(0,2) : '',
                postal_code:        association.adresse_code_postal,
                rna:                association.id_association,
                creation_date:      association.date_creation,
                phone:              association.telephone,
                updateDate:         association.updated_at,
                website:            association.site_web,
                email:              association.email,
                // nom_raison_sociale
                // search: l1_n + '\n' + l2_n + '\n' + l3_n + '\n' + l4_n + '\n' + l5_n + '\n' + l6_n,
                // address_declare: l1_d + '\n' + l2_d + '\n' + l3_d + '\n' + l4_d + '\n' + l5_d + '\n' + l6_d
            };
            
            return data
        };

        /**
         * Remove all special characters, accents and words considered as to be banned of the given associationName and return the new string formed
         * @param {*} associationName Name of the association seeked 
         * @Returns associationNameTable
         */
        var associationNameFormating = function(associationName)
        {
            if(!associationName)
            {
                return '';
            }
           
            // We initiate a associationNameTable that will contain all the accepted words of the associationName
            var associationNameTable = [];

            // We remove all special characters and accents of the upperCased associationName. Then we divide the associationName in words and for each word
            stringSrv.keepOnlyLettersAndNumbers(associationName.toUpperCase()).split(' ').forEach(function(word) {
                // If the word is at least two character long and isn't banned            
                if (word.length >1 && !stringSrv.isStringMemberOf(word, BANNEDWORDS))
                {
                    associationNameTable.push(word);
                }
            });

            // We create a new string composed of all the words in associationNameTable            
            return associationNameTable.join(' ');
        };

        /**
         * Check if the name of the searched association match the names of the association given
         * If a department is given, we check the value of the association's department as well 
         * 
         * @param {*} name The value used to filter the association object
         * @param {*} ent the association object
         * @param {*} association the association department, if given
         * 
         * @returns isCandidate(Boolean)
         */        
        var isAssociationCandidate = function(name, association, department)
        {
            if(!name || !association)
            {
                return false;
            }
        
            var candidateFields = [association.name1, association.name2];
            
            // We start by assuming that the association isn't candidate
            var isCandidate = false;

            // For each fields to compare the given value with

            // If a department value has been given and is equal to the association's value OR if no department has been given
            if(department && association.department === department || !department)
            {
                for(var i = 0; i<candidateFields.length; i++)
                {
                    // We normalize the association field value in case of an api returning some non normalized characters in its result
                    var normalizedFieldValue = associationNameFormating(candidateFields[i]);
    
                    // If all words of the value variable are members of the normalizedFieldValue
                    if(stringSrv.doAllWordsMatch(name, normalizedFieldValue))
                    {
                        // We declare the association as being candidate
                        isCandidate = true;
    
                        // We stop the loop
                        i = candidateFields.length;
                    }
                }
            }
            
            return isCandidate;        
        };
        
        /**
         * For each association in the Json:
         * 
         * Call the intiaFormatRna() function to format the company's data
         * 
         * Call the isAssociationCandidate() function to check if the company given has in its name variables the name parameter
         * 
         * Return a table of result containing all the fromated companiy corresponding to the 
         *   
         * @param {*} arr 
         * @param {*} name 
         */
        var filterAssociation = function(arr, name, department)
        {
            if(!arr || !name)
            {
                return;
            }

            name = name.toUpperCase();

            var filteredArr = [];

            // for each company of the first page
            arr.forEach(function(association) {
                // We check if the company name really is similar to the association's
                var myassociation = intiaFormatRna(association);

                if(isAssociationCandidate(name, myassociation, department))
                {
                    // If it is, we push the company information into the associations result table
                    filteredArr.push(myassociation);
                }    
            });

            return filteredArr;
        };

        /**
        * Function that get each association of the results page
        * @param {*} pageRank 
        */
        var getAllAssociations = function (associationName, associationDepartment, pageRank, callback)
        {
            if(!associationName)
            {
                callback('Error during server request');
                return;
            }
           
            var result = {
                tooMuchResults:             false,
                resultsBeforeFiltering:     0,
                resultsTable:               []
            };

            associationName = associationNameFormating(associationName);

            if(!associationName || associationName.length < 3)
            {
                callback('name not adapted');
            }

            // We create a new http request specifying the rank of the willed page
            var url = 'https://entreprise.data.gouv.fr/api/rna/v1/full_text/' + associationName + '?per_page=' + PER_PAGE + '&page=' + pageRank + '&departement=' + associationDepartment;

            $http.get(url).
                success(function (data, status)  
                {                      
                    // CHECK OF THE HTTP REQUEST'S VALIDITY
                    if (status !== 200)
                    {
                        callback('Error during server request');
                        return;
                    }
        
                    if(!data || !data.association)
                    {
                        callback(null, result);
                        return;
                    }
                    
                    // We count all the occurences of the Associations given existing in the json retrieved
                    result.resultsBeforeFiltering = data.total_results;

                    //If the number of results is greater than the limit of results wanted
                    if(result.resultsBeforeFiltering > MAX_RESULTS_TO_COMPUTE)
                    {
                        // we send the "tooMuchvariable" variable to "true"
                        result.tooMuchResults = true;
                        callback(null, result);
                        return;
                    }   

                    var filteredArr = filterAssociation(data.association, associationName, associationDepartment);

                    result.resultsTable = result.resultsTable.concat(filteredArr);
                                                            
                    callback(null, result);
                })
                    
                .error(function (data, status)
                {
                    // When there is no result, we get back a 404 error 
                    if (status === 404)
                    {
                        callback(null, result);     
                        return;
                    }

                    callback('request error'); 
                });                       
        };

        var exports = 
        {
            /**
             * getAssociations search associations from associationName AND associationDepartment
             * if founded associations greater than 500, THROW an ErrorTooManyResult
             * @param {*} associationName The name of the association
             * @param {*} associationDepartment The department of the association (can be empty)
             * @return [] :    
             */
            getAssociations: function(associationName, associationDepartment, callback)
            {
                if(!associationName)
                {
                    callback('No association name to search during Request');
                }   

                // We declare the results object we will return to the association file
                var resultsToSend = {

                    tooMuchResults:             false,
                    resultsBeforeFiltering:     0,
                    resultsTable: [
                        // {
                        //     id: Number,
                        //     name1: String,
                        //     name2: String
                        //     address: String,
                        //     siret: Number,
                        //     naf: String,
                        //     department: Number,
                        //     legal_form: String,
                        //     rna: String,        
                        // 
                        // }
                    ],
                };                
                
                // WE GET THE FIRST PAGE OF RESULTS       
                getAllAssociations(associationName, associationDepartment, 1, function(err, result)
                {   
                    if(!associationName)
                    {
                        callback('No association name to search during Request');
                        return;
                    }

                    if(err)
                    {
                        callback(err);
                        return;
                    }    

                    if(result.tooMuchResults)
                    {
                        callback(null, result);
                        return;
                    }
                    
                    var totalPage = Math.ceil(result.resultsBeforeFiltering / PER_PAGE);
          
                    resultsToSend.resultsTable = resultsToSend.resultsTable.concat(result.resultsTable);

                    if(totalPage <= 1)
                    {    
                        callback(null, result);
                        return;
                    }                                    

                    var pageRank = 2;
                    var maxLoop = Math.min(totalPage, (MAX_RESULTS_TO_COMPUTE / PER_PAGE) ) + 1;

                    AsyncCallsSrv.asyncFor(pageRank, maxLoop, 
                        /*loopFunction*/ function(index, next)
                        {
                            getAllAssociations(associationName, associationDepartment, index, function(err, result)
                            {
                                if(err)
                                {
                                    next(err);
                                    return;
                                }
                                
                                resultsToSend.resultsTable = resultsToSend.resultsTable.concat(result.resultsTable);

                                next();
                            });
                        },
                        /*after all loop or in error case*/function(err)
                        {
                            if(err)
                            {
                                callback(err);
                                return;
                            }

                            callback(null, resultsToSend)
                            return;
                        }
                    );                    
                });                  
            }
        };

        return  exports;
    }
]);