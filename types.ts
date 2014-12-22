// Copyright © 2014 authors, see package.json
//
// all rights reserved

/// <reference path="es6-promise.d.ts"/>

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
        // User initiated action (the famous "button press")
        action?: SceneAction;
        content: SceneAction[];
        prev: SceneAction;
        next: SceneAction;
    }

    export interface Scene {
        (p: Player): SceneDefinition;
    }

    // Everything must be a method to allow capturing this in initialization etc
    // etc (imagine what happens in JS when you do action = p.someMethod; you
    // capture Player.prototype.someMethod without binding to p).
    export interface Player {
        api: Api;
        goToScene(scene: Scene): SceneAction;
        setSexualPreference(pref: SexualPreference): SceneAction;
        voiceOver(snd: BuiltinSound): SceneAction;
        ambient(snd: BuiltinSound): SceneAction;
        playProfile(profile: Profile): SceneAction;
        getAndPlayTarget(): SceneAction;
        recordMessage(toUserExid: string): SceneAction;
        listenToMatch(match: Match): SceneAction;
    }

    // Combine multiple actions into one
    export function actions(fs: SceneAction[]): SceneAction {
        return c => fs.forEach(f => f(c));
    }

    export interface Profile {
        user_exid: string;
        recordings: RecordingMeta[];
    }

    export interface Settings {
        user_exid: string;
        discover_men: boolean;
        discover_women: boolean;
        recording_exids: string[];
    }

    export interface Match {
        match_exid: string;
        user_exid: string;
        opening_line: RecordingMeta;
    }

    export interface HttpHeaders { [key: string]: string };

    export interface PutRecordingParams {
        resource: string;
        recording_exid: string;
        http_headers: HttpHeaders;
    }

    // Not actually a Recording object, just a structural type to discern it from string
    export interface RecordingData {
        recording_exid: string;
        tstypehack: number;
        // TODO: audio schmaudio
    }

    export interface BuiltinSound {
        recording_exid: string;
        transcript: string;
    }

    export interface RecordingMeta {
        recording_exid: string;
        length: number;
    }

    export interface Api {
        getProfile(userExid: string): Promise<Profile>;
        getMyProfile(): Promise<Profile>;
        getSettings(): Promise<Settings>;
        setSettings(x: Settings): Promise<void>;
        deleteAccount(): Promise<void>;
        getMatches(newerThan?: string): Promise<Match[]>;
        setMatch(userExid: string, like: boolean): Promise<void>;
        putRecording(file: File): Promise<void>;
        getSoundUrl(soundOrRecordingExid: string): Promise<string>;
        getTargets(): Promise<Profile[]>;
    }
}
