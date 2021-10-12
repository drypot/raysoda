import { User, userIsAdmin, userIsUser } from '../../_type/user'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../_type/error-const'

export function shouldBeUser(user: User) {
    if (!userIsUser(user)) throw NOT_AUTHENTICATED
}

export function shouldBeAdmin(user: User) {
    if (!userIsAdmin(user)) throw NOT_AUTHORIZED
}

export function userCanUpdateUser(op: User, id: number) {
    return op.id === id || op.admin
}
