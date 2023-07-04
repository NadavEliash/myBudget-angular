import { Component, Input } from '@angular/core';
import { Filter } from 'src/app/models/filter.model';
import { MinistryService } from 'src/app/services/ministry.service';

@Component({
  selector: 'ministry-filter',
  templateUrl: './ministry-filter.component.html',
  styleUrls: ['./ministry-filter.component.scss']
})
export class MinistryFilterComponent {

  constructor(private ministryService: MinistryService) { }

  filterBy: Filter = {
    term: ''
  }

  sortBy: Filter = {
    term: ''
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
