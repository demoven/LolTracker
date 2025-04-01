import { Rank } from "./rank";

export interface Account {
    gameName: string;
    tagLine: string;
    puuid: string;
    profileIconId: number;
    summonerLevel: number;
    rank?: Rank[]; 
}
