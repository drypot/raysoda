import { getImageMetaOfFile } from './magick2.ts'

describe('getImageMetaOfFile', () => {

  it('jpeg', async () => {
    const meta = await getImageMetaOfFile('sample/360x240.jpg')
    expect(meta.format).toBe('jpeg')
    expect(meta.width).toBe(360)
    expect(meta.height).toBe(240)
  })

  it('svg', async () => {
    const meta = await getImageMetaOfFile('sample/svg-sample.svg')
    expect(meta.format).toBe('svg')
    expect(meta.width).toBe(1000)
    expect(meta.height).toBe(1000)
  })

  // heic 서포트를 넣으려고 시작했는데 heic 지원은 내 코드를 수정하는 것이 아니라
  // 서버의 ImageMagick heic 을 지원해야 하는 것으로 확인되었다.
  // 리눅스에서 heic 을 지원하려면 ImageMagick 을 커스텀 빌드해야 하는 것 같다.
  // 귀찮으니 다음에 하기로 한다;
  // Mac brew ImageMagick 에선 heic 처리가 그냥 된다.

  // 2025-08-10 ImageMagick 대신 sharp 를 쓰면서 테스트를 다시 사용해본다.

  describe('identify heic', () => {
    it('heic', async () => {
      const meta = await getImageMetaOfFile('sample/IMG_4395.HEIC')
      expect(meta.format).toBe('heif') // heic 대신 heif 가 돌아온다.
      expect(meta.width).toBe(4032)
      expect(meta.height).toBe(3024)
    })
  })

  it('if file not exist', async () => {
    const meta = await getImageMetaOfFile('xxx')
    expect(meta.format).toBeUndefined()
    expect(meta.width).toBe(0)
    expect(meta.height).toBe(0)
  })

  it('if file not image', async () => {
    const meta = await getImageMetaOfFile('sample/text1.txt')
    expect(meta.format).toBeUndefined()
    expect(meta.width).toBe(0)
    expect(meta.height).toBe(0)
  })

})
