import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommentDetails } from '../../../../shared/classes/dto/comment/comment-details/comment-details';
import { EvaluationBase } from '../../../../shared/classes/dto/evaluation/evaluation-base/evaluation-base';
import { EvaluationLevel } from '../../../../shared/classes/enums/evaluation-level/evaluation-level';
import { EvaluationService } from '../../../shared/services/evaluation/evaluation.service';
import { HubUserService } from '../../../shared/services/hub-user/hub-user.service';
import { EvaluationLinks } from '../../../../shared/classes/dto/evaluation/evaluation-links/evaluation-links';
import { EMPTY, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent implements OnInit {
  @Input()
  comment: CommentDetails | undefined;

  hubUserEvaluation: EvaluationLinks | undefined;
  hasLiked: boolean = false;
  hasUnliked: boolean = false;

  isUpdatingLike: boolean = false;
  isUpdatingUnLike: boolean = false;

  isOwner: boolean = false;

  constructor(
    private evaluationService: EvaluationService,
    private hubUserService: HubUserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.hubUserService.getHubUserId().subscribe({
      next: (hubUserId) => {
        if (hubUserId) {
          // Se houver um usuário conectado
          this.isOwner = hubUserId === this.comment?.hubUser.id;

          if (!this.isOwner) {
            // Procura nas avaliações do comentário se alguém pertence a ele
            const foundEvaluation: EvaluationLinks | undefined =
              this.comment?.evaluations.find(
                (evaluation) => evaluation.hubUserId === hubUserId
              );
            // Se houver algum
            if (foundEvaluation) {
              // Atualiza o objeto relativo a avalição do usuário para aquele comentário
              this.hubUserEvaluation = foundEvaluation;
              // Atualiza indicadores de like e unlike
              foundEvaluation.level === EvaluationLevel.GOOD
                ? (this.hasLiked = true)
                : (this.hasUnliked = true);
              this.cdr.markForCheck();
            }
          }
        }
      },
    });
  }

  private manageBottonLikeSystem(type: string): void {
    if (type === 'like') this.isUpdatingLike = !this.isUpdatingLike;
    else if (type === 'unlike') this.isUpdatingUnLike = !this.isUpdatingUnLike;
  }

  private manageUpdatingSystem(
    type: string,
    newValue: string
  ): Observable<EvaluationLinks | void> {
    if (type === 'like' && newValue === 'up') {
      // Então this.hasLiked já era false
      this.hasLiked = true;
      if (this.hasUnliked) {
        // Já existe avaliação: fazer update
        this.hasUnliked = false;
        return this.updateEvaluation(new EvaluationBase(EvaluationLevel.GOOD));
      } else {
        // Não existia avaliação: fazer create
        return this.createEvaluation(new EvaluationBase(EvaluationLevel.GOOD));
      }
    } else if (type === 'like' && newValue === 'down') {
      // Então this.hasLiked já era true
      this.hasLiked = false;
      return this.deleteEvaluation();
    } else if (type === 'unlike' && newValue === 'up') {
      // Então this.hasUnliked já era false
      this.hasUnliked = true;
      if (this.hasLiked) {
        // Já existe avaliação: fazer update
        this.hasLiked = false;
        return this.updateEvaluation(new EvaluationBase(EvaluationLevel.BAD));
      } else {
        // Não existia avaliação: fazer create
        return this.createEvaluation(new EvaluationBase(EvaluationLevel.BAD));
      }
    } else if (type === 'unlike' && newValue === 'down') {
      // Então this.hasUnliked já era true
      this.hasUnliked = false;
      return this.deleteEvaluation();
    } else {
      return EMPTY;
    }
  }

  public manageLikeSystem(type: string, newValue: string): void {
    this.manageBottonLikeSystem(type);
    this.manageUpdatingSystem(type, newValue).subscribe({
      next: () => this.manageBottonLikeSystem(type),
    });
  }

  get isConnectRSO(): boolean {
    return !!this.comment?.hubUser?.summonerName;
  }

  public createEvaluation(
    evaluation: EvaluationBase
  ): Observable<EvaluationLinks> {
    return this.evaluationService
      .createEvaluation(this.comment?.id!, evaluation)
      .pipe(
        tap((newEvaluation: EvaluationLinks) => {
          this.hubUserEvaluation = newEvaluation;
          this.comment?.evaluations.push(newEvaluation);

          newEvaluation.level === EvaluationLevel.GOOD
            ? this.comment!.numGoodEvaluation++
            : this.comment!.numBadEvaluation++;

          this.cdr.markForCheck();
        })
      );
  }

  public updateEvaluation(
    evaluation: EvaluationBase
  ): Observable<EvaluationLinks> {
    return this.evaluationService
      .updateEvaluation(
        this.comment?.id!,
        this.hubUserEvaluation!.id,
        evaluation
      )
      .pipe(
        tap((updatedEvaluation: EvaluationLinks) => {
          if (this.comment) {
            this.comment.evaluations = this.comment.evaluations.map(
              (evaluationFromComment) =>
                evaluationFromComment.id === updatedEvaluation.id
                  ? { ...updatedEvaluation }
                  : evaluationFromComment
            );
          }

          if (updatedEvaluation.level === EvaluationLevel.GOOD) {
            this.comment!.numGoodEvaluation++;
            this.comment!.numBadEvaluation--;
          } else {
            this.comment!.numBadEvaluation++;
            this.comment!.numGoodEvaluation--;
          }

          this.hubUserEvaluation = updatedEvaluation;
          this.cdr.markForCheck();
        })
      );
  }

  public deleteEvaluation(): Observable<void> {
    return this.evaluationService
      .deleteEvaluation(this.comment?.id!, this.hubUserEvaluation!.id)
      .pipe(
        tap(() => {
          if (this.comment) {
            this.comment.evaluations = this.comment.evaluations.filter(
              (evaluationFromComment) =>
                evaluationFromComment.id !== this.hubUserEvaluation!.id
            );
          }

          if (this.hubUserEvaluation?.level === EvaluationLevel.GOOD) {
            this.comment!.numGoodEvaluation--;
          } else {
            this.comment!.numBadEvaluation--;
          }

          this.hubUserEvaluation = undefined;
          this.cdr.markForCheck();
        })
      );
  }

  get hubUserImg(): string {
    return this.hubUserService.getImgHubUser(this.comment?.hubUser.email!);
  }

  // FAZER UPDATE E DELETE NO VETOR DE EVALUATIONS AQUI
  // TESTAR FUNCIONAMENTO
  // ALTERAR PARA QUE ALTERAÇOES NOS COMENTARIOS ACONTECEÇAM NO COMPONENTE DE COMENTARIOS E NAO NA SCREEN
}
