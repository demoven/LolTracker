import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  summonerNameCtrl!: FormControl
  regionCtrl!: FormControl
  router = inject(Router)
  errorMessage: string = ''

  constructor() { }

  ngOnInit(): void {
    this.summonerNameCtrl = new FormControl('', { nonNullable: true });
    this.regionCtrl = new FormControl('', { nonNullable: true })
    this.searchForm = new FormGroup({
      summonerName: this.summonerNameCtrl,
      region: this.regionCtrl
    })
  }
  
  submit() {
    if (this.summonerNameCtrl.value === '' || this.regionCtrl.value === '') {
      this.errorMessage = 'Remplir tous les champs'
      return
    }
    
    const regex = /^[^#\s]+#[a-zA-Z0-9]{1,5}$/;

    if (!regex.test(this.summonerNameCtrl.value)) {
      this.errorMessage = 'Le pseudo doit être au format nom#tag';
      return;
    }
    
    this.errorMessage = ''
    this.router.navigate(['/summoner/', this.regionCtrl.value, this.summonerNameCtrl.value])
  }
}
