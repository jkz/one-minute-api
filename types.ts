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

    export interface SceneInstance {
        name?: string;
        content: Action[];
        pause: Action;
        prev: Action;
        next: Action;
    }

    export interface Scene {
        (p: Player): SceneInstance;
    }

    // Everything must be a method to allow capturing this in initialization etc
    // etc
    export interface Player {
        goToScene(scene: Scene): Action;
        setSexualPreference(pref: SexualPreference): Action;
        pause(): Action;
        voiceOver(text: string): Action;
        ambient(desc: string): Action;
        playProfile(profile: Profile): Action;
        getAndPlayProfile(): Action;
    }

    // Combine multiple actions into one
    export function actions(fs: Action[]): Action {
        return () => fs.forEach(f => f());
    }

    export class Profile {
        constructor(public msg: string) { }
    }

}
