import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  private filter = 'all';
  loadedPlacesSub: Subscription;
  loadedPlaces: Place[];
  itemsLoadedPlaces: Place[];
  relevantPlaces: Place[];
  constructor(private placesService: PlacesService,
              private authService: AuthService,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.loadedPlacesSub = this.placesService.places.subscribe( loadedPlaces => {
      this.loadedPlaces = loadedPlaces;
      this.onFilterUpdate(this.filter);
    });
  }

  ionViewWillEnter() {
    this.loadingCtrl.create({message: 'Fetching places...'}).then(
        loadingEl => {
          loadingEl.present();
          this.placesService.fetchPlaces().subscribe(() => {
            loadingEl.dismiss();
          });
        }
    );
  }

  onFilterUpdate(filter: string) {
    const isShown = place => filter === 'all' || place.userId !== this.authService.userId;
    this.relevantPlaces = this.loadedPlaces.filter(isShown);
    this.itemsLoadedPlaces = this.relevantPlaces.slice(1).filter(isShown);
    this.filter = filter;
  }

  ngOnDestroy(): void {
    if (this.loadedPlacesSub) {
      this.loadedPlacesSub.unsubscribe();
    }
  }

}
