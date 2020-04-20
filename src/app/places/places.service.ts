import {Injectable} from '@angular/core';
import {Place} from './place.model';

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    private _places: Place[] = [
        new Place(
            'p1',
            'house1',
            'description is description',
            'https://image.shutterstock.com/image-photo/luxurious-new-construction-home-bellevue-600w-555325381.jpg',
            29.99,
            new Date('2020-01-01'),
            new Date('2020-12-31')),
        new Place('p2',
            'house2',
            'description is description2',
            'https://image.shutterstock.com/image-photo/grey-small-house-porch-white-600w-120987520.jpg',
            39.99,
            new Date('2020-01-01'),
            new Date('2020-12-31')),
        new Place('p3',
            'house3',
            'description is description3',
            'https://media.gettyimages.com/photos/dream-home-luxury-house-success-picture-id848549286?s=2048x2048',
            120.52,
            new Date('2020-01-01'),
            new Date('2020-12-31')),
    ];

    get places() {
        return [...this._places];
    }

    getPlace(id: string) {
        return {...this._places.find(p => p.id === id)};
    }

    constructor() {
    }
}
