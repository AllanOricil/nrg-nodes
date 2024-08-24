# node-red-node

A very simple lib that aims to ease the creation of node-red nodes using ES6+.

> [!IMPORTANT]
> This lib does not provide or use typescript types for node-red objects or methods

## 📖 How to define a Node

```js
import { Node } from "@allanoricil/node-red-node";
import fetch from "node-fetch";

export default class MyCustomNodeClass extends Node {
  constructor(config) {
    super(config);
  }

  static init(RED) {
    console.log("This is going to be called only once, during registration");
    RED.httpAdmin.get("/test", async function (req, res) {
      try {
        res.status(200).json({ message: "success" });
      } catch (err) {
        RED.log.error("ERROR:" + err.message);
        res.status(500).json({ message: "something unknown happened" });
      }
    });
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
