# VS Code

## Tasks

Node, Jasmine 실행시키는 Task 설정 예.

`.vscode/tasks.json`

```json
{
  // See https://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Node current file",
      "type": "shell",
      "command": "node",
      "args": [
        "${relativeFile}"
      ],
      "presentation": {
        "reveal": "always",
        "panel": "shared"
      },
      "options": {
        "env": {
          "NODE_ENV": "development"
        }
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "Jasmine Current File",
      "type": "shell",
      "command": "node",
      "args": [
        "src/script/run-jasmine.ts",
        "${relativeFile}"
      ],
      "group": {
        "kind": "test",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "shared",
        "clear": true
      },
      "options": {
        "env": {
          "NODE_ENV": "development"
        }
      },
      "problemMatcher": ["$tsc"],
      "runOptions": {}
    }
  ]
}

```
