// Copyright © 2014 authors, see package.json
//
// all rights reserved

/// <reference path="types.ts"/>

module OneMinuteScript {

    var FirstNeighborProfile = new Profile("Hi! My name is Max and this is my 6 second profile! See you around.");

    export var NewUserScene: Scene = function (p: Player) {
        return {
            pause: p.pause(),
            prev: p.goToScene(NewUserScene),
            next: p.goToScene(ExploreNeighborhood1Scene),
            content: [
                p.voiceOver("Welcome to your house. Before we explore your house, let's go explore the neighborhood. Follow me."),
                p.ambient("Footsteps in hallway, 5ft"),
                p.ambient("Front door opens"),
                p.ambient("footsteps on gravel (path in frontyard), 10ft"),
            ],
        };
    };

    export var ExploreNeighborhood1Scene: Scene = function (p: Player) {
        return {
            pause: p.pause(),
            prev: p.goToScene(NewUserScene),
            next: p.goToScene(BusstopToLafayetteScene),
            content: [
                p.ambient("Footsteps on the pavement. Background noise: people talking, light street activity. 30ft."),
                p.voiceOver("This is the first house. Let's check out who lives here."),
                /* Profile of owner plays. It's a sample profile that demonstrates to
                 * the user what a profile is, just like Tinder's screenshot of that
                 * lady on the beach with a pug in her arms.
                 */
                p.playProfile(FirstNeighborProfile),
                p.ambient("environmental noises fade back in"),
            ],
        };
    };

    export var BusstopToLafayetteScene: Scene = function (p: Player) {
        return {
            pause: p.goToScene(EnterBusToLafayetteScene),
            prev: p.goToScene(ExploreNeighborhood1Scene),
            next: p.goToScene(ExploreNeighborhood2Scene),
            content: [
                p.setSexualPreference(SexualPreference.Straight),
                p.ambient("A bus approaches and comes to a soft halt"),
                p.voiceOver("This bus is going to Lafayette, home to the LGBT community. If you want to hop on, just press pause right here. Otherwise, let's continue!"),
            ],
        };
    };

    export var EnterBusToLafayetteScene: Scene = function (p: Player) {
        return {
            pause: p.pause(),
            prev: p.goToScene(BusstopToLafayetteScene),
            next: p.goToScene(ArrivedInLafayetteScene),
            content: [
                p.setSexualPreference(SexualPreference.Gay),
                /* like the shock of stopping short. Emphasise that this is the first
                 * time the pause button influences the story line instead of just
                 * pausing.
                 */
                p.voiceOver("Ho!"),
                p.voiceOver("Okay, let's get on the bus! Remember: to cancel, or go back, just press back. On to Lafayette!"),
                /* TODO: Disambiguate in instructions between "prev track" and "android
                 * back button".
                 */
                p.goToScene(InBusToLafayetteScene),
            ],
        };
    };

    export var InBusToLafayetteScene: Scene = function (p: Player) {
        return {
            pause: p.pause(),
            prev: p.goToScene(BusstopToLafayetteScene),
            next: p.goToScene(ArrivedInLafayetteScene),
            content: [
                p.ambient("bus noises, chatter made up of profiles mixed together"),
                // Listen to three people on the bus
                p.getAndPlayProfile(),
                p.getAndPlayProfile(),
                p.getAndPlayProfile(),
            ],
        };
    };

    export var ArrivedInLafayetteScene: Scene = function (p: Player) {
        return {
            pause: p.pause(),
            prev: p.goToScene(InBusToLafayetteScene),
            next: p.goToScene(ExploreNeighborhood2Scene),
            content: [
                p.voiceOver("Welcome to Lafayette! Home to the LGBT community. Let's explore."),
            ],
        };
    };

    export var ExploreNeighborhood2Scene: Scene = function (p: Player) {
        return {
            pause: p.pause(),
            prev: p.goToScene(BusstopToLafayetteScene),
            next: p.goToScene(ExploreNeighborhood2Scene),
            content: [
                p.ambient("Footsteps on pavement, street noises"),
                // Listen to three people here
                p.getAndPlayProfile(),
            ],
        };
    };

}
