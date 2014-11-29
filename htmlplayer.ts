// Copyright © 2014 authors, see package.json
//
// all rights reserved

/// <reference path="es6-promise.d.ts"/>

/// <reference path="types.ts"/>
/// <reference path="script.ts"/>

interface Func<T> {
    (): T;
}

module OneMinuteScript {

    // Write a message to this element in "teletype style", where text appears
    // character for character as if someone is typing it live. The callback is
    // invoked when the entire message is written to the element. Returns the
    // interval ID for this task.
    class TeleTypeAction {
        private interId: number;
        private el = document.createElement('p');
        private i = 0;
        private resolve: Action;
        done = new Promise<void>(r => this.resolve = r);

        constructor(container: HTMLElement, private msg: string, cls: string) {
            this.el.classList.add(cls);
            container.appendChild(this.el);
        }

        private setNewChar() {
            if (this.i++ < this.msg.length) {
                this.el.innerText = this.msg.slice(0, this.i);
            } else {
                clearInterval(this.interId);
                this.resolve();
            }
        }

        playPause() {
            if (undefined == this.interId) {
                this.play();
            } else {
                // stop == pause for this action
                this.stop();
            }
        }

        play() {
            this.interId = setInterval(() => this.setNewChar(), 20);
        }

        // Does not resolve this.done
        stop() {
            if (undefined !== this.interId) {
                clearInterval(this.interId);
                this.interId = undefined;
            }
        }
    }

    interface ControlButtons {
        playPause: Action;
        prev: Action;
        next: Action;
    }

    // Play one scene
    class ScenePlayer {
        private action: TeleTypeAction;
        private goToNextScene: Func<Scene>;
        private actions: SceneAction[] = [];

        buttons: ControlButtons;

        constructor(private p: HtmlTextPlayer, private scene: Scene, private container: HTMLElement) {
            var sceneDef = scene(p);
            if (undefined !== sceneDef.name) {
                this.actions.push(function (sp: ScenePlayer) {
                    sp.addMessage('SCENE: ' + sceneDef.name, 'scene');
                });
            }
            this.actions.push.apply(this.actions, sceneDef.content);
            // Default last action
            this.actions.push(sceneDef.next);
            this.buttons = {
                playPause: () => sceneDef.pause(this),
                prev: () => sceneDef.prev(this),
                next: () => sceneDef.next(this),
            };
        }

        addMessage(text: string, cls: string) {
            this.stop();
            this.action = new TeleTypeAction(this.container, text, cls);
            this.action.play();
            this.action.done.then(() => this.next());
        }

        playPause() {
            if (this.action) {
                this.action.playPause();
            }
        }

        play() {
            if (this.action) {
                throw new Error("Already playing");
            }
            this.next();
        }

        stop() {
            if (this.action) {
                this.action.stop();
                this.action = undefined;
            }
        }

        next() {
            this.stop();
            this.actions.shift()(this);
        }
    }

    export class HtmlTextPlayer implements Player {
        private sp: ScenePlayer;
        private container: HTMLElement;
        private static MAX_SCENES = 10;
        private numScenes = 0;

        constructor(scene: Scene, private sexualPreference: SexualPreference) {
            document.body.innerHTML = '';
            var p = this;
            p.container = document.createElement('div');
            p.container.id = 'container';
            document.body.onkeydown = function (e) {
                switch (e.keyCode) {
                    case 38: // up
                    case 40: // down
                        p.sp.buttons.playPause();
                        break;
                    case 37: // left
                        p.sp.buttons.prev();
                        break;
                    case 39: // right
                        p.sp.buttons.next();
                        break;
                }
            };
            document.body.appendChild(p.container);
            this.sp = new ScenePlayer(this, scene, this.container);
        }

        private _goToScene(scene: Scene) {
            this.sp.stop();
            if (++this.numScenes > HtmlTextPlayer.MAX_SCENES) {
                var p = document.createElement('p');
                p.classList.add('error');
                p.innerText = 'STOP: Maximum number of scene transitions reached.';
                this.container.appendChild(p);
                return;
            }
            this.sp = new ScenePlayer(this, scene, this.container);
            this.sp.play();
        }

        goToScene(scene: Scene): SceneAction {
            return c => this._goToScene(scene);
        }

        voiceOver(text: string): SceneAction {
            return c => (<ScenePlayer>c).addMessage(text, 'voiceOver');
        }

        ambient(desc: string): SceneAction {
            return c => (<ScenePlayer>c).addMessage(desc, 'ambient');
        }

        playProfile(profile: Profile): SceneAction {
            return c => (<ScenePlayer>c).addMessage(profile.msg, 'profile');
        }

        setSexualPreference(pref: SexualPreference): SceneAction {
            var p = this;
            return function (c: any) {
                var sp: ScenePlayer = c;
                p.sexualPreference = pref;
                sp.next();
            }
        }

        pause(): SceneAction {
            return c => (<ScenePlayer>c).playPause();
        }

        private _getAndPlayProfile() {
            var p = this;
            var profile = new Profile("TODO: Implement get next profile");
            p.playProfile(profile)(this.sp);
        }

        getAndPlayProfile(): SceneAction {
            return c => this._getAndPlayProfile();
        }

        play() {
            this.sp.play();
        }

    }

}
