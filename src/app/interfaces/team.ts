import { Objective } from "./objective";

export interface Team {
    bans: number[]; // List of champion IDs that were banned by the team
    teamId: number; 
    win: boolean; 
    voidGrubs: Objective; //Horde in the API
    atakhan: Objective;
    baron: Objective;
    dragon: Objective;
    champion: Objective;
    inhibitor: Objective;
    riftHerald: Objective;
    tower: Objective;
    featEpicMonster:number; // 
    featFirstBlood: number; // 3 kills 
    featFirstTower: number; // First tower kill

}
