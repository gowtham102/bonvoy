import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/SharedResources/Services/shared.service';
import { OrderService } from 'src/app/SharedResources/Services/order.service';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './orderSuccess.html',
  styleUrls: ['./orderSuccess.css'],
})
export class OrderSuccessComponent implements OnInit {
  subscriptions: Subscription[] = [];
  order_id: string = '';
  message: string = '';
  LANG: any;
  orderid: any;

  constructor(
    private route: ActivatedRoute,
    private shared: SharedService,
    private orderservice: OrderService,
    private router:Router,
    private datePipe: DatePipe
  ) {
    this.orderid = localStorage.getItem('order_id');
    this.subscriptions.push(
      this.route.queryParams.subscribe((params: Params) => {
        if (params['id']) {
          this.order_id = atob(params['id']);
        }
      })
    );
    this.subscriptions.push(
      this.shared.languageChange.subscribe((path: any) => {
        this.changeLanguage();
      })
    );
    this.clearLocalData();
  }

  ngOnInit() {
    this.changeLanguage();
    this.orderdetails();
  }

  clearLocalData() {
    const order_day = btoa(btoa('order_day'));
    if (localStorage.getItem(order_day)) {
      localStorage.removeItem(order_day);
    }
    const order_time = btoa(btoa('order_time'));
    if (localStorage.getItem(order_time)) {
      localStorage.removeItem(order_time);
    }
    const to_time = btoa(btoa('to_time'));
    if (localStorage.getItem(to_time)) {
      localStorage.removeItem(to_time);
    }
    const to_text = btoa(btoa('to_text'));
    if (localStorage.getItem(to_text)) {
      localStorage.removeItem(to_text);
    }
    const from_text = btoa(btoa('from_text'));
    if (localStorage.getItem(from_text)) {
      localStorage.removeItem(from_text);
    }
    const message = btoa(btoa('message'));
    if (localStorage.getItem(message)) {
      localStorage.removeItem(message);
    }
    const reciever_number = btoa(btoa('reciever_number'));
    if (localStorage.getItem(reciever_number)) {
      localStorage.removeItem(reciever_number);
    }
    const reciever_address = btoa(btoa('reciever_address'));
    if (localStorage.getItem(reciever_address)) {
      localStorage.removeItem(reciever_address);
    }
    const delivery_address_id = btoa(btoa('delivery_address_id'));
    if (localStorage.getItem(delivery_address_id)) {
      localStorage.removeItem(delivery_address_id);
    }
  }

  changeLanguage() {
    if (
      localStorage.getItem('arabic') == 'true' &&
      localStorage.getItem('arabic') != null
    ) {
      // this.LANG=environment.arabic_translations;
      this.setMessage(this.order_id);
      return;
    }
    this.LANG = environment.english_translations;
    this.setMessage(this.order_id);
  }

  setMessage(id?: string) {
    if (id) {
      this.message = `${this.LANG.Your_payment_for_order_ID} ${this.order_id} ${this.LANG.was_successfull}`;
      return;
    }
    this.message = `${this.LANG.Your_order_has_been_placed}`;
  }

  orderdetailsdata: any;
  formatDate(value:any){
    if(value == ""){
      return
    }
    const date=value.split(" ")[0]
    const day=date.split("-")[2]
    const month=date.split("-")[1]
    const year=date.split("-")[0]
    return ` ${day}-${this.getMonth(month)}-${year}`
  }
  formatDate2(value:any){
    if(value == ""){
      return
    }
    const date=value.split(" ")[0]
    const day=date.split("-")[2]
    const month=date.split("-")[1]
    const year=date.split("-")[0]
    return ` ${day} ${this.getMonth2(month)} `
  }

  getMonth(index:number){
      const months = ["Jan","Feb","Mar","Apr","May",
      "Jun","Jul","Aug", "Sep","Oct","Nov","Dec"];
      return months[index-1]
  }
  getMonth2(index:number){
    const months = ["January","February","March","April","May",
    "June","July","August", "September","October","November","December"];
    return months[index-1]
}
  time:any

  orderdetails() {
    this.orderservice.orderDetails(this.orderid).subscribe((res: any) => {
      this.orderdetailsdata = res.response;
      // console.log(this.datePipe.transform(this.orderdetailsdata.delivery_date, ' hh:mm a'))

      this.getDayOfWeek()

      this.orderdetailsdata.delivery_date= this.formatDate2(this.orderdetailsdata.delivery_date);
      this.orderdetailsdata.created_on= this.formatDate(this.orderdetailsdata.created_on);
    });
  }

  day:any


  getDayOfWeek() {
    this.day= this.datePipe.transform(this.orderdetailsdata.delivery_date, 'EEEE');
    this.time = this.datePipe.transform(this.orderdetailsdata.created_on, ' hh:mm:ss')
    // 'EEEE' stands for the full name of the day (e.g., Monday, Tuesday, etc.)
    console.log(this.datePipe.transform(this.orderdetailsdata.delivery_date, 'EEEE'))
  }

  


  goToOrderDetails(){
    this.router.navigate(['/my-profile/order-details'],{ queryParams: { order_id: btoa(btoa(this.orderid))}})
}

}
