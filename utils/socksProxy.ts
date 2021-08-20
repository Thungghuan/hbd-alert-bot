import { SocksProxyAgent } from 'socks-proxy-agent'

export const agent = new SocksProxyAgent({
  host: '127.0.0.1',
  port: '1086'
})
