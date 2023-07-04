import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Ministry } from 'src/app/models/ministry.model';
import { User } from 'src/app/models/user.model';

import { UserService } from 'src/app/services/user.service.service';

@Component({
  selector: 'spend',
  templateUrl: './spend.component.html',
  styleUrls: ['./spend.component.scss']
})

export class SpendComponent implements OnInit {
  @Input() ministry!: Ministry

  constructor(private userService: UserService) { }

  subscription!: Subscription
  user!: User | null

  ngOnInit(): void {
    this.subscription = this.userService.loggedinUser$.subscribe(
      user => this.user = user
    )
  }

  onSpend(ministry: string, spend: number) {
    if (this.user) {
      this.user.balance -= spend
      this.user.spend.push({to: ministry, amount: spend})
      this.userService.updateSpending(this.user)
    }
  }
}
