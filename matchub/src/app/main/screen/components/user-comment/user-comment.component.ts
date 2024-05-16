import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommentBase } from '../../../../classes/comment/comment-base/comment-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-comment',
  templateUrl: './user-comment.component.html',
  styleUrl: './user-comment.component.scss',
})
export class UserCommentComponent {
  @Output()
  sendComment = new EventEmitter<CommentBase>();

  @Input()
  names: (string | undefined | null)[] | undefined;

  form: FormGroup = this.fb.group({
    commentText: [''],
  });

  constructor(private fb: FormBuilder) {}

  private resetForms(){
    this.form.reset({
      commentText: '',
    });
  }

  public onSubmit(): void {
    const commentText = this.form.get('commentText');
    if (commentText && commentText.value) {
      const comment: CommentBase = new CommentBase(commentText.value);
      this.sendComment.emit(comment);
      this.resetForms();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void{
    if(changes['names']){
      this.resetForms();
    }
  }
}
