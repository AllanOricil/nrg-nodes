/* eslint-disable no-unused-vars */

/**
 * Represents a base class for Node-RED nodes.
 * This class provides common functionality for Node-RED nodes, including initialization
 * and default event handler methods. It is intended to be extended by other classes
 * to create specific node types.
 */
export default class Node {
  /**
   * The global Node-RED object.
   * Provides access to Node-RED runtime API.
   * @type {NodeRed.RED}
   * @static
   */
  static RED;
  /**
   * Creates an instance of the Node class.
   * Initializes the node with the provided configuration and registers it with Node-RED.
   *
   * @param {object} config - The configuration object for the node-red node instance.
   */
  constructor(config) {
    console.log(config);
    console.log("parent");

    this.constructor.RED.nodes.createNode(this, config);
  }

  /**
   * Handles input events for the node.
   * This method should be overridden in derived classes to implement custom behavior.
   *
   * @param {...any} args - The arguments for the input event.
   * @throws {Error} When called without being overridden, logs a warning indicating it is not implemented.
   */
  onInput(...args) {
    console.warn("onInput() not implemented in this node.");
  }

  /**
   * Handles close events for the node.
   * This method should be overridden in derived classes to implement custom behavior.
   *
   * @param {...any} args - The arguments for the close event.
   * @throws {Error} When called without being overridden, logs a warning indicating it is not implemented.
   */
  onClose(...args) {
    console.warn("onClose() not implemented in this node.");
  }

  /**
   * Handles ready events for the node.
   * This method should be overridden in derived classes to implement custom behavior.
   *
   * @param {...any} args - The arguments for the ready event.
   * @throws {Error} When called without being overridden, logs a warning indicating it is not implemented.
   */
  onReady(...args) {
    console.warn("onReady() not implemented in this node.");
  }

  /**
   * Handles status events for the node.
   * This method should be overridden in derived classes to implement custom behavior.
   *
   * @param {...any} args - The arguments for the status event.
   * @throws {Error} When called without being overridden, logs a warning indicating it is not implemented.
   */
  onStatus(...args) {
    console.warn("onStatus() not implemented in this node.");
  }

  /**
   * Handles configuration events for the node.
   * This method should be overridden in derived classes to implement custom behavior.
   *
   * @param {...any} args - The arguments for the configuration event.
   * @throws {Error} When called without being overridden, logs a warning indicating it is not implemented.
   */
  onConfig(...args) {
    console.warn("onConfig() not implemented in this node.");
  }
}
