import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../interfaces/account';
import { DataService } from '../data.service';
import { switchMap } from 'rxjs';
import { Game } from '../interfaces/game';

@Component({
  selector: 'app-summoner-details',
  imports: [],
  templateUrl: './summoner-details.component.html',
  styleUrl: './summoner-details.component.css'
})
export class SummonerDetailsComponent implements OnInit {
  summonerName: string = ''
  tagLine: string = ''
  region: string = ''
  router = inject(Router)
  route = inject(ActivatedRoute)
  dataService = inject(DataService);
  account!: Account;
  game!: Game;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const fullSummonerName = params.get('summonerName') ?? '';
      this.region = params.get('region') ?? ''
      const match = RegExp(/^(.*)#(\w{3,5})$/).exec(fullSummonerName);
      if (match) {
        this.summonerName = match[1]; 
        this.tagLine = match[2]; 
      } else {
        this.summonerName = fullSummonerName; 
        this.tagLine = '';
      }

      this.dataService.getAccountByGameNameAndTagLine(this.summonerName, this.tagLine, this.region.toLowerCase()).pipe(
        switchMap((response: Account) => {
          this.account = response;
          console.log('Account:', this.account);
          return this.dataService.getListOfGamesByPuuid(this.account.puuid, 0, 5);
        })
      ).subscribe((games: any[]) => {
        console.log('Games:', games);
      }
      );
      this.dataService.getDetailedMatchById('EUW1_7352476040').subscribe((matchDetails: any) => {
        console.log('Match Details:', matchDetails);
        this.game = matchDetails;
        console.log('Game:', this.game);
      });
    });

  }
}
