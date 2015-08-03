 (function () {
    'use strict'
    NodeList.prototype.forEach = Array.prototype.forEach;
    HTMLCollection.prototype.forEach = Array.prototype.forEach;

    var n = {
        Feed: {
            loading_more: false,
            prependEntry: function(entry) {
                document.querySelector('#entries').insertBefore(document.createRange().createContextualFragment(entry), document.querySelector('#entries li:first-child'));
            },
            appendEntry: function(entry) {
                document.querySelector('#entries').appendChild(document.createRange().createContextualFragment(entry));
            },
            loadMoreEntries: function() {
                if (! n.Feed.loading_more) {
                    n.Feed.loading_more = true;
                    var http = new XMLHttpRequest();
                    
                    http.onreadystatechange = function() {
                        if (http.readyState == 4 && http.status == 200) {
                            var entries = JSON.parse(http.response);
                            entries.forEach(function(entry) {
                                n.Feed.appendEntry(entry);
                            });
                            n.Feed.loading_more = false;
                            n.Feed.updateMore();
                        }
                    }
                    http.open('GET', '/entries?startid=' + document.querySelector('#more').dataset['startid'], true);
                    http.send();
                }
            },
            updateMore: function() {
                var more = document.querySelector('#more');
                more.dataset['startid'] = document.querySelector('#entries li:last-child a').dataset['entryid'];
                
                setTimeout(function() { more.innerHTML = "Load more"; }, 1000);
            },
            checkLoadMore: function() {
                if (! n.Feed.check_block) {
                    n.Feed.check_block = true;
                    more.innerHTML = "Loading…";
                    setTimeout(function() { n.Feed.check_block = false; }, 300);
                    var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
                    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
                    var totalHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;

                    if (scrollPos + viewportHeight >= totalHeight - viewportHeight && document.querySelector('#more')) {
                        n.Feed.loadMoreEntries();
                    }
                }
            },
            getUpdates: function() {
                var wsurl;
                if (location.port) {
                    wsurl = 'ws://' + location.host.replace(location.port, '3001');
                } else {
                    wsurl =  'ws://' + location.host + ':3001';
                }
                var socket = new WebSocket(wsurl);
                socket.onmessage = function(msg){
                    n.Feed.prependEntry(msg.data)
                };
            }
        }
    }
        

    var contentLoaded = false;
    document.addEventListener('DOMContentLoaded', function() {
        var documentFragment = document.createRange().createContextualFragment("<div><button id='more'>Load more</button></div>");
        document.body.appendChild(documentFragment);
        n.Feed.updateMore();
        more.addEventListener('click', function() {
            n.Feed.checkLoadMore();
        });

        addEventListener('scroll', function() {
                                            n.Feed.checkLoadMore();
                                        }
        );
        n.Feed.getUpdates();
    });

    
    if (document.readyState == 'complete' || document.readyState == 'loaded' || document.readyState == 'interactive') {
        // since we load this async, we need sometimes to fire the already passed load event manually
        var event = document.createEvent('HTMLEvents');
        event.initEvent('DOMContentLoaded', true, true);
        if (! contentLoaded) {
            document.dispatchEvent(event);
        }
    }
}());