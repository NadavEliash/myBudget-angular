import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'
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
export class ChartsComponent implements OnInit, OnDestroy {
  
  constructor(
    private userService: UserService,
    // private changeDetectorRef: ChangeDetectorRef
    ) { }

  subscription!: Subscription
  user!: User | null
  title: string = this.user? 'Your Budget:' : 'Join first and start budget!'
  
  public pieChartLabels = ['']
  public pieChartDatasets = [{
    data: [1]
  }]
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  }
  public pieChartLegend = true
  public pieChartPlugins = []

  ngOnInit(): void {
    this.subscription = this.userService.loggedinUser$.subscribe(
      user => {
      this.user = user
      this.pieChartLabels = this.user?.spend.filter(action => !!action.to).map(action => action.to)
      const chartDatasets = this.user?.spend.filter(action => !!action.to).map(action => action.amount)
      this.pieChartDatasets[0].data = chartDatasets.length? chartDatasets : [1]
      // this.changeDetectorRef.detectChanges()
    })
  }

  // refresh() {
  //   this.userService.loggedinUser$.subscribe(
  //     user => {
  //     this.user = user
  //     this.pieChartLabels = this.user?.spend.filter(action => !!action.to).map(action => action.to)
  //     this.pieChartDatasets[0].data = this.user?.spend.filter(action => !!action.to).map(action => action.amount)
  //   })
  // }

  clearAll() {
    const restartedUser = {...this.user, balance:100, spend: [{
      to: '',
      toId: '',
      amount: 0
    }]}
    this.userService.updateSpending(restartedUser as User).subscribe(user => {
      this.user = user
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()    
  }

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
