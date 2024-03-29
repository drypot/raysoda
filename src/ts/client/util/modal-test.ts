import { getElementById } from '@client/util/dom'
import { openBlueModal, openErrorModal, openRedModal } from '@client/util/modal'

export function initModalTest() {
  getElementById('blueModalBtn').onclick = () => {
    openBlueModal(
      'Hi',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      '확인',
      modalResult
    )
  }
  getElementById('redModalBtn').onclick = () => {
    openRedModal(
      'Warning',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      '삭제',
      modalResult
    )
  }
  getElementById('errModalBtn').onclick = () => {
    openErrorModal(
      {
        name: 'Error',
        message: "Error: ER_BAD_FIELD_ERROR: Unknown column 'cdate' in 'field list'\n" +
          '    at Query.Sequence._packetToError (/Users/drypot/project/raysoda/node_modules/mysql/lib/protocol/sequences/Sequence.js:47:14)\n' +
          '    at Query.ErrorPacket (/Users/drypot/project/raysoda/node_modules/mysql/lib/protocol/sequences/Query.js:79:18)\n' +
          '    at Protocol._parsePacket (/Users/drypot/project/raysoda/node_modules/mysql/lib/protocol/Protocol.js:291:23)\n' +
          '    at Parser._parsePacket (/Users/drypot/project/raysoda/node_modules/mysql/lib/protocol/Parser.js:433:10)\n' +
          '    at Parser.write (/Users/drypot/project/raysoda/node_modules/mysql/lib/protocol/Parser.js:43:10)\n' +
          '    at Protocol.write (/Users/drypot/project/raysoda/node_modules/mysql/lib/protocol/Protocol.js:38:16)\n' +
          '    at Socket.<anonymous> (/Users/drypot/project/raysoda/node_modules/mysql/lib/Connection.js:88:28)\n' +
          '    at Socket.<anonymous> (/Users/drypot/project/raysoda/node_modules/mysql/lib/Connection.js:526:10)\n' +
          '    at Socket.emit (node:events:394:28)\n' +
          '    at Socket.emit (node:domain:470:12)\n' +
          '    --------------------\n' +
          '    at Protocol._enqueue (/Users/drypot/project/raysoda/node_modules/mysql/lib/protocol/Protocol.js:144:48)\n' +
          '    at Connection.query (/Users/drypot/project/raysoda/node_modules/mysql/lib/Connection.js:198:25)\n' +
          '    at /Users/drypot/project/raysoda/src/server/ts/db/_db/db.ts:110:17\n',
        field: '_system'
      },
      modalResult
    )
  }

  function modalResult(result: any) {
    console.log(result)
  }
}

