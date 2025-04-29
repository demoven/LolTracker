import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  summonerNameCtrl!: FormControl
  regionCtrl!: FormControl
  router = inject(Router)

  constructor() {}

  ngOnInit(): void {
    this.summonerNameCtrl = new FormControl('', { nonNullable: true });
    this.regionCtrl = new FormControl('', { nonNullable: true })
    this.searchForm = new FormGroup({
      summonerName: this.summonerNameCtrl,
      region: this.regionCtrl
    })


  }
  submit() {
    this.router.navigate(['/summoner/', this.regionCtrl.value, this.summonerNameCtrl.value])
  }
}
