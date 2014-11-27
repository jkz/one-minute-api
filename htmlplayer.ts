// Copyright © 2014 authors, see package.json
//
// all rights reserved

/// <reference path="types.ts"/>
/// <reference path="script.ts"/>

module OneMinuteScript {

    export class HtmlTextPlayer implements Player {

        private s: SceneInstance;
        private container: HTMLElement;
        private actions: Action[];

        constructor(scene: Scene, private sexualPreference: SexualPreference) {
            document.body.innerHTML = '';
            this.container = document.createElement('div');
            this.container.id = 'container';
            document.body.appendChild(this.container);
            this.goToScene(scene)();
        }

        goToScene(scene: Scene): Action {
            var p = this;
            return function () {
                p.s = scene(p);
                p.actions = p.s.content.slice(0);
                p.actions.push(p.s.next);
            };
        }

        setSexualPreference(pref: SexualPreference): Action {
            return () => this.sexualPreference = pref;
        }

        pause(): Action {
            return function pauseScene() {
                console.log('Pause');
                throw new Error("TODO: Implement pause");
            };
        }

        voiceOver(text: string): Action {
            var p = this;
            return function () {
                var msg = document.createElement('p');
                msg.innerText = text;
                msg.classList.add('voiceOver');
                p.container.appendChild(msg);
            };
        }

        ambient(desc: string): Action {
            var p = this;
            return function () {
                var msg = document.createElement('p');
                msg.innerText = desc;
                msg.classList.add('ambient');
                p.container.appendChild(msg);
            };
        }

        playProfile(profile: Profile): Action {
            var p = this;
            return function () {
                var msg = document.createElement('p');
                msg.innerText = profile.msg;
                msg.classList.add('profile');
                p.container.appendChild(msg);
            };
        }

        getAndPlayProfile(): Action {
            var p = this;
            return function () {
                var profile = new Profile("TODO: Implement get next profile");
                p.playProfile(profile)();
            };
        }

        play() {
            var action: Action;

            var MAX_ACTIONS = 1000;
            for (var i = 0; this.actions && i < MAX_ACTIONS; i++) {
                var action = this.actions.shift();
                action();
            }
        }

    }

}
