import { Component, OnInit } from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
      loadedPlaces: Place[];
      itemsLoadedPlaces: Place[];
  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
    this.itemsLoadedPlaces = this.placesService.places.slice(1);
  }

  onFilterUpdate(event: CustomEvent) {
    console.log(event.detail);
  }

}
