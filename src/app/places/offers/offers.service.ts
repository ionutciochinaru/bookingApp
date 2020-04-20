import {Injectable} from '@angular/core';
import {Place} from '../place.model';
import {OffersModel} from './offers.model';

@Injectable({
    providedIn: 'root'
})
export class OffersService {
    private allOffers: OffersModel[] = [
        new Place(
            'o1',
            'house1',
            'best offer description is description',
            'https://image.shutterstock.com/image-photo/luxurious-new-construction-home-bellevue-600w-555325381.jpg',
            19.99,
            new Date(2020.20),
            new Date(2020.20)),
        new Place('o2',
            'house2',
            'best offer description is description2',
            'https://image.shutterstock.com/image-photo/grey-small-house-porch-white-600w-120987520.jpg',
            29.99,
        new Date(2020.20),
        new Date(2020.20)),
        new Place('o3',
            'house3',
            ' best offerdescription is description3',
            'https://media.gettyimages.com/photos/dream-home-luxury-house-success-picture-id848549286?s=2048x2048',
            130.52,
            new Date(2020.20),
            new Date(2020.20))
    ];

    constructor() {
    }

    get Offers() {
        return [...this.allOffers];
    }
}
