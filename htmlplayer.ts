/// <reference path="types.ts"/>
/// <reference path="script.ts"/>

module OneMinuteScriptPlayer {

    class HtmlTextPlayer implements Player {

        goToScene(scene: Scene): Action {
            return function (c: Context) {
                throw new Error("TODO: Implement goToScene");
            };
        }

        setSexualPreference(pref: SexualPreference): Action {
            return c => c.sexualPreference = pref;
        }

        pause(): Action {
            return function pauseScene(c: Context) {
                console.log('Pause');
                throw new Error("TODO: Implement pause");
            };
        }

        voiceOver(text: string): Action {
            return function (c: Context) {
                throw new Error("TODO: Implement voiceOver");
            };
        }

        ambient(desc: string): Action {
            return function (c: Context) {
                throw new Error("TODO: Implement ambient");
            };
        }

        playProfile(profile: Profile): Action {
            return function (c: Context) {
                throw new Error("TODO: implement playProfile");
            };
        }

        getAndPlayProfile(): Action {
            var p = this;
            return function (c: Context) {
                var profile = new Profile("TODO: Get next profile");
                p.playProfile(profile)(c);
            };
        }

    }

}
