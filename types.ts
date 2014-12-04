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
    // etc (imagine what happens in JS when you do action = p.someMethod; you
    // capture Player.prototype.someMethod without binding to p).
    export interface Player {
        api: Api;
        goToScene(scene: Scene): SceneAction;
        setSexualPreference(pref: SexualPreference): SceneAction;
        pause(): SceneAction;
        voiceOver(text: string): SceneAction;
        ambient(desc: string): SceneAction;
        playProfile(profile: Profile): SceneAction;
        getAndPlayTarget(): SceneAction;
        recordMessage(toUserUuid: string): SceneAction;
        listenToMatch(match: Match): SceneAction;
    }

    // Combine multiple actions into one
    export function actions(fs: SceneAction[]): SceneAction {
        return c => fs.forEach(f => f(c));
    }

    export interface Profile {
        user_uuid: string;
        recordings: string[];
        profileMsg: string;
    }

    export interface Settings {
        user_uuid: string;
        discover_men: boolean;
        discover_women: boolean;
        recordings: string[];
    }

    export interface Match {
        match_uuid: string;
        user_uuid: string;
        opening_line: string;
    }

    export interface PutRecordingParams {
        resource: string;
        message_uuid: string;
        http_headers: { [key: string]: string };
    }

    // Not actually a Recording object, just a structural type to discern it from string
    export interface Recording {
        recording_uuid: string;
        // TODO: audio schmaudio
    }

    export interface Api {
        getProfile(userUuid: string): Promise<Profile>;
        getMyProfile(): Promise<Profile>;
        getSettings(): Promise<Settings>;
        setSettings(x: Settings): Promise<void>;
        deleteAccount(): Promise<void>;
        getMatches(newerThan?: string): Promise<Match[]>;
        setMatch(userUuid: string, like: boolean): Promise<void>;
        getPutRecordingParams(bytes: number, contentType: string, md5: string): Promise<PutRecordingParams>;
        getRecording(recordingUuid: string): Promise<Recording>;
        getTargets(): Promise<Profile[]>;
    }
}
