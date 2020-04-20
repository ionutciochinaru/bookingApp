import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PlacesService} from '../../places.service';
import {NavController} from '@ionic/angular';
import {Place} from '../../place.model';
import {Form, FormControl, FormGroup, Validators} from '@angular/forms';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  formEditOffer: FormGroup;
  place: Place;
  constructor(private route: ActivatedRoute,
              private placesService: PlacesService,
              private navCtrl: NavController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
      this.formEditOffer = new FormGroup({
        title: new FormControl(this.place.title,{
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        description: new FormControl(this.place.description,{
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        price: new FormControl(this.place.price,{
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        // placePicture: new FormControl({
        //   updateOn: blur(),
        //   Validators: [Validators.required]
        // }),
      });
    });
  }

  onSubmitEdit() {
    if (!this.formEditOffer.valid) {
      return;
    } else {
      console.log('Form Submitted:', this.formEditOffer);
    }
  }
}
