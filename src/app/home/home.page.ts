import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController, AlertController, IonRouterOutlet } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';


interface Coin {
  id: string;
  image: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage  implements OnInit {
  api: string =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=ngn&order=market_cap_desc&per_page=100&page=1&sparkline=false';
  coins: Coin[] = [];
  titles: string[] = ['#', 'Coin', 'Price', 'Price Change', '24H Volume'];
  searchText: string = '';
  filteredCoints: Coin[] = [];

    options = {
      initialSlide: 0,
      slidesPerView:2.1,
      spaceBetween:20
  };
  constructor(
    private navCtrl: NavController,
    public alertController: AlertController,
    public routerOutlet: IonRouterOutlet,
    public modalController: ModalController,
    private http: HttpClient,
    private router: Router
  ) { }
  ngOnInit() {
    this.http.get<Coin[]>(this.api).subscribe(
      (res) => {
        this.coins = res;
        this.filteredCoints = this.coins;
      },
      (err) => console.error(err)
    );
  }

  searchCoin() {
    this.filteredCoints = this.coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }


  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: HomePage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  onBack() {
    this.navCtrl.back();
  }

}
