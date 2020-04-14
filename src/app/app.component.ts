import {AfterViewInit, Component, ViewChild, ElementRef} from '@angular/core';
declare var paypal;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {
  @ViewChild('paypal', {static: true}) paypalElement: ElementRef;
  ngAfterViewInit() {
    paypal.Buttons({
      style: {
        layout: 'horizontal',
        color:  'blue',
        shape:  'pill',
        label:  'paypal',
        height: 25,
        width: 30
      },
      // Set up the transaction
      createOrder(data, actions) {
        return fetch('http://localhost:8080/paypal/createPayment?package=PRO', {method: 'get'})
          .then(response =>  response.json())
          .then(details => details.token);
      },
      // Finalize the transaction
      onApprove(data, actions) {
        return fetch('http://localhost:8080/paypal/completePayment?paymentId=' + data.paymentID + '&payerId=' + data.payerID , {method: 'get'})
          .then(response =>  response.json())
          .then(details => {
            if (details.package) {
              // Show a success message to the buyer
              alert('Transaction completed!');
            } else {
              // Show an error message to the buyer
              alert('Transaction cannot be completed, please try again!');
            }
        });
      },
      onError(err) {
        // Show an error page here, when an error occurs
        alert('Transaction cannot be completed, please try again!');
      },
      onCancel(data) {
        alert('Transaction has been cancelled!');
      }
    }).render(this.paypalElement.nativeElement);
  }
}
