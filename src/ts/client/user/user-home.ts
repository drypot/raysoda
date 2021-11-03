import { getElementById } from '@client/util/dom'
import { tagUp } from '@common/util/tagup'

export function initUserHome() {
  const profile = getElementById("profile")
  profile.innerHTML = tagUp(profile.innerHTML)
}
