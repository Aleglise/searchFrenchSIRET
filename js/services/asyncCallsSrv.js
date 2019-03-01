angular.module('api.asyncCalls', [])
.factory('AsyncCallsSrv', [
    function()
    {
        'use strict';

        var exports = 
        {
            /**
             * 
             * Launch a function in a loop depending on the min, max and function parameters given
             * @param {*} min           The value the loop start from 
             * @param {*} max           The value the loop stop to 
             * @param {*} loopFunction  The function that will be launched at each iteration
             * @param {*} callback      What the function returns
             */
            asyncFor: function(min, max, loopFunction, callback)
            {
                var i = min;
                var exec = function()
                {
                    if(i < max)
                    {
                        loopFunction(i, function(err)
                        {
                            if(err)
                            {
                                callback(err);
                                return;
                            }

                            i += 1;
                            exec();
                        });

                        return;
                    }

                    callback();
                };

                exec();
            }
        };

        return exports;
    }
]);


    