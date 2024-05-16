import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommentDetails } from '../../../../classes/comment/comment-details/comment-details';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent{
  
  @Input()
  comments: CommentDetails[] | undefined;
  
}
