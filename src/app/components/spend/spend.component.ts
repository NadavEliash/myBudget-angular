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
  amount: number = 0

  ngOnInit(): void {
    this.subscription = this.userService.loggedinUser$.subscribe(
      user => {
        this.user = user
        const action = user.spend.find(action => action.to === this.ministry.name)
        this.amount = action? action.amount : 0
      }
    )
  }
  
  onSpend(ministryId: string, ministry: string, amount: number) {
    if (this.user) {
      if (this.user.balance < amount) return
      if (this.user.spend.some(action => action.to === ministry)) {
        this.updateSpend(ministryId, ministry, amount)
      } else {
        this.addAction(ministryId, ministry, amount)
      }
    }
  }

  updateSpend(ministryId: string, ministry: string, amount: number) {
    if (this.user) {
      this.clearAction(ministry)
      this.addAction(ministryId, ministry, amount)
    }
  }

  addAction(ministryId: string, ministry: string, amount: number) {
    if (this.user) {
      this.amount = amount
      this.user.balance -= amount
      this.user.spend.push({ toId: ministryId, to: ministry, amount })
      this.userService.updateSpending(this.user)
    }
  }

  clearAction(ministry: string) {
    if (this.user) {
      const idx = this.user.spend.findIndex(action => action.to === ministry)
      this.user.balance += this.user.spend[idx].amount
      this.user.spend.splice(idx, 1)
      this.amount = 0
      this.userService.updateSpending(this.user)
    }
  }
}
