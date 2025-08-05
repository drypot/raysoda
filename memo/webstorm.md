# WebStorm

## 준비

한글 언어팩 설치되어 있으면 제거한다.

    Settings -> Plguins

## Run Configuration

Jasmine 으로 편집중인 파일 테스트 돌리려면 Run Configuration 을 만들어야 한다.

    Run -> Edit Configurations...

아래 내용 참고해서 Node.js Config 항목을 하나 추가한다.

    Name: jasmine

    TypeScript Loader: None

    Node parameters: --loader ts-node/esm  <-- ts-node 사용하려면 써야하는데 node 22 부터는 필요없다.

    Working Directory: ~/project/raysoda

    File: src/script/run-jasmine.ts

    Application Param: $FilePathRelativeToProjectRoot$

    Env Vars: NODE_ENV=development

편집중인 자스민 ts 파일에서 위에 만든 Run Config 를 실행한다.

    Run -> Run 'jasmine'

