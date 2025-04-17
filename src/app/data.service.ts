import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { concatMap, from, map, mergeMap, Observable, tap, toArray } from 'rxjs';
import { Account } from './interfaces/account';
import { Game } from './interfaces/game';
import { Rank } from './interfaces/rank';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  httpClient = inject(HttpClient);
  apiKey = 'RGAPI-aede2fbf-b017-492d-b86f-1df17537a181';
  url = 'https://europe.api.riotgames.com/';

  constructor() { }

  getAccountByGameNameAndTagLine(gameName: string, tagLine: string, region: string): Observable<Account> {
    return this.httpClient.get<any>(`${this.getAPIUrl(region)}riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${this.apiKey}`)
      .pipe(
        mergeMap((response: any) => {
          const puuid = response.puuid;
          return this.httpClient.get<any>(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${this.apiKey}`)
            .pipe(
              map((el: any) => {
                return {
                  gameName: response.gameName,
                  tagLine: response.tagLine,
                  puuid: el.puuid,
                  profileIconId: el.profileIconId,
                  summonerLevel: el.summonerLevel   
                };
              })
            );
        })
      );
  }

  getListOfGamesByPuuid(puuid: string, start: number, count: number, region:string): Observable<Game[]> {
    return this.httpClient.get<any[]>(`${this.getAPIUrl(region)}lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${this.apiKey}`)
      .pipe(
        mergeMap((ids: any[]) => from(ids)),
        concatMap((id: any) => this.getDetailedMatchById(id, region)),
        toArray(),
      );
  }

  getRank(puuid: string, region: string): Observable<Rank[]> {
    return this.httpClient.get<Rank[]>(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${this.apiKey}`).pipe(
      map((response: any) => {
        return response.map((rank: any) => {
          return {
            queueType: rank.queueType,
            tier: rank.tier,
            rank: rank.rank,
            leaguePoints: rank.leaguePoints,
            wins: rank.wins,
            losses: rank.losses,
            veteran: rank.veteran,
            inactive: rank.inactive,
            freshBlood: rank.freshBlood,
            hotStreak: rank.hotStreak
          };
        });
      }),
    )
  }

  getDetailedMatchById(matchId: string, region:string): Observable<Game> {
    return this.httpClient.get<any>(`${this.getAPIUrl(region)}lol/match/v5/matches/${matchId}?api_key=${this.apiKey}`).pipe(
      map((response: any) => {
        const participants = response.info.participants.map((participant: any) => {
          const account: Account = {
            gameName: participant.riotIdGameName,
            tagLine: participant.riotIdTagline,
            puuid: participant.puuid,
            profileIconId: participant.profileIcon,
            summonerLevel: participant.summonerLevel
          }
          return {
            account: account,
            assists: participant.assists,
            champLevel: participant.champLevel,
            championId: participant.championId,
            championName: participant.championName,
            damageDealtToBuildings: participant.damageDealtToBuildings,
            damageDealtToObjectives: participant.damageDealtToObjectives,
            damageDealtToTurrets: participant.damageDealtToTurrets,
            damageSelfMitigated: participant.damageSelfMitigated,
            deaths: participant.deaths,
            doubleKills: participant.doubleKills,
            tripleKills: participant.tripleKills,
            quadraKills: participant.quadraKills,
            pentaKills: participant.pentaKills,
            firstBloodKill: participant.firstBloodKill,
            firstTowerKill: participant.firstTowerKill,
            goldEarned: participant.goldEarned,
            goldSpent: participant.goldSpent,
            individualPosition: participant.individualPosition,
            item0: participant.item0,
            item1: participant.item1,
            item2: participant.item2,
            item3: participant.item3,
            item4: participant.item4,
            item5: participant.item5,
            item6: participant.item6,
            kills: participant.kills,
            longestTimeSpentLiving: participant.longestTimeSpentLiving,
            magicDamageDealt: participant.magicDamageDealt,
            magicDamageDealtToChampions: participant.magicDamageDealtToChampions,
            magicDamageTaken: participant.magicDamageTaken,
            physicalDamageDealt: participant.physicalDamageDealt,
            physicalDamageDealtToChampions: participant.physicalDamageDealtToChampions,
            physicalDamageTaken: participant.physicalDamageTaken,
            playerAugment1: participant.playerAugment1,
            playerAugment2: participant.playerAugment2,
            playerAugment3: participant.playerAugment3,
            playerAugment4: participant.playerAugment4,
            playerAugment5: participant.playerAugment5,
            playerAugment6: participant.playerAugment6,
            playerSubteamId: participant.playerSubteamId,
            playerteamId: participant.teamId,
            summoner1Id: participant.summoner1Id, // spell id
            summoner2Id: participant.summoner2Id, // spell id
            timeCCingOthers: participant.timeCCingOthers,
            totalDamageDealt: participant.totalDamageDealt,
            totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
            totalDamageShieldedOnTeammates: participant.totalDamageShieldedOnTeammates,
            totalDamageTaken: participant.totalDamageTaken,
            totalHeal: participant.totalHeal,
            totalHealsOnTeammates: participant.totalHealsOnTeammates,
            totalMinionsKilled: participant.totalMinionsKilled,
            totalTimeCCDealt: participant.totalTimeCCDealt,
            totalTimeSpentDead: participant.totalTimeSpentDead,
            turretKills: participant.turretKills,
            turretTakedowns: participant.turretTakedowns,
            visionScore: participant.visionScore,
            wardsPlaced: participant.wardsPlaced,
            win: participant.win
          };
        });
        const teams = response.info.teams.map((team: any) => {
          return {
            bans: team.bans.map((ban: any) => ban.championId),
            teamId: team.teamId,
            win: team.win,
            voidGrubs: team.objectives.horde,
            atakhan: team.objectives.atakhan,
            baron: team.objectives.baron,
            dragon: team.objectives.dragon,
            champion: team.objectives.champion,
            inhibitor: team.objectives.inhibitor,
            riftHerald: team.objectives.riftHerald,
            tower: team.objectives.tower,
            featEpicMonster: team.feats.EPIC_MONSTER_KILL.featState, // 
            featFirstBlood: team.feats.FIRST_BLOOD.featState, // 3 kills 
            featFirstTower: team.feats.FIRST_TURRET.featState // First tower kill
          };
        });

        const team1 = teams.find((team: any) => team.teamId === 100);
        const team2 = teams.find((team: any) => team.teamId === 200);
        return {
          endOfGameResult: response.info.gameEndTimestamp,
          gameCreation: response.info.gameCreation,
          gameDuration: response.info.gameDuration,
          gameVersion: response.info.gameVersion,
          matchId: response.metadata.matchId,
          gameMode: response.info.gameMode,
          mapId: response.info.mapId,
          participants: participants,
          team1: team1,
          team2: team2
        };
      }),
    );

  }

  getAPIUrl(region: string): string {
    let selectedRegion = '';
    switch (region.toLowerCase()) {
      case 'br1':
        selectedRegion = 'americas'
        break;
      case 'eun1':
        selectedRegion = 'europe'
        break;
      case 'euw1':
        selectedRegion = 'europe'
        break;
      case 'jp1':
        selectedRegion = 'asia'
        break;
      case 'kr':
        selectedRegion = 'asia'
        break;
      case 'la1':
        selectedRegion = 'americas'
        break;
      case 'la2':
        selectedRegion = 'americas'
        break;
      case 'na1':
        selectedRegion = 'americas'
        break;
      case 'oc1':
        selectedRegion = 'americas'
        break;
      case 'tr1':
        selectedRegion = 'europe'
        break;
      case 'ru':
        selectedRegion = 'europe'
        break;
      case 'ph2':
        selectedRegion = 'asia'
        break;
      case 'sg2':
        selectedRegion = 'asia'
        break;
      case 'th2':
        selectedRegion = 'asia'
        break;
      case 'tw2':
        selectedRegion = 'asia'
        break;
      case 'vn2':
        selectedRegion = 'asia'
        break;
      default:
        selectedRegion = 'americas'
        break;
    }
    return `https://${selectedRegion}.api.riotgames.com/`;
  }

}
