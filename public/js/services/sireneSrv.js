angular.module('api.sirene', [])
.factory('SireneSrv', [ '$http', 'AsyncCallsSrv','stringSrv',
     function($http, AsyncCallsSrv, stringSrv,/*otherService*/)
    {
        'use strict';

        // The number of result per page wanted
        var PER_PAGE = 100;
        
        // The maximum number of result to comput (Do not exceed 5 pages of results in its current state)
        var MAX_RESULTS_TO_COMPUTE = 5 * PER_PAGE; // should be a multiple of PER_PAGE
        
        var ENTERPRISES_LEGAL_FORMS_WORDS = [
            'SOCIETE',
        ];
        
        //An array containing all the naf code that are supposed to be naf code of craftmen
        var CRAFTMEN_NAF_CODE = 
        [
            '162Z',
            '729Z',
            '811Z',
            '812Z',
            '891Z',
            '892Z',
            '893Z',
            '899Z',
            '990Z',
            '011Z',
            '1012Z',
            '1013A',
            '1013B',
            '1020Z',
            '1031Z',
            '1032Z',
            '1039A',
            '1039B',
            '1041A',
            '1041B',
            '1042Z',  
            '1051A',
            '1051B',
            '1051C',
            '1051D',
            '1052Z',
            '1061A',
            '1061B',
            '1062Z',
            '1071A',
            '1071C',
            '1071D',
            '1072Z',
            '1073Z',
            '1081Z',
            '1082Z',
            '1083Z',
            '1084Z',
            '1085Z',
            '1086Z',
            '1089Z',
            '1091Z',
            '1092Z',
            '1101Z',
            '1102A',
            '1103Z',
            '1104Z',
            '1105Z',
            '1106Z',
            '1107A',
            '1107B',
            '1310Z',
            '1320Z',
            '1330Z',
            '1391Z',
            '1392Z',
            '1393Z',
            '1394Z',
            '1395Z',
            '1396Z',
            '1399Z',
            '1411Z',
            '1412Z',
            '1413Z',
            '1414Z',
            '1419Z',
            '1420Z',
            '1431Z',
            '1439Z',
            '1511Z',
            '1512Z',
            '1520Z',
            '1610A',
            '1610B',
            '1621Z',
            '1622Z',
            '1623Z',
            '1624Z',
            '1629Z',
            '1711Z',
            '1712Z',
            '1721A',
            '1721B',
            '1721C',
            '1722Z',
            '1723Z',
            '1724Z',
            '1729Z',
            '1812Z',
            '1813Z',
            '1814Z',
            '1820Z',
            '1910Z',
            '1920Z',
            '2011Z',
            '2012Z',
            '2013A',
            '2013B',
            '2014Z',
            '2015Z',
            '2016Z',
            '2017Z',
            '2020Z',
            '2030Z',
            '2041Z',
            '2042Z',
            '2051Z',
            '2052Z',
            '2053Z',
            '2059Z',
            '2060Z',
            '2110Z',
            '2120Z',
            '2211Z',
            '2219Z',
            '2221Z',
            '2222Z',
            '2223Z',
            '2229A',
            '2229B',
            '2311Z',
            '2312Z',
            '2313Z',
            '2314Z',
            '2319Z',
            '2320Z',
            '2331Z',
            '2332Z',
            '2341Z',
            '2342Z',
            '2343Z',
            '2344Z',
            '2349Z',
            '2351Z',
            '2352Z',
            '2361Z',
            '2362Z',
            '2363Z',
            '2364Z',
            '2365Z',
            '2369Z',
            '2370Z',
            '2391Z',
            '2399Z',
            '2410Z',
            '2420Z',
            '2431Z',
            '2432Z',
            '2433Z',
            '2434Z',
            '2441Z',
            '2442Z',
            '2443Z',
            '2444Z',
            '2445Z',
            '2446Z',
            '2451Z',
            '2452Z',
            '2453Z',
            '2454Z',
            '2511Z',
            '2512Z',
            '2521Z',
            '2529Z',
            '2530Z',
            '2540Z',
            '2550A',
            '2550B',
            '2561Z',
            '2562A',
            '2562B',
            '2571Z',
            '2572Z',
            '2573A',
            '2573B',
            '2591Z',
            '2592Z',
            '2593Z',
            '2594Z',
            '2599A',
            '2599B',
            '2611Z',
            '2612Z',
            '2620Z',
            '2630Z',
            '2640Z',
            '2651A',
            '2651B',
            '2652Z',
            '2660Z',
            '2670Z',
            '2680Z',
            '2711Z',
            '2712Z',
            '2720Z',
            '2731Z',
            '2732Z',
            '2733Z',
            '2740Z',
            '2751Z',
            '2752Z',
            '2790Z',
            '2811Z',
            '2812Z',
            '2813Z',
            '2814Z',
            '2815Z',
            '2821Z',
            '2822Z',
            '2823Z',
            '2824Z',
            '2825Z',
            '2829A',
            '2829B',
            '2830Z',
            '2841Z',
            '2849Z',
            '2891Z',
            '2892Z',
            '2893Z',
            '2894Z',
            '2895Z',
            '2896Z',
            '2899A',
            '2899B',
            '2910Z',
            '2920Z',
            '2931Z',
            '2932Z',
            '3011Z',
            '3012Z',
            '3020Z',
            '3030Z',
            '3040Z',
            '3091Z',
            '3092Z',
            '3099Z',
            '3101Z',
            '3102Z',
            '3103Z',
            '3109A',
            '3109B',
            '3211Z',
            '3212Z',
            '3213Z',
            '3220Z',
            '3230Z',
            '3240Z',
            '3250A',
            '3250B',
            '3291Z',
            '3299Z',
            '3311Z',
            '3312Z',
            '3313Z',
            '3314Z',
            '3315Z',
            '3316Z',
            '3317Z',
            '3319Z',
            '3320A',
            '3320B',
            '3320C',
            '3320D',
            '3700Z',
            '3812Z',
            '3821Z',
            '3822Z',
            '3831Z',
            '3832Z',
            '3900Z',
            '4120A',
            '4120B',
            '4211Z',
            '4212Z',
            '4213A',
            '4213B',
            '4221Z',
            '4222Z',
            '4291Z',
            '4299Z',
            '4311Z',
            '4312A',
            '4312B',
            '4313Z',
            '4321A',
            '4321B',
            '4322A',
            '4322B',
            '4329A',
            '4329B',
            '4331Z',
            '4332A',
            '4332B',
            '4332C',
            '4333Z',
            '4334Z',
            '4339Z',
            '4391A',
            '4391B',
            '4399A',
            '4399B',
            '4399C',
            '4399D',
            '4399E',
            '4520A',
            '4520B',
            '4540Z',
            '4722Z',
            '4723Z',
            '4729Z',
            '4776Z',
            '4781Z',
            '4789Z',
            '4932Z',
            '4942Z',
            '5221Z',
            '5610A',
            '5610C',
            '5819Z',
            '7120A',
            '7311Z',
            '7410Z',
            '7420Z',
            '8020Z',
            '8121Z',
            '8122Z',
            '8129A',
            '8129B',
            '8211Z',
            '8219Z',
            '8292Z',
            '8690A',
            '9001Z',
            '9003A',
            '9511Z',
            '9512Z',
            '9521Z',
            '9522Z',
            '9523Z',
            '9524Z',
            '9525Z',
            '9529Z',
            '9601A',
            '9601B',
            '9602A',
            '9602B',
            '9603Z',
            '9609Z',
        ];

        // Constant that contains all the words that shouldn't be in the establishment's name while requesting the apis
        var BANNEDWORDS = [
            'MADAME',
            'MONSIEUR',   
            'ASSOCIATION',
            'SOCIETE',
            'AUTO ENTREPRENEUR', 
            'ENTREPRISE',
            'ETS',
            'EIRL',
            'SA', //enleve le déterminant 'SA' contenu dans certains noms d'entreprise ( a chacun sa balle, sa maison alskanor )
            'SAS',
            'SARL',
            'SASU',
            'BPC',
            'AE',
            'EARL',
            'EI' , 
            'EURL',
            'SC',
            'SCA',
            'SCEA',
            'SCI',
            'SCIC',
            'SCICV',
            'SCM',
            'SCOP',
            'SCP',
            'SCS',
            'SELAF',
            'SELARL',
            'SELAS',
            'SELCA',
            'SEM',
            'SEML',
            'SEP',
            'SICA',
            'SMHF',
            'SNC',
            'SPRL',
            'SPFPL',
        ];

        /**
         * Format the given company's data
         * 
         * @param {*} enterprise The enterprise choosen in the page
         * @return {};
         */
        var intiaFormatSirene = function (establishment)
        {
            if(!establishment)
            {
                return {};
            }

            var data = {
                id:                 establishment.id,
                name1 :             establishment.l1_normalisee,
                name2 :             establishment.l2_normalisee,
                social_reason :     establishment.nom_raison_sociale,
                address:            establishment.l4_normalisee,
                city:               establishment.libelle_commune,
                siret:              establishment.siret,
                siren:              establishment.siren,
                naf:                establishment.activite_principale,
                department:         establishment.departement,
                postal_code:        establishment.code_postal,
                legal_form:         establishment.libelle_nature_juridique_entreprise,
                rna:                establishment.numero_rna,
                rm:                 '',
                rcs:                '',
                nafa:               establishment.activite_principale_registre_metier,
                updateDate:         establishment.updated_at,
                // nom_raison_sociale
                // search: l1_n + '\n' + l2_n + '\n' + l3_n + '\n' + l4_n + '\n' + l5_n + '\n' + l6_n,
                // address_declare: l1_d + '\n' + l2_d + '\n' + l3_d + '\n' + l4_d + '\n' + l5_d + '\n' + l6_d
            };

            return data;
        };

        /**
         * Remove all special characters, accents and words considered as to be banned of the given establishmentName and return the new string formed
         * @param {*} establishmentName Name of the establishment seeked 
         * @Returns establishmentNameTable
         */
        var establishmentNameFormating = function(establishmentName)
        {
            if(!establishmentName)
            {
                return '';
            }
           
            // We initialize a establishmentNameTable that will contain all the accepted words of the establishmentName
            var establishmentNameTable = [];

            // We remove all special characters and accents of the upperCased establishmentName. Then we divide the establishmentName in words and for each word
            stringSrv.keepOnlyLettersAndNumbers(establishmentName.toUpperCase()).split(' ').forEach(function(word)
            {
                // If the word is at least two character long and isn't banned            
                if (word.length >1 && !stringSrv.isStringMemberOf(word, BANNEDWORDS))
                {
                    establishmentNameTable.push(word);
                }
            });

            // We create a new string composed of all the words in establishmentNameTable
            return establishmentNameTable.join(' ');
        };

        /**
         * Check if the name of the searched establishment match the names of the enterprise given
         * 
         * @param {*} name The value used to filter the establishment object
         * @param {*} ent the establishment object
         * 
         * @returns isCandidate(Boolean)
         */            
        var isEstablishmentCandidate = function(name, establishment)
        {
            if(!name || !establishment)
            {
                return false;
            }
        
            var candidateFields = [establishment.name1, establishment.name2, establishment.social_reason];
            
            // We start by assuming that the establishment isn't candidate
            var isCandidate = false;

            // For each fields to compare the given value with
            for(var i = 0; i<candidateFields.length; i++)
            {
                // We normalize the establishment field value in case of an api returning some non normalized characters in its result
                var normalizedFieldValue = establishmentNameFormating(candidateFields[i]);

                // If all words of the value variable are members of the normalizedFieldValue
                if(stringSrv.doAllWordsMatch(name, normalizedFieldValue))
                {
                    //We declare the establishment as being candidate
                    isCandidate = true;

                    //We stop the loop
                    i = candidateFields.length;
                }
            }
            
            return isCandidate;        
        };
        
        /**
         * For each enterprise in the Json:
         * 
         * Call the intiaFormatSirene() function to format the company's data
         * 
         * Call the isEstablishmentCandidate() function to check if the company given has in its name variables the name parameter
         * 
         * Return a table of result containing all the fromated companiy corresponding to the 
         *   
         * @param {*} arr 
         * @param {*} name 
         */
        var filterEstablishment = function(arr, name)
        {
            if(!arr || !name)
            {
                return;
            }

            name = name.toUpperCase();

            var filteredArr = [];

            // for each company of the first page
            arr.forEach(function(establishment) {
                // We check if the company name really is similar to the establishment's
                var myEstablishment = intiaFormatSirene(establishment);

                if(isEstablishmentCandidate(name, myEstablishment))
                {
                    // If it is, we push the company information into the enterprises result table
                    filteredArr.push(myEstablishment);
                }
            });

            return filteredArr;
        };


        /**
         * Take an establishment's data and give a value to the rcs or rm field depending if the establishment is a company's or a craftmen's
         * If the establishment if a association's, it does nothing because the field having value is enough to determine the establishment is an association's
         * If the establishment if a company's, it set the rcs field the value of the 'city' field
         * If the establishment if a craftman's, it set the rm field the value of the 'department' field
         * 
         * @param {*} establishment 
         */       
        var setEstablishmentType = function(establishment)
        {
            if(!establishment)
            {
                return;
            }

            if(!establishment.rna)
            {    
                // We start from the assumption that the establishment isn't an enterprise           
                var isAnEnterprise = false;

                // If the establishment has no nafa code (this field having a value directly means that establishment is a craftman's )
                if(!establishment.nafa)
                {
                    // If the legal_form of the establishment is not null we check if it has word meaning that the establishment is  a craftman's
                    if(establishment.legal_form)
                    {
                        // We uppercase the legal form of the establishment, keep only letters, special caracters and spaces before splitting it by words in a table
                        var legalFormArray = stringSrv.keepOnlyLettersAndNumbers((establishment.legal_form).toUpperCase()).split(' ');

                        // For each word in the legalFormArray table
                        for(var i = 0; i < legalFormArray.length ; i++)
                        {    
                            // If the word is a member of the ENTERPRISES_LEGAL_FORMS_WORDS (meaning that the establishment is an enterprise's)
                            if(stringSrv.isStringMemberOf(legalFormArray[i],ENTERPRISES_LEGAL_FORMS_WORDS))
                            {
                                // We consider that the establishment is an enterprise
                                isAnEnterprise = true; 

                                // We set the end of the loop
                                i=legalFormArray.length;
                            }                         
                        }
                    }

                    // If we still don't know if the establishment is an enterprise on not 
                    if(!isAnEnterprise)
                    {
                        // If the naf code is not a member of the CRAFTMEN_NAF_CODE (meaning that the establishment isn't a enterprise's)
                        if(CRAFTMEN_NAF_CODE.indexOf(establishment.naf) === -1)
                        {
                            // We consider that the establishment is a craftman's
                            isAnEnterprise = true; 
                        }
                    }
                }

                // If the establishment happend to be an enterprise
                if(isAnEnterprise)
                {
                    // We set the value of the establishment rcs field to the city field's
                    establishment.rcs = establishment.city;
                }
                // If not, the establishment is considered as a craftman's and so
                else
                {
                    // We set the value of the establishment rm field to the department field's
                    establishment.rm = establishment.department;
                }                   
            }
            
            // We return the establishment object
            return establishment;
        };

        /**
        * Function that get each enterprise of the results page
        * @param {*} pageRank 
        * @throw Error if request unvalid or error while contacting the server
        */
        var getAllEstablishments = function (establishmentName, establishmentDepartment, pageRank, callback)
        {
            if(!establishmentName)
            {
                callback('Error during server request');
                return;
            }
           
            var result = {
                tooMuchResults:             false,
                resultsBeforeFiltering:     0,
                resultsTable:               []
            };
   
            establishmentName = establishmentNameFormating(establishmentName);

            if(!establishmentName || establishmentName.length < 3)
            {
                callback('name not adapted');
                return;
            }

            // We create a new http request specifying the rank of the willed page
            var url = 'https://entreprise.data.gouv.fr/api/sirene/v1/full_text/' + establishmentName + '?per_page=' + PER_PAGE + '&page=' + pageRank + '&departement=' + establishmentDepartment;
            $http.get(url).
                success(function (data, status)  
                {                      
                    // CHECK OF THE HTTP REQUEST'S VALIDITY
                    if (status !== 200)
                    {
                        callback('Error during server request');
                        return;
                    }
        
                    if(!data || !data.etablissement)
                    {
                        callback(null, result);
                        return;
                    }
                    
                    // We count all the occurences of the establishments given existing in the json retrieved
                    result.resultsBeforeFiltering = data.total_results;

                    // If the number of results is greater than the limit of results wanted
                    if(result.resultsBeforeFiltering > MAX_RESULTS_TO_COMPUTE)
                    {
                        // we send the 'tooMuchvariable' variable to 'true'
                        result.tooMuchResults = true;
                        callback(null, result);
                        return;
                    }   

                    var filteredArr = filterEstablishment(data.etablissement, establishmentName);

                    // We use the setEstablishmentType() function on each establishment of the filterdArr with the map() function array before concat result.resultsTable and filteredArr
                    result.resultsTable = result.resultsTable.concat(filteredArr.map(function(establishment) {
                        setEstablishmentType(establishment);
                    }));
                                            
                    callback(null, result);
                    return;
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
                    return;
                });                       
        };

        var exports = 
        {
            /**
             * getEstablishments search enterprises from establishmentName AND establishmentDepartment
             * if founded enterprises greater than 500, THROW an ErrorTooManyResult
             * @param {*} establishmentName The name of the establishment
             * @param {*} establishmentDepartment The department of the establishment (can be empty)
             * @return [] :    
             */
            getEstablishments: function(establishmentName, establishmentDepartment, callback)
            {
                if(!establishmentName)
                {
                    callback('No establishment name to search during Request');
                    return;
                }       

                // We declare the results object we will return to the estasblishment file
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
                    ]
                };
                
                // WE GET THE FIRST PAGE OF RESULTS       
                getAllEstablishments(establishmentName, establishmentDepartment, 1, function(err, result)
                {   
                    if(!establishmentName)
                    {
                        callback('No establishment name to search during Request');
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
                            getAllEstablishments(establishmentName, establishmentDepartment, index, function(err, result)
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


