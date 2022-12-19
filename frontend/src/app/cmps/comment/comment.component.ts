import { CommentService } from 'src/app/services/comment.service';
import { User } from './../../models/user.model';
import { Component, OnInit, Input, inject } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  inputs: ['comment', 'type', 'loggedinUser']
})
export class CommentComponent implements OnInit {

  constructor() { }

  commentService = inject(CommentService);

  comment!: Comment;
  type!: string;

  isExpandTxt: boolean = false;
  isLongTxt!: boolean;
  isLiked: boolean = false;
  loggedinUser !: User;

  async ngOnInit() {
    console.log('this.comment.text.length', this.comment.text.length)
    this.isLongTxt = this.comment.text.length > 100;
    console.log('this.isLongTxt', this.isLongTxt)
    this.isLiked = await this.commentService.checkIsLiked(this.loggedinUser.id, this.comment.id);
  }

  async onToggleLike() {
    this.commentService.toggleLike(this.isLiked, { user: this.loggedinUser, commentId: this.comment.id });
    this.isLiked = !this.isLiked;
  }

  onExpandTxt() {
    this.isExpandTxt = true;
  }

}
