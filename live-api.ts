// Copyright © 2014 authors, see package.json
//
// all rights reserved

// This file implements comm with the backend as defined in the API design doc

/// <reference path="types.ts"/>
/// <reference path="spark-md5.d.ts"/>

module OneMinuteScript {
    var DEFAULT_API_BASE = "https://oneminuteapi.s3.amazonaws.com/";
    var DEFAULT_S3 = "https://oneminuterecordings.s3.amazonaws.com/";
    var SOUND_EXTENSION = ".mp3";

    function obj2querystring(obj) {
        var enc = encodeURIComponent;
        return Object.keys(obj).map(k => enc(k) + "=" + enc(obj[k])).join("&");
    }

    interface XhrOptions {
        method?: string;
        params?: any;
        httpHeaders?: HttpHeaders;
    }

    export class LiveApi implements Api {
        private settings: Settings;
        private apibase: string = DEFAULT_API_BASE;
        private soundCdn: string = DEFAULT_S3;
        // Caching proxy for API, useful for cacheable GET resources
        private apiCdn: string = DEFAULT_API_BASE;
        private user_exid: Promise<string>;

        constructor(apibase?: string) {
            if (apibase !== undefined) {
                this.apiCdn = this.apibase = apibase;
            }
            this.user_exid = this.performRequest<Profile>(this.apibase + "me").then(x => x.user_exid);
        }

        getProfile(userExid: string): Promise<Profile> {
            return this.performRequest(this.apiCdn + userExid);
        }

        // url: the (fq) resource
        // method: "GET" (default), "PUT", "POST", etc
        // params: encoded as query string iff method == GET. otherwise passed
        // to XMLHttpRequest.prototype.send() after encoding as JSON.
        // Always expects JSON reply.
        private performRequest<T>(url: string, method?: string, params?): Promise<T>;
        private performRequest<T>(url: string, options: XhrOptions): Promise<T>;
        private performRequest<T>(url: string, method?: any, params?): Promise<T> {
            return new Promise<T>(function (ok, bad) {
                var r = new XMLHttpRequest();
                var body;
                var options: XhrOptions = {};
                if (typeof method === "string") {
                    options.method = method;
                    options.params = params;
                } else if (method !== undefined) {
                    options = method;
                }
                options.method = options.method || "GET";
                if (options.params !== undefined) {
                    if (options.method === "GET") {
                        url += "?" + obj2querystring(params);
                    } else {
                        body = JSON.stringify(params);
                    }
                }
                r.open(options.method, url);
                if (options.httpHeaders !== undefined) {
                    Object.keys(options.httpHeaders).forEach(function (key) {
                        r.setRequestHeader(key, options.httpHeaders[key]);
                    });
                }
                r.onload = function () {
                    switch (r.status) {
                    case 200:
                    case 304:
                        ok(r.response);
                        return;
                    default:
                        var msg = "Unexpected status code: " + r.status + " (" + r.statusText + ")";
                        bad(new Error(msg));
                        return;
                    }
                };
                r.responseType = "json";
                r.send(body);
            });
        }

        getMyProfile(): Promise<Profile> {
            return this.user_exid.then(exid => this.getProfile(exid));
        }

        getSettings(): Promise<Settings> {
            return new Promise<Settings>(ok => ok(this.settings));
        }

        setSettings(settings: Settings): Promise<void> {
            var api = this;
            return this.user_exid.then(function (user_exid) {
                if (settings.user_exid !== user_exid) {
                    // Plays nicer with chrome debug tools than throw
                    return Promise.reject(new Error("Can't change user_exid"));
                }
                return api.performRequest(this.apibase + "me/settings", "PUT", settings);
            });
        }

        deleteAccount(): Promise<void> {
            return <any>this.performRequest(this.apibase + "me", "DELETE");
        }

        getMatches(newerThan?: string): Promise<Match[]> {
            var params;
            if (newerThan !== undefined) {
                params = { newer_than: newerThan };
            }
            return this.performRequest(this.apibase + "matches", "GET", params);
        }

        setMatch(userExid: string, like: boolean): Promise<void> {
            return this.performRequest<void>("match", "POST", {
                user_exid: userExid,
                like: like
            });
        }

        private getPutRecordingParams(bytes: number, contentType: string, md5: string): Promise<PutRecordingParams> {
            var params = {
                "content-length": bytes,
                "content-type": contentType,
                "content-md5": md5
            };
            return this.performRequest(this.apibase + "put_recording_operation", "GET", params);
        }

        putRecording(file: File): Promise<void> {
            var api = this;
            return (new Promise<string>(function (ok, bad) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    ok(SparkMD5.ArrayBuffer.hash(this.result));
                };
                reader.onerror = e => bad(e.error);
                reader.readAsArrayBuffer(file);
            })).then(function (checksum) {
                return api.getPutRecordingParams(file.size, file.type, checksum);
            }).then(function (params) {
                return api.performRequest<void>(params.resource, {
                    method: "PUT",
                    httpHeaders: params.http_headers
                });
            });
        }

        getSoundUrl(recordingExid: string): Promise<string> {
            return Promise.resolve(this.soundCdn + recordingExid + SOUND_EXTENSION);
        }

        getTargets(): Promise<Profile[]> {
            return this.performRequest(this.apibase + "targets");
        }
    }
}
