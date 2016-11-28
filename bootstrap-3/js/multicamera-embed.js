/**
 * Created by: Leon Gordin
 * Copyright: Panda O.S. Ltd.
 */

/**
 * include bamboo player
 **/
var bambooPlayer = bambooPlayer || {};
(function () {
    var u = "/api/embed2";
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];g.type = 'text/javascript';g.async = true;g.defer = true;g.src = u;s.parentNode.insertBefore(g, s);
    bambooPlayer.loaded = function (e) {
        initMultiAnglePlayer();
    }
})();

/**
 * variables
 **/
var firstEntry = {};
var playlistPlayer = {};
var globalPlayheadTime = 0;

/**
 * main function
 **/
function initMultiAnglePlayer() {
    var params = getSearchParameters();
    var refId = typeof params.refId != 'undefined' ? params.refId : null;
    var playlistId = typeof params.playlistId != 'undefined' ? params.playlistId : null;
    var embedOptions = getEmbedOptions();
    playlistPlayer = embedOptions.targetId;

    var url = '';
    if(refId) {
        url = '/api/playlist?format=json&filter={"referenceIdEqual": "' + refId + '"}';
    } else {
        url = '/api/playlist?format=json&filter={"idEqual": "' + playlistId + '"}';
    }
    jQuery.getJSON(url, function(data) {
        if(typeof data.data != 'undefined' && data.data.length) {
            var playlistObj = data.data[0];

            if(typeof playlistObj != 'undefined' && playlistObj.id && playlistObj.name) {

                jQuery("#playlist-name").text(playlistObj.name);

                //globalService.isPathDefined($scope.playerConfig, "widget.flashvars.playlistAPI", false, true); //Define path if not define might not work
                //embedOptions.flashvars.playlistAPI.kpl0Id = playlistObj.id;
                //embedOptions.flashvars.playlistAPI.kpl0Name = playlistObj.name;

                var url = "/api/playlist/" + playlistObj.id + "/entries?format=json";
                jQuery.getJSON(url, function(data) {
                    if(typeof data.data != 'undefined' && data.data.length) {
                        firstEntry = data.data[0];
                        // remove first element
                        embedOptions['entry_id'] = firstEntry.id;
                        embedOptions.flashvars.mediaProxy = {
                            "sources": [
                                {
                                    "src": "/api/entry/" + firstEntry.id + "/flavors/playlist.m3u8",
                                    "type": "application/vnd.apple.mpegurl"
                                }
                            ]

                        }
                        bambooPlayer.embed(embedOptions, handlePlayerEvent);
                        initPlaylistUi(data.data, 'playListHolder');
                    }
                });
            }
        }
    });
}

/**
 * playlist thumbs init
 **/
function initPlaylistUi(entries, container) {
    $container = jQuery('#' + container);
    var entry;
    for(var i in entries) {
        entry = entries[i];

        $elem = jQuery(
            '<div class="entry-thumb-container ' + ( i == 0 ? 'active' : '' ) + '" data-entry-id="' + entry.id + '">' +
            '<div class="k-thumb" alt="Thumbnail for ' + entry.name + '" style="background-image:url(\'/api/entry/' + entry.id + '/thumbnail/?width=100&slices=100&sprite=true\')"></div>' +
            '<span class="k-title-container" title="' + entry.name + '">' + entry.name + '</span>' +
            '</div>'
        );

        $elem.click(function(e) {
            var entryId = jQuery(this).attr('data-entry-id');
            jQuery('.entry-thumb-container').removeClass('active');
            jQuery(this).addClass('active');
            changeMedia(entryId);
        });
        $container.append($elem);
    }

}

/**
 * thumb click callback
 **/
function changeMedia(entryId) {
    bambooPlayer.invoke(playlistPlayer, 'changeMedia', { "mediaProxy": {
        "entry": {
            "id": entryId
        },
        "sources": [
            {
                "src": "/api/entry/" + entryId + "/flavors/playlist.m3u8",
                "type": "application/vnd.apple.mpegurl"
            }
        ]}
                                                       } );
}

/**
 * embed options configuration
 **/
function getEmbedOptions() {
    // callback player loaded
    return {
        "targetId": "bamboo_player_1",
        "enableAngleSelection": true,
        "flashvars": {
            "autoPlay": true,
            'loadingSpinner.plugin': true,
            "scrubber": {
                "plugin": true,
                "disableUntilFirstPlay": true,
                "thumbSlicesUrl": "/api/entry/{mediaProxy.entry.id}/thumbnail/?width=100&slices=100&sprite=true"
            },
            "sourceSelector": {
                "plugin": false
            },
            "liveStatus": {
                "plugin": false
            },
            "liveCore": {
                "plugin": false
            }
        }
    };

}

/**
 * player event callback. Add player events handling here if needed
 **/
function handlePlayerEvent(playerObj) {
    // playhead update callback
    bambooPlayer.bind(playerObj, 'playerUpdatePlayhead', function (e) {
        handleUpdatePlayhead(e);
    });
};


/**
 * Example how to call play function
 * @param playerId string
 */
function doPlay(playerId) {
    bambooPlayer.invoke(playerId, 'doPlay');
}

/**
 * Example how to call pause function
 * @param playerId string
 */
function doPause(playerId) {
    bambooPlayer.invoke(playerId, 'doPause');
}


function doSeek(playerId, seconds) {
    bambooPlayer.invoke(playerId, 'doSeek', seconds);
}


/**
 * get querystring parameters
 **/
function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

/**
 * helper func
 **/
function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}


/**
 * player playhead update event handler
 **/
function handleUpdatePlayhead(time) {
    // update once a second
    if(globalPlayheadTime != parseInt(time)) {
        globalPlayheadTime = parseInt(time);
        var duration = bambooPlayer.evaluate(playlistPlayer, '{duration}');
        var position = Math.round(globalPlayheadTime / duration * 100);
        jQuery("#playListHolder .k-thumb").css({
            'background-position': position * 100 + 'px 0'
        });

    }

}
