import { User, userIsAdmin, userIsUser } from '@common/type/user'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '@common/type/error-const'

export function userAssertLogin(user: User) {
    if (!userIsUser(user)) throw NOT_AUTHENTICATED
}

export function userAssertAdmin(user: User) {
    if (!userIsAdmin(user)) throw NOT_AUTHORIZED
}

export function userCanUpdateUser(op: User, id: number) {
    return op.id === id || op.admin
}
