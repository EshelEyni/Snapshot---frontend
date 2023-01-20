import { Story } from './../../models/story.model'
import { StoryService } from './../../services/story.service'
import { UserService } from 'src/app/services/user.service'
import { MiniUser } from './../../models/user.model'
import { Component, OnInit, OnChanges, inject } from '@angular/core'
import { Location } from 'src/app/models/post.model'
import { lastValueFrom } from 'rxjs'

@Component({
  selector: 'user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss'],
  inputs: ['user', 'type', 'location'],
})
export class UserPreviewComponent implements OnInit, OnChanges {

  constructor() { }

  userService = inject(UserService);
  storyService = inject(StoryService);

  user!: MiniUser;
  story!: Story;
  isStoryDisabled: boolean = false;
  isStoryViewed: boolean = false;
  type!: string;
  desc!: string;
  title = '';
  location!: Location | null;
  urlForImg: string = '';
  urlForTitle: string = '';
  urlForDesc: string = '';
  isUrlsDisabled!: boolean;
  userImgClass: string = '';


  async ngOnInit() {

    this.isStoryDisabled = this.type === 'story-edit-page'
      || this.type === 'link-to-story-edit'
      || this.type === 'story-timer'
      || this.type === 'suggestion-list'
      || this.type === 'home-page-suggestion-list'

    if (!this.isStoryDisabled) {
      const user = await lastValueFrom(this.userService.getById(this.user.id))
      if (user && user.currStoryId) {
        const story = await lastValueFrom(
          this.storyService.getById(user.currStoryId, 'user-preview'),
        )

        const loggedinUser = this.userService.getLoggedinUser()
        if (loggedinUser) {
          this.isStoryViewed = story.viewedBy.some(u => u.id === loggedinUser.id)
          this.userImgClass = this.isStoryViewed ? 'story-viewed' : 'story-not-viewed'
        }
        this.story = story
      }
    }
    this.title = this.setTitle()
    this.setDesc()
    this.setUrls()
  }

  ngOnChanges() {
    this.title = this.setTitle()
  }

  setTitle() {
    const loggedinUser = this.userService.getLoggedinUser()
    if (
      (loggedinUser &&
        loggedinUser.id === this.user.id &&
        this.type === 'home-page-list') ||
      this.type === 'story-edit-page' ||
      this.type === 'link-to-story-edit'
    )
      return 'Your story'
    else return this.user.username
  }

  setUrls() {
    switch (this.type) {
      case 'home-page-list':
        this.urlForImg = `/story/${this.story?.id}`
        this.urlForTitle = `/story/${this.story?.id}`
        break
      case 'post-preview':
        this.urlForImg = this.story
          ? `/story/${this.story.id}`
          : `/profile/${this.user.id}`
        this.urlForTitle = `/profile/${this.user.id}`
        if (this.desc) this.urlForDesc = `/location/${this.location?.name}`
        break
      case 'suggestion-list':
        this.urlForImg = `/profile/${this.user.id}`
        this.urlForTitle = `/profile/${this.user.id}`
        break
      case 'home-page-suggestion-list':
        this.urlForImg = `/profile/${this.user.id}`
        this.urlForTitle = `/profile/${this.user.id}`
        break
      case 'story-timer':
        this.urlForImg = `/profile/${this.user.id}`
        this.urlForTitle = `/profile/${this.user.id}`
        break
      case 'link-to-story-edit':
        this.urlForImg = `/story-edit`
        this.urlForTitle = `/story-edit`
        break
      case 'story-edit-page':
        this.isUrlsDisabled = true;
        break
      case 'share-modal':
        this.isUrlsDisabled = true;
        break
      case 'search-modal':
        this.urlForImg = this.story
          ? `/story/${this.story.id}`
          : `/profile/${this.user.id}`
        this.urlForTitle = `/profile/${this.user.id}`
        this.desc = this.user.fullname
        this.urlForDesc = `/profile/${this.user.id}`
        break
      default:
        this.urlForImg = `/`
        this.urlForTitle = `/`
        this.urlForDesc = `/`
        break
    }
  }

  setDesc() {
    switch (this.type) {
      case 'post-preview':
        this.desc = this.location ? this.location.name : ''
        break
      case 'suggestion-list':
        this.desc = this.user.fullname
        break
      case 'home-page-suggestion-list':
        this.desc = this.user.fullname
        break
      case 'search-modal':
        this.desc = this.user.fullname
        break
    }

  }

  setWatchedStory() {
    if (this.isStoryViewed || !this.story) return
    this.story.viewedBy.push(this.user)
    this.storyService.save(this.story)
    this.isStoryViewed = true
  }
}
