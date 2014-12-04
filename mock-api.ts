// Copyright © 2014 authors, see package.json
//
// all rights reserved

// Local-only test implementation of API, returns bogus values

/// <reference path="types.ts"/>


module OneMinuteScript {
    export class MockApi implements Api {
        private user_uuid = "user/x/test-123";
        private settings: Settings = {
            user_uuid: this.user_uuid,
            recordings: ["recording/x/test-1", "recording/x/test-2"],
            discover_men: true,
            discover_women: true
        };

        getProfile(userUuid: string): Promise<Profile> {
            var x: Profile = {
                user_uuid: this.settings.user_uuid,
                recordings: this.settings.recordings,
                profileMsg: "[obsolete property .profileMsg] test user"
            };
            var api = this;
            return new Promise<Profile>(function (ok, bad) {
                if (userUuid !== api.user_uuid) {
                    bad(new Error("mock getProfile only implemented for self"));
                } else {
                    ok(x);
                }
            });
        }

        getMyProfile(): Promise<Profile> {
            return this.getProfile(this.user_uuid);
        }

        getSettings(): Promise<Settings> {
            return new Promise<Settings>(ok => ok(this.settings));
        }

        setSettings(x: Settings): Promise<void> {
            var api = this;
            return new Promise<void>(function (ok, bad) {
                if (x.user_uuid !== api.user_uuid) {
                    bad(new Error("Can't change user_uuid"));
                } else {
                    ok();
                }
            });
        }

        deleteAccount(): Promise<void> {
            return new Promise<void>(function (ok, bad) {
                bad(new Error("mock DELETE not implemented"));
            });
        }

        getMatches(newerThan?: string): Promise<Match[]> {
            return new Promise<Match[]>(ok => ok([]));
        }

        setMatch(userUuid: string, like: boolean): Promise<void> {
            return new Promise<void>((ok, bad) => bad(new Error("mock setMatch not implemented")));
        }

        getPutRecordingParams(bytes: number, contentType: string, md5: string): Promise<PutRecordingParams> {
            var x: PutRecordingParams = {
                resource: "https://example.com/recording/x/test-123.mp3",
                message_uuid: "recording/x/test-123",
                http_headers: {
                    "Content-Length": "72362",
                    "Content-MD5": "14758f1afd44c09b7992073ccf00b43d",
                    "Content-Type": "audio/mpeg",
                    "Host": "example.com",
                    "Authorization": "AWS4-HMAC-SHA256 Credential=AKIAIOSFODNN7EXAMPLE/20130524/us-east-1/s3/aws4_request,SignedHeaders=content-length;content-md5;content-type;host;x-amz-acl,Signature=f0e8bdb87c964420e857bd35b5d6ed310bd44f0170aba48dd91039c6036bdb41",
                    "X-Amz-Acl": "public-read"
                }
            };
            return new Promise<PutRecordingParams>(ok => ok(x));
        }

        getRecording(recordingUuid: string): Promise<any> {
            return new Promise((ok, bad) => bad(new Error("mock getRecording not implemented")));
        }

        getTargets(): Promise<string[]> {
            return new Promise<string[]>((ok, bad) => bad(new Error("mock getTargets not implemented")));
        }
    }
}
