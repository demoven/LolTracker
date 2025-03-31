import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../interfaces/account';
import { DataService } from '../data.service';
import { switchMap } from 'rxjs';

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

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const fullSummonerName = params.get('summonerName') ?? '';
      this.region = params.get('region') ?? ''
      const match = RegExp(/^(.*)#(\w{3,5})$/).exec(fullSummonerName);
      if (match) {
        this.summonerName = match[1]; // Partie avant le dernier #
        this.tagLine = match[2]; // Partie après le dernier #
      } else {
        this.summonerName = fullSummonerName; // Si pas de match, garder tel quel
        this.tagLine = '';
      }
    });

    this.dataService.getAccountByGameNameAndTagLine(this.summonerName, this.tagLine, this.region.toLowerCase()).pipe(
      switchMap((response: Account) => {
        this.account = response;
        console.log('Account:', this.account);
        return this.dataService.getListOfGamesByPuuid(this.account.puuid, 0, 100);
      })
    ).subscribe((games: any[]) => {
      console.log('Games:', games);
    }
    );
    this.dataService.getDetailedMatchById('EUW1_7347621573').subscribe((matchDetails: any) => {
      console.log('Match Details:', matchDetails);
    });
  }
}
