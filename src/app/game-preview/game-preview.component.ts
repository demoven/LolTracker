import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../interfaces/game';

@Component({
  selector: 'app-game-preview',
  imports: [],
  templateUrl: './game-preview.component.html',
  styleUrl: './game-preview.component.css'
})
export class GamePreviewComponent implements OnInit {
  @Input() game!:Game
  @Input() puuid!:string
parsedGameVersion!:string
championPlayedByPlayer!:string

constructor(){}
  ngOnInit(): void {
    this.parsedGameVersion=this.getGameVersion(this.game)
    this.championPlayedByPlayer=this.getPlayedChampion(this.game, this.puuid)
  }

getGameVersion(game:Game){
  const parts = game.gameVersion.split('.');
    if (parts.length < 2) {
        throw new Error("Format invalide, attendu: 'number1.number2.number3.number4'");
    }
    return `${parts[0]}.${parts[1]}.1`; 
}

getPlayedChampion(game:Game, id:string):string{
  var p:string=''
  game.participants.forEach(element => {
    if(element.account.puuid===id){
      p=element.championName
    }
  })
  return p

}
}

