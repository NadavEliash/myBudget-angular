import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Ministry } from 'src/app/models/ministry.model';
import { User } from 'src/app/models/user.model';

import { UserService } from 'src/app/services/user.service.service';

@Component({
  selector: 'spend',
  templateUrl: './spend.component.html',
  styleUrls: ['./spend.component.scss']
})

export class SpendComponent implements OnInit, OnDestroy {
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
        this.amount = action ? action.amount : 0
      }
    )
  }

  onPlusMinus(event: Event, ministryId: string, ministry: string, value: number) {
    event.preventDefault()
    if (value === 1) {
      if (this.user!.balance < 1) return
      this.onSpend(ministryId, ministry, this.amount + 1)
    } else {
      if (this.amount < 1) return
      this.onSpend(ministryId, ministry, this.amount - 1)
    }
  }

  onSpend(ministryId: string, ministry: string, amount: number) {
    if (this.user) {
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
      if (this.user.balance < amount) return
      this.user.balance -= amount
      this.user.spend.push({ toId: ministryId, to: ministry, amount })
      this.subscription = this.userService.updateSpending(this.user).subscribe(user => this.user = user)
    }
  }

  clearAction(ministry: string) {
    if (this.user) {
      const idx = this.user.spend.findIndex(action => action.to === ministry)
      if (idx === -1) {
        this.amount = 0
        return
      }
      this.user.balance += this.user.spend[idx].amount
      this.user.spend.splice(idx, 1)
      this.amount = 0
      this.subscription = this.userService.updateSpending(this.user).subscribe(user => this.user = user)
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
