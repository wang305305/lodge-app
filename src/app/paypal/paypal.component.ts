import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import Swal from 'sweetalert2';
import { PaypalService } from '../services/paypal.service';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {
  showSuccess: boolean | undefined;
  showCancel: boolean | undefined;
  showError: boolean | undefined;
  reservePayment: boolean | undefined;
  @Input() username = '';
  @Output() refreshParent = new EventEmitter<string>();
  
  constructor(private pp: PaypalService) { }

  public payPalConfig ? : IPayPalConfig;

  ngOnInit(): void {
      this.initConfig();
  }

  private initConfig(): void {
      this.payPalConfig = {
          currency: 'CAD',
          clientId: 'AT33jtnComS6OGgCFhviONcMMeW4Itk9FbKFuBwVI4r17_BbIcmX-3pQCpJ7A9fWqjgdPm7WtVb43PRb',
          createOrderOnClient: (data) => < ICreateOrderRequest > {
              intent: 'CAPTURE',
              purchase_units: [{
                  amount: {
                      currency_code: 'CAD',
                      value: '20',
                      breakdown: {
                          item_total: {
                              currency_code: 'CAD',
                              value: '20'
                          }
                      }
                  },
                  items: [{
                      name: 'Deposit',
                      quantity: '1',
                      category: 'DIGITAL_GOODS',
                      unit_amount: {
                          currency_code: 'CAD',
                          value: '20',
                      },
                  }]
              }]
          },
          advanced: {
              commit: 'true'
          },
          style: {
              label: 'paypal',
              layout: 'vertical'
          },
          onApprove: (data, actions) => {
              console.log('onApprove - transaction was approved, but not authorized', data, actions);
              actions.order.get().then((details: any) => {
                  console.log('onApprove - you can get full order details inside onApprove: ', details);
              });

          },
          onClientAuthorization: (data) => {
              console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
              this.pp.reservePayment(this.username).subscribe((res: HttpResponse<any>) => {
                console.log('response from server:', res);
                if (res.ok) {
                  this.reservePayment = true
                  this.afterDeposit()
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Failed to pay reservation deposit in Wish List'
                  })
                }
              });
              this.showSuccess = true;
          },
          onCancel: (data, actions) => {
              console.log('OnCancel', data, actions);
              this.showCancel = true;
          },
          onError: err => {
              console.log('OnError', err);
              this.showError = true;
          },
          onClick: (data, actions) => {
              console.log('onClick', data, actions);
              this.resetStatus();
          }
      };
  }
  resetStatus() {
  }
  afterDeposit() {
    this.refreshParent.emit();
  }
}
