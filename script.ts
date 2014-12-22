// Copyright © 2014 authors, see package.json
//
// all rights reserved

/// <reference path="types.ts"/>

module OneMinuteScript {

    var FirstNeighborProfile: Profile = {
        user_exid: "user/x/first-neighbor",
        recordings: [{
            recording_exid: "recording/x/first-neighbor",
            length: 123
        }]
    };

    function snd(exid: string, transcript: string): BuiltinSound {
        // TODO: Lookup length for these audio files
        return {
            length: 123,
            recording_exid: exid,
            transcript: transcript
        };
    }

    export var NewUserScene: Scene = function (p: Player) {
        return {
            name: "New User",
            prev: p.goToScene(NewUserScene),
            next: p.goToScene(ExploreNeighborhood1Scene),
            content: [
                p.voiceOver(snd("sound/vo/welcome-to-your-house-1",
                    "Welcome to your house. Before we explore your house, let's go explore the neighborhood. Follow me.")),
                p.ambient(snd("sound/ambient/footsteps-in-hallway-1", "Footsteps in hallway, 5ft")),
                p.ambient(snd("sound/ambient/door-open-close-1-clipped", "Front door opens")),
                p.ambient(snd("sound/ambient/footsteps-gravel-1", "footsteps on gravel (path in frontyard), 10ft")),
            ],
        };
    };

    export var ExploreNeighborhood1Scene: Scene = function (p: Player) {
        return {
            name: "Explore Neighborhood",
            prev: p.goToScene(NewUserScene),
            next: p.goToScene(BusstopToLafayetteScene),
            content: [
                p.ambient(snd("sound/ambient/footsteps-on-pavement-1-clipped",
                    "Footsteps on the pavement. Background noise: people talking, light street activity. 30ft.")),
                p.voiceOver(snd("sound/vo/intro-1st-neighbor-1-clipped",
                    "This is the first house. Let's check out who lives here.")),
                /* Profile of owner plays. It's a sample profile that demonstrates to
                 * the user what a profile is, just like Tinder's screenshot of that
                 * lady on the beach with a pug in her arms.
                 */
                p.playProfile(FirstNeighborProfile),
                p.ambient(snd("sound/ambient/env-noises-fade-in", "environmental noises fade back in")),
            ],
        };
    };

    export var BusstopToLafayetteScene: Scene = function (p: Player) {
        return {
            name: "Busstop",
            action: p.goToScene(EnterBusToLafayetteScene),
            prev: p.goToScene(ExploreNeighborhood1Scene),
            next: p.goToScene(ExploreNeighborhood2Scene),
            content: [
                p.setSexualPreference(SexualPreference.Straight),
                p.ambient(snd("sound/abmient/bus-to-lafayette-arrives", "A bus approaches and comes to a soft halt")),
                p.voiceOver(snd("sound/vo/explain-bus-to-lafayette",
                    "This bus is going to Lafayette, home to the LGBT community. If you want to hop on, just press the action button right here. Otherwise, let's continue!")),
            ],
        };
    };

    export var EnterBusToLafayetteScene: Scene = function (p: Player) {
        return {
            name: "Bus to Lafayette",
            prev: p.goToScene(BusstopToLafayetteScene),
            next: p.goToScene(ArrivedInLafayetteScene),
            content: [
                p.setSexualPreference(SexualPreference.Gay),
                /* like the shock of stopping short. Emphasise that this is the first
                 * time the pause button influences the story line instead of just
                 * pausing.
                 */
                p.voiceOver(snd("sound/vo/get-on-lafayette",
                    "Okay, let's get on the bus! Remember: to cancel, or go back, just press back. On to Lafayette!")),
                /* TODO: Disambiguate in instructions between "prev track" and "android
                 * back button".
                 */
                p.goToScene(InBusToLafayetteScene),
            ],
        };
    };

    export var InBusToLafayetteScene: Scene = function (p: Player) {
        return {
            prev: p.goToScene(BusstopToLafayetteScene),
            next: p.goToScene(ArrivedInLafayetteScene),
            content: [
                p.ambient(snd("sound/ambient/on-the-bus", "bus noises, chatter made up of profiles mixed together")),
                // Listen to three people on the bus
                p.getAndPlayTarget(),
                p.getAndPlayTarget(),
                p.getAndPlayTarget(),
            ],
        };
    };

    export var ArrivedInLafayetteScene: Scene = function (p: Player) {
        return {
            name: "Lafayette",
            prev: p.goToScene(InBusToLafayetteScene),
            next: p.goToScene(ExploreNeighborhood2Scene),
            content: [
                p.voiceOver(snd("sound/vo/welcome-to-lafayette",
                    "Welcome to Lafayette! Home to the LGBT community. Let's explore.")),
            ],
        };
    };

    export var ExploreNeighborhood2Scene: Scene = function (p: Player) {
        return {
            name: "Explore neighborhood further",
            prev: p.goToScene(BusstopToLafayetteScene),
            next: p.goToScene(ExploreNeighborhood2Scene),
            content: [
                p.ambient(snd("sound/ambient/explore-neighborhood", "Footsteps on pavement, street noises")),
                // Listen to three people here
                p.getAndPlayTarget(),
            ],
        };
    };

    // Someone, whom you already liked, just liked you and left you a message
    export var IncomingMatchScene = function (p: Player, match: Match, back: Scene): SceneDefinition {
        return {
            name: "Incoming Match",
            prev: p.goToScene(back),
            next: p.goToScene(x => SendMessageScene(x, match.user_exid, back)),
            content: [
                p.ambient(snd("sound/ambient/incoming-match", "light beeping sound, like a pager")),
                p.voiceOver(snd("sound/vo/incoming-match", "You have a new match!")),
                p.listenToMatch(match),
                p.voiceOver(snd("sound/vo/send-reply", "Let's send them a reply.")),
            ],
        };
    };

    // You liked someone who already liked you
    export var OutgoingMatchScene = function (p: Player, match: Match, back: Scene): SceneDefinition {
        return {
            name: "Outgoing Match",
            prev: p.goToScene(back),
            next: p.goToScene(x => SendMessageScene(x, match.user_exid, back)),
            content: [
                // because this directly follows a "like"
                p.ambient(snd("sound/ambient/outgoing-match", "light sound of victory")),
                p.voiceOver(snd("sound/vo/outgoing-match",
                    "That's a match! They won't hear about it until you leave them a message, so let's record one now.")),
            ],
        };
    };

    export var SendMessageScene = function (p: Player, toUserExid: string, back: Scene): SceneDefinition {
        return {
            name: "Send message",
            prev: p.goToScene(back),
            next: p.goToScene(back),
            content: [
                p.recordMessage(toUserExid),
                p.voiceOver(snd("sound/vo/message-sent", "Your message has been sent. Let's continue where we were.")),
            ],
        };
    }
}
