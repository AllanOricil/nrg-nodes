/* eslint-disable no-unused-vars */

/**
 * Represents a base class for Node-RED nodes.
 * This class provides common functionality for Node-RED nodes, including initialization
 * and default event handler methods. It is intended to be extended by other classes
 * to create specific node types.
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
   * Creates an instance of the Node class.
   * Initializes the node with the provided configuration and registers it with Node-RED.
   *
   * @param {object} config - The configuration object for the Node-RED node instance.
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Initializes the node class with the Node-RED runtime.
   *
   * This method is called once when the node class is first loaded by Node-RED.
   * It can be used to perform any one-time setup required for the node, such as
   * registering custom HTTP routes, initializing static properties, or setting
   * up other runtime-specific configurations.
   *
   * @static
   * @param {object} RED - The Node-RED runtime object. Provides access to various
   * Node-RED services, such as logging, HTTP routes, and node registration.
   */
  static init(RED) {
    console.warn("init not implemented for this node");
  }

  /**
   * Defines the credentials schema for this Node-RED node.
   *
   * This method returns an object specifying the credentials required for configuring
   * the node in the Node-RED editor. The object returned by this method is used as the
   * `credentials` argument when registering the node type with `RED.nodes.registerType`.
   *
   * Each entry in the returned object represents a field that the user needs to provide
   * when setting up the node. Each field configuration is an object that must include
   * the `type` and `required` properties:
   *
   * - `type`: Specifies the type of the input field (e.g., `'text'`, `'password'`).
   * - `required`: Indicates whether the field is required (`true` or `false`).
   *
   * The structure of the returned object should look like this:
   *
   * ```javascript
   * {
   *   fieldName: { type: 'fieldType', required: true }
   * }
   * ```
   *
   * @static
   * @returns {Object} An object representing the credentials schema for the node.
   * @property {Object} [fieldName] - Configuration for the credentials field.
   * @property {string} [fieldName.type] - The type of input field.
   * @property {boolean} [fieldName.required] - Whether the field is required.
   *
   * @example
   * // Register the node type with Node-RED
   * RED.nodes.registerType('example-node', ExampleNode, {
   *   credentials: ExampleNode.credentials()
   * });
   */
  static credentials() {
    console.warn("credentials() not implemented in this node.");
  }

  /**
   * Handles input events for the node.
   * This method should be overridden in derived classes to implement custom behavior.
   *
   * @param {object} msg - The message object containing data to be processed.
   * @param {Function} send - Function to send a message or array of messages to other nodes.
   * @param {Function} done - Function to signal completion of processing.
   * @throws {Error} When called without being overridden, logs a warning indicating it is not implemented.
   */
  onInput(msg, send, done) {
    console.warn("onInput() not implemented in this node.");
  }

  /**
   * Handles close events for the node.
   * This method should be overridden in derived classes to implement custom behavior.
   *
   * @param {Function} done - Function to signal completion of close operations.
   * @throws {Error} When called without being overridden, logs a warning indicating it is not implemented.
   */
  onClose(done) {
    console.warn("onClose() not implemented in this node.");
  }

  /**
   * Handles ready events for the node.
   * This method should be overridden in derived classes to implement custom behavior.
   *
   * @param {object} context - The context object containing relevant data for the ready event.
   * @throws {Error} When called without being overridden, logs a warning indicating it is not implemented.
   */
  onReady(context) {
    console.warn("onReady() not implemented in this node.");
  }

  /**
   * Handles status events for the node.
   * This method should be overridden in derived classes to implement custom behavior.
   *
   * @param {string} status - The status message or code indicating the current state of the node.
   * @param {object} details - Additional details related to the status event.
   * @throws {Error} When called without being overridden, logs a warning indicating it is not implemented.
   */
  onStatus(status, details) {
    console.warn("onStatus() not implemented in this node.");
  }

  /**
   * Handles configuration events for the node.
   * This method should be overridden in derived classes to implement custom behavior.
   *
   * @param {object} config - The configuration object containing updated settings.
   * @param {Function} done - Function to signal completion of configuration processing.
   * @throws {Error} When called without being overridden, logs a warning indicating it is not implemented.
   */
  onConfig(config, done) {
    console.warn("onConfig() not implemented in this node.");
  }
}
