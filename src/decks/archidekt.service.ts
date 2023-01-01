import { LoginResponseDto } from './dto/login-response.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from "@nestjs/common";
import { catchError, firstValueFrom } from 'rxjs';
import {AxiosError} from "axios"
import { Deck } from 'src/decks/entities/deck.entity';
import { User } from 'src/user/entities/user.entity';

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
        },
        {
          'headers': {
            'Content-Type': 'application/json'
          }
        }).pipe(
          catchError((error: AxiosError) => {
            console.log(error.response);
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

  async fetchAndSaveAllDecks(user: User) {
    let page = 1;
    const decks = [] as Array<Deck>;
    let decksDTO: any;

    do {
      decksDTO = await this.getDecksByUserId(user.archidektId, user.archidektAccessToken, page);
      page++;
      decksDTO.results.map(deckDTO => {
        deckDTO.archidektId = deckDTO.id
        delete deckDTO.id
      });
      decks.push(...Deck.create<Deck>(decksDTO.results))
    } while(decksDTO.next !== null);

    user.archidekt_decks = decks;
    return user.save();
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