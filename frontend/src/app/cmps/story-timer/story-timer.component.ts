import { Story, StoryImg } from './../../models/story.model';
import { Router } from '@angular/router';
import { Component, OnInit, inject, OnChanges, OnDestroy, EventEmitter } from '@angular/core';

@Component({
  selector: 'story-timer',
  templateUrl: './story-timer.component.html',
  styleUrls: ['./story-timer.component.scss'],
  inputs: ['currStory', 'nextStory', 'currImgIdx', 'isPlaying', 'isUserStory'],
  outputs: ['onSetImgUrl']
})
export class StoryTimerComponent implements OnInit, OnDestroy, OnChanges {


  constructor() { }
  router = inject(Router);
  onSetImgUrl = new EventEmitter<number>();
  imgUrls!: string[];
  values!: number[];
  intervalId!: any;
  currImgIdx!: number;
  idx = 0;
  currStory!: Story;
  nextStory!: Story;
  isPlaying!: boolean;
  isUserStory!: boolean;
  userPreviewType: string = '';


  ngOnInit(): void {
  }
  
  ngOnChanges() {
    this.userPreviewType = this.isUserStory ? 'user-story-timer' : 'story-timer';
    this.imgUrls = this.currStory.imgUrls;
    this.values = this.imgUrls.map((imgUrl, idx) => {
      if (idx < this.currImgIdx) return 100;
      return 0
    });
    this.idx = this.currImgIdx;
    clearInterval(this.intervalId);
    if (this.isPlaying) this.playStory();
  }

  onTogglePlayStory() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) this.playStory();
    else clearInterval(this.intervalId);

  }

  playStory() {
    this.intervalId = setInterval(() => {
      this.values[this.idx] = this.values[this.idx] + 2.5;
      if (this.values[this.idx] === 100) {
        this.idx = this.idx + 1;
        if (this.idx < this.values.length) this.onSetImgUrl.emit(1);
      }
      if (this.idx > this.values.length - 1) {
        clearInterval(this.intervalId);
        if (this.nextStory) this.router.navigate(['/story/', this.nextStory.id]);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

}
