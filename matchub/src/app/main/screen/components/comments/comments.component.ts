import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommentDetails } from '../../../../shared/classes/dto/comment/comment-details/comment-details';

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
    this.comments?.sort(
      (commentA, commentB) =>
        this.calculatePoints(commentB) -
        this.calculatePoints(commentA)
    );
  }

  private calculatePoints(comment: CommentDetails): number {
    let positive = comment.numGoodEvaluation;
    let negative = comment.numBadEvaluation;
  
    const total = positive + negative;
    if (total === 0) return 0; // Se não houver avaliações, retorna 0
  
    // Cálculo usando uma simplificação do intervalo de confiança de Wilson para uma proporção binomial
    const z = 1.96; // Nível de confiança de 95%
    const phat = positive / total;
    const score = (phat + z*z/(2*total) - z * Math.sqrt((phat*(1-phat)+z*z/(4*total))/total))/(1+z*z/total);
  
    return score;
  }
}
