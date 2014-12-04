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

    interface PlayerAction {
        play();
        playPause();
        stop();
    }

    // Write a message to this element in "teletype style", where text appears
    // character for character as if someone is typing it live. The callback is
    // invoked when the entire message is written to the element. Returns the
    // interval ID for this task.
    class TeleTypeAction implements PlayerAction {
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
                this.el.textContent = this.msg.slice(0, this.i);
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

    class RecordMessageAction implements PlayerAction {
        private form: HTMLFormElement;
        private resolve: (x: string) => void;
        done = new Promise<string>(r => this.resolve = r);

        constructor(container: HTMLElement) {
            var recAc = this;
            recAc.form = document.createElement('form');
            var input = document.createElement('input');
            recAc.form.appendChild(input);
            this.form.onsubmit = function (e) {
                if (recAc.resolve) {
                    recAc.resolve(input.value);
                }
                input.disabled = true;
                return false;
            };
            container.appendChild(recAc.form);
            input.focus();
        }

        play() {
            // NOP
        }

        playPause() {
            // NOP
        }

        stop() {
            this.resolve = undefined;
        }
    }

    interface ControlButtons {
        playPause: Action;
        prev: Action;
        next: Action;
    }

    // Play one scene
    class ScenePlayer {
        private runningAction: PlayerAction;
        private goToNextScene: Func<Scene>;
        private actions: SceneAction[] = [];

        buttons: ControlButtons;

        constructor(private p: HtmlTextPlayer, public scene: Scene, private container: HTMLElement) {
            var sceneDef = scene(p);
            if (undefined !== sceneDef.name) {
                var el = document.createElement('p');
                el.classList.add('scene');
                el.textContent = 'SCENE: ' + sceneDef.name;
                this.container.appendChild(el);
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

        private addTextMessage(transcript: string, cls: string) {
            this.stop();
            var action = new TeleTypeAction(this.container, transcript, cls);
            action.done.then(() => this.next());
            this.runningAction = action;
            action.play();
        }

        playRecording(rec: RecordingMeta, cls: string) {
            var text = "[TODO: Playback audio for " + rec.recording_uuid + "]";
            this.addTextMessage(text, cls);
        }

        playBuiltin(snd: BuiltinSound, cls: string) {
            var text = "[" + snd.recording_uuid + "] " + snd.transcript;
            this.addTextMessage(text, cls);
        }

        recordMessage(): Promise<string> {
            this.stop();
            var action = new RecordMessageAction(this.container);
            var sp = this;
            this.runningAction = action;
            action.play();
            return action.done;
        }

        playPause() {
            if (this.runningAction) {
                this.runningAction.playPause();
            }
        }

        play() {
            if (this.runningAction) {
                throw new Error("Already playing");
            }
            this.next();
        }

        stop() {
            if (this.runningAction) {
                this.runningAction.stop();
                this.runningAction = undefined;
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
        private sexualPreference: SexualPreference;
        private targets: Profile[] = [];

        constructor(public api: Api, scene: Scene) {
            document.body.innerHTML = '';
            var p = this;
            p.container = document.createElement('div');
            p.container.id = 'container';
            document.body.onkeydown = function (e) {
                if ((<HTMLElement>e.target).tagName === "INPUT") {
                    // ignore events on input tags
                    return;
                }
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
                    case 77: // 'm'
                        p.demoIncomingMatch();
                        break;
                    default:
                        return;
                }
                e.preventDefault();
            };
            api.getTargets().then(function (targets) {
                p.targets = targets;
            }, function (err) {
                console.log(err);
            });
            //TODO Get sexuality from profile
            document.body.appendChild(p.container);
            this.sp = new ScenePlayer(this, scene, this.container);
        }

        private demoIncomingMatch() {
            var match: Match = {
                match_uuid: "match/x/test-match-1",
                user_uuid: "user/x/test-123",
                opening_line: {
                    recording_uuid: "recording/x/test-opening-line",
                    length: 123
                }
            }
            this._goToScene(p => IncomingMatchScene(p, match, this.sp.scene));
        }

        play() {
            this.sp.play();
        }

        private displayError(text: string) {
            var p = document.createElement('p');
            p.classList.add('error');
            p.textContent = text;
            this.container.appendChild(p);
        }

        private _goToScene(scene: Scene) {
            this.sp.stop();
            if (++this.numScenes > HtmlTextPlayer.MAX_SCENES) {
                this.displayError('STOP: Maximum number of scene transitions reached.');
                return;
            }
            this.sp = new ScenePlayer(this, scene, this.container);
            this.sp.play();
        }

        goToScene(scene: Scene): SceneAction {
            return c => this._goToScene(scene);
        }

        voiceOver(snd: BuiltinSound): SceneAction {
            return c => (<ScenePlayer>c).playBuiltin(snd, 'voiceOver');
        }

        ambient(snd: BuiltinSound): SceneAction {
            return c => (<ScenePlayer>c).playBuiltin(snd, 'ambient');
        }

        playProfile(profile: Profile): SceneAction {
            return c => (<ScenePlayer>c).playRecording(profile.recordings[0], 'profile');
        }

        setSexualPreference(pref: SexualPreference): SceneAction {
            var p = this;
            return function (c: any) {
                var sp: ScenePlayer = c;
                p.sexualPreference = pref;
                p.container.dataset['sexualPreference'] = SexualPreference[pref];
                sp.next();
            }
        }

        pause(): SceneAction {
            return c => (<ScenePlayer>c).playPause();
        }

        // TODO: Communicate to caller when target list exhausted
        private _getAndPlayTarget() {
            var p = this;
            var target = this.targets.shift();
            if (undefined === target) {
                this.displayError("No more targets. TODO: Report up the callstack");
                return;
            }
            p.playProfile(target)(this.sp);
        }

        getAndPlayTarget(): SceneAction {
            return c => this._getAndPlayTarget();
        }

        private sendMessage(toUserUuid: string, msg: string) {
            this.displayError("TODO: Send message <" + msg + "> to " + toUserUuid);
        }

        private _recordMessage(sp: ScenePlayer, toUserUuid: string) {
            sp.recordMessage().then(msg => this.sendMessage(toUserUuid, msg));
        }

        recordMessage(toUserUuid: string): SceneAction {
            return c => this._recordMessage(c, toUserUuid);
        }

        listenToMatch(match: Match): SceneAction {
            return c => (<ScenePlayer>c).playRecording(match.opening_line, "match-message");
        }
    }

}
