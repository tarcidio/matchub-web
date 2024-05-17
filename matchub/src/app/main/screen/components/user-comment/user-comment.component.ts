import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
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

  invalidComment : boolean = false;

  form: FormGroup = this.fb.group({
    commentText: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(280)]],
  });

  constructor(private fb: FormBuilder) {}

  private resetForms() {
    this.form.reset({
      commentText: ''
    });
    this.invalidComment = false;
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const commentText = this.form.get('commentText');
      const comment: CommentBase = new CommentBase(commentText!.value);
      this.sendComment.emit(comment);
      this.resetForms();
    } else {
      this.invalidComment = true;
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['names']) {
      this.resetForms();
    }
  }

}
