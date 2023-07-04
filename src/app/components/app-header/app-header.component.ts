import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit{
  constructor(private userService: UserService){}

  subscription!: Subscription
  user!: User | null

  ngOnInit(): void {
      this.subscription = this.userService.loggedinUser$.subscribe(
        user => this.user = user
      )
  }
}
