# connect-the-systems

The overarching goal of this project is to setup a system that can communicate easily and simply x-language.

Current status:
1. Users are able to implement and run simple .ts and .py files (don't think that x-file references will work atm)
2. Python files have a working requirements.txt for importing dependencies.
3. Users are able to chain a single layer via a base node and docker container worker nodes and execute them.
4. Users can generate files off of base schema files using quicktype and they'll be delivered as part of a pre-build process to each language's folder

Future work:
1. X-file references
2. Additional languages (I want Kotlin and Rust at min)
3. The schema validation base components
4. Ability to chain across multiple levels
5. Map reduce functionality (currently I can just expand, no idea of collecting results)
6. Move the graph concepts to JsonSchema so that graph construction can be x-language
7. Move to generate a JSON file of the graph execution and accept running either the JSON file or the language level implementation
8. Add in a durable WF engine such as temporal instead of my stdout and stdin with promises appraoch :)
9. TODO around knowing whether or not a code step has been built before so we only rebuild with docker if we need to.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
An example output from running index.ts (rn we return the full promises object)
```
{"status":"fulfilled","value":"hello world from python!\n"},{"status":"fulfilled","value":"Howdy pardner, from TS land\n"}
```

