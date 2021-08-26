
export class TokenData{
    active!: boolean
    scope?: string[]
    client_id?: string
    token_type?: string
    exp?: number
    iat?: number
    nbf?: number
    sub?: string
}