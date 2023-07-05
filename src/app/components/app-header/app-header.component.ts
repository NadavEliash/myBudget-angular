import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router
  ) { }


  subscription!: Subscription
  user!: User | null
  userLink: string = ''

  ngOnInit(): void {
    this.subscription = this.userService.loggedinUser$.subscribe(
      user => this.user = user
    )
  }

  onLoginLogout() {
    this.user?.name ? this.userService.logOut() : this.router.navigate(['/login'])
  }
}