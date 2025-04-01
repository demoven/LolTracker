import { Component, inject, Input, OnInit } from '@angular/core';
import { Game } from '../interfaces/game';
import { Player } from '../interfaces/player';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-preview',
  imports: [],
  templateUrl: './game-preview.component.html',
  styleUrl: './game-preview.component.css'
})
export class GamePreviewComponent implements OnInit {
  router = inject(Router)
  @Input() game!:Game
  @Input() puuid!:string
parsedGameVersion!:string
championPlayedByPlayer!:string
player:Player | null=null

constructor(){}
  ngOnInit(): void {
    this.parsedGameVersion=this.getGameVersion(this.game)
    this.championPlayedByPlayer=this.getPlayedChampion(this.game, this.puuid)
    this.player=this.getPlayedParticipant(this.game,this.puuid)
  }

getGameVersion(game:Game){
  const parts = game.gameVersion.split('.');
    if (parts.length < 2) {
        throw new Error("Format invalide, attendu: 'number1.number2.number3.number4'");
    }
    return `${parts[0]}.${parts[1]}.1`; 
}

getPlayedChampion(game:Game, id:string) {
  const participant = game.participants.find(element => element.account.puuid === id);
  return participant ? participant.championName : ''; 
}
getPlayedParticipant(game: Game, id: string) {
  const participant = game.participants.find(element => element.account.puuid === id);
  return participant ? participant : null;
}

  submit(){
    this.router.navigate(['/game/detail/', this.parsedGameVersion,this.game.matchId])
  }

}

