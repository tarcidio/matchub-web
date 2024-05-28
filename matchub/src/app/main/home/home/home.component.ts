import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ChampionDetails } from '../../../classes/dto/champion/champion-details/champion-details';
import { ChampionService } from '../../shared/services/champion/champion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  // Observable to hold the array of champion details from store
  champions$: Observable<ChampionDetails[]> | undefined;

  // Current selected champions names for spotlight and opponent
  spotligthNameSelected: string | undefined;
  opponentNameSelected: string | undefined;

  // Observables to hold the image paths for current selected spotlight and opponent champions
  spotlightImgPath$: Observable<string> | undefined;
  opponentImgPath$: Observable<string> | undefined;

  constructor(
    private championService: ChampionService, // Injects the ChampionService for fetching champion data
    private router: Router // Injects the Angular Router for navigation.
  ) {}

  // Initialize component
  ngOnInit(): void {
    // Fetches all champions on component
    this.champions$ = this.championService.getAllChampions();

    // Sets up the observable to fetch a random spotlight champion image path
    // Obs: if champions$ still undefined, no ploblem, because when champion$ update, it'll update too
    this.spotlightImgPath$ = this.champions$.pipe(
      switchMap((champions) =>
        this.getRandomChampionImagePath(champions, 'Spotlight')
      )
    );

    // Sets up the observable to fetch a random opponent champion image path
    this.opponentImgPath$ = this.champions$.pipe(
      switchMap((champions) =>
        this.getRandomChampionImagePath(champions, 'Opponent')
      )
    );
  }

  // Helper method to fetch a random champion image path
  // Type is need just to get default image when champions is undefined
  private getRandomChampionImagePath(
    champions: ChampionDetails[],
    type: string
  ): Observable<string> {
    let randomName = '';

    if (champions !== undefined) {
      let randomNumber = Math.floor(Math.random() * champions.length);
      randomName = champions[randomNumber].name;
      if (type === 'Spotlight') this.spotligthNameSelected = randomName;
      if (type === 'Opponent') this.opponentNameSelected = randomName;
    }

    return this.championService.getPathImg(randomName, type);
  }

  // Method to update the champion images when select values change
  public updateChampionsImg(): void {
    this.spotlightImgPath$ = this.championService.getPathImg(
      this.spotligthNameSelected!,
      'Spotlight'
    );
    this.opponentImgPath$ = this.championService.getPathImg(
      this.opponentNameSelected!,
      'Opponent'
    );
  }

  // Navigation method to view the matchup between the selected spotlight and opponent champions.
  public seeMatchUp(): void {
    this.router.navigate([
      `/main/screen/${this.spotligthNameSelected}/${this.opponentNameSelected}`,
    ]);
  }
}
