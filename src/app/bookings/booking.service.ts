import {Injectable} from '@angular/core';
import {Booking} from './booking.model';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {delay, map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Place} from '../places/place.model';

interface BookingData {
    bookedForm: string;
    bookedTo: string;
    firstName: string;
    guestNumber: number;
    lastName: string;
    placeId: string;
    placeImage: string;
    placeTitle: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})

export class BookingService {
    private _bookings = new BehaviorSubject<Booking[]>([]);

    constructor(private authService: AuthService,
                private http: HttpClient) {
    }

    get bookings() {
        return this._bookings.asObservable();
    }

    fetchBookings() {
      return this.http
          .get<{[key: string]: BookingData}>
          (`https://booking-9e8e8.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`, )
          .pipe(map(resData => {
          const bookings = [];
          for (const key in resData) {
              if (resData.hasOwnProperty(key)) {
                  bookings.push(new Booking(
                      key,
                      resData[key].placeId,
                      resData[key].userId,
                      resData[key].placeTitle,
                      resData[key].placeImage,
                      resData[key].firstName,
                      resData[key].lastName,
                      resData[key].guestNumber,
                      new Date(resData[key].bookedForm),
                      new Date(resData[key].bookedTo)
                      )
                  );
              }
          }
          return bookings;
          }),
          tap(bookings => {
              this._bookings.next(bookings);
          }));
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date) {
        let generatedId: string;
        const newBooking = new Booking(
            Math.random().toString(),
            placeId,
            this.authService.userId,
            placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo
        );
        return this.http.post('https://booking-9e8e8.firebaseio.com/bookings.json', {
            ...newBooking, id: null
        })
            .pipe(switchMap(resData => {
                    generatedId = resData.toString();
                    return this.bookings;
                }),
                take(1),
                tap(places => {
                    newBooking.id = generatedId;
                    this._bookings.next(places.concat(newBooking));
                }));
    }

    cancelBooking(bookingId: string) {
        return this.http.delete(`https://booking-9e8e8.firebaseio.com/bookings-offered/${bookingId}.json`).pipe(
            switchMap(() => {
               return this.bookings;
            }),
            take(1),
            tap(bookings => {
                this._bookings.next(bookings.filter(b => b.id !== bookingId));
            })
        );
    }
}
