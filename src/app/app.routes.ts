import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { SummonerDetailsComponent } from './summoner-details/summoner-details.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
    {path: 'summoner/:region/:summonerName', component:SummonerDetailsComponent},
    { path: 'about', component: AboutComponent },
];
