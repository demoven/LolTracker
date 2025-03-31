import { Player } from "./player";
import { Team } from "./team";

export interface Game {
    endOfGameResult: string;
    gameCreation: number;
    gameDuration: number;
    matchId: number;
    gameMode: string;
    mapId: number;
    participants: Player[];
    team1: Team;
    team2: Team;
}
