import {Injectable} from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {delay, map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

interface PlaceData {
    availableFrom: string;
    availableTo: string;
    description: string;
    imageURL: string;
    price: number;
    title: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    constructor(private authService: AuthService,
                private http: HttpClient) {
    }

    private _places = new BehaviorSubject<Place[]>([]);

    get places() {
        return this._places.asObservable();
    }

    fetchPlaces() {
        return this.http
            .get<{ [key: string]: PlaceData }>('https://booking-9e8e8.firebaseio.com/offered-places.json')
            .pipe(map(resData => {
                    const places = [];
                    for (const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            places.push(new Place(
                                key,
                                resData[key].title,
                                resData[key].description,
                                resData[key].imageURL,
                                resData[key].price,
                                new Date(resData[key].availableFrom),
                                new Date(resData[key].availableTo),
                                resData[key].userId
                                )
                            );
                        }
                    }
                     return places;
                }),
                tap(places => {
                    this._places.next(places);
                }));
    }

    getPlace(id: string) {
        return this.places.pipe(
            take(1),
            map(places => {
                return {...places.find(p => p.id === id)};
            }));
    }

    addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
        let generatedId: string;
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
        return this.http.post('https://booking-9e8e8.firebaseio.com/offered-places.json', {
            ...newPlace, id: null
        })
            .pipe(switchMap(resData => {
                    generatedId = resData.toString();
                    return this.places;
                }),
                take(1),
                tap(places => {
                    newPlace.id = generatedId;
                    this._places.next(places.concat(newPlace));
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
}
