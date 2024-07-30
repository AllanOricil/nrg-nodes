# node-red-node

A very simple lib that aims to ease the creation of node-red nodes using ES6+

> [!IMPORTANT]
> This lib does not provide or use typescript types for node-red objects or methods

## 📁 Directory Structure

```bash
./my-custom-nodes
├── assets/
│   ├── icons/
│   │   └── icon.png
│   └── locales/
│       ├── de/
│       │   ├── index.hmtl
│       │   └── index.json
│       └── en-US/
│           ├── index.html
│           └── index.json
├── dist/
│   ├── icons/
│   │   └── icon.png
│   ├── locales/
│   │   ├── de/
│   │   │   ├── index.hmtl
│   │   │   └── index.json
│   │   └── en-US/
│   │       ├── index.html
│   │       └── index.json
│   ├── index.html
│   ├── index.js
│   └── index.js.map
├── src/
│   ├── nodes/
│   │   ├── my-custom-node/
│   │   │   ├── index.js
│   │   │   └── index.html
│   └── index.js
├── package.json
└── package-lock.json
```

## 📖 How to create a Node using a Class

1. Install this package as a dependency `npm install @allanoricil/node-red-node`
2. Create a Node by extending the `Node` class, as shown below

```js
import { Node } from "@allanoricil/node-red-node";
import fetch from "node-fetch";

export default class MyCustomNodeClass extends Node {
  constructor(config) {
    super(config);
  }

  async onInput(msg, send, done) {
    try {
      console.log("node-1 on input", msg.payload);
      this.status({
        fill: "blue",
        shape: "ring",
        text: "fetching data",
      });
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      this.status({
        fill: "green",
        shape: "dot",
        text: "success",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      send({ payload: data });

      done();
    } catch (error) {
      this.status({
        fill: "red",
        shape: "ring",
        text: "error",
      });
      console.error("Failed to fetch dog image:", error);
      done(error);
    } finally {
      setTimeout(() => {
        this.status({});
      }, 3000);
    }
  }
}
```

3. Finally, register `MyCustomNodeClass` in your entrypoint using `registerNodes` function

```js
import { registerNodes } from "@allanoricil/node-red-node";
import { MyCustomNodeClass } from "@nodes";

export default function (RED) {
  registerNodes(RED, [MyCustomNodeClass]);
}
```

> [!IMPORTANT]
> the word `@nodes` is a path shorthand that must be configured in a `jsconfig.json` or `tsconfig.json` file in the root of your project. In the above example, it was configured as
>
> ```json
> {
>   "paths": {
>     "@nodes": ["./src/nodes"]
>   }
> }
> ```
