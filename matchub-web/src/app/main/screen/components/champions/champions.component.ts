import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChampionService } from '../../../shared/services/champion/champion.service';
import { ChampionDetails } from '../../../../shared/classes/dto/champion/champion-details/champion-details';

@Component({
  selector: 'app-champions',
  templateUrl: './champions.component.html',
  styleUrl: './champions.component.scss',
})
export class ChampionsComponent {
  // Current selected champions names for spotlight and opponent
  @Input()
  spotlightNameSelected: string | null | undefined;
  @Input()
  opponentNameSelected: string | null | undefined;
  @Input()
  champions: ChampionDetails[] | null = null;

  @Output()
  invalidChampionsNames = new EventEmitter<void>();
  @Output()
  updateChampionsNames = new EventEmitter<{
    spotlightName: string;
    opponentName: string;
  }>();

  // Observables to hold the image paths for current selected spotlight and opponent champions
  spotlightImgPath$: Observable<string> | undefined;
  opponentImgPath$: Observable<string> | undefined;

  constructor(private championService: ChampionService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.spotlightImgPath$ = this.championService
      .getPathImg(this.spotlightNameSelected, 'Spotlight')
      .pipe(catchError(this.handleError.bind(this)));
    this.opponentImgPath$ = this.championService
      .getPathImg(this.opponentNameSelected, 'Opponent')
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Handle errors by logging and navigating home
  private handleError(error: any): Observable<never> {
    this.invalidChampionsNames.emit();
    // It's necessary for the pipe to continue returning an observable. So we send an observable that does nothing
    return EMPTY;
  }

  // Public method to update the screen based on the selected champions
  public updateScreen(): void {
    this.updateChampionsNames.emit({
      spotlightName: this.spotlightNameSelected!,
      opponentName: this.opponentNameSelected!,
    });
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
