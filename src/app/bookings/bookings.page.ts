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
  isLoading = false;
  loadedBooking: Booking[];
  listedLoadedBookings: Booking[];
  constructor(private bookingService: BookingService,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.isLoading = true;
    this.bookingSub = this.bookingService.fetchBookings().subscribe(bookings => {
      this.loadedBooking = bookings;
      this.listedLoadedBookings = bookings;
      this.isLoading = false;
    });
  }

  ionViewWillEnter() {
    this.bookingService.fetchBookings().subscribe();
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
