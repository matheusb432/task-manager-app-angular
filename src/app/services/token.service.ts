import { Inject, Injectable, InjectionToken } from '@angular/core';
import { DecodedAuthToken } from '../models/types';

export type TokenDecoderFn = <TResult = unknown, TOptions = unknown>(
  token: string,
  options?: TOptions
) => TResult;

export const TOKEN_DECODER_FN = new InjectionToken<TokenDecoderFn>('TOKEN_DECODER_FN');

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(@Inject(TOKEN_DECODER_FN) private decoderFn: TokenDecoderFn) {}

  decode(token: string): DecodedAuthToken | null | never {
      return token != null ? this.decoderFn(token) : null;
  }
}
