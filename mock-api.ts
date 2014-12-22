// Copyright © 2014 authors, see package.json
//
// all rights reserved

// Local-only test implementation of API, returns bogus values

/// <reference path="types.ts"/>


module OneMinuteScript {
    function rec(recordingExid: string): RecordingMeta {
        return {
            recording_exid: recordingExid,
            length: 123
        };
    }

    var numMockTargetProfiles = 0;
    function createMockTargetProfile(): Profile {
        var i = ++numMockTargetProfiles;
        return {
            user_exid: "user/x/mock-target-" + i,
            recordings: [rec("recording/x/mock-target-" + i)],
        };
    }

    export class MockApi implements Api {
        private user_exid = "user/x/test-123";
        private settings: Settings = {
            user_exid: this.user_exid,
            recording_exids: ["recording/x/mock-settings-1", "recording/x/mock-settings-2"],
            discover_men: true,
            discover_women: true
        };
        private targets: Profile[] = [
            createMockTargetProfile(),
            createMockTargetProfile(),
            createMockTargetProfile()
        ];

        getProfile(userExid: string): Promise<Profile> {
            var x: Profile = {
                user_exid: this.settings.user_exid,
                recordings: this.settings.recording_exids.map(rec),
                profileMsg: "[obsolete property .profileMsg] test user"
            };
            var api = this;
            return new Promise<Profile>(function (ok, bad) {
                if (userExid !== api.user_exid) {
                    bad(new Error("mock getProfile only implemented for self"));
                } else {
                    ok(x);
                }
            });
        }

        getMyProfile(): Promise<Profile> {
            return this.getProfile(this.user_exid);
        }

        getSettings(): Promise<Settings> {
            return new Promise<Settings>(ok => ok(this.settings));
        }

        setSettings(x: Settings): Promise<void> {
            var api = this;
            return new Promise<void>(function (ok, bad) {
                if (x.user_exid !== api.user_exid) {
                    bad(new Error("Can't change user_exid"));
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
            return Promise.resolve([]);
        }

        setMatch(userExid: string, like: boolean): Promise<void> {
            return Promise.reject(new Error("mock setMatch not implemented"));
        }

        private getPutRecordingParams(bytes: number, contentType: string, md5: string): Promise<PutRecordingParams> {
            return Promise.resolve<PutRecordingParams>({
                resource: "https://example.com/recording/x/test-123.mp3",
                recording_exid: "recording/x/test-123",
                http_headers: {
                    "Content-Length": "72362",
                    "Content-MD5": "14758f1afd44c09b7992073ccf00b43d",
                    "Content-Type": "audio/mpeg",
                    "Host": "example.com",
                    "Authorization": "AWS4-HMAC-SHA256 Credential=AKIAIOSFODNN7EXAMPLE/20130524/us-east-1/s3/aws4_request,SignedHeaders=content-length;content-md5;content-type;host;x-amz-acl,Signature=f0e8bdb87c964420e857bd35b5d6ed310bd44f0170aba48dd91039c6036bdb41",
                    "X-Amz-Acl": "public-read"
                }
            });
        }

        putRecording(file: File): Promise<void> {
            return Promise.reject(new Error("mock putRecording not implemented"));
        }

        getSoundUrl(recordingExid: string): Promise<string> {
            return Promise.resolve("https://www.example.com/" + recordingExid);
        }

        getTargets(): Promise<Profile[]> {
            var res = Promise.resolve(this.targets);
            this.targets = [];
            return res;
        }
    }
}
