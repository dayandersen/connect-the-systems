import {$} from "bun"
import { SignatureKind } from "typescript"

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
  
  constructor(input: Shape, output: Shape, targets?: Node[]) {
    this.targets = targets ? targets : []
    this.input = input
    this.output = output
  }

  next(...nextNode: Node[]) {
    this.targets.push(...nextNode)
  }

  abstract execute(): Promise<string>
}

class BaseNode extends Node {
  override async execute(): Promise<string> {
    const combinedContext: Promise<string>[] = []
    this.targets.forEach(async (n: Node) => {
      combinedContext.push(n.execute())
    })
    const r = await Promise.allSettled(combinedContext).then(resultList => {
      const concat: string[] = []
      resultList.forEach( result => {
        concat.push(JSON.stringify(result))
      })
      return concat.join(",")
    })
    return r
  }
  constructor() {
    super(
      {
      schema: "",
      name: ""
      },
      {
        schema: "",
        name: ""
      },)
  }
  
}

class DockerWorker extends Node {
  scriptName: String
  lang: Language
  commmand: String

  constructor(lang: Language, scriptName: String, command: String | null | undefined = undefined) {
    super(
      {
      schema: "",
      name: ""
      },
      {
        schema: "",
        name: ""
      },
      [],
    )
    this.commmand = command == null ? "" : command
    this.lang = lang
    this.scriptName = scriptName
  }

  // TOOD: Need to fix the fact that the system doesn't know if it needs to rebuild or not when executed as part of a tree
  override async execute(shouldRebuild: Boolean = false): Promise<string> {
    const land = `${this.lang}_land`
    if (shouldRebuild) {
        await $`docker build -t "name:${land}" ./${land}` 
    }

    return await $`docker run name:${land} ${this.scriptName} ${this.commmand}`.text()
  }
}

const pyWorker: DockerWorker = new DockerWorker(
  Language.Python,
  "main.py", 
)

const tsWorker: DockerWorker = new DockerWorker(
  Language.Typescript,
  "main.ts",
)

const baseNode = new BaseNode()
baseNode.next(pyWorker, tsWorker)
console.log(await baseNode.execute())