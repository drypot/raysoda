import { tagUp } from "../../src/common/util/tagup.ts"
import { getElementById } from "../util/dom.ts"

export function initUserHome() {
  const profile = getElementById("profile")
  profile.innerHTML = tagUp(profile.innerHTML)
}
