// Copyright © 2014 authors, see package.json
//
// all rights reserved

/// <reference path="es6-promise.d.ts"/>

/// <reference path="types.ts"/>
/// <reference path="script.ts"/>

module OneMinuteScript {

    export class ResourceFetchingPlayer implements Player {
        api: Api;
        sounds: BuiltinSound[] = [];
        recordings: RecordingMeta[] = [];
        private cleanup: Action[] = [];

        constructor(private scene: Scene) {
            this.goToScene(scene);
            this.cleanup.forEach(f => f());
            delete this.cleanup;
        }

        goToScene(scene: Scene): SceneAction {
            var a = <any>scene;
            // Don't double pass
            if (a._resourceFetcherDone) {
                return;
            }
            a._resourceFetcherDone = true;
            this.cleanup.push(() => delete a._resourceFetcherDone);
            scene(this);
            return;
        }

        setSexualPreference(pref: SexualPreference): SceneAction {
            return;
        }

        voiceOver(snd: BuiltinSound): SceneAction {
            this.sounds.push(snd);
            return;
        }

        ambient(snd: BuiltinSound): SceneAction {
            this.sounds.push(snd);
            return;
        }

        playProfile(profile: Profile): SceneAction {
            this.recordings.push.apply(this.recordings, profile.recordings);
            return;
        }

        getAndPlayTarget(): SceneAction {
            return;
        }

        recordMessage(toUserExid: string): SceneAction {
            return;
        }

        listenToMatch(match: Match): SceneAction {
            this.recordings.push(match.opening_line);
            return;
        }
    }

}
