import { LoginResponseDto } from './dto/login-response.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from "@nestjs/common";
import { catchError, firstValueFrom } from 'rxjs';
import {AxiosError} from "axios"
import { Deck } from 'src/decks/entities/deck.entity';
import { User } from 'src/user/entities/user.entity';
import { ConstraintMetadata } from 'class-validator/types/metadata/ConstraintMetadata';

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
            console.log(error);
            throw 'An error happened!';
          }),
      )
    )

    return data
  }

  async getDecksByUsername(archidektUsername: string, page: number) {
    const {data} = await firstValueFrom(
      this.http.get(process.env.ARCHIDEKT_BASE_URL + `decks/?page=${page}&owner=${archidektUsername}&ownerexact=true`)
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
    const decks = user.archidekt_decks;
    let decksDTO: any;

    do {
      decksDTO = await this.getDecksByUsername(user.archidektUsername, page);
      page++;
      decksDTO.results.map(deckDTO => {
        deckDTO.archidektId = deckDTO.id
        delete deckDTO.id
      });
      decksDTO.results.map(deck => {
        if(decks.some(deck2 => deck2.archidektId.toString() === deck.archidektId.toString())) {
          const deckToUpdate = decks.find(registeredDeck => deck.archidektId.toString() === registeredDeck.archidektId.toString())
          deckToUpdate.name = deck.name
          deckToUpdate.featured = deck.featured
        } else {
          const newDeck = Deck.create<Deck>(deck as Deck)
          decks.push(newDeck)

        }
      })
    } while(decksDTO.next !== null);


    this.fetchDeckName(decks, user)

    user.archidekt_decks = decks;
    return user.save();
  }

  async fetchDeckName(decks: Deck[], user: User) {
    await Promise.all(decks.map(async deck => {
      const {data} = await firstValueFrom(
        this.http.get(process.env.ARCHIDEKT_BASE_URL + "decks/" + deck.archidektId + "/")
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error.response.data);
            throw 'An error happened!';
        }))
      )

      const commanders = data.cards.filter(card => {
        return card.categories.includes("Commander")
      })


      const commanderName: Array<any> = commanders.map(commander => commander.card.oracleCard.name)
      if(commanderName.length > 1) {
        deck.commander = commanderName.join(" and ")
      } else {
        deck.commander = commanderName[0]
      }

      await deck.save()
    }))

    user.archidekt_decks = decks;
    user.save()
  }

  /* async refreshToken(archidektRefresh: string, archidektAccess: string) {
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
  } */
}