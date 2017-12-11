// NEEDS_WORK: DUMMY COMPONENT
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';

@Component({
  templateUrl: './account-overview.component.html'
})

export class AccountOverviewComponent implements OnInit {
  customerName: string;

  constructor(
    private accountLoginService: AccountLoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.accountLoginService.subscribe(customerData => {
      if (customerData) {
        this.customerName = customerData.firstName || customerData.credentials.login;
      }
    });
  }

  logout() {
    this.accountLoginService.logout();
    this.router.navigate(['/home']);
    return false;
  }

}