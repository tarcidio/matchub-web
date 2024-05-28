import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommentDetails } from '../../../../classes/dto/comment/comment-details/comment-details';
import { EvaluationBase } from '../../../../classes/dto/evaluation/evaluation-base/evaluation-base';
import { EvaluationLevel } from '../../../../classes/enums/evaluation-level/evaluation-level';
import { EvaluationService } from '../../../shared/services/evaluation/evaluation.service';
import { HubUserService } from '../../../shared/services/hub-user/hub-user.service';
import { EvaluationLinks } from '../../../../classes/dto/evaluation/evaluation-links/evaluation-links';

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

  numLikes: number = 0;
  numUnlikes: number = 0;

  isUpdating: boolean = false;

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
      },
    });

    if (this.comment?.evaluations) {
      this.numLikes = this.comment.evaluations.filter(
        (evaluation) => evaluation.level === EvaluationLevel.GOOD
      ).length;
      this.numUnlikes = this.comment.evaluations.length - this.numLikes;
    }
  }

  public manageLikeSystem(type: string, newValue: string): void {
    if (type === 'like' && newValue === 'up') {
      // Então this.hasLiked já era false
      this.hasLiked = true;
      if (this.hasUnliked) {
        // Já existe avaliação: fazer update
        this.hasUnliked = false;
        this.updateEvaluation(new EvaluationBase(EvaluationLevel.GOOD));
      } else {
        // Não existia avaliação: fazer create
        this.createEvaluation(new EvaluationBase(EvaluationLevel.GOOD));
      }
    } else if (type === 'like' && newValue === 'down') {
      // Então this.hasLiked já era true
      this.hasLiked = false;
      this.deleteEvaluation();
    } else if (type === 'unlike' && newValue === 'up') {
      // Então this.hasUnliked já era false
      this.hasUnliked = true;
      if (this.hasLiked) {
        // Já existe avaliação: fazer update
        this.hasLiked = false;
        this.updateEvaluation(new EvaluationBase(EvaluationLevel.BAD));
      } else {
        // Não existia avaliação: fazer create
        this.createEvaluation(new EvaluationBase(EvaluationLevel.BAD));
      }
    } else if (type === 'unlike' && newValue === 'down') {
      // Então this.hasUnliked já era true
      this.hasUnliked = false;
      this.deleteEvaluation();
    }
  }

  get isConnectRSO(): boolean {
    return !!this.comment?.hubUser?.summonerName;
  }

  public createEvaluation(evaluation: EvaluationBase) {
    this.evaluationService
      .createEvaluation(this.comment?.id!, evaluation)
      .subscribe({
        next: (evaluation) => {
          this.hubUserEvaluation = evaluation;
          this.comment?.evaluations.push(evaluation);

          evaluation.level === EvaluationLevel.GOOD
            ? this.numLikes++
            : this.numUnlikes++;
          this.cdr.markForCheck();
        },
      });
  }

  public updateEvaluation(evaluation: EvaluationBase) {
    this.evaluationService
      .updateEvaluation(
        this.comment?.id!,
        this.hubUserEvaluation!.id,
        evaluation
      )
      .subscribe({
        next: (evaluation) => {
          if (this.comment)
            // Após atualizar a base,
            this.comment.evaluations = this.comment?.evaluations.map(
              (evaluationFromComment) =>
                evaluationFromComment.id === evaluation.id
                  ? { ...evaluation } // Retorna um novo objeto com o preço atualizado
                  : evaluationFromComment // Retorna o produto inalterado
            )!;
          if (evaluation.level === EvaluationLevel.GOOD) {
            this.numLikes++;
            this.numUnlikes--;
          } else {
            this.numLikes--;
            this.numUnlikes++;
          }
          this.hubUserEvaluation = evaluation;
          this.cdr.markForCheck();
        },
      });
  }

  public deleteEvaluation() {
    this.evaluationService
      .deleteEvaluation(this.comment?.id!, this.hubUserEvaluation!.id)
      .subscribe({
        next: () => {
          if (this.comment)
            this.comment.evaluations = this.comment?.evaluations.filter(
              (evaluationFromComment) =>
                evaluationFromComment.id !== this.hubUserEvaluation!.id
            );
          this.hubUserEvaluation?.level === EvaluationLevel.GOOD
            ? this.numLikes--
            : this.numUnlikes--;
          this.hubUserEvaluation = undefined;
          this.cdr.markForCheck();
        },
      });
  }

  get hubUserImg(): string{
    return this.hubUserService.getImgHubUser(this.comment?.hubUser.email!);
  }

  // FAZER UPDATE E DELETE NO VETOR DE EVALUATIONS AQUI
  // TESTAR FUNCIONAMENTO
  // ALTERAR PARA QUE ALTERAÇOES NOS COMENTARIOS ACONTECEÇAM NO COMPONENTE DE COMENTARIOS E NAO NA SCREEN
}
