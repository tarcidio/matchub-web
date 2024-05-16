import { Component, Input, SimpleChanges } from '@angular/core';
import { CommentDetails } from '../../../../classes/comment/comment-details/comment-details';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input()
  comment: CommentDetails | undefined;
}
