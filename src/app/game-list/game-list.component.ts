import { Component, inject, Input, OnChanges, OnInit, SimpleChanges, } from '@angular/core';
import { Game } from '../interfaces/game';
import { DataService } from '../data.service';
import { GamePreviewComponent } from '../game-preview/game-preview.component';

@Component({
  selector: 'app-game-list',
  imports: [GamePreviewComponent],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css'
})
export class GameListComponent implements OnInit, OnChanges {
  @Input() puuId: string = ''
  @Input() region: string = ''
  gameList: Game[] = []
  dataService = inject(DataService)
  index = 0
  currentPage = 0

  constructor() { }

  ngOnInit(): void {
    this.dataService.getListOfGamesByPuuid(this.puuId, 0, 5, this.region).subscribe(
      (data: Game[]) => {
        this.gameList = data
      }
    )
  }

  // OnChanges est appelé à chaque fois que le puuId change pour mettre à jour la liste des parties
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['puuId']) {
      console.log('PuuId changed:', changes['puuId'].currentValue);
      this.puuId = changes['puuId'].currentValue
      this.gameList = []
      this.dataService.getListOfGamesByPuuid(this.puuId, 0, 5, this.region).subscribe(
        (data: Game[]) => {
          this.gameList = data
        }
      )
    }
  }

  //Charger plus de parties lorsque l'utilisateur clique sur le bouton "Voir plus"
  seeMore() {
    this.dataService.getListOfGamesByPuuid(this.puuId, this.index + 5, 5, this.region).subscribe(
      (data: Game[]) => {
        this.gameList.push(...data)
        this.index += 5
      }
    )
  }
}
