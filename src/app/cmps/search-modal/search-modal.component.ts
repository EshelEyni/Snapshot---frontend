import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss']
})
export class SearchModalComponent implements OnInit {

  constructor() { }

  searchResults: any[] = []
  recentSearches: any[] = []

  ngOnInit(): void {
  }

}
