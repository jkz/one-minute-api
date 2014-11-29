// Copyright © 2014 authors, see package.json
//
// all rights reserved

module OneMinuteScript {

    export enum SexualPreference {
        Straight,
        Gay,
        // TODO: Bi
    };

    export interface Context {
        sexualPreference: SexualPreference;
    }

    export interface Action {
        (): void;
    }

    export interface SceneAction {
        (context: any): void;
    }

    export interface SceneDefinition {
        name?: string;
        content: SceneAction[];
        pause: SceneAction;
        prev: SceneAction;
        next: SceneAction;
    }

    export interface Scene {
        (p: Player): SceneDefinition;
    }

    // Everything must be a method to allow capturing this in initialization etc
    // etc
    export interface Player {
        goToScene(scene: Scene): SceneAction;
        setSexualPreference(pref: SexualPreference): SceneAction;
        pause(): SceneAction;
        voiceOver(text: string): SceneAction;
        ambient(desc: string): SceneAction;
        playProfile(profile: Profile): SceneAction;
        getAndPlayProfile(): SceneAction;
    }

    // Combine multiple actions into one
    export function actions(fs: SceneAction[]): SceneAction {
        return c => fs.forEach(f => f(c));
    }

    export class Profile {
        constructor(public msg: string) { }
    }

}
