import { Issuer } from 'openid-client';
import config from '../../config/config';

// const client = (async() => {
//   const issuer = await Issuer.discover(config.oidc.issuer);
//   return new issuer.Client({
//     client_id: config.oidc.client_id,
//   });
// })();

export const oidcVerify = async (token: string) => {
  const issuer = await Issuer.discover(config.oidc.issuer);
  const client = new issuer.Client({
    client_id: config.oidc.client_id,
  });
  return await client.userinfo(token);
};
