import { Issuer,custom } from 'openid-client';
import config from '../../config/config';

custom.setHttpOptionsDefaults({
  followRedirect: false,
  headers: { 'User-Agent': 'koaval-curl' },
  timeout: 5000,
  retry: 3,
  throwHttpErrors: false,
});

let oidcClient: any = null;

export const initOidc = async () => {
  if (oidcClient === null) {
    const issuer = await Issuer.discover(config.oidc.issuer);
    oidcClient = new issuer.Client({
      client_id: config.oidc.client_id,
    });
  }
};

export const oidcVerify = async (token: string) => {
  await initOidc();
  if (!oidcClient) {
    throw new Error('initOidc fail');
  }
  return await oidcClient.userinfo(token);
};
