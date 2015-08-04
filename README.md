# radellite
*Radellite* is a webapp that is using *[rockets](https://github.com/rtheunissen/rockets)* to track reddit for specific keywords.

![screenshot](https://www.onli-blogging.de/uploads/radellite_clean2.png)

## Installation

Either clone this repo:

    git clone https://github.com/onli/radellite.git
    cd radellite

or install via npm:

    npm install radellite
    cd node-modules/radellite

In both cases, start with:
    
    npm start
    
The default port for the webserver is 3000. You can change it:

    npm config set radellite:port 3002
    
But radellite will also open a websocket server on port 3001 and this is not configurable yet.

## Usage

Immediately after startup, *radellite* subscribes to *rockets*, which then sends a copy of every reddit post and comment to it. It is highly recommended to not let it running like that too long, since the database will get big fast. Instead, open the page and set some keyword filters (keyword or regex) and the subreddits in which to search. They are OR-filters, which means every post and comment in all the specified subreddits that contain at least one keyword will be saved and displayed.
