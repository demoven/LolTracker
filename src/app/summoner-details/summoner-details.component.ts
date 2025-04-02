import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../interfaces/account';
import { DataService } from '../data.service';
import { mergeMap, switchMap } from 'rxjs';
import { Game } from '../interfaces/game';
import { GameListComponent } from '../game-list/game-list.component';
import { Rank } from '../interfaces/rank';

@Component({
  selector: 'app-summoner-details',
  imports: [GameListComponent],
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
  account: Account | null = null;
  rank!:Rank

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
        mergeMap((response: Account) => {
          this.account = response;
          return this.dataService.getRank(this.account.puuid, this.region)
        })
      )
      .subscribe((rank: Rank[]) => {
        if(this.account!==null)
        this.account.rank = rank
      });
      
    });
  }
}
