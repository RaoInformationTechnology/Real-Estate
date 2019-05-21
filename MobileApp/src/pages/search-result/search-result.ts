import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { PropertyProvider } from '../../providers/property/property';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';
import { UtilityProvider } from '../../providers/utility/utility';
import { PropertyDetailsPage } from '../property-details/property-details';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, GoogleMapsAnimation, CameraPosition, MarkerOptions,
  HtmlInfoWindow, LatLng, Marker } from '@ionic-native/google-maps';
  import * as $ from 'jquery';
  declare var _ :any;
  @Component({
    selector: 'page-search-result',
    templateUrl: 'search-result.html',
  })
  export class SearchResultPage {
    @ViewChild('map_canvas') mapRef : ElementRef;
    searchQuery;
    allProperty=[];
    mapReady: boolean = false;
    map: GoogleMap;
    location={lat:null,lon:null};
    view='';
    properties=[];
    sort="new";
    loader;
    image_url;
    j;
    k;
    toast;
    AllProperty=[];
    finishInfiniteScroll:boolean=true;
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, private propertySer: PropertyProvider,
      public navParams: NavParams, private modalCtrl: ModalController, private localstorage: LocalstorageProvider,
      private _utility: UtilityProvider, public loadingCtrl: LoadingController,private toastCtrl: ToastController){
      this.presentLoading();
      this.image_url = this._utility.getImageUrl();
      this.searchQuery = this.navParams.get('searchOptions');
      console.log(this.searchQuery);
    }

    ionViewDidLoad() {
      this.getSearchedProperty(this.searchQuery);
      this.view = 'map';
    }

    presentLoading() {
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        // duration: 2000
      });
    }

    presentToast() {
      this.toast = this.toastCtrl.create({
        message: "No more properties found!",
        duration: 3000,
        position: 'bottom'
      });
    }

    ConvertToNumber(value){
      return Number(value);
    }
    doInfinite(infiniteScroll) {
      if(this.k<=this.AllProperty.length){
        console.log('Begin async operation');
        setTimeout(() => {
          this.k += 15;
          console.log("K is:", this.k);
          for (var i = this.j; i < this.k; i++) {
            if(i == this.AllProperty.length){
              break;
            }
            this.properties[i] = this.AllProperty[i];
            this.j = i;
          }

          console.log('Async operation has ended');
          infiniteScroll.complete();
        this.finishInfiniteScroll = true;
        }, 500);
      } else {
        console.log('Begin async operation');
        setTimeout(() => {
          console.log('Async operation has ended');
          infiniteScroll.complete();
          this.finishInfiniteScroll=false;
          this.toast = this.toastCtrl.create({
            message: "No more properties!!",
            duration: 3000,
            position: 'bottom'
          });
          this.toast.present();
        }, 500);
      }
    }

    getSearchedProperty(query, range?:any, otherFilter?:any){
      localStorage.setItem('query', JSON.stringify(query));
      this.allProperty=[];
      console.log("Query", query);
      console.log("Range",range);
      this.presentLoading();
      this.loader.present();
        this.propertySer
        .searchProperty(query)
        .subscribe(data =>{
          console.log("search result", data);
          if (data.length > 0) {
            if(range != undefined){
              this.AllProperty=[];
              if(otherFilter.length<=0 || otherFilter.length==3){
                for(var i=0;i<15;i++){
                    if(i == data.length)
                      break;
                  if(data[i].price>range.lower && data[i].price<range.upper){
                    this.AllProperty.push(data[i]);
                    this.allProperty.push(data[i]);
                    this.location.lat = Number(this.allProperty[0].lat);
                    this.location.lon = Number(this.allProperty[0].lon);
                    this.j = i;
                    this.k=i;
                  }
                }
                this.allProperty = this.unique(this.allProperty);
                console.log("filtered", this.allProperty);
                localStorage.setItem('properties', JSON.stringify(this.allProperty));
                this.oldFirst();
              }else{
                for(var j=0;j<otherFilter.length;j++){
                  switch (otherFilter[j]) {
                    case "garage":
                    for(var i=0;i<15;i++){
                        if(i == data.length)
                          break;
                      if(data[i].price>range.lower && data[i].price<range.upper && data[i].garage){
                        this.AllProperty.push(data[i]);
                        this.allProperty.push(data[i]);
                        this.location.lat = Number(this.allProperty[0].lat);
                        this.location.lon = Number(this.allProperty[0].lon);
                        this.j = i;
                        this.k=i;
                      }
                    }
                    break;

                    case "garden":
                    for(var i=0;i<15;i++){
                        if(i == data.length)
                          break;
                      if(data[i].price>range.lower && data[i].price<range.upper && data[i].garden){
                        this.AllProperty.push(data[i]);
                        this.allProperty.push(data[i]);
                        this.location.lat = Number(this.allProperty[0].lat);
                        this.location.lon = Number(this.allProperty[0].lon);
                        this.j = i;
                        this.k=i;
                      }
                    }
                    break;

                    case "swimmingPool":
                    for(var i=0;i<15;i++){
                        if(i == data.length)
                          break;
                      if(data[i].price>range.lower && data[i].price<range.upper && data[i].swimmingPool){
                        this.AllProperty.push(data[i]);
                        this.allProperty.push(data[i]);
                        this.location.lat = Number(this.allProperty[0].lat);
                        this.location.lon = Number(this.allProperty[0].lon);
                        this.j = i;
                        this.k=i;
                      }
                    }
                    break;

                    default:
                    let alert = this.alertCtrl.create({
                      title: "Error",
                      subTitle: "Invalid Option",
                      buttons: ['OK']
                    });
                    alert.present();
                    break;
                  }
                  this.allProperty = this.unique(this.allProperty);
                  console.log("filtered", this.allProperty);
                  localStorage.setItem('properties', JSON.stringify(this.allProperty));
                  this.oldFirst();
                }
                this.loader.dismiss();
              }
            }else{
              for(var i=0; i < data.length; i++){
                this.AllProperty[i] = data[i];
              }
              for(var i=0;i<15;i++){
                if(i == data.length)
                  break;
                this.allProperty[i] = data[i];
                this.location.lat = Number(this.allProperty[0].lat);
                this.location.lon = Number(this.allProperty[0].lon);
                this.j = i;
                this.k=i;
              }
              // this.allProperty = this.unique(this.allProperty);
              console.log("filtered", this.allProperty);
              localStorage.setItem('properties', JSON.stringify(this.allProperty));
              this.oldFirst();
            }
              this.loader.dismiss();
          }else if(data.length <=0){
            this.loader.dismiss();
          }
        },err =>{
          console.error(err);
          this.loader.dismiss();
        })
      // this.loader.dismiss();
    }

    unique(origArr) {
      var newArr = [],
      origLen = origArr.length,
      found, x, y;

      for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
          if (origArr[x]._id === newArr[y]._id) {
            found = true;
            break;
          }
        }
        if (!found) {
          newArr.push(origArr[x]);
        }
      }
      return newArr;
    }

    sortByLowToHigh(){
      console.log("----------Low TO High-----------");
      this.properties = this.localstorage.getAllProperties();

      this.properties.sort( function(property1, property2) {
        if ( property1.price < property2.price ){
          return -1;
        }else if( property1.price > property2.price ){
          return 1;
        }else{
          return 0;    
        }
      });
      console.log("all Properties", this.allProperty);
      console.log("properties", this.properties);
    }

    sortByHighToLow(){
      console.log("-----------High To Low ----------------");
      this.properties = this.localstorage.getAllProperties();
      this.properties.sort( function(property1, property2) {
        if ( property1.price > property2.price ){
          return -1;
        }else if( property1.price < property2.price ){
          return 1;
        }else{
          return 0;    
        }
      });
    }

    newFirst(){
      console.log("------------------New First-----------------");
      this.properties = this.localstorage.getAllProperties();
      this.properties.reverse();
      console.log("all Properties", this.allProperty);
      console.log("properties", this.properties);
    }

    oldFirst(){
      console.log("--------------Old First-----------------");
      this.properties = this.localstorage.getAllProperties();
      console.log("all Properties", this.allProperty);
      console.log("properties", this.properties);
    }

    goBack(){
      localStorage.removeItem('properties');
      localStorage.removeItem('query');
      this.navCtrl.setRoot(HomePage);
    }

    propertyDetails(property){
      console.log("selected Property", property);
      this.navCtrl.push(PropertyDetailsPage, {'selectedProperty': property._id});
    }

    toggleView(option){
      this.view = option;
    }

    openFilter(){
      let modal = this.modalCtrl.create(Filter, {filter:this.searchQuery});
      modal.onDidDismiss(data =>{
        console.log(data);
        let oldQuery = JSON.parse(localStorage.getItem('query'));
        console.log("Old Query=", oldQuery);
        
        if(data != undefined){
          if(data.filter.buyRent == oldQuery.buyRent && data.filter.city == oldQuery.city &&
            data.filter.country == oldQuery.country && data.filter.propertyType == oldQuery.propertyType
            && data.other.length<=0 && data.range.lower == 0 && data.range.upper == 500000){
            console.log("same");
        } else {
          console.log("not same");
          this.getSearchedProperty(data.filter, data.range, data.other);
        }

        this.sort = data.sort;
        if(data.sort != undefined){
          switch (data.sort) {
            case "new":
            console.log("New First called");
            this.newFirst();
            break;

            case "old":
            console.log("Old First called");
            this.oldFirst();
            break;

            case "lowToHigh":
            console.log("Low to High called");
            this.sortByLowToHigh();
            break;

            case "highToLow":
            console.log("High to Low called");
            this.sortByHighToLow();
            break;

            default:
            let alert = this.alertCtrl.create({
              title: "Error",
              subTitle: "Invalid Option",
              buttons: ['OK']
            });
            alert.present();
            break;
          }
        }
      }
    })
      modal.present();
    }
  }


  @Component({
    selector: 'page-filter',
    templateUrl: 'filter.html',
  })

  export class Filter {
    buttonColor: string = '#0b7997';
    propertyTypes;
    countries;
    selectedCountry={country:""};
    cities;
    filterModal={buyRent:"", propertyType:"", country:"", city:""};
    minMax: any = { lower: 0, upper: 1000000 };
    other={garden:false, garage:false, swimmingPool:false};
    Other=[];
    sort;
    constructor(public navParams: NavParams, public viewCtrl: ViewController, private propertySer: PropertyProvider){
      this.filterModal = this.navParams.get('filter');
      console.log(this.filterModal);
      this.getType();
      this.getCountry();
    }

    getType(){
      this.propertySer
      .getPropertyType()
      .subscribe(data =>{
        this.propertyTypes = data;
        console.log("Property Type", this.propertyTypes);
      },err =>{
        console.error(err);
      })
    }

    getCountry(){
      this.propertySer
      .getCountry()
      .subscribe(data =>{
        this.countries = data;
        console.log("Country", this.countries);
        this.selectedCountry['country'] = this.filterModal.country;
        this.getCountryWiseCity(this.selectedCountry);
      },err =>{
        console.error(err);
      })
    }

    changeCountry(id){
      console.log(id);
      this.selectedCountry['country'] = id;
      this.getCountryWiseCity(this.selectedCountry);
  }
  getCountryWiseCity(id){
    console.log("City Id", id);
    this.propertySer
    .getCityByCountry(id)
    .subscribe(data =>{
      console.log("Country Wise City",data);
      this.cities = data;
    },err =>{
      console.error(err);
    })
  }

  doSorting(event){
    console.log(event);
    console.log(this.sort);
  }

  showFilters(){
    this.buttonColor = '#0b7997';
    console.log(this.filterModal);
    console.log(this.minMax);
    if(this.other.garage){this.Other.push("garage");}
    if(this.other.garden){this.Other.push("garden");}
    if(this.other.swimmingPool){this.Other.push("swimmingPool");}
    console.log("Other", this.Other);
    this.viewCtrl.dismiss({'filter':this.filterModal,'range':this.minMax,'other':this.Other,'sort':this.sort});
  }

  dismiss() {

    this.viewCtrl.dismiss();
  }

}