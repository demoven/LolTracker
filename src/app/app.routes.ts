import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { SummonerDetailsComponent } from './summoner-details/summoner-details.component';

export const routes: Routes = [
    {path: 'summoner/:region/:summonerName', component:SummonerDetailsComponent}
];
