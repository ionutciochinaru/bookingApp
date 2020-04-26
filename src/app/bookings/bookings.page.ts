import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from './booking.service';
import {Booking} from './booking.model';
import {IonItemSliding, LoadingController} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  private bookingSub: Subscription;
  loadedBooking: Booking[];
  listedLoadedBookings: Booking[];
  constructor(private bookingService: BookingService,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
   this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBooking = bookings;
      this.listedLoadedBookings = bookings;
    });
  }

  onCancelBooking(bookingId: string, slidingBooking: IonItemSliding ) {
    slidingBooking.close();
    this.loadingCtrl.create({message: 'Canceling booking'}).then( loadindEl => {
      loadindEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadindEl.dismiss();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

}
