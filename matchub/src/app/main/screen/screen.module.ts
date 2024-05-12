import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScreenRoutingModule } from './screen-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ScreenComponent } from './containers/screen/screen.component';
import { ChampionsComponent } from './components/champions/champions.component';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentComponent } from './components/comment/comment.component';
import { UserCommentComponent } from './components/user-comment/user-comment.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ScreenComponent,
    ChampionsComponent,
    CommentsComponent,
    CommentComponent,
    UserCommentComponent,
  ],
  imports: [CommonModule, ScreenRoutingModule, SharedModule, FormsModule],
})
export class ScreenModule {}
