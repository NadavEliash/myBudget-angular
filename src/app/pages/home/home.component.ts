import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private userService: UserService, private router: Router){}

  user: User | null = null

  ngOnInit() {
    this.userService.getLoggedinUser()
    this.userService.loggedinUser$.subscribe(user => this.user = user)
  }

  onGetStarted() {
    this.user?.name? this.router.navigate(["/ministry"]) : this.router.navigate(["/login"])
  }
}
