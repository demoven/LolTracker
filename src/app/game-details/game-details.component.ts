import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Game } from '../interfaces/game';
import { DataService } from '../data.service';

@Component({
  selector: 'app-game-details',
  imports: [RouterLink],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent implements OnInit {
  dataService = inject(DataService)
  region!:string
  game:Game | null =null
  gameVersion!:string
  gameId!:string
  router = inject(Router)
  route = inject(ActivatedRoute)
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.gameId=params.get('gameId') ?? ''
      this.gameVersion=params.get('gameVersion') ?? ''
    })
    this.dataService.getDetailedMatchById(this.gameId).subscribe(data =>this.game=data)
    this.route.params.subscribe(params => {
      const fullValue = params['gameId']; // "EUW1_7353440768"
      this.region = fullValue.split('_')[0]; // Takes "EUW1"
    });
  }


  


}

