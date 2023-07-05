import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { ChartOptions } from 'chart.js';
import { ChartConfiguration } from 'chart.js'
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service.service';


@Component({
  selector: 'Charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  
  constructor(
    private userService: UserService,
    // private changeDetectorRef: ChangeDetectorRef
    ) { }

  subscription!: Subscription
  user!: User | null
  
  public pieChartLabels = ['']
  public pieChartDatasets = [{
    data: [0]
  }]

  ngOnInit(): void {
    this.userService.loggedinUser$.subscribe(
      user => {
      this.user = user
      this.pieChartLabels = this.user?.spend.filter(action => !!action.to).map(action => action.to)
      this.pieChartDatasets[0].data = this.user?.spend.filter(action => !!action.to).map(action => action.amount)
      // this.changeDetectorRef.detectChanges()
    })
  }

  refresh() {
    this.userService.loggedinUser$.subscribe(
      user => {
      this.user = user
      this.pieChartLabels = this.user?.spend.filter(action => !!action.to).map(action => action.to)
      this.pieChartDatasets[0].data = this.user?.spend.filter(action => !!action.to).map(action => action.amount)
    })
  }
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  }

  public pieChartLegend = true
  public pieChartPlugins = []


  // POLAR

  // polarAreaChartLabels: string[] = [ '' ]
  // polarAreaChartDatasets: ChartConfiguration<'polarArea'>['data']['datasets'] = [
  //   { data: [ 1000, 500, 100, 940, 120, 200, 100 ] }
  // ]
  // polarAreaLegend = true;

  // polarAreaOptions: ChartConfiguration<'polarArea'>['options'] = {
  //   responsive: false,
  // }

}
