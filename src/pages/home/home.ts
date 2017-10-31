import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SemakanProvider } from '../../providers/semakan/semakan';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  QRText: string;
  public CERT_TYPE: string;
  public ADJ_NO: string;
  public DATE_INSTRUMENT: string;
  public DESC_INSTRUMENT: string;
  public CONSIDERATION: string;
  public FIRST_PARTY: string;
  public SECOND_PARTY: string;
  public CERT_NO: string;
  public DATE_STAMP: string;
  public STAMP_AMOUNT: string;
  public PENALTY: string;
  public TOTAL_AMOUNT: string;
  public INDORSEMENT: string;
  public showPenafian: boolean;

  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private semakan: SemakanProvider, public barcodeScanner: BarcodeScanner, public navCtrl: NavController) {
    this.showPenafian = true;
  }

  scanQRCode(){

    let loader = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Sedang diproses..'
    })

    this.barcodeScanner.scan().then((barcodeData) => {
      loader.present();

      this.QRText = String(barcodeData.text);

      if (this.QRText.substr(0, 5) != 'hash1'){
        if (this.QRText != ''){
          let alert = this.alertCtrl.create({
            title: 'Kod QR Tidak Sah / Invalid QR Code',
            buttons: ['OK']
          });
          alert.present();
        }
        loader.dismiss();
        return;
      } 

      this.semakan.loadSemakan(this.QRText).then(response => {
          loader.dismiss();

          if (response.msg == 'Rekod Tidak Wujud' || response.status == false){
            let alert = this.alertCtrl.create({
              title: 'Maaf, Rekod gagal dijumpai / Sorry, Record not found',
              buttons: ['OK']
            });

            alert.present();

          } else {
            this.ADJ_NO = response.EP_ADJ_NO;
            this.CERT_NO = response.EP_CERT_NO;
            this.CERT_TYPE = response.EP_SIJIL_DISPLAY;
            this.CONSIDERATION = response.EP_CONSIDERATION;
            this.DATE_INSTRUMENT = response.EP_INSTRUMENT_DATE;
            this.DATE_STAMP = response.EP_CERT_DATE;
            this.DESC_INSTRUMENT = response.EP_PROPERTY_DESC1;
            this.FIRST_PARTY = response.EP_ASSIGNOR_NAME;
            this.INDORSEMENT = response.EP_INDORSEMENT1;
            this.SECOND_PARTY = response.EP_ASSIGNEE_NAME;
            this.PENALTY = response.EP_PENALTY;
            this.STAMP_AMOUNT = response.EP_STAMP_DUTY_AMOUNT;
            this.TOTAL_AMOUNT = response.EP_TOTAL_AMOUNT_PAID;
            //this.showResult = true;
            this.showPenafian = false;
          }

      }).catch(error=>{
        loader.dismiss();
        alert(JSON.stringify(error));
      })

     }, (err) => {
         loader.dismiss();
         this.showPenafian = true;
         //this.showResult = false;
     });
  }

}



/*

  <strong>Jenis Sijil / Certificate Type</strong><br>
            {{CERT_TYPE}}
          </ion-item>
          <ion-item text-wrap>
            <strong>No Adjudikasi</strong><br>
            {{ADJUCT_NO}}
          </ion-item>
          <ion-item text-wrap>
            <strong>Tarikh Suratcara / Date of Instrument</strong><br>
            {{DATE_INSTRUMENT}}
          </ion-item>
          <ion-item text-wrap>
            <strong>Butiran Suratcara / Instrument Description</strong><br>
            {{DESC_INSTRUMENT}}
          </ion-item>
          <ion-item text-wrap>
            <strong>Balasan / Consideration</strong><br>
            {{CONSIDERATION}}
          </ion-item>
          <ion-item text-wrap>
            <strong>Pihak Pertama / First Party</strong><br>
            {{FIRST_PARTY}}
          </ion-item>
          <ion-item text-wrap>
            <strong>Pihak Kedua / Second Party</strong><br>
            {{SECOND_PARTY}}
          </ion-item>
          <ion-item text-wrap>
            <strong>No. Sijil/Resit / Certificate/Receipt No.</strong><br>
            {{CERT_NO}}
          </ion-item>
          <ion-item text-wrap>
            <strong>Tarikh Penyeteman / Date of Stamping</strong><br>
            {{DATE_STAMP}}
          </ion-item>
          <ion-item text-wrap>
            <strong>Duti Setem Dikenakan / Amount Stamp of Duty</strong><br>
            RM {{STAMP_AMOUNT}}
          </ion-item>
          <ion-item text-wrap>
            <strong>Penalti / Penalty</strong><br>
            RM {{PENALTY}}
          </ion-item>
          <ion-item text-wrap>
            <strong>Jumlah Dibayar / Total Amount Paid</strong><br>
            RM {{TOTAL_AMOUNT}}
          </ion-item>
          <ion-item text-wrap>
            <strong>Indorsement / Indorsement</strong><br>
              {{INDORSEMENT}}
  
  
  */