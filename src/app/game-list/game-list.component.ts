import { Component, inject, Input, OnInit,} from '@angular/core';
import { Game } from '../interfaces/game';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { GamePreviewComponent } from '../game-preview/game-preview.component';

@Component({
  selector: 'app-game-list',
  imports: [GamePreviewComponent],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css'
})
export class GameListComponent implements OnInit {
@Input() puuId:string =''
gameList:Game[] = []
dataService = inject(DataService)
index=0
ngOnInit(): void {
    console.log(this.puuId)
    this.dataService.getListOfGamesByPuuid('lpbSuYib5rERTDS8Q3kyK4gNN013_nwZqPvRbaNeQJdoNNbmwv4hFLkX6uWDg9oLREjUsgAAUYXgWw', 0, 5).subscribe(
      (data:Game[]) =>{ 
        this.gameList = data
      }
    )
}
constructor(){}

}
