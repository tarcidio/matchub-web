import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommentDetails } from '../../../../classes/comment/comment-details/comment-details';
import { EvaluationBase } from '../../../../classes/evaluation/evaluation-base/evaluation-base';
import { EvaluationLinks } from '../../../../classes/evaluation/evaluation-links/evaluation-links';
import { EvaluationLevel } from '../../../../classes/enums/evaluation-level/evaluation-level';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent {
  @Input()
  comments: CommentDetails[] | undefined;

  @Input()
  hasLiked: boolean = false;
  @Input()
  hasUnliked: boolean = false;
  @Input()
  idEvaluationLoggedHubUser: number | undefined;

  public ngOnChanges(changes: SimpleChanges): void {
    console.log(this.comments);

    this.comments?.sort(
      (commentA, commentB) =>
        this.calculatePoints(commentB.evaluations) -
        this.calculatePoints(commentA.evaluations)
    );
    console.log(this.comments);
  }

  private calculatePoints(evaluations: EvaluationLinks[]): number {
    let positive = 0;
    let negative = 0;
  
    evaluations.forEach(evaluation => {
      if (evaluation.level === EvaluationLevel.GOOD) {
        positive += 1;
      } else if (evaluation.level === EvaluationLevel.BAD) {
        negative += 1;
      }
    });
  
    const total = positive + negative;
    if (total === 0) return 0; // Se não houver avaliações, retorna 0
  
    // Cálculo usando uma simplificação do intervalo de confiança de Wilson para uma proporção binomial
    const z = 1.96; // Nível de confiança de 95%
    const phat = positive / total;
    const score = (phat + z*z/(2*total) - z * Math.sqrt((phat*(1-phat)+z*z/(4*total))/total))/(1+z*z/total);
  
    return score;
  }
}
