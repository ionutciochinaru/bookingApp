import {Injectable} from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {delay, map, take, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    private _places = new BehaviorSubject<Place[]>([
        new Place(
            'p1',
            'house1',
            'description is description',
            'https://image.shutterstock.com/image-photo/luxurious-new-construction-home-bellevue-600w-555325381.jpg',
            29.99,
            new Date('2020-01-01'),
            new Date('2020-12-31'),
            'xyz'),
        new Place('p2',
            'house2',
            'description is description2',
            'https://image.shutterstock.com/image-photo/grey-small-house-porch-white-600w-120987520.jpg',
            39.99,
            new Date('2020-01-01'),
            new Date('2020-12-31'),
            'abc'),
        new Place('p3',
            'house3',
            'description is description3',
            'https://media.gettyimages.com/photos/dream-home-luxury-house-success-picture-id848549286?s=2048x2048',
            120.52,
            new Date('2020-01-01'),
            new Date('2020-12-31'),
            'abc'),
    ]);

    get places() {
        return this._places.asObservable();
    }

    getPlace(id: string) {
       return this.places.pipe(
           take(1),
           map(places => {
               return {...places.find(p => p.id === id)};
       }));
    }

    addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
        const newPlace = new Place(
            Math.random().toString(),
            title,
            description,
            'https://media.gettyimages.com/photos/dream-home-luxury-house-success-picture-id848549286?s=2048x2048',
            price,
            dateFrom,
            dateTo,
            this.authService.userId
        );
        return this.places.pipe(take(1), delay(1000), tap((x) => {
            this._places.next(x.concat(newPlace));
        }));
    }
    editPlace(placeId: string, title: string, description: string) {
        return this.places.pipe(take(1), tap(places => {
            const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
            const updatedPlaces = [...places];
            const oldPlace = updatedPlaces[updatedPlaceIndex];
            updatedPlaces[updatedPlaceIndex] = new Place(
                oldPlace.id,
                title,
                description,
                oldPlace.imageURL,
                oldPlace.price,
                oldPlace.availableFrom,
                oldPlace.availableTo,
                oldPlace.userId
            );
            this._places.next(updatedPlaces);
        }));
    }

    constructor( private authService: AuthService) {
    }
}
