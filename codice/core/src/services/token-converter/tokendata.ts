
export class TokenData{
    active!: boolean
    scopes!: string[]
    client_id!: string
    token_type!: string
    exp!: number
    iat!: number
    nbf!: number
    sub!: string
}