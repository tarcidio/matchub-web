import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChampionDetails } from '../../../../classes/champion/champion-details/champion-details';
import { EMPTY, Observable, Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { ChampionService } from '../../../shared/services/champion/champion.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-champions',
  templateUrl: './champions.component.html',
  styleUrl: './champions.component.scss',
})
export class ChampionsComponent implements OnInit, OnDestroy {
  // Observable to hold the array of champion details from store
  champions$: Observable<ChampionDetails[]> | undefined;

  // Subject to trigger unsubscription upon component destruction
  private destroy$ = new Subject<void>();

  // Current selected champions names for spotlight and opponent
  spotligthNameSelected: string | null = null;
  opponentNameSelected: string | null = null;

  // Observables to hold the image paths for current selected spotlight and opponent champions
  spotlightImgPath$: Observable<string | Error> | undefined;
  opponentImgPath$: Observable<string | Error> | undefined;

  constructor(
    private championService: ChampionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch all champions on component
    this.champions$ = this.championService.getAllChampions();

    // Subscribe to route parameters and handle champion selection
    /*
    Why do we need registration here and not in HomeComponent?
    Answer: In HomeComponent, nothing in ngOnInit has a variable that in the pipe needs to equal one 
    observable equal to another. Here, however, we need to load the image. So, if we didn't subscribe, 
    any change to the champions' names, even if they were updated in the pipe, would not trigger loadImages.
    */
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe({
      next: (params) => {
        this.spotligthNameSelected = params.get('spotlightName');
        this.opponentNameSelected = params.get('opponentName');

        !this.spotligthNameSelected || !this.opponentNameSelected
          ? this.goHome() // Navigate home if no valid champions are selected
          : this.loadImages(); // Load images for the selected champions
      },
      error: () => this.goHome(), // Navigate home on any route parameter error
    });
  }

  ngOnDestroy(): void {
    // Complete the destroy$ subject to clean up the subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Load images for the selected champions and handle errors
  private loadImages(): void {
    this.spotlightImgPath$ = this.championService
      .getPathImg(this.spotligthNameSelected, 'Spotlight')
      .pipe(catchError(this.handleError.bind(this)));
    this.opponentImgPath$ = this.championService
      .getPathImg(this.opponentNameSelected, 'Opponent')
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Navigate to the home route
  private goHome(): void {
    this.router.navigate(['/main/home']);
  }

  // Handle errors by logging and navigating home
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    this.goHome();
    // It's necessary for the pipe to continue returning an observable. So we send an observable that does nothing
    return EMPTY;
  }

  // Public method to update the screen based on the selected champions
  public updateScreen(): void {
    this.router.navigate([
      `/main/screen/${this.spotligthNameSelected}/${this.opponentNameSelected}`,
    ]);
  }
}

/*
Quando fazemos isso, estamos aumentando um código que poderia ser resolvido passando Observable para
o template html
let images$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.spotligthNameSelected = params.get('spotlightName');
        this.opponentNameSelected = params.get('opponentName');

        // Verifica se ambos os nomes estão presentes
        if (this.spotligthNameSelected && this.opponentNameSelected) {
          // forkJoin can to return error too
          return forkJoin({
            spotlightImgPath: this.championService.getPathImgChampionByName(
              this.spotligthNameSelected
            ),
            opponentImgPath: this.championService.getPathImgChampionByName(
              this.opponentNameSelected
            ),
          });
        } else {
          // Retorna um Observable que emite um erro ou um valor padrão se algum nome não estiver disponível
          return throwError(() => new Error("Champions names don't provided"));
        }
      })
    );

    this.subscriptions?.add(
      images$.subscribe({
        next: (imagesPath) => {
          this.spotlightImgPath = imagesPath.spotlightImgPath;
          this.opponentImgPath = imagesPath.opponentImgPath;
        },
        error: (error) => this.router.navigate(['/main/home']),
      })
    );
*/

/**
 * Quando fazemos isso, atualizamos pathImgChampionSpotlight apenas quando mudar champions, mas isso
 * ocorre só quando um novo champion é lançado. Precisaríamos inicializar os paths sempre que
 * há um alteração no ngModel
 *
 * Ideia: receber nome no input e dai fazer uma função que recebe o nome e atualiza
 *
 */
// this.subscription.add(
//   this.champions$.subscribe((champions) => {
//     this.pathImgChampionSpotlight = this.getPathImgChampion(
//       champions,
//       this.spotligthIdSelected
//     );
//     this.pathImgChampionOpponent = this.getPathImgChampion(
//       champions,
//       this.opponentIdSelected
//     );
//   })
// );

/*
Problemas:
1. "| async": usado apenas em template html
2. Usar pipe: manipulação de observables em componentes Typescript
   
getPathImgChampion(idChampion: number): string{
    let pathBase: string = '../../../../../assets/';
    let nameChampion: string = (this.champions$? | async)?.find(champion => champion.id === opponentIdSelected)?.name;
    return pathBase + nameChampion + '_0';
  }
*/

/*
Problemas:
1. Aqui retornamos um observable para o template html e ele terá que lidar lá
getPathImgChampion(idChampion: number): Observable<string> | undefined {
    let pathBase: string = '../../../../../assets/champions/';
    console.log('OI');
    return this.champions$?.pipe(
      // here, "map" is used in each flow element, but there are only one flow element: ChampionDetails[]
      map((champions) => {
        const nameChampion = champions.find(
          (champion) => champion.id === idChampion
        )?.name;
        console.log(pathBase + nameChampion + '_0.jpg');
        return pathBase + nameChampion + '_0.jpg';
      })
    );
  }

*/

/* A ONDE ENTRA STORE NESSA HISTORIA TODA AI PORRA: TEM QUE PEGAR OS ID OU O PROPRIO CHAMPION DO STORE */
/* TEM QUE TRATAR O CASO DE A SOLICITACAO NO SERVICE DER ERRO: IR PARA LOGIN */
