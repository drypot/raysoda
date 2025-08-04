import { type User, userIsAdmin, userIsUser } from '../../../common/type/user.ts'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../common/type/error-const.ts'

export function assertLoggedIn(user: User) {
    if (!userIsUser(user)) throw NOT_AUTHENTICATED
}

export function assertAdmin(user: User) {
    if (!userIsAdmin(user)) throw NOT_AUTHORIZED
}

export function userCanUpdateUser(op: User, id: number) {
    return op.id === id || op.admin
}
