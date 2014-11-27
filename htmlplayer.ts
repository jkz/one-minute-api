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
        private onPause: Action = () => {};

        constructor(scene: Scene, private sexualPreference: SexualPreference) {
            document.body.innerHTML = '';
            var p = this;
            p.container = document.createElement('div');
            p.container.id = 'container';
            document.body.onkeydown = function (e) {
                switch (e.keyCode) {
                    case 38: // up
                    case 40: // down
                        p.s.pause();
                        break;
                    case 37: // left
                        p.s.prev();
                        break;
                    case 39: // right
                        p.s.next();
                        break;
                }
            };
            document.body.appendChild(p.container);
            p.goToScene(scene)();
        }

        // Write a message to this element in "teletype style", where text appears
        // character for character as if someone is typing it live. The callback is
        // invoked when the entire message is written to the element.
        teleType(msg: string, el: HTMLElement, done?: Function) {
            var i = 0;
            var oldOnPause = this.onPause;
            this.onPause = function () {
                if (null == interId) {
                    interId = setInterval(setNewChar, 20);
                } else {
                    clearInterval(interId);
                    interId = null;
                }
            };
            function setNewChar() {
                if (i++ < msg.length) {
                    el.innerText = msg.slice(0, i);
                } else {
                    clearInterval(interId);
                    this.onPause = oldOnPause;
                    if (done) {
                        done();
                    }
                }
            }
            var interId = setInterval(setNewChar, 20);
        }

        goToScene(scene: Scene): Action {
            var p = this;
            return function () {
                p.s = scene(p);
                p.actions = p.s.content.slice(0);
                // Default last action
                p.actions.push(p.s.next);
                p.next();
            };
        }

        setSexualPreference(pref: SexualPreference): Action {
            var p = this;
            return function () {
                p.sexualPreference = pref;
                p.next();
            }
        }

        pause(): Action {
            // Don't pass onPause by ref to allow changing it at runtime
            return () => this.onPause();
        }

        private addMessage(text: string, cls: string) {
            var p = this;
            var el = document.createElement('p');
            el.classList.add(cls);
            p.container.appendChild(el);
            p.teleType(text, el, () => p.next());
        }

        voiceOver(text: string): Action {
            return () => this.addMessage(text, 'voiceOver');
        }

        ambient(desc: string): Action {
            return () => this.addMessage(desc, 'ambient');
        }

        playProfile(profile: Profile): Action {
            return () => this.addMessage(profile.msg, 'profile');
        }

        getAndPlayProfile(): Action {
            var p = this;
            return function () {
                var profile = new Profile("TODO: Implement get next profile");
                p.playProfile(profile)();
                p.next();
            };
        }

        private static MAX_ACTIONS = 20;
        private numActions = 0;
        private next() {
            if (++this.numActions > HtmlTextPlayer.MAX_ACTIONS) {
                return;
            }
            var action = this.actions.shift();
            action();
        }

    }

}
