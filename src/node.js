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
}
