import { Account } from "./account";

export interface Player {
    account: Account;
    assists: number;
    champLevel: number;
    championId: number; //Récupérer les données des champions
    championName: string; //Récupérer les données des champions
    damageDealtToBuildings: number;
    damageDealtToObjectives: number;
    damageDealtToTurrets: number;
    damageSelfMitigated: number;
    deaths: number;
    doubleKills: number;
    tripleKills: number;
    quadraKills: number;
    pentaKills: number;
    firstBloodKill: boolean;
    firstTowerKill: boolean;
    goldEarned: number;
    goldSpent: number;
    individualPosition: string;
    item0: number; // récupérer les données des items
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
    item6: number;
    kills: number;
    longestTimeSpentLiving: number;
    magicDamageDealt: number;
    magicDamageDealtToChampions: number;
    magicDamageTaken: number;
    physicalDamageDealt: number;
    physicalDamageDealtToChampions: number;
    physicalDamageTaken: number;
    playerAugment1: number;
    playerAugment2: number;
    playerAugment3: number;
    playerAugment4: number;
    playerAugment5: number;
    playerAugment6: number;
    playerSubteamId: number;
    summoner1Id: number;
    summoner2Id: number;
    timeCCingOthers:number;
    totalDamageDealt: number;
    totalDamageDealtToChampions: number;
    totalDamageShieldedOnTeammates: number;
    totalDamageTaken: number;
    totalHeal: number;
    totalHealsOnTeammates: number;
    totalMinionsKilled: number;
    totalTimeCCDealt: number;
    totalTimeSpentDead: number;
    trueDamageDealt: number;
    trueDamageDealtToChampions: number;
    trueDamageTaken: number;
    turretKills: number;
    turretTakedowns: number;
    visionScore: number;
    wardsPlaced: number;
    win: boolean;
}
