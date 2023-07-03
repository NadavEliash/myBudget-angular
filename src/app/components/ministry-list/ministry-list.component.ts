import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ministry } from 'src/app/models/ministry.model';

@Component({
  selector: 'ministry-list',
  templateUrl: './ministry-list.component.html',
  styleUrls: ['./ministry-list.component.scss']
})
export class MinistryListComponent {
  @Input() ministries!: Ministry[] | null
  @Output() removeMinistry = new EventEmitter<string>()


  onRemoveMinistry(ministryId: string | undefined) {
    this.removeMinistry.emit(ministryId)
  }
}
