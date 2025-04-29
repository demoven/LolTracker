import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './data.service';
import { Account } from './interfaces/account';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from "./search/search.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SearchComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'LolTracker';
  dataService = inject(DataService);
  account!: Account;
}
