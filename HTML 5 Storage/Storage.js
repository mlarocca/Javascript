//require utils.js


/** StorageWrapper: a wrapper for HTML 5 local storage system.
        function store(key, value, sessionOnly): 
				stores value under the key "key" in localStorage, unless sessionOnly is true, when the value is stored
				in sessionStorage instead;
								* If key is undefined or null, nothing can be stored and the call returns;
								* If value is undefined, the key will be removed from storage;
								* If local storage isn't supported, or the storage quota has been met, it aborts the 
										request and return false;
								* If instead storage is successfull, return true.
                                                                                                        
        function load(key):             
				loads the value associated with key from local storage
								* If local storage isn't supported, or no such key has been stored return null;
								* If both sessionStore and localStore contains a value associated with key,
										the session version has precedence.                                                                                     
    */
if (!window.StorageWrapper){
    var StorageWrapper = (function(){
            "use strict";
            
            /** @param sessionOnly: if truthy the data will be stored for this session only, otherwise it will be persistent for the page
              */
            function store(key, value, sessionOnly){
                    if (key === undefined || key === null ){        //At least the key must be defined and not null, but might be 0
                            return false;
                    }
                    //Tests if sessionStorage is supported: otherwise tries to use persistent storage
                    if (sessionOnly && typeof sessionStorage !== undefined){
                            if (value === undefined){       //Deletes the previous item, if any
                                    try{
                                            sessionStorage.removeItem(key);
                                    }catch(e){
                                            return false;
                                    }
                            }else{
                                    try{
                                            sessionStorage[key] = value;
                                    }catch(e){
                                            //Browser's storage quota might be exhausted
                                            return false;
                                    }                       
                            }
                    }else{
                            if (typeof localStorage === undefined){
                                    //HTML5 local storage unsopported: you might want to go back to cookies, but it's up to the caller
                                    return false;
                            }
                            if (value === undefined){       //Deletes the previous item, if any
                                    try{
                                            localStorage.removeItem(key);
                                    }catch(e){
                                            return false;
                                    }
                            }else{
                                    try{
                                            localStorage[key] = value;
                                    }catch(e){
                                            //Browser's storage quota might be exhausted
                                            return false;
                                    }                       
                            }
                    }
                    return true;
            }
            
            function remove(key, sessionOnly){
                return store(key, undefined, sessionOnly);
            }
            

            function load(key){
                    if (key === undefined || key === null){ //At least the key must be defined and not null, but might be 0
                            return null;
                    }
                    //Tests session storage first (session version have precedence over persistent one):
                    if (typeof sessionStorage !== undefined && sessionStorage[key]){
                            //HTML5 local storage unsopported: you might want to go back to cookies, but it's up to the caller
                            return sessionStorage[key];
                    }
                    //else: not found in sessionStorage
                    if (typeof localStorage !== undefined && localStorage[key]){
                            //HTML5 local storage unsopported: you might want to go back to cookies, but it's up to the caller
                            return localStorage[key];
                    }//else:        Not found in localStorage either
                    
                    return null;
            }       
            
            var storage_proto = {
                    store: store,
                    remove: remove,
                    load: load
            };
            
            Object.freeze(storage_proto);
            return Object.create(storage_proto);
    })();
}

