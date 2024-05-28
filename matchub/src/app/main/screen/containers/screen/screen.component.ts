import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChampionDetails } from '../../../../classes/dto/champion/champion-details/champion-details';
import {
  EMPTY,
  Observable,
  Subject,
  combineLatest,
  map,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ScreenDetails } from '../../../../classes/dto/screen/screen-details/screen-details';
import { ChampionService } from '../../../shared/services/champion/champion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenService } from '../../../shared/services/screen/screen.service';
import { CommentBase } from '../../../../classes/dto/comment/comment-base/comment-base';
import { CommentService } from '../../../shared/services/comment/comment.service';
import { CommentDetails } from '../../../../classes/dto/comment/comment-details/comment-details';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrl: './screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  /*
  1. ChangeDetectionStrategy.Default,: Por padrão, o Angular verifica mudanças a todo momento e
  inicia o processo de renderização logo após a checagem.
  2. Erro: G0100: ocorre quando o valor de uma expressão no template de um componente é alterado 
  após o processo de detecção de mudanças ter sido concluído para esse ciclo, mas antes que a 
  view seja completamente renderizada. Para o Angular, isso não faz sentido, porque o que será
  renderizado não reflete o estado atual do componente.
  3. ChangeDetectionStrategy.OnPush: verificará e atualizará a view do componente em circunstâncias específicas,
  tal como: emissão de observable inscrito, navegação, etc. Isso resolve, neste caso, porque ele só vai
  atualizar o componente quando spotligthNameSelected e opponentNameSelected estiverem estáveis.
   */
})
export class ScreenComponent implements OnInit {
  // Observable to hold the array of champion details from store
  champions$: Observable<ChampionDetails[]> | undefined;
  screen$: Observable<ScreenDetails> | undefined;

  // Subject to trigger unsubscription upon component destruction
  private destroy$ = new Subject<void>();

  // Current selected champions names for spotlight and opponent
  spotligthNameSelected: string | null | undefined;
  opponentNameSelected: string | null | undefined;

  // Current selected champions id for spotlight and opponent
  // Se for null, quer dizer que procurou e não encontrou
  // Se for undefined, quer dizer que o champions$ ainda não foi preenchido
  spotligthIdSelected: number | null | undefined;
  opponentIdSelected: number | null | undefined;

  screenId: number | undefined;
  comments: CommentDetails[] | undefined;

  constructor(
    private championService: ChampionService,
    private screenService: ScreenService,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
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
    this.screen$ = combineLatest([
      this.route.paramMap,
      this.championService.getAllChampions(),
    ])
      .pipe(
        switchMap(([params, champions]) => {
          this.spotligthNameSelected = params.get('spotlightName');
          this.opponentNameSelected = params.get('opponentName');

          if (!this.spotligthNameSelected || !this.opponentNameSelected) {
            this.goHome();
          }

          if (champions) {
            this.spotligthIdSelected =
              champions.find(
                (champion) => champion.name === this.spotligthNameSelected
              )?.id ?? null;
            this.opponentIdSelected =
              champions.find(
                (champion) => champion.name === this.opponentNameSelected
              )?.id ?? null;
          }

          if (
            this.spotligthIdSelected === undefined ||
            this.opponentIdSelected === undefined
          ) {
            return EMPTY;
          } else if (
            this.spotligthIdSelected === null ||
            this.opponentIdSelected === null
          ) {
            this.goHome();
            return EMPTY;
          } else {
            return this.screenService.getScreen(
              this.spotligthIdSelected!,
              this.opponentIdSelected!
            );
          }
        }),
        takeUntil(this.destroy$)
      );
      
      this.screen$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (screen) => {
          this.screenId = screen.id;
          this.comments = screen.comments;
          this.cdr.markForCheck();
        },
      });
  }

  // Navigate to the home route
  private goHome(): void {
    this.router.navigate(['/main/home']);
  }

  public updateScreen(event: {
    spotlightName: string;
    opponentName: string;
  }): void {
    this.router.navigate([
      `/main/screen/${event.spotlightName}/${event.opponentName}`,
    ]);
  }

  public invalidChampionsNames(): void {
    this.goHome();
  }

  ngOnDestroy(): void {
    // Complete the destroy$ subject to clean up the subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }


  public sendComment(event: CommentBase): void {
    // Não há necessidade de cancelar a inscrição porque observable de posts 
    // completam logo após a requisição finalizar
    if (this.screenId) {
      this.commentService.addComment(this.screenId, event).subscribe({
        next: (newComment) => {
          this.comments?.push(newComment);
          // Necessário porque, agora que o método de atualização é onPush, ele nao sabe que hora é para atulaizar
          this.cdr.markForCheck();
        },
      });
    }
  }
}
