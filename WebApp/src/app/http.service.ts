import {Injectable} from '@angular/core';
import {Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpService extends Http {


  constructor (backend: XHRBackend, options: RequestOptions) {
    if (!localStorage.user) {
      // code...
      super(backend, options);
    }
    else{
    let user = JSON.parse(localStorage.user); // your custom token getter function here
    let token = user['token'];
    // console.log("token", token);
    //let refreshtoken = localStorage.refresh_token;
    options.headers.set('x-access-token', `${token}`);
    //options.headers.set('refresh_token', `${refreshtoken}`);
    super(backend, options);
  }
}

request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {

   let user = JSON.parse(localStorage.user); // your custom token getter function here
   let token = user['token'];

   // console.log("request");
   // console.log("accesstoken",token);


    if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
      if (!options) {
        options = {headers: new Headers()};
      }
      options.headers.set('x-access-token', `${token}`);
      // console.log(options);
    } else {
      url.headers.set('x-access-token', `${token}`);
      // console.log(url);
      
    }
    return super.request(url, options).catch(this.catchAuthError(this));
  }

  private catchAuthError (self: HttpService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      console.log(res);
      if (res.status === 401 || res.status === 403) {
        // if not authenticated
        // console.log(res);
      }
      return Observable.throw(res);
    };
  }
}