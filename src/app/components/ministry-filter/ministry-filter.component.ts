import { Component, Input, OnInit } from '@angular/core';
import { Filter } from 'src/app/models/filter.model';
import { MinistryService } from 'src/app/services/ministry.service';

@Component({
  selector: 'ministry-filter',
  templateUrl: './ministry-filter.component.html',
  styleUrls: ['./ministry-filter.component.scss']
})
export class MinistryFilterComponent implements OnInit {

  constructor(private ministryService: MinistryService) { }

  filterBy: Filter = {
    term: ''
  }

  sortBy: Filter = {
    term: ''
  }

  ngOnInit(): void {
      this.filterBy = {term: ''}
      this.onSetFilter()
  }

  onSetFilter() {
    this.ministryService.setFilter(this.filterBy)
  }

  isOnSort = false
  
  toggleSort() {
    this.isOnSort = !this.isOnSort
  }

  setSortBy(term: string) {
    this.sortBy.term = term
    this.ministryService.setSort(this.sortBy)
  }

}
