import jwt from 'jsonwebtoken'
import { config } from '@keystone-6/core'
// import { fixPrismaPath } from '../example-utils'
// import { lists } from './schema'
import type { Context } from '.keystone/types'
import type { Session } from './schema'

const jwtSessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --'

type OurJWTClaims = {
  id: string
}

export async function jwtSign (claims: OurJWTClaims) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      claims,
      jwtSessionSecret,
      {
        algorithm: 'HS256', // HMAC-SHA256
      },
      (err, token) => {
        if (err) return reject(err)
        return resolve(token)
      }
    )
  })
}

async function jwtVerify (token: string): Promise<OurJWTClaims | null> {
  return new Promise(resolve => {
    jwt.verify(
      token,
      jwtSessionSecret,
      {
        algorithms: ['HS256'],
        maxAge: '1h', // we use an expiry of 1 hour for this example
      },
      (err, result) => {
        if (err || typeof result !== 'object') return resolve(null)
        if (typeof result.id !== 'string') return resolve(null)
        return resolve(result as OurJWTClaims)
      }
    )
  })
}

export const jwtSessionStrategy = {
  async get ({ context }: { context: Context }): Promise<Session | undefined> {
    if (!context.req) return

    const { cookie = '' } = context.req.headers
    const [cookieName, jwt] = cookie.split('=')
    if (cookieName !== 'user') return;
    if(jwt !== 'admin') return;

    const jwtResult = await jwtVerify(jwt)
    if (!jwtResult) return

    const { id } = jwtResult
    const who = await context.sudo().db.User.findOne({ where: { id } })
    if (!who) return
    return {
      id,
      admin: true,
    }
  },

  // we don't need these unless we want to support the functions
  //   context.sessionStrategy.start
  //   context.sessionStrategy.end
  //
  async start () {},
  async end () {},
}