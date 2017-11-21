import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

/*
  Generated class for the SemakanProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SemakanProvider {

  baseURL: string = 'https://stamps.hasil.gov.my/stamps/ketulenan?search_type=2&';
  //baseURL: string = 'https://stampsdev.hasil.gov.my/stamps/ketulenan?search_type=2&';

  constructor(public http: Http) {
    //console.log('Hello SemakanProvider Provider');
  }

  loadSemakan(parameters: string): Promise<any>{
    
    return new Promise((resolve, reject) => {
      
        let headers = new Headers({ 
          'Content-Type': 'application/x-www-form-urlencoded'
        });

        let options = new RequestOptions({ headers: headers });

        let URL: string = this.baseURL + parameters;
          
        this.http.get(URL, options)
        .timeout(30000)
        .map(res => res.json())
        .subscribe(data => {
          let response: any = data;
            //alert(JSON.stringify(data));
          resolve(response);
        },(err)=>{ 
            reject(err)
        });
    })
  }

}
