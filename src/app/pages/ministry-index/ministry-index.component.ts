import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Ministry } from 'src/app/models/ministry.model';
import { MinistryService } from 'src/app/services/ministry.service';

@Component({
  selector: 'ministry-index',
  templateUrl: './ministry-index.component.html',
  styleUrls: ['./ministry-index.component.scss']
})
export class MinistryIndexComponent implements OnInit, OnDestroy {

  constructor(private ministryService: MinistryService) { }
  ministries: Ministry[] | null = null
  ministries$!: Observable<Ministry[]>
  subscription!: Subscription

  ngOnInit(): void {
    this.subscription = this.ministryService.loadMinistries().subscribe()
    this.ministries$ = this.ministryService.ministries$
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  onRemoveMinistry(ministryId: string) {
    this.ministryService.deleteMinistry(ministryId).subscribe({
      error: err => {
        console.log(err)
      }
    })
  }
}
