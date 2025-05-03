import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Game } from '../interfaces/game';
import { DataService } from '../data.service';
import { concatMap } from 'rxjs';
import { Player } from '../interfaces/player';
import { ItemComponent } from "../item/item.component";

@Component({
  selector: 'app-game-details',
  imports: [RouterLink, ItemComponent],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent implements OnInit {
  // Arena est un mode de jeu spécifique qui a des règles différentes donc un affichage différent pour les équipes
  isArena: boolean = false
  listTeamId: number[] = []
  listSubTeamId: number[] = []
  dataService = inject(DataService)
  region!: string
  game: Game | null = null
  gameVersion!: string
  gameId!: string
  selectedParticipant: Player | null = null
  gameMode!: string


  router = inject(Router)
  route = inject(ActivatedRoute)

  ngOnInit(): void {

    // Récupérer les paramètres de la route
    this.route.params.pipe(
      concatMap(params => {
        this.gameId = params['gameId'];
        this.gameVersion = params['gameVersion'];
        this.region = this.gameId.split('_')[0];
        // Récupérer les détails de la partie
        return this.dataService.getDetailedMatchById(this.gameId, this.region);
      })
    ).subscribe(data => {
      // Récupérer les données de la partie
      this.game = data

      for (let player of this.game.participants) {
        //
        if (player.playerteamId !== undefined && !this.listTeamId.includes(player.playerteamId)) {
          this.listTeamId.push(player.playerteamId);
        }
        if (player.playerSubteamId !== undefined && !this.listSubTeamId.includes(player.playerSubteamId)) {
          this.listSubTeamId.push(player.playerSubteamId);
        }
      }
      // Mode de jeu spécifique pour Arena
      if (this.game.gameMode == "CHERRY") {
        this.gameMode = "ARENA"
        this.isArena = true
      }
      else {
        this.gameMode = this.game.gameMode
        this.isArena = false
      }
    }
    );
  }

  getTeam(): number[] {
    if (this.isArena) {
      // Pour l'Arena, trier les équipes par placement (meilleur placement en premier)
      const teamPlacements = new Map<number, number>();
      
      this.game?.participants?.forEach(player => {
        if (player.playerSubteamId !== undefined && player.subteamPlacement !== undefined) {
          
          if (!teamPlacements.has(player.playerSubteamId)) {
            teamPlacements.set(player.playerSubteamId, player.subteamPlacement);
          }
        }
      });
      
      return [...this.listSubTeamId].sort((a, b) => {
        const aPlacement = teamPlacements.get(a) ?? Number.MAX_VALUE;
        const bPlacement = teamPlacements.get(b) ?? Number.MAX_VALUE;
        return aPlacement - bPlacement;
      });
    } else {
      // Pour les autres modes de jeu, trier les équipes par statut de victoire
      const teamResults = new Map<number, boolean>();
      
      this.game?.participants?.forEach(player => {
        if (player.playerteamId !== undefined && player.win !== undefined) {
          teamResults.set(player.playerteamId, player.win);
        }
      });
      
      return [...this.listTeamId].sort((a, b) => {
        const aWon = teamResults.get(a) || false;
        const bWon = teamResults.get(b) || false;
        
        if (aWon && !bWon) return -1; 
        if (!aWon && bWon) return 1;  
        return a - b; 
      });
    }
  }

  getListPlayerByTeamId(id: number): Player[] {
    if (this.isArena) {
      return this.game?.participants?.filter(player => player.playerSubteamId === id) ?? [];
    }
    else {
      return this.game?.participants?.filter(player => player.playerteamId === id) ?? [];
    }
  }


  selectParticipant(participant: Player): void {
    this.selectedParticipant = participant;
  }

}

