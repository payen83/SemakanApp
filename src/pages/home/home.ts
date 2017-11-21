import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, AlertController, Content } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SemakanProvider } from '../../providers/semakan/semakan';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Content) content: Content;

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
  public INSTRUMENT_TYPE: string;
  public STATUS: string;
  

  public TXTSALINAN: string;
  public showPenafian: boolean;
  public showError: boolean;
  public showResult: boolean;
  public TXTSTATUS: string;

  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private semakan: SemakanProvider, public barcodeScanner: BarcodeScanner, public navCtrl: NavController) {
    this.showPenafian = true;
    this.showError = false;
    this.showResult = false;
  }

  displayAlert(message){

    let alert = this.alertCtrl.create({
      title: message,
      buttons: ['OK']
    });

    alert.present();
  }

  buatSemakan(loader: any){
    this.ADJ_NO = '';
    this.semakan.loadSemakan(this.QRText).then(response => {
        loader.dismiss();

        if (response.status == false){
          this.showPenafian = false;
          this.showError = true; 
          this.showResult = !this.showError;
          if (response.msg == 'Rekod Tidak Wujud'){
            //this.displayAlert('Rekod tidak wujud. Sila hubungi Pejabat Setem Cawangan / Pusat Khidmat Hasil untuk pengesahan lanjut');
            this.TXTSTATUS = 'Rekod tidak wujud. Sila hubungi Pejabat Setem Cawangan / Pusat Khidmat Hasil untuk pengesahan lanjut';
          } else {
            //this.displayAlert(response.msg);
            this.TXTSTATUS = response.msg;
          } 
        } else if (response.EP_PRINT_STATUS == "3"){
          this.TXTSTATUS = 'Maaf, Sijil Dibatalkan';
          this.showPenafian = false;
          this.showError = true;
          this.showResult = !this.showError;
          //this.displayAlert('Maaf, Sijil Dibatalkan');
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
            this.TXTSALINAN = response.TXTSALINAN;
            this.STATUS = response.EP_PRINT_STATUS;
            this.INSTRUMENT_TYPE = response.EP_INSTRUMENT_TYPE1;
            this.showPenafian = false;
            this.showError = this.showPenafian;
            this.showResult = true;
          }

    }).catch(error=>{
      loader.dismiss();
      this.showError = true;
      this.showPenafian = false;
      this.showResult = this.showPenafian;
      this.TXTSTATUS = 'Semakan Tidak Berjaya';
      //this.displayAlert('Semakan Tidak Berjaya');
    })

    this.content.scrollToTop();
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

      this.buatSemakan(loader);

     }, (err) => {
         loader.dismiss();
         this.showPenafian = true;
         this.showError = false;
         this.showResult = this.showError;
     });
  } // END SCAN QR CODE



      testSemakan(){
        this.QRText = 'hash1=7RZd6MG9RK8EIA/YBozvFQ==&SIJIL_ID=S0300A170021601';
        
        let loader = this.loadingCtrl.create({
         spinner: 'circles',
         content: 'Sedang diproses..'
       })

       loader.present();

       this.semakan.loadSemakan(this.QRText).then(response => {
           loader.dismiss();

          if (response.status == false){
            this.showPenafian = true; 
            if (response.msg == 'Rekod Tidak Wujud'){
              this.displayAlert('Rekod tidak wujud. Sila hubungi Pejabat Setem Cawangan / Pusat Khidmat Hasil untuk pengesahan lanjut');
            } else {
              this.displayAlert(response.msg);
            }
          } else if (response.EP_PRINT_STATUS == "3"){
            this.showPenafian = true;
            this.displayAlert('Maaf, Sijil Dibatalkan');
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
              this.TXTSALINAN = response.TXTSALINAN;
              this.STATUS = response.EP_PRINT_STATUS;
              this.INSTRUMENT_TYPE = response.EP_INSTRUMENT_TYPE1;
              this.showPenafian = false;
            }

       }).catch(error=>{
         loader.dismiss();
         //alert(JSON.stringify(error));
         this.displayAlert('Semakan Tidak Berjaya');
       })
     } // END OF TEST SEMAKAN




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