import { Component, OnInit } from '@angular/core';
import {BookingService} from './booking.service';
import {Booking} from './booking.model';
import {IonItemSliding} from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBooking: Booking[];
  listedLoadedBookings: Booking[];
  constructor(private bookingService: BookingService) { }

  ngOnInit() {
    this.loadedBooking = this.bookingService.bookings;
    this.listedLoadedBookings = this.bookingService.bookings.slice(1);
  }

  onCancelBooking(bookingId: string, slidingBooking: IonItemSliding ) {
    slidingBooking.close();
    console.log('Canceled:', bookingId );
  }

}
