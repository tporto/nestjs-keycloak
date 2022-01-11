import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as queryString from 'querystring';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export class KeycloakToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  refreshExpiresIn: string;

  constructor(
    accessToken: string,
    refreshToken: string,
    expiresIn: string,
    refreshExpiresIn: string,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
    this.refreshExpiresIn = refreshExpiresIn;
  }
}

@Injectable()
export class AuthService {
  private keycloakLoginUri: string;
  private keycloakResponseType: string;
  private keycloakScope: string;
  private keycloakRedirectUri: string;
  private keycloakClientId: string;
  private keycloakClientSecret: string;
  private keycloakTokenUri: string;
  private keycloakLogoutUri: string;
  private keycloakUri: string;
  private keycloakRealm: string;

  constructor(
    readonly _config: ConfigService,
    private readonly _http: HttpService,
  ) {
    this.keycloakLoginUri = _config.get('KEYCLOAK_LOGIN_URI');
    this.keycloakResponseType = _config.get('KEYCLOAK_RESPONSE_TYPE');
    this.keycloakScope = _config.get('KEYCLOAK_SCOPE');
    this.keycloakRedirectUri = _config.get('KEYCLOAK_REDIRECT_URI');
    this.keycloakClientId = _config.get('KEYCLOAK_CLIENT_ID');
    this.keycloakClientSecret = _config.get('KEYCLOAK_CLIENT_SECRET');
    this.keycloakTokenUri = this._config.get('KEYCLOAK_TOKEN_URI');
    this.keycloakLogoutUri = this._config.get('KEYCLOAK_LOGOUT_URI');

    this.keycloakUri = this._config.get('KEYCLOAK_AUTH_URI');
    this.keycloakRealm = this._config.get('KEYCLOAK_REALM');
  }

  /**
   * FRONTEND
   */
  getUrlLogin(): any {
    return {
      url:
        `${this.keycloakLoginUri}` +
        `?client_id=${this.keycloakClientId}` +
        `&response_type=${this.keycloakResponseType}` +
        `&scope=profile email` +
        `&redirect_uri=${this.keycloakRedirectUri}`,
    };
  }

  /**
   * FRONTEND
   */
  async getAccessToken(code: string) {
    console.log(code);

    const params = {
      grant_type: 'authorization_code',
      client_id: this.keycloakClientId,
      client_secret: this.keycloakClientSecret,
      code: code,
      redirect_uri: this.keycloakRedirectUri,
    };

    const response: AxiosResponse = await this._http
      .post(
        this.keycloakTokenUri,
        queryString.stringify(params),
        this.getContentType(),
      )
      .toPromise();

    console.log(response?.data);

    return response?.data;
  }

  /**
   * FRONTEND
   */
  async refreshAccessToken(refresh_token: string) {
    const params = {
      grant_type: 'refresh_token',
      client_id: this.keycloakClientId,
      client_secret: this.keycloakClientSecret,
      refresh_token: refresh_token,
      redirect_uri: this.keycloakRedirectUri,
    };

    const response: AxiosResponse = await this._http
      .post(
        this.keycloakTokenUri,
        queryString.stringify(params),
        this.getContentType(),
      )
      .toPromise();

    console.log(response?.data);

    return response?.data;
  }

  async logout(refresh_token: string) {
    const params = {
      client_id: this.keycloakClientId,
      client_secret: this.keycloakClientSecret,
      refresh_token: refresh_token,
    };

    const response: AxiosResponse = await this._http
      .post(
        this.keycloakLogoutUri,
        queryString.stringify(params),
        this.getContentType(),
      )
      .toPromise();

    console.log(response?.data);

    return response?.data;
  }

  getContentType() {
    return { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
  }

  /**
   * BACKEND
   */
  async getMe(token: string) {
    const url = `${this.keycloakUri}/realms/${this.keycloakRealm}/protocol/openid-connect/userinfo`;

    const options: AxiosRequestConfig = {
      headers: {
        Authorization: token,
      },
    };

    const response: AxiosResponse = await this._http
      .get(url, options)
      .toPromise();

    console.log(response?.data);

    return response?.data;
  }

  /**
   * BACKEND
   */
  async create(token: string, user: any) {
    const url = `${this.keycloakUri}/admin/realms/${this.keycloakRealm}/users`;

    const options: AxiosRequestConfig = {
      headers: {
        Authorization: token,
        'Content-type': 'application/json',
      },
    };

    try {
      const response: AxiosResponse = await this._http
        .post(url, JSON.stringify(user), options)
        .toPromise();

      console.log(response?.data);

      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
}
