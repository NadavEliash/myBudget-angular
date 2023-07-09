import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Ministry } from 'src/app/models/ministry.model';
import { User } from 'src/app/models/user.model';
import { MinistryService } from 'src/app/services/ministry.service';
import { UserService } from 'src/app/services/user.service.service';

@Component({
  selector: 'ministry-index',
  templateUrl: './ministry-index.component.html',
  styleUrls: ['./ministry-index.component.scss']
})

export class MinistryIndexComponent implements OnInit, OnDestroy {

  constructor(private ministryService: MinistryService, private userService: UserService) { }
  ministries$!: Observable<Ministry[]>
  subscription!: Subscription

  user: User | null = null

  ngOnInit(): void {
    this.userService.getLoggedinUser()
    this.userService.loggedinUser$.subscribe(
      user => {
        this.user = user
      }
    )

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
