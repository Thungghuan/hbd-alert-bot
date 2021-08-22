import { SocksProxyAgent } from 'socks-proxy-agent'
import config from '../config'

const { host, port } = config.socksProxy

export const agent = new SocksProxyAgent({
  host,
  port
})
