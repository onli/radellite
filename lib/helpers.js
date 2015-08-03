(function() {
    var Helpers;

    Helpers = (function() {

        function Helpers() {
            
        }
        
        Helpers.prototype.url = function(url, req) {
            return 'http://' + req.headers.host + url;
        }

        Helpers.prototype.baseUrl = function() {
            return 'http://' + host + ":"+ port
        }

        return Helpers;
    })();

    module.exports = new Helpers();
    
}).call(this);

