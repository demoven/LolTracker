import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Game } from '../interfaces/game';
import { DataService } from '../data.service';
import { concatMap } from 'rxjs';
import { Player } from '../interfaces/player';
import { Team } from '../interfaces/team';

@Component({
  selector: 'app-game-details',
  imports: [RouterLink],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent implements OnInit {
  isArena:boolean=false
  listTeamId:number[]= []
  listSubTeamId:number[]=[]
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
    
    this.route.params.pipe(
      concatMap(params => {
        const fullValue = params['gameId']; // "EUW1_7353440768"
        this.region = fullValue.split('_')[0]; // Takes "EUW1"
        return this.dataService.getDetailedMatchById(this.gameId, this.region);
      })
    ).subscribe(data =>{this.game=data
      for(var player of this.game.participants){
        if (player.playerteamId !== undefined && !this.listTeamId.includes(player.playerteamId)) {
          this.listTeamId.push(player.playerteamId);
        }
        if (player.playerSubteamId !== undefined && !this.listSubTeamId.includes(player.playerSubteamId)) {
          this.listSubTeamId.push(player.playerSubteamId);
        }
      }
      if(this.game.gameMode !="CLASSIC" && this.game.gameMode !="ARAM"){
        this.isArena=true

      }
      
  }
    );
  }
  getTeam(): number[]{
    if(this.isArena){
      return this.listSubTeamId
    }
    return this.listTeamId
  }
  getListPlayerByTeamId(id: number): Player[] {
    if(this.isArena){      
      return this.game?.participants?.filter(player => player.playerSubteamId === id) ?? [];
    }
    else{
    return this.game?.participants?.filter(player => player.playerteamId === id) ?? [];}
  }
  
  
}

