import { AxiosError } from './../../node_modules/@nestjs/axios/node_modules/axios/index.d';
import { LoginResponseDto } from './dto/login-response.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from "@nestjs/common";
import { catchError, firstValueFrom } from 'rxjs';
import { arch } from 'os';

@Injectable()
export class ArchidektService {
  constructor(
    private readonly http: HttpService
  ) { }

  async login(email: String, password: String) {
    const { data } = await firstValueFrom(
      this.http.post<LoginResponseDto>(process.env.ARCHIDEKT_BASE_URL + "rest-auth/login/",
      {
        email: email,
        password: password
        }).pipe(
          catchError((error: AxiosError) => {
            console.log(error.response.data);
            throw 'An error happened!';
          }),
      )
    )

    return data
  }

  async getDecksByUserId(archidektId: number, accessToken: string, page: number) {
    const headersRequest = {
      'Authorization': `JWT ${accessToken}`,
  };

    const { data } = await firstValueFrom(
      this.http.get(process.env.ARCHIDEKT_BASE_URL + `decks/?page=${page}&userid=${archidektId}`,
        { headers: headersRequest })
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error.response.data);
            throw 'An error happened!';
          }),
      )
    )

    return data;
  }

  async refreshToken(archidektRefresh: string, archidektAccess: string) {
    const headersRequest = {
      'Authorization': `JWT ${archidektAccess}`,
    };

    const { data } = await firstValueFrom(
      this.http.post(process.env.ARCHIDEKT_BASE_URL + "refresh",
        {
          refresh: archidektRefresh
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error.response.data);
            throw 'An error happened!';
        }))
    )

    return data.access_token
  }
}