/* eslint-disable no-unused-vars */

/**
 * Represents a base class for Node-RED nodes.
 * This class provides common functionality for Node-RED nodes, including initialization
 * and default event handler methods. It is intended to be extended by other classes
 * to create specific node types.
 *
 * Classes that extend this base class should implement their own specific logic
 * by overriding methods such as `onInput` and `onClose`. Additionally, static methods
 * like `init`, `credentials`, and `settings` can be customized to define per-node
 * behavior.
 *
 * @example
 * class MyCustomNode extends Node {
 *   constructor(config) {
 *     super(config);
 *     // Custom initialization
 *   }
 *
 *   onInput(msg, send, done) {
 *     // Handle input messages
 *   }
 *
 *   static credentials() {
 *     return {
 *       username: { type: 'text', required: true },
 *       password: { type: 'password', required: true }
 *     };
 *   }
 *
 *   static settings() {
 *     return {
 *       mySetting: { value: 'defaultValue', exportable: true }
 *     };
 *   }
 * }
 */
export default class Node {
  /**
   * The Node-RED runtime object. This static property is used to provide access
   * to Node-RED services such as logging, HTTP routes, and node registration.
   *
   * @static
   * @type {object}
   * @memberof Node
   */
  static RED;

  /**
   * The type of this Node-RED node.
   *
   * @static
   * @type {string}
   * @memberof Node
   */
  static type;

  /**
   * The unique identifier for this Node-RED node instance.
   *
   * @type {string}
   * @memberof Node
   */
  id;

  /**
   * The credentials stored in this Node-RED node instance.
   *
   * It is initialized by the parent class.
   *
   * @type {object}
   * @memberof Node
   */
  credentials;

  // NOTE: a hack to bypass "Node object is not a node-red Node log_helper (@node-red/runtime/lib/nodes/Node.js:526:20)"
  /**
   * Internal flow reference used for managing the node's lifecycle in Node-RED.
   * This property is private and should not be accessed directly.
   *
   * @private
   * @type {object}
   * @memberof Node
   */
  _flow;

  /**
   * Creates an instance of the Node class.
   * Initializes the node with the provided configuration and registers it with Node-RED.
   *
   * @param {object} config - The configuration object for the Node-RED node instance.
   * @param {string} config.id - The unique identifier for this node instance.
   * @param {object} config._flow - Internal flow reference for managing node deployment.
   * @memberof Node
   */
  constructor(config) {
    Node.RED.nodes.createNode(this, config);
    this.config = config;
    this.id = config.id;
    this._flow = config._flow;
  }

  /**
   * This method is called once when the node class is first loaded by Node-RED.
   * It can be used to perform any one-time setup required for the node, such as
   * registering custom HTTP routes, initializing static properties, or setting
   * up other runtime-specific configurations.
   * By default, this method logs a message indicating it has not been implemented.
   *
   * @static
   */
  static init() {
    Node.RED.log.debug(`${this.type} does not implement init`);
  }

  /**
   * Returns an object representing the settings configuration for the node.
   * This method should be overridden in subclasses to provide the specific settings
   * for each node type. If not implemented, it logs a message indicating it has not
   * been implemented.
   *
   * @see https://nodered.org/docs/creating-nodes/credentials
   *
   * @static
   * @returns {Object} An object representing the settings configuration for the node.
   *
   * @example
   * export default class Node1 extends Node {
   *
   *    construct(config) {
   *        super(config);
   *    }
   *
   *    static credentials() {
   *        return {
   *            username: { type: "text" },
   *            password: { type: "password" },
   *        };
   *    }
   * }
   */
  static credentials() {
    Node.RED.log.debug(`${this.type} does not implement credentials`);
  }

