# node-red-node

A very simple lib that aims to ease the creation of node-red nodes using ES6+ features.

> [!IMPORTANT]
> This lib does not provide or use typescript types for node-red objects or methods

## 📖 How to define a Node

```js
import { Node } from "@allanoricil/node-red-node";
import fetch from "node-fetch";

export default class MyCustomNodeClass extends Node {
  constructor(config) {
    super(config);
    this.log(`constructed type: ${this.type} id: ${this.id}`);
  }

  // Unlike the constructor, this executes only once, regardless of how many nodes of this type are in the flow.
  static init() {
    Node.RED.httpAdmin.get("/test", async function (req, res) {
      try {
        res.status(200).json({ message: "success" });
      } catch (err) {
        RED.log.error("ERROR:" + err.message);
        res.status(500).json({ message: "something unknown happened" });
      }
    });
  }

  // Implement this method if your node has credentials
  // These are passed to `RED.nodes.registerType("type", MyCustomNodeClass, { credentials })`
  static credentials() {
    return {
      username: { type: "text", required: true },
      password: { type: "password", required: true },
    };
  }

  // Considering this node's implementation is located at ./src/nodes/node-1/server/index.js, its type will be node-1.
  // Therefore, the "customSetting" shown below will be accessible as 'RED.settings.node1customSetting' in both client and server side.
  // Read this doc to understand more: https://nodered.org/docs/creating-nodes/node-js#custom-node-settings
  // It feels weird, but this is how Node-RED is currently doing. I hope that in the future settings are scoped by node's type using another nested property. For example `RED.settings.["node-1"].customSettings`
  static settings() {
    return {
      customSetting: {
        value: "default",
        exportable: true,
      },
    };
  }

  async onInput(msg, send, done) {
    try {
      this.log("node-1 on input", msg.payload);
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
      msg.payload = data;
      send(msg);
      done();
    } catch (error) {
      this.status({
        fill: "red",
        shape: "ring",
        text: "error",
      });
      this.error("Failed to fetch dog image:", error);
      done(error);
    } finally {
      setTimeout(() => {
        this.status({});
      }, 3000);
    }
  }

  onClose(removed, done) {
    if (removed) {
      this.log(`type: ${this.type} id: ${this.id} disabled/deleted`);
    } else {
      this.log(`type: ${this.type} id: ${this.id} restarted`);
    }
    done();
  }
}
```
