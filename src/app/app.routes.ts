import { Routes } from '@angular/router';
import { SummonerDetailsComponent } from './summoner-details/summoner-details.component';
import { AboutComponent } from './about/about.component';
import { GameDetailsComponent } from './game-details/game-details.component';

export const routes: Routes = [
    {path: 'summoner/:region/:summonerName', component:SummonerDetailsComponent},
    {path: 'about', component: AboutComponent },
    {path: 'game/detail/:gameVersion/:gameId', component:GameDetailsComponent}
];
