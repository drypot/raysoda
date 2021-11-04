import { getElementById } from '@client/util/dom'
import { tagUp } from '@common/util/tagup'

export function initUserHome() {
  const profile = getElementById("profile") as HTMLElement
  profile.innerHTML = tagUp(profile.innerHTML)
}
