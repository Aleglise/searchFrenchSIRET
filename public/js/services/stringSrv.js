angular.module('api.string', [])
.factory('stringSrv', [
    function()
    {
        'use strict';
        
        //Constant that contains all the caracters that needs to be changed with the replacement value
        var WRONGCHARACTERS = 
        {
            /*
            ['À','Á','Â','Ã','Ä','Å', 'Æ']:'A',
            ['Š','ß' ]:'S',
            ['Ò','Ó','Ô','Õ','Õ','Ö','Ø','Œ', 'Ð']:['O','O','O','O','O','O','O','O'],
            ['È','É','Ê','Ë' ]:'E',
            ['Ç']:'C',
            ['Ì','Í','Î','Ï']:'I',
            ['Ù','Ú','Û','Ü']:'U',
            ['Ñ']:'N',
            ['Ÿ']:'Y',
            ['Ž']:'Z',
            ['.','!','@','#','$','^','&','%','*','(',')','+','=','-','[',']','\','/','{','}','|',':','<','>','?',',']:'',
            ["'"]:' ',
            */
            
            '.':'',

            '\'':' ',
            '!':' ',
            '@':' ',
            '#':' ',
            '$':' ',
            '^':' ',
            '&':' ',
            '%':' ',
            '*':' ',
            '(':' ',           
            ')':' ',
            '+':' ',
            '=':' ',
            '-':' ',
            '[':' ',
            ']':' ',
            '\\': ' ',
            '/':' ',
            '{':' ',
            '}':' ',
            '|':' ',
            ':':' ',
            '<':' ',
            '>':' ',
            '?':' ',
            ',':' ',
            'š':'s',
            'œ':'o',
            
            'ž':'z',
            'µ':'u',
            'ß':'s',
            'à':'a',
            'á':'a',
            'â':'a',
            'ã':'a',
            'ä':'a',
            'å':'a',
            'æ':'a',
            'ç':'c',
            'è':'e',
            'é':'e',
            'ê':'e',
            'ë':'e',
            'ẽ':'e',
            'ì':'i',
            'í':'i',
            'î':'i',
            'ï':'i',
            'ĩ':'i',
            'ð':'o',
            'ñ':'n',
            'ò':'o',
            'ó':'o',
            'ô':'o',
            'õ':'o',
            'ö':'o',
            'ø':'o',
            'ù':'u',
            'ú':'u',
            'û':'u',
            'ü':'u',
            'ý':'y',
            'ÿ':'y',

            'À':'A',
            'Á':'A',
            'Â':'A',
            'Ã':'A',
            'Ä':'A',
            'Å':'A',
            'Ò':'O',
            'Ó':'O',
            'Ô':'O',
            'Õ':'O',
            'Õ':'O',
            'Ö':'O',
            'Ø':'O',
            'È':'E',
            'É':'E',
            'Ê':'E',
            'Ë':'E',
            'Ç':'C',
            'Ð':'D',
            'Ì':'I',
            'Í':'I',
            'Î':'I',
            'Ï':'I',
            'Ù':'U',
            'Ú':'U',
            'Û':'U',
            'Ü':'U',
            'Ñ':'N',
            'Š':'S',
            'ß':'S',
            'Ÿ':'Y',
            'Ž':'Z',            
        };

        var exports = 
        {
            /**
             * CHECK IF THE STRING GIVEN IS A MEMBER OF THE TOCOMPARE VALUE
             * 
             * If the string given is a member of toCompare  : return "false" statement
             * On the opposite: return "true" statement
             * 
             * @param {*} string 
             * @param {*} ToCompare 
             * @return {*} "true" or "false" statement
             */
            isStringMemberOf : function(string, toCompare)
            {
                if(!string)
                {
                    return;

                }

                // if the word is in the list of banned words
                if(toCompare.indexOf(string) === -1)
                {
                    return false; 
                }
                else
                {
                    return true;
                }
            },
        
             /**
             * REMOVE ALL ACCENTS AND SPECIAL CHARACTERS OF A WORD GIVEN TO RETURN THE WORD ONLY WITH LETTERS? NUMBER AND SPACES
             * 
             * 
             * @param {*} word 
             * @returns {*} newWord "true" or "false" statement
             */
            keepOnlyLettersAndNumbers: function(word)
            {
                if(!word)
                {
                    return '';
                }  

                // We create the normalizedWord, a copy of the initial word, it will be the one to be normalized
                var newWord = '';

                // For each character of the word
                word.split('').forEach(function(charac) {
                    // If the character is a member of the WRONGCHARACTERS array
                    if (WRONGCHARACTERS[charac] !== undefined)
                    {
                        // Add the corrected version of the character into the normalizedWord variable
                        newWord += WRONGCHARACTERS[charac];
                    }
                    else                
                    {
                        // Add the current character into the normalizedWord variable
                        newWord += charac;
                    }                
                });

                // Once the loop id ended, we return the normalizedWord after filtering it if it's composed of many words after the previous filter
                return newWord;
            },

            /**
             * This function get two string and compare if the words of the first one are members of the second
             * 
             * @param {*} wordsToLookFor String whose words must be find into the stringToCheck variable
             * @param {*} stringToCheck  String wich has its words being  compared with the wordsToLookFor variable
             */        
            doAllWordsMatch: function(wordsToLookFor,stringToCheck)
            {
                if(!wordsToLookFor || !stringToCheck)
                {
                    return false;
                }
    
                // We start by starting from the assumption that all words are there
                var AllWordsAreThere = true;
                
                var wordsArray = wordsToLookFor.toString().split(' ');
                
                // For each word that composes the first string
                for(var i = 0; i < wordsArray.length ; i++)
                {    
                    // If one of te words isn't present in one of the two     
                    if(stringToCheck.indexOf(wordsArray[i]) === -1)
                    {
                        // The areAllWordsThere variable is set to false
                        AllWordsAreThere = false;
                        i = wordsArray.length;
                    }
                }
                       
                // Return as a value the boolean AllWordsAreThere variable
                return AllWordsAreThere;
            }

        };

        return exports;
    },
]);


    