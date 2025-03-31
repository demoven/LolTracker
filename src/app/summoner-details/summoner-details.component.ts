import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-summoner-details',
  imports: [],
  templateUrl: './summoner-details.component.html',
  styleUrl: './summoner-details.component.css'
})
export class SummonerDetailsComponent implements OnInit {
summonerName:string=''
tagLine:string=''
region:string=''
router=inject(Router)
route=inject(ActivatedRoute)
ngOnInit(): void {
  this.route.paramMap.subscribe((params) => {
    const fullSummonerName = params.get('summonerName') ?? '';
    this.region=params.get('region') ??''
    const match = fullSummonerName.match(/^(.*)#(\w{3,5})$/);
    if (match) {
      this.summonerName = match[1]; // Partie avant le dernier #
      this.tagLine = match[2]; // Partie après le dernier #
    } else {
      this.summonerName = fullSummonerName; // Si pas de match, garder tel quel
      this.tagLine = '';
    }
  });
}

}
