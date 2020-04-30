import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PlacesService} from '../../places.service';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Place} from '../../place.model';
import {Form, FormControl, FormGroup, Validators} from '@angular/forms';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  formEditOffer: FormGroup;
  isLoading = false;
  placeId: string;
  place: Place;
  private placeSub: Subscription;
  constructor(private route: ActivatedRoute,
              private placesService: PlacesService,
              private navCtrl: NavController,
              private router: Router,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.isLoading = true;
      this.placeId = paramMap.get('placeId');
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe( place => {
          this.place = place;
          this.formEditOffer = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            description: new FormControl(this.place.description, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            price: new FormControl(this.place.price, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            // placePicture: new FormControl({
            //   updateOn: blur(),
            //   Validators: [Validators.required]
            // }),
          });
          this.isLoading = false;
        }, error => {
          this.alertCtrl.create({
            header: 'An error accrued!',
            message: 'You will be navigated back to the main menu.',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.router.navigate(['/places/tabs/offers']);
                }
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        });
      });
  }

  onSubmitEdit() {
    if (!this.formEditOffer.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating offer...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.editPlace(
          this.place.id,
          this.formEditOffer.value.title,
          this.formEditOffer.value.description,
      ).subscribe(() => {
        loadingEl.dismiss();
        this.formEditOffer.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