if (!window.IPStorageHandler){
    /** IPStorageHandler - Singleton Obj
            Obj's Interface exposes 5 methods:
            *       enterIP(sessionOnly)    
                            Asks to insert a valid IP through promptFunction (by default, the js prompt function)
                            The IP gets validated: IPv4 formatting only admitted, and for each of the four part
                            of the address it will be checked if they are in the valid range.
                            Return true iff the operation was complited and is saved on localStorage (or sessionStorage)
                            If sessionOnly is passed and it's "truthy", saves the data on sessionStorage instead that on localStorage.
                                            
            *       enterSessionIP()        
                            shortcut for enterIP(true)
                            
            *       getIP(enterOnMiss)
                            Returns the value saved for the IP address field:
                                If there is a field saved both on sessionStorage and localStorage, the sessionStorage one has
                                higher priority;
                                If no value at all is saved for the field, not even in localStorage, automatically calls enterIP(), unless enterOnMiss
                                is an expression that evaluates to false;
                                In both cases, returns the value finally stored on HTML 5 local storage, if any, or null otherwise (returning null 
                                is preferred to throwing an exception here, and checking is deferred to the caller)

            *       removeIP() 
                            Deletes the value for the IP field saved in localStorage (NOT the one in sessionStorage - WARNING the value in sessionStorage
                                will be erased anyway when the current page is closed);
            
            *       removeSessionIP() 
                            Deletes the value for the IP field saved in sessionStorage (NOT the one in localStorage - WARNING the value in localStorage 
                                will be kept even when the current page will be closed, and shared with other pages open on the same browser)
      */
    var IPStorageHandler = (function(storageWrapper, promptFunction, alertFunction){
            "use strict";
            
            var IP_STORAGE_KEY = 'SERVER_IP';
            var IP_REG_EX = /^((\d){1,3}.){3,3}(\d){1,3}$/;

            if (!promptFunction || !Utils.isFunction(promptFunction) ){   //In case it's undefined or null
                    promptFunction = prompt;
            }
            
            if (!alertFunction || !Utils.isFunction(alertFunction)){      //In case it's undefined or null
                    alertFunction = alert;
            }
            
    //<UTILITY (private) FUNCTIONS, not exposed in the interface>
            /** Stores the server IP
                    @param sessionOnly: if truthy the data will be stored for this session only, otherwise it will be persistent for the page
              */
            function storeServerIP(IP, sessionOnly){
                    return storageWrapper.store(IP_STORAGE_KEY, IP, sessionOnly);
            }

            function loadServerIP(){
                    return storageWrapper.load(IP_STORAGE_KEY);
            }
            
            /** Stores the server IP in the session storage only
                    @param sessionOnly: if truthy the data will be stored for this session only, otherwise it will be persistent for the page
              */
            function storeServerIPInSession(IP, sessionOnly){
                    return storeServerIP(IP, true);
            }

            function isValidIP(ip){
                    if (!IP_REG_EX.test(ip)){
                            return false;
                    }
                    //INVARIANT: at this point the ip string is well formatted! We still need to check every chunck is in the range 0 to 255
                    return ip.split('.').map(function(token){
                                                    //Value is certainly non negative if the invariant is met( if the string is well formatted)
                                                    return parseInt(token, 10) <= 255;
                                            }).indexOf(false) < 0;
            }
    //</>

    //INTERFACE functions
            
            function getIP(enterOnMiss){
                    var res = loadServerIP();
                    if (res === null){
                            if (enterOnMiss === false){
                                    //No need to enter it if it's not present
                                    return null;
                            }else{
                                    return enterIP();
                            }
                    }else{
                            return res;
                    }
            }
            
            function enterIP(sessionOnly){
                    var ip = promptFunction("Enter IP address","Please enter a properly formatted IP address");
                    if (!ip){       //Operation aborted by the user
                            return null;
                    }
                    //else: A value has been entered and operation has been confirmed

                    if (! isValidIP(ip) ){  //Validates the inserted IP
                            alertFunction("The IP address isn't well formatted");
                            return null;
                    }else{
                            //Well formed IP
                            if (sessionOnly){
                                    //Stores the IP only for the current session
                                    if (storeServerIPInSession(ip)){        //Successfully stored
                                            return ip;
                                    }else{
                                            return null;
                                    }                               
                            }else{
                                    if (storeServerIP(ip)){ //Successfully stored
                                            return ip;
                                    }else{
                                            return null;
                                    }
                            }
                    }
            }
                    
            function enterSessionIP(){
                    return this.enterIP(true);
            }       
            
            function removeIP(){
                    //To remove a value, you can call StoreWrapper.strore with an undefined value parameter
                    return storeServerIP();
            }
            
            function removeSessionIP(){
                    //To remove a value, you can call StoreWrapper.strore with an undefined value parameter
                    return storeServerIP(undefined, true);
            }       
            
            var storage_proto = {
                    enterIP: enterIP,
                    getIP: getIP,
                    enterSessionIP: enterSessionIP,
                    removeIP: removeIP,
                    removeSessionIP: removeSessionIP
            };
            
            Object.freeze(storage_proto);
            return Object.create(storage_proto);
    })(StorageWrapper);
}