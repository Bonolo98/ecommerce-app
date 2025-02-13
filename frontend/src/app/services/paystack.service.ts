import { Injectable } from '@angular/core';

declare var PaystackPop: any;

@Injectable({
  providedIn: 'root',
})
export class PaystackService {
  constructor() {}

  payWithPaystack(email: string, amount: number, callback: (response: any) => void, onClose: () => void) {
    let handler = PaystackPop.setup({
      key: 'pk_test_08f14ee27069cbdc4c597d0e45c16d8b2edfab46', // Replace with your Paystack public key
      email: email,
      amount: amount * 100, // Convert to kobo
      currency: 'ZAR', // Adjust to your currency
      ref: `txn-${Date.now()}`, // Unique transaction reference
      callback: (response: any) => {
        callback(response);
      },
      onClose: () => {
        onClose();
      }
    });

    handler.openIframe();
  }
}
