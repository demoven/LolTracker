import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Account } from './interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  httpClient = inject(HttpClient);
  apiKey = 'RGAPI-8a2ed497-015b-4ad1-baaa-da04b67d9246';
  url = 'https://europe.api.riotgames.com/';

  constructor() { }

  getAccountByGameNameAndTagLine(gameName: string, tagLine: string, region: string): Observable<Account> {
    return this.httpClient.get<any>(`${this.url}riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${this.apiKey}`)
      .pipe(
        switchMap((response: any) => {
          const puuid = response.puuid;
          return this.httpClient.get<any>(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${this.apiKey}`)
            .pipe(
              map((el: any) => {
                return {
                  id: el.id,
                  gameName: response.gameName,
                  tagLine: response.tagLine,
                  puuid: el.puuid,
                  profileIconId: el.profileIconId,
                  revisionDate: el.revisionDate,
                  summonerLevel: el.summonerLevel
                }
              })
            );
        }
        ));
  }

  getListOfGamesByPuuid(puuid: string, start: number, count: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.url}lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${this.apiKey}`);
  }

  getDetailedMatchById(matchId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.url}lol/match/v5/matches/${matchId}?api_key=${this.apiKey}`);
  }


}
