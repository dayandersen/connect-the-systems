import { Base, Convert } from "./typescript_land/generated-src/base"
import {$} from "bun"

// We're building a graph
// System will have input model 
// System will have output model
// System will have next steps
// We will explore the shape and assert that inputs match to previous step outputs
// 
enum Language {
  Python = "python",
  Typescript = "typescript"
}

interface Shape {
  schema: String
  name: String
}

abstract class Node {
  readonly targets: Node[]
  input: Shape
  output: Shape
  
  constructor(targets: Node[], input: Shape, output: Shape) {
    this.targets = targets
    this.input = input
    this.output = output
  }
}

class CustomWorker extends Node {
  scriptName: String
  lang: Language
  commmand: String

  constructor(command: String | null | undefined = undefined, lang: Language, scriptName: String) {
    super(
      [],
      {
      schema: "",
      name: ""
      },
      {
        schema: "",
        name: ""
      }
    )
    this.commmand = command == null ? "" : command
    this.lang = lang
    this.scriptName = scriptName
  }

  async execute(shouldRebuild: Boolean = false): Promise<string> {
    const land = `${this.lang}_land`
    if (shouldRebuild) {
        await $`docker build -t "name:${land}" ./${land}` 
    }

    return await $`docker run name:${land} ${this.scriptName} ${this.commmand}`.text()
  }
}

const baseSchema: Base = {
  schema: "",
  id: "",
  title: "",
  description: "",
  type: "",
  definitions: {
    uuid: {
      type: "",
      pattern: "",
      description: ""
    },
    timestamp: {
      type: "",
      format: "",
      description: ""
    },
    email: {
      type: "",
      format: "",
      description: ""
    },
    url: {
      type: "",
      format: "",
      description: ""
    }
  },
  properties: {
    id: {
      ref: "",
      description: ""
    },
    createdAt: {
      ref: "",
      description: ""
    }
  },
  required: [],
  additionalProperties: false
}

const pyWorker: CustomWorker = new CustomWorker(
  null,
  Language.Python,
  "main.py", 
)

console.log(await pyWorker.execute())