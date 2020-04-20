import { Injectable } from '@angular/core';
import {Booking} from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings: Booking[] = [
    {
      id: 'asd',
      placeId: 'p1',
      placeTitle: 'dsa',
      guestNumber: 3,
      userId: 'asd'
    },
    {
      id: 'asd2',
      placeId: 'p2',
      placeTitle: 'dsa2',
      guestNumber: 5,
      userId: 'asd2'
    }
  ];

  constructor() { }

  get bookings() {
    return [...this._bookings];
  }
}
