// Copyright © 2014 authors, see package.json
//
// all rights reserved

/// <reference path="htmlplayer.ts"/>
/// <reference path="mock-api.ts"/>

var api = new OneMinuteScript.MockApi();
var p = new OneMinuteScript.HtmlTextPlayer(api, OneMinuteScript.NewUserScene);
p.play();