  /**
   * Returns an object representing the settings configuration for the node.
   * This method should be overridden in subclasses to provide the specific settings
   * for each node type. If not implemented, a warn message will be logged to the console.
   *
   * The returned object is used in the `settings` property of `RED.nodes.registerType`
   * to define custom settings for the node. These settings can be used to configure
   * various aspects of the node in both the Node-RED editor and runtime.
   *
   * @see https://nodered.org/docs/creating-nodes/node-js#custom-node-settings
   *
   * @static
   * @returns {Object} An object representing the settings configuration for the node.
   *
   * @example
   * // Example of an implementation in a subclass, for a node type called my-node.
   * // The "exampleSetting" attribute shown below will be accessible in the editor, and server, as `RED.settings.myNodeexampleSetting`.
   * // The node's type is automatically appended to each attribute of the object returned by `static settings()` in camelCase, as required by Node-RED.
   * // Remember that the name of the class does not define its type. The type is defined based on the name of the folder in ./src/nodes/node-1
   * export default class Node1 extends Node {
   *
   *    construct(config) {
   *        super(config);
   *    }
   *
   *    static settings() {
   *        return {
   *            exampleSetting: {
   *                value: "default",
   *                exportable: true
   *            }
   *        };
   *    }
   * }
   */
  static settings() {
    Node.RED.log.debug(`${this.type} does not implement settings`);
  }

  /**
   * Handles input events for the node.
   * This method should be overridden in derived classes to implement custom behavior.
   *
   * @abstract
   * @overload onInput(): void
   * @overload onInput(msg: object): void
   * @overload onInput(msg: object, send: Function): void
   * @overload onInput(msg: object, send: Function, done: Function): void
   *
   * @param {object} msg - The message object containing data to be processed.
   * @param {Function} send - Function to send a message or array of messages to other nodes.
   * @param {Function} done - Function to signal completion of processing.
   *
   * @example
   * class MyCustomNode extends Node {
   *   onInput(msg, send, done) {
   *     // Perform operations on the message object
   *     const result = processMessage(msg);
   *     send(result);
   *     done();
   *   }
   * }
   */
  onInput(msg, send, done) {}

  /**
   * Called whenever a node is removed.
   * This method should be overridden in derived classes to implement custom behavior.
   *
   * @abstract
   * @overload onClose(): void
   * @overload onClose(done: Function): void
   * @overload onClose(removed: boolean, done: Function): void
   *
   * @param {boolean} [removed] - Indicates if the node was removed from the flow (true) or redeployed (false).
   * @param {Function} [done] - A callback function that should be called when the close operation is complete.
   *
   * @example
   * class MyCustomNode extends Node {
   *   onClose(removed, done) {
   *     if (removed) {
   *       // Node has been removed, clean up resources
   *     }
   *     done();
   *   }
   * }
   */
  onClose(removed, done) {}

  /**
   * @typedef {object} NodeContext
   * @property {function(string, any):void} set - Sets a value in the node context.
   * @property {function(string):any} get - Retrieves a value from the node context.
   */

  /**
   * Get the flow context.
   * The flow context is shared among all nodes in the same flow and is used to store
   * data that needs to be accessible by all nodes within the same flow.
   *
   * @type {NodeContext}
   */
  get flowContext() {
    return this.context().flow;
  }

  /**
   * Get the global context.
   * The global context is shared among all nodes across all flows and is used to store
   * data that needs to be accessible by all nodes in the entire Node-RED instance.
   *
   * @type {NodeContext}
   */
  get globalContext() {
    return this.context().global;
  }

  /**
   * Evaluates a Node-RED node property asynchronously.
   *
   * @async
   * @param {*} value - The value to be evaluated. This can be a literal, environment variable, or flow property.
   * @param {string} type - The type of the property (e.g., "str", "num", "flow", "global").
   * @param {Object} msg - The message object passed through the Node-RED flow.
   * @returns {Promise<*>} A promise that resolves with the evaluated result or rejects with an error.
   * @throws {Error} If an error occurs during the evaluation process.
   */
  async evaluateProperty(value, type, msg) {
    return new Promise((resolve, reject) => {
      Node.RED.util.evaluateNodeProperty(
        value,
        type,
        this,
        msg,
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );
    });
  }
}
