import { identify } from './magick2.js'

describe('ImageMagick2', () => {

  describe('identify jpeg', () => {
    it('jpeg', async () => {
      const meta = await identify('sample/360x240.jpg')
      expect(meta.format).toBe('jpeg')
      expect(meta.width).toBe(360)
      expect(meta.height).toBe(240)
    })
  })

  describe('identify svg', () => {
    it('svg', async () => {
      const meta = await identify('sample/svg-sample.svg')
      expect(meta.format).toBe('svg')
      expect(meta.width).toBe(1000)
      expect(meta.height).toBe(1000)
    })
  })

  // heic 서포트를 넣으려고 시작했는데 heic 지원은 내 코드를 수정하는 것이 아니라
  // 서버의 ImageMagick heic 을 지원해야 하는 것으로 확인되었다.
  // 리눅스에서 heic 을 지원하려면 ImageMagick 을 커스텀 빌드해야 하는 것 같다.
  // 귀찮으니 다음에 하기로 한다;
  // Mac brew ImageMagick 에선 heic 처리가 그냥 된다.

  // describe('identify heic', () => {
  //   it('heic', async () => {
  //     const meta = await identify('sample/IMG_4395.HEIC')
  //     expect(meta.format).toBe('heic')
  //     expect(meta.width).toBe(4032)
  //     expect(meta.height).toBe(3024)
  //   })
  // })

  describe('identify none image', () => {
    it('if file not exist', async () => {
      await expectAsync(identify('xxx')).toBeRejected()
    })
    it('if file not image', async () => {
      await expectAsync(identify('README.md')).toBeRejected()
    })
  })
})
