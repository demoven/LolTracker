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
  isArena: boolean = false
  listTeamId: number[] = []
  listSubTeamId: number[] = []
  dataService = inject(DataService)
  region!: string
  game: Game | null = null
  gameVersion!: string
  gameId!: string
  selectedParticipant: Player | null = null


  router = inject(Router)
  route = inject(ActivatedRoute)
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.gameId = params.get('gameId') ?? ''
      this.gameVersion = params.get('gameVersion') ?? ''
    })

    this.route.params.pipe(
      concatMap(params => {
        const fullValue = params['gameId'];
        this.region = fullValue.split('_')[0];
        return this.dataService.getDetailedMatchById(this.gameId, this.region);
      })
    ).subscribe(data => {
      this.game = data
      for (let player of this.game.participants) {
        if (player.playerteamId !== undefined && !this.listTeamId.includes(player.playerteamId)) {
          this.listTeamId.push(player.playerteamId);
        }
        if (player.playerSubteamId !== undefined && !this.listSubTeamId.includes(player.playerSubteamId)) {
          this.listSubTeamId.push(player.playerSubteamId);
        }
      }
      if (this.game.gameMode != "CLASSIC" && this.game.gameMode != "ARAM") {
        this.isArena = true
      }
    }
    );
  }

  getTeam(): number[] {
    if (this.isArena) {
      // For arena mode, sort teams by subteamplacement
      const teamPlacements = new Map<number, number>();
      
      // Get one player's subteamplacement from each team
      this.game?.participants?.forEach(player => {
        if (player.playerSubteamId !== undefined && player.subteamPlacement !== undefined) {
          // Only set placement once per team (first occurrence)
          if (!teamPlacements.has(player.playerSubteamId)) {
            teamPlacements.set(player.playerSubteamId, player.subteamPlacement);
          }
        }
      });
      
      // Sort by placement (ascending - lower numbers are better placements)
      return [...this.listSubTeamId].sort((a, b) => {
        const aPlacement = teamPlacements.get(a) ?? Number.MAX_VALUE;
        const bPlacement = teamPlacements.get(b) ?? Number.MAX_VALUE;
        return aPlacement - bPlacement;
      });
    } else {
      // For regular games, sort teams by win status (winning teams first)
      const teamResults = new Map<number, boolean>();
      
      // First, determine each team's win status
      this.game?.participants?.forEach(player => {
        if (player.playerteamId !== undefined && player.win !== undefined) {
          teamResults.set(player.playerteamId, player.win);
        }
      });
      
      // Then sort teams by win status (winners first)
      return [...this.listTeamId].sort((a, b) => {
        const aWon = teamResults.get(a) || false;
        const bWon = teamResults.get(b) || false;
        
        if (aWon && !bWon) return -1; // a comes first
        if (!aWon && bWon) return 1;  // b comes first
        return a - b; // If same win status, sort by teamId
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

